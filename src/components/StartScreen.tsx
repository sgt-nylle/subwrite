import React, { useEffect } from 'react';
import { SUBMARINE_LEVELS } from '../data/submarineTexts';
import { SubmarineGraphic } from './SubmarineGraphic';
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
  const currentLvlData = SUBMARINE_LEVELS.find(l => l.level === selectedLevel) || SUBMARINE_LEVELS[0];

  // Listen for Enter or Space or keys 1-5 to navigate directly from keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const lvl = parseInt(e.key, 10);
        sound.playLevelSelect();
        onSelectLevel(lvl);
      } else if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playSonarPing();
        onStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectLevel, onStartGame]);

  return (
    <div className="c64-start-screen">
      {/* C64 BOOTSTRAP HEADER */}
      <div className="c64-boot-lines">
        <div className="boot-line">**** COMMODORE 64 BASIC V2 (RED OCTOBER EDITION) ****</div>
        <div className="boot-line">64K RAM SYSTEM  38911 BASIC BYTES FREE</div>
        <div className="boot-line command-line">
          LOAD &quot;SUBWRITE&quot;,8,1 &nbsp;►&nbsp; <span className="ready-text">READY.</span>
        </div>
      </div>

      {/* TOP CONTROLS */}
      <div className="start-top-controls">
        <button
          onClick={onOpenScoreboard}
          className="retro-header-btn"
          type="button"
        >
          🏆 FLEET LOGS
        </button>
        <button
          onClick={onToggleSound}
          className="retro-header-btn"
          type="button"
        >
          {soundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF'}
        </button>
      </div>

      {/* MAIN TITLE BLOCK */}
      <div className="start-hero-title">
        <div className="hero-emblem">
          <span className="soviet-star-large">★</span>
        </div>
        <h1 className="main-logo-text">subwrite.se</h1>
        <div className="main-tagline">
          <span className="tag-bracket">[</span> a submarine text tester! <span className="tag-bracket">]</span>
        </div>
        <p className="start-sub-caption">
          TEST YOUR KEYBOARD SPEED &amp; ACCURACY THROUGH CLASSIFIED COLD WAR SUBMARINE ARTICLES
        </p>
      </div>

      {/* SUBMARINE GRAPHIC */}
      <div className="start-sub-display c64-box">
        <SubmarineGraphic />
      </div>

      {/* LEVEL SELECTOR (1 - 5: EASY TO HARD) */}
      <div className="start-level-section c64-box">
        <div className="level-section-header">
          <span className="radar-blip">●</span>
          <span>SELECT COMBAT DIVE DIFFICULTY [ 1 - 5 ]:</span>
          <span className="radar-blip">●</span>
        </div>

        <div className="start-level-cards-grid">
          {SUBMARINE_LEVELS.map((lvl) => {
            const isSelected = lvl.level === selectedLevel;
            const diffTag = lvl.level === 1 ? 'EASY' : lvl.level === 2 ? 'EASY-MED' : lvl.level === 3 ? 'MEDIUM' : lvl.level === 4 ? 'HARD' : 'SUPER HARD';
            
            return (
              <div
                key={lvl.level}
                onClick={() => {
                  sound.playLevelSelect();
                  onSelectLevel(lvl.level);
                }}
                className={`start-level-card ${isSelected ? 'card-selected' : ''}`}
              >
                <div className="card-top">
                  <span className="card-lvl-badge">LVL {lvl.level}</span>
                  <span className={`diff-pill diff-${lvl.level}`}>{diffTag}</span>
                </div>
                <div className="card-rank">{lvl.name}</div>
                <div className="card-depth">DEPTH: {lvl.depth}</div>
                <div className="card-mult">SCORE: {lvl.multiplier}x</div>
                <div className="card-desc">{lvl.description}</div>
              </div>
            );
          })}
        </div>

        <div className="selected-level-banner">
          <span className="star-mini">★</span> ACTIVE ORDERS: <strong>LEVEL {selectedLevel} ({currentLvlData.name})</strong> — {currentLvlData.description}
        </div>
      </div>

      {/* MISSION ENGAGE LAUNCH BUTTON */}
      <div className="start-action-row">
        <button
          onClick={() => {
            sound.playSonarPing();
            onStartGame();
          }}
          className="start-dive-btn retro-btn btn-danger large-btn"
          type="button"
        >
          ▶ ENGAGE MISSION (START TYPING TEST)
        </button>
        <div className="start-keyboard-tip">
          PRESS <strong>[1 - 5]</strong> TO SELECT LEVEL • PRESS <strong>[ENTER]</strong> OR <strong>[SPACE]</strong> TO DIVE
        </div>
      </div>
    </div>
  );
};
