import { type ThemeConfig } from './types';
import { PubBeerDesk } from '../components/PubBeerDesk';
import pubPassagesData from '../data/pubPassages.json' with { type: 'json' };
import pubPassagesDataSV from '../data/pubPassages_sv.json' with { type: 'json' };
import { type HighScore } from '../data/submarineTexts';

export const getPubPassages = (lvl: number, lang: 'en' | 'sv'): string[] => {
  const data = lang === 'sv' ? pubPassagesDataSV : pubPassagesData;
  switch (lvl) {
    case 1: return data.level1;
    case 2: return data.level2;
    case 3: return data.level3;
    case 4: return data.level4;
    case 5: return data.level5;
    default: return data.level1;
  }
};

export const INITIAL_PUB_HIGH_SCORES: HighScore[] = [
  // Level 5 - ROCK LEGEND
  { id: "pb501", initials: "BAR", score: 8800, wpm: 96, accuracy: 98, level: 5, device: "desktop", failedChars: 2, date: "2026-10-15" },
  { id: "pb502", initials: "RCK", score: 7950, wpm: 90, accuracy: 97, level: 5, device: "desktop", failedChars: 4, date: "2026-10-15" },
  { id: "pb503", initials: "ALE", score: 7250, wpm: 84, accuracy: 96, level: 5, device: "desktop", failedChars: 5, date: "2026-10-16" },

  // Level 4 - ROCK GUITARIST
  { id: "pb401", initials: "JCM", score: 6450, wpm: 87, accuracy: 96, level: 4, device: "desktop", failedChars: 3, date: "2026-10-15" },
  { id: "pb402", initials: "IPA", score: 5650, wpm: 81, accuracy: 95, level: 4, device: "desktop", failedChars: 5, date: "2026-10-15" },
  { id: "pb403", initials: "STR", score: 5150, wpm: 75, accuracy: 94, level: 4, device: "desktop", failedChars: 6, date: "2026-10-16" },

  // Level 3 - BREWMASTER
  { id: "pb301", initials: "DRF", score: 5000, wpm: 78, accuracy: 95, level: 3, device: "desktop", failedChars: 4, date: "2026-10-15" },
  { id: "pb302", initials: "HOP", score: 4300, wpm: 73, accuracy: 94, level: 3, device: "desktop", failedChars: 6, date: "2026-10-15" },
  { id: "pb303", initials: "GIB", score: 3850, wpm: 69, accuracy: 93, level: 3, device: "desktop", failedChars: 7, date: "2026-10-16" },

  // Level 2 - PUB BARTENDER
  { id: "pb201", initials: "TAP", score: 3400, wpm: 71, accuracy: 93, level: 2, device: "desktop", failedChars: 5, date: "2026-10-15" },
  { id: "pb202", initials: "PUB", score: 2980, wpm: 65, accuracy: 92, level: 2, device: "desktop", failedChars: 6, date: "2026-10-15" },
  { id: "pb203", initials: "STP", score: 2580, wpm: 61, accuracy: 91, level: 2, device: "desktop", failedChars: 8, date: "2026-10-16" },

  // Level 1 - BAR REGULAR
  { id: "pb101", initials: "PIN", score: 2500, wpm: 63, accuracy: 93, level: 1, device: "desktop", failedChars: 3, date: "2026-10-15" },
  { id: "pb102", initials: "KEG", score: 2100, wpm: 55, accuracy: 91, level: 1, device: "desktop", failedChars: 5, date: "2026-10-15" },
  { id: "pb103", initials: "MUG", score: 1750, wpm: 49, accuracy: 90, level: 1, device: "desktop", failedChars: 6, date: "2026-10-16" }
];

