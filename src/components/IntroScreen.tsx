import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GotlandSubmarine } from './GotlandSubmarine';
import { APP_VERSION } from '../version';
import { sound } from '../utils/audio';

export const INTRO_SESSION_KEY = 'subwrite_intro_seen';

interface IntroScreenProps {
  isMobile: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onEnterGame: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  isMobile,
  soundEnabled,
  onToggleSound,
  onEnterGame,
}) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const launchTimerRef = useRef<number | null>(null);

  const markIntroSeen = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  const triggerStart = useCallback(() => {
    if (isLaunching) return;
    setIsLaunching(true);
    markIntroSeen();
    sound.playStartGame();

    // Classic NES rapid flash before cutting to Main Menu
    launchTimerRef.current = window.setTimeout(() => {
      onEnterGame();
    }, 280);
  }, [isLaunching, markIntroSeen, onEnterGame]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      markIntroSeen();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (launchTimerRef.current) {
        clearTimeout(launchTimerRef.current);
      }
    };
  }, [markIntroSeen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        triggerStart();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onToggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerStart, onToggleSound]);

  return (
    <div className="nes-intro-screen">
      <span className="nes-intro-corner corner-tl" aria-hidden="true">+</span>
      <span className="nes-intro-corner corner-tr" aria-hidden="true">+</span>
      <span className="nes-intro-corner corner-bl" aria-hidden="true">+</span>
      <span className="nes-intro-corner corner-br" aria-hidden="true">+</span>

      {/* Minimal NES Cartridge Top Bar */}
      <div className="nes-intro-topbar">
        <span className="nes-intro-cart-code">SGT.MOON-SW-2026 - 1 PLAYER</span>
        <button
          type="button"
          onClick={onToggleSound}
          className="nes-mini-btn nes-intro-sound-btn"
          title="Toggle Audio [S]"
        >
          {soundEnabled ? '🔊 SFX [S]' : '🔇 MUTE [S]'}
        </button>
      </div>

      {/* Centerpiece Logo + 8-Bit Submarine + Brief Description + Start Button */}
      <div className="nes-intro-center">
        <div className="nes-intro-logo-block">
          <div className="nes-star-flair nes-intro-stars">★ ★ ★</div>
          <h1 className={`nes-intro-title ${isMobile ? 'nes-intro-title-mobile' : ''}`}>
            SUBWRITE!
          </h1>
          <div className="nes-intro-badge">RETRO TYPING CHALLENGE</div>
        </div>

        <div className="nes-intro-sprite-stage">
          <GotlandSubmarine className="nes-intro-sub" />
        </div>

        <p className="nes-intro-description">
          Test your keyboard speed and accuracy across 4 retro tactical themes and 5 difficulty
          depths. Beat the countdown drain, avoid typos, and claim your 3-letter callsign on the
          global leaderboard.
        </p>

        <div className="nes-intro-cta-wrap">
          <button
            type="button"
            onClick={triggerStart}
            disabled={isLaunching}
            className={`nes-intro-start-btn ${isLaunching ? 'nes-intro-launching' : ''}`}
            aria-label="Start SubWrite"
          >
            <span className="nes-intro-btn-main">
              <span className="nes-intro-arrow">►</span>
              <span>START GAME</span>
              <span className="nes-intro-arrow">◄</span>
            </span>
            <span className="nes-intro-btn-hint">
              {isMobile ? 'TAP TO POWER ON' : 'PRESS [ENTER] TO START'}
            </span>
          </button>
        </div>
      </div>

      {/* Provider Credit + Classic NES Copyright Line */}
      <div className="nes-intro-bottom">
        <div className="nes-intro-provider">
          Provided by{' '}
          <a
            href="https://github.com/sgt-nylle/subwrite"
            target="_blank"
            rel="noopener noreferrer"
            className="nes-intro-provider-link"
          >
            Sgt.Moon
          </a>
        </div>
        <footer className="nes-intro-footer">
          <span>© 2026 SUBWRITE.SE</span>
          <span className="nes-intro-dot">•</span>
          <span>{APP_VERSION}</span>
        </footer>
      </div>
    </div>
  );
};

export default IntroScreen;
