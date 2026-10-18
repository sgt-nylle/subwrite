import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { type HighScore } from '../data/submarineTexts';
import { sound } from '../utils/audio';
import { detectDeviceType, getDeviceLabel } from '../utils/device';
import { type ThemeId, getTheme } from '../themes';

export interface FinalTrialResult {
  score: number;
  wpm: number;
  accuracy: number;
  level: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  penaltyPoints: number;
  device?: 'desktop' | 'mobile';
  initialReserve?: number;
  timeDrain?: number;
  continuedErrors?: number;
  accuracyBonus?: number;
  theme?: ThemeId;
}

interface ScoreboardProps {
  currentScore?: FinalTrialResult | null;
  initialLevel?: number;
  initialDevice?: 'desktop' | 'mobile';
  language?: 'en' | 'sv';
  onSelectLanguage?: (lang: 'en' | 'sv') => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  theme?: ThemeId;
  onPlayAgain: (lvl?: number, lang?: 'en' | 'sv') => void;
  onReturnToMenu?: () => void;
}

/**
 * Formats ISO date (YYYY-MM-DD) into compact YY-MM-DD format (e.g. 26-10-14)
 * to prevent date from breaking onto 2 rows on arcade displays.
 */
const formatDisplayDate = (dateStr?: string): string => {
  if (!dateStr) return '---';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const yy = match[1].slice(-2);
    return `${yy}-${match[2]}-${match[3]}`;
  }
  return dateStr;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({
  currentScore,
  initialLevel,
  initialDevice,
  language = 'en',
  onSelectLanguage,
  soundEnabled = true,
  onToggleSound,
  theme = 'submarine',
  onPlayAgain,
  onReturnToMenu
}) => {
  const activeTheme = getTheme(currentScore?.theme || theme);
  const storageKey = `subwrite_high_scores_${activeTheme.id}_v095`;

  const [scores, setScores] = useState<HighScore[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return [...activeTheme.initialScores, ...activeTheme.initialMobileScores];
  });

  // Selected device tab: defaults to the device of the played score, or user's active device
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>(() => {
    if (currentScore?.device) return currentScore.device;
    if (initialDevice) return initialDevice;
    return detectDeviceType();
  });

  // Default to the level just played, or the active level, or 'all'
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>(
    currentScore ? currentScore.level : (initialLevel ?? 'all')
  );

  const SAVED_CALLSIGN_KEY = 'subwrite_player_callsign';
  const [initials, setInitials] = useState(() => {
    try {
      return localStorage.getItem(SAVED_CALLSIGN_KEY) || '';
    } catch {
      return '';
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof HighScore, direction: 'asc' | 'desc' }>({ key: 'score', direction: 'desc' });

  // DOM Refs for reliable keyboard autofocus and focus retention
  const initialsInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playAgainBtnRef = useRef<HTMLButtonElement>(null);

  // Refs for seamless keyboard event listener access without closure staleness
  const submitTimestampRef = useRef<number>(0);
  const selectedLevelRef = useRef<number | 'all'>(selectedLevel);
  useEffect(() => {
    selectedLevelRef.current = selectedLevel;
  }, [selectedLevel]);

  // Language state for post-game retry / next mission
  const [localLanguage, setLocalLanguage] = useState<'en' | 'sv'>(language || 'en');
  const currentLanguage = language ?? localLanguage;
  const currentLanguageRef = useRef<'en' | 'sv'>(currentLanguage);
  useEffect(() => {
    currentLanguageRef.current = currentLanguage;
  }, [currentLanguage]);

  const handleToggleLanguage = useCallback(() => {
    sound.playKeypress();
    const nextLang = currentLanguageRef.current === 'en' ? 'sv' : 'en';
    if (onSelectLanguage) {
      onSelectLanguage(nextLang);
    } else {
      setLocalLanguage(nextLang);
    }
  }, [onSelectLanguage]);

  // Programmatic focus management:
  // - If initials prompt is shown, automatically focus the input field so typing/Enter works immediately without clicking
  // - If already submitted or viewing scores, focus the Play Again button so Enter/L/Arrows work immediately without clicking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScore && !submitted) {
        if (initialsInputRef.current) {
          initialsInputRef.current.focus();
          initialsInputRef.current.select();
        }
      } else {
        playAgainBtnRef.current?.focus();
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [currentScore, submitted]);

  // Fetch shared global scores from backend API for current theme
  useEffect(() => {
    let isMounted = true;
    const fetchSharedScores = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/scores?theme=${activeTheme.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            if (data.length > 0) {
              setScores(data);
              try {
                localStorage.setItem(storageKey, JSON.stringify(data));
              } catch {
                // Ignore
              }
            } else {
              const freshDefaults = [...activeTheme.initialScores, ...activeTheme.initialMobileScores];
              setScores(freshDefaults);
              try {
                localStorage.setItem(storageKey, JSON.stringify(freshDefaults));
              } catch {
                // Ignore
              }
            }
          }
        }
      } catch (err) {
        console.warn('API fetch failed, using local scores:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSharedScores();
    return () => { isMounted = false; };
  }, [activeTheme.id, activeTheme.initialScores, activeTheme.initialMobileScores, storageKey]);

  // Check if current trial qualifies as a top 3 podium score for that level & device
  const isPodiumScore = useMemo(() => {
    if (!currentScore) return false;
    const curDev = currentScore.device || 'desktop';
    const levelScores = scores
      .filter(s => (s.device || 'desktop') === curDev && Number(s.level) === currentScore.level)
      .sort((a, b) => b.score - a.score);

    return levelScores.length < 3 || currentScore.score >= (levelScores[2]?.score || 0);
  }, [currentScore, scores]);

  const handleSubmitInitials = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentScore) return;

    submitTimestampRef.current = Date.now();
    sound.playVictory();

    const trimmed = initials.trim();
    const entryInitials = (trimmed.length > 0 ? trimmed : 'AAA').toUpperCase().slice(0, 3).padEnd(3, 'X');

    try {
      localStorage.setItem(SAVED_CALLSIGN_KEY, entryInitials);
    } catch {
      // Ignore
    }

    const entryDevice = currentScore.device || selectedDevice;
    const newId = Date.now().toString();
    const newEntry: HighScore = {
      id: newId,
      initials: entryInitials,
      score: currentScore.score,
      wpm: currentScore.wpm,
      accuracy: currentScore.accuracy,
      level: currentScore.level,
      device: entryDevice,
      theme: activeTheme.id,
      failedChars: currentScore.continuedErrors ?? currentScore.incorrectChars ?? 0,
      date: new Date().toISOString().split('T')[0]
    };

    // Optimistically update locally
    const updated = [...scores, newEntry].sort((a, b) => b.score - a.score);
    setScores(updated);
    setSubmitted(true);
    setSubmittedId(newId);
    setSelectedLevel(currentScore.level);
    setSelectedDevice(entryDevice);

    // Ensure focus immediately transfers to Play Again button
    setTimeout(() => {
      playAgainBtnRef.current?.focus();
    }, 60);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Post to shared global backend
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData)) {
          setScores(serverData);
          localStorage.setItem(storageKey, JSON.stringify(serverData));
        }
      }
    } catch (err) {
      console.warn('Failed to sync score to shared server:', err);
    }
  }, [currentScore, initials, selectedDevice, activeTheme.id, scores, storageKey]);

  // Keyboard navigation listener:
  // - ESC: Return to Main Menu
  // - ArrowLeft / ArrowUp: Cycle to previous level (1..5)
  // - ArrowRight / ArrowDown: Cycle to next level (1..5)
  // - Number keys 1..5: Jump to level directly
  // - L: Toggle language (English / Svenska)
  // - Enter: If initials not submitted, submits initials; otherwise starts the selected level
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC: Always return to Main Menu
      if (e.key === 'Escape') {
        e.preventDefault();
        sound.playKeypress();
        onReturnToMenu?.();
        return;
      }

      // Only suppress global shortcuts if typing specifically into the initials input field
      const isInitialsFocused = e.target === initialsInputRef.current;
      if (isInitialsFocused) {
        return;
      }

      // If a game was completed and initials have not yet been submitted:
      if (currentScore && !submitted) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmitInitials();
          return;
        }
        // Do not trigger settings changes until initials are logged
        return;
      }

      // 2. 'L' / 'l': Toggle language between English and Swedish
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleToggleLanguage();
        return;
      }

      // 3. 'S' / 's': Toggle audio sound on / off
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onToggleSound?.();
        return;
      }

      // 4. Arrow keys to change level
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        sound.playLevelSelect();
        setSelectedLevel(prev => {
          const cur = typeof prev === 'number' ? prev : (currentScore?.level || 1);
          return cur > 1 ? cur - 1 : 5;
        });
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        sound.playLevelSelect();
        setSelectedLevel(prev => {
          const cur = typeof prev === 'number' ? prev : (currentScore?.level || 1);
          return cur < 5 ? cur + 1 : 1;
        });
        return;
      }

      // 5. Number keys [1-5] to jump to level
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        sound.playLevelSelect();
        setSelectedLevel(parseInt(e.key, 10));
        return;
      }

      // 6. Enter to start the selected level (or previous game level if not changed)
      if (e.key === 'Enter') {
        // Prevent accidental double-fire if user just pressed Enter to submit initials
        if (Date.now() - submitTimestampRef.current < 350) {
          return;
        }
        e.preventDefault();
        sound.playLevelSelect();
        const targetLevel = typeof selectedLevelRef.current === 'number'
          ? selectedLevelRef.current
          : (currentScore?.level || 1);
        onPlayAgain(targetLevel, currentLanguageRef.current);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturnToMenu, onPlayAgain, currentScore, submitted, handleToggleLanguage, onToggleSound, handleSubmitInitials]);

  // All matching scores for active device and level filter
  const totalMatchingScores = useMemo(() => {
    const deviceScores = scores.filter(s => (s.device || 'desktop') === selectedDevice);
    const list = selectedLevel === 'all'
      ? deviceScores
      : deviceScores.filter(s => Number(s.level) === selectedLevel);

    return [...list].sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA = a[key] ?? 0;
      let valB = b[key] ?? 0;

      if (key === 'initials' || key === 'date') {
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return direction === 'asc' ? -1 : 1;
        if (strA > strB) return direction === 'asc' ? 1 : -1;
        return 0;
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [scores, selectedDevice, selectedLevel, sortConfig]);

  const handleSort = (key: keyof HighScore) => {
    sound.playKeypress();
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Paginated/limited view of scores according to displayLimit (default 10)
  const filteredScores = useMemo(() => {
    return totalMatchingScores.slice(0, displayLimit);
  }, [totalMatchingScores, displayLimit]);

  const currentLevelInfo = useMemo(() => {
    if (selectedLevel === 'all') return null;
    return activeTheme.levels.find(l => l.level === selectedLevel) || null;
  }, [selectedLevel, activeTheme]);

  // Intel summary metrics across all logged records for this level
  const levelStats = useMemo(() => {
    if (totalMatchingScores.length === 0) return null;
    const topScoreVal = totalMatchingScores[0]?.score || 0;
    const topWpmVal = Math.max(...totalMatchingScores.map(s => s.wpm || 0));
    const minFailedVal = Math.min(...totalMatchingScores.map(s => s.failedChars !== undefined ? s.failedChars : 0));
    return {
      topScore: topScoreVal,
      topWpm: topWpmVal,
      minFailed: minFailedVal,
      totalPatrols: totalMatchingScores.length
    };
  }, [totalMatchingScores]);

  // Top 3 Hall of Fame podium for the active view
  const topThree = useMemo(() => {
    return filteredScores.slice(0, 3);
  }, [filteredScores]);

  const groupLabel = activeTheme.groupLabel;

  return (
    <div
      className="retro-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playAgainBtnRef.current?.focus();
        }
      }}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="retro-scoreboard-container c64-box"
      >
        <div className="c64-header-banner">
          <span className="star-icon">{activeTheme.flair}</span>
          <h2>
            {selectedDevice === 'mobile' ? `📱 TOUCHSCREEN ${groupLabel}` : `💻 KEYBOARD ${groupLabel}`}
            {selectedLevel === 'all'
              ? ' RECORDS (ALL LEVELS)'
              : ` - LEVEL ${selectedLevel}: ${currentLevelInfo?.name || ''}`}
          </h2>
          <span className="star-icon">{activeTheme.flair}</span>
        </div>

        {/* DEVICE SELECTOR TABS: KEYBOARD VS TOUCHSCREEN */}
        <div className="scoreboard-device-tabs">
          <button
            type="button"
            className={`device-tab-btn ${selectedDevice === 'desktop' ? 'active-device-tab' : ''}`}
            onClick={() => {
              sound.playKeypress();
              setSelectedDevice('desktop');
            }}
          >
            💻 KEYBOARD {groupLabel}
          </button>
          <button
            type="button"
            className={`device-tab-btn ${selectedDevice === 'mobile' ? 'active-device-tab' : ''}`}
            onClick={() => {
              sound.playKeypress();
              setSelectedDevice('mobile');
            }}
          >
            📱 TOUCHSCREEN {groupLabel}
          </button>
        </div>

        {/* STATUS PROMPT: CORRECT & INCORRECT CHARACTERS DEBRIEF */}
        {currentScore && (
          <div className="mission-debrief-card c64-box">
            <div className="debrief-header">
              <span className="radar-blip">●</span> TRIAL STATUS DEBRIEF
              <span className="debrief-device-badge">
                [{getDeviceLabel(currentScore.device)}]
              </span>
              <span className="radar-blip">●</span>
            </div>
            <div className="debrief-grid">
              <div className="debrief-item">
                <span className="debrief-lbl">MISSION RESERVE</span>
                <span className="debrief-val highlight-gold">
                  {currentScore.initialReserve ? currentScore.initialReserve.toLocaleString() : (currentScore.score + (currentScore.penaltyPoints || 0)).toLocaleString()} PTS
                </span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">TIME DRAIN ({currentScore.timeSpentSeconds}s)</span>
                <span className="debrief-val highlight-penalty">
                  -{currentScore.timeDrain !== undefined ? currentScore.timeDrain.toLocaleString() : '0'} PTS
                </span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">CONTINUED ERRORS</span>
                <span className="debrief-val char-red">
                  {currentScore.continuedErrors !== undefined ? currentScore.continuedErrors : currentScore.incorrectChars}
                </span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">MISSTYPE PENALTY (-100/ERR)</span>
                <span className="debrief-val highlight-penalty">-{currentScore.penaltyPoints} PTS</span>
              </div>
              {currentScore.accuracyBonus !== undefined && currentScore.accuracyBonus > 0 && (
                <div className="debrief-item">
                  <span className="debrief-lbl">PRECISION BONUS (≤1 ERR)</span>
                  <span className="debrief-val highlight-gold">+{currentScore.accuracyBonus.toLocaleString()} PTS</span>
                </div>
              )}
              <div className="debrief-item">
                <span className="debrief-lbl">NET SPEED</span>
                <span className="debrief-val highlight-green">{currentScore.wpm} WPM</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">ACCURACY</span>
                <span className="debrief-val highlight-amber">{currentScore.accuracy}%</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">CORRECT CHARS</span>
                <span className="debrief-val char-green">{currentScore.correctChars}</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">TOTAL KEYSTROKES</span>
                <span className="debrief-val">{currentScore.totalKeystrokes}</span>
              </div>
            </div>
            <div className="debrief-final-score">
              FINAL SCORE: <span className="highlight-gold">{currentScore.score.toLocaleString()}</span> (LVL {currentScore.level} • {getDeviceLabel(currentScore.device)})
            </div>
          </div>
        )}

        {/* 3-LETTER INITIALS / USERNAME PROMPT: ALWAYS SHOWN AFTER COMPLETING A GAME */}
        {currentScore && !submitted && (
          <div className="new-record-prompt c64-box">
            <div className={`blinking-alert ${isPodiumScore ? 'podium-alert' : ''}`}>
              {isPodiumScore
                ? `★★★ FLEET PODIUM RECORD FOR LEVEL ${currentScore.level} [${getDeviceLabel(currentScore.device)}] ★★★`
                : `★ MISSION COMPLETED — ENTER 3-LETTER CALL-SIGN FOR LEVEL ${currentScore.level} ARCHIVE ★`}
            </div>
            <form onSubmit={handleSubmitInitials} className="initials-form">
              <label htmlFor="initials-input">
                ENTER 3-LETTER CALL-SIGN TO LOG SCORE (3 CHARS + ENTER):
              </label>
              <div className="initials-input-wrapper">
                <input
                  ref={initialsInputRef}
                  id="initials-input"
                  type="text"
                  maxLength={3}
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmitInitials();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      sound.playKeypress();
                      onReturnToMenu?.();
                    }
                  }}
                  placeholder="AAA"
                  autoFocus
                  autoComplete="off"
                  className="initials-input"
                />
                <button type="submit" disabled={initials.trim().length === 0} className="retro-btn btn-primary">
                  [LOG SCORE • ENTER]
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOGGED CONFIRMATION BANNER */}
        {currentScore && submitted && (
          <div className="submission-confirmed-banner">
            <div className="confirmed-msg">
              ✓ CALL-SIGN <span className="highlight-gold">[{initials.toUpperCase().slice(0, 3).padEnd(3, 'X')}]</span> LOGGED TO LEVEL {currentScore.level} {groupLabel} ARCHIVE!
            </div>
            <div className="confirmed-nav-prompt">
              [◀ / ▶] LEVEL &nbsp;•&nbsp; [L] {currentLanguage === 'en' ? '🇬🇧 ENGLISH' : '🇸🇪 SVENSKA'} &nbsp;•&nbsp; [ENTER] START LEVEL {selectedLevel === 'all' ? currentScore.level : selectedLevel} &nbsp;•&nbsp; [ESC] MENU
            </div>
          </div>
        )}

        {/* LEVEL FILTER TABS */}
        <div className="scoreboard-level-tabs">
          <button
            type="button"
            className={`level-tab-btn ${selectedLevel === 'all' ? 'active-tab' : ''}`}
            onClick={() => {
              sound.playKeypress();
              setSelectedLevel('all');
            }}
          >
            {activeTheme.flair} ALL {groupLabel}
          </button>
          {activeTheme.levels.map(lvl => {
            const count = scores.filter(s => (s.device || 'desktop') === selectedDevice && Number(s.level) === lvl.level).length;
            return (
              <button
                key={lvl.level}
                type="button"
                className={`level-tab-btn ${selectedLevel === lvl.level ? 'active-tab' : ''}`}
                onClick={() => {
                  sound.playKeypress();
                  setSelectedLevel(lvl.level);
                }}
              >
                LVL {lvl.level}: {lvl.name} ({count})
              </button>
            );
          })}
        </div>

        {/* FLEET/SQUADRON INTEL STATS SUMMARY BAR */}
        {levelStats && (
          <div className="fleet-intel-bar">
            <div className="intel-pill">
              <span className="intel-label">🏆 TOP RECORD:</span>
              <span className="intel-val highlight-gold">{levelStats.topScore.toLocaleString()} PTS</span>
            </div>
            <div className="intel-pill">
              <span className="intel-label">⚡ PEAK SPEED:</span>
              <span className="intel-val highlight-green">{levelStats.topWpm} WPM</span>
            </div>
            <div className="intel-pill">
              <span className="intel-label">🎯 BEST RUN:</span>
              <span className="intel-val highlight-cyan">{levelStats.minFailed} FAILED CHARS</span>
            </div>
            <div className="intel-pill">
              <span className="intel-label">{activeTheme.icon} TOTAL {activeTheme.id === 'airforce' ? 'SORTIES' : activeTheme.id === 'army' ? 'MISSIONS' : activeTheme.id === 'pub' ? 'ROUNDS' : 'PATROLS'}:</span>
              <span className="intel-val">{levelStats.totalPatrols} LOGGED</span>
            </div>
          </div>
        )}

        {/* TOP 3 PODIUM / HALL OF FAME HIGHLIGHTS */}
        {topThree.length > 0 && (
          <div className="scoreboard-podium-grid">
            {topThree.map((player, idx) => {
              const medals = ['🥇 GOLD', '🥈 SILVER', '🥉 BRONZE'];
              const podiumThemes = ['gold-podium', 'silver-podium', 'bronze-podium'];
              return (
                <div key={player.id || idx} className={`podium-card c64-box ${podiumThemes[idx]}`}>
                  <div className="podium-badge">{medals[idx]}</div>
                  <div className="podium-initials">{player.initials}</div>
                  <div className="podium-score highlight-gold">{player.score.toLocaleString()} PTS</div>
                  <div className="podium-stats-row">
                    <span className="p-stat highlight-green">⚡ {player.wpm} WPM</span>
                    <span className="p-stat highlight-penalty">✖ {player.failedChars ?? 0} ERR</span>
                    <span className="p-stat highlight-amber">🎯 {player.accuracy}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LEADERBOARD TABLE */}
        <div className="scores-table-wrapper">
          <div className="global-sync-tag">
            <span>
              ● {selectedDevice === 'mobile' ? `📱 TOUCHSCREEN ${groupLabel}` : `💻 KEYBOARD ${groupLabel}`} - {selectedLevel === 'all'
                ? 'ALL LEVELS'
                : `LEVEL ${selectedLevel} [${currentLevelInfo?.name || ''}] RECORDS`}
            </span>
            {isLoading && <span className="syncing-text">[{`SYNCING ${groupLabel}...`}]</span>}
          </div>
          <table className="c64-score-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th className="sortable-header" onClick={() => handleSort('initials')}>
                  COMMANDER {sortConfig.key === 'initials' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="sortable-header" onClick={() => handleSort('score')}>
                  FINAL SCORE {sortConfig.key === 'score' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="sortable-header" onClick={() => handleSort('wpm')}>
                  SPEED (WPM) {sortConfig.key === 'wpm' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="sortable-header" onClick={() => handleSort('failedChars')}>
                  ERRORS {sortConfig.key === 'failedChars' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="sortable-header" onClick={() => handleSort('accuracy')}>
                  ACCURACY {sortConfig.key === 'accuracy' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="sortable-header" onClick={() => handleSort('level')}>
                  LEVEL {sortConfig.key === 'level' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="sortable-header" onClick={() => handleSort('device')}>
                  PLATFORM {sortConfig.key === 'device' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="sortable-header date-header-col" onClick={() => handleSort('date')}>
                  DATE {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-scores-cell">
                    NO {selectedDevice === 'mobile' ? 'TOUCHSCREEN' : 'KEYBOARD'} {activeTheme.groupLabel} RECORDS LOGGED FOR LEVEL {selectedLevel} YET. BE THE FIRST!
                  </td>
                </tr>
              ) : (
                filteredScores.map((entry, index) => {
                  const isCurrent = submitted && (entry.id === submittedId || (entry.initials === initials.toUpperCase().slice(0, 3) && currentScore && entry.score === currentScore.score));
                  const entryLevelInfo = activeTheme.levels.find(l => l.level === Number(entry.level));
                  return (
                    <tr key={entry.id || index} className={isCurrent ? "current-player-row blinking-row" : index === 0 && sortConfig.key === 'score' ? "rank-1-row" : ""}>
                      <td className="rank-col">
                        {index === 0 && sortConfig.key === 'score' ? '🥇 #1' : index === 1 && sortConfig.key === 'score' ? '🥈 #2' : index === 2 && sortConfig.key === 'score' ? '🥉 #3' : `#${index + 1}`}
                      </td>
                      <td className="name-col">{entry.initials}</td>
                      <td className="score-col highlight-gold">{entry.score.toLocaleString()}</td>
                      <td className="wpm-col highlight-green">{entry.wpm} WPM</td>
                      <td className="failed-col highlight-penalty">{entry.failedChars ?? 0} ERR</td>
                      <td className="acc-col highlight-amber">{entry.accuracy}%</td>
                      <td className="lvl-col">
                        <span className={`badge-level-${entry.level}`}>
                          LVL {entry.level} [{entryLevelInfo?.name || 'UNKNOWN'}]
                        </span>
                      </td>
                      <td className="platform-col">{entry.device === 'mobile' ? '📱 PHONE' : '💻 PC'}</td>
                      <td className="date-col" title={entry.date}>{formatDisplayDate(entry.date)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* HIGH SCORE ARCHIVE RESULT LIMIT SELECTOR */}
        <div className="scoreboard-limit-selector">
          <div className="limit-legend">
            <span>ARCHIVE VIEW:</span>
            <span className="total-archive-count">{totalMatchingScores.length} LOGGED</span>
          </div>
          <div className="limit-buttons-group">
            {[10, 25, 50, 100, 1000].map(limit => (
              <button
                key={limit}
                type="button"
                className={`limit-btn ${displayLimit === limit ? 'active-limit-btn' : ''}`}
                onClick={() => {
                  sound.playKeypress();
                  setDisplayLimit(limit);
                }}
              >
                {limit === 1000 ? 'SHOW ALL' : `TOP ${limit}`}
              </button>
            ))}
          </div>
        </div>

        <div className="scoreboard-actions">
          <button
            ref={playAgainBtnRef}
            onClick={() => onPlayAgain(selectedLevel === 'all' ? undefined : selectedLevel, currentLanguage)}
            className="retro-btn btn-danger large-btn"
            type="button"
          >
            ▶ GO {selectedLevel === 'all' ? 'MISSION' : `LEVEL ${selectedLevel}`} [{currentLanguage === 'en' ? '🇬🇧 EN' : '🇸🇪 SV'}] [ENTER]
          </button>
          <button
            onClick={handleToggleLanguage}
            className="retro-btn btn-lang-toggle"
            type="button"
            title="Toggle Language [L]"
          >
            {currentLanguage === 'en' ? '🇬🇧 EN [L]' : '🇸🇪 SV [L]'}
          </button>
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="retro-btn"
              type="button"
              title="Toggle Audio [S]"
            >
              {soundEnabled ? '🔊 SFX [S]' : '🔇 MUTE [S]'}
            </button>
          )}
          {onReturnToMenu && (
            <button
              onClick={onReturnToMenu}
              className="retro-btn btn-back-to-game"
              type="button"
              title="Return to Main Menu [ESC]"
            >
              ◄ MAIN MENU [ESC]
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