export const INITIAL_PUB_MOBILE_HIGH_SCORES: HighScore[] = [
  // Level 5 - ROCK LEGEND (Mobile)
  { id: "pbm501", initials: "BAR", score: 5450, wpm: 59, accuracy: 95, level: 5, device: "mobile", failedChars: 4, date: "2026-10-15" },
  { id: "pbm502", initials: "RCK", score: 4850, wpm: 53, accuracy: 94, level: 5, device: "mobile", failedChars: 6, date: "2026-10-15" },
  { id: "pbm503", initials: "ALE", score: 4350, wpm: 48, accuracy: 93, level: 5, device: "mobile", failedChars: 7, date: "2026-10-16" },

  // Level 4 - ROCK GUITARIST (Mobile)
  { id: "pbm401", initials: "IPA", score: 4100, wpm: 51, accuracy: 94, level: 4, device: "mobile", failedChars: 5, date: "2026-10-15" },
  { id: "pbm402", initials: "JCM", score: 3600, wpm: 45, accuracy: 93, level: 4, device: "mobile", failedChars: 6, date: "2026-10-15" },
  { id: "pbm403", initials: "STR", score: 3200, wpm: 41, accuracy: 92, level: 4, device: "mobile", failedChars: 8, date: "2026-10-16" },

  // Level 3 - BREWMASTER (Mobile)
  { id: "pbm301", initials: "DRF", score: 3300, wpm: 47, accuracy: 93, level: 3, device: "mobile", failedChars: 5, date: "2026-10-15" },
  { id: "pbm302", initials: "HOP", score: 2900, wpm: 42, accuracy: 92, level: 3, device: "mobile", failedChars: 7, date: "2026-10-15" },
  { id: "pbm303", initials: "GIB", score: 2500, wpm: 38, accuracy: 91, level: 3, device: "mobile", failedChars: 9, date: "2026-10-16" },

  // Level 2 - PUB BARTENDER (Mobile)
  { id: "pbm201", initials: "TAP", score: 2300, wpm: 41, accuracy: 91, level: 2, device: "mobile", failedChars: 6, date: "2026-10-15" },
  { id: "pbm202", initials: "PUB", score: 2000, wpm: 37, accuracy: 90, level: 2, device: "mobile", failedChars: 8, date: "2026-10-15" },
  { id: "pbm203", initials: "STP", score: 1750, wpm: 33, accuracy: 89, level: 2, device: "mobile", failedChars: 10, date: "2026-10-16" },

  // Level 1 - BAR REGULAR (Mobile)
  { id: "pbm101", initials: "PIN", score: 1650, wpm: 39, accuracy: 90, level: 1, device: "mobile", failedChars: 5, date: "2026-10-15" },
  { id: "pbm102", initials: "KEG", score: 1400, wpm: 33, accuracy: 89, level: 1, device: "mobile", failedChars: 7, date: "2026-10-15" },
  { id: "pbm103", initials: "MUG", score: 1200, wpm: 29, accuracy: 88, level: 1, device: "mobile", failedChars: 8, date: "2026-10-16" }
];

export const pubTheme: ThemeConfig = {
  id: 'pub',
  name: 'PUBWRITE',
  icon: '🍺',
  flair: '🍻',
  title: 'PUBWRITE!',
  subtitle: 'subwrite.se - your personal off-duty pub & rock type challenge!',
  vesselLabel: 'STATION',
  vesselName: 'OFF-DUTY TAVERN',
  dimensionLabel: 'ROUNDS',
  badgeText: '🍺 OFF-DUTY PUB • COLD DRAUGHT LAGER • MAHOGANY BARDESK',
  groupLabel: 'PATRONS',
  actionWord: 'CHUG',
  actionWordLong: 'ORDER A ROUND',
  langSubTitleEn: 'Beer & Rock Archives',
  langSubTitleSv: 'Öl & Rockhistoria',
  progressStatusText: 'DRAUGHT POURING • TAPPING KEG...',
  levelHeaderLabel: 'OFF-DUTY ROUND LEVEL',
  levels: [
    {
      level: 1,
      name: 'BAR REGULAR',
      rank: 'Off-Duty Conscript / Table 1',
      dimensionValue: '1 PINT',
      description: 'Cold draught pilsner on tap, classic pub snacks, and jukebox selections.',
      multiplier: 1.0
    },
    {
      level: 2,
      name: 'PUB BARTENDER',
      rank: 'Craft Pourer / Tap Master',
      dimensionValue: '3 PINTS',
      description: 'Draft beer systems, IPA hops, foam head pouring, and cellar kegs.',
      multiplier: 1.5
    },
    {
      level: 3,
      name: 'BREWMASTER',
      rank: 'Head Brewer / Cask Keeper',
      dimensionValue: '6 PINTS',
      description: 'Malt fermentation, Bavarian Reinheitsgebot, dry-hopping, and Trappist ales.',
      multiplier: 2.2
    },
    {
      level: 4,
      name: 'ROCK GUITARIST',
      rank: 'Riff Slinger / Stage Lead',
      dimensionValue: '10 PINTS',
      description: 'Overdriven Marshall stacks, Fender Stratocaster riffs, and power chords.',
      multiplier: 3.2
    },
    {
      level: 5,
      name: 'ROCK LEGEND',
      rank: 'Pub Rock Hall of Fame',
      dimensionValue: '15 PINTS (LAST CALL)',
      description: 'Stadium anthems, dual lead solos, thunderous bass lines, and rock immortality.',
      multiplier: 5.0
    }
  ],
  getPassages: getPubPassages,
  GraphicComponent: PubBeerDesk,
  initialScores: INITIAL_PUB_HIGH_SCORES,
  initialMobileScores: INITIAL_PUB_MOBILE_HIGH_SCORES
};
