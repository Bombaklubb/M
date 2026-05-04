import type { ChestType, SOChest, SOGamificationData, MysteryBoxReward } from '../types';

export const MYSTERY_BOX_CHANCE_EARLY = 0.25;
export const MYSTERY_BOX_CHANCE = 0.15;

export const POINT_CHEST_MILESTONES: { points: number; type: ChestType }[] = [
  { points: 10,    type: 'wood' },
  { points: 50,    type: 'wood' },
  { points: 100,   type: 'wood' },
  { points: 200,   type: 'wood' },
  { points: 300,   type: 'silver' },
  { points: 1000,  type: 'gold' },
  { points: 2000,  type: 'silver' },
  { points: 4000,  type: 'silver' },
  { points: 5000,  type: 'gold' },
  { points: 7000,  type: 'gold' },
  { points: 8000,  type: 'smaragd' },
  { points: 10000, type: 'smaragd' },
  { points: 15000, type: 'rubin' },
  { points: 25000, type: 'diamant' },
  { points: 60000, type: 'hemlig' },
];

export const CHAPTER_CHEST_MILESTONES: { chapters: number; type: ChestType }[] = [
  { chapters: 1,  type: 'wood' },
  { chapters: 3,  type: 'silver' },
  { chapters: 5,  type: 'wood' },
  { chapters: 8,  type: 'gold' },
  { chapters: 11, type: 'gold' },
];

export const CHEST_META: Record<
  ChestType,
  { label: string; emoji: string; gradient: string; description: string }
> = {
  wood:     { label: 'Bronskista',   emoji: '🟫', gradient: 'from-amber-700 to-amber-900',              description: 'En bronskista med små belöningar.' },
  silver:   { label: 'Silverkista',  emoji: '⬜', gradient: 'from-slate-400 to-slate-600',              description: 'En glänsande silverkista med bra belöningar.' },
  gold:     { label: 'Guldkista',    emoji: '🟡', gradient: 'from-yellow-400 to-amber-500',             description: 'En praktfull guldkista med de bästa belöningarna!' },
  rubin:    { label: 'Rubinkista',   emoji: '🔴', gradient: 'from-red-500 to-rose-700',                 description: 'En lysande rubinkista med fantastiska belöningar!' },
  smaragd:  { label: 'Smaragdkista', emoji: '🟢', gradient: 'from-emerald-400 to-green-600',            description: 'En ädel smaragdkista för de mest hängivna!' },
  diamant:  { label: 'Diamantkista', emoji: '💎', gradient: 'from-cyan-300 via-blue-400 to-violet-500', description: 'Den ultimata diamantkistan – extremt sällsynt!' },
  hemlig:   { label: 'Hemliga kistan', emoji: '🔒', gradient: 'from-purple-900 via-violet-800 to-indigo-900', description: 'Den allra hemligaste kistan – bara för de mest dedikerade!' },
};

export const SO_BADGES = [
  { id: 'first_correct',   label: 'Första rätten',       emoji: '⭐' },
  { id: 'perfect_score',   label: 'Perfekt poäng',       emoji: '🎯' },
  { id: 'ten_chapters',    label: '10 Kapitel',          emoji: '💪' },
  { id: 'streak_3',        label: '3 dagars streak',     emoji: '🔥' },
  { id: 'historian',       label: 'Historiker',          emoji: '⚔️' },
  { id: 'geographer',      label: 'Geograf',             emoji: '🌍' },
  { id: 'theologian',      label: 'Religionsforskare',   emoji: '🕊️' },
  { id: 'civic_hero',      label: 'Samhällskämpe',       emoji: '🏛️' },
  { id: 'mystery_hunter',  label: 'Mysteriejägare',      emoji: '🎁' },
];

const GAM_KEY = (studentId: string) => `so_gamification_${studentId}`;

export function defaultGamificationData(): SOGamificationData {
  return {
    chests: [],
    badges: [],
    chaptersCompleted: 0,
    pointsMilestonesRewarded: [],
    chapterMilestonesRewarded: [],
    chapterCompletionChestsRewarded: [],
    chapter3StarChestsRewarded: [],
    chapterPerfectChestsRewarded: [],
    subjectCompletionChestsRewarded: [],
  };
}

export function loadGamification(studentId: string): SOGamificationData {
  try {
    const raw = localStorage.getItem(GAM_KEY(studentId));
    if (!raw) return defaultGamificationData();
    return { ...defaultGamificationData(), ...(JSON.parse(raw) as SOGamificationData) };
  } catch {
    return defaultGamificationData();
  }
}

export function saveGamification(studentId: string, data: SOGamificationData): void {
  localStorage.setItem(GAM_KEY(studentId), JSON.stringify(data));
}

function makeChest(type: ChestType): SOChest {
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
): { chest: SOChest; milestone: number }[] {
  return POINT_CHEST_MILESTONES
    .filter(m => prevPoints < m.points && newPoints >= m.points && !alreadyRewarded.includes(m.points))
    .map(m => ({ chest: makeChest(m.type), milestone: m.points }));
}

