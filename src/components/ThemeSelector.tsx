import React from 'react';
import { AVAILABLE_THEMES, type ThemeId } from '../themes';
import { sound } from '../utils/audio';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  className = ''
}) => {
  return (
    <div className={`retro-theme-selector-bar ${className}`}>
      <div className="theme-selector-label">
        <span className="theme-selector-star">★</span>
        <span className="theme-selector-title">OPERATIONAL THEME:</span>
        <span className="theme-selector-shortcut">[◀ / ▶]</span>
      </div>
      <div className="theme-selector-buttons">
        {AVAILABLE_THEMES.map(t => {
          const isActive = t.id === currentTheme;
          return (
            <button
              key={t.id}
              type="button"
              className={`retro-theme-btn theme-btn-${t.id} ${isActive ? 'active-theme-btn' : ''}`}
              onClick={() => {
                if (t.id !== currentTheme) {
                  sound.playLevelSelect();
                  onSelectTheme(t.id);
                }
              }}
              aria-pressed={isActive}
              title={`Switch operational theme to ${t.name}`}
            >
              <span className="theme-btn-icon">{t.icon}</span>
              <span className="theme-btn-name">{t.name}</span>
              {isActive && <span className="theme-active-indicator">◄ ACTIVE</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
