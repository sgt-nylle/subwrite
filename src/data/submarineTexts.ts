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
    description: "Basic lowercase words, simple terms, no punctuation.",
    multiplier: 1.0,
    passages: [
      "a submarine is a watercraft capable of independent operation underwater it is able to submerge and resurface at will using ballast tanks filled with seawater",
      "early submarines used human power or steam engines to propel vessels under the water before the invention of electric batteries and diesel engines",
      "modern submarines travel beneath the oceans on patrol carrying radar and sonar to detect friendly and hostile surface ships and deep sea vessels",
      "submarines navigate through dark sea trenches using passive hydrophones to listen for ambient sounds and engine propellers across the water"
    ]
  },
  {
    level: 2,
    name: "SONAR TECH",
    rank: "Acoustic Specialist",
    depth: "80 METERS",
    description: "Standard sentences, basic capitalization, and periods.",
    multiplier: 1.5,
    passages: [
      "Diesel-electric submarines rely on large lead-acid battery banks for underwater propulsion. When submerged, they operate silently to evade enemy sonar arrays.",
      "The snorkel mast allows a submerged boat to draw fresh air for its diesel engines without surfacing. This tactical development reduced radar detection in World War II.",
      "Periscopes were the primary visual reconnaissance instruments for submarine captains. Modern nuclear boats replace optical tubes with high-definition photonic masts.",
      "Ballast tanks are flooded with seawater to decrease buoyancy and initiate a dive. Compressed air is blown into the tanks to surface rapidly during an emergency blow."
    ]
  },
  {
    level: 3,
    name: "OFFICER",
    rank: "Tactical Navigator",
    depth: "250 METERS",
    description: "Cold War nuclear submarines, commas, hyphenated terms, and fleet doctrine.",
    multiplier: 2.2,
    passages: [
      "The commissioning of USS Nautilus in 1954 transformed naval warfare forever. Nuclear propulsion broke the historic limitation of battery endurance, allowing boats to cruise underwater indefinitely.",
      "Ballistic missile submarines, designated SSBNs, form the most survivable leg of the nuclear triad. They patrol hidden in deep oceanic basins, carrying intercontinental SLBMs on continuous deterrence alerts.",
      "Attack submarines patrol choke-points to hunt hostile ballistic missile boats and carrier strike groups. Their hulls are lined with specialized anechoic rubber tiles designed to absorb active sonar pings.",
      "Submarine warfare relies heavily on the thermocline layer. The abrupt change in water temperature creates an acoustic shadow zone, bending sound waves and cloaking vessels from surface search escorts."
    ]
  },
  {
    level: 4,
    name: "CHIEF ENG",
    rank: "Reactor Specialist",
    depth: "450 METERS",
    description: "High-complexity specifications, displacement tonnages, reactor parameters, and numbers.",
    multiplier: 3.2,
    passages: [
      "Project 667BDRM Delfin, known as Delta IV class, measures 167.4 meters in length with a submerged displacement of 18,200 metric tons. Powered by twin VM-4SG pressurized water reactors producing 180 MWt each, it carries 16 R-29RMU Sineva SLBMs.",
      "Cavitation occurs when spinning propeller blades generate low-pressure vapor cavities that collapse violently, creating loud broadband noise detectable at 50+ nautical miles. Modern seven-bladed skewed skew-back propellers mitigate this acoustic hazard.",
      "The Soviet K-278 Komsomolets utilized a double hull manufactured from high-strength titanium alloy, enabling it to establish an operational dive depth record of 1,020 meters (3,346 ft) in the Norwegian Sea on 4 August 1984.",
      "Passive towed-array sonars, extending up to 1,000 meters behind the hull on reinforced cables, eliminate machinery interference from the host vessel and detect low-frequency narrowband spectral lines across acoustic basins."
    ]
  },
  {
    level: 5,
    name: "COMMANDER",
    rank: "Red October Captain",
    depth: "700 METERS (TEST DEPTH)",
    description: "Maximum difficulty: Typhoon-class stealth doctrine, symbols, quotes, numbers, and Cyrillic transliterations.",
    multiplier: 5.0,
    passages: [
      "TK-208 'Dmitriy Donskoy', lead ship of Project 941 Akula (NATO: Typhoon-class), displaces 48,000 tonnes submerged. Equipped with twin OK-650 pressurized-water reactors (190 MW each) and 20x RSM-52 'R-39 Rif' solid-fuel SLBMs, it remains humanity's largest submarine.",
      "The fictional 'Red October' (Krasny Oktyabr), captained by Marko Ramius, was fitted with an experimental magnetohydrodynamic 'caterpillar drive'—silent caterpillar propulsion with no moving turbine blades, leaving zero cavitation signature for SOSUS arrays to track.",
      "Emergency Protocol: If reactor coolant temperature exceeds 320°C with primary loop pressure at >15.7 MPa, engage auxiliary steam-generators immediately! Initiate rapid emergency ballast blow (Blow Forward #1/#2, Aft #3); set rudder 25° dive-planes to maximum surface ascent!",
      "Acoustic classification criteria: Verify 50-Hz power-line harmonic hum, 12.5-Hz shaft rate, and 7-blade propeller blade-rate frequency. If target signature matches NATO Los Angeles-class (SSN-688 Flight III), activate 533mm Type 53-65K wake-homing torpedoes at bearing 042°!"
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

export const INITIAL_HIGH_SCORES: HighScore[] = [
  { id: "1", initials: "RAM", score: 8500, wpm: 92, accuracy: 98, level: 5, date: "1984-11-23" },
  { id: "2", initials: "BOR", score: 6200, wpm: 84, accuracy: 96, level: 4, date: "1985-04-12" },
  { id: "3", initials: "KAP", score: 4800, wpm: 75, accuracy: 95, level: 3, date: "1986-07-04" },
  { id: "4", initials: "SUB", score: 3200, wpm: 68, accuracy: 92, level: 2, date: "1987-10-18" },
  { id: "5", initials: "C64", score: 1800, wpm: 55, accuracy: 90, level: 1, date: "1988-02-09" }
];
