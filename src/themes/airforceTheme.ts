import { type ThemeConfig } from './types';
import { GripenFighter } from '../components/GripenFighter';
import airforcePassagesData from '../data/airforcePassages.json' with { type: 'json' };
import airforcePassagesDataSV from '../data/airforcePassages_sv.json' with { type: 'json' };
import { type HighScore } from '../data/submarineTexts';

export const getAirforcePassages = (lvl: number, lang: 'en' | 'sv'): string[] => {
  const data = lang === 'sv' ? airforcePassagesDataSV : airforcePassagesData;
  switch (lvl) {
    case 1: return data.level1;
    case 2: return data.level2;
    case 3: return data.level3;
    case 4: return data.level4;
    case 5: return data.level5;
    default: return data.level1;
  }
};

export const INITIAL_AIRFORCE_HIGH_SCORES: HighScore[] = [
  // Level 5 - AIR MARSHAL
  { id: "a501", initials: "VIP", score: 8600, wpm: 94, accuracy: 98, level: 5, device: "desktop", failedChars: 2, date: "2026-10-10" },
  { id: "a502", initials: "MAV", score: 7800, wpm: 88, accuracy: 97, level: 5, device: "desktop", failedChars: 4, date: "2026-10-11" },
  { id: "a503", initials: "FOX", score: 7100, wpm: 82, accuracy: 95, level: 5, device: "desktop", failedChars: 6, date: "2026-10-12" },

  // Level 4 - WING COMMANDER
  { id: "a401", initials: "GRI", score: 6350, wpm: 85, accuracy: 96, level: 4, device: "desktop", failedChars: 3, date: "2026-10-11" },
  { id: "a402", initials: "F21", score: 5550, wpm: 79, accuracy: 95, level: 4, device: "desktop", failedChars: 5, date: "2026-10-12" },
  { id: "a403", initials: "JAS", score: 5050, wpm: 73, accuracy: 94, level: 4, device: "desktop", failedChars: 7, date: "2026-10-13" },

  // Level 3 - SQUADRON LEADER
  { id: "a301", initials: "ACE", score: 4900, wpm: 76, accuracy: 95, level: 3, device: "desktop", failedChars: 5, date: "2026-10-12" },
  { id: "a302", initials: "F17", score: 4200, wpm: 71, accuracy: 94, level: 3, device: "desktop", failedChars: 6, date: "2026-10-13" },
  { id: "a303", initials: "TAC", score: 3750, wpm: 67, accuracy: 93, level: 3, device: "desktop", failedChars: 8, date: "2026-10-14" },

  // Level 2 - INTERCEPTOR
  { id: "a201", initials: "RAD", score: 3300, wpm: 69, accuracy: 93, level: 2, device: "desktop", failedChars: 5, date: "2026-10-13" },
  { id: "a202", initials: "F07", score: 2900, wpm: 63, accuracy: 92, level: 2, device: "desktop", failedChars: 7, date: "2026-10-14" },
  { id: "a203", initials: "TOP", score: 2500, wpm: 59, accuracy: 91, level: 2, device: "desktop", failedChars: 9, date: "2026-10-14" },

  // Level 1 - FLIGHT CADET
  { id: "a101", initials: "FLY", score: 2450, wpm: 61, accuracy: 92, level: 1, device: "desktop", failedChars: 3, date: "2026-10-13" },
  { id: "a102", initials: "CAD", score: 2000, wpm: 53, accuracy: 91, level: 1, device: "desktop", failedChars: 5, date: "2026-10-14" },
  { id: "a103", initials: "PIL", score: 1680, wpm: 47, accuracy: 89, level: 1, device: "desktop", failedChars: 7, date: "2026-10-14" }
];

