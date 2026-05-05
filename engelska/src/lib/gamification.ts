import type {
  ChestType,
  Chest,
  MysteryBoxReward,
  GamificationData,
  StudentData,
} from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOSS_UNLOCK_THRESHOLD = 5; // exercises needed to unlock boss
export const MYSTERY_BOX_CHANCE = 0.15; // 15% chance after each exercise
export const MAX_CHESTS_PER_TYPE = 30;  // cap per chest type

export const POINT_CHEST_MILESTONES: { points: number; type: ChestType }[] = [
  // Bronskista: 10–200
  { points: 10,    type: "wood" },
  { points: 50,    type: "wood" },
  { points: 100,   type: "wood" },
  { points: 200,   type: "wood" },
  // Silverkista: 300–4 000
  { points: 300,   type: "silver" },
  { points: 500,   type: "silver" },
  { points: 750,   type: "silver" },
  { points: 1000,  type: "silver" },
  { points: 1500,  type: "silver" },
  { points: 2000,  type: "silver" },
  { points: 3000,  type: "silver" },
  { points: 4000,  type: "silver" },
  // Guldkista: 1 200–7 000
  { points: 1200,  type: "gold" },
  { points: 2500,  type: "gold" },
  { points: 3500,  type: "gold" },
  { points: 5000,  type: "gold" },
  { points: 7000,  type: "gold" },
  // Smaragdkista: 8 000–12 000
  { points: 8000,  type: "emerald" },
  { points: 10000, type: "emerald" },
  { points: 12000, type: "emerald" },
  // Rubinkista: 15 000–20 000
  { points: 15000, type: "ruby" },
  { points: 18000, type: "ruby" },
  { points: 20000, type: "ruby" },
  // Diamantkista: 25 000–40 000
  { points: 25000, type: "diamond" },
  { points: 30000, type: "diamond" },
  { points: 35000, type: "diamond" },
  { points: 40000, type: "diamond" },
  // Hemliga kistan: 60 000–100 000
  { points: 60000,  type: "hemlig" },
  { points: 80000,  type: "hemlig" },
  { points: 100000, type: "hemlig" },
];

export const EXERCISE_CHEST_MILESTONES: { exercises: number; type: ChestType }[] = [
  // Bronskista: 1–55
  { exercises: 1,   type: "wood" },
  { exercises: 5,   type: "wood" },
  { exercises: 10,  type: "wood" },
  { exercises: 20,  type: "wood" },
  { exercises: 35,  type: "wood" },
  { exercises: 55,  type: "wood" },
  // Silverkista: 12–90
  { exercises: 12,  type: "silver" },
  { exercises: 25,  type: "silver" },
  { exercises: 40,  type: "silver" },
  { exercises: 60,  type: "silver" },
  { exercises: 75,  type: "silver" },
  { exercises: 90,  type: "silver" },
  // Guldkista: 30–125
  { exercises: 30,  type: "gold" },
  { exercises: 50,  type: "gold" },
  { exercises: 80,  type: "gold" },
  { exercises: 100, type: "gold" },
  { exercises: 125, type: "gold" },
  // Smaragdkista: 150–200
  { exercises: 150, type: "emerald" },
  { exercises: 175, type: "emerald" },
  { exercises: 200, type: "emerald" },
  // Rubinkista: 250–300
  { exercises: 250, type: "ruby" },
  { exercises: 275, type: "ruby" },
  { exercises: 300, type: "ruby" },
  // Diamantkista: 400–500
  { exercises: 400, type: "diamond" },
  { exercises: 450, type: "diamond" },
  { exercises: 500, type: "diamond" },
  // Hemliga kistan: 750–1 000
  { exercises: 750,  type: "hemlig" },
  { exercises: 875,  type: "hemlig" },
  { exercises: 1000, type: "hemlig" },
];

// ─── Chest reward tables ──────────────────────────────────────────────────────

export const CHEST_META: Record<
  ChestType,
  { label: string; emoji: string; image: string; openImage: string; color: string; borderColor: string; shadowColor: string; description: string }
