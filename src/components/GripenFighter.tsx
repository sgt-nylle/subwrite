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
    // 0: Tail fin tip
    "                   CCCC                                                 ",
    // 1: Vertical stabilizer top
    "                  CCCCCC                                                ",
    // 2: Stabilizer & Tre Kronor gold accent
    "                 CCCGGGCC                                               ",
    // 3: Stabilizer
    "                CCCCGGCCCC                                              ",
    // 4: Stabilizer body
    "               CCCCCCCCCCCC                                             ",
    // 5: Canopy top & tail
    "              CCCCCCCCCCCCCC                    WWWW                    ",
    // 6: Cockpit bubble canopy
    "             CCCCCCCDBBBBBBB                  WWGGGGWW                  ",
    // 7: Cockpit glass & pilot silhouette
    "            CCCCCCCDBBBBBBBBB               WWGGGGGGGGWW                ",
    // 8: Canopy base & spine
    "           CCCCCCCDBBBBBBBBBBB             WWGGGGGGGGGGWW               ",
    // 9: Dorsal spine, Canard foreplane top
    "   R      CCCCCCCCDBBBBBBBBBBBBB         CCCCCCCCCCCCCCCCCCCC           ",
    // 10: Wingtip rail, Main delta wing leading edge & Canard
    "  WRW    CCCCCCCCCCBBBBBBBBBBBBBBBB   CCCCCCCCCCCCCCCCCCCCCCCCCC        ",
    // 11: Afterburner nozzle, fuselage centerline, radome & pitot probe
    "FY CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCPP     ",
    // 12: Afterburner core, fuselage, intake & radome curve
    "FYFCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC        ",
    // 13: Belly intake scoop & wing underside
    "  WRW    DDDDDDDDDDDDDDDDDDDDDDDDDD   DDDDDDDDDDDDDDDDDDDDDDDD          ",
    // 14: Lower fuselage & drop tank pylons
    "   R      DDDDDDDDDDDDDDDDDDDDDDDD       DDDDDDDDDDDDDDD                ",
    // 15: External fuel tank / payload
    "           DDDDDDDDDDDDDDDDDDDDD                                        ",
    // 16: Drop tank bottom
    "            DDDDDDDDDDDDDDDDDDD                                         ",
    // 17:
    "             DDDDDDDDDDDDDDDDD                                          ",
    // 18:
    "                                                                        ",
    // 19:
    "                                                                        ",
    // 20:
    "                                                                        ",
    // 21:
    "                                                                        "
  ];

  const colorMap: Record<string, string> = {
    'C': '#00d4ff', // Heaven blue
    'B': '#0077cc', // Swedish Air Force blue
    'D': '#003366', // Deep shadow blue
    'W': '#ffffff', // White glint / missile
    'G': '#ffd700', // Gold cockpit / Swedish insignia
    'F': '#ff6600', // Afterburner flame
    'Y': '#ffee33', // Flame core yellow
    'R': '#ff3333', // Missile red
    'P': '#ffffff'  // Pitot tube
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
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00d4ff" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* HUD Pitch Ladder / Flight Horizon Grid Lines behind fighter */}
        <g stroke="#003366" strokeWidth="1" strokeDasharray="3 4" opacity="0.6">
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
