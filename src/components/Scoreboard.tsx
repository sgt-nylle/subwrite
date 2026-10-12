import React, { useState, useEffect, useMemo } from 'react';
import { type HighScore, INITIAL_HIGH_SCORES, SUBMARINE_LEVELS } from '../data/submarineTexts';
import { sound } from '../utils/audio';

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
}

interface ScoreboardProps {
  currentScore?: FinalTrialResult | null;
  initialLevel?: number;
  onPlayAgain: () => void;
  onReturnToMenu?: () => void;
}

const STORAGE_KEY = 'subwrite_high_scores_v2';

export const Scoreboard: React.FC<ScoreboardProps> = ({ currentScore, initialLevel, onPlayAgain, onReturnToMenu }) => {
  const [scores, setScores] = useState<HighScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return INITIAL_HIGH_SCORES;
  });

  // Default to the level just played, or the active level, or 'all'
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>(
    currentScore ? currentScore.level : (initialLevel ?? 'all')
  );

  const [initials, setInitials] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
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

  // Check if current trial qualifies as a new high score for that specific level
  useEffect(() => {
    if (currentScore && !submitted) {
      const levelScores = scores
        .filter(s => Number(s.level) === currentScore.level)
        .sort((a, b) => b.score - a.score);

      const isTop = levelScores.length < 10 || currentScore.score > (levelScores[levelScores.length - 1]?.score || 0);
      setIsNewHighScore(isTop);
    }
  }, [currentScore, scores, submitted]);

  const handleSubmitInitials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initials.trim().length === 0 || !currentScore) return;

    sound.playVictory();
    const entryInitials = initials.toUpperCase().slice(0, 3).padEnd(3, 'X');
    const newEntry: HighScore = {
      id: Date.now().toString(),
      initials: entryInitials,
      score: currentScore.score,
      wpm: currentScore.wpm,
      accuracy: currentScore.accuracy,
      level: currentScore.level,
      date: new Date().toISOString().split('T')[0]
    };

    // Optimistically update locally
    const updated = [...scores, newEntry].sort((a, b) => b.score - a.score);
    setScores(updated);
    setSubmitted(true);
    setSelectedLevel(currentScore.level);

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

  // Filter and sort scores for the currently active tab
  const filteredScores = useMemo(() => {
    const list = selectedLevel === 'all'
      ? scores
      : scores.filter(s => Number(s.level) === selectedLevel);

    return [...list]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [scores, selectedLevel]);

  const currentLevelInfo = useMemo(() => {
    if (selectedLevel === 'all') return null;
    return SUBMARINE_LEVELS.find(l => l.level === selectedLevel) || null;
  }, [selectedLevel]);

  return (
    <div className="retro-modal-overlay">
      <div className="retro-scoreboard-container c64-box">
        <div className="c64-header-banner">
          <span className="star-icon">★</span>
          <h2>
            {selectedLevel === 'all'
              ? 'CLASSIFIED FLEET RECORDS (ALL LEVELS)'
              : `LEVEL ${selectedLevel} FLEET RECORDS: ${currentLevelInfo?.name || ''}`}
          </h2>
          <span className="star-icon">★</span>
        </div>

        {/* STATUS PROMPT: CORRECT & INCORRECT CHARACTERS DEBRIEF */}
        {currentScore && (
          <div className="mission-debrief-card c64-box">
            <div className="debrief-header">
              <span className="radar-blip">●</span> TRIAL STATUS DEBRIEF <span className="radar-blip">●</span>
            </div>
            <div className="debrief-grid">
              <div className="debrief-item">
                <span className="debrief-lbl">CORRECT CHARS</span>
                <span className="debrief-val char-green">{currentScore.correctChars}</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">INCORRECT CHARS</span>
                <span className="debrief-val char-red">{currentScore.incorrectChars}</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">TOTAL KEYSTROKES</span>
                <span className="debrief-val">{currentScore.totalKeystrokes}</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">ACCURACY</span>
                <span className="debrief-val highlight-amber">{currentScore.accuracy}%</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">NET SPEED</span>
                <span className="debrief-val highlight-green">{currentScore.wpm} WPM</span>
              </div>
              <div className="debrief-item">
                <span className="debrief-lbl">TIME TAKEN</span>
                <span className="debrief-val">{currentScore.timeSpentSeconds}s / {currentScore.timeLimitSeconds}s</span>
              </div>
              <div className="debrief-item full-width-debrief">
                <span className="debrief-lbl">PENALTY DEDUCTED</span>
                <span className="debrief-val highlight-penalty">-{currentScore.penaltyPoints} PTS</span>
              </div>
            </div>
            <div className="debrief-final-score">
              FINAL SCORE: <span className="highlight-gold">{currentScore.score.toLocaleString()}</span> (LVL {currentScore.level})
            </div>
          </div>
        )}

        {/* 3-LETTER INITIALS PROMPT IF HIGH SCORE FOR THIS LEVEL */}
        {currentScore && !submitted && isNewHighScore && (
          <div className="new-record-prompt">
            <div className="blinking-alert">★★★ NEW LEVEL {currentScore.level} RECORD REGISTERED ★★★</div>
            <form onSubmit={handleSubmitInitials} className="initials-form">
              <label htmlFor="initials-input">
                ENTER 3-LETTER INITIALS FOR LEVEL {currentScore.level} FLEET LOG:
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
            const count = scores.filter(s => Number(s.level) === lvl.level).length;
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

        {/* LEADERBOARD TABLE */}
        <div className="scores-table-wrapper">
          <div className="global-sync-tag">
            <span>
              ● {selectedLevel === 'all'
                ? 'ALL FLEET RECORDS'
                : `LEVEL ${selectedLevel} [${currentLevelInfo?.name || ''}] RECORDS`}
            </span>
            {isLoading && <span className="syncing-text">[SYNCING FLEET...]</span>}
          </div>
          <table className="c64-score-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>NAME</th>
                <th>SCORE</th>
                <th>WPM</th>
                <th>ACC</th>
                <th>LVL</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-scores-cell">
                    NO FLEET RECORDS LOGGED FOR LEVEL {selectedLevel} YET. BE THE FIRST!
                  </td>
                </tr>
              ) : (
                filteredScores.map((entry, index) => {
                  const isCurrent = submitted && currentScore && entry.score === currentScore.score && entry.initials === initials.toUpperCase() && Number(entry.level) === currentScore.level;
                  return (
                    <tr key={entry.id || index} className={isCurrent ? "current-player-row blinking-row" : index === 0 ? "rank-1-row" : ""}>
                      <td className="rank-col">#{index + 1}</td>
                      <td className="name-col">{entry.initials}</td>
                      <td className="score-col">{entry.score.toLocaleString()}</td>
                      <td className="wpm-col">{entry.wpm}</td>
                      <td className="acc-col">{entry.accuracy}%</td>
                      <td className="lvl-col">L{entry.level}</td>
                      <td className="date-col">{entry.date || '---'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="scoreboard-actions">
          <button onClick={onPlayAgain} className="retro-btn btn-danger large-btn" type="button">
            ▶ ENGAGE PATROL
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
