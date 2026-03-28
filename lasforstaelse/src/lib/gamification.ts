import type { ChestType, Chest, MysteryBoxReward, GamificationData } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const MYSTERY_BOX_CHANCE = 0.12;

export const POINT_CHEST_MILESTONES: { points: number; type: ChestType }[] = [
  // Bronskista: 10-200 poäng
  { points: 10, type: 'bronze' },
  { points: 50, type: 'bronze' },
  { points: 100, type: 'bronze' },
  { points: 200, type: 'bronze' },
  // Silverkista: 300-4000 poäng
  { points: 300, type: 'silver' },
  { points: 500, type: 'silver' },
  { points: 750, type: 'silver' },
  { points: 1000, type: 'silver' },
  { points: 1500, type: 'silver' },
  { points: 2000, type: 'silver' },
  { points: 3000, type: 'silver' },
  { points: 4000, type: 'silver' },
  // Guldkista: 1000-7000 poäng
  { points: 1200, type: 'gold' },
  { points: 2500, type: 'gold' },
  { points: 3500, type: 'gold' },
  { points: 5000, type: 'gold' },
  { points: 7000, type: 'gold' },
  // Smaragdkista: 8000-12000 poäng
  { points: 8000, type: 'emerald' },
  { points: 10000, type: 'emerald' },
  { points: 12000, type: 'emerald' },
  // Rubinkista: 15000-20000 poäng
  { points: 15000, type: 'ruby' },
  { points: 18000, type: 'ruby' },
  { points: 20000, type: 'ruby' },
  // Diamantkista: 25000-40000 poäng
  { points: 25000, type: 'diamond' },
  { points: 30000, type: 'diamond' },
  { points: 35000, type: 'diamond' },
  { points: 40000, type: 'diamond' },
];

export const TEXT_CHEST_MILESTONES: { texts: number; type: ChestType }[] = [
  // Bronskista: 1-55 övningar
  { texts: 1, type: 'bronze' },
  { texts: 5, type: 'bronze' },
  { texts: 10, type: 'bronze' },
  { texts: 20, type: 'bronze' },
  { texts: 35, type: 'bronze' },
  { texts: 55, type: 'bronze' },
  // Silverkista: 12-90 övningar
  { texts: 12, type: 'silver' },
  { texts: 25, type: 'silver' },
  { texts: 40, type: 'silver' },
  { texts: 60, type: 'silver' },
  { texts: 75, type: 'silver' },
  { texts: 90, type: 'silver' },
  // Guldkista: 30-125 övningar
  { texts: 30, type: 'gold' },
  { texts: 50, type: 'gold' },
  { texts: 80, type: 'gold' },
  { texts: 100, type: 'gold' },
  { texts: 125, type: 'gold' },
  // Smaragdkista: 150-200 övningar
  { texts: 150, type: 'emerald' },
  { texts: 175, type: 'emerald' },
  { texts: 200, type: 'emerald' },
  // Rubinkista: 250-300 övningar
  { texts: 250, type: 'ruby' },
  { texts: 275, type: 'ruby' },
  { texts: 300, type: 'ruby' },
  // Diamantkista: 400-500 övningar
  { texts: 400, type: 'diamond' },
  { texts: 450, type: 'diamond' },
  { texts: 500, type: 'diamond' },
];

// ─── Chest metadata ───────────────────────────────────────────────────────────

export const CHEST_META: Record<
  ChestType,
  { label: string; emoji: string; color: string; borderColor: string; shadowColor: string; description: string }
> = {
  bronze: {
    label: 'Bronskista',
    emoji: '🥉',
    color: 'from-amber-600 to-amber-800',
    borderColor: 'border-amber-700',
    shadowColor: 'shadow-amber-900/40',
    description: 'En enkel bronskista med små belöningar.',
  },
  silver: {
    label: 'Silverkista',
    emoji: '🥈',
    color: 'from-slate-400 to-slate-600',
    borderColor: 'border-slate-500',
    shadowColor: 'shadow-slate-700/40',
    description: 'En glänsande silverkista med bra belöningar.',
  },
  gold: {
    label: 'Guldkista',
    emoji: '🥇',
    color: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-500',
    shadowColor: 'shadow-yellow-600/40',
    description: 'En praktfull guldkista med fina belöningar!',
  },
  emerald: {
    label: 'Smaragdkista',
    emoji: '💚',
    color: 'from-emerald-400 to-emerald-600',
    borderColor: 'border-emerald-500',
    shadowColor: 'shadow-emerald-600/40',
    description: 'En lysande smaragdkista med värdefulla belöningar!',
  },
  ruby: {
    label: 'Rubinkista',
    emoji: '❤️',
    color: 'from-red-400 to-red-600',
    borderColor: 'border-red-500',
    shadowColor: 'shadow-red-600/40',
    description: 'En vacker rubinkista med fantastiska belöningar!',
  },
  diamond: {
    label: 'Diamantkista',
    emoji: '💎',
    color: 'from-cyan-300 to-blue-500',
    borderColor: 'border-cyan-400',
    shadowColor: 'shadow-cyan-500/40',
    description: 'En legendarisk diamantkista med de bästa belöningarna!',
  },
};

