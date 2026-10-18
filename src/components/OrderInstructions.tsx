import React, { useEffect, useRef, useCallback } from 'react';
import { type ThemeId, getTheme } from '../themes';
import { sound } from '../utils/audio';

interface OrderInstructionsProps {
  theme: ThemeId;
  language: 'en' | 'sv';
  onClose: () => void;
  onStartGame?: (lvl?: number, lang?: 'en' | 'sv') => void;
  onSelectLanguage?: (lang: 'en' | 'sv') => void;
}

export const OrderInstructions: React.FC<OrderInstructionsProps> = ({
  theme,
  language,
  onClose,
  onStartGame,
  onSelectLanguage
}) => {
  const activeTheme = getTheme(theme);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-focus the back button on mount so ESC or Enter works immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      backBtnRef.current?.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleLanguage = useCallback(() => {
    sound.playKeypress();
    const nextLang = language === 'en' ? 'sv' : 'en';
    onSelectLanguage?.(nextLang);
  }, [language, onSelectLanguage]);

  // Keyboard navigation: ESC exits to menu, L toggles language, Enter starts game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'i' || e.key === 'I' || e.code === 'KeyI') {
        e.preventDefault();
        sound.playKeypress();
        onClose();
        return;
      }

      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleToggleLanguage();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        sound.playLevelSelect();
        if (onStartGame) {
          onStartGame(1, language);
        } else {
          onClose();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onStartGame, language, handleToggleLanguage]);

  const isEn = language === 'en';

  return (
    <div
      className="retro-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="retro-instructions-container c64-box" tabIndex={-1}>
        {/* HEADER BANNER */}
        <div className="c64-header-banner">
          <span className="star-icon">{activeTheme.flair}</span>
          <h2>
            {isEn ? `ORDER INSTRUCTIONS // ${activeTheme.title} MANUAL` : `ORDERINSTRUKTIONER // ${activeTheme.title} MANUAL`}
          </h2>
          <span className="star-icon">{activeTheme.flair}</span>
        </div>

        <div className="instructions-sub-banner">
          <span>{isEn ? 'TACTICAL BRIEFING: OBJECTIVE • SCORING ALGORITHM • KEYBOARD MAPPINGS' : 'TAKTISK BRIEFING: UPPDRAG • POÄNGSYSTEM • TANGENTBORDSKOMMANDON'}</span>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="instructions-content">
          {/* 1. THE MISSION */}
          <section className="instructions-section">
            <div className="instructions-section-header">
              <span className="section-bullet">►</span>
              <h3>{isEn ? '1. THE MISSION (TYPE FAST & ACCURATELY)' : '1. UPPDRAGET (SKRIV SNABBT OCH KORREKT)'}</h3>
            </div>
            <div className="instructions-card">
              <p className="instructions-lead">
                {isEn
                  ? 'Your objective is simple yet rigorous: transcribe incoming tactical transmissions with maximum typing speed and zero errors before your mission time expires.'
                  : 'Ditt uppdrag är enkelt men krävande: skriv av inkommande taktiska meddelanden med maximal hastighet och noll fel innan din uppdragstid tar slut.'}
              </p>

              <div className="levels-guide-grid">
                <div className="level-guide-item">
                  <span className="lvl-badge">LVL 1</span>
                  <div className="lvl-guide-text">
                    <strong>{isEn ? 'Cadet (50% Length - 250 Chars)' : 'Kadett (50% Längd - 250 Tecken)'}</strong>
                    <p>{isEn ? 'Basic lowercase vocabulary, periods only. Limit: 4:00 min.' : 'Enkelt ordförråd, enbart punkter. Tid: 4:00 min.'}</p>
                  </div>
                </div>
                <div className="level-guide-item">
                  <span className="lvl-badge">LVL 2</span>
                  <div className="lvl-guide-text">
                    <strong>{isEn ? 'Technician (60% Length - 300 Chars)' : 'Tekniker (60% Längd - 300 Tecken)'}</strong>
                    <p>{isEn ? 'Compound sentences, proper nouns, and commas. Limit: 4:00 min.' : 'Sammansatta meningar, egennamn och kommatecken. Tid: 4:00 min.'}</p>
                  </div>
                </div>
                <div className="level-guide-item">
                  <span className="lvl-badge">LVL 3</span>
                  <div className="lvl-guide-text">
                    <strong>{isEn ? 'Officer (70% Length - 350 Chars)' : 'Officer (70% Längd - 350 Tecken)'}</strong>
                    <p>{isEn ? 'Operational history, fleet doctrine, semicolons. Limit: 4:00 min.' : 'Operativ historia, doktrin och semikolon. Tid: 4:00 min.'}</p>
                  </div>
                </div>
                <div className="level-guide-item">
                  <span className="lvl-badge">LVL 4</span>
                  <div className="lvl-guide-text">
                    <strong>{isEn ? 'Chief Specialist (90% Length - 450 Chars)' : 'Chefsingenjör (90% Längd - 450 Tecken)'}</strong>
                    <p>{isEn ? 'Technical specs, power ratings, numbers, and metric units. Limit: 5:00 min.' : 'Tekniska data, siffror, datum och måttenheter. Tid: 5:00 min.'}</p>
                  </div>
                </div>
                <div className="level-guide-item">
                  <span className="lvl-badge">LVL 5</span>
                  <div className="lvl-guide-text">
                    <strong>{isEn ? 'Commander (100% Length - 500 Chars)' : 'Befälhavare (100% Längd - 500 Tecken)'}</strong>
                    <p>{isEn ? 'Tactical dialogues, single quotes, colons, complex punctuation. Limit: 5:00 min.' : 'Taktiska dialoger, citattecken, kolon och symboler. Tid: 5:00 min.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. HOW THE POINT SYSTEM WORKS */}
          <section className="instructions-section">
            <div className="instructions-section-header">
              <span className="section-bullet">►</span>
              <h3>{isEn ? '2. THE POINT SYSTEM (HOW SCORES WORK)' : '2. POÄNGSYSTEMET (SÅ BERÄKNAS DINA POÄNG)'}</h3>
            </div>
            <div className="instructions-card">
              <div className="formula-callout">
                <span className="formula-tag">{isEn ? 'FINAL SCORE FORMULA' : 'FORMLER FÖR SLUTPOÄNG'}</span>
                <code>SCORE = MAX(0, RESERVE - TIME_DRAIN - ERROR_PENALTY + PRECISION_BONUS)</code>
              </div>

              <div className="scoring-pillars-grid">
                <div className="scoring-pillar">
                  <div className="pillar-title">
                    <span className="pillar-icon">💰</span>
                    <h4>{isEn ? '1. MISSION RESERVE' : '1. STARTRESERV'}</h4>
                  </div>
                  <div className="pillar-formula">
                    <code>(Chars × 25) + (Level × 2500)</code>
                  </div>
                  <p>
                    {isEn
                      ? 'Every mission begins with a massive point pool scaled to text length and difficulty level.'
                      : 'Varje uppdrag inleds med en stor poängreserv baserad på textens längd och vald svårighetsgrad.'}
                  </p>
                </div>

                <div className="scoring-pillar">
                  <div className="pillar-title">
                    <span className="pillar-icon">⏱️</span>
                    <h4>{isEn ? '2. TIME DRAIN' : '2. TIDSAVDRAG'}</h4>
                  </div>
                  <div className="pillar-formula">
                    <code>20 + (Level × 10) PTS/SEC</code>
                  </div>
                  <p>
                    {isEn
                      ? 'Time is points! Points continuously drain every second (30 to 70 pts/sec). Typing faster saves more points.'
                      : 'Tid är poäng! Poäng dras löpande varje sekund (30 till 70 p/s). Ju snabbare du skriver, desto fler poäng räddar du.'}
                  </p>
                </div>

                <div className="scoring-pillar">
                  <div className="pillar-title">
                    <span className="pillar-icon">⚠️</span>
                    <h4>{isEn ? '3. ERROR PENALTY' : '3. FELSTRAFF'}</h4>
                  </div>
                  <div className="pillar-formula">
                    <code>-100 PTS PER ERROR</code>
                  </div>
                  <p>
                    {isEn
                      ? 'Typing errors deduct 100 points per misstyped or continued character from your mission pool.'
                      : 'Feltryckningar medför 100 minuspoäng per felaktigt eller fortsatt felaktigt tecken.'}
                  </p>
                </div>

                <div className="scoring-pillar">
                  <div className="pillar-title">
                    <span className="pillar-icon">🎯</span>
                    <h4>{isEn ? '4. PRECISION BONUS' : '4. PRECISIONSBONUS'}</h4>
                  </div>
                  <div className="pillar-formula">
                    <code>+4,000 PTS (≤1 ERROR)</code>
                  </div>
                  <p>
                    {isEn
                      ? 'Transcribe with pinpoint accuracy: finish with 1 or zero total errors to secure a huge +4,000 bonus!'
                      : 'Skriv med kirurgisk precision: slutför med högst 1 fel (eller 0 fel) för en bonus på hela +4 000 poäng!'}
                  </p>
                </div>
              </div>

              <div className="telemetry-info-box">
                <strong>{isEn ? 'TELEMETRY METRICS:' : 'TELEMETRIMÅTT:'}</strong>
                <span>• <strong>WPM:</strong> (Characters ÷ 5) ÷ Minutes</span>
                <span>• <strong>ACCURACY:</strong> (Clean Hits ÷ Total Strokes) × 100%</span>
                <span>• <strong>BONUS:</strong> +4000 PTS (≤1 error)</span>
              </div>
            </div>
          </section>

          {/* 3. KEYBOARD COMMANDS */}
          <section className="instructions-section">
            <div className="instructions-section-header">
              <span className="section-bullet">►</span>
              <h3>{isEn ? '3. KEYBOARD CONTROLS & COMMANDS' : '3. TANGENTBORDSKOMMANDON & STYRNING'}</h3>
            </div>
            <div className="instructions-card">
              <div className="key-commands-grid">
                <div className="command-category">
                  <h4>{isEn ? 'UNIVERSAL / GLOBAL' : 'ÖVERGRIPANDE'}</h4>
                  <div className="key-item">
                    <kbd>ESC</kbd>
                    <span>{isEn ? 'Universal Back / Exit to Main Menu' : 'Tillbaka / Avbryt till Huvudmenyn'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>S</kbd>
                    <span>{isEn ? 'Toggle Audio & Sound Effects (ON / OFF)' : 'Slå på / av ljudeffekter (PÅ / AV)'}</span>
                  </div>
                </div>

                <div className="command-category">
                  <h4>{isEn ? 'MAIN MENU' : 'HUVUDMENY'}</h4>
                  <div className="key-item">
                    <kbd>ENTER</kbd> / <kbd>SPACE</kbd>
                    <span>{isEn ? 'Launch mission with selected settings' : 'Starta uppdrag med valda inställningar'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>←</kbd> <kbd>→</kbd>
                    <span>{isEn ? 'Cycle operational themes (Submarine, Air Force, Army, Pub)' : 'Byt tema (Ubåt, Flygvapen, Armé, Pub)'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>↑</kbd> <kbd>↓</kbd>
                    <span>{isEn ? 'Cycle difficulty level (1 to 5)' : 'Byt svårighetsgrad (1 till 5)'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>1</kbd> - <kbd>5</kbd>
                    <span>{isEn ? 'Instantly select level and launch game' : 'Välj nivå och starta spelet direkt'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>L</kbd>
                    <span>{isEn ? 'Toggle language (English / Svenska)' : 'Växla språk (English / Svenska)'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>H</kbd>
                    <span>{isEn ? 'Open Hall of Fame / High Scores' : 'Öppna topplistan / Toppresultat'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>I</kbd>
                    <span>{isEn ? 'Open these Order Instructions' : 'Öppna dessa orderinstruktioner'}</span>
                  </div>
                </div>

                <div className="command-category">
                  <h4>{isEn ? 'IN-GAME TYPING ARENA' : 'UNDER PÅGÅENDE SPEL'}</h4>
                  <div className="key-item">
                    <kbd>ANY KEY</kbd>
                    <span>{isEn ? 'Auto-focus typing arena (no mouse click needed)' : 'Autofokus i skrivfältet (inget klick behövs)'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>ENTER</kbd>
                    <span>{isEn ? 'Restart mission with a new random passage' : 'Starta om uppdraget med en ny slumpad text'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>ESC</kbd>
                    <span>{isEn ? 'Abort current game and return to Main Menu' : 'Avbryt pågående spel till Huvudmenyn'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>1</kbd> - <kbd>5</kbd>
                    <span>{isEn ? 'Change level before typing commences' : 'Byt nivå innan du börjar skriva'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>BACKSPACE</kbd>
                    <span>{isEn ? 'Delete mistake from end of input' : 'Radera felaktigt tecken från slutet'}</span>
                  </div>
                </div>

                <div className="command-category">
                  <h4>{isEn ? 'SCOREBOARD / POST-GAME' : 'TOPPLISTA & EFTER SPEL'}</h4>
                  <div className="key-item">
                    <kbd>ENTER</kbd>
                    <span>{isEn ? 'Submit 3-letter initials, then start next mission' : 'Spara initialer och starta nästa uppdrag'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>←</kbd> <kbd>→</kbd> / <kbd>↑</kbd> <kbd>↓</kbd>
                    <span>{isEn ? 'Change target level for next mission' : 'Ändra målnivå för nästa uppdrag'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>1</kbd> - <kbd>5</kbd>
                    <span>{isEn ? 'Direct jump to level on leaderboard' : 'Hoppa direkt till nivå på topplistan'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>L</kbd>
                    <span>{isEn ? 'Toggle language for upcoming game' : 'Växla språk inför nästa omgång'}</span>
                  </div>
                  <div className="key-item">
                    <kbd>ESC</kbd>
                    <span>{isEn ? 'Close scoreboard and return to Main Menu' : 'Stäng topplistan och återgå till menyn'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="instructions-actions">
          <button
            ref={backBtnRef}
            onClick={onClose}
            className="retro-btn btn-danger large-btn"
            type="button"
            title="Return to Main Menu [ESC / I]"
          >
            ◄ {isEn ? 'MAIN MENU [ESC]' : 'HUVUDMENY [ESC]'}
          </button>
          <button
            onClick={handleToggleLanguage}
            className="retro-btn btn-lang-toggle"
            type="button"
            title="Toggle Language [L]"
          >
            {isEn ? '🇬🇧 EN [L]' : '🇸🇪 SV [L]'}
          </button>
          {onStartGame && (
            <button
              onClick={() => {
                sound.playLevelSelect();
                onStartGame(1, language);
              }}
              className="retro-btn btn-warning"
              type="button"
              title="Commence Mission [ENTER]"
            >
              ▶ {isEn ? 'START GAME [ENTER]' : 'STARTA SPEL [ENTER]'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderInstructions;
