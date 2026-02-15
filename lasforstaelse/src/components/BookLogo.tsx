import React, { useId } from 'react';

interface BookLogoProps {
  size?: number;
}

export const BookLogo: React.FC<BookLogoProps> = ({ size = 48 }) => {
  const uid = useId();
  const leftId = `${uid}-leftPage`;
  const rightId = `${uid}-rightPage`;
  const glowId = `${uid}-glow`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={leftId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="30%" stopColor="#0072ff" />
          <stop offset="60%" stopColor="#00c853" />
          <stop offset="100%" stopColor="#b2ff59" />
        </linearGradient>
        <linearGradient id={rightId} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6d00" />
          <stop offset="30%" stopColor="#ff1744" />
          <stop offset="60%" stopColor="#d500f9" />
          <stop offset="100%" stopColor="#651fff" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow beneath book */}
      <ellipse cx="50" cy="82" rx="28" ry="4" fill="#c8d6e5" opacity="0.4" />

      {/* Left page (blue-green gradient) */}
      <path
        d="M48 30 C48 30, 46 32, 18 42 C16 42.8, 15 44, 15 46 L15 75 C15 77, 17 78, 19 77.2 L48 68 Z"
        fill={`url(#${leftId})`}
        opacity="0.92"
      />
      <path
        d="M48 30 C48 30, 46 32, 28 38 L28 66 L48 68 Z"
        fill="white"
        opacity="0.15"
      />

      {/* Right page (red-purple gradient) */}
      <path
        d="M52 30 C52 30, 54 32, 82 42 C84 42.8, 85 44, 85 46 L85 75 C85 77, 83 78, 81 77.2 L52 68 Z"
        fill={`url(#${rightId})`}
        opacity="0.92"
      />
      <path
        d="M52 30 C52 30, 54 32, 72 38 L72 66 L52 68 Z"
        fill="white"
        opacity="0.12"
      />

      {/* Open pages at top */}
      <path
        d="M48 30 Q50 26, 52 30"
        stroke="#f5f0e6"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M46 32 Q49 28, 50 28" stroke="#e8e0d0" strokeWidth="0.5" fill="none" />
      <path d="M47 31 Q49 27, 50 27" stroke="#e8e0d0" strokeWidth="0.5" fill="none" />

      {/* Spine line */}
      <line x1="50" y1="28" x2="50" y2="68" stroke="#e0d5c5" strokeWidth="1" opacity="0.5" />

      {/* Bookmark ribbon */}
      <path d="M62 28 L62 48 L65 44 L68 48 L68 28" fill="#ff9100" opacity="0.9" />

      {/* Sparkle stars */}
      <polygon
        points="56,18 57.2,21 60.5,21.2 58,23.2 58.8,26.5 56,24.8 53.2,26.5 54,23.2 51.5,21.2 54.8,21"
        fill="#ffd600"
        filter={`url(#${glowId})`}
      />
      <polygon
        points="35,16 35.8,18 38,18.1 36.3,19.4 36.8,21.5 35,20.3 33.2,21.5 33.7,19.4 32,18.1 34.2,18"
        fill="#00e5ff"
        filter={`url(#${glowId})`}
      />
      <polygon
        points="75,22 75.6,23.5 77.2,23.6 76,24.6 76.4,26.2 75,25.3 73.6,26.2 74,24.6 72.8,23.6 74.4,23.5"
        fill="#ff80ab"
        filter={`url(#${glowId})`}
      />
      <circle cx="70" cy="16" r="1.2" fill="#84ffff" filter={`url(#${glowId})`} />
      <circle cx="25" cy="24" r="1" fill="#b9f6ca" filter={`url(#${glowId})`} />
      <circle cx="44" cy="14" r="0.8" fill="#fff59d" />
      <circle cx="65" cy="14" r="0.7" fill="#80d8ff" />
      <circle cx="30" cy="20" r="0.6" fill="#ce93d8" opacity="0.7" />
      <circle cx="78" cy="18" r="0.5" fill="#80cbc4" opacity="0.7" />
    </svg>
  );
};