export const INITIAL_AIRFORCE_MOBILE_HIGH_SCORES: HighScore[] = [
  // Level 5 - AIR MARSHAL (Mobile)
  { id: "am501", initials: "ACE", score: 5300, wpm: 57, accuracy: 95, level: 5, device: "mobile", failedChars: 4, date: "2026-10-01" },
  { id: "am502", initials: "MAV", score: 4700, wpm: 51, accuracy: 94, level: 5, device: "mobile", failedChars: 6, date: "2026-10-02" },
  { id: "am503", initials: "VIP", score: 4200, wpm: 46, accuracy: 93, level: 5, device: "mobile", failedChars: 8, date: "2026-10-03" },

  // Level 4 - WING COMMANDER (Mobile)
  { id: "am401", initials: "GRI", score: 4000, wpm: 49, accuracy: 94, level: 4, device: "mobile", failedChars: 5, date: "2026-10-04" },
  { id: "am402", initials: "JAS", score: 3500, wpm: 43, accuracy: 93, level: 4, device: "mobile", failedChars: 7, date: "2026-10-05" },
  { id: "am403", initials: "F21", score: 3100, wpm: 39, accuracy: 92, level: 4, device: "mobile", failedChars: 9, date: "2026-10-06" },

  // Level 3 - SQUADRON LEADER (Mobile)
  { id: "am301", initials: "TOP", score: 3200, wpm: 45, accuracy: 93, level: 3, device: "mobile", failedChars: 6, date: "2026-10-07" },
  { id: "am302", initials: "F17", score: 2800, wpm: 40, accuracy: 92, level: 3, device: "mobile", failedChars: 8, date: "2026-10-08" },
  { id: "am303", initials: "FOX", score: 2400, wpm: 36, accuracy: 91, level: 3, device: "mobile", failedChars: 10, date: "2026-10-09" },

  // Level 2 - INTERCEPTOR (Mobile)
  { id: "am201", initials: "RAD", score: 2200, wpm: 39, accuracy: 91, level: 2, device: "mobile", failedChars: 7, date: "2026-10-10" },
  { id: "am202", initials: "F07", score: 1900, wpm: 35, accuracy: 90, level: 2, device: "mobile", failedChars: 9, date: "2026-10-11" },
  { id: "am203", initials: "SWO", score: 1650, wpm: 31, accuracy: 89, level: 2, device: "mobile", failedChars: 11, date: "2026-10-12" },

  // Level 1 - FLIGHT CADET (Mobile)
  { id: "am101", initials: "FLY", score: 1550, wpm: 37, accuracy: 90, level: 1, device: "mobile", failedChars: 5, date: "2026-10-12" },
  { id: "am102", initials: "CAD", score: 1300, wpm: 31, accuracy: 89, level: 1, device: "mobile", failedChars: 7, date: "2026-10-12" },
  { id: "am103", initials: "PIL", score: 1100, wpm: 27, accuracy: 87, level: 1, device: "mobile", failedChars: 9, date: "2026-10-12" }
];

export const airforceTheme: ThemeConfig = {
  id: 'airforce',
  name: 'AIRWRITE',
  icon: '✈️',
  flair: '✈',
  title: 'AIRWRITE!',
  subtitle: 'subwrite.se - your personal airforce type challenge!',
  vesselLabel: 'AIRCRAFT',
  vesselName: 'SAAB JAS 39 GRIPEN',
  dimensionLabel: 'ALTITUDE',
  badgeText: '🇸🇪 SAAB JAS 39 GRIPEN • CANARD DELTA • FLYGVAPNET',
  groupLabel: 'SQUADRON',
  actionWord: 'FLY',
  actionWordLong: 'COMMENCE FLIGHT',
  langSubTitleEn: 'Aviation Archives',
  langSubTitleSv: 'Gripen & Flygvapnet',
  progressStatusText: 'AFTERBURNER ENGAGED • CLIMBING...',
  levelHeaderLabel: 'TACTICAL FLIGHT LEVEL',
  levels: [
    {
      level: 1,
      name: 'FLIGHT CADET',
      rank: 'Novice Aviator',
      dimensionValue: '1,000 FEET',
      description: 'Basic lowercase aviation words, runways, and flight control.',
      multiplier: 1.0
    },
    {
      level: 2,
      name: 'INTERCEPTOR',
      rank: 'Combat Pilot',
      dimensionValue: '10,000 FEET',
      description: 'Multirole JAS doctrine, periods, capitalization, and speed.',
      multiplier: 1.5
    },
    {
      level: 3,
      name: 'SQUADRON LEADER',
      rank: 'Tactical Commander',
      dimensionValue: '25,000 FEET',
      description: 'Cold War Viggen & Draken history, Bas 90 road base dispersal.',
      multiplier: 2.2
    },
    {
      level: 4,
      name: 'WING COMMANDER',
      rank: 'Avionics & Radar Specialist',
      dimensionValue: '40,000 FEET',
      description: 'Volvo RM12 turbofan, bypass ratios, 120 kN thrust & AESA specs.',
      multiplier: 3.2
    },
    {
      level: 5,
      name: 'AIR MARSHAL',
      rank: 'Gripen Ace / Top Gun',
      dimensionValue: '50,000 FEET (ANGELS 50 / MACH 2)',
      description: 'Meteor BVRAAM, canard delta vortex aerodynamics, quotes & NATO codes.',
      multiplier: 5.0
    }
  ],
  getPassages: getAirforcePassages,
  GraphicComponent: GripenFighter,
  initialScores: INITIAL_AIRFORCE_HIGH_SCORES,
  initialMobileScores: INITIAL_AIRFORCE_MOBILE_HIGH_SCORES
};
