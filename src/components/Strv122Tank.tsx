import React from 'react';

export const Strv122Tank: React.FC<{ className?: string }> = ({ className = '' }) => {
  // 8-bit NES pixel grid representing the Swedish Stridsvagn 122 (Leopard 2A5 SE) Main Battle Tank
  // Features: Rheinmetall 120mm L/44 smoothbore gun, arrowhead wedge turret armor,
  // commander PERI R17A2 panoramic periscope, Swedish M90 splinter camouflage,
  // heavy composite side skirts, 7 road wheels, and continuous tank tracks.
  // Width: 64 pixels, Height: 22 pixels, rendered at crisp scale.
  const pixelSize = 5;
  const width = 64 * pixelSize; // 320px
  const height = 22 * pixelSize; // 110px

  // Pixel map rows (64 chars per row, 22 rows):
  // ' ' = transparent
  // 'A' = Swedish M90 Light Green / Foliage Highlight (#4ade80)
  // 'G' = Swedish Army Olive Green (#3b7a2b)
  // 'D' = Deep Forest Green / Armor Shadow (#1e4316)
  // 'C' = Dark Charcoal / Splinter Camo (#1c2419)
  // 'B' = Gun Barrel Steel (#4b5e40)
  // 'M' = Bore Evacuator / Fume Extractor (#2d4724)
  // 'T' = Roadwheel Metallic Center Hub (#4b5563)
  // 'R' = Roadwheel Heavy Rubber Tires (#181f18)
  // 'S' = Heavy Steel Track Cleats (#2c352b)
  // 'W' = White antenna / Headlight / Optic reflection (#ffffff)
  // 'Y' = Commander PERI R17A2 Panoramic Sight Gold Optic (#ffd700)

  const rows = [
    // 0: PERI R17A2 panoramic sight top & antenna tips
    "                    Y                                           ",
    // 1: Commander sight glass & radio antenna masts
    "                W   WY                                          ",
    // 2: Antenna mast, sight armored housing, turret hatch rim
    "                W  GYYG                                         ",
    // 3: Turret roof, commander cupola, GALIX smoke discharger tops
    "                W GGGGGGD                                       ",
    // 4: Turret roof slope, bustle basket, wedge armor upper
    "           DDDDDGGGGGGGGGGDD                                    ",
    // 5: Turret rear bustle, Swedish Tre Kronor crest, arrowhead wedge
    "         DDDDDDDDDDDDGGGGGGGGGG                                 ",
    // 6: Turret side armor wedge, French GALIX cluster, mantlet root
    "        CCDDDDDDDDDDDDGGGGGGGGGGGG                              ",
    // 7: 120mm Rheinmetall L/44 gun barrel, bore evacuator & muzzle
    "        CCCCDDDDDDDDDDGGGGGGGGGGGGGGMMMMMBBBBBBBBBBBBBBBBBBBBW  ",
    // 8: Gun barrel underside, mantlet, frontal glacis slope
    "      GGGGCCCCDDDDDDDDGGGGGGGGGGGGGMMMMMBBBBBBBBBBBBBBBBBBBBW   ",
    // 9: Front glacis plate, driver hatch, turret ring, engine grilles
    "    GGGGGGGGCCCCDDDDDDGGGGGGGGGGGGGGGGGGGGGGGG                  ",
    // 10: Hull top deck, front headlight glint, tow shackle
    "   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW              ",
    // 11: Upper track cover, mudflaps, hull side line
    "  DDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG            ",
    // 12: Heavy composite side skirts top edge
    " DDDCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDD          ",
    // 13: Swedish M90 splinter camo on armored side skirts
    " DDDCAAAACCAAAACCAAAACCAAAACCAAAACCAAAACCAAAACCAAAACDDD         ",
    // 14: Swedish M90 splinter camo on armored side skirts (lower)
    " DDDCAAAACCAAAACCAAAACCAAAACCAAAACCAAAACCAAAACCAAAACDDD         ",
    // 15: Armored skirt lower edge above running gear
    "  DDDCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDD          ",
    // 16: Return rollers & upper road wheel rims
    "   T RRR  RRR  RRR  RRR  RRR  RRR  RRR  RRR  RRR T              ",
    // 17: Road wheels (Sprocket, 7 road wheels, idler wheel) with hubs
    "  ST RTRR RTRR RTRR RTRR RTRR RTRR RTRR RTRR RTRR TS            ",
    // 18: Road wheel rubber tires and suspension arms
    "  ST RTRR RTRR RTRR RTRR RTRR RTRR RTRR RTRR RTRR TS            ",
    // 19: Lower road wheel tires
    "   T RRR  RRR  RRR  RRR  RRR  RRR  RRR  RRR  RRR T              ",
    // 20: Track shoes, guide horns, ground contact cleats
    "  SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS              ",
    // 21: Ground shadow
    "                                                                "
  ];

  const colorMap: Record<string, string> = {
    'A': '#4ade80', // Swedish M90 Light Green / Foliage Highlight
    'G': '#3b7a2b', // Swedish Army Olive Green
    'D': '#1e4316', // Deep Forest Green / Armor Shadow
    'C': '#1c2419', // Dark Charcoal / Splinter Camo
    'B': '#4b5e40', // Gun Barrel Steel
    'M': '#2d4724', // Bore Evacuator / Fume Extractor
    'T': '#4b5563', // Roadwheel Metallic Center Hub
    'R': '#181f18', // Roadwheel Heavy Rubber Tires
    'S': '#2c352b', // Heavy Steel Track Cleats
    'W': '#ffffff', // White antenna / Headlight / Optic reflection
    'Y': '#ffd700'  // Commander PERI R17A2 Panoramic Sight Gold Optic
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
    <div className={`gotland-sub-wrapper strv-tank-wrapper ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="gotland-sub-svg strv-tank-svg"
        shapeRendering="crispEdges"
        aria-label="8-bit Stridsvagn 122 Main Battle Tank pixel art"
      >
        <defs>
          <filter id="tankGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4ade80" floodOpacity="0.4" />
          </filter>
        </defs>
        <g filter="url(#tankGlow)">
          {pixels.map((p, idx) => (
            <rect
              key={idx}
              x={p.x}
              y={p.y}
              width={pixelSize}
              height={pixelSize}
              fill={p.color}
            />
          ))}
        </g>
      </svg>
      <div className="gotland-badge-text strv-badge-text">
        <span className="sweden-flag">🇸🇪</span>
        <span>STRIDSVAGN 122 (LEOPARD 2A5 SE) • 120MM L/44 • ARMÉN</span>
      </div>
    </div>
  );
};
