import passagesData from './passages.json' with { type: 'json' };

export interface SubmarineLevel {
  level: number;
  name: string;
  rank: string;
  depth: string;
  description: string;
  multiplier: number;
  passages: string[];
}

export const SUBMARINE_LEVELS: SubmarineLevel[] = [
  {
    level: 1,
    name: "CADET",
    rank: "Novice Helmsman",
    depth: "20 METERS",
    description: "Basic lowercase submarine articles, no punctuation.",
    multiplier: 1.0,
    passages: passagesData.level1 && passagesData.level1.length > 0
      ? passagesData.level1
      : [
          "a submarine is a watercraft capable of independent operation underwater it is able to submerge and resurface at will using ballast tanks filled with seawater",
          "modern submarines travel beneath the oceans on patrol carrying radar and sonar to detect friendly and hostile surface ships and deep sea vessels"
        ]
  },
  {
    level: 2,
    name: "SONAR TECH",
    rank: "Acoustic Specialist",
    depth: "80 METERS",
    description: "Standard sentences, basic capitalization, and periods.",
    multiplier: 1.5,
    passages: passagesData.level2 && passagesData.level2.length > 0
      ? passagesData.level2
      : [
          "Diesel-electric submarines rely on large lead-acid battery banks for underwater propulsion. When submerged, they operate silently to evade enemy sonar arrays.",
          "The snorkel mast allows a submerged boat to draw fresh air for its diesel engines without surfacing. This tactical development reduced radar detection in World War II."
        ]
  },
  {
    level: 3,
    name: "OFFICER",
    rank: "Tactical Navigator",
    depth: "250 METERS",
    description: "Cold War nuclear submarines, commas, and fleet doctrine.",
    multiplier: 2.2,
    passages: passagesData.level3 && passagesData.level3.length > 0
      ? passagesData.level3
      : [
          "The commissioning of USS Nautilus in 1954 transformed naval warfare forever. Nuclear propulsion broke the historic limitation of battery endurance, allowing boats to cruise underwater indefinitely.",
          "Ballistic missile submarines, designated SSBNs, form the most survivable leg of the nuclear triad. They patrol hidden in deep oceanic basins, carrying intercontinental SLBMs on continuous deterrence alerts."
        ]
  },
  {
    level: 4,
    name: "CHIEF ENG",
    rank: "Reactor Specialist",
    depth: "450 METERS",
    description: "High-complexity specifications, displacement tonnages, reactor specs, and numbers.",
    multiplier: 3.2,
    passages: passagesData.level4 && passagesData.level4.length > 0
      ? passagesData.level4
      : [
          "Project 667BDRM Delfin, known as Delta IV class, measures 167.4 meters in length with a submerged displacement of 18,200 metric tons. Powered by twin VM-4SG pressurized water reactors producing 180 MWt each, it carries 16 R-29RMU Sineva SLBMs.",
          "Cavitation occurs when spinning propeller blades generate low-pressure vapor cavities that collapse violently, creating loud broadband noise detectable at 50+ nautical miles. Modern seven-bladed skewed skew-back propellers mitigate this acoustic hazard."
        ]
  },
  {
    level: 5,
    name: "ADMIRAL",
    rank: "Fleet Admiral / Red October",
    depth: "700 METERS (TEST DEPTH)",
    description: "Maximum difficulty: Typhoon-class stealth doctrine, symbols, quotes, numbers, and Cyrillic transliterations.",
    multiplier: 5.0,
    passages: passagesData.level5 && passagesData.level5.length > 0
      ? passagesData.level5
      : [
          "TK-208 'Dmitriy Donskoy', lead ship of Project 941 Akula (NATO: Typhoon-class), displaces 48,000 tonnes submerged. Equipped with twin OK-650 pressurized-water reactors (190 MW each) and 20x RSM-52 'R-39 Rif' solid-fuel SLBMs, it remains humanity's largest submarine.",
          "The fictional 'Red October' (Krasny Oktyabr), captained by Marko Ramius, was fitted with an experimental magnetohydrodynamic 'caterpillar drive' - silent caterpillar propulsion with no moving turbine blades, leaving zero cavitation signature for SOSUS arrays to track."
        ]
  }
];

export interface HighScore {
  id: string;
  initials: string;
  score: number;
  wpm: number;
  accuracy: number;
  level: number;
  date: string;
  device?: 'desktop' | 'mobile';
  failedChars?: number;
}

export const LEVEL_TIME_LIMITS: Record<number, number> = {
  1: 300, // 5 minutes
  2: 240, // 4 minutes
  3: 180, // 3 minutes
  4: 240, // 4 minutes
  5: 180  // 3 minutes
};