> = {
  wood: {
    label: "Bronskista",
    emoji: "📦",
    image: "/content/bronskista.png",
    openImage: "/content/bronskista-oppen.png",
    color: "from-amber-600 to-amber-800",
    borderColor: "border-amber-700",
    shadowColor: "shadow-amber-900/40",
    description: "En bronskista med belöningar.",
  },
  silver: {
    label: "Silverkista",
    emoji: "🪙",
    image: "/content/silverkista.png",
    openImage: "/content/silverkista-oppen.png",
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-500",
    shadowColor: "shadow-slate-700/40",
    description: "En glänsande silverkista med bra belöningar.",
  },
  gold: {
    label: "Guldkista",
    emoji: "🏆",
    image: "/content/guldkista.png",
    openImage: "/content/guldkista-oppen.png",
    color: "from-yellow-400 to-amber-500",
    borderColor: "border-yellow-500",
    shadowColor: "shadow-yellow-600/40",
    description: "En praktfull guldkista med de bästa belöningarna!",
  },
  ruby: {
    label: "Rubinkista",
    emoji: "💎",
    image: "/content/rubinkista.png",
    openImage: "/content/rubinkista-oppen.png",
    color: "from-red-500 to-red-700",
    borderColor: "border-red-600",
    shadowColor: "shadow-red-900/40",
    description: "En sällsynt rubinkista med stora belöningar!",
  },
  diamond: {
    label: "Diamantkista",
    emoji: "💠",
    image: "/content/diamantkista.png",
    openImage: "/content/diamantkista-oppen.png",
    color: "from-sky-300 to-blue-500",
    borderColor: "border-sky-400",
    shadowColor: "shadow-blue-700/40",
    description: "En makalös diamantkista med enorma belöningar!",
  },
  emerald: {
    label: "Smaragdkista",
    emoji: "🟢",
    image: "/content/smaragdkista.png",
    openImage: "/content/smaragdkista-oppen.png",
    color: "from-emerald-500 to-green-700",
    borderColor: "border-emerald-600",
    shadowColor: "shadow-green-900/40",
    description: "Den legendariska smaragdkistan med de allra bästa belöningarna!",
  },
  hemlig: {
    label: "Hemliga kistan",
    emoji: "🔒",
    image: "/hemliga-kistan-blurrad.png",
    openImage: "/hemliga-kistan.png",
    color: "from-purple-900 to-gray-900",
    borderColor: "border-purple-700",
    shadowColor: "shadow-purple-900/50",
    description: "Den ytterst hemliga kistan. Mycket få lyckas öppna den!",
  },
};

export const ALL_BADGES = [
  { id: "first_steps",    label: "Första steget",    emoji: "🌟" },
  { id: "grammar_star",   label: "Grammatikstjärna", emoji: "⭐" },
  { id: "spelling_ace",   label: "Stavningsmästare", emoji: "🔤" },
  { id: "reading_pro",    label: "Läsproffs",        emoji: "📖" },
  { id: "curious_learner",label: "Nyfiken elev",     emoji: "🔍" },
  { id: "word_wizard",    label: "Ordtrollkarl",     emoji: "🪄" },
  { id: "dedicated",      label: "Flitig elev",      emoji: "💪" },
  { id: "english_hero",   label: "Engelskahjälte",   emoji: "🦸" },
  { id: "all_rounder",    label: "Allroundern",      emoji: "🎯" },
  { id: "boss_slayer",    label: "Bossbesegrare",    emoji: "⚔️" },
  { id: "mystery_hunter", label: "Mysteriåjägare",   emoji: "🎁" },
];

// How each badge is earned (shown in kistor page for locked badges)
export const BADGE_HOW_TO_EARN: Record<string, string> = {
  first_steps:     "Slutför din första modul",
  grammar_star:    "Slutför 5 grammatikmoduler",
  spelling_ace:    "Slutför 3 stavningsmoduler eller besegra Stavningstrollet 🧌",
  reading_pro:     "Slutför 3 läsförståelsemoduler",
  curious_learner: "Slutför moduler i 3 olika stadier",
  word_wizard:     "Slutför 3 ordsökningar eller besegra Ordmästaren 🧙",
  dedicated:       "Slutför 10 moduler totalt",
  english_hero:    "Slutför 20 moduler totalt",
  all_rounder:     "Slutför minst 1 modul i alla 4 stadier",
  boss_slayer:     "Besegra Grammatikdraken 🐉",
  mystery_hunter:  "Hitta en mysterylåda efter en övning",
};

// ─── Boss challenge questions ─────────────────────────────────────────────────

export type BossQuestion =
  | {
      id: string;
      type: "multiple-choice";
      category: "grammar" | "spelling" | "reading";
      question: string;
      options: string[];
      correctIndex: number;
    }
  | {
      id: string;
      type: "fill-in-blank";
      category: "grammar" | "spelling" | "reading";
      sentence: string;
      answer: string;
      alternativeAnswers?: string[];
      hint?: string;
    }
  | {
      id: string;
      type: "build-sentence";
      category: "grammar" | "spelling" | "reading";
      instruction: string;
      words: string[];
      correctOrder: number[];
    };