export const ALL_GAMIFICATION_BADGES = [
  { id: 'reading_star', label: 'Lässtjärna', emoji: '⭐' },
  { id: 'book_worm', label: 'Bokmask', emoji: '🐛' },
  { id: 'story_master', label: 'Berättarmästare', emoji: '📖' },
  { id: 'curious_reader', label: 'Nyfiken läsare', emoji: '🔍' },
  { id: 'word_explorer', label: 'Ordutforskare', emoji: '🧭' },
  { id: 'reading_hero', label: 'Läshjälte', emoji: '🦸' },
  { id: 'mystery_finder', label: 'Mysteriejägare', emoji: '🎁' },
  { id: 'text_champion', label: 'Textmästare', emoji: '🏆' },
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

export function chestsEarnedFromTexts(
  prevCount: number,
  newCount: number,
  alreadyRewarded: number[]
): { chest: Chest; milestone: number }[] {
  const earned: { chest: Chest; milestone: number }[] = [];
  for (const m of TEXT_CHEST_MILESTONES) {
    if (
      prevCount < m.texts &&
      newCount >= m.texts &&
      !alreadyRewarded.includes(m.texts)
    ) {
      earned.push({ chest: makeChest(m.type), milestone: m.texts });
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
      type: 'points',
      points: pts,
      description: `+${pts} bonuspoäng!`,
    };
  } else if (roll < 0.75) {
    return {
      type: 'chest',
      chestType: 'bronze',
      description: 'En bronskista!',
    };
  } else {
    const available = ALL_GAMIFICATION_BADGES.filter(
      (b) => !badges.includes(b.id)
    );
    if (available.length === 0) {
      const pts = Math.floor(Math.random() * 41) + 10;
      return {
        type: 'points',
        points: pts,
        description: `+${pts} bonuspoäng!`,
      };
    }
    const badge = available[Math.floor(Math.random() * available.length)];
    return {
      type: 'badge',
      badgeId: badge.id,
      description: `Märke: ${badge.label} ${badge.emoji}`,
    };
  }
}

function getChestPointRange(type: ChestType): { min: number; max: number } {
  switch (type) {
    case 'bronze': return { min: 10, max: 50 };
    case 'silver': return { min: 50, max: 100 };
    case 'gold': return { min: 100, max: 200 };
    case 'emerald': return { min: 150, max: 300 };
    case 'ruby': return { min: 200, max: 400 };
    case 'diamond': return { min: 300, max: 500 };
    default: return { min: 10, max: 50 };
  }
}

export function openChest(type: ChestType, badges: string[]): {
  points: number;
  badge?: string;
  bonusChest?: Chest;
  description: string;
} {
  const range = getChestPointRange(type);
  const pts = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  // Higher tier chests have better chances for badges
  const badgeChance = {
    bronze: 0,
    silver: 0.2,
    gold: 0.3,
    emerald: 0.4,
    ruby: 0.5,
    diamond: 0.6,
  }[type] || 0;

  const bonusChestChance = {
    bronze: 0,
    silver: 0.1,
    gold: 0.2,
    emerald: 0.25,
    ruby: 0.3,
    diamond: 0.4,
  }[type] || 0;

  let badge: { id: string; label: string; emoji: string } | null = null;
  if (Math.random() < badgeChance) {
    const available = ALL_GAMIFICATION_BADGES.filter(
      (b) => !badges.includes(b.id)
    );
    if (available.length > 0) {
      badge = available[Math.floor(Math.random() * available.length)];
    }
  }

  let bonusChest: Chest | undefined;
  if (Math.random() < bonusChestChance) {
    // Bonus chest is one tier lower than current
    const bonusTypes: ChestType[] = ['bronze', 'bronze', 'silver', 'silver', 'gold', 'emerald'];
    const currentIndex = ['bronze', 'silver', 'gold', 'emerald', 'ruby', 'diamond'].indexOf(type);
    const bonusType = bonusTypes[currentIndex] || 'bronze';
    bonusChest = makeChest(bonusType);
  }

  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusChest ? `Bonus: ${CHEST_META[bonusChest.type].label}!` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

export function defaultGamificationData(): GamificationData {
  return {
    chests: [],
    gamificationBadges: [],
    textsCompleted: 0,
    pointsMilestonesRewarded: [],
    textMilestonesRewarded: [],
  };
}

export function getBadge(id: string) {
  return ALL_GAMIFICATION_BADGES.find((b) => b.id === id);
}

// ─── Storage functions ────────────────────────────────────────────────────────

const GAMIFICATION_KEY = 'lasjakten_gamification';

export function loadGamification(): GamificationData {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    if (!raw) return defaultGamificationData();
    return JSON.parse(raw) as GamificationData;
  } catch {
    return defaultGamificationData();
  }
}

export function saveGamification(data: GamificationData): void {
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
}