export const INITIAL_HIGH_SCORES: HighScore[] = [
  // Level 5 - ADMIRAL
  { id: "501", initials: "RAM", score: 8500, wpm: 92, accuracy: 98, level: 5, device: "desktop", failedChars: 3, date: "1984-11-23" },
  { id: "502", initials: "KAP", score: 7600, wpm: 86, accuracy: 96, level: 5, device: "desktop", failedChars: 5, date: "1985-02-14" },
  { id: "503", initials: "RED", score: 6900, wpm: 80, accuracy: 95, level: 5, device: "desktop", failedChars: 7, date: "1985-10-30" },

  // Level 4 - CHIEF ENG
  { id: "401", initials: "BOR", score: 6200, wpm: 84, accuracy: 96, level: 4, device: "desktop", failedChars: 4, date: "1985-04-12" },
  { id: "402", initials: "DEL", score: 5400, wpm: 78, accuracy: 94, level: 4, device: "desktop", failedChars: 6, date: "1986-09-01" },
  { id: "403", initials: "ENG", score: 4900, wpm: 72, accuracy: 93, level: 4, device: "desktop", failedChars: 8, date: "1987-05-18" },

  // Level 3 - OFFICER
  { id: "301", initials: "NAV", score: 4800, wpm: 75, accuracy: 95, level: 3, device: "desktop", failedChars: 5, date: "1986-07-04" },
  { id: "302", initials: "TAC", score: 4100, wpm: 70, accuracy: 93, level: 3, device: "desktop", failedChars: 7, date: "1987-03-22" },
  { id: "303", initials: "OFF", score: 3600, wpm: 66, accuracy: 92, level: 3, device: "desktop", failedChars: 9, date: "1987-11-09" },

  // Level 2 - SONAR TECH
  { id: "201", initials: "SUB", score: 3200, wpm: 68, accuracy: 92, level: 2, device: "desktop", failedChars: 6, date: "1987-10-18" },
  { id: "202", initials: "SON", score: 2850, wpm: 62, accuracy: 91, level: 2, device: "desktop", failedChars: 8, date: "1988-01-10" },
  { id: "203", initials: "ACO", score: 2400, wpm: 58, accuracy: 90, level: 2, device: "desktop", failedChars: 10, date: "1988-08-25" },

  // Level 1 - CADET
  { id: "101", initials: "NES", score: 2400, wpm: 60, accuracy: 91, level: 1, device: "desktop", failedChars: 4, date: "1988-05-15" },
  { id: "102", initials: "CAD", score: 1950, wpm: 52, accuracy: 90, level: 1, device: "desktop", failedChars: 6, date: "1989-06-30" },
  { id: "103", initials: "HEL", score: 1620, wpm: 46, accuracy: 88, level: 1, device: "desktop", failedChars: 8, date: "1990-04-12" }
];

export const INITIAL_MOBILE_HIGH_SCORES: HighScore[] = [
  // Level 5 - ADMIRAL (Mobile Touchscreen)
  { id: "m501", initials: "MOB", score: 5200, wpm: 56, accuracy: 95, level: 5, device: "mobile", failedChars: 5, date: "2026-10-01" },
  { id: "m502", initials: "IPH", score: 4600, wpm: 50, accuracy: 94, level: 5, device: "mobile", failedChars: 7, date: "2026-10-02" },
  { id: "m503", initials: "AND", score: 4100, wpm: 45, accuracy: 93, level: 5, device: "mobile", failedChars: 9, date: "2026-10-03" },

  // Level 4 - CHIEF ENG (Mobile Touchscreen)
  { id: "m401", initials: "S94", score: 3900, wpm: 48, accuracy: 94, level: 4, device: "mobile", failedChars: 6, date: "2026-10-04" },
  { id: "m402", initials: "TAC", score: 3400, wpm: 42, accuracy: 92, level: 4, device: "mobile", failedChars: 8, date: "2026-10-05" },
  { id: "m403", initials: "RED", score: 3000, wpm: 38, accuracy: 91, level: 4, device: "mobile", failedChars: 10, date: "2026-10-06" },

  // Level 3 - OFFICER (Mobile Touchscreen)
  { id: "m301", initials: "SUB", score: 3100, wpm: 44, accuracy: 92, level: 3, device: "mobile", failedChars: 7, date: "2026-10-07" },
  { id: "m302", initials: "GOT", score: 2700, wpm: 39, accuracy: 91, level: 3, device: "mobile", failedChars: 9, date: "2026-10-08" },
  { id: "m303", initials: "NAV", score: 2300, wpm: 35, accuracy: 90, level: 3, device: "mobile", failedChars: 11, date: "2026-10-09" },

  // Level 2 - SONAR TECH (Mobile Touchscreen)
  { id: "m201", initials: "SON", score: 2100, wpm: 38, accuracy: 90, level: 2, device: "mobile", failedChars: 8, date: "2026-10-10" },
  { id: "m202", initials: "ACO", score: 1850, wpm: 34, accuracy: 89, level: 2, device: "mobile", failedChars: 10, date: "2026-10-11" },
  { id: "m203", initials: "RAD", score: 1600, wpm: 30, accuracy: 88, level: 2, device: "mobile", failedChars: 12, date: "2026-10-12" },

  // Level 1 - CADET (Mobile Touchscreen)
  { id: "m101", initials: "CAD", score: 1500, wpm: 36, accuracy: 89, level: 1, device: "mobile", failedChars: 6, date: "2026-10-12" },
  { id: "m102", initials: "SMS", score: 1250, wpm: 30, accuracy: 88, level: 1, device: "mobile", failedChars: 8, date: "2026-10-12" },
  { id: "m103", initials: "TAP", score: 1050, wpm: 26, accuracy: 86, level: 1, device: "mobile", failedChars: 10, date: "2026-10-12" }
];

export const ALL_INITIAL_HIGH_SCORES: HighScore[] = [
  ...INITIAL_HIGH_SCORES,
  ...INITIAL_MOBILE_HIGH_SCORES
];
