import React, { useId } from 'react';

interface MatteLogoProps {
  size?: number;
}

export const MatteLogo: React.FC<MatteLogoProps> = ({ size = 48 }) => {
  const uid = useId();
  const bgId  = `${uid}-bg`;
  const g1Id  = `${uid}-g1`;
  const g2Id  = `${uid}-g2`;
  const g3Id  = `${uid}-g3`;
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
        {/* Badge background gradient */}
        <radialGradient id={bgId} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#1e4060" />
          <stop offset="100%" stopColor="#0a1e2e" />
        </radialGradient>

        {/* Compass N/S axis gradient */}
        <linearGradient id={g1Id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Compass E/W axis gradient */}
        <linearGradient id={g2Id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#fb923c" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        {/* Gold ring gradient */}
        <linearGradient id={g3Id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#fde68a" />
          <stop offset="50%"  stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Drop shadow ── */}
      <ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity="0.25" />

      {/* ── Outer badge ring ── */}
      <circle cx="50" cy="48" r="44" fill={`url(#${bgId})`} />
      <circle cx="50" cy="48" r="44" stroke={`url(#${g3Id})`} strokeWidth="3" />

      {/* ── Inner decorative ring ── */}
      <circle cx="50" cy="48" r="36" fill="none" stroke="#f59e0b" strokeWidth="0.8"
        strokeDasharray="3 2.5" opacity="0.45" />

      {/* ── Compass lines (faint) ── */}
      <line x1="50" y1="14" x2="50" y2="82" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />
      <line x1="16" y1="48" x2="84" y2="48" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />

      {/* ── Compass N pointer (blue) ── */}
      <polygon points="50,13 53.5,34 50,31 46.5,34" fill={`url(#${g1Id})`} />
      {/* ── Compass S pointer (dimmer) ── */}
      <polygon points="50,83 46.5,62 50,65 53.5,62" fill="#0369a1" opacity="0.6" />
      {/* ── Compass E pointer (orange) ── */}
      <polygon points="83,48 62,44.5 65,48 62,51.5" fill={`url(#${g2Id})`} />
      {/* ── Compass W pointer (dimmer) ── */}
      <polygon points="17,48 38,51.5 35,48 38,44.5" fill="#dc2626" opacity="0.6" />

      {/* ── Math operators at cardinal points ── */}
      {/* + (N area) */}
      <text x="50" y="24" textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontWeight="bold" fill="#7dd3fc" opacity="0.85">+</text>
      {/* × (E area) */}
      <text x="73" y="48" textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontWeight="bold" fill="#fdba74" opacity="0.85">×</text>
      {/* − (S area) */}
      <text x="50" y="72" textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontWeight="bold" fill="#7dd3fc" opacity="0.85">−</text>
      {/* ÷ (W area) */}
      <text x="27" y="48" textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontWeight="bold" fill="#fdba74" opacity="0.85">÷</text>

      {/* ── Center compass rose (4 diamonds) ── */}
      <polygon points="50,36 53,46 50,49 47,46" fill="#38bdf8" />
      <polygon points="50,60 47,50 50,49 53,50" fill="#0369a1" opacity="0.75" />
      <polygon points="38,48 48,45 49,48 48,51" fill="#fb923c" opacity="0.75" />
      <polygon points="62,48 52,51 51,48 52,45" fill="#fb923c" />

      {/* ── Center circle ── */}
      <circle cx="50" cy="48" r="4.5" fill="#0a1e2e" stroke={`url(#${g3Id})`} strokeWidth="2" />
      <circle cx="50" cy="48" r="1.5" fill="#fbbf24" />

      {/* ── Sparkle stars ── */}
      {/* Top-right */}
      <polygon
        points="72,16 73.3,19.5 77,19.7 74.2,22 75.3,25.5 72,23.5 68.7,25.5 69.8,22 67,19.7 70.7,19.5"
        fill="#fde68a" filter={`url(#${glowId})`} opacity="0.95"
      />
      {/* Top-left */}
      <polygon
        points="28,18 29,21 32,21.2 29.8,23 30.6,26 28,24.2 25.4,26 26.2,23 24,21.2 27,21"
        fill="#7dd3fc" filter={`url(#${glowId})`} opacity="0.85"
      />
      {/* Bottom-right dot */}
      <circle cx="74" cy="76" r="1.5" fill="#fbbf24" opacity="0.7" />
      {/* Bottom-left dot */}
      <circle cx="26" cy="75" r="1.2" fill="#38bdf8" opacity="0.6" />
      {/* Right edge tiny dot */}
      <circle cx="85" cy="28" r="1" fill="#fde68a" opacity="0.6" />
      {/* Left edge tiny dot */}
      <circle cx="15" cy="30" r="0.8" fill="#a5f3fc" opacity="0.5" />
    </svg>
  );
};
