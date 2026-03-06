"use client";

import type { SkinTone } from "@/lib/types";

interface Props {
  heroId: string;
  skinTone: SkinTone;
  equippedAttributes: string[];
  size?: number;
}

const SKIN: Record<SkinTone, { base: string; shadow: string; lip: string }> = {
  light:       { base: "#FDDBB4", shadow: "#E8B070", lip: "#C06050" },
  light_brown: { base: "#C58540", shadow: "#9C6230", lip: "#804030" },
  dark:        { base: "#7B4828", shadow: "#5A3318", lip: "#3C1A0A" },
};

const HAIR: Record<SkinTone, string> = {
  light:       "#7C5228",
  light_brown: "#2D1B0E",
  dark:        "#150800",
};

const SHIRT_BASE: Record<string, string> = {
  explorer:  "#B45309",
  scientist: "#BFDBFE",
  athlete:   "#1D4ED8",
  wizard:    "#6D28D9",
  inventor:  "#047857",
  scholar:   "#991B1B",
};

const PANTS_BASE: Record<string, string> = {
  explorer:  "#292524",
  scientist: "#374151",
  athlete:   "#1E3A8A",
  wizard:    "#1E1B4B",
  inventor:  "#134E4A",
  scholar:   "#3B0A0A",
};

function Hair({ heroId, color }: { heroId: string; color: string }) {
  switch (heroId) {
    case "scientist":
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M22,24 Q30,16 40,15" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case "athlete":
      return <path d="M27,22 Q30,10 40,10 Q50,10 53,22" fill={color} />;
    case "wizard":
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M22,30 Q20,38 22,46" fill={color} />
          <path d="M58,30 Q60,38 58,46" fill={color} />
        </g>
      );
    case "inventor":
      return (
        <g>
          <path d="M26,22 Q28,12 40,12 Q52,12 54,22" fill={color} />
          <polygon points="30,18 33,6 36,18" fill={color} />
          <polygon points="37,13 40,3 43,13" fill={color} />
          <polygon points="44,18 47,6 50,18" fill={color} />
        </g>
      );
    case "scholar":
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M26,22 Q29,17 34,18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    default: // explorer
      return <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />;
  }
}

function Hat({ hatId, shirtColor }: { hatId: string; shirtColor: string }) {
  switch (hatId) {
    case "explorer_hat":
      return (
        <g>
          <ellipse cx="40" cy="14" rx="25" ry="5" fill="#92400E" />
          <rect x="28" y="5" width="24" height="11" rx="4" fill="#B45309" />
          <rect x="28" y="12" width="24" height="3" fill="#78350F" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M23,16 Q23,5 40,5 Q57,5 57,16 Z" fill={shirtColor} />
          <rect x="23" y="14" width="22" height="5" rx="2.5" fill="#1F2937" />
          <circle cx="40" cy="6" r="2" fill="#111827" />
        </g>
      );
    case "wizard_hat":
      return (
        <g>
          <ellipse cx="40" cy="14" rx="20" ry="5" fill="#4C1D95" />
          <polygon points="40,-2 28,14 52,14" fill="#5B21B6" />
          <text x="40" y="9" textAnchor="middle" fontSize="6" dominantBaseline="middle">⭐</text>
        </g>
      );
    case "graduation_cap":
      return (
        <g>
          <rect x="24" y="11" width="32" height="5" rx="1" fill="#111827" />
          <rect x="28" y="4" width="24" height="8" rx="1" fill="#1F2937" />
          <line x1="52" y1="11" x2="58" y2="18" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="58" cy="18" r="2" fill="#F59E0B" />
        </g>
      );
    default:
      return null;
  }
}

