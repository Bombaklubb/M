import type {
  ChestType,
  Chest,
  MysteryBoxReward,
  GamificationData,
} from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOSS_UNLOCK_THRESHOLD = 5; // exercises needed to unlock boss
export const MYSTERY_BOX_CHANCE = 0.15; // 15% chance after each exercise

export const POINT_CHEST_MILESTONES: { points: number; type: ChestType }[] = [
  { points: 100,   type: "wood" },
  { points: 200,   type: "wood" },    // NEW
  { points: 300,   type: "silver" },
  { points: 500,   type: "silver" },  // NEW
  { points: 600,   type: "wood" },
  { points: 750,   type: "silver" },  // NEW
  { points: 1000,  type: "gold" },
  { points: 1500,  type: "silver" },
  { points: 2000,  type: "silver" },  // NEW
  { points: 2500,  type: "gold" },
  { points: 3500,  type: "gold" },    // NEW
  { points: 5000,  type: "gold" },    // NEW
  { points: 7000,  type: "gold" },    // NEW
  { points: 10000, type: "gold" },    // NEW
  { points: 15000, type: "gold" },    // NEW
];

export const EXERCISE_CHEST_MILESTONES: { exercises: number; type: ChestType }[] = [
  { exercises: 5,   type: "wood" },
  { exercises: 10,  type: "wood" },   // NEW
  { exercises: 15,  type: "silver" },
  { exercises: 20,  type: "silver" }, // NEW
  { exercises: 30,  type: "gold" },
  { exercises: 40,  type: "silver" }, // NEW
  { exercises: 50,  type: "silver" },
  { exercises: 60,  type: "gold" },   // NEW
  { exercises: 75,  type: "gold" },
  { exercises: 100, type: "gold" },   // NEW
  { exercises: 150, type: "gold" },   // NEW
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
  { id: "grammar_star", label: "Grammatikstjärna", emoji: "⭐" },
  { id: "spelling_ace", label: "Stavningsmästare", emoji: "🔤" },
  { id: "reading_pro", label: "Läsproffs", emoji: "📖" },
  { id: "curious_learner", label: "Nyfiken lärare", emoji: "🔍" },
  { id: "word_wizard", label: "Ordtrollkarl", emoji: "🪄" },
  { id: "english_hero", label: "Engelskahjälte", emoji: "🦸" },
  { id: "boss_slayer", label: "Bossbesegrare", emoji: "⚔️" },
  { id: "mystery_hunter", label: "Mysteriåjägare", emoji: "🎁" },
];

// ─── Boss challenge questions ─────────────────────────────────────────────────

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
    question: "Which sentence is correct?",
    options: [
      "She don't like cats.",
      "She doesn't like cats.",
      "She not like cats.",
      "She likes not cats.",
    ],
    correctIndex: 1,
  },
  {
    id: "bq2",
    type: "multiple-choice",
    category: "spelling",
    question: "How do you spell the animal that says 'woof'?",
    options: ["Dawg", "Dog", "Doog", "Dogg"],
    correctIndex: 1,
  },
  {
    id: "bq3",
    type: "multiple-choice",
    category: "grammar",
    question: "Fill in the blank: I ___ to school every day.",
    options: ["goes", "go", "going", "gone"],
    correctIndex: 1,
  },
  {
    id: "bq4",
    type: "multiple-choice",
    category: "reading",
    question: "What does 'enormous' mean?",
    options: ["Very small", "Very fast", "Very large", "Very loud"],
    correctIndex: 2,
  },
  {
    id: "bq5",
    type: "multiple-choice",
    category: "grammar",
    question: "Which is the plural of 'child'?",
    options: ["Childs", "Childes", "Children", "Childrens"],
    correctIndex: 2,
  },
  {
    id: "bq6",
    type: "multiple-choice",
    category: "spelling",
    question: "Which word is spelled correctly?",
    options: ["Frend", "Friend", "Freind", "Freiend"],
    correctIndex: 1,
  },
  {
    id: "bq7",
    type: "multiple-choice",
    category: "grammar",
    question: "Choose the correct question: ___ your name?",
    options: ["What is", "What are", "What be", "What were"],
    correctIndex: 0,
  },
  {
    id: "bq8",
    type: "multiple-choice",
    category: "reading",
    question: "If someone is 'exhausted', how do they feel?",
    options: ["Very happy", "Very angry", "Very tired", "Very hungry"],
    correctIndex: 2,
  },
  {
    id: "bq9",
    type: "multiple-choice",
    category: "spelling",
    question: "Which word is spelled correctly?",
    options: ["Becaus", "Because", "Becouse", "Becase"],
    correctIndex: 1,
  },
  {
    id: "bq10",
    type: "multiple-choice",
    category: "grammar",
    question: "Which sentence uses the past tense correctly?",
    options: [
      "Yesterday I eat pizza.",
      "Yesterday I eated pizza.",
      "Yesterday I ate pizza.",
      "Yesterday I eating pizza.",
    ],
    correctIndex: 2,
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

/** Returns chest types earned at new totalPoints compared to previous. */
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

/** Returns chest types earned at new exerciseCount compared to previous. */
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

/** 15% chance to get a mystery box reward. Returns null if no box. */
export function rollMysteryBox(badges: string[]): MysteryBoxReward | null {
  if (Math.random() > MYSTERY_BOX_CHANCE) return null;

  const roll = Math.random();
  if (roll < 0.5) {
    // Points: 10-50
    const pts = Math.floor(Math.random() * 41) + 10;
    return {
      type: "points",
      points: pts,
      description: `+${pts} bonuspoäng!`,
    };
  } else if (roll < 0.75) {
    // Wood chest
    return {
      type: "chest",
      chestType: "wood",
      description: "En trälåda!",
    };
  } else {
    // Badge (pick one the student doesn't have yet)
    const available = ALL_BADGES.filter(
      (b) => b.id !== "boss_slayer" && !badges.includes(b.id)
    );
    if (available.length === 0) {
      // Fallback to points
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

/** Compute chest rewards when opening a wood chest. */
export function openWoodChest(): {
  points: number;
  description: string;
  bonusChest?: Chest;
} {
  const pts = Math.floor(Math.random() * 51) + 50; // 50-100
  return { points: pts, description: `+${pts} poäng` };
}

/** Compute chest rewards when opening a silver chest. */
export function openSilverChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 100; // 100-200
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

  return {
    points: pts,
    badge: badge?.id,
    bonusChest,
    description: desc,
  };
}

/** Compute chest rewards when opening a gold chest. */
export function openGoldChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 301) + 200; // 200-500
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

  return {
    points: pts,
    badge: badge?.id,
    bonusChest,
    description: desc,
  };
}

/** Default gamification data. */
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

/** Badge info by id. */
export function getBadge(id: string) {
  return ALL_BADGES.find((b) => b.id === id);
}
