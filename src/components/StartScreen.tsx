import React, { useEffect, useState } from 'react';
import { type HighScore } from '../data/submarineTexts';
import { GotlandSubmarine } from './GotlandSubmarine';
import { sound } from '../utils/audio';

interface StartScreenProps {
  selectedLevel: number;
  onSelectLevel: (lvl: number) => void;
  onStartGame: () => void;
  onOpenScoreboard: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedLevel,
  onSelectLevel,
  onStartGame,
  onOpenScoreboard,
  soundEnabled,
  onToggleSound
}) => {
  const [topScore, setTopScore] = useState<HighScore | null>(null);

  // Load top score to display on NES header (like classic "TOP - 050000")
  useEffect(() => {
    fetch('/api/scores')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTopScore(data[0]);
        }
      })
      .catch(() => {
        try {
          const local = localStorage.getItem('subwrite_high_scores_v1');
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed.length > 0) setTopScore(parsed[0]);
          }
        } catch {
          // Ignore
        }
      });
  }, []);

  // Keyboard navigation for NES style: Up/Down arrow moves level, Enter starts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const lvl = parseInt(e.key, 10);
        sound.playLevelSelect();
        onSelectLevel(lvl);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sound.playLevelSelect();
        onSelectLevel(selectedLevel > 1 ? selectedLevel - 1 : 5);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sound.playLevelSelect();
        onSelectLevel(selectedLevel < 5 ? selectedLevel + 1 : 1);
      } else if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playSonarPing();
        onStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLevel, onSelectLevel, onStartGame]);

  const levelOptions = [
    { lvl: 1, label: 'LEVEL 1  [EASY]', desc: 'Cadet • 20m • simple words' },
    { lvl: 2, label: 'LEVEL 2  [EASY-MED]', desc: 'Sonar Tech • 80m • punctuation' },
    { lvl: 3, label: 'LEVEL 3  [MEDIUM]', desc: 'Officer • 250m • nuclear boats' },
    { lvl: 4, label: 'LEVEL 4  [HARD]', desc: 'Chief Eng • 450m • technical specs' },
    { lvl: 5, label: 'LEVEL 5  [SUPER HARD]', desc: 'Commander • 700m • Red October' }
  ];

  return (
    <div className="nes-title-screen">
      {/* NES TOP HUD (TOP SCORE & SOUND) */}
      <div className="nes-top-hud">
        <div className="nes-score-display">
          <span>TOP - </span>
          <span className="top-val">{topScore ? String(topScore.score).padStart(5, '0') : '08500'}</span>
          <span className="top-initials"> {topScore?.initials || 'RAM'}</span>
        </div>
        <div className="nes-hud-buttons">
          <button
            onClick={onOpenScoreboard}
            className="nes-mini-btn"
            type="button"
          >
            🏆 SCORES
          </button>
          <button
            onClick={onToggleSound}
            className="nes-mini-btn"
            type="button"
          >
            {soundEnabled ? '🔊 ON' : '🔇 OFF'}
          </button>
        </div>
      </div>

      {/* ICONIC NES LOGO & TITLE */}
      <div className="nes-logo-section">
        <div className="nes-star-flair">★ ★ ★</div>
        <h1 className="nes-main-title">SUBWRITE!</h1>
        <div className="nes-sub-banner">
          subwrite.se - a submarine text tester!
        </div>
      </div>

      {/* 8-BIT RED GOTLAND-CLASS SWEDISH SUBMARINE */}
      <GotlandSubmarine />

      {/* NES PUSH START BUTTON */}
      <div className="nes-start-prompt" onClick={onStartGame}>
        <span className="flashing-press-start">► PUSH START BUTTON ◄</span>
      </div>

      {/* NES LEVEL SELECT MENU WITH CURSOR */}
      <div className="nes-menu-box">
        <div className="nes-menu-header">-- SELECT LEVEL 1-5 --</div>
        <ul className="nes-level-list">
          {levelOptions.map(opt => {
            const isCurrent = opt.lvl === selectedLevel;
            return (
              <li
                key={opt.lvl}
                onClick={() => {
                  sound.playLevelSelect();
                  onSelectLevel(opt.lvl);
                }}
                className={`nes-menu-item ${isCurrent ? 'selected-item' : ''}`}
              >
                <span className="nes-cursor">{isCurrent ? '►' : '\u00A0'}</span>
                <span className="nes-item-text">{opt.label}</span>
                {isCurrent && <span className="nes-item-desc">{opt.desc}</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {/* FOOTER COPYRIGHT */}
      <div className="nes-footer-credits">
        <div>USE [▲/▼] OR TAP TO SELECT • [ENTER] TO START</div>
        <div className="copyright-line">© 1984 RED OCTOBER FLEET CORP. • ALL RIGHTS RESERVED</div>
      </div>
    </div>
  );
};

export default StartScreen;
