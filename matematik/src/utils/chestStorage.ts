import type { ChestType, MattChest, MattGamificationData, MysteryBoxReward } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOSS_UNLOCK_THRESHOLD = 5; // övningar för att låsa upp boss
export const MYSTERY_BOX_CHANCE_EARLY = 0.25; // 25% chans under de 5 första topics
export const MYSTERY_BOX_CHANCE = 0.15;       // 15% chans därefter
export const MAX_CHESTS_PER_TYPE = 30;        // max antal kistor per valör

export const POINT_CHEST_MILESTONES: { points: number; type: ChestType }[] = [
  { points: 10,     type: 'wood' },
  { points: 50,     type: 'wood' },
  { points: 100,    type: 'wood' },
  { points: 200,    type: 'wood' },
  { points: 300,    type: 'silver' },
  { points: 1000,   type: 'gold' },
  { points: 2000,   type: 'silver' },
  { points: 4000,   type: 'silver' },
  { points: 5000,   type: 'gold' },
  { points: 7000,   type: 'gold' },
  { points: 8000,   type: 'smaragd' },
  { points: 10000,  type: 'smaragd' },
  { points: 12000,  type: 'smaragd' },
  { points: 15000,  type: 'rubin' },
  { points: 20000,  type: 'rubin' },
  { points: 25000,  type: 'diamant' },
  { points: 35000,  type: 'diamant' },
  { points: 40000,  type: 'diamant' },
  { points: 60000,  type: 'hemlig' },
  { points: 100000, type: 'hemlig' },
];

export const EXERCISE_CHEST_MILESTONES: { exercises: number; type: ChestType }[] = [
  { exercises: 1,    type: 'wood' },
  { exercises: 5,    type: 'wood' },
  { exercises: 10,   type: 'wood' },
  { exercises: 12,   type: 'silver' },
  { exercises: 30,   type: 'gold' },
  { exercises: 55,   type: 'wood' },
  { exercises: 60,   type: 'silver' },
  { exercises: 80,   type: 'gold' },
  { exercises: 90,   type: 'silver' },
  { exercises: 100,  type: 'gold' },
  { exercises: 125,  type: 'gold' },
  { exercises: 150,  type: 'smaragd' },
  { exercises: 175,  type: 'smaragd' },
  { exercises: 200,  type: 'smaragd' },
  { exercises: 250,  type: 'rubin' },
  { exercises: 300,  type: 'rubin' },
  { exercises: 400,  type: 'diamant' },
  { exercises: 450,  type: 'diamant' },
  { exercises: 500,  type: 'diamant' },
  { exercises: 750,  type: 'hemlig' },
  { exercises: 1000, type: 'hemlig' },
];

export const CHEST_META: Record<
  ChestType,
  { label: string; emoji: string; image: string; openImage: string; gradient: string; description: string }
> = {
  wood: {
    label: 'Bronskista',
    emoji: '🟫',
    image: '/bronskista.png',
    openImage: '/oppen-brons.png',
    gradient: 'from-amber-700 to-amber-900',
    description: 'En bronskista med små belöningar.',
  },
  silver: {
    label: 'Silverkista',
    emoji: '⬜',
    image: '/silverkista.png',
    openImage: '/oppen-silver.png',
    gradient: 'from-slate-400 to-slate-600',
    description: 'En glänsande silverkista med bra belöningar.',
  },
  gold: {
    label: 'Guldkista',
    emoji: '🟡',
    image: '/guldkista.png',
    openImage: '/oppen-guld.png',
    gradient: 'from-yellow-400 to-amber-500',
    description: 'En praktfull guldkista med de bästa belöningarna!',
  },
  rubin: {
    label: 'Rubinkista',
    emoji: '🔴',
    image: '/rubinkista.png',
    openImage: '/oppen-rubin.png',
    gradient: 'from-red-500 to-rose-700',
    description: 'En lysande rubinkista med fantastiska belöningar!',
  },
  smaragd: {
    label: 'Smaragdkista',
    emoji: '🟢',
    image: '/smaragdkista.png',
    openImage: '/oppen-smaragd.png',
    gradient: 'from-emerald-400 to-green-600',
    description: 'En ädel smaragdkista för de mest hängivna!',
  },
  diamant: {
    label: 'Diamantkista',
    emoji: '💎',
    image: '/diamantkista.png',
    openImage: '/oppen-diamant.png',
    gradient: 'from-cyan-300 via-blue-400 to-violet-500',
    description: 'Den ultimata diamantkistan – extremt sällsynt!',
  },
  hemlig: {
    label: 'Hemliga kistan',
    emoji: '🔒',
    image: '/hemlig-kista-blurrad.png',
    openImage: '/hemlig-kista.png',
    gradient: 'from-purple-900 via-violet-800 to-indigo-900',
    description: 'Den allra hemligaste kistan – bara för de mest dedikerade!',
  },
};

