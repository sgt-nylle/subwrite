import React, { useState, useEffect } from 'react';
import { type HighScore, INITIAL_HIGH_SCORES } from '../data/submarineTexts';
import { sound } from '../utils/audio';

interface ScoreboardProps {
  currentScore?: {
    score: number;
    wpm: number;
    accuracy: number;
    level: number;
  } | null;
  onPlayAgain: () => void;
  onReturnToMenu?: () => void;
}

const STORAGE_KEY = 'subwrite_high_scores_v1';

export const Scoreboard: React.FC<ScoreboardProps> = ({ currentScore, onPlayAgain, onReturnToMenu }) => {
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

  const [initials, setInitials] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    if (currentScore && !submitted) {
      // Check if current score ranks in top 10
      const isTop = scores.length < 10 || currentScore.score > (scores[scores.length - 1]?.score || 0);
      setIsNewHighScore(isTop);
    }
  }, [currentScore, scores, submitted]);

  const handleSubmitInitials = (e: React.FormEvent) => {
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

    const updated = [...scores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setScores(updated);
    setSubmitted(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleClearScores = () => {
    if (window.confirm("CONFIRM ERASE: RESET CLASSIFIED RED OCTOBER LOGS?")) {
      setScores(INITIAL_HIGH_SCORES);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="retro-modal-overlay">
      <div className="retro-scoreboard-container c64-box">
        <div className="c64-header-banner">
          <span className="star-icon">★</span>
          <h2>CLASSIFIED FLEET RECORD LOGS</h2>
          <span className="star-icon">★</span>
        </div>

        {currentScore && !submitted && isNewHighScore && (
          <div className="new-record-prompt">
            <div className="blinking-alert">★★★ NEW HIGH SCORE REGISTERED ★★★</div>
            <p className="score-summary">
              SCORE: <span className="highlight-val">{currentScore.score}</span> | WPM: {currentScore.wpm} | ACC: {currentScore.accuracy}% (LVL {currentScore.level})
            </p>
            <form onSubmit={handleSubmitInitials} className="initials-form">
              <label htmlFor="initials-input">ENTER 3-LETTER INITIALS:</label>
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

        {currentScore && !isNewHighScore && !submitted && (
          <div className="mission-result-card">
            <h3>MISSION DEBRIEF</h3>
            <p>FINAL SCORE: <span className="highlight-val">{currentScore.score}</span></p>
            <p>SPEED: {currentScore.wpm} WPM | ACCURACY: {currentScore.accuracy}%</p>
          </div>
        )}

        <div className="scores-table-wrapper">
          <table className="c64-score-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>NAME</th>
                <th>SCORE</th>
                <th>WPM</th>
                <th>ACC</th>
                <th>LVL</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, index) => {
                const isCurrent = submitted && currentScore && entry.score === currentScore.score && entry.initials === initials.toUpperCase();
                return (
                  <tr key={entry.id || index} className={isCurrent ? "current-player-row blinking-row" : index === 0 ? "rank-1-row" : ""}>
                    <td className="rank-col">#{index + 1}</td>
                    <td className="name-col">{entry.initials}</td>
                    <td className="score-col">{entry.score.toLocaleString()}</td>
                    <td className="wpm-col">{entry.wpm}</td>
                    <td className="acc-col">{entry.accuracy}%</td>
                    <td className="lvl-col">L{entry.level}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="scoreboard-actions">
          <button onClick={onPlayAgain} className="retro-btn btn-danger large-btn">
            ▶ ENGAGE NEXT PATROL (RETRY)
          </button>
          {onReturnToMenu && (
            <button onClick={onReturnToMenu} className="retro-btn btn-warning">
              ◄ TITLE MENU
            </button>
          )}
          <button onClick={handleClearScores} className="retro-btn btn-subtle">
            [RESET LOGS]
          </button>
        </div>
      </div>
    </div>
  );
};
