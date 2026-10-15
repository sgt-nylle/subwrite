import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SUBMARINE_LEVELS, type SubmarineLevel, LEVEL_TIME_LIMITS, getPassages } from './data/submarineTexts';
import { Scoreboard, type FinalTrialResult } from './components/Scoreboard';
import { StartScreen } from './components/StartScreen';
import { sound } from './utils/audio';
import { detectDeviceType } from './utils/device';
import './App.css';

// Helper to allow tolerant matching for special characters, smart quotes, and dashes
const areCharsEquivalent = (typed?: string, expected?: string): boolean => {
  if (!typed || !expected) return false;
  if (typed === expected) return true;

  // Swedish special characters mapping if user types without local layout
  const isA = (c: string) => c === 'a' || c === 'A';
  const isO = (c: string) => c === 'o' || c === 'O';
  if ((expected === 'å' || expected === 'ä' || expected === 'Å' || expected === 'Ä') && isA(typed)) return true;
  if ((expected === 'ö' || expected === 'Ö') && isO(typed)) return true;

  // Single quotes, apostrophes, backticks, acute accents
  const isSingleQuote = (c: string) => c === "'" || c === '’' || c === '‘' || c === '`' || c === '´';
  if (isSingleQuote(typed) && isSingleQuote(expected)) return true;

  // Double quotes, smart double quotes, guillemets
  const isDoubleQuote = (c: string) => c === '"' || c === '“' || c === '”' || c === '«' || c === '»';
  if (isDoubleQuote(typed) && isDoubleQuote(expected)) return true;

  // Hyphens, en-dashes, em-dashes, minus signs
  const isDash = (c: string) => c === '-' || c === '—' || c === '–' || c === '−';
  if (isDash(typed) && isDash(expected)) return true;

  // Standard and non-breaking spaces
  const isSpace = (c: string) => c === ' ' || c === '\u00A0';
  if (isSpace(typed) && isSpace(expected)) return true;

  // Degree symbol tolerance
  if (expected === '°' && (typed === 'o' || typed === '*' || typed === '^' || typed === "'")) return true;

  return false;
};

// Helper to pick a random index from a passages list, avoiding the currently active index
const pickRandomPassageIndex = (total: number, excludeIdx: number = -1): number => {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  if (next === excludeIdx) {
    next = (next + 1 + Math.floor(Math.random() * (total - 1))) % total;
  }
  return next;
};