// Dragon boss – multiple choice grammar
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

// Troll boss – fill-in-blank spelling
export const TROLL_QUESTIONS: BossQuestion[] = [
  {
    id: "tq1",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "She was very ___ when she got the present.",
    answer: "excited",
    hint: "Starts with 'e'",
  },
  {
    id: "tq2",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "He couldn't ___ that he had won the race!",
    answer: "believe",
    hint: "'i before e except after c'",
  },
  {
    id: "tq3",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "They speak three ___ at home.",
    answer: "languages",
    hint: "Starts with 'l'",
  },
  {
    id: "tq4",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "The loud ___ woke everyone up during the storm.",
    answer: "thunder",
    hint: "The rumbling sound in a storm",
  },
  {
    id: "tq5",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "She had a ___ dream about flying over the mountains.",
    answer: "beautiful",
    hint: "Means very pretty",
  },
  {
    id: "tq6",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "He read an ___ book about space and planets.",
    answer: "interesting",
    hint: "Means engaging or fascinating",
  },
  {
    id: "tq7",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "They ___ to visit their grandparents every summer.",
    answer: "travelled",
    alternativeAnswers: ["traveled"],
    hint: "Past tense of 'travel'",
  },
  {
    id: "tq8",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "The colourful ___ appeared after the rain.",
    answer: "rainbow",
    hint: "Arcs across the sky after rain",
  },
  {
    id: "tq9",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "She is always ___ to new students at school.",
    answer: "friendly",
    hint: "Kind and warm to others",
  },
  {
    id: "tq10",
    type: "fill-in-blank",
    category: "spelling",
    sentence: "The magician made the rabbit ___ from the hat.",
    answer: "disappear",
    hint: "The opposite of appear",
  },
];

// Wizard boss – build-sentence word order
export const WIZARD_QUESTIONS: BossQuestion[] = [
  {
    id: "wq1",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["likes", "She", "very", "much", "reading"],
    correctOrder: [1, 0, 4, 2, 3],
    // She likes reading very much
  },
  {
    id: "wq2",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["are", "They", "football", "in", "playing", "the", "park"],
    correctOrder: [1, 0, 4, 2, 3, 5, 6],
    // They are playing football in the park
  },
  {
    id: "wq3",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["dog", "My", "on", "always", "sleeps", "the", "sofa"],
    correctOrder: [1, 0, 3, 4, 2, 5, 6],
    // My dog always sleeps on the sofa
  },
  {
    id: "wq4",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["has", "She", "to", "never", "been", "London"],
    correctOrder: [1, 0, 3, 4, 2, 5],
    // She has never been to London
  },
  {
    id: "wq5",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["you", "Can", "my", "help", "me", "with", "homework"],
    correctOrder: [1, 0, 3, 4, 5, 2, 6],
    // Can you help me with my homework
  },
  {
    id: "wq6",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["went", "We", "cinema", "to", "last", "the", "night"],
    correctOrder: [1, 0, 3, 5, 2, 4, 6],
    // We went to the cinema last night
  },
  {
    id: "wq7",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["is", "She", "student", "the", "best", "in", "class"],
    correctOrder: [1, 0, 3, 4, 2, 5, 6],
    // She is the best student in class
  },
  {
    id: "wq8",
    type: "build-sentence",
    category: "grammar",
    instruction: "Bygg meningen:",
    words: ["cats", "loves", "He", "black", "his", "and", "dog"],
    correctOrder: [2, 1, 3, 0, 5, 4, 6],
    // He loves black cats and his dog
  },
];

// ─── Boss configurations ──────────────────────────────────────────────────────

export type BossId = "dragon" | "troll" | "wizard";

export interface BossConfig {
  id: BossId;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  gradient: string;
  cardBg: string;
  borderColor: string;
  accentColor: string;
  questions: BossQuestion[];
  passThreshold: number;
  rewardChestType: ChestType;
  rewardPoints: number;
  rewardBadgeId: string;
}

