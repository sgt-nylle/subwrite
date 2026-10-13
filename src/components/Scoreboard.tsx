import React, { useState, useEffect, useMemo } from 'react';
import { type HighScore, ALL_INITIAL_HIGH_SCORES, SUBMARINE_LEVELS } from '../data/submarineTexts';
import { sound } from '../utils/audio';
import { detectDeviceType, getDeviceLabel } from '../utils/device';

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
}

interface ScoreboardProps {
  currentScore?: FinalTrialResult | null;
  initialLevel?: number;
  initialDevice?: 'desktop' | 'mobile';
  onPlayAgain: (lvl?: number) => void;
  onReturnToMenu?: () => void;
}

const STORAGE_KEY = 'subwrite_high_scores_v2';

export const Scoreboard: React.FC<ScoreboardProps> = ({
  currentScore,
  initialLevel,
  initialDevice,
  onPlayAgain,
  onReturnToMenu
}) => {
  const [scores, setScores] = useState<HighScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return ALL_INITIAL_HIGH_SCORES;
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

  const [initials, setInitials] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch shared global scores from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchSharedScores = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/scores');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setScores(data);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch {
              // Ignore
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
  }, []);

  // Check if current trial qualifies as a new high score for that specific level AND device
  const isNewHighScore = useMemo(() => {
    if (!currentScore || submitted) return false;
    const curDev = currentScore.device || 'desktop';
    const levelScores = scores
      .filter(s => (s.device || 'desktop') === curDev && Number(s.level) === currentScore.level)
      .sort((a, b) => b.score - a.score);

    return levelScores.length < 10 || currentScore.score > (levelScores[levelScores.length - 1]?.score || 0);
  }, [currentScore, submitted, scores]);

  const handleSubmitInitials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initials.trim().length === 0 || !currentScore) return;

    sound.playVictory();
    const entryInitials = initials.toUpperCase().slice(0, 3).padEnd(3, 'X');
    const entryDevice = currentScore.device || selectedDevice;
    const newEntry: HighScore = {
      id: Date.now().toString(),
      initials: entryInitials,
      score: currentScore.score,
      wpm: currentScore.wpm,
      accuracy: currentScore.accuracy,
      level: currentScore.level,
      device: entryDevice,
      failedChars: currentScore.continuedErrors ?? currentScore.incorrectChars ?? 0,
      date: new Date().toISOString().split('T')[0]
    };

    // Optimistically update locally
    const updated = [...scores, newEntry].sort((a, b) => b.score - a.score);
    setScores(updated);
    setSubmitted(true);
    setSelectedLevel(currentScore.level);
    setSelectedDevice(entryDevice);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
        }
      }
    } catch (err) {
      console.warn('Failed to sync score to shared server:', err);
    }
  };

  // Filter and sort scores for the currently active device and level tab
  const filteredScores = useMemo(() => {
    const deviceScores = scores.filter(s => (s.device || 'desktop') === selectedDevice);
    const list = selectedLevel === 'all'
      ? deviceScores
      : deviceScores.filter(s => Number(s.level) === selectedLevel);

    return [...list]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [scores, selectedDevice, selectedLevel]);

  const currentLevelInfo = useMemo(() => {
    if (selectedLevel === 'all') return null;
    return SUBMARINE_LEVELS.find(l => l.level === selectedLevel) || null;
  }, [selectedLevel]);

  // Intel summary metrics for the currently active level & device filter
  const levelStats = useMemo(() => {
    if (filteredScores.length === 0) return null;
    const topScoreVal = filteredScores[0]?.score || 0;
    const topWpmVal = Math.max(...filteredScores.map(s => s.wpm || 0));
    const minFailedVal = Math.min(...filteredScores.map(s => s.failedChars !== undefined ? s.failedChars : 0));
    return {
      topScore: topScoreVal,
      topWpm: topWpmVal,
      minFailed: minFailedVal,
      totalPatrols: filteredScores.length
    };
  }, [filteredScores]);

  // Top 3 Hall of Fame podium for the active view
  const topThree = useMemo(() => {
    return filteredScores.slice(0, 3);
  }, [filteredScores]);

  return (
    <div className="retro-modal-overlay">
      <div className="retro-scoreboard-container c64-box">
        <div className="c64-header-banner">
          <span className="star-icon">★</span>
          <h2>
            {selectedDevice === 'mobile' ? '📱 SMARTPHONE FLEET' : '💻 PC / MAC FLEET'}
            {selectedLevel === 'all'
              ? ' RECORDS (ALL LEVELS)'
              : ` - LEVEL ${selectedLevel}: ${currentLevelInfo?.name || ''}`}
          </h2>
          <span className="star-icon">★</span>
        </div>

        {/* DEVICE SELECTOR TABS: PC/MAC VS SMARTPHONE */}
        <div className="scoreboard-device-tabs">
          <button
            type="button"
            className={`device-tab-btn ${selectedDevice === 'desktop' ? 'active-device-tab' : ''}`}
            onClick={() => {
              sound.playKeypress();
              setSelectedDevice('desktop');
            }}
          >
            💻 PC / MAC (KEYBOARD FLEET)
          </button>
          <button
            type="button"
            className={`device-tab-btn ${selectedDevice === 'mobile' ? 'active-device-tab' : ''}`}
            onClick={() => {
              sound.playKeypress();
              setSelectedDevice('mobile');
            }}
          >
            📱 SMARTPHONE (TOUCHSCREEN FLEET)
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
                <span className="debrief-lbl">MISSTYPE PENALTY (-500/ERR)</span>
                <span className="debrief-val highlight-penalty">-{currentScore.penaltyPoints} PTS</span>
              </div>
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

        {/* 3-LETTER INITIALS PROMPT IF HIGH SCORE FOR THIS LEVEL AND DEVICE */}
        {currentScore && !submitted && isNewHighScore && (
          <div className="new-record-prompt">
            <div className="blinking-alert">
              ★★★ NEW LEVEL {currentScore.level} [{getDeviceLabel(currentScore.device)}] RECORD REGISTERED ★★★
            </div>
            <form onSubmit={handleSubmitInitials} className="initials-form">
              <label htmlFor="initials-input">
                ENTER 3-LETTER INITIALS FOR LEVEL {currentScore.level} ({getDeviceLabel(currentScore.device)}) LOG:
              </label>
              <div className="initials-input-wrapper">
                <input
                  id="initials-input"
                  type="text"
                  maxLength={3}
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.toUpperCase())}
                  placeholder="AAA"
                  autoFocus
                  autoComplete="off"
                  className="initials-input"
                />
                <button type="submit" disabled={initials.length === 0} className="retro-btn btn-primary">
                  [LOG RECORD]
                </button>
              </div>
            </form>
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
            ★ ALL FLEET
          </button>
          {SUBMARINE_LEVELS.map(lvl => {
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

        {/* FLEET INTEL STATS SUMMARY BAR */}
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
              <span className="intel-label">⚓ TOTAL PATROLS:</span>
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
              ● {selectedDevice === 'mobile' ? '📱 SMARTPHONE FLEET' : '💻 PC/MAC FLEET'} - {selectedLevel === 'all'
                ? 'ALL LEVELS'
                : `LEVEL ${selectedLevel} [${currentLevelInfo?.name || ''}] RECORDS`}
            </span>
            {isLoading && <span className="syncing-text">[SYNCING FLEET...]</span>}
          </div>
          <table className="c64-score-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>COMMANDER</th>
                <th>FINAL SCORE</th>
                <th>SPEED (WPM)</th>
                <th>FAILED CHARS</th>
                <th>ACCURACY</th>
                <th>LEVEL</th>
                <th>PLATFORM</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-scores-cell">
                    NO {selectedDevice === 'mobile' ? 'SMARTPHONE' : 'PC/MAC'} FLEET RECORDS LOGGED FOR LEVEL {selectedLevel} YET. BE THE FIRST!
                  </td>
                </tr>
              ) : (
                filteredScores.map((entry, index) => {
                  const isCurrent = submitted && currentScore && entry.score === currentScore.score && entry.initials === initials.toUpperCase() && Number(entry.level) === currentScore.level;
                  return (
                    <tr key={entry.id || index} className={isCurrent ? "current-player-row blinking-row" : index === 0 ? "rank-1-row" : ""}>
                      <td className="rank-col">
                        {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                      </td>
                      <td className="name-col">{entry.initials}</td>
                      <td className="score-col highlight-gold">{entry.score.toLocaleString()}</td>
                      <td className="wpm-col highlight-green">{entry.wpm} WPM</td>
                      <td className="failed-col highlight-penalty">{entry.failedChars ?? 0} ERR</td>
                      <td className="acc-col highlight-amber">{entry.accuracy}%</td>
                      <td className="lvl-col">L{entry.level}</td>
                      <td className="platform-col">{entry.device === 'mobile' ? '📱 PHONE' : '💻 PC'}</td>
                      <td className="date-col">{entry.date || '---'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="scoreboard-actions">
          <button
            onClick={() => onPlayAgain(selectedLevel === 'all' ? undefined : selectedLevel)}
            className="retro-btn btn-danger large-btn"
            type="button"
          >
            ▶ DIVE {selectedLevel === 'all' ? 'MISSION' : `LEVEL ${selectedLevel}`} (BEAT RECORD)
          </button>
          {onReturnToMenu && (
            <button onClick={onReturnToMenu} className="retro-btn btn-warning" type="button">
              ◄ TITLE SCREEN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
