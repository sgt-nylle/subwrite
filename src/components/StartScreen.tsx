import React, { useEffect, useState } from 'react';
import { type HighScore, ALL_INITIAL_HIGH_SCORES } from '../data/submarineTexts';
import { GotlandSubmarine } from './GotlandSubmarine';
import { sound } from '../utils/audio';

interface StartScreenProps {
  selectedLevel: number;
  isMobile: boolean;
  onSelectLevel: (lvl: number) => void;
  onStartGame: (lvl?: number) => void;
  onOpenScoreboard: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedLevel,
  isMobile,
  onSelectLevel,
  onStartGame,
  onOpenScoreboard,
  soundEnabled,
  onToggleSound
}) => {
  const [topScore, setTopScore] = useState<HighScore | null>(null);
  const targetDevice = isMobile ? 'mobile' : 'desktop';

  // Load top score for current device to display on NES header (like classic "TOP - 050000")
  useEffect(() => {
    fetch(`/api/scores?device=${targetDevice}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTopScore(data[0]);
        } else {
          const fallback = ALL_INITIAL_HIGH_SCORES.find(s => (s.device || 'desktop') === targetDevice);
          if (fallback) setTopScore(fallback);
        }
      })
      .catch(() => {
        try {
          const local = localStorage.getItem('subwrite_high_scores_v2');
          if (local) {
            const parsed: HighScore[] = JSON.parse(local);
            const filtered = parsed.filter(s => (s.device || 'desktop') === targetDevice);
            if (filtered.length > 0) {
              setTopScore(filtered[0]);
              return;
            }
          }
        } catch {
          // Ignore
        }
        const fallback = ALL_INITIAL_HIGH_SCORES.find(s => (s.device || 'desktop') === targetDevice);
        if (fallback) setTopScore(fallback);
      });
  }, [targetDevice]);

  // Keyboard navigation for NES style: Up/Down arrow moves level, Enter starts, 1-5 starts immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const lvl = parseInt(e.key, 10);
        sound.playSonarPing();
        onSelectLevel(lvl);
        onStartGame(lvl);
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
        onStartGame(selectedLevel);
      } else if (e.key === 's' || e.key === 'S' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        sound.playKeypress();
        onOpenScoreboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLevel, onSelectLevel, onStartGame, onOpenScoreboard]);

  const handleLevelClick = (lvl: number) => {
    sound.playSonarPing();
    onSelectLevel(lvl);
    onStartGame(lvl);
  };

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
          <span>TOP [{isMobile ? '📱 MOB' : '💻 PC'}] - </span>
          <span className="top-val">{topScore ? String(topScore.score).padStart(5, '0') : (isMobile ? '05200' : '08500')}</span>
          <span className="top-initials"> {topScore?.initials || (isMobile ? 'MOB' : 'RAM')}</span>
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
        <h1 className={`nes-main-title ${isMobile ? 'nes-main-title-mobile' : ''}`}>SUBWRITE!</h1>
        <div className="nes-sub-banner">
          subwrite.se - your personal submarine type challenge!
        </div>
      </div>

      {/* 8-BIT RED GOTLAND-CLASS SWEDISH SUBMARINE */}
      <GotlandSubmarine />

      {/* TACTILE NES/ARCADE PUSH START BUTTON */}
      <div className="nes-start-control-area">
        <button
          type="button"
          className="nes-push-button"
          onClick={() => {
            sound.playSonarPing();
            onStartGame(selectedLevel);
          }}
          aria-label={isMobile ? `Push to dive at level ${selectedLevel}` : `Push to start dive at level ${selectedLevel}`}
        >
          <span className="push-btn-content">
            <span className="push-btn-arrows">►</span>
            <span className="push-btn-text">{isMobile ? 'PUSH TO DIVE' : 'PUSH START'}</span>
            <span className="push-btn-lvl-tag">[LVL {selectedLevel}]</span>
            <span className="push-btn-arrows">◄</span>
          </span>
          <span className="push-btn-subtext">
            {isMobile ? 'ONE TOUCH TO COMMENCE DIVE' : 'COMMENCE MISSION • [ENTER]'}
          </span>
        </button>
      </div>

      {/* NES LEVEL SELECT MENU WITH CURSOR */}
      <div className="nes-menu-box">
        <div className="nes-menu-header">
          {isMobile ? '-- PUSH ANY BUTTON TO DIVE IMMEDIATELY --' : '-- SELECT LEVEL TO DIVE IMMEDIATELY --'}
        </div>
        <div className="nes-level-list">
          {levelOptions.map(opt => {
            const isCurrent = opt.lvl === selectedLevel;
            return (
              <button
                key={opt.lvl}
                type="button"
                onClick={() => handleLevelClick(opt.lvl)}
                className={`nes-menu-item-btn ${isCurrent ? 'selected-item' : ''}`}
              >
                <div className="nes-menu-item-main">
                  <span className="nes-cursor">{isCurrent ? '►' : '\u00A0'}</span>
                  <span className="nes-item-text">{opt.label}</span>
                </div>
                <span className="nes-item-desc">{opt.desc}</span>
                <span className="nes-quick-dive-badge">{isMobile ? 'PUSH TO DIVE' : 'DIVE'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PROMINENT HALL OF FAME / SCOREBOARDS ACTION */}
      <div className="nes-hall-of-fame-section">
        <button
          type="button"
          onClick={() => {
            sound.playKeypress();
            onOpenScoreboard();
          }}
          className="nes-hall-of-fame-btn"
          aria-label="Open Fleet Hall of Fame & Scoreboards"
        >
          <span className="trophy-badge">🏆</span>
          <span className="hof-btn-content">
            <span className="hof-btn-title">FLEET HALL OF FAME & RECORDS</span>
            <span className="hof-btn-subtitle">
              NAVIGATE LEVELS 1-5 • PC/MAC & SMARTPHONE STATS
            </span>
          </span>
          <span className="trophy-badge">🏆</span>
        </button>
      </div>

      {/* FOOTER COPYRIGHT */}
      <div className="nes-footer-credits">
        <div>
          {isMobile
            ? 'PUSH ANY BUTTON TO COMMENCE DIVE IMMEDIATELY'
            : 'TAP LEVEL TO DIVE • [1-5] SELECT • [ENTER] START'}
        </div>
        <div className="copyright-line">© 1984 RED OCTOBER FLEET CORP. • ALL RIGHTS RESERVED</div>
        <div className="nes-subtle-contact">
          <a href="mailto:mnewlund@gmail.com" className="subtle-email-link" title="Contact Developer">
            a great sub-spelling service provided by Nylle! email:mnewlund@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
