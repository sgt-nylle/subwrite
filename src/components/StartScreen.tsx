import React, { useEffect, useState } from 'react';
import { type HighScore } from '../data/submarineTexts';
import { APP_VERSION } from '../version';
import { ThemeSelector } from './ThemeSelector';
import { AVAILABLE_THEMES, type ThemeId, getTheme } from '../themes';
import { sound } from '../utils/audio';

interface StartScreenProps {
  selectedLevel: number;
  selectedLanguage: 'en' | 'sv';
  theme: ThemeId;
  isMobile: boolean;
  onSelectTheme: (theme: ThemeId) => void;
  onSelectLevel: (lvl: number) => void;
  onSelectLanguage: (lang: 'en' | 'sv') => void;
  onStartGame: (lvl?: number, lang?: 'en' | 'sv') => void;
  onOpenScoreboard: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedLevel,
  selectedLanguage,
  theme,
  isMobile,
  onSelectTheme,
  onSelectLevel,
  onSelectLanguage,
  onStartGame,
  onOpenScoreboard,
  soundEnabled,
  onToggleSound
}) => {
  const activeTheme = getTheme(theme);
  const [topScore, setTopScore] = useState<HighScore | null>(null);
  const targetDevice = isMobile ? 'mobile' : 'desktop';

  // Load top score for current theme & device to display on NES header (like classic "TOP - 050000")
  useEffect(() => {
    fetch(`/api/scores?theme=${activeTheme.id}&device=${targetDevice}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTopScore(data[0]);
        } else {
          const fallback = [...activeTheme.initialScores, ...activeTheme.initialMobileScores]
            .find(s => (s.device || 'desktop') === targetDevice);
          if (fallback) setTopScore(fallback);
        }
      })
      .catch(() => {
        try {
          const local = localStorage.getItem(`subwrite_high_scores_${activeTheme.id}_v2`);
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
        const fallback = [...activeTheme.initialScores, ...activeTheme.initialMobileScores]
          .find(s => (s.device || 'desktop') === targetDevice);
        if (fallback) setTopScore(fallback);
      });
  }, [activeTheme.id, activeTheme.initialScores, activeTheme.initialMobileScores, targetDevice]);

  // Keyboard navigation for NES style: Up/Down arrow moves level, Enter starts, 1-5 starts immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const lvl = parseInt(e.key, 10);
        sound.playLevelSelect();
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
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        sound.playLevelSelect();
        const currentIndex = AVAILABLE_THEMES.findIndex(t => t.id === theme);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : AVAILABLE_THEMES.length - 1;
        onSelectTheme(AVAILABLE_THEMES[prevIndex].id);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        sound.playLevelSelect();
        const currentIndex = AVAILABLE_THEMES.findIndex(t => t.id === theme);
        const nextIndex = currentIndex < AVAILABLE_THEMES.length - 1 ? currentIndex + 1 : 0;
        onSelectTheme(AVAILABLE_THEMES[nextIndex].id);
      } else if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playLevelSelect();
        onStartGame(selectedLevel);
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        sound.playKeypress();
        onSelectLanguage(selectedLanguage === 'en' ? 'sv' : 'en');
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onToggleSound();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        sound.playKeypress();
        onOpenScoreboard();
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        sound.playKeypress();
        onSelectLanguage('en');
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        sound.playKeypress();
        onSelectLanguage('sv');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLevel, theme, selectedLanguage, onSelectLevel, onSelectTheme, onStartGame, onOpenScoreboard, onSelectLanguage, onToggleSound]);

  const handleLevelClick = (lvl: number) => {
    sound.playLevelSelect();
    onSelectLevel(lvl);
    onStartGame(lvl);
  };

  const levelOptions = activeTheme.levels.map(l => ({
    lvl: l.level,
    label: `LEVEL ${l.level} [${l.level === 1 ? 'EASY' : l.level === 2 ? 'EASY-MED' : l.level === 3 ? 'MEDIUM' : l.level === 4 ? 'HARD' : 'SUPER HARD'}]`,
    role: l.name,
    desc: `${l.dimensionValue} • ${l.description}`
  }));

  return (
    <div className="nes-title-screen">
      {/* RETRO ARCADE THEME SELECTOR ROW (ABOVE TOP HUD) */}
      <ThemeSelector currentTheme={theme} onSelectTheme={onSelectTheme} />

      {/* NES TOP HUD (TOP SCORE & SOUND) */}
      <div className="nes-top-hud">
        <div className="nes-score-display">
          <span>TOP [{isMobile ? '📱 MOB' : '💻 PC'}] - </span>
          <span className="top-val">{topScore ? String(topScore.score).padStart(5, '0') : (isMobile ? '05200' : '08500')}</span>
          <span className="top-initials"> {topScore?.initials || (isMobile ? 'MOB' : 'RAM')}</span>
        </div>
        <div className="nes-hud-buttons">
          <button
            onClick={() => {
              sound.playKeypress();
              onSelectLanguage(selectedLanguage === 'en' ? 'sv' : 'en');
            }}
            className="nes-mini-btn nes-mini-lang-btn"
            type="button"
            title="Toggle Language [L]"
          >
            {selectedLanguage === 'en' ? '🇬🇧 ENGLISH [L]' : '🇸🇪 SVENSKA [L]'}
          </button>
          <button
            onClick={onOpenScoreboard}
            className="nes-mini-btn"
            type="button"
            title="Leaderboard & Hall of Fame [H]"
          >
            🏆 SCORES [H]
          </button>
          <button
            onClick={onToggleSound}
            className="nes-mini-btn"
            type="button"
            title="Toggle Audio [S]"
          >
            {soundEnabled ? '🔊 ON [S]' : '🔇 OFF [S]'}
          </button>
        </div>
      </div>

      {/* ICONIC NES LOGO & TITLE */}
      <div className="nes-logo-section">
        <div className="nes-star-flair">{activeTheme.flair} {activeTheme.flair} {activeTheme.flair}</div>
        <h1 className={`nes-main-title ${isMobile ? 'nes-main-title-mobile' : ''}`}>{activeTheme.title}</h1>
        <div className="nes-sub-banner">
          {activeTheme.subtitle}
        </div>
      </div>

      {/* 8-BIT THEME VEHICLE SPRITE */}
      <activeTheme.GraphicComponent />

      {/* PROMINENT ARCADE LANGUAGE SELECTOR PANEL */}
      <div className="nes-language-panel">
        <div className="nes-language-panel-header">
          <span className="lang-header-star">{activeTheme.flair}</span>
          <span className="lang-header-text">MISSION LANGUAGE / VÄLJ SPRÅK</span>
          <span className="lang-header-star">{activeTheme.flair}</span>
        </div>
        <div className="nes-language-options">
          <button
            type="button"
            className={`nes-lang-card-btn ${selectedLanguage === 'en' ? 'active-lang-card' : ''}`}
            onClick={() => {
              sound.playKeypress();
              onSelectLanguage('en');
            }}
            aria-pressed={selectedLanguage === 'en'}
          >
            <span className="lang-flag-icon">🇬🇧</span>
            <div className="lang-card-info">
              <span className="lang-primary-title">ENGLISH</span>
              <span className="lang-sub-title">{activeTheme.langSubTitleEn}</span>
            </div>
            <span className="lang-status-badge">
              {selectedLanguage === 'en' ? '► ACTIVE ◄' : 'SELECT [L]'}
            </span>
          </button>
          <button
            type="button"
            className={`nes-lang-card-btn ${selectedLanguage === 'sv' ? 'active-lang-card' : ''}`}
            onClick={() => {
              sound.playKeypress();
              onSelectLanguage('sv');
            }}
            aria-pressed={selectedLanguage === 'sv'}
          >
            <span className="lang-flag-icon">🇸🇪</span>
            <div className="lang-card-info">
              <span className="lang-primary-title">SVENSKA</span>
              <span className="lang-sub-title">{activeTheme.langSubTitleSv}</span>
            </div>
            <span className="lang-status-badge">
              {selectedLanguage === 'sv' ? '► ACTIVE ◄' : 'VÄLJ [L]'}
            </span>
          </button>
        </div>
      </div>

      {/* TACTILE NES/ARCADE PUSH START BUTTON */}
      <div className="nes-start-control-area">
        <button
          type="button"
          className="nes-push-button"
          onClick={() => {
            sound.playLevelSelect();
            onStartGame(selectedLevel);
          }}
          aria-label={isMobile ? `Push to ${activeTheme.actionWord.toLowerCase()} at level ${selectedLevel}` : `Push to start at level ${selectedLevel}`}
        >
          <span className="push-btn-content">
            <span className="push-btn-arrows">►</span>
            <span className="push-btn-text">
              {isMobile ? `PUSH TO ${activeTheme.actionWord}` : 'PUSH START'}
            </span>
            <span className="push-btn-lvl-tag">[LVL {selectedLevel}]</span>
            <span className="push-btn-arrows">◄</span>
          </span>
          <span className="push-btn-subtext">
            {isMobile
              ? `ONE TOUCH TO ${activeTheme.actionWordLong}`
              : 'COMMENCE MISSION • [ENTER]'}
          </span>
        </button>
      </div>

      {/* NES LEVEL SELECT MENU WITH CURSOR */}
      <div className="nes-menu-box">
        <div className="nes-menu-header">
          {isMobile ? '-- PUSH ANY BUTTON TO START IMMEDIATELY --' : '-- SELECT LEVEL TO START IMMEDIATELY --'}
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
                <div className="nes-menu-item-content">
                  <div className="nes-menu-item-main">
                    <span className="nes-cursor">{isCurrent ? '►' : '\u00A0'}</span>
                    <span className="nes-item-text">{opt.label}</span>
                    <span className="nes-item-role-tag">[{opt.role}]</span>
                  </div>
                  <div className="nes-item-desc">{opt.desc}</div>
                </div>
                <span className="nes-quick-dive-badge">
                  {isMobile
                    ? `PUSH TO ${activeTheme.actionWord}`
                    : activeTheme.actionWord}
                </span>
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
          aria-label={`Open ${activeTheme.groupLabel} Hall of Fame & Scoreboards`}
        >
          <span className="trophy-badge">🏆</span>
          <span className="hof-btn-content">
            <span className="hof-btn-title">{activeTheme.groupLabel} HALL OF FAME & RECORDS</span>
            <span className="hof-btn-subtitle">
              NAVIGATE LEVELS 1-5 • PC/MAC & SMARTPHONE STATS
            </span>
          </span>
          <span className="trophy-badge">🏆</span>
        </button>
      </div>

      {/* FOOTER COPYRIGHT */}
      <div className="nes-footer-credits">
        <div className="nes-footer-prompt">PRESS ENTER TO LAUNCH</div>
        <footer className="footer">
          <p>© 2026 SUBWRITE <span className="footer-version">{APP_VERSION}</span> // CLASSIFIED RETRO SYSTEMS</p>
          <p>
            SOURCE CODE & DISPATCH:{' '}
            <a
              href="https://github.com/sgt-nylle/subwrite"
              target="_blank"
              rel="noopener noreferrer"
            >
              [ GITHUB REPO ]
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StartScreen;
