"use client";

import { useId } from "react";
import type { SkinTone } from "@/lib/types";

interface Props {
  heroId: string;
  skinTone: SkinTone;
  gender?: "boy" | "girl";
  equippedAttributes: string[];
  size?: number;
}

const SKIN: Record<SkinTone, { base: string; lip: string }> = {
  light:       { base: "#FDDBB4", lip: "#C06050" },
  light_brown: { base: "#C58540", lip: "#804030" },
  dark:        { base: "#7B4828", lip: "#3C1A0A" },
};

const HAIR: Record<SkinTone, string> = {
  light:       "#7C5228",
  light_brown: "#2D1B0E",
  dark:        "#150800",
};

const SHIRT_BASE: Record<string, string> = {
  explorer:   "#B45309",
  scientist:  "#BFDBFE",
  athlete:    "#1D4ED8",
  footballer: "#CC0000",
  wizard:     "#6D28D9",
  inventor:   "#047857",
  scholar:    "#991B1B",
};

const SHIRT_COLORS: Record<string, string> = {
  hoodie:          "#6B7280",
  lab_coat:        "#F3F4F6",
  explorer_jacket: "#92400E",
  armor_shirt:     "#9CA3AF",
  tshirt:          "#EC4899",
  striped_shirt:   "#3B82F6",
  sport_jersey:    "#059669",
  winter_jacket:   "#1E40AF",
  tuxedo:          "#111827",
  academic_robe:   "#4C1D95",
};

const PANTS_BASE: Record<string, string> = {
  explorer:   "#292524",
  scientist:  "#374151",
  athlete:    "#1E3A8A",
  footballer: "#111827",
  wizard:     "#1E1B4B",
  inventor:   "#134E4A",
  scholar:    "#3B0A0A",
};

// ── Boy hair per hero ────────────────────────────────────────────────────────
function BoyHair({ heroId, color }: { heroId: string; color: string }) {
  switch (heroId) {
    case "scientist":
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M22,24 Q30,16 40,15" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case "athlete":
    case "footballer":
      return <path d="M27,22 Q30,10 40,10 Q50,10 53,22" fill={color} />;
    case "wizard":
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M22,30 Q20,38 23,46" fill={color} />
          <path d="M58,30 Q60,38 57,46" fill={color} />
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

// ── Girl hair per hero ───────────────────────────────────────────────────────
function GirlHair({ heroId, color }: { heroId: string; color: string }) {
  switch (heroId) {
    case "scientist":
      // Neat bun
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <circle cx="40" cy="9" r="7" fill={color} />
          <line x1="36" y1="10" x2="44" y2="10" stroke={color} strokeWidth="2.5" />
        </g>
      );
    case "athlete":
    case "footballer":
      // High ponytail
      return (
        <g>
          <path d="M27,22 Q30,10 40,10 Q50,10 53,22" fill={color} />
          <rect x="37" y="7" width="6" height="3" rx="1.5" fill={color} />
          <path d="M40,7 Q44,2 46,8" fill={color} />
        </g>
      );
    case "wizard":
      // Long wavy hair
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M22,28 Q19,44 22,54 Q24,60 22,66" fill={color} />
          <path d="M58,28 Q61,44 58,54 Q56,60 58,66" fill={color} />
        </g>
      );
    case "inventor":
      // Twin buns
      return (
        <g>
          <path d="M26,22 Q28,12 40,12 Q52,12 54,22" fill={color} />
          <circle cx="27" cy="13" r="7" fill={color} />
          <circle cx="53" cy="13" r="7" fill={color} />
        </g>
      );
    case "scholar":
      // Braided side ponytail
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M22,28 Q18,36 20,44 Q22,50 20,56" fill={color} strokeWidth="1" />
          <line x1="18" y1="38" x2="22" y2="40" stroke={color} strokeWidth="1.5" />
          <line x1="18" y1="43" x2="22" y2="45" stroke={color} strokeWidth="1.5" />
          <line x1="18" y1="48" x2="22" y2="50" stroke={color} strokeWidth="1.5" />
        </g>
      );
    default: // explorer, others – long straight hair
      return (
        <g>
          <path d="M22,28 Q22,8 40,8 Q58,8 58,28" fill={color} />
          <path d="M22,28 Q20,40 22,52" fill={color} />
          <path d="M58,28 Q60,40 58,52" fill={color} />
        </g>
      );
  }
}

