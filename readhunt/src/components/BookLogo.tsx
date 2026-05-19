import React from 'react';

interface BookLogoProps {
  size?: number;
}

export const BookLogo: React.FC<BookLogoProps> = ({ size = 48 }) => {
  const scale = size / 160;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Readhunt"
    >
      {/* Book body */}
      <rect x="28" y="30" width="104" height="80" rx="8" fill="url(#bookGrad)" />
      {/* Spine */}
      <rect x="28" y="30" width="16" height="80" rx="4" fill="url(#spineGrad)" />
      {/* Pages highlight */}
      <rect x="44" y="38" width="80" height="4" rx="2" fill="white" fillOpacity="0.35" />
      <rect x="44" y="50" width="64" height="3" rx="1.5" fill="white" fillOpacity="0.22" />
      <rect x="44" y="60" width="72" height="3" rx="1.5" fill="white" fillOpacity="0.22" />
      <rect x="44" y="70" width="56" height="3" rx="1.5" fill="white" fillOpacity="0.22" />
      <rect x="44" y="80" width="68" height="3" rx="1.5" fill="white" fillOpacity="0.22" />
      {/* Magnifying glass */}
      <circle cx="108" cy="88" r="18" fill="url(#glassGrad)" stroke="white" strokeWidth="3" />
      <circle cx="108" cy="88" r="11" fill="white" fillOpacity="0.18" />
      <line x1="120" y1="100" x2="132" y2="114" stroke="url(#handleGrad)" strokeWidth="5" strokeLinecap="round" />
      {/* "Readhunt" label */}
      <rect x="16" y="118" width="128" height="30" rx="8" fill="url(#labelGrad)" />
      <text
        x="80"
        y="139"
        textAnchor="middle"
        fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
        fontWeight="800"
        fontSize="18"
        letterSpacing="0.5"
        fill="white"
      >
        Readhunt
      </text>
      <defs>
        <linearGradient id="bookGrad" x1="28" y1="30" x2="132" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="spineGrad" x1="28" y1="30" x2="44" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="90" y1="70" x2="126" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="handleGrad" x1="120" y1="100" x2="132" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="labelGrad" x1="16" y1="118" x2="144" y2="148" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
};
