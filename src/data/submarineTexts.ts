import passagesData from './passages.json';

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
    name: "COMMANDER",
    rank: "Red October Captain",
    depth: "700 METERS (TEST DEPTH)",
    description: "Maximum difficulty: Typhoon-class stealth doctrine, symbols, quotes, numbers, and Cyrillic transliterations.",
    multiplier: 5.0,
    passages: passagesData.level5 && passagesData.level5.length > 0
      ? passagesData.level5
      : [
          "TK-208 'Dmitriy Donskoy', lead ship of Project 941 Akula (NATO: Typhoon-class), displaces 48,000 tonnes submerged. Equipped with twin OK-650 pressurized-water reactors (190 MW each) and 20x RSM-52 'R-39 Rif' solid-fuel SLBMs, it remains humanity's largest submarine.",
          "The fictional 'Red October' (Krasny Oktyabr), captained by Marko Ramius, was fitted with an experimental magnetohydrodynamic 'caterpillar drive'—silent caterpillar propulsion with no moving turbine blades, leaving zero cavitation signature for SOSUS arrays to track."
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
}

export const LEVEL_TIME_LIMITS: Record<number, number> = {
  1: 300, // 5 minutes
  2: 240, // 4 minutes
  3: 180, // 3 minutes
  4: 240, // 4 minutes
  5: 180  // 3 minutes
};

export const INITIAL_HIGH_SCORES: HighScore[] = [
  { id: "1", initials: "RAM", score: 8500, wpm: 92, accuracy: 98, level: 5, date: "1984-11-23" },
  { id: "2", initials: "BOR", score: 6200, wpm: 84, accuracy: 96, level: 4, date: "1985-04-12" },
  { id: "3", initials: "KAP", score: 4800, wpm: 75, accuracy: 95, level: 3, date: "1986-07-04" },
  { id: "4", initials: "SUB", score: 3200, wpm: 68, accuracy: 92, level: 2, date: "1987-10-18" },
  { id: "5", initials: "NES", score: 2400, wpm: 60, accuracy: 91, level: 1, date: "1988-05-15" }
];