export function chestsEarnedFromChapters(
  prevCount: number,
  newCount: number,
  alreadyRewarded: number[]
): { chest: SOChest; milestone: number }[] {
  return CHAPTER_CHEST_MILESTONES
    .filter(m => prevCount < m.chapters && newCount >= m.chapters && !alreadyRewarded.includes(m.chapters))
    .map(m => ({ chest: makeChest(m.type), milestone: m.chapters }));
}

export function chestsEarnedFromChapterEvent(opts: {
  chapterId: string;
  subjectComboKey: string;
  score: number;
  stars: number;
  allSubjectChaptersCompleted: boolean;
  gam: SOGamificationData;
}): {
  chests: SOChest[];
  chapterCompletionChestsRewarded: string[];
  chapter3StarChestsRewarded: string[];
  chapterPerfectChestsRewarded: string[];
  subjectCompletionChestsRewarded: string[];
} {
  const newChests: SOChest[] = [];
  const tc = [...(opts.gam.chapterCompletionChestsRewarded ?? [])];
  const t3 = [...(opts.gam.chapter3StarChestsRewarded ?? [])];
  const tp = [...(opts.gam.chapterPerfectChestsRewarded ?? [])];
  const sc = [...(opts.gam.subjectCompletionChestsRewarded ?? [])];
  const now = new Date().toISOString();
  const mk = (type: ChestType, suffix: string): SOChest =>
    ({ id: `chest_${Date.now()}_${suffix}`, type, earnedAt: now, opened: false });

  if (opts.score >= 50 && !tc.includes(opts.chapterId)) {
    const isFirst = opts.gam.chapterCompletionChestsRewarded.length === 0;
    newChests.push(mk(isFirst ? 'silver' : 'wood', 'tc'));
    tc.push(opts.chapterId);
  }
  if (opts.stars === 3 && !t3.includes(opts.chapterId)) {
    newChests.push(mk('silver', 't3'));
    t3.push(opts.chapterId);
  }
  if (opts.score === 100 && !tp.includes(opts.chapterId)) {
    newChests.push(mk('silver', 'tp'));
    tp.push(opts.chapterId);
  }
  if (opts.allSubjectChaptersCompleted && !sc.includes(opts.subjectComboKey)) {
    newChests.push(mk('gold', 'sc'));
    sc.push(opts.subjectComboKey);
  }

  return {
    chests: newChests,
    chapterCompletionChestsRewarded: tc,
    chapter3StarChestsRewarded: t3,
    chapterPerfectChestsRewarded: tp,
    subjectCompletionChestsRewarded: sc,
  };
}

export function rollMysteryBox(badges: string[], chaptersCompleted = 99): MysteryBoxReward | null {
  const chance = chaptersCompleted < 5 ? MYSTERY_BOX_CHANCE_EARLY : MYSTERY_BOX_CHANCE;
  if (Math.random() > chance) return null;
  const roll = Math.random();
  if (roll < 0.5) {
    const pts = Math.floor(Math.random() * 41) + 10;
    return { type: 'points', points: pts, description: `+${pts} bonuspoäng!` };
  } else if (roll < 0.75) {
    return { type: 'chest', chestType: 'wood', description: 'En bronskista!' };
  } else {
    const available = SO_BADGES.filter(b => b.id !== 'mystery_hunter' && !badges.includes(b.id));
    if (available.length === 0) {
      const pts = Math.floor(Math.random() * 41) + 10;
      return { type: 'points', points: pts, description: `+${pts} bonuspoäng!` };
    }
    const badge = available[Math.floor(Math.random() * available.length)];
    return { type: 'badge', badgeId: badge.id, description: `Märke: ${badge.label} ${badge.emoji}` };
  }
}

export function openChest(type: ChestType, badges: string[]): {
  points: number; badge?: string; bonusChest?: SOChest; description: string;
} {
  const pts = Math.floor(Math.random() * 101) + 20;
  const available = SO_BADGES.filter(b => !badges.includes(b.id));
  const badge = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;

  const bonusMap: Partial<Record<ChestType, { type: ChestType; chance: number; label: string }>> = {
    silver:  { type: 'wood',    chance: 0.5,  label: 'Bronskista' },
    gold:    { type: 'silver',  chance: 0.3,  label: 'Silverkista' },
    rubin:   { type: 'gold',    chance: 0.35, label: 'Guldkista' },
    smaragd: { type: 'rubin',   chance: 0.3,  label: 'Rubinkista' },
    diamant: { type: 'smaragd', chance: 1.0,  label: 'Smaragdkista' },
    hemlig:  { type: 'diamant', chance: 1.0,  label: 'Diamantkista' },
  };

  let bonusChest: SOChest | undefined;
  let bonusLabel = '';
  const bonus = bonusMap[type];
  if (bonus && Math.random() < bonus.chance) {
    bonusChest = {
      id: `chest_${Date.now()}_bonus`,
      type: bonus.type,
      earnedAt: new Date().toISOString(),
      opened: false,
    };
    bonusLabel = `Bonus: ${bonus.label}!`;
  }

  const desc = [
    `+${pts} poäng`,
    badge ? `Märke: ${badge.label} ${badge.emoji}` : null,
    bonusLabel || null,
  ].filter(Boolean).join(' • ');

  return { points: pts, badge: badge?.id, bonusChest, description: desc };
}

export function getSOBadge(id: string) {
  return SO_BADGES.find(b => b.id === id);
}
