import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SUBMARINE_LEVELS, type SubmarineLevel, LEVEL_TIME_LIMITS } from './data/submarineTexts';
import { Scoreboard, type FinalTrialResult } from './components/Scoreboard';
import { StartScreen } from './components/StartScreen';
import { sound } from './utils/audio';
import './App.css';

// Helper to allow tolerant matching for special characters, smart quotes, and dashes
const areCharsEquivalent = (typed?: string, expected?: string): boolean => {
  if (!typed || !expected) return false;
  if (typed === expected) return true;

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

  return false;
};

export function App() {
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [level, setLevel] = useState<number>(1);
  const [, setPassageIndex] = useState<number>(0);
  const [targetText, setTargetText] = useState<string>('');
  
  // Typing state
  const [inputVal, setInputVal] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [penaltyPoints, setPenaltyPoints] = useState<number>(0);
  const [recentPenalty, setRecentPenalty] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Score state for debrief modal
  const [finalScoreData, setFinalScoreData] = useState<FinalTrialResult | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const penaltyTimerRef = useRef<number | null>(null);

  // Detect mobile
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || '';
    const mobileCheck = /android|iphone|ipad|ipod|windows phone/i.test(ua) || (window.innerWidth <= 768);
    setIsMobile(mobileCheck);
  }, []);

  // Current level details & time limit
  const currentLevelData: SubmarineLevel = SUBMARINE_LEVELS.find(l => l.level === level) || SUBMARINE_LEVELS[0];
  const timeLimit = LEVEL_TIME_LIMITS[level] || 180;
  const timeRemaining = Math.max(0, timeLimit - elapsedSeconds);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Initialize or reset passage
  const loadPassage = useCallback((lvl: number, idx?: number) => {
    const lData = SUBMARINE_LEVELS.find(l => l.level === lvl) || SUBMARINE_LEVELS[0];
    const newIdx = idx !== undefined ? idx : Math.floor(Math.random() * lData.passages.length);
    setPassageIndex(newIdx);
    setTargetText(lData.passages[newIdx]);
    setInputVal('');
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setErrorCount(0);
    setTotalKeystrokes(0);
    setPenaltyPoints(0);
    setRecentPenalty(null);
    setFinalScoreData(null);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    loadPassage(level);
  }, [level, loadPassage]);

  // Start game from title screen
  const handleStartGame = () => {
    setGameState('playing');
    loadPassage(level);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

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
    const baseScore = Math.round((wpm * (accuracy / 100)) * (level * 220));
    const score = Math.max(0, baseScore - penaltyPoints);
    return { wpm, accuracy, score };
  }, [elapsedSeconds, inputVal.length, totalKeystrokes, errorCount, level, penaltyPoints]);

  const { wpm, accuracy, score } = calculateMetrics();

  // Completion check
  const handleComplete = useCallback((completedVal?: string) => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playSonarPing();

    const currentVal = completedVal ?? inputVal;
    const finalTimeInMinutes = Math.max((elapsedSeconds || 1) / 60, 0.05);
    const finalWpm = Math.max(0, Math.round((targetText.length / 5) / finalTimeInMinutes));
    const finalAcc = totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100)))
      : 100;
    const baseScore = Math.round((finalWpm * (finalAcc / 100)) * (level * 220));
    const finalScore = Math.max(0, baseScore - penaltyPoints);

    // Count exact or equivalent correct characters matching target
    let correctChars = 0;
    for (let i = 0; i < currentVal.length; i++) {
      if (currentVal[i] === targetText[i] || areCharsEquivalent(currentVal[i], targetText[i])) {
        correctChars++;
      }
    }

    setFinalScoreData({
      score: finalScore,
      wpm: finalWpm,
      accuracy: finalAcc,
      level,
      correctChars,
      incorrectChars: errorCount,
      totalKeystrokes,
      timeSpentSeconds: elapsedSeconds,
      timeLimitSeconds: timeLimit,
      penaltyPoints
    });
    setTimeout(() => {
      setShowScoreboard(true);
    }, 600);
  }, [elapsedSeconds, targetText, inputVal, totalKeystrokes, errorCount, level, penaltyPoints, timeLimit]);

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

  // Input change handler with error & continued misspelled penalty deductions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished || gameState !== 'playing') return;
    const val = e.target.value;

    if (!isStarted && val.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
      sound.playSonarPing();
    }

    // Check if new character was typed
    if (val.length > inputVal.length) {
      const charIndex = val.length - 1;
      const expectedChar = targetText[charIndex];
      const typedChar = val[charIndex];

      setTotalKeystrokes(prev => prev + 1);

      // Check if any preceding character in the typed string was misspelled
      let hasPrecedingError = false;
      for (let i = 0; i < charIndex; i++) {
        if (val[i] !== targetText[i] && !areCharsEquivalent(val[i], targetText[i])) {
          hasPrecedingError = true;
          break;
        }
      }

      const isMatch = typedChar === expectedChar || areCharsEquivalent(typedChar, expectedChar);

      if (!isMatch) {
        setErrorCount(prev => prev + 1);
        // Penalty: 50 * level for first error, 80 * level if continuing on misspelled word
        const penalty = hasPrecedingError ? (80 * level) : (50 * level);
        setPenaltyPoints(prev => prev + penalty);
        setRecentPenalty(`-${penalty} PTS`);
        sound.playError();
      } else if (hasPrecedingError) {
        // Character matches target index, but preceding mistake was not fixed
        const continuedPenalty = 10 * level;
        setPenaltyPoints(prev => prev + continuedPenalty);
        // Play keypress sound so the user can smoothly proceed through the text
        sound.playKeypress();
      } else {
        sound.playKeypress();
      }

      // Clear recent penalty alert after 1.2s
      if (penaltyTimerRef.current) clearTimeout(penaltyTimerRef.current);
      penaltyTimerRef.current = window.setTimeout(() => {
        setRecentPenalty(null);
      }, 1200);
    }

    const clampedVal = val.slice(0, targetText.length);
    setInputVal(clampedVal);

    // Finished entire passage? (Allows finishing upon reaching end, even with errors)
    if (clampedVal.length >= targetText.length && targetText.length > 0) {
      handleComplete(clampedVal);
    }
  };

  // Keyboard shortcut listener for level change (1-5), restart (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showScoreboard) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (gameState === 'playing') {
          loadPassage(level);
        }
        return;
      }

      // If in playing mode and hasn't started typing yet, allow pressing 1-5 to select level
      if (gameState === 'playing' && !isStarted && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const newLvl = parseInt(e.key, 10);
        sound.playLevelSelect();
        setLevel(newLvl);
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
  }, [gameState, isStarted, level, showScoreboard, loadPassage, inputVal.length]);

  // Ensure caret always stays locked to the active typing position at the end of input
  const syncCaretToEnd = useCallback(() => {
    if (inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  useEffect(() => {
    syncCaretToEnd();
  }, [inputVal, syncCaretToEnd]);

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
        return;
      }

      // If caret desynced, ensure backspace always deletes cleanly from the end
      if (inputRef.current) {
        const len = inputVal.length;
        if (inputRef.current.selectionStart !== len || inputRef.current.selectionEnd !== len) {
          e.preventDefault();
          if (len > 0) {
            setInputVal(prev => prev.slice(0, -1));
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
        {gameState === 'start' ? (
          /* =============================================================
             START SCREEN (NINTENDO NES TITLE WITH SWEDISH GOTLAND SUB)
             ============================================================= */
          <StartScreen
            selectedLevel={level}
            onSelectLevel={handleLevelSelect}
            onStartGame={handleStartGame}
            onOpenScoreboard={() => setShowScoreboard(true)}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        ) : (
          /* =============================================================
             TYPING ARENA (LIVE MISSION)
             ============================================================= */
          <>
            {/* TOP STATUS BAR */}
            <header className="c64-top-bar">
              <div className="c64-branding">
                <span className="soviet-star">★</span>
                <span className="brand-name">subwrite.se</span>
                <span className="kernel-tag">RED OCTOBER / LEVEL {level} ({currentLevelData.name})</span>
              </div>
              <div className="top-bar-controls">
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
                <span className="telemetry-val highlight-gold">{score}</span>
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
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                data-gramm="false"
                disabled={isFinished}
              />

              {/* Rendered Text with Retro Character-by-Character Highlighting */}
              <div className="typing-text-display">
                {targetText.split('').map((char, index) => {
                  let charClass = 'char-pending';
                  const isCursor = index === inputVal.length;

                  if (index < inputVal.length) {
                    if (inputVal[index] === char || areCharsEquivalent(inputVal[index], char)) {
                      charClass = 'char-correct';
                    } else {
                      charClass = 'char-error';
                    }
                  }

                  return (
                    <span
                      key={index}
                      className={`terminal-char ${charClass} ${isCursor ? 'char-cursor' : ''}`}
                    >
                      {isCursor && <span className="retro-block-cursor">█</span>}
                      {char}
                    </span>
                  );
                })}
                {inputVal.length >= targetText.length && (
                  <span className="retro-block-cursor end-cursor">█</span>
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
                <span>[ESC] RESET</span> | <span>[1-5] CHANGE LEVEL</span> | <span>ERRORS: {errorCount}</span> | <span>PENALTY: -{penaltyPoints} PTS</span>
              </div>
              <div className="footer-actions">
                <button
                  onClick={() => loadPassage(level)}
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
          </>
        )}
      </div>

      {/* SCOREBOARD / TRIAL STATUS DEBRIEF MODAL */}
      {showScoreboard && (
        <Scoreboard
          currentScore={finalScoreData}
          onPlayAgain={() => {
            setShowScoreboard(false);
            loadPassage(level);
          }}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}

export default App;
