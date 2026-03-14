import type { ChestType, MattChest, MattGamificationData, MysteryBoxReward } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOSS_UNLOCK_THRESHOLD = 5; // övningar för att låsa upp boss
export const MYSTERY_BOX_CHANCE = 0.15; // 15% chans efter varje övning

export const POINT_CHEST_MILESTONES: { points: number; type: ChestType }[] = [
  { points: 100,   type: 'wood' },
  { points: 200,   type: 'wood' },
  { points: 300,   type: 'silver' },
  { points: 500,   type: 'silver' },
  { points: 600,   type: 'wood' },
  { points: 750,   type: 'silver' },
  { points: 1000,  type: 'gold' },
  { points: 1500,  type: 'silver' },
  { points: 2000,  type: 'silver' },
  { points: 2500,  type: 'gold' },
  { points: 3500,  type: 'gold' },
  { points: 5000,  type: 'gold' },
  { points: 7000,  type: 'gold' },
  { points: 10000, type: 'gold' },
  { points: 15000, type: 'gold' },
];

export const EXERCISE_CHEST_MILESTONES: { exercises: number; type: ChestType }[] = [
  { exercises: 5,   type: 'wood' },
  { exercises: 10,  type: 'wood' },
  { exercises: 15,  type: 'silver' },
  { exercises: 20,  type: 'silver' },
  { exercises: 30,  type: 'gold' },
  { exercises: 40,  type: 'silver' },
  { exercises: 50,  type: 'silver' },
  { exercises: 60,  type: 'gold' },
  { exercises: 75,  type: 'gold' },
  { exercises: 100, type: 'gold' },
  { exercises: 150, type: 'gold' },
];

export const CHEST_META: Record<
  ChestType,
  { label: string; emoji: string; gradient: string; description: string }
> = {
  wood: {
    label: 'Trälåda',
    emoji: '📦',
    gradient: 'from-amber-700 to-amber-900',
    description: 'En enkel trälåda med små belöningar.',
  },
  silver: {
    label: 'Silverlåda',
    emoji: '🪙',
    gradient: 'from-slate-400 to-slate-600',
    description: 'En glänsande silverlåda med bra belöningar.',
  },
  gold: {
    label: 'Guldlåda',
    emoji: '🏆',
    gradient: 'from-yellow-400 to-amber-500',
    description: 'En praktfull guldlåda med de bästa belöningarna!',
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
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export function loadGamification(studentId: string): MattGamificationData {
  try {
    const raw = localStorage.getItem(GAM_KEY(studentId));
    if (!raw) return defaultGamificationData();
    return JSON.parse(raw) as MattGamificationData;
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

/** 15% chance to get a mystery box reward. Returns null if no box. */
export function rollMysteryBox(badges: string[]): MysteryBoxReward | null {
  if (Math.random() > MYSTERY_BOX_CHANCE) return null;
  const roll = Math.random();
  if (roll < 0.5) {
    const pts = Math.floor(Math.random() * 41) + 10;
    return { type: 'points', points: pts, description: `+${pts} bonuspoäng!` };
  } else if (roll < 0.75) {
    return { type: 'chest', chestType: 'wood', description: 'En trälåda!' };
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

/** Open a wood chest → points 50-100 */
export function openWoodChest(): { points: number; description: string } {
  const pts = Math.floor(Math.random() * 51) + 50;
  return { points: pts, description: `+${pts} poäng` };
}

/** Open a silver chest → points 100-200 + possible badge + possible bonus wood chest */
export function openSilverChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 100;
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
    bonusChest ? 'Bonus: Trälåda!' : null,
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

/** Open a gold chest → points 200-500 + badge + possible silver chest */
export function openGoldChest(badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: MattChest;
  description: string;
} {
  const pts = Math.floor(Math.random() * 301) + 200;
  const available = MATH_BADGES.filter(b => !badges.includes(b.id));
  const badge = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
  const bonusChest = Math.random() < 0.3 ? makeChest('silver') : undefined;
  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? 'Bonus: Silverlåda!' : null,
  ].filter(Boolean).join(' • ');
  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

export function getMathBadge(id: string) {
  return MATH_BADGES.find(b => b.id === id);
}
