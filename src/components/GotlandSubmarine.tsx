import React from 'react';

export const GotlandSubmarine: React.FC<{ className?: string }> = ({ className = '' }) => {
  // 8-bit NES pixel grid representing the Swedish Gotland-class (A19) submarine
  // Features: Streamlined sail, bow torpedo array, Stirling AIP mid-hull, and iconic Swedish X-rudder!
  // Width: 64 pixels, Height: 20 pixels, rendered at crisp scale.
  const pixelSize = 5;
  const width = 64 * pixelSize; // 320px
  const height = 22 * pixelSize; // 110px

  // Pixel map rows (each string is 64 characters long):
  // ' ' = transparent
  // 'R' = Bright NES Red (#ff2222)
  // 'D' = Dark Red / Hull Shadow (#880000)
  // 'L' = Light Red / Highlight (#ff6666)
  // 'W' = White / Sensor glint (#ffffff)
  // 'Y' = Gold / Periscope optic (#ffd700)
  // 'X' = X-Rudder Stern plane (#cc1111)

  const rows = [
    // 0: Mast tops
    "                                      Y                                 ",
    // 1: Periscopes / Optronics
    "                                     WWW                                ",
    // 2: Masts
    "                                     RRR                                ",
    // 3: Masts
    "                                     RRR                                ",
    // 4: Sail top
    "                                   LLLLLLL                              ",
    // 5: Conning Tower (Sail)
    "                                  LLLLLLRRR                             ",
    // 6: Conning Tower (Sail)
    "                                  LLLLLLRRRD                            ",
    // 7: Sail base into hull
    "                                 LLLLLLLLRRRDD                          ",
    // 8: X-rudder upper diagonal & Upper hull line
    "   X                            LLLLLLLLLLRRRDD                         ",
    // 9: Upper X-plane & Deck
    "    XX                  LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL            ",
    // 10: Deck & Bow curve
    "     XXX        LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLD       ",
    // 11: Main Hull waterline (Swedish Gotland A19 hull)
    "      XXXX  RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRD    ",
    // 12: Mid-Hull / Flank Sonar Array
    "PP     XXXXXXXXRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR   ",
    // 13: Mid-Hull & Torpedo Tubes bow
    "PPP     XXXXXXXXRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR D   ",
    // 14: Lower Hull line & Bow
    "      XXXX  DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD D    ",
    // 15: Keel line & Lower X-plane
    "     XXX        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD      ",
    // 16: Lower X-plane
    "    XX                  DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD            ",
    // 17: Lower X-plane
    "   X                            DDDDDDDDDDDDDDD                         ",
    // 18:
    "  X                                                                     ",
    // 19:
    " X                                                                      "
  ];

  const colorMap: Record<string, string> = {
    'R': '#ff2222',
    'D': '#880000',
    'L': '#ff6666',
    'W': '#ffffff',
    'Y': '#ffd700',
    'X': '#cc1111',
    'P': '#ffffff' // Propeller
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
    <div className={`gotland-sub-wrapper ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="gotland-sub-svg"
        shapeRendering="crispEdges"
      >
        <defs>
          <filter id="subGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ff2222" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Sonar Depth Grid Lines behind sub */}
        <g stroke="#330000" strokeWidth="1" strokeDasharray="2 4" opacity="0.4">
          <line x1="0" y1="55" x2={width} y2="55" />
          <line x1="0" y1="80" x2={width} y2="80" />
        </g>

        {/* Pixel Sprite */}
        <g filter="url(#subGlow)">
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
      <div className="gotland-badge-text">
        <span className="sweden-flag">🇸🇪</span> HSwMS GOTLAND (A19) • STIRLING AIP • X-RUDDER
      </div>
    </div>
  );
};
