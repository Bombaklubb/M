"use client";

interface Props {
  itemId: string;
  size?: number;
}

export default function ItemIcon({ itemId, size = 44 }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {renderIcon(itemId)}
    </svg>
  );
}

function renderIcon(id: string) {
  switch (id) {

    // ─── HATTAR ──────────────────────────────────────────────────────────────

    case "headband":
      return (
        <g>
          <rect x="5" y="18" width="38" height="9" rx="4.5" fill="#DC2626" stroke="#1F2937" strokeWidth="2" />
          <rect x="7" y="20" width="34" height="5" rx="2.5" fill="#EF4444" />
          <circle cx="24" cy="22.5" r="3" fill="#B91C1C" />
          <rect x="21" y="20" width="6" height="5" rx="2" fill="#DC2626" stroke="#1F2937" strokeWidth="1.5" />
        </g>
      );

    case "explorer_hat":
      return (
        <g>
          <ellipse cx="24" cy="30" rx="21" ry="6" fill="#92400E" stroke="#1F2937" strokeWidth="2" />
          <ellipse cx="24" cy="30" rx="21" ry="6" fill="#78350F" opacity="0.35" />
          <rect x="14" y="12" width="20" height="20" rx="6" fill="#B45309" stroke="#1F2937" strokeWidth="2" />
          <rect x="14" y="24" width="20" height="6" rx="1" fill="#78350F" />
          <path d="M26,18 Q30,13 28,11 Q25,14 26,18Z" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
        </g>
      );

    case "cap":
      return (
        <g>
          <path d="M7,28 Q7,10 24,10 Q41,10 41,28 Z" fill="#3B82F6" stroke="#1F2937" strokeWidth="2" />
          <rect x="5" y="26" width="22" height="6" rx="3" fill="#1D4ED8" stroke="#1F2937" strokeWidth="2" />
          <circle cx="24" cy="11" r="3" fill="#1E40AF" stroke="#1F2937" strokeWidth="1.5" />
          <line x1="12" y1="28" x2="38" y2="28" stroke="#1E40AF" strokeWidth="1.2" opacity="0.5" />
        </g>
      );

    case "santa_hat":
      return (
        <g>
          <ellipse cx="24" cy="34" rx="17" ry="5.5" fill="white" stroke="#1F2937" strokeWidth="2" />
          <polygon points="24,4 11,34 37,34" fill="#DC2626" stroke="#1F2937" strokeWidth="2" />
          <circle cx="24" cy="4" r="5" fill="white" stroke="#1F2937" strokeWidth="1.5" />
          <ellipse cx="24" cy="34" rx="15" ry="4" fill="white" opacity="0.4" />
        </g>
      );

    case "cowboy_hat":
      return (
        <g>
          <ellipse cx="24" cy="30" rx="22" ry="6" fill="#92400E" stroke="#1F2937" strokeWidth="2" />
          <rect x="14" y="11" width="20" height="21" rx="5" fill="#B45309" stroke="#1F2937" strokeWidth="2" />
          <rect x="14" y="24" width="20" height="6" rx="1" fill="#78350F" />
          <ellipse cx="24" cy="30" rx="19" ry="4.5" fill="#9A3412" opacity="0.3" />
        </g>
      );

    case "wizard_hat":
      return (
        <g>
          <ellipse cx="24" cy="32" rx="18" ry="5.5" fill="#4C1D95" stroke="#1F2937" strokeWidth="2" />
          <polygon points="24,3 12,32 36,32" fill="#5B21B6" stroke="#1F2937" strokeWidth="2" />
          <circle cx="18" cy="20" r="3" fill="#FCD34D" stroke="#92400E" strokeWidth="1" />
          <circle cx="28" cy="13" r="2.5" fill="#FCD34D" stroke="#92400E" strokeWidth="1" />
          <circle cx="33" cy="23" r="1.8" fill="#C4B5FD" />
        </g>
      );

    case "graduation_cap":
      return (
        <g>
          <ellipse cx="24" cy="26" rx="19" ry="5" fill="#1F2937" stroke="#111827" strokeWidth="2" />
          <rect x="15" y="10" width="18" height="17" rx="2" fill="#374151" stroke="#1F2937" strokeWidth="2" />
          <polygon points="4,22 24,14 44,22 24,30" fill="#111827" stroke="#1F2937" strokeWidth="1.5" />
          <line x1="38" y1="22" x2="44" y2="34" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="44" cy="35" r="3.5" fill="#F59E0B" stroke="#1F2937" strokeWidth="1.5" />
        </g>
      );

    case "crown":
      return (
        <g>
          <polygon points="4,38 4,22 14,30 24,12 34,30 44,22 44,38" fill="#F59E0B" stroke="#1F2937" strokeWidth="2" />
          <rect x="4" y="33" width="40" height="9" rx="3" fill="#FBBF24" stroke="#1F2937" strokeWidth="2" />
          <circle cx="24" cy="16" r="4" fill="#DC2626" stroke="#1F2937" strokeWidth="1" />
          <circle cx="10" cy="29" r="3" fill="#60A5FA" stroke="#1F2937" strokeWidth="1" />
          <circle cx="38" cy="29" r="3" fill="#60A5FA" stroke="#1F2937" strokeWidth="1" />
          <rect x="6" y="35" width="36" height="5" rx="1.5" fill="#F59E0B" opacity="0.5" />
        </g>
      );

    // ─── TRÖJOR ──────────────────────────────────────────────────────────────

    case "hoodie":
      return (
        <g>
          <rect x="2" y="18" width="8" height="20" rx="4" fill="#6B7280" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="38" y="18" width="8" height="20" rx="4" fill="#6B7280" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="8" y="18" width="32" height="24" rx="4" fill="#6B7280" stroke="#1F2937" strokeWidth="2" />
          <path d="M10,18 Q10,10 24,10 Q38,10 38,18" fill="#6B7280" stroke="#1F2937" strokeWidth="2" />
          <line x1="21" y1="22" x2="21" y2="30" stroke="#9CA3AF" strokeWidth="1.5" />
          <line x1="27" y1="22" x2="27" y2="30" stroke="#9CA3AF" strokeWidth="1.5" />
          <circle cx="21" cy="31" r="2" fill="#9CA3AF" />
          <circle cx="27" cy="31" r="2" fill="#9CA3AF" />
        </g>
      );

    case "explorer_jacket":
      return (
        <g>
          <rect x="2" y="18" width="8" height="20" rx="4" fill="#92400E" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="38" y="18" width="8" height="20" rx="4" fill="#92400E" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="8" y="18" width="32" height="24" rx="4" fill="#92400E" stroke="#1F2937" strokeWidth="2" />
          <path d="M14,18 L19,26 L24,20 L29,26 L34,18" fill="none" stroke="#78350F" strokeWidth="2" />
          <rect x="12" y="30" width="8" height="6" rx="1" fill="#78350F" stroke="#92400E" strokeWidth="1" />
          <rect x="28" y="30" width="8" height="6" rx="1" fill="#78350F" stroke="#92400E" strokeWidth="1" />
        </g>
      );

    case "lab_coat":
      return (
        <g>
          <rect x="2" y="18" width="8" height="20" rx="4" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5" />
          <rect x="38" y="18" width="8" height="20" rx="4" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5" />
          <rect x="8" y="18" width="32" height="24" rx="4" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="2" />
          <path d="M24,18 L17,27 L19,42" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
          <path d="M24,18 L31,27 L29,42" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
          <rect x="14" y="28" width="8" height="6" rx="1" fill="none" stroke="#D1D5DB" strokeWidth="1.5" />
          <line x1="24" y1="32" x2="24" y2="42" stroke="#D1D5DB" strokeWidth="1.2" />
        </g>
      );

    case "sport_jersey":
      return (
        <g>
          <rect x="2" y="18" width="8" height="20" rx="4" fill="#059669" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="38" y="18" width="8" height="20" rx="4" fill="#059669" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="8" y="18" width="32" height="24" rx="4" fill="#059669" stroke="#1F2937" strokeWidth="2" />
          <path d="M14,18 L19,24 L24,19 L29,24 L34,18" fill="none" stroke="white" strokeWidth="1.5" />
          <text x="24" y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">10</text>
        </g>
      );

    case "armor_shirt":
      return (
        <g>
          <rect x="2" y="18" width="8" height="20" rx="4" fill="#9CA3AF" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="38" y="18" width="8" height="20" rx="4" fill="#9CA3AF" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="8" y="18" width="32" height="24" rx="4" fill="#9CA3AF" stroke="#1F2937" strokeWidth="2" />
          <line x1="24" y1="18" x2="24" y2="42" stroke="#6B7280" strokeWidth="1.5" />
          <line x1="8" y1="30" x2="40" y2="30" stroke="#6B7280" strokeWidth="1.5" />
          <path d="M14,18 L14,28 L20,23Z" fill="#D1D5DB" />
          <path d="M34,18 L34,28 L28,23Z" fill="#D1D5DB" />
          <rect x="10" y="31" width="12" height="9" rx="1" fill="#B0B8C4" />
          <rect x="26" y="31" width="12" height="9" rx="1" fill="#B0B8C4" />
        </g>
      );

    case "tuxedo":
      return (
        <g>
          <rect x="2" y="18" width="8" height="20" rx="4" fill="#111827" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="38" y="18" width="8" height="20" rx="4" fill="#111827" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="8" y="18" width="32" height="24" rx="4" fill="#111827" stroke="#1F2937" strokeWidth="2" />
          <path d="M24,18 L17,28 L24,34 L31,28Z" fill="white" />
          <circle cx="24" cy="36" r="3" fill="#DC2626" stroke="#1F2937" strokeWidth="1" />
          <line x1="22" y1="38" x2="22" y2="42" stroke="#4B5563" strokeWidth="1.2" />
          <line x1="26" y1="38" x2="26" y2="42" stroke="#4B5563" strokeWidth="1.2" />
        </g>
      );

    case "academic_robe":
      return (
        <g>
          <rect x="2" y="18" width="8" height="20" rx="4" fill="#4C1D95" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="38" y="18" width="8" height="20" rx="4" fill="#4C1D95" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="8" y="18" width="32" height="24" rx="4" fill="#4C1D95" stroke="#1F2937" strokeWidth="2" />
          <path d="M24,18 L17,26 L19,42" fill="#6D28D9" stroke="#4C1D95" strokeWidth="1" />
          <path d="M24,18 L31,26 L29,42" fill="#6D28D9" stroke="#4C1D95" strokeWidth="1" />
          <path d="M15,18 Q24,24 33,18" fill="none" stroke="white" strokeWidth="2" />
          <rect x="8" y="18" width="5" height="24" rx="1" fill="#5B21B6" opacity="0.6" />
          <rect x="35" y="18" width="5" height="24" rx="1" fill="#5B21B6" opacity="0.6" />
        </g>
      );

    case "cape":
      return (
        <g>
          <path d="M6,20 Q0,36 4,48 L44,48 Q48,36 42,20" fill="#DC2626" stroke="#1F2937" strokeWidth="2" />
          <rect x="12" y="14" width="24" height="8" rx="4" fill="#111827" stroke="#1F2937" strokeWidth="2" />
          <polygon points="24,24 26.5,31 34,31 28,35 30,42 24,38 18,42 20,35 14,31 21.5,31" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
        </g>
      );

    // ─── TILLBEHÖR ───────────────────────────────────────────────────────────

    case "glasses":
      return (
        <g>
          <circle cx="15" cy="26" r="11" fill="#BFDBFE" opacity="0.45" stroke="#374151" strokeWidth="2.5" />
          <circle cx="33" cy="26" r="11" fill="#BFDBFE" opacity="0.45" stroke="#374151" strokeWidth="2.5" />
          <line x1="26" y1="26" x2="30" y2="26" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4"  y1="24" x2="9"  y2="26" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="39" y1="26" x2="44" y2="24" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="15" cy="23" r="3" fill="white" opacity="0.4" />
          <circle cx="33" cy="23" r="3" fill="white" opacity="0.4" />
        </g>
      );

    case "backpack":
      return (
        <g>
          <rect x="10" y="10" width="28" height="32" rx="5" fill="#92400E" stroke="#1F2937" strokeWidth="2" />
          <rect x="14" y="6" width="5" height="8" rx="2.5" fill="#78350F" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="29" y="6" width="5" height="8" rx="2.5" fill="#78350F" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="14" y="16" width="20" height="14" rx="3" fill="#B45309" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="20" y="22" width="8" height="4" rx="2" fill="#92400E" />
          <line x1="24" y1="34" x2="24" y2="40" stroke="#78350F" strokeWidth="1.5" />
          <ellipse cx="24" cy="40" rx="5" ry="2" fill="#78350F" />
        </g>
      );

    case "book":
      return (
        <g>
          <rect x="8" y="6" width="30" height="36" rx="2" fill="#5B21B6" stroke="#1F2937" strokeWidth="2" />
          <rect x="8" y="6" width="7" height="36" rx="2" fill="#4C1D95" stroke="#1F2937" strokeWidth="1.5" />
          <line x1="15" y1="6" x2="15" y2="42" stroke="#6D28D9" strokeWidth="1" />
          <circle cx="28" cy="18" r="4" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
          <polygon points="28,12 29.5,17 28,22 26.5,17" fill="#FCD34D" opacity="0.6" />
          <circle cx="23" cy="28" r="2.5" fill="#FCD34D" opacity="0.8" />
          <circle cx="33" cy="28" r="2.5" fill="#FCD34D" opacity="0.8" />
          <line x1="20" y1="33" x2="36" y2="33" stroke="#7C3AED" strokeWidth="1.2" />
          <line x1="20" y1="36" x2="36" y2="36" stroke="#7C3AED" strokeWidth="1.2" />
        </g>
      );

    case "compass":
      return (
        <g>
          <circle cx="24" cy="24" r="20" fill="#F59E0B" stroke="#1F2937" strokeWidth="2" />
          <circle cx="24" cy="24" r="16" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5" />
          <text x="24" y="12" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400E">N</text>
          <text x="24" y="39" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400E">S</text>
          <text x="12" y="27" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400E">W</text>
          <text x="36" y="27" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400E">E</text>
          <polygon points="24,9 26,22 24,26 22,22" fill="#DC2626" stroke="#1F2937" strokeWidth="0.7" />
          <polygon points="24,26 26,28 24,39 22,28" fill="#D1D5DB" stroke="#1F2937" strokeWidth="0.7" />
          <circle cx="24" cy="24" r="2.5" fill="#1F2937" />
        </g>
      );

    case "medal":
      return (
        <g>
          <path d="M18,4 L18,18 L24,13 L30,18 L30,4Z" fill="#DC2626" stroke="#1F2937" strokeWidth="1.5" />
          <path d="M18,4 L30,4 L30,15 L24,11 L18,15Z" fill="#EF4444" />
          <circle cx="24" cy="32" r="16" fill="#F59E0B" stroke="#1F2937" strokeWidth="2" />
          <circle cx="24" cy="32" r="12" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5" />
          <polygon points="24,22 26,28 32,28 27.5,31.5 29.5,37.5 24,34 18.5,37.5 20.5,31.5 16,28 22,28" fill="#F59E0B" />
          <circle cx="24" cy="17" r="3" fill="#78350F" stroke="#1F2937" strokeWidth="1" />
        </g>
      );

    case "trophy":
      return (
        <g>
          <path d="M12,10 Q8,10 8,18 Q8,26 18,28 Q20,33 16,35" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <path d="M36,10 Q40,10 40,18 Q40,26 30,28 Q28,33 32,35" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <path d="M12,10 Q12,0 18,0 L30,0 Q36,0 36,10 Q36,28 24,32 Q12,28 12,10Z" fill="#F59E0B" stroke="#1F2937" strokeWidth="2" />
          <rect x="18" y="32" width="12" height="8" fill="#F59E0B" stroke="#1F2937" strokeWidth="1.5" />
          <rect x="14" y="40" width="20" height="5" rx="2.5" fill="#FBBF24" stroke="#1F2937" strokeWidth="1.5" />
          <circle cx="20" cy="14" r="3" fill="white" opacity="0.45" />
        </g>
      );

    case "magic_wand":
      return (
        <g>
          <line x1="6" y1="42" x2="36" y2="12" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
          <polygon points="36,12 43,4 29,4" fill="#FCD34D" stroke="#1F2937" strokeWidth="1.5" />
          <circle cx="36" cy="12" r="4" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="12" cy="36" r="2.5" fill="#A78BFA" opacity="0.8" />
          <circle cx="20" cy="28" r="2" fill="#FCD34D" opacity="0.85" />
          <circle cx="8" cy="26" r="1.5" fill="#C4B5FD" opacity="0.7" />
          <polygon points="40,20 41.5,24 40,28 38.5,24" fill="#FCD34D" opacity="0.8" />
        </g>
      );

    case "magnifying_glass":
      return (
        <g>
          <circle cx="19" cy="19" r="14" fill="#BAE6FD" opacity="0.5" stroke="#1F2937" strokeWidth="2.5" />
          <circle cx="19" cy="19" r="11" fill="none" stroke="#374151" strokeWidth="2" />
          <line x1="30" y1="30" x2="43" y2="43" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
          <line x1="30" y1="30" x2="43" y2="43" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="13" cy="13" rx="4" ry="3" fill="white" opacity="0.55" transform="rotate(-35 13 13)" />
        </g>
      );

    // ─── EFFEKTER ─────────────────────────────────────────────────────────────

    case "star_glow":
      return (
        <g>
          <circle cx="24" cy="24" r="22" fill="#FCD34D" opacity="0.15" />
          <circle cx="24" cy="24" r="14" fill="#FCD34D" opacity="0.25" />
          <polygon points="24,6 27.5,17 39,17 30,24 33.5,35 24,28 14.5,35 18,24 9,17 20.5,17" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="4" fill="#FBBF24" />
          {[[0],[60],[120],[180],[240],[300]].map(([deg], i) => {
            const r = 20, rad = (deg * Math.PI) / 180;
            return <line key={i} x1={24 + 14*Math.cos(rad)} y1={24 + 14*Math.sin(rad)} x2={24 + r*Math.cos(rad)} y2={24 + r*Math.sin(rad)} stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />;
          })}
        </g>
      );

    case "sparkles":
      return (
        <g>
          <polygon points="24,5 26.5,17 39,15 28,22 36,33 24,27 12,33 20,22 9,15 21.5,17" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5" />
          <polygon points="8,10 9.5,14 14,10 9.5,6" fill="#A78BFA" stroke="#7C3AED" strokeWidth="0.8" />
          <polygon points="40,6 41.5,10 46,6 41.5,2" fill="#60A5FA" stroke="#3B82F6" strokeWidth="0.8" />
          <polygon points="40,38 41.5,42 46,38 41.5,34" fill="#FCD34D" stroke="#F59E0B" strokeWidth="0.8" />
          <circle cx="7" cy="32" r="2.5" fill="#F472B6" opacity="0.85" />
          <circle cx="42" cy="24" r="2" fill="#34D399" opacity="0.85" />
        </g>
      );

    case "magic_swirl":
      return (
        <g>
          <path d="M24,44 Q6,36 5,24 Q4,12 16,8 Q28,4 36,14 Q44,24 36,34 Q28,44 18,38 Q8,32 12,20 Q16,8 26,12" fill="none" stroke="#8B5CF6" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24,40 Q10,34 9,24 Q8,15 18,12 Q28,9 34,18 Q40,27 33,35" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <circle cx="5" cy="24" r="3.5" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1" />
          <circle cx="36" cy="34" r="3" fill="#C4B5FD" stroke="#8B5CF6" strokeWidth="1" />
          <circle cx="26" cy="12" r="2.5" fill="#7C3AED" />
        </g>
      );

    case "energy_ring":
      return (
        <g>
          <ellipse cx="24" cy="36" rx="21" ry="7" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
          <ellipse cx="24" cy="36" rx="21" ry="7" fill="none" stroke="#FCD34D" strokeWidth="1.5" opacity="0.45" />
          <ellipse cx="24" cy="30" rx="15" ry="5" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.7" />
          <circle cx="24" cy="14" r="8" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="24,7 26,13 24,18 22,13" fill="#F97316" opacity="0.9" />
          <line x1="9"  y1="33" x2="4"  y2="25" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="39" y1="33" x2="44" y2="25" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </g>
      );

    case "golden_shine":
      return (
        <g>
          <circle cx="24" cy="24" r="22" fill="#F59E0B" opacity="0.12" />
          <circle cx="24" cy="24" r="14" fill="#F59E0B" opacity="0.2" />
          <circle cx="24" cy="24" r="9" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const r1 = 12, r2 = i % 2 === 0 ? 20 : 17;
            return <line key={i} x1={24 + r1*Math.cos(rad)} y1={24 + r1*Math.sin(rad)} x2={24 + r2*Math.cos(rad)} y2={24 + r2*Math.sin(rad)} stroke="#FCD34D" strokeWidth={i % 2 === 0 ? "2" : "1.5"} strokeLinecap="round" opacity="0.8" />;
          })}
        </g>
      );

    case "light_beam":
      return (
        <g>
          <path d="M17,0 L4,48 L44,48 L31,0Z" fill="#FBBF24" opacity="0.22" />
          <path d="M20,0 L9,48 L39,48 L28,0Z" fill="#FBBF24" opacity="0.25" />
          <ellipse cx="24" cy="4" rx="14" ry="6" fill="#FBBF24" opacity="0.55" />
          <ellipse cx="24" cy="4" rx="8" ry="4" fill="#FDE68A" opacity="0.8" />
          <polygon points="24,0 25.5,4 24,8 22.5,4" fill="#FDE68A" />
          <line x1="12" y1="0" x2="6"  y2="48" stroke="#FBBF24" strokeWidth="1" opacity="0.4" />
          <line x1="36" y1="0" x2="42" y2="48" stroke="#FBBF24" strokeWidth="1" opacity="0.4" />
        </g>
      );

    case "fire_aura":
      return (
        <g>
          <ellipse cx="24" cy="40" rx="20" ry="8" fill="#F97316" opacity="0.3" />
          <path d="M10,42 Q8,30 13,22 Q16,32 16,42Z" fill="#F97316" opacity="0.75" />
          <path d="M24,42 Q22,22 24,8 Q26,22 28,42Z" fill="#EF4444" opacity="0.85" />
          <path d="M38,42 Q40,30 35,22 Q32,32 32,42Z" fill="#F97316" opacity="0.75" />
          <path d="M17,42 Q16,32 19,26 Q21,34 20,42Z" fill="#FB923C" opacity="0.6" />
          <path d="M31,42 Q32,32 29,26 Q27,34 28,42Z" fill="#FB923C" opacity="0.6" />
          <ellipse cx="24" cy="10" rx="5" ry="7" fill="#FCD34D" opacity="0.7" />
        </g>
      );

    case "sparkle_dust":
      return (
        <g>
          {[
            [8,  8,  "#F472B6", 3.5],
            [20, 4,  "#FCD34D", 2.5],
            [38, 8,  "#60A5FA", 3.5],
            [44, 22, "#34D399", 2.5],
            [40, 38, "#A78BFA", 3.5],
            [12, 42, "#F97316", 2.5],
            [24, 44, "#FCD34D", 3.0],
            [4,  30, "#F472B6", 2.0],
            [24, 22, "#FCD34D", 4.0],
            [16, 18, "#60A5FA", 2.0],
            [32, 18, "#A78BFA", 2.0],
            [36, 30, "#34D399", 2.0],
          ].map(([x, y, color, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={color as string} opacity="0.9" />
          ))}
          <polygon points="24,16 25.5,21 24,26 22.5,21" fill="#FCD34D" opacity="0.9" />
        </g>
      );

    default:
      return (
        <g>
          <circle cx="24" cy="24" r="18" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
          <text x="24" y="29" textAnchor="middle" fontSize="16">❓</text>
        </g>
      );
  }
}
