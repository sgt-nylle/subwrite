import { type ThemeConfig } from './types';
import { Strv122Tank } from '../components/Strv122Tank';
import armyPassagesData from '../data/armyPassages.json' with { type: 'json' };
import armyPassagesDataSV from '../data/armyPassages_sv.json' with { type: 'json' };
import { type HighScore } from '../data/submarineTexts';

export const getArmyPassages = (lvl: number, lang: 'en' | 'sv'): string[] => {
  const data = lang === 'sv' ? armyPassagesDataSV : armyPassagesData;
  switch (lvl) {
    case 1: return data.level1;
    case 2: return data.level2;
    case 3: return data.level3;
    case 4: return data.level4;
    case 5: return data.level5;
    default: return data.level1;
  }
};

export const INITIAL_ARMY_HIGH_SCORES: HighScore[] = [
  // Level 5 - BATTALION COMMANDER
  { id: "ar501", initials: "PAN", score: 8750, wpm: 95, accuracy: 98, level: 5, device: "desktop", failedChars: 2, date: "2026-10-14" },
  { id: "ar502", initials: "ARM", score: 7900, wpm: 89, accuracy: 97, level: 5, device: "desktop", failedChars: 4, date: "2026-10-15" },
  { id: "ar503", initials: "STR", score: 7200, wpm: 83, accuracy: 96, level: 5, device: "desktop", failedChars: 5, date: "2026-10-15" },

  // Level 4 - PLATOON LEADER
  { id: "ar401", initials: "P04", score: 6400, wpm: 86, accuracy: 96, level: 4, device: "desktop", failedChars: 3, date: "2026-10-14" },
  { id: "ar402", initials: "LEO", score: 5600, wpm: 80, accuracy: 95, level: 4, device: "desktop", failedChars: 5, date: "2026-10-15" },
  { id: "ar403", initials: "CMD", score: 5100, wpm: 74, accuracy: 94, level: 4, device: "desktop", failedChars: 6, date: "2026-10-15" },

  // Level 3 - TANK COMMANDER
  { id: "ar301", initials: "I19", score: 4950, wpm: 77, accuracy: 95, level: 3, device: "desktop", failedChars: 4, date: "2026-10-14" },
  { id: "ar302", initials: "GUN", score: 4250, wpm: 72, accuracy: 94, level: 3, device: "desktop", failedChars: 6, date: "2026-10-15" },
  { id: "ar303", initials: "FOX", score: 3800, wpm: 68, accuracy: 93, level: 3, device: "desktop", failedChars: 7, date: "2026-10-15" },

  // Level 2 - GUNNER
  { id: "ar201", initials: "P07", score: 3350, wpm: 70, accuracy: 93, level: 2, device: "desktop", failedChars: 5, date: "2026-10-14" },
  { id: "ar202", initials: "TK1", score: 2950, wpm: 64, accuracy: 92, level: 2, device: "desktop", failedChars: 6, date: "2026-10-15" },
  { id: "ar203", initials: "DRV", score: 2550, wpm: 60, accuracy: 91, level: 2, device: "desktop", failedChars: 8, date: "2026-10-15" },

  // Level 1 - TANK CREWMAN
  { id: "ar101", initials: "LDR", score: 2480, wpm: 62, accuracy: 93, level: 1, device: "desktop", failedChars: 3, date: "2026-10-14" },
  { id: "ar102", initials: "REC", score: 2050, wpm: 54, accuracy: 91, level: 1, device: "desktop", failedChars: 5, date: "2026-10-15" },
  { id: "ar103", initials: "P18", score: 1700, wpm: 48, accuracy: 90, level: 1, device: "desktop", failedChars: 6, date: "2026-10-15" }
];