export const MATH_BADGES = [
  { id: 'first_correct',  label: 'Första rätten',     emoji: '⭐' },
  { id: 'perfect_score',  label: 'Perfekt poäng',     emoji: '🎯' },
  { id: 'ten_exercises',  label: '10 Övningar',        emoji: '💪' },
  { id: 'streak_3',       label: '3 dagars streak',   emoji: '🔥' },
  { id: 'calculator',     label: 'Miniräknare',        emoji: '🧮' },
  { id: 'geometry',       label: 'Geometrimästare',   emoji: '📐' },
  { id: 'algebra',        label: 'Algebrastjärna',    emoji: '🔢' },
  { id: 'math_hero',      label: 'Mattehjälte',        emoji: '🦸' },
  { id: 'mystery_hunter', label: 'Mysteriåjägare',    emoji: '🎁' },
];

// ─── Storage key ──────────────────────────────────────────────────────────────

const GAM_KEY = (studentId: string) => `math_gamification_${studentId}`;

// ─── Default data ─────────────────────────────────────────────────────────────

export function defaultGamificationData(): MattGamificationData {
  return {
    chests: [],
    badges: [],
    exercisesCompleted: 0,
    bossUnlocked: false,
    bossWins: 0,
    pointsMilestonesRewarded: [],
    exerciseMilestonesRewarded: [],
    topicCompletionChestsRewarded: [],
    topic3StarChestsRewarded: [],
    topicPerfectChestsRewarded: [],
    worldCompletionChestsRewarded: [],
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export function loadGamification(studentId: string): MattGamificationData {
  try {
    const raw = localStorage.getItem(GAM_KEY(studentId));
    if (!raw) return defaultGamificationData();
    // Merge with defaults so old data gets the new fields
    return { ...defaultGamificationData(), ...(JSON.parse(raw) as MattGamificationData) };
  } catch {
    return defaultGamificationData();
  }
}

export function saveGamification(studentId: string, data: MattGamificationData): void {
  localStorage.setItem(GAM_KEY(studentId), JSON.stringify(data));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeChest(type: ChestType): MattChest {
  return {
    id: `chest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    earnedAt: new Date().toISOString(),
    opened: false,
  };
}

/** Returns new chests earned when points go from prevPoints to newPoints. */
export function chestsEarnedFromPoints(
  prevPoints: number,
  newPoints: number,
  alreadyRewarded: number[]
): { chest: MattChest; milestone: number }[] {
  const earned: { chest: MattChest; milestone: number }[] = [];
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

/** Returns new chests earned when exercise count increases. */
export function chestsEarnedFromExercises(
  prevCount: number,
  newCount: number,
  alreadyRewarded: number[]
): { chest: MattChest; milestone: number }[] {
  const earned: { chest: MattChest; milestone: number }[] = [];
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

/**
 * Mystery box roll. 25% chance for the first 5 topics, 15% after that.
 * exercisesCompleted = number of topics finished so far (before this one).
 */
export function rollMysteryBox(badges: string[], exercisesCompleted = 99): MysteryBoxReward | null {
  const chance = exercisesCompleted < 5 ? MYSTERY_BOX_CHANCE_EARLY : MYSTERY_BOX_CHANCE;
  if (Math.random() > chance) return null;
  const roll = Math.random();
  if (roll < 0.5) {
    const pts = Math.floor(Math.random() * 41) + 10;
    return { type: 'points', points: pts, description: `+${pts} bonuspoäng!` };
  } else if (roll < 0.75) {
    return { type: 'chest', chestType: 'wood', description: 'En bronskista!' };
  } else {
    const available = MATH_BADGES.filter(
      b => b.id !== 'math_hero' && !badges.includes(b.id)
    );
    if (available.length === 0) {
      const pts = Math.floor(Math.random() * 41) + 10;
      return { type: 'points', points: pts, description: `+${pts} bonuspoäng!` };
    }
    const badge = available[Math.floor(Math.random() * available.length)];
    return { type: 'badge', badgeId: badge.id, description: `Märke: ${badge.label} ${badge.emoji}` };
  }
}

/** Open a wood chest → points 20-120 */
export function openWoodChest(): { points: number; description: string } {
  const pts = Math.floor(Math.random() * 101) + 20;
  return { points: pts, description: `+${pts} poäng` };
}

/** Open a silver chest → points 20-120 + possible badge + possible bonus wood chest */
export function openSilverChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20;
  const available = MATH_BADGES.filter(
    b => b.id !== 'math_hero' && !badges.includes(b.id)
  );
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.5 ? makeChest('wood') : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? 'Bonus: Bronskista!' : null,
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Open a gold chest → points 20-120 + badge + possible silver chest */
export function openGoldChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20;
  const available = MATH_BADGES.filter(b => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.3 ? makeChest('silver') : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? 'Bonus: Silverkista!' : null,
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Open a rubin chest → points 20-120 + badge + possible bonus gold chest */
export function openRubinChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20;
  const available = MATH_BADGES.filter(b => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.35 ? makeChest('gold') : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? 'Bonus: Guldkista!' : null,
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Open a smaragd chest → points 20-120 + badge + possible bonus rubin chest */
export function openSmaragdChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20;
  const available = MATH_BADGES.filter(b => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.3 ? makeChest('rubin') : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? 'Bonus: Rubinkista!' : null,
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Open a diamant chest → points 20-120 + badge + guaranteed bonus gold chest */
export function openDiamantChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20;
  const available = MATH_BADGES.filter(b => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = makeChest('smaragd'); // guaranteed bonus
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    'Bonus: Smaragdkista!',
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Open a hemlig chest → points 20-120 + badge + guaranteed diamant bonus chest */
export function openHemligChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20;
  const available = MATH_BADGES.filter(b => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = makeChest('diamant');
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    'Bonus: Diamantkista!',
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

export function getMathBadge(id: string) {
  return MATH_BADGES.find(b => b.id === id);
}

// ─── Topic / World completion chests ─────────────────────────────────────────

/**
 * Chests earned from completing a topic for the first time, getting 3 stars,
 * getting a perfect score (100%), or completing all topics in a world.
 * Returns new chests and the updated tracking arrays.
 */
export function chestsEarnedFromTopicEvent(opts: {
  topicId: string;
  worldId: string | null;
  score: number;             // 0–100
  stars: number;             // 0–3
  allWorldTopicsCompleted: boolean;
  gam: MattGamificationData;
}): {
  chests: MattChest[];
  topicCompletionChestsRewarded: string[];
  topic3StarChestsRewarded: string[];
  topicPerfectChestsRewarded: string[];
  worldCompletionChestsRewarded: string[];
} {
  const newChests: MattChest[] = [];
  const tc = [...(opts.gam.topicCompletionChestsRewarded ?? [])];
  const t3 = [...(opts.gam.topic3StarChestsRewarded ?? [])];
  const tp = [...(opts.gam.topicPerfectChestsRewarded ?? [])];
  const wc = [...(opts.gam.worldCompletionChestsRewarded ?? [])];

  const now = new Date().toISOString();
  function mkChest(type: ChestType, suffix: string): MattChest {
    return { id: `chest_${Date.now()}_${suffix}`, type, earnedAt: now, opened: false };
  }

  // 1. First completion (score >= 50)
  //    Very first topic ever → silver (big wow moment), subsequent → wood
  if (opts.score >= 50 && !tc.includes(opts.topicId)) {
    const isFirst = opts.gam.topicCompletionChestsRewarded.length === 0;
    newChests.push(mkChest(isFirst ? 'silver' : 'wood', 'tc'));
    tc.push(opts.topicId);
  }

  // 2. First 3-star completion → silver chest
  if (opts.stars === 3 && !t3.includes(opts.topicId)) {
    newChests.push(mkChest('silver', 't3'));
    t3.push(opts.topicId);
  }

  // 3. First perfect score (100%) → silver chest
  if (opts.score === 100 && !tp.includes(opts.topicId)) {
    newChests.push(mkChest('silver', 'tp'));
    tp.push(opts.topicId);
  }

  // 4. First time all topics in a world are completed → rubin chest
  if (opts.allWorldTopicsCompleted && opts.worldId && !wc.includes(opts.worldId)) {
    newChests.push(mkChest('rubin', 'wc'));
    wc.push(opts.worldId);
  }

  return {
    chests: newChests,
    topicCompletionChestsRewarded: tc,
    topic3StarChestsRewarded: t3,
    topicPerfectChestsRewarded: tp,
    worldCompletionChestsRewarded: wc,
  };
}