export const BOSS_CONFIGS: Record<BossId, BossConfig> = {
  dragon: {
    id: "dragon",
    name: "Grammatikdraken",
    emoji: "🐉",
    subtitle: "Grammatikens väktare",
    description: "Draken vaktar grammatikens hemligheter. Svara rätt på 6 av 10 frågor!",
    gradient: "linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)",
    cardBg: "#fff5f5",
    borderColor: "#fca5a5",
    accentColor: "#dc2626",
    questions: BOSS_QUESTIONS,
    passThreshold: 0.6,
    rewardChestType: "gold",
    rewardPoints: 150,
    rewardBadgeId: "boss_slayer",
  },
  troll: {
    id: "troll",
    name: "Stavningstrollet",
    emoji: "🧌",
    subtitle: "Stavningens mästare",
    description: "Trollet utmanar din stavning. Skriv de saknade orden rätt – 6 av 10!",
    gradient: "linear-gradient(135deg, #14532d, #166534, #16a34a)",
    cardBg: "#f0fdf4",
    borderColor: "#86efac",
    accentColor: "#16a34a",
    questions: TROLL_QUESTIONS,
    passThreshold: 0.6,
    rewardChestType: "silver",
    rewardPoints: 100,
    rewardBadgeId: "spelling_ace",
  },
  wizard: {
    id: "wizard",
    name: "Ordmästaren",
    emoji: "🧙",
    subtitle: "Meningsbyggarens guru",
    description: "Mästaren blandar ihop ord. Sätt dem i rätt ordning – klara 5 av 8!",
    gradient: "linear-gradient(135deg, #3b0764, #6d28d9, #7c3aed)",
    cardBg: "#faf5ff",
    borderColor: "#c4b5fd",
    accentColor: "#7c3aed",
    questions: WIZARD_QUESTIONS,
    passThreshold: 0.6,
    rewardChestType: "ruby",
    rewardPoints: 200,
    rewardBadgeId: "word_wizard",
  },
};

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
  alreadyRewarded: number[],
  currentChests: Chest[] = []
): { chest: Chest; milestone: number }[] {
  const earned: { chest: Chest; milestone: number }[] = [];
  const countByType = (t: ChestType) =>
    currentChests.filter((c) => c.type === t).length +
    earned.filter((e) => e.chest.type === t).length;

  for (const m of POINT_CHEST_MILESTONES) {
    if (
      prevPoints < m.points &&
      newPoints >= m.points &&
      !alreadyRewarded.includes(m.points) &&
      countByType(m.type) < MAX_CHESTS_PER_TYPE
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
  alreadyRewarded: number[],
  currentChests: Chest[] = []
): { chest: Chest; milestone: number }[] {
  const earned: { chest: Chest; milestone: number }[] = [];
  const countByType = (t: ChestType) =>
    currentChests.filter((c) => c.type === t).length +
    earned.filter((e) => e.chest.type === t).length;

  for (const m of EXERCISE_CHEST_MILESTONES) {
    if (
      prevCount < m.exercises &&
      newCount >= m.exercises &&
      !alreadyRewarded.includes(m.exercises) &&
      countByType(m.type) < MAX_CHESTS_PER_TYPE
    ) {
      earned.push({ chest: makeChest(m.type), milestone: m.exercises });
    }
  }
  return earned;
}

/** Returns mystery box chance based on how many exercises completed (higher early on). */
function getMysteryBoxChance(exercisesCompleted: number): number {
  if (exercisesCompleted < 3)  return 0.50; // 50% för de tre första
  if (exercisesCompleted < 8)  return 0.35; // 35% för övning 3–7
  if (exercisesCompleted < 15) return 0.22; // 22% för övning 8–14
  return MYSTERY_BOX_CHANCE;                // 15% normalt
}

/** Rolls for a mystery box reward. Pass exercisesCompleted for higher early-game chance. */
export function rollMysteryBox(badges: string[], exercisesCompleted = 99, currentChests: Chest[] = []): MysteryBoxReward | null {
  if (Math.random() > getMysteryBoxChance(exercisesCompleted)) return null;

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
    // Bronze chest – only if under cap
    const woodCount = currentChests.filter((c) => c.type === "wood").length;
    if (woodCount >= MAX_CHESTS_PER_TYPE) {
      const pts = Math.floor(Math.random() * 41) + 10;
      return { type: "points", points: pts, description: `+${pts} bonuspoäng!` };
    }
    return {
      type: "chest",
      chestType: "wood",
      description: "En bronskista!",
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
  const pts = Math.floor(Math.random() * 101) + 20; // 20-120
  return { points: pts, description: `+${pts} poäng` };
}

/** Compute chest rewards when opening a silver chest. */
export function openSilverChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20; // 20-120
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
    bonusChest ? "Bonus: Bronskista!" : null,
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
  const pts = Math.floor(Math.random() * 101) + 20; // 20-120
  const available = ALL_BADGES.filter((b) => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;

  const bonusChest = Math.random() < 0.3 ? makeChest("silver") : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? "Bonus: Silverkista!" : null,
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

/** Compute chest rewards when opening a ruby chest. */
export function openRubyChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20; // 20-120
  const available = ALL_BADGES.filter((b) => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.4 ? makeChest("silver") : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? "Bonus: Silverkista!" : null,
  ].filter(Boolean).join(" • ");
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Compute chest rewards when opening a diamond chest. */
export function openDiamondChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20; // 20-120
  const available = ALL_BADGES.filter((b) => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.4 ? makeChest("gold") : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? "Bonus: Guldkista!" : null,
  ].filter(Boolean).join(" • ");
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Compute chest rewards when opening an emerald chest. */
export function openEmeraldChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20; // 20-120
  const available = ALL_BADGES.filter((b) => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.5 ? makeChest("ruby") : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? "Bonus: Rubinkista!" : null,
  ].filter(Boolean).join(" • ");
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Compute chest rewards when opening the secret chest. */
export function openHemligChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20; // 20-120
  const available = ALL_BADGES.filter((b) => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.6 ? makeChest("emerald") : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? "Bonus: Smaragdkista!" : null,
  ].filter(Boolean).join(" • ");
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Default gamification data. */
export function defaultGamificationData(): GamificationData {
  return {
    chests: [],
    badges: [],
    exercisesCompleted: 0,
    bossUnlocked: false,
    bossWins: 0,
    bossesBeaten: [],
    bossWinCounts: {},
    pointsMilestonesRewarded: [],
    exerciseMilestonesRewarded: [],
  };
}

/** Badge info by id. */
export function getBadge(id: string) {
  return ALL_BADGES.find((b) => b.id === id);
}

// ─── Achievement badge checker ────────────────────────────────────────────────

/**
 * Returns badge IDs that should be newly awarded based on the student's current
 * progress. Call this after every module completion and merge the result into
 * the gamification data before saving.
 */
export function checkAchievementBadges(
  student: StudentData,
  gam: GamificationData
): string[] {
  const newBadges: string[] = [];
  const has = (id: string) => gam.badges.includes(id) || newBadges.includes(id);

  const stages = Object.values(student.stages);

  const grammarDone   = stages.reduce((n, s) => n + Object.values(s.grammarModules    ?? {}).filter((m) => m.completed).length, 0);
  const readingDone   = stages.reduce((n, s) => n + Object.values(s.readingModules    ?? {}).filter((m) => m.completed).length, 0);
  const spellingDone  = stages.reduce((n, s) => n + Object.values(s.spellingModules   ?? {}).filter((m) => m.completed).length, 0);
  const wsearchDone   = stages.reduce((n, s) => n + Object.values(s.wordsearchModules ?? {}).filter((m) => m.completed).length, 0);
  const totalDone     = grammarDone + readingDone + spellingDone + wsearchDone;

  const stagesActive  = stages.filter((s) =>
    Object.values(s.grammarModules    ?? {}).some((m) => m.completed) ||
    Object.values(s.readingModules    ?? {}).some((m) => m.completed) ||
    Object.values(s.spellingModules   ?? {}).some((m) => m.completed) ||
    Object.values(s.wordsearchModules ?? {}).some((m) => m.completed)
  ).length;

  if (!has("first_steps")     && totalDone    >= 1)  newBadges.push("first_steps");
  if (!has("grammar_star")    && grammarDone   >= 5)  newBadges.push("grammar_star");
  if (!has("reading_pro")     && readingDone   >= 3)  newBadges.push("reading_pro");
  if (!has("spelling_ace")    && spellingDone  >= 3)  newBadges.push("spelling_ace");
  if (!has("curious_learner") && stagesActive  >= 3)  newBadges.push("curious_learner");
  if (!has("word_wizard")     && wsearchDone   >= 3)  newBadges.push("word_wizard");
  if (!has("dedicated")       && totalDone     >= 10) newBadges.push("dedicated");
  if (!has("english_hero")    && totalDone     >= 20) newBadges.push("english_hero");
  if (!has("all_rounder")     && stagesActive  >= 4)  newBadges.push("all_rounder");

  return newBadges;
}
