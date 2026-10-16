import React from 'react';

export const PubBeerDesk: React.FC<{ className?: string }> = ({ className = '' }) => {
  // 8-bit NES pixel grid representing a cold draught beer on a polished wooden bardesk
  // Features: Thick foaming head spilling over, golden amber lager with carbonation bubbles,
  // heavy dimpled glass mug with side handle, bar coaster, and rich mahogany counter.
  // Width: 64 pixels, Height: 22 pixels, rendered at crisp scale.
  const pixelSize = 5;
  const width = 64 * pixelSize; // 320px
  const height = 22 * pixelSize; // 110px

  // Color Map:
  // ' ' = Transparent
  // 'W' = Pure White Foam / Specular Glint (#ffffff)
  // 'C' = Cream Foam / Foam Shade (#fef08a)
  // 'Y' = Bright Golden Beer / Bubble (#fde047)
  // 'A' = Amber Lager Liquid (#eab308)
  // 'D' = Deep Amber Shadow (#b45309)
  // 'G' = Glass Rim / Specular Edge (#e2e8f0)
  // 'H' = Glass Handle / Transparent Glass (#94a3b8)
  // 'M' = Coaster Mat (#1e293b)
  // 'K' = Polished Wood Counter (#78350f)
  // 'L' = Wood Grain Highlight (#9a3412)
  // 'O' = Bar Counter Edge (#451a03)
  // 'P' = Counter Under-Shadow (#1c0a00)

  const rows = [
    // 0: Rising carbonation & fluffy foam peaks
    "                            WW                                  ",
    // 1: Thick billowy foam crown
    "                          WWWWWW    W                           ",
    // 2: Foam head spilling over
    "                        WWWWWWWWWW WW                           ",
    // 3: Dense foamy head on top of mug
    "                       CCCCCCCCCCCCCCC                          ",
    // 4: Creamy foam cascading over the glass rim
    "                      CCCCCCCCCCCCCCCCC                         ",
    // 5: Glass top rim & foam drip over edge
    "                      GCCWWCCCCCCCCCCCG                         ",
    // 6: Upper amber liquid line beneath the foam
    "                      GAYYWWYYYYYYYYAAG                         ",
    // 7: Cold draught lager with glass handle starting
    "                      GAYAYAYYYWYYYYAAGHHHH                     ",
    // 8: Carbonation bubbles rising & outer handle
    "                      GAAAAYYYYYAYYYAAG   HH                    ",
    // 9: Golden brew, rising bubble, and glass handle
    "                      GAAYAAAYYYYYYYAAG    HH                   ",
    // 10: Golden pint center & handle curve
    "                      GAYYYAYAYYYYYYAAG    HH                   ",
    // 11: Amber liquid depth & handle lower root
    "                      GAAAYYYYYWYYYDAAG    HH                   ",
    // 12: Rising bubble & handle joining back to mug
    "                      GAYAYAYYYYYAYDAAG   HH                    ",
    // 13: Lower amber body & handle join
    "                      GADAAAYYYYYYYDAAGHHHH                     ",
    // 14: Deep amber bottom layer
    "                      GDDDDDDDDDDDDDDDG                         ",
    // 15: Heavy solid glass base
    "                      GGGGGGGGGGGGGGGGG                         ",
    // 16: Dimpled glass bottom & bar coaster
    "                    MMMMMMMMMMMMMMMMMMMMM                       ",
    // 17: Coaster shadow on bardesk surface
    "                  MMMMMMMMMMMMMMMMMMMMMMMMM                     ",
    // 18: Polished mahogany bardesk surface with wood grain
    "LLKKKKKKKKKKKKKKKKKKKKKKKKLLKKKKKKKKKKKKKKKKKKKKKKKKLLKKKKKKKKKK",
    // 19: Rich wood grain streaks & glass reflection
    "KKKKKKLLKKKKKKKKKKKKKKLLKKKKKKKKKKKKLLKKKKKKKKKKKKKKKKKKLLKKKKKK",
    // 20: Bardesk beveled brass/wood front rail edge
    "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    // 21: Deep shadow beneath the bar counter edge
    "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP"
  ];

  const colorMap: Record<string, string> = {
    'W': '#ffffff',
    'C': '#fef08a',
    'Y': '#fde047',
    'A': '#eab308',
    'D': '#b45309',
    'G': '#cbd5e1',
    'H': '#94a3b8',
    'M': '#334155',
    'K': '#78350f',
    'L': '#9a3412',
    'O': '#451a03',
    'P': '#1c0a00'
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
    <div className={`gotland-sub-wrapper pub-beer-wrapper ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="gotland-sub-svg pub-beer-svg"
        shapeRendering="crispEdges"
        aria-label="8-bit Cold Beer on Bardesk pixel art"
      >
        <defs>
          <filter id="pubBeerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#facc15" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter="url(#pubBeerGlow)">
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
      <div className="gotland-badge-text pub-badge-text">
        <span className="sweden-flag">🍺</span>
        <span>OFF-DUTY PUB • COLD DRAUGHT LAGER • MAHOGANY BARDESK</span>
      </div>
    </div>
  );
};