export const INITIAL_ARMY_MOBILE_HIGH_SCORES: HighScore[] = [
  // Level 5 - BATTALION COMMANDER (Mobile)
  { id: "arm501", initials: "PAN", score: 5400, wpm: 58, accuracy: 95, level: 5, device: "mobile", failedChars: 4, date: "2026-10-14" },
  { id: "arm502", initials: "STR", score: 4800, wpm: 52, accuracy: 94, level: 5, device: "mobile", failedChars: 6, date: "2026-10-15" },
  { id: "arm503", initials: "ARM", score: 4300, wpm: 47, accuracy: 93, level: 5, device: "mobile", failedChars: 7, date: "2026-10-15" },

  // Level 4 - PLATOON LEADER (Mobile)
  { id: "arm401", initials: "LEO", score: 4050, wpm: 50, accuracy: 94, level: 4, device: "mobile", failedChars: 5, date: "2026-10-14" },
  { id: "arm402", initials: "P04", score: 3550, wpm: 44, accuracy: 93, level: 4, device: "mobile", failedChars: 6, date: "2026-10-15" },
  { id: "arm403", initials: "CMD", score: 3150, wpm: 40, accuracy: 92, level: 4, device: "mobile", failedChars: 8, date: "2026-10-15" },

  // Level 3 - TANK COMMANDER (Mobile)
  { id: "arm301", initials: "I19", score: 3250, wpm: 46, accuracy: 93, level: 3, device: "mobile", failedChars: 5, date: "2026-10-14" },
  { id: "arm302", initials: "GUN", score: 2850, wpm: 41, accuracy: 92, level: 3, device: "mobile", failedChars: 7, date: "2026-10-15" },
  { id: "arm303", initials: "WOT", score: 2450, wpm: 37, accuracy: 91, level: 3, device: "mobile", failedChars: 9, date: "2026-10-15" },

  // Level 2 - GUNNER (Mobile)
  { id: "arm201", initials: "P07", score: 2250, wpm: 40, accuracy: 91, level: 2, device: "mobile", failedChars: 6, date: "2026-10-14" },
  { id: "arm202", initials: "TK1", score: 1950, wpm: 36, accuracy: 90, level: 2, device: "mobile", failedChars: 8, date: "2026-10-15" },
  { id: "arm203", initials: "DRV", score: 1700, wpm: 32, accuracy: 89, level: 2, device: "mobile", failedChars: 10, date: "2026-10-15" },

  // Level 1 - TANK CREWMAN (Mobile)
  { id: "arm101", initials: "LDR", score: 1600, wpm: 38, accuracy: 90, level: 1, device: "mobile", failedChars: 5, date: "2026-10-14" },
  { id: "arm102", initials: "REC", score: 1350, wpm: 32, accuracy: 89, level: 1, device: "mobile", failedChars: 7, date: "2026-10-15" },
  { id: "arm103", initials: "P18", score: 1150, wpm: 28, accuracy: 88, level: 1, device: "mobile", failedChars: 8, date: "2026-10-15" }
];

export const armyTheme: ThemeConfig = {
  id: 'army',
  name: 'ARMYWRITE',
  icon: '🪖',
  flair: '⚔',
  title: 'ARMYWRITE!',
  subtitle: 'subwrite.se - your personal armored warfare type challenge!',
  vesselLabel: 'TANK',
  vesselName: 'STRIDSVAGN 122',
  dimensionLabel: 'RANGE',
  badgeText: '🇸🇪 STRIDSVAGN 122 (LEOPARD 2A5 SE) • 120MM L/44 • ARMÉN',
  groupLabel: 'BATTALION',
  actionWord: 'ROLL',
  actionWordLong: 'COMMENCE ASSAULT',
  langSubTitleEn: 'Armored Warfare Archives',
  langSubTitleSv: 'Strv 122 & Svenska Armén',
  progressStatusText: 'TRACKS ENGAGED • ADVANCING...',
  levelHeaderLabel: 'TACTICAL COMBAT LEVEL',
  levels: [
    {
      level: 1,
      name: 'TANK CREWMAN',
      rank: 'Conscript Driver / Loader',
      dimensionValue: '500 METERS',
      description: 'Basic tank controls, turret rotation, and armored movement.',
      multiplier: 1.0
    },
    {
      level: 2,
      name: 'GUNNER',
      rank: 'Main Gunner',
      dimensionValue: '1,200 METERS',
      description: '120mm Rheinmetall L/44 smoothbore gun, laser rangefinder, and sabot rounds.',
      multiplier: 1.5
    },
    {
      level: 3,
      name: 'TANK COMMANDER',
      rank: 'Platoon Sergeant',
      dimensionValue: '2,200 METERS',
      description: 'Swedish composite add-on roof armor, GALIX smoke dischargers, and hull-down defense.',
      multiplier: 2.2
    },
    {
      level: 4,
      name: 'PLATOON LEADER',
      rank: 'Armored Lieutenant',
      dimensionValue: '3,200 METERS',
      description: '1,500 hp MTU V12 diesel, Renk automatic transmission, and cross-country mobility.',
      multiplier: 3.2
    },
    {
      level: 5,
      name: 'BATTALION COMMANDER',
      rank: 'Tank Ace / Oberst',
      dimensionValue: '4,000 METERS (MAX RANGE)',
      description: 'TCCS tactical command data link, STRIX top-attack defense, and Strv 123A upgrades.',
      multiplier: 5.0
    }
  ],
  getPassages: getArmyPassages,
  GraphicComponent: Strv122Tank,
  initialScores: INITIAL_ARMY_HIGH_SCORES,
  initialMobileScores: INITIAL_ARMY_MOBILE_HIGH_SCORES
};
