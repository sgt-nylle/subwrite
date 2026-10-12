import React from 'react';

export const SubmarineGraphic: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`submarine-graphic-container ${className}`}>
      <svg
        viewBox="0 0 640 180"
        xmlns="http://www.w3.org/2000/svg"
        className="submarine-svg"
      >
        <defs>
          <linearGradient id="hullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4444" />
            <stop offset="40%" stopColor="#cc0000" />
            <stop offset="80%" stopColor="#880000" />
            <stop offset="100%" stopColor="#330000" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Oceanic Grid / Water Depth Lines */}
        <g stroke="#440000" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
          <line x1="20" y1="30" x2="620" y2="30" />
          <line x1="20" y1="70" x2="620" y2="70" />
          <line x1="20" y1="110" x2="620" y2="110" />
          <line x1="20" y1="150" x2="620" y2="150" />
          <line x1="120" y1="10" x2="120" y2="170" />
          <line x1="280" y1="10" x2="280" y2="170" />
          <line x1="440" y1="10" x2="440" y2="170" />
        </g>

        {/* Sonar Acoustic Waves */}
        <g stroke="#ff2222" strokeWidth="1.5" fill="none" opacity="0.4" className="sonar-waves">
          <path d="M 580 85 A 30 30 0 0 0 580 95" />
          <path d="M 595 80 A 45 45 0 0 0 595 100" />
          <path d="M 610 75 A 60 60 0 0 0 610 105" />
        </g>

        {/* Submarine Main Body */}
        {/* Shrouded Propeller / Stern */}
        <path
          d="M 50 82 L 68 85 L 68 95 L 50 98 Z"
          fill="#ff3333"
          stroke="#ff8888"
          strokeWidth="1.5"
        />
        {/* Propeller Blades */}
        <line x1="48" y1="74" x2="48" y2="106" stroke="#ffffff" strokeWidth="2.5" />
        <ellipse cx="48" cy="90" rx="3" ry="16" fill="none" stroke="#ff4444" strokeWidth="1.5" />

        {/* Stern Fins / Rudder & Horizontal Stabilizers */}
        <path
          d="M 70 85 L 110 50 L 130 50 L 120 85 Z"
          fill="url(#hullGrad)"
          stroke="#ff5555"
          strokeWidth="2"
        />
        <path
          d="M 70 95 L 110 130 L 130 130 L 120 95 Z"
          fill="url(#hullGrad)"
          stroke="#ff5555"
          strokeWidth="2"
        />

        {/* Main Submarine Hull (Typhoon Class / Red October shape) */}
        {/* Rounded Bow to Tapered Stern */}
        <path
          d="M 560 90 
             C 560 70, 520 62, 440 62 
             L 240 62 
             C 170 62, 120 70, 70 86 
             L 70 94 
             C 120 110, 170 118, 240 118 
             L 440 118 
             C 520 118, 560 110, 560 90 Z"
          fill="url(#hullGrad)"
          stroke="#ff3333"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Conning Tower (Sail) */}
        <path
          d="M 330 62 
             L 345 32 
             L 415 32 
             L 425 62 Z"
          fill="url(#hullGrad)"
          stroke="#ff5555"
          strokeWidth="2"
        />

        {/* Periscopes & Masts */}
        <line x1="365" y1="32" x2="365" y2="14" stroke="#ff8888" strokeWidth="2.5" />
        <line x1="380" y1="32" x2="380" y2="8" stroke="#ffffff" strokeWidth="2.5" />
        <line x1="395" y1="32" x2="395" y2="18" stroke="#ff8888" strokeWidth="2.5" />
        <circle cx="380" cy="7" r="2" fill="#ff2222" />

        {/* Forward Dive Planes */}
        <rect x="490" y="80" width="32" height="7" rx="3" fill="#ff5555" stroke="#ffffff" strokeWidth="1.5" />

        {/* Soviet Red Star on Sail */}
        <g transform="translate(382, 47) scale(0.7)">
          <path
            d="M 0,-10 L 3,-3 L 10,-3 L 4,2 L 7,9 L 0,5 L -7,9 L -4,2 L -10,-3 L -3,-3 Z"
            fill="#ffd700"
            stroke="#ff0000"
            strokeWidth="1"
          />
        </g>

        {/* Missile Silo Hatches (SLBM Launch Deck) */}
        <g stroke="#550000" strokeWidth="1.5" fill="#220000">
          <rect x="250" y="65" width="12" height="6" rx="1" />
          <rect x="270" y="65" width="12" height="6" rx="1" />
          <rect x="290" y="65" width="12" height="6" rx="1" />
          <rect x="310" y="65" width="12" height="6" rx="1" />
        </g>

        {/* Torpedo Tubes / Bow Details */}
        <circle cx="538" cy="84" r="3.5" fill="#220000" stroke="#ff3333" strokeWidth="1" />
        <circle cx="538" cy="96" r="3.5" fill="#220000" stroke="#ff3333" strokeWidth="1" />
        <circle cx="548" cy="90" r="3.5" fill="#220000" stroke="#ff3333" strokeWidth="1" />

        {/* Waterline Glow Accent */}
        <path
          d="M 90 90 L 540 90"
          stroke="#ff8888"
          strokeWidth="1.5"
          strokeDasharray="16 8"
          opacity="0.8"
        />

        {/* Tactical Classification Text */}
        <text x="32" y="165" fill="#ff6666" fontFamily="'VT323', monospace" fontSize="18" letterSpacing="1">
          PROJECT 941 AKULA / TYPHOON-CLASS SSBN "KRASNY OKTYABR" (RED OCTOBER)
        </text>
        <text x="500" y="165" fill="#ffd700" fontFamily="'VT323', monospace" fontSize="18" letterSpacing="1">
          DISP: 48,000t
        </text>
      </svg>
    </div>
  );
};
