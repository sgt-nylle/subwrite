import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SUBMARINE_LEVELS, type SubmarineLevel } from './data/submarineTexts';
import { Scoreboard } from './components/Scoreboard';
import { StartScreen } from './components/StartScreen';
import { sound } from './utils/audio';
import './App.css';

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
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Score state for modal
  const [finalScoreData, setFinalScoreData] = useState<{
    score: number;
    wpm: number;
    accuracy: number;
    level: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Detect mobile
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || '';
    const mobileCheck = /android|iphone|ipad|ipod|windows phone/i.test(ua) || (window.innerWidth <= 768);
    setIsMobile(mobileCheck);
  }, []);

  // Current level details
  const currentLevelData: SubmarineLevel = SUBMARINE_LEVELS.find(l => l.level === level) || SUBMARINE_LEVELS[0];

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

  // Timer loop
  useEffect(() => {
    if (gameState === 'playing' && isStarted && !isFinished && startTime) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 200);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isStarted, isFinished, startTime]);

  // Calculate live metrics
  const calculateMetrics = useCallback(() => {
    const timeInMinutes = Math.max((elapsedSeconds || 1) / 60, 0.05);
    const wordsTyped = inputVal.length / 5;
    const wpm = Math.max(0, Math.round(wordsTyped / timeInMinutes));
    const accuracy = totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100)))
      : 100;
    const score = Math.round((wpm * (accuracy / 100)) * (level * 200));
    return { wpm, accuracy, score };
  }, [elapsedSeconds, inputVal.length, totalKeystrokes, errorCount, level]);

  const { wpm, accuracy, score } = calculateMetrics();

  // Completion check
  const handleComplete = useCallback(() => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playSonarPing();

    const finalTimeInMinutes = Math.max((elapsedSeconds || 1) / 60, 0.05);
    const finalWpm = Math.max(0, Math.round((targetText.length / 5) / finalTimeInMinutes));
    const finalAcc = totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100)))
      : 100;
    const finalScore = Math.round((finalWpm * (finalAcc / 100)) * (level * 200));

    setFinalScoreData({
      score: finalScore,
      wpm: finalWpm,
      accuracy: finalAcc,
      level
    });
    setTimeout(() => {
      setShowScoreboard(true);
    }, 600);
  }, [elapsedSeconds, targetText.length, totalKeystrokes, errorCount, level]);

  // Input change handler (works on desktop and mobile virtual keyboards)
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

      if (typedChar !== expectedChar) {
        setErrorCount(prev => prev + 1);
        sound.playError();
      } else {
        sound.playKeypress();
      }
    }

    setInputVal(val);

    // Finished entire passage?
    if (val === targetText) {
      handleComplete();
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

      // Auto-focus input on any typed character when in playing mode
      if (gameState === 'playing' && document.activeElement !== inputRef.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isStarted, level, showScoreboard, loadPassage]);

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
             START SCREEN (HERO / SUBMARINE / LEVEL CHOOSER)
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
                  title="Return to Briefing Menu"
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

            {/* SUBMARINE TACTICAL TELEMETRY PANEL */}
            <section className="c64-telemetry-panel c64-box">
              <div className="telemetry-item">
                <span className="telemetry-label">VESSEL</span>
                <span className="telemetry-val highlight-red">TK-208 AKULA</span>
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
              <div className="telemetry-item">
                <span className="telemetry-label">SCORE</span>
                <span className="telemetry-val highlight-gold">{score}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">TIME</span>
                <span className="telemetry-val">{elapsedSeconds}s</span>
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
                <span className="status-bullet">►</span> {currentLevelData.rank}: {currentLevelData.description}
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
                onFocus={() => setIsFocused(true)}
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
                    if (inputVal[index] === char) {
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
                <span>[ESC] RESET</span> | <span>[1-5] CHANGE LEVEL</span> | <span>ERRORS: {errorCount}</span>
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

      {/* SCOREBOARD MODAL */}
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