// ── Hats ────────────────────────────────────────────────────────────────────
function Hat({ hatId, shirtColor }: { hatId: string; shirtColor: string }) {
  switch (hatId) {
    case "headband":
      return <rect x="20" y="16" width="40" height="6" rx="3" fill="#DC2626" />;

    case "explorer_hat":
      return (
        <g>
          <ellipse cx="40" cy="14" rx="25" ry="5" fill="#92400E" />
          <rect x="28" y="5" width="24" height="11" rx="4" fill="#B45309" />
          <rect x="28" y="12" width="24" height="3" fill="#78350F" />
        </g>
      );

    case "beanie":
      return (
        <g>
          <path d="M22,22 Q22,5 40,5 Q58,5 58,22" fill={shirtColor} />
          <rect x="20" y="19" width="40" height="6" rx="3" fill="#374151" />
          <circle cx="40" cy="6" r="4" fill={shirtColor} />
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

    case "santa_hat":
      return (
        <g>
          <ellipse cx="40" cy="16" rx="20" ry="5" fill="white" />
          <polygon points="40,-4 25,16 55,16" fill="#DC2626" />
          <circle cx="40" cy="-4" r="4" fill="white" />
        </g>
      );

    case "cowboy_hat":
      return (
        <g>
          <ellipse cx="40" cy="16" rx="26" ry="5" fill="#92400E" />
          <rect x="29" y="6" width="22" height="12" rx="3" fill="#B45309" />
          <rect x="29" y="14" width="22" height="3" fill="#78350F" />
        </g>
      );

    case "wizard_hat":
      return (
        <g>
          <ellipse cx="40" cy="14" rx="20" ry="5" fill="#4C1D95" />
          <polygon points="40,-4 27,14 53,14" fill="#5B21B6" />
          <circle cx="36" cy="8" r="2" fill="#FCD34D" />
          <circle cx="45" cy="5" r="1.5" fill="#FCD34D" />
        </g>
      );

    case "top_hat":
      return (
        <g>
          <ellipse cx="40" cy="15" rx="22" ry="5" fill="#111827" />
          <rect x="30" y="-4" width="20" height="21" rx="2" fill="#1F2937" />
          <rect x="28" y="13" width="24" height="4" rx="1" fill="#111827" />
        </g>
      );

    case "crown":
      return (
        <g>
          <polygon points="22,18 22,10 29,15 40,6 51,15 58,10 58,18" fill="#F59E0B" />
          <rect x="22" y="16" width="36" height="6" rx="2" fill="#F59E0B" />
          <circle cx="40" cy="9" r="2.5" fill="#DC2626" />
          <circle cx="28" cy="14" r="2" fill="#60A5FA" />
          <circle cx="52" cy="14" r="2" fill="#60A5FA" />
        </g>
      );

    case "viking_helmet":
      return (
        <g>
          <path d="M22,22 Q22,6 40,6 Q58,6 58,22" fill="#9CA3AF" />
          <rect x="20" y="19" width="40" height="5" rx="2" fill="#6B7280" />
          {/* Horns */}
          <path d="M22,16 Q14,8 16,2 Q20,8 24,14" fill="#D1D5DB" />
          <path d="M58,16 Q66,8 64,2 Q60,8 56,14" fill="#D1D5DB" />
          <rect x="34" y="20" width="12" height="14" rx="2" fill="#9CA3AF" />
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

// ── Accessories ─────────────────────────────────────────────────────────────
function HeldItem({ id }: { id: string }) {
  // All held items drawn at right-hand area (cx≈70, cy≈72)
  switch (id) {
    case "pencil":
      return (
        <g transform="translate(62,60) rotate(-30)">
          <rect x="0" y="0" width="5" height="28" rx="2" fill="#FCD34D" />
          <polygon points="0,28 5,28 2.5,36" fill="#F87171" />
          <rect x="0" y="0" width="5" height="4" rx="1" fill="#9CA3AF" />
        </g>
      );
    case "football_ball":
      return (
        <g transform="translate(62,72)">
          <circle cx="6" cy="0" r="8" fill="white" stroke="#111827" strokeWidth="1" />
          <path d="M6,-4 Q10,-2 10,2 Q8,6 4,6 Q0,4 2,0 Q4,-4 6,-4Z" fill="#111827" />
          <path d="M0,-2 Q-2,2 0,4" fill="none" stroke="#111827" strokeWidth="0.8" />
          <path d="M12,0 Q14,4 12,6" fill="none" stroke="#111827" strokeWidth="0.8" />
        </g>
      );
    case "compass":
      return (
        <g transform="translate(62,70)">
          <circle cx="7" cy="0" r="8" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
          <line x1="7" y1="-5" x2="7" y2="5" stroke="#1F2937" strokeWidth="1.2" />
          <line x1="2" y1="0" x2="12" y2="0" stroke="#1F2937" strokeWidth="1.2" />
          <circle cx="7" cy="0" r="2" fill="#DC2626" />
        </g>
      );
    case "camera":
      return (
        <g transform="translate(60,68)">
          <rect x="0" y="0" width="16" height="12" rx="2" fill="#374151" />
          <circle cx="8" cy="6" r="4" fill="#111827" />
          <circle cx="8" cy="6" r="2.5" fill="#1D4ED8" opacity="0.7" />
          <rect x="5" y="-3" width="6" height="4" rx="1" fill="#4B5563" />
          <circle cx="13" cy="2" r="1.5" fill="#FCD34D" />
        </g>
      );
    case "sword":
      return (
        <g transform="translate(64,55) rotate(20)">
          <rect x="-1" y="0" width="3" height="32" rx="1" fill="#D1D5DB" />
          <rect x="-6" y="28" width="13" height="3" rx="1" fill="#92400E" />
          <rect x="-2" y="31" width="5" height="8" rx="2" fill="#B45309" />
          <polygon points="-1,0 2,0 0.5,-10" fill="#E5E7EB" />
        </g>
      );
    case "book":
      return (
        <g transform="translate(60,70)">
          <rect x="0" y="-8" width="15" height="12" rx="1.5" fill="#1D4ED8" />
          <line x1="7.5" y1="-8" x2="7.5" y2="4" stroke="#93C5FD" strokeWidth="0.8" />
          <rect x="0" y="-8" width="3" height="12" rx="1" fill="#1E40AF" />
        </g>
      );
    case "guitar":
      return (
        <g transform="translate(60,52)">
          <ellipse cx="8" cy="22" rx="7" ry="8" fill="#B45309" />
          <rect x="6" y="0" width="4" height="22" rx="2" fill="#92400E" />
          <rect x="3" y="-2" width="10" height="4" rx="2" fill="#78350F" />
          <line x1="5" y1="18" x2="11" y2="18" stroke="#FCD34D" strokeWidth="0.8" />
          <line x1="5" y1="21" x2="11" y2="21" stroke="#FCD34D" strokeWidth="0.8" />
          <line x1="5" y1="24" x2="11" y2="24" stroke="#FCD34D" strokeWidth="0.8" />
          <circle cx="8" cy="22" r="2" fill="#78350F" />
        </g>
      );
    case "magic_wand":
      return (
        <g transform="translate(62,66)">
          <line x1="0" y1="14" x2="12" y2="-2" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="12,-2 16,-8 8,-8" fill="#FCD34D" />
          <circle cx="12" cy="-2" r="2.5" fill="#FDE68A" />
        </g>
      );
    case "telescope":
      return (
        <g transform="translate(58,62) rotate(-15)">
          <rect x="0" y="4" width="20" height="6" rx="3" fill="#374151" />
          <rect x="16" y="2" width="8" height="10" rx="3" fill="#4B5563" />
          <rect x="-4" y="5" width="8" height="4" rx="2" fill="#6B7280" />
          <circle cx="22" cy="7" r="3" fill="#93C5FD" opacity="0.8" />
        </g>
      );
    case "trophy":
      return (
        <g transform="translate(60,64)">
          <path d="M2,0 Q0,-10 4,-12 L12,-12 Q16,-10 14,0 Q10,6 8,6 Q6,6 2,0Z" fill="#FCD34D" />
          <path d="M0,0 Q-5,-2 -4,-9" fill="none" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16,0 Q21,-2 20,-9" fill="none" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="6" y="6" width="4" height="6" fill="#F59E0B" />
          <rect x="4" y="12" width="8" height="2" rx="1" fill="#F59E0B" />
        </g>
      );
    case "medal":
      return (
        <g transform="translate(60,60)">
          <rect x="4" y="-4" width="6" height="10" rx="1" fill="#DC2626" />
          <circle cx="7" cy="10" r="8" fill="#F59E0B" />
          <circle cx="7" cy="10" r="5" fill="#FCD34D" />
          <polygon points="7,5 8.5,9 13,9 9.5,11.5 11,15.5 7,13 3,15.5 4.5,11.5 1,9 5.5,9" fill="#F59E0B" />
        </g>
      );
    case "magnifying_glass":
      return (
        <g transform="translate(56,58)">
          <circle cx="9" cy="8" r="9" fill="none" stroke="#374151" strokeWidth="2.5" />
          <circle cx="9" cy="8" r="6.5" fill="#BAE6FD" opacity="0.45" />
          <line x1="15.5" y1="14.5" x2="22" y2="22" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

// ── Effects ──────────────────────────────────────────────────────────────────
function Effect({ id, uid }: { id: string; uid: string }) {
  switch (id) {
    case "flower_wreath":
      return (
        <g>
          {[0,45,90,135,180,225,270,315].map((deg) => {
            const r = 26;
            const rad = (deg * Math.PI) / 180;
            const x = 40 + r * Math.cos(rad);
            const y = 28 + r * Math.sin(rad);
            const colors = ["#F87171","#FBBF24","#34D399","#60A5FA","#F472B6","#A78BFA","#FB923C","#4ADE80"];
            return <circle key={deg} cx={x} cy={y} r="3.5" fill={colors[deg/45]} />;
          })}
        </g>
      );
    case "rainbow_trail":
      return (
        <g opacity="0.6">
          <path d="M8,110 Q40,80 72,110" fill="none" stroke="#EF4444" strokeWidth="3" />
          <path d="M10,115 Q40,87 70,115" fill="none" stroke="#F97316" strokeWidth="2.5" />
          <path d="M12,120 Q40,94 68,120" fill="none" stroke="#EAB308" strokeWidth="2.5" />
          <path d="M14,125 Q40,101 66,125" fill="none" stroke="#22C55E" strokeWidth="2" />
          <path d="M16,129 Q40,108 64,129" fill="none" stroke="#3B82F6" strokeWidth="2" />
        </g>
      );
    case "sparkles":
      return (
        <g fill="#FCD34D">
          {[[10,20],[70,20],[5,75],[75,75],[15,110],[65,110],[40,5]].map(([x,y],i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" />
            </g>
          ))}
        </g>
      );
    case "fire_aura":
      return (
        <>
          <defs>
            <radialGradient id={`fire-${uid}`} cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#EF4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="40" cy="90" rx="42" ry="50" fill={`url(#fire-${uid})`} />
          {[28,40,52].map((x,i) => (
            <path key={i} d={`M${x},85 Q${x-4},72 ${x},60 Q${x+4},72 ${x+4},85`} fill="#F97316" opacity="0.4" />
          ))}
        </>
      );
    case "ice_aura":
      return (
        <>
          <defs>
            <radialGradient id={`ice-${uid}`} cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="40" cy="70" rx="44" ry="55" fill={`url(#ice-${uid})`} />
          {[[15,30],[65,30],[10,80],[70,80]].map(([x,y],i) => (
            <g key={i} transform={`translate(${x},${y})`} opacity="0.6">
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#BAE6FD" strokeWidth="1.5" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#BAE6FD" strokeWidth="1.5" />
              <line x1="-3" y1="-3" x2="3" y2="3" stroke="#BAE6FD" strokeWidth="1.2" />
              <line x1="3" y1="-3" x2="-3" y2="3" stroke="#BAE6FD" strokeWidth="1.2" />
            </g>
          ))}
        </>
      );
    case "star_glow":
      return (
        <>
          <defs>
            <radialGradient id={`sg-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="40" cy="70" rx="44" ry="55" fill={`url(#sg-${uid})`} />
        </>
      );
    case "cloud_halo":
      return (
        <g opacity="0.85">
          {[[-14,0],[-6,-4],[4,-5],[14,-2],[22,2]].map(([dx,dy],i) => (
            <circle key={i} cx={40+dx} cy={6+dy} r={5-Math.abs(i-2)*0.5} fill="white" />
          ))}
        </g>
      );
    case "lightning":
      return (
        <g opacity="0.75">
          <polygon points="8,50 16,50 10,72 20,72 8,100 14,100 22,72 12,72 18,50 28,50 16,20" fill="#FCD34D" />
          <polygon points="52,30 58,30 54,48 62,48 52,70 56,70 62,48 54,48 60,30 68,30 58,8" fill="#FCD34D" />
        </g>
      );
    case "shadow_clone":
      return (
        <g opacity="0.18" transform="translate(14,6)">
          <circle cx="40" cy="28" r="19" fill="#1F2937" />
          <rect x="18" y="50" width="44" height="36" rx="6" fill="#1F2937" />
          <rect x="22" y="84" width="14" height="34" rx="5" fill="#1F2937" />
          <rect x="44" y="84" width="14" height="34" rx="5" fill="#1F2937" />
        </g>
      );
    case "golden_shine":
      return (
        <>
          <defs>
            <radialGradient id={`gold-${uid}`} cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="40" cy="60" rx="46" ry="58" fill={`url(#gold-${uid})`} />
          {[[-18,20],[-20,60],[18,20],[20,60],[0,5],[0,115]].map(([x,y],i) => (
            <line key={i} x1={40+x} y1={y} x2={40+x+(x>0?4:-4)} y2={y-6} stroke="#FCD34D" strokeWidth="1.5" opacity="0.6" />
          ))}
        </>
      );
    case "magic_swirl":
      return (
        <g opacity="0.82">
          <path d="M40,120 Q10,90 12,60 Q14,30 40,20 Q66,30 68,60 Q70,90 40,120" fill="none" stroke="#8B5CF6" strokeWidth="3" />
          <path d="M40,110 Q18,85 20,60 Q22,38 40,30 Q58,38 58,60 Q58,85 40,110" fill="none" stroke="#C4B5FD" strokeWidth="1.5" />
          {[[8,35],[72,35],[8,85],[72,85]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="#A78BFA" opacity="0.8" />
          ))}
        </g>
      );
    case "energy_ring":
      return (
        <g>
          <ellipse cx="40" cy="108" rx="32" ry="9" fill="none" stroke="#F59E0B" strokeWidth="3" opacity="0.85" />
          <ellipse cx="40" cy="108" rx="32" ry="9" fill="none" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4" />
          <ellipse cx="40" cy="100" rx="24" ry="7" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.6" />
          {[[10,105],[70,105],[18,95],[62,95]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="#FCD34D" opacity="0.8" />
          ))}
        </g>
      );
    case "light_beam":
      return (
        <>
          <defs>
            <linearGradient id={`lb-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M22,0 L2,130 L78,130 L58,0Z`} fill={`url(#lb-${uid})`} />
          <ellipse cx="40" cy="4" rx="16" ry="6" fill="#FBBF24" opacity="0.45" />
        </>
      );
    case "sparkle_dust":
      return (
        <g>
          {[
            [10,15,"#F472B6",3],[68,22,"#FCD34D",2.5],[4,60,"#60A5FA",2],
            [76,55,"#34D399",2.5],[12,100,"#A78BFA",3],[66,95,"#F97316",2.5],
            [38,5,"#FCD34D",3],[40,125,"#F472B6",2],[22,42,"#60A5FA",1.8],
            [58,40,"#FCD34D",2],[30,80,"#A78BFA",2.2],[50,75,"#34D399",1.8],
          ].map(([x,y,color,r],i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={color as string} opacity="0.85" />
          ))}
        </g>
      );
    default:
      return null;
  }
}

// ── Main component ───────────────────────────────────────────────────────────
export default function HeroAvatar({ heroId, skinTone, gender = "boy", equippedAttributes, size = 120 }: Props) {
  const uid = useId().replace(/:/g, "");
  const skin = SKIN[skinTone] ?? SKIN.light;
  const hairColor = HAIR[skinTone] ?? HAIR.light;
  const baseShirt = SHIRT_BASE[heroId] ?? "#B45309";
  const pants = PANTS_BASE[heroId] ?? "#292524";

  const ALL_HATS = ["explorer_hat","cap","wizard_hat","graduation_cap","beanie","crown","santa_hat","cowboy_hat","top_hat","headband","viking_helmet"];
  const ALL_SHIRTS = ["hoodie","lab_coat","explorer_jacket","armor_shirt","tshirt","striped_shirt","sport_jersey","cape","winter_jacket","tuxedo","academic_robe"];
  const ALL_ACC = ["compass","magic_wand","book","trophy","pencil","football_ball","camera","sword","guitar","telescope","medal","magnifying_glass"];
  const ALL_EFFECTS = ["star_glow","rainbow_trail","sparkles","fire_aura","ice_aura","cloud_halo","lightning","flower_wreath","shadow_clone","golden_shine","magic_swirl","energy_ring","light_beam","sparkle_dust"];

  const equippedHat      = equippedAttributes.find((a) => ALL_HATS.includes(a));
  const equippedShirt    = equippedAttributes.find((a) => ALL_SHIRTS.includes(a));
  const equippedAccessory= equippedAttributes.find((a) => ALL_ACC.includes(a));
  const equippedEffect   = equippedAttributes.find((a) => ALL_EFFECTS.includes(a));
  const hasGlasses       = equippedAttributes.includes("glasses");
  const hasBackpack      = equippedAttributes.includes("backpack");

  const shirtColor = equippedShirt
    ? (SHIRT_COLORS[equippedShirt] ?? baseShirt)
    : baseShirt;

  const isFootballer = heroId === "footballer";

  return (
    <svg
      viewBox="0 0 80 130"
      width={size}
      height={Math.round(size * 130 / 80)}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Shadow clone effect (drawn first, behind everything) */}
      {equippedEffect === "shadow_clone" && <Effect id="shadow_clone" uid={uid} />}

      {/* Background glow effects */}
      {equippedEffect && equippedEffect !== "shadow_clone" && equippedEffect !== "flower_wreath" && equippedEffect !== "cloud_halo" && equippedEffect !== "sparkles" && equippedEffect !== "sparkle_dust" && (
        <Effect id={equippedEffect} uid={uid} />
      )}

      {/* Rainbow trail (below feet) */}
      {equippedEffect === "rainbow_trail" && <Effect id="rainbow_trail" uid={uid} />}

      {/* Backpack (behind body) */}
      {hasBackpack && (
        <g>
          <rect x="56" y="48" width="13" height="24" rx="3" fill="#92400E" />
          <rect x="57" y="50" width="4" height="20" rx="2" fill="#B45309" />
          <rect x="62" y="50" width="4" height="20" rx="2" fill="#B45309" />
          <rect x="57" y="56" width="9" height="5" rx="1.5" fill="#A16207" />
        </g>
      )}

      {/* Cape (behind body) */}
      {equippedShirt === "cape" && (
        <path d="M20,52 Q10,80 18,110 Q28,118 40,114 Q52,118 62,110 Q70,80 60,52" fill="#DC2626" opacity="0.92" />
      )}

      {/* Belt / waistband */}
      {!isFootballer && (
        <rect x="18" y="82" width="44" height="5" rx="2" fill="#111827" opacity="0.5" />
      )}

      {/* Legs – footballer has shorts */}
      {isFootballer ? (
        <>
          <rect x="22" y="84" width="14" height="20" rx="4" fill={pants} />
          <rect x="44" y="84" width="14" height="20" rx="4" fill={pants} />
          {/* Socks */}
          <rect x="22" y="102" width="14" height="12" rx="3" fill="white" />
          <rect x="44" y="102" width="14" height="12" rx="3" fill="white" />
          <rect x="22" y="102" width="14" height="3" fill="#CC0000" />
          <rect x="44" y="102" width="14" height="3" fill="#CC0000" />
        </>
      ) : (
        <>
          <rect x="22" y="84" width="14" height="34" rx="5" fill={pants} />
          <rect x="44" y="84" width="14" height="34" rx="5" fill={pants} />
        </>
      )}

      {/* Shoes */}
      <rect x="20" y="113" width="18" height="9" rx="4" fill="#1C1917" />
      <rect x="42" y="113" width="18" height="9" rx="4" fill="#1C1917" />

      {/* Footballer ball at feet */}
      {isFootballer && !equippedAccessory && (
        <g transform="translate(56,108)">
          <circle cx="6" cy="5" r="7" fill="white" stroke="#111827" strokeWidth="0.8" />
          <path d="M6,2 Q9,3 9,6 Q7,9 4,8 Q2,6 4,3 Q5,2 6,2Z" fill="#111827" />
        </g>
      )}

      {/* Arms */}
      <rect x="8"  y="50" width="12" height="28" rx="5" fill={equippedShirt === "cape" ? skin.base : shirtColor} />
      <rect x="60" y="50" width="12" height="28" rx="5" fill={equippedShirt === "cape" ? skin.base : shirtColor} />

      {/* Held accessory */}
      {equippedAccessory && <HeldItem id={equippedAccessory} />}

      {/* Hands */}
      <circle cx="14" cy="80" r="5" fill={skin.base} />
      <circle cx="66" cy="80" r="5" fill={skin.base} />

      {/* Body / torso */}
      <rect x="18" y="50" width="44" height="36" rx="6" fill={shirtColor} />

      {/* Footballer stripes */}
      {isFootballer && !equippedShirt && (
        <>
          <rect x="18" y="50" width="44" height="36" rx="6" fill="#CC0000" />
          <rect x="28" y="50" width="8" height="36" fill="white" />
          <rect x="44" y="50" width="8" height="36" fill="white" />
          <rect x="18" y="50" width="44" height="36" rx="6" fill="none" stroke="#AA0000" strokeWidth="0.5" />
        </>
      )}

      {/* Shirt details */}
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
      {equippedShirt === "striped_shirt" && (
        <>
          <rect x="18" y="58" width="44" height="5" fill="white" opacity="0.4" />
          <rect x="18" y="71" width="44" height="5" fill="white" opacity="0.4" />
        </>
      )}
      {equippedShirt === "sport_jersey" && (
        <>
          <text x="40" y="74" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" opacity="0.8">10</text>
          <path d="M28,50 L34,58 L40,52 L46,58 L52,50" fill="none" stroke="white" strokeWidth="1.2" opacity="0.6" />
        </>
      )}
      {equippedShirt === "winter_jacket" && (
        <>
          <rect x="8" y="50" width="12" height="28" rx="5" fill={shirtColor} />
          <rect x="60" y="50" width="12" height="28" rx="5" fill={shirtColor} />
          <rect x="16" y="50" width="6" height="36" fill="#1E3A8A" opacity="0.5" />
          <rect x="58" y="50" width="6" height="36" fill="#1E3A8A" opacity="0.5" />
          <rect x="38" y="50" width="4" height="36" fill="#1E3A8A" opacity="0.4" />
        </>
      )}
      {equippedShirt === "tuxedo" && (
        <>
          <path d="M40,52 L34,62 L40,72 L46,62Z" fill="white" />
          <circle cx="40" cy="74" r="2" fill="#DC2626" />
          <line x1="38" y1="76" x2="38" y2="84" stroke="#4B5563" strokeWidth="1" />
          <line x1="42" y1="76" x2="42" y2="84" stroke="#4B5563" strokeWidth="1" />
        </>
      )}
      {equippedShirt === "academic_robe" && (
        <>
          {/* Wide lapels */}
          <path d="M40,52 L28,66 L30,86 L40,78" fill="#6D28D9" stroke="#4C1D95" strokeWidth="0.8" />
          <path d="M40,52 L52,66 L50,86 L40,78" fill="#6D28D9" stroke="#4C1D95" strokeWidth="0.8" />
          {/* White collar trim */}
          <path d="M32,52 Q40,58 48,52" fill="none" stroke="white" strokeWidth="1.5" />
          {/* Robe panels on sleeves */}
          <rect x="8"  y="50" width="4" height="28" rx="1" fill="#6D28D9" />
          <rect x="68" y="50" width="4" height="28" rx="1" fill="#6D28D9" />
        </>
      )}
      {equippedShirt === "tshirt" && (
        <>
          <circle cx="40" cy="68" r="8" fill="none" stroke="white" strokeWidth="1.2" opacity="0.6" />
          <polygon points="40,62 42,67 47,67 43,70 44.5,75 40,72 35.5,75 37,70 33,67 38,67" fill="#FCD34D" opacity="0.8" />
        </>
      )}

      {/* Neck */}
      <rect x="34" y="45" width="12" height="8" fill={skin.base} />

      {/* Head */}
      <circle cx="40" cy="28" r="19" fill={skin.base} />

      {/* Ears */}
      <ellipse cx="21" cy="29" rx="3.5" ry="4.5" fill={skin.base} />
      <ellipse cx="59" cy="29" rx="3.5" ry="4.5" fill={skin.base} />
      <ellipse cx="21" cy="29" rx="1.8" ry="2.5" fill={skin.lip} opacity="0.25" />
      <ellipse cx="59" cy="29" rx="1.8" ry="2.5" fill={skin.lip} opacity="0.25" />

      {/* Hair base – covers full top semicircle so no skin shows through at sides */}
      <path d="M21,28 A19,19 0 0 0 59,28 Z" fill={hairColor} />
      {/* Hair style detail */}
      {gender === "girl"
        ? <GirlHair heroId={heroId} color={hairColor} />
        : <BoyHair  heroId={heroId} color={hairColor} />
      }

      {/* Eyes – whites */}
      <ellipse cx="33" cy="26" rx="4" ry="3.5" fill="white" />
      <ellipse cx="47" cy="26" rx="4" ry="3.5" fill="white" />
      {/* Irises */}
      <circle cx="33" cy="26.5" r="2.5" fill="#3B82F6" />
      <circle cx="47" cy="26.5" r="2.5" fill="#3B82F6" />
      {/* Pupils */}
      <circle cx="33" cy="26.5" r="1.5" fill="#1F2937" />
      <circle cx="47" cy="26.5" r="1.5" fill="#1F2937" />
      {/* Highlights */}
      <circle cx="34" cy="25.2" r="0.9" fill="white" />
      <circle cx="48" cy="25.2" r="0.9" fill="white" />

      {/* Eyebrows */}
      <path d="M29,21 Q33,19 37,21" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M43,21 Q47,19 51,21" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="40" cy="31" rx="1.8" ry="1.2" fill={skin.base} stroke={skin.lip} strokeWidth="0.6" opacity="0.6" />

      {/* Cheeks */}
      <ellipse cx="30" cy="34" rx="4" ry="2.5" fill="#F87171" opacity="0.18" />
      <ellipse cx="50" cy="34" rx="4" ry="2.5" fill="#F87171" opacity="0.18" />

      {/* Mouth */}
      <path d="M34,36 Q40,42 46,36" fill="none" stroke={skin.lip} strokeWidth="2" strokeLinecap="round" />
      {/* Smile highlight */}
      <path d="M36,36 Q40,39 44,36" fill="none" stroke={skin.lip} strokeWidth="0.6" opacity="0.4" strokeLinecap="round" />

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

      {/* Hat (on top of everything head-related) */}
      {equippedHat && <Hat hatId={equippedHat} shirtColor={shirtColor} />}

      {/* Foreground effects (over body, under UI) */}
      {equippedEffect === "flower_wreath"  && <Effect id="flower_wreath"  uid={uid} />}
      {equippedEffect === "cloud_halo"     && <Effect id="cloud_halo"     uid={uid} />}
      {equippedEffect === "sparkles"       && <Effect id="sparkles"       uid={uid} />}
      {equippedEffect === "sparkle_dust"   && <Effect id="sparkle_dust"   uid={uid} />}
    </svg>
  );
}