function Accessory({ id, hand }: { id: string; hand: "left" | "right" }) {
  const x = hand === "right" ? 62 : 8;
  const flip = hand === "left" ? "scale(-1,1) translate(-80,0)" : undefined;

  switch (id) {
    case "compass":
      return (
        <g transform={`translate(${x},72) ${flip ?? ""}`}>
          <circle cx="7" cy="0" r="7" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
          <line x1="7" y1="-4" x2="7" y2="4" stroke="#1F2937" strokeWidth="1" />
          <line x1="3" y1="0" x2="11" y2="0" stroke="#1F2937" strokeWidth="1" />
          <circle cx="7" cy="0" r="1.5" fill="#DC2626" />
        </g>
      );
    case "magic_wand":
      return (
        <g transform={`translate(${x},70) ${flip ?? ""}`}>
          <line x1="2" y1="2" x2="14" y2="-10" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="14,-10 18,-14 10,-14" fill="#FCD34D" />
          <circle cx="14" cy="-10" r="2" fill="#FDE68A" />
        </g>
      );
    case "book":
      return (
        <g transform={`translate(${x},72) ${flip ?? ""}`}>
          <rect x="0" y="-8" width="14" height="11" rx="1.5" fill="#1D4ED8" />
          <line x1="7" y1="-8" x2="7" y2="3" stroke="#93C5FD" strokeWidth="0.8" />
          <rect x="0" y="-8" width="3" height="11" rx="1" fill="#1E40AF" />
        </g>
      );
    case "trophy":
      return (
        <g transform={`translate(${x},68) ${flip ?? ""}`}>
          <path d="M2,0 Q0,-8 4,-10 L10,-10 Q14,-8 12,0 Q8,5 7,5 Q6,5 2,0Z" fill="#FCD34D" />
          <rect x="5" y="5" width="4" height="5" fill="#F59E0B" />
          <rect x="3" y="10" width="8" height="2" rx="1" fill="#F59E0B" />
          <path d="M0,0 Q-4,-2 -3,-7" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <path d="M14,0 Q18,-2 17,-7" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

export default function HeroAvatar({ heroId, skinTone, equippedAttributes, size = 120 }: Props) {
  const skin = SKIN[skinTone] ?? SKIN.light;
  const hairColor = HAIR[skinTone] ?? HAIR.light;
  const baseShirt = SHIRT_BASE[heroId] ?? "#B45309";
  const pants = PANTS_BASE[heroId] ?? "#292524";

  const equippedHat = equippedAttributes.find((a) =>
    ["explorer_hat", "cap", "wizard_hat", "graduation_cap"].includes(a)
  );
  const equippedShirt = equippedAttributes.find((a) =>
    ["hoodie", "lab_coat", "explorer_jacket", "armor_shirt"].includes(a)
  );
  const equippedAccessory = equippedAttributes.find((a) =>
    ["compass", "magic_wand", "book", "trophy"].includes(a)
  );
  const hasGlasses = equippedAttributes.includes("glasses");
  const hasBackpack = equippedAttributes.includes("backpack");
  const hasStarGlow = equippedAttributes.includes("star_glow");

  const shirtColor =
    equippedShirt === "hoodie"          ? "#6B7280" :
    equippedShirt === "lab_coat"        ? "#F3F4F6" :
    equippedShirt === "explorer_jacket" ? "#92400E" :
    equippedShirt === "armor_shirt"     ? "#9CA3AF" :
    baseShirt;

  const viewW = 80;
  const viewH = 130;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      width={size}
      height={Math.round(size * viewH / viewW)}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Star glow */}
      {hasStarGlow && (
        <>
          <defs>
            <radialGradient id={`sg-${heroId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="40" cy="70" rx="44" ry="55" fill={`url(#sg-${heroId})`} />
        </>
      )}

      {/* Backpack (behind body) */}
      {hasBackpack && (
        <g>
          <rect x="56" y="48" width="13" height="24" rx="3" fill="#92400E" />
          <rect x="57" y="50" width="4" height="20" rx="2" fill="#B45309" />
          <rect x="62" y="50" width="4" height="20" rx="2" fill="#B45309" />
          <rect x="57" y="56" width="9" height="5" rx="1.5" fill="#A16207" />
        </g>
      )}

      {/* Legs */}
      <rect x="22" y="84" width="14" height="34" rx="5" fill={pants} />
      <rect x="44" y="84" width="14" height="34" rx="5" fill={pants} />
      {/* Shoes */}
      <rect x="20" y="113" width="18" height="9" rx="4" fill="#1C1917" />
      <rect x="42" y="113" width="18" height="9" rx="4" fill="#1C1917" />

      {/* Arms */}
      <rect x="8"  y="50" width="12" height="28" rx="5" fill={shirtColor} />
      <rect x="60" y="50" width="12" height="28" rx="5" fill={shirtColor} />

      {/* Held accessory (right hand) */}
      {equippedAccessory && (
        <Accessory id={equippedAccessory} hand="right" />
      )}

      {/* Hands */}
      <circle cx="14" cy="80" r="5" fill={skin.base} />
      <circle cx="66" cy="80" r="5" fill={skin.base} />

      {/* Body / torso */}
      <rect x="18" y="50" width="44" height="36" rx="6" fill={shirtColor} />

      {/* Shirt overlays */}
      {equippedShirt === "armor_shirt" && (
        <>
          <rect x="18" y="50" width="44" height="36" rx="6" fill="none" stroke="#6B7280" strokeWidth="1.5" />
          <line x1="40" y1="50" x2="40" y2="86" stroke="#6B7280" strokeWidth="1" />
          <line x1="18" y1="65" x2="62" y2="65" stroke="#6B7280" strokeWidth="1" />
          <path d="M29,50 L29,62 L35,56Z" fill="#D1D5DB" />
          <path d="M51,50 L51,62 L45,56Z" fill="#D1D5DB" />
        </>
      )}
      {equippedShirt === "lab_coat" && (
        <>
          <path d="M40,52 L30,64 L32,86 L40,80" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="0.8" />
          <path d="M40,52 L50,64 L48,86 L40,80" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="0.8" />
        </>
      )}
      {equippedShirt === "hoodie" && (
        <>
          <line x1="37" y1="54" x2="35" y2="64" stroke="#9CA3AF" strokeWidth="1.2" />
          <line x1="43" y1="54" x2="45" y2="64" stroke="#9CA3AF" strokeWidth="1.2" />
          <circle cx="36" cy="65" r="1.5" fill="#9CA3AF" />
          <circle cx="44" cy="65" r="1.5" fill="#9CA3AF" />
        </>
      )}
      {equippedShirt === "explorer_jacket" && (
        <path d="M28,50 L34,60 L40,53 L46,60 L52,50" fill="none" stroke="#78350F" strokeWidth="1.5" />
      )}

      {/* Neck */}
      <rect x="34" y="45" width="12" height="8" fill={skin.base} />

      {/* Head */}
      <circle cx="40" cy="28" r="19" fill={skin.base} />
      {/* Head shadow */}
      <circle cx="44" cy="26" r="9" fill={skin.shadow} opacity="0.18" />

      {/* Hair (drawn before hat so hat covers it) */}
      {!equippedHat && <Hair heroId={heroId} color={hairColor} />}
      {equippedHat && <Hair heroId={heroId} color={hairColor} />}

      {/* Eyes */}
      <circle cx="33" cy="26" r="3" fill="#1F2937" />
      <circle cx="47" cy="26" r="3" fill="#1F2937" />
      <circle cx="34.2" cy="24.8" r="1" fill="white" />
      <circle cx="48.2" cy="24.8" r="1" fill="white" />

      {/* Eyebrows */}
      <path d="M29,21 Q33,19 37,21" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M43,21 Q47,19 51,21" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <circle cx="40" cy="31" r="1.2" fill={skin.shadow} />

      {/* Mouth */}
      <path d="M34,36 Q40,41 46,36" fill="none" stroke={skin.lip} strokeWidth="1.8" strokeLinecap="round" />

      {/* Glasses */}
      {hasGlasses && (
        <g>
          <circle cx="33" cy="26" r="5.5" fill="none" stroke="#374151" strokeWidth="1.4" />
          <circle cx="47" cy="26" r="5.5" fill="none" stroke="#374151" strokeWidth="1.4" />
          <line x1="38.5" y1="26" x2="41.5" y2="26" stroke="#374151" strokeWidth="1.4" />
          <line x1="22" y1="25" x2="27.5" y2="26" stroke="#374151" strokeWidth="1.4" />
          <line x1="52.5" y1="26" x2="58" y2="25" stroke="#374151" strokeWidth="1.4" />
        </g>
      )}

      {/* Hat (on top of everything) */}
      {equippedHat && <Hat hatId={equippedHat} shirtColor={shirtColor} />}
    </svg>
  );
}