export function App() {
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [level, setLevel] = useState<number>(1);
  const [language, setLanguage] = useState<'en' | 'sv'>(() => {
    try {
      const saved = localStorage.getItem('subwrite_language');
      if (saved === 'en' || saved === 'sv') return saved;
    } catch {
      // Ignore
    }
    return 'en';
  });
  const currentPassageIndexRef = useRef<number>(-1);
  const [, setPassageIndex] = useState<number>(-1);
  const [targetText, setTargetText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('subwrite_language');
      const lang: 'en' | 'sv' = (saved === 'en' || saved === 'sv') ? saved : 'en';
      const p = getPassages(1, lang);
      if (p && p.length > 0) {
        const rand = pickRandomPassageIndex(p.length);
        currentPassageIndexRef.current = rand;
        return p[rand];
      }
      return SUBMARINE_LEVELS[0]?.passages[0] || '';
    } catch {
      return SUBMARINE_LEVELS[0]?.passages[0] || '';
    }
  });
  
  // Typing state
  const [inputVal, setInputVal] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [continuedErrors, setContinuedErrors] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [recentPenalty, setRecentPenalty] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => detectDeviceType() === 'mobile');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Score state for debrief modal
  const [finalScoreData, setFinalScoreData] = useState<FinalTrialResult | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const penaltyTimerRef = useRef<number | null>(null);

  // Dynamic device detection on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(detectDeviceType() === 'mobile');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Current level details & time limit
  const currentLevelData: SubmarineLevel = SUBMARINE_LEVELS.find(l => l.level === level) || SUBMARINE_LEVELS[0];
  const timeLimit = LEVEL_TIME_LIMITS[level] || 180;
  const timeRemaining = Math.max(0, timeLimit - elapsedSeconds);

  // Scoring constants:
  // 1. Initial mission reserve pool
  // 2. Continuous time drain rate (points/sec) - the faster you type, the less is drained
  // 3. -500 points per continued misstyped error
  const initialReserve = (targetText.length * 25) + (level * 2500);
  const drainRate = 20 + (level * 10);
  const timeDrain = elapsedSeconds * drainRate;
  const errorPenalty = continuedErrors * 500;
  const liveScore = Math.max(0, Math.round(initialReserve - timeDrain - errorPenalty));

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Initialize or reset passage with high variation (randomly pick a text template, never repeat current)
  const loadPassage = useCallback((lvl: number, lang: 'en' | 'sv', forcedIdx?: number) => {
    const passages = getPassages(lvl, lang);
    if (!passages || passages.length === 0) return;

    let selectedIdx: number;
    if (forcedIdx !== undefined && forcedIdx >= 0 && forcedIdx < passages.length) {
      selectedIdx = forcedIdx;
    } else {
      selectedIdx = pickRandomPassageIndex(passages.length, currentPassageIndexRef.current);
    }

    currentPassageIndexRef.current = selectedIdx;
    setPassageIndex(selectedIdx);
    setTargetText(passages[selectedIdx]);
    setInputVal('');
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setErrorCount(0);
    setContinuedErrors(0);
    setTotalKeystrokes(0);
    setRecentPenalty(null);
    setFinalScoreData(null);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Start game from title screen with selected level and synchronous input focus
  const handleStartGame = (selectedLvl?: number, selectedLang?: 'en' | 'sv') => {
    const targetLvl = selectedLvl ?? level;
    const targetLang = selectedLang ?? language;
    if (selectedLvl && selectedLvl !== level) {
      setLevel(targetLvl);
    }
    if (selectedLang && selectedLang !== language) {
      setLanguage(targetLang);
      try {
        localStorage.setItem('subwrite_language', targetLang);
      } catch {
        // Ignore
      }
    }
    setGameState('playing');
    // Ensure every time a level is selected or game started, a fresh random template is loaded
    currentPassageIndexRef.current = -1;
    loadPassage(targetLvl, targetLang);

    // Synchronously focus so mobile browsers (iOS Safari) trigger virtual keyboard immediately
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
      setIsFocused(true);
    }
  };

  const handleSelectLanguage = useCallback((newLang: 'en' | 'sv') => {
    setLanguage(newLang);
    try {
      localStorage.setItem('subwrite_language', newLang);
    } catch {
      // Ignore
    }
    currentPassageIndexRef.current = -1;
    loadPassage(level, newLang);
  }, [level, loadPassage]);

  // Return to title screen
  const handleReturnToMenu = () => {
    setGameState('start');
    setShowScoreboard(false);
    setIsStarted(false);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Calculate live metrics
  const calculateMetrics = useCallback(() => {
    const timeInMinutes = Math.max((elapsedSeconds || 1) / 60, 0.05);
    const wordsTyped = inputVal.length / 5;
    const wpm = Math.max(0, Math.round(wordsTyped / timeInMinutes));
    const accuracy = totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100)))
      : 100;
    return { wpm, accuracy, score: liveScore };
  }, [elapsedSeconds, inputVal.length, totalKeystrokes, errorCount, liveScore]);

  const { wpm, accuracy, score } = calculateMetrics();

  // Completion check
  const handleComplete = useCallback((completedVal?: string) => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playSonarPing();

    const currentVal = completedVal ?? inputVal;

    // Count correct chars and errors directly from completed string
    let correctChars = 0;
    let actualErrors = 0;
    for (let i = 0; i < currentVal.length; i++) {
      if (currentVal[i] === targetText[i] || areCharsEquivalent(currentVal[i], targetText[i])) {
        correctChars++;
      } else {
        actualErrors++;
      }
    }

    const finalErrors = Math.max(actualErrors, continuedErrors);
    const finalTime = Math.max(1, elapsedSeconds);
    const finalDrain = finalTime * drainRate;
    const finalPenalty = finalErrors * 500;
    const finalScore = Math.max(0, Math.round(initialReserve - finalDrain - finalPenalty));

    const finalTimeInMinutes = Math.max(finalTime / 60, 0.05);
    const finalWpm = Math.max(0, Math.round((targetText.length / 5) / finalTimeInMinutes));
    const finalAcc = totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100)))
      : 100;

    setFinalScoreData({
      score: finalScore,
      wpm: finalWpm,
      accuracy: finalAcc,
      level,
      correctChars,
      incorrectChars: finalErrors,
      totalKeystrokes,
      timeSpentSeconds: finalTime,
      timeLimitSeconds: timeLimit,
      penaltyPoints: finalPenalty,
      device: isMobile ? 'mobile' : 'desktop',
      initialReserve,
      timeDrain: finalDrain,
      continuedErrors: finalErrors
    });
    setTimeout(() => {
      setShowScoreboard(true);
    }, 600);
  }, [elapsedSeconds, drainRate, initialReserve, targetText, totalKeystrokes, errorCount, level, timeLimit, isMobile, inputVal, continuedErrors]);

  // Timer loop with countdown clock
  useEffect(() => {
    if (gameState === 'playing' && isStarted && !isFinished && startTime) {
      timerRef.current = window.setInterval(() => {
        const secs = Math.floor((Date.now() - startTime) / 1000);
        setElapsedSeconds(secs);

        // Check time expiration
        if (secs >= timeLimit) {
          handleComplete();
        }
      }, 200);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isStarted, isFinished, startTime, timeLimit, handleComplete]);

  // Input change handler with immutable previous history and unblocked continuous progression
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished || gameState !== 'playing') return;
    const val = e.target.value;

    if (!isStarted && val.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
      sound.playSonarPing();
    }

    let nextVal = inputVal;

    // Forward typing: Characters were added
    if (val.length > inputVal.length) {
      // Extract newly added characters from the end or diff
      const addedChars = val.slice(inputVal.length);
      setTotalKeystrokes(prev => prev + addedChars.length);

      nextVal = (inputVal + addedChars).slice(0, targetText.length);

      let hadError = false;
      for (let i = inputVal.length; i < nextVal.length; i++) {
        const typedChar = nextVal[i];
        const expectedChar = targetText[i];
        const isMatch = typedChar === expectedChar || areCharsEquivalent(typedChar, expectedChar);

        if (!isMatch) {
          hadError = true;
          setErrorCount(prev => prev + 1);
          setContinuedErrors(prev => prev + 1);
        }
      }

      if (hadError) {
        setRecentPenalty('-500 PTS ERROR');
        sound.playError();
        if (penaltyTimerRef.current) clearTimeout(penaltyTimerRef.current);
        penaltyTimerRef.current = window.setTimeout(() => {
          setRecentPenalty(null);
        }, 1200);
      } else {
        sound.playKeypress();
      }
    } else if (val.length < inputVal.length) {
      // Backspace: delete strictly from the end, protecting all earlier characters
      const deleteCount = inputVal.length - val.length;
      nextVal = inputVal.slice(0, Math.max(0, inputVal.length - deleteCount));
    }

    setInputVal(nextVal);

    if (inputRef.current) {
      inputRef.current.value = nextVal;
    }

    // Finished entire passage?
    if (nextVal.length >= targetText.length && targetText.length > 0) {
      handleComplete(nextVal);
    }
  };

  // Keyboard shortcut listener for level change (1-5), restart (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showScoreboard) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (gameState === 'playing') {
          sound.playLevelSelect();
          loadPassage(level, language);
        }
        return;
      }

      // If in playing mode and hasn't started typing yet, allow pressing 1-5 to select level
      if (gameState === 'playing' && !isStarted && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const newLvl = parseInt(e.key, 10);
        sound.playLevelSelect();
        setLevel(newLvl);
        currentPassageIndexRef.current = -1;
        loadPassage(newLvl, language);
        return;
      }

      // Auto-focus input on any typed character when in playing mode (allow AltGr / international characters)
      if (gameState === 'playing' && document.activeElement !== inputRef.current) {
        if (e.key === 'Backspace') {
          e.preventDefault();
          inputRef.current?.focus();
          if (inputVal.length > 0) {
            setInputVal(prev => prev.slice(0, -1));
            sound.playKeypress();
          }
          return;
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isStarted, level, language, showScoreboard, loadPassage, inputVal.length]);

  // Ensure caret always stays locked to the active typing position at the end of input
  const syncCaretToEnd = useCallback(() => {
    if (inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  // Handle direct keydown events on the typing input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      sound.playKeypress();

      // Word-level deletion: Ctrl+Backspace or Alt/Option+Backspace
      if (e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
        const trimmed = inputVal.trimEnd();
        const lastSpace = trimmed.lastIndexOf(' ');
        const nextVal = lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1);
        setInputVal(nextVal);
        if (inputRef.current) {
          inputRef.current.value = nextVal;
          inputRef.current.setSelectionRange(nextVal.length, nextVal.length);
        }
        return;
      }

      // If caret desynced, ensure backspace always deletes cleanly from the end
      if (inputRef.current) {
        const len = inputVal.length;
        if (inputRef.current.selectionStart !== len || inputRef.current.selectionEnd !== len) {
          e.preventDefault();
          if (len > 0) {
            const nextVal = inputVal.slice(0, -1);
            setInputVal(nextVal);
            inputRef.current.value = nextVal;
            inputRef.current.setSelectionRange(nextVal.length, nextVal.length);
          }
          return;
        }
      }
    }

    // Prevent Arrow keys from shifting caret away from active typing position
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      syncCaretToEnd();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playLevelSelect();
  };

  const handleLevelSelect = (lvl: number) => {
    sound.playLevelSelect();
    setLevel(lvl);
    if (gameState === 'playing') {
      currentPassageIndexRef.current = -1;
      loadPassage(lvl, language);
    }
  };

  // Progress percentage
  const progressPercent = targetText.length > 0
    ? Math.min(100, Math.round((inputVal.length / targetText.length) * 100))
    : 0;

  return (
    <div className="c64-viewport">
      <div className="crt-overlay"></div>
      <div className="crt-vignette"></div>

      <div className="c64-screen-frame">
        {gameState === 'start' && (
          /* =============================================================
             START SCREEN (NINTENDO NES TITLE WITH SWEDISH GOTLAND SUB)
             ============================================================= */
          <StartScreen
            selectedLevel={level}
            selectedLanguage={language}
            isMobile={isMobile}
            onSelectLevel={handleLevelSelect}
            onSelectLanguage={handleSelectLanguage}
            onStartGame={handleStartGame}
            onOpenScoreboard={() => setShowScoreboard(true)}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        )}

        {/* =============================================================
           TYPING ARENA (LIVE MISSION) - Kept mounted to enable synchronous iOS Safari keyboard popup on tap
           ============================================================= */}
        <div className={`c64-mission-view ${gameState === 'start' ? 'mission-view-standby' : ''}`}>
          {/* TOP STATUS BAR */}
          <header className="c64-top-bar">
            <div className="c64-branding">
              <span className="soviet-star">★</span>
              <span className="brand-name">subwrite.se</span>
              <span className="kernel-tag">RED OCTOBER / LEVEL {level} ({currentLevelData.name})</span>
            </div>
            <div className="top-bar-controls">
              <button
                onClick={() => handleSelectLanguage(language === 'en' ? 'sv' : 'en')}
                className="retro-header-btn retro-lang-btn"
                title="Change Mission Language: English / Svenska"
                type="button"
              >
                {language === 'en' ? '🇬🇧 EN' : '🇸🇪 SV'}
              </button>
              <button
                onClick={handleReturnToMenu}
                className="retro-header-btn"
                title="Return to Title Menu"
                type="button"
              >
                ◄ MENU
              </button>
              <button
                onClick={() => setShowScoreboard(true)}
                className="retro-header-btn"
                title="View Leaderboard"
                type="button"
              >
                🏆 LOGS
              </button>
              <button
                onClick={toggleSound}
                className="retro-header-btn"
                title="Toggle Audio"
                type="button"
              >
                {soundEnabled ? '🔊 SFX' : '🔇 MUTE'}
              </button>
            </div>
          </header>

          {/* SUBMARINE TACTICAL TELEMETRY PANEL (WITH TIME COUNTDOWN) */}
          <section className="c64-telemetry-panel c64-box">
            <div className="telemetry-item">
              <span className="telemetry-label">VESSEL</span>
              <span className="telemetry-val highlight-red">HSwMS GOTLAND</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">SPEED (WPM)</span>
              <span className="telemetry-val highlight-green">{wpm}</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">ACCURACY</span>
              <span className="telemetry-val highlight-amber">{accuracy}%</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">DEPTH</span>
              <span className="telemetry-val">{currentLevelData.depth}</span>
            </div>
            <div className="telemetry-item score-telemetry-item">
              <span className="telemetry-label">SCORE</span>
              <span className="telemetry-val highlight-gold">{score.toLocaleString()}</span>
              <span className="telemetry-drain-sub">DRAIN: -{drainRate}/s</span>
              {recentPenalty && (
                <span className="penalty-floating-badge">{recentPenalty}</span>
              )}
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">TIME LEFT</span>
              <span className={`telemetry-val ${timeRemaining <= 30 ? 'alert-time-low' : 'highlight-cyan'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </section>

          {/* LEVEL SELECTOR (LEVELS 1 - 5) */}
          <section className="c64-level-selector c64-box">
            <div className="level-bar-label">
              <span>[ TACTICAL DIVE LEVEL ]:</span>
            </div>
            <div className="level-buttons-grid">
              {SUBMARINE_LEVELS.map((lvl) => {
                const active = lvl.level === level;
                return (
                  <button
                    key={lvl.level}
                    onClick={() => handleLevelSelect(lvl.level)}
                    className={`level-btn ${active ? 'active-level' : ''}`}
                    type="button"
                  >
                    <span className="lvl-num">LVL {lvl.level}</span>
                    <span className="lvl-name">{lvl.name}</span>
                    <span className="lvl-mult">[{lvl.multiplier}x]</span>
                  </button>
                );
              })}
            </div>
            <div className="level-status-desc">
              <span className="status-bullet">►</span> {currentLevelData.rank}: {currentLevelData.description} (TIME: {Math.floor((LEVEL_TIME_LIMITS[level] || 180) / 60)} MIN)
            </div>
          </section>

          {/* TYPING ARENA */}
          <main
            className={`c64-terminal-arena c64-box ${isFocused ? 'arena-focused' : 'arena-unfocused'}`}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Unfocused Click-to-Start Banner */}
            {!isFocused && !isFinished && (
              <div className="focus-warning-overlay">
                <div className="blinking-cursor-prompt">
                  {isMobile ? '► TAP SCREEN TO ENGAGE TERMINAL & COMMENCE TYPING ◄' : '► CLICK OR PRESS ANY KEY TO ENGAGE TERMINAL ◄'}
                </div>
              </div>
            )}

            {/* Hidden/Active input capture element */}
            <input
              ref={inputRef}
              type="text"
              className="hidden-typing-input"
              value={inputVal}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => {
                setIsFocused(true);
                syncCaretToEnd();
              }}
              onClick={syncCaretToEnd}
              onSelect={syncCaretToEnd}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onBlur={() => setIsFocused(false)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              data-gramm="false"
              disabled={isFinished}
              inputMode="text"
              enterKeyHint="done"
            />

            {/* Rendered Text with Unblocked Continuous Progression */}
            <div className="typing-text-display">
              {targetText.split('').map((char, index) => {
                let charClass = 'char-pending';
                const isCursor = index === inputVal.length;

                if (index < inputVal.length) {
                  const typedChar = inputVal[index];
                  const isMatch = typedChar === char || areCharsEquivalent(typedChar, char);
                  charClass = isMatch ? 'char-correct' : 'char-error';
                }

                return (
                  <span
                    key={index}
                    className={`terminal-char ${charClass} ${isCursor ? 'char-cursor' : ''}`}
                  >
                    {char}
                  </span>
                );
              })}
              {inputVal.length >= targetText.length && (
                <span className="terminal-char char-cursor">█</span>
              )}
            </div>

            {/* SUBMARINE DIVING PROGRESS METER */}
            <div className="depth-progress-container">
              <div className="progress-labels">
                <span>BALLAST TANKS FLOODING...</span>
                <span>DEPTH REACHED: {progressPercent}%</span>
              </div>
              <div className="c64-progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </main>

          {/* BOTTOM ACTION BAR */}
          <footer className="c64-footer c64-box">
            <div className="footer-keys-legend">
              <span>[ESC] RESET</span> | <span>[1-5] CHANGE LEVEL</span> | <span>ERRORS: {continuedErrors}</span> | <span>PENALTY: -{errorPenalty} PTS</span>
            </div>
            <div className="footer-actions">
              <button
                onClick={() => loadPassage(level, language)}
                className="retro-btn btn-warning"
                type="button"
              >
                ⟳ NEXT PASSAGE
              </button>
              <button
                onClick={() => setShowScoreboard(true)}
                className="retro-btn btn-danger"
                type="button"
              >
                ★ VIEW SCORES
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* SCOREBOARD / TRIAL STATUS DEBRIEF MODAL */}
      {showScoreboard && (
        <Scoreboard
          currentScore={finalScoreData}
          initialLevel={level}
          initialDevice={isMobile ? 'mobile' : 'desktop'}
          onPlayAgain={(lvl?: number) => {
            const target = lvl ?? level;
            setShowScoreboard(false);
            handleStartGame(target);
          }}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}

export default App;
