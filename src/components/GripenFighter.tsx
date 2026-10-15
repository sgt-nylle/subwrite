import React from 'react';

export const GripenFighter: React.FC<{ className?: string }> = ({ className = '' }) => {
  // 8-bit NES pixel grid representing the Swedish Saab JAS 39 Gripen multirole fighter
  // Features: Supersonic radome, canard foreplanes, delta wings, wingtip missile rails,
  // vertical stabilizer with Flygvapnet emblem, and afterburner flame exhaust.
  // Width: 64 pixels, Height: 22 pixels, rendered at crisp scale.
  const pixelSize = 5;
  const width = 64 * pixelSize; // 320px
  const height = 22 * pixelSize; // 110px

  // Pixel map characters (64 chars per row, 22 rows):
  // ' ' = transparent
  // 'C' = Bright Heaven Blue / Highlight (#00d4ff)
  // 'B' = Swedish Air Force Blue (#0077cc)
  // 'D' = Shadow / Deep Blue (#003366)
  // 'W' = White glint / Canopy highlight / Missile body (#ffffff)
  // 'G' = HUD Gold / Canopy tint / Tre Kronor accent (#ffd700)
  // 'F' = Afterburner Flame Orange (#ff6600)
  // 'Y' = Flame Core Yellow (#ffee33)
  // 'R' = Missile Tip / Radar warning (#ff3333)
  // 'P' = Pitot Probe (#ffffff)

  const rows = [
    // 0: Tail fin tip & EW antenna pod
    "                  CCC                                           ",
    // 1: Swept vertical stabilizer upper
    "                 CCCCC                                          ",
    // 2: Flygvapnet Swedish Tre Kronor gold roundel
    "                CCCCGC                                          ",
    // 3: Vertical stabilizer middle
    "               CCCCGGC                                          ",
    // 4: Stabilizer base
    "              CCCCCCC                                           ",
    // 5: Canopy specular glint & dorsal spine
    "             CCCCCCCCC                           WWWW           ",
    // 6: Cockpit bubble canopy
    "            CCCCCCCCCCC                        WWGGGGWW         ",
    // 7: Cockpit glass & pilot helmet silhouette
    "           CCCCCCCCCCCCC                      WWGGGDGGWW        ",
    // 8: Canopy base & aerodynamic spine
    "          CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCWWGGGGGGGGWW      ",
    // 9: Dorsal spine to supersonic radome slope
    "   R     CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCWWWWWWWWCCCC     ",
    // 10: Canard foreplane & nose cone
    "  WRW   CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC  CCCCC  CCCCCCCCCCCC   ",
    // 11: Afterburner nozzle, fuselage centerline & supersonic pitot needle
    "F Y P-- CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCPP",
    // 12: Afterburner flame core & radome lower curve
    "FFYYF   CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC   ",
    // 13: Underfuselage curve & jet engine air intake scoop
    "F Y      CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC   DDDDD   CCCCCCCCC    ",
    // 14: Cropped delta wing underside & pylon
    "  WRW     DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD                        ",
    // 15: Wingtip missile launcher & IRIS-T missile body
    "   R       DDDDDDDDDDDDDDDDDDDDDDDDDDDD                         ",
    // 16: Centerline tank / lower fuselage shadow
    "            DDDDDDDDDDDDDDDDDDDDDDDDDD                          ",
    // 17-21: Transparent padding
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                "
  ];

  const colorMap: Record<string, string> = {
    'C': '#38bdf8', // Bright Heaven Blue / Sky Cyan highlight
    'B': '#0284c7', // Royal Flygvapnet Blue
    'D': '#072a4a', // Dark shadow blue / Air intake duct / Pilot helmet
    'W': '#ffffff', // White glint / Canopy frame / Missile rail
    'G': '#ffd700', // Gold cockpit tint / Tre Kronor gold insignia
    'F': '#ff5500', // Afterburner flame orange
    'Y': '#ffee22', // Flame core yellow
    'R': '#ff3333', // Missile red tip / Warning
    'P': '#e0f2fe'  // Pitot needle silver
  };

  const pixels: { x: number; y: number; color: string }[] = [];

  rows.forEach((row, rowIndex) => {
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const char = row[colIndex];
      if (char !== ' ' && colorMap[char]) {
        pixels.push({
          x: colIndex * pixelSize,
          y: rowIndex * pixelSize,
          color: colorMap[char]
        });
      }
    }
  });

  return (
    <div className={`gotland-sub-wrapper gripen-fighter-wrapper ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="gotland-sub-svg gripen-fighter-svg"
        shapeRendering="crispEdges"
      >
        <defs>
          <filter id="gripenGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* HUD Pitch Ladder / Flight Horizon Grid Lines behind fighter */}
        <g stroke="#0e3d64" strokeWidth="1" strokeDasharray="3 4" opacity="0.6">
          <line x1="0" y1="40" x2={width} y2="40" />
          <line x1="60" y1="58" x2={260} y2="58" />
          <line x1="0" y1="75" x2={width} y2="75" />
        </g>

        {/* Pixel Sprite */}
        <g filter="url(#gripenGlow)">
          {pixels.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={pixelSize}
              height={pixelSize}
              fill={p.color}
            />
          ))}
        </g>
      </svg>
      <div className="gotland-badge-text gripen-badge-text">
        <span className="sweden-flag">🇸🇪</span> SAAB JAS 39 GRIPEN • CANARD DELTA • FLYGVAPNET
      </div>
    </div>
  );
};
