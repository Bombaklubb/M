import type {
  ChestType,
  Chest,
  MysteryBoxReward,
  GamificationData,
} from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOSS_UNLOCK_THRESHOLD = 5;
export const MYSTERY_BOX_CHANCE = 0.15;

export const POINT_CHEST_MILESTONES: { points: number; type: ChestType }[] = [
  { points: 100,   type: "wood" },
  { points: 200,   type: "wood" },
  { points: 300,   type: "silver" },
  { points: 500,   type: "silver" },
  { points: 600,   type: "wood" },
  { points: 750,   type: "silver" },
  { points: 1000,  type: "gold" },
  { points: 1500,  type: "silver" },
  { points: 2000,  type: "silver" },
  { points: 2500,  type: "gold" },
  { points: 3500,  type: "gold" },
  { points: 5000,  type: "gold" },
  { points: 7000,  type: "gold" },
  { points: 10000, type: "gold" },
  { points: 15000, type: "gold" },
];

export const EXERCISE_CHEST_MILESTONES: { exercises: number; type: ChestType }[] = [
  { exercises: 5,   type: "wood" },
  { exercises: 10,  type: "wood" },
  { exercises: 15,  type: "silver" },
  { exercises: 20,  type: "silver" },
  { exercises: 30,  type: "gold" },
  { exercises: 40,  type: "silver" },
  { exercises: 50,  type: "silver" },
  { exercises: 60,  type: "gold" },
  { exercises: 75,  type: "gold" },
  { exercises: 100, type: "gold" },
  { exercises: 150, type: "gold" },
];

// ─── Chest reward tables ──────────────────────────────────────────────────────

export const CHEST_META: Record<
  ChestType,
  { label: string; emoji: string; color: string; borderColor: string; shadowColor: string; description: string }
> = {
  wood: {
    label: "Trälåda",
    emoji: "📦",
    color: "from-amber-600 to-amber-800",
    borderColor: "border-amber-700",
    shadowColor: "shadow-amber-900/40",
    description: "En enkel trälåda med små belöningar.",
  },
  silver: {
    label: "Silverlåda",
    emoji: "🪙",
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-500",
    shadowColor: "shadow-slate-700/40",
    description: "En glänsande silverlåda med bra belöningar.",
  },
  gold: {
    label: "Guldlåda",
    emoji: "🏆",
    color: "from-yellow-400 to-amber-500",
    borderColor: "border-yellow-500",
    shadowColor: "shadow-yellow-600/40",
    description: "En praktfull guldlåda med de bästa belöningarna!",
  },
};

export const ALL_BADGES = [
  { id: "grammar_star",    label: "Grammatikstjärna",  emoji: "⭐" },
  { id: "spelling_ace",   label: "Stavningsmästare",   emoji: "🔤" },
  { id: "reading_pro",    label: "Läsproffs",          emoji: "📖" },
  { id: "curious_learner",label: "Nyfiken lärare",     emoji: "🔍" },
  { id: "word_wizard",    label: "Ordtrollkarl",       emoji: "🪄" },
  { id: "svenska_hero",   label: "Svenskahjälte",      emoji: "🦸" },
  { id: "boss_slayer",    label: "Bossbesegrare",      emoji: "⚔️" },
  { id: "mystery_hunter", label: "Mysteriejägare",     emoji: "🎁" },
];

// ─── Boss challenge questions (Swedish language) ─────────────────────────────

export interface BossQuestion {
  id: string;
  type: "multiple-choice";
  category: "grammar" | "spelling" | "reading";
  question: string;
  options: string[];
  correctIndex: number;
}

export const BOSS_QUESTIONS: BossQuestion[] = [
  {
    id: "bq1",
    type: "multiple-choice",
    category: "grammar",
    question: "Vilket alternativ är grammatiskt korrekt?",
    options: [
      "Jag och han gick till affären.",
      "Han och jag gick till affären.",
      "Mig och han gick till affären.",
      "Han och mig gick till affären.",
    ],
    correctIndex: 1,
  },
  {
    id: "bq2",
    type: "multiple-choice",
    category: "spelling",
    question: "Hur stavades djuret som säger 'mjau'?",
    options: ["Katt", "Katt", "Kat", "Kkat"],
    correctIndex: 0,
  },
  {
    id: "bq3",
    type: "multiple-choice",
    category: "grammar",
    question: "Fyll i rätt ord: 'Igår ___ vi på bio.'",
    options: ["är", "var", "hade", "blir"],
    correctIndex: 1,
  },
  {
    id: "bq4",
    type: "multiple-choice",
    category: "reading",
    question: "Vad betyder ordet 'häpnadsväckande'?",
    options: ["Tråkig", "Förvånande och imponerande", "Liten", "Snabb"],
    correctIndex: 1,
  },
  {
    id: "bq5",
    type: "multiple-choice",
    category: "grammar",
    question: "Vilket är plural av 'ett barn'?",
    options: ["Barns", "Barnen", "Barn", "Barnerna"],
    correctIndex: 2,
  },
  {
    id: "bq6",
    type: "multiple-choice",
    category: "spelling",
    question: "Vilket ord stavas rätt?",
    options: ["Vänner", "Vännar", "Vänner", "Venner"],
    correctIndex: 0,
  },
  {
    id: "bq7",
    type: "multiple-choice",
    category: "grammar",
    question: "Välj rätt ordform: 'Det ___ regna imorgon.'",
    options: ["kan", "kanske", "möjlig", "trolig"],
    correctIndex: 0,
  },
  {
    id: "bq8",
    type: "multiple-choice",
    category: "reading",
    question: "Om någon är 'förtjust', hur mår de?",
    options: ["Mycket glada och nöjda", "Mycket arga", "Mycket trötta", "Mycket ledsna"],
    correctIndex: 0,
  },
  {
    id: "bq9",
    type: "multiple-choice",
    category: "spelling",
    question: "Vilket ord stavas rätt?",
    options: ["Eftersom", "Efersom", "Eferson", "Eftersom"],
    correctIndex: 0,
  },
  {
    id: "bq10",
    type: "multiple-choice",
    category: "grammar",
    question: "Vilken mening är i preteritum (dåtid)?",
    options: [
      "Igår äter jag pizza.",
      "Igår åt jag pizza.",
      "Igår ätande jag pizza.",
      "Igår ska jag äta pizza.",
    ],
    correctIndex: 1,
  },
];

// ─── Pure helper functions ────────────────────────────────────────────────────

function makeChest(type: ChestType): Chest {
  return {
    id: `chest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    earnedAt: new Date().toISOString(),
    opened: false,
  };
}

export function chestsEarnedFromPoints(
  prevPoints: number,
  newPoints: number,
  alreadyRewarded: number[]
): { chest: Chest; milestone: number }[] {
  const earned: { chest: Chest; milestone: number }[] = [];
  for (const m of POINT_CHEST_MILESTONES) {
    if (
      prevPoints < m.points &&
      newPoints >= m.points &&
      !alreadyRewarded.includes(m.points)
    ) {
      earned.push({ chest: makeChest(m.type), milestone: m.points });
    }
  }
  return earned;
}

export function chestsEarnedFromExercises(
  prevCount: number,
  newCount: number,
  alreadyRewarded: number[]
): { chest: Chest; milestone: number }[] {
  const earned: { chest: Chest; milestone: number }[] = [];
  for (const m of EXERCISE_CHEST_MILESTONES) {
    if (
      prevCount < m.exercises &&
      newCount >= m.exercises &&
      !alreadyRewarded.includes(m.exercises)
    ) {
      earned.push({ chest: makeChest(m.type), milestone: m.exercises });
    }
  }
  return earned;
}

export function rollMysteryBox(badges: string[]): MysteryBoxReward | null {
  if (Math.random() > MYSTERY_BOX_CHANCE) return null;

  const roll = Math.random();
  if (roll < 0.5) {
    const pts = Math.floor(Math.random() * 41) + 10;
    return {
      type: "points",
      points: pts,
      description: `+${pts} bonuspoäng!`,
    };
  } else if (roll < 0.75) {
    return {
      type: "chest",
      chestType: "wood",
      description: "En trälåda!",
    };
  } else {
    const available = ALL_BADGES.filter(
      (b) => b.id !== "boss_slayer" && !badges.includes(b.id)
    );
    if (available.length === 0) {
      const pts = Math.floor(Math.random() * 41) + 10;
      return {
        type: "points",
        points: pts,
        description: `+${pts} bonuspoäng!`,
      };
    }
    const badge = available[Math.floor(Math.random() * available.length)];
    return {
      type: "badge",
      badgeId: badge.id,
      description: `Märke: ${badge.label} ${badge.emoji}`,
    };
  }
}

export function openWoodChest(): {
  points: number;
  description: string;
  bonusChest?: Chest;
} {
  const pts = Math.floor(Math.random() * 51) + 50;
  return { points: pts, description: `+${pts} poäng` };
}

export function openSilverChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 100;
  const available = ALL_BADGES.filter(
    (b) => b.id !== "boss_slayer" && !badges.includes(b.id)
  );
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.5 ? makeChest("wood") : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? "Bonus: Trälåda!" : null,
  ]
    .filter(Boolean)
    .join(" • ");
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

export function openGoldChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 301) + 200;
  const available = ALL_BADGES.filter((b) => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.3 ? makeChest("silver") : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? "Bonus: Silverlåda!" : null,
  ]
    .filter(Boolean)
    .join(" • ");
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

export function defaultGamificationData(): GamificationData {
  return {
    chests: [],
    badges: [],
    exercisesCompleted: 0,
    bossUnlocked: false,
    bossWins: 0,
    pointsMilestonesRewarded: [],
    exerciseMilestonesRewarded: [],
  };
}

export function getBadge(id: string) {
  return ALL_BADGES.find((b) => b.id === id);
}
