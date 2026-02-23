import { WorldId } from './worlds';
import { getQuestProgress } from '../utils/questStorage';
import { QUESTS } from './quests';

// ─── Base avatars (always unlocked) ──────────────────────────────────────────
export const BASE_AVATARS = [
  '🦁', '👦🏻', '🐼', '🥷',  '🦊', '👧🏾', '🐸', '👩🏽',
  '🦋', '👨🏿', '🐢', '🧕🏾', '🦄', '🧑🏽', '🐉', '🧙',
  '🦸', '🧝', '🐺', '🦅',   '🐯', '🧜', '🦖',
];

// ─── World-specific avatar packs (unlocked by completing any quest in that world) ─
export interface WorldAvatarPack {
  worldId: WorldId;
  worldName: string;
  worldEmoji: string;
  avatars: string[];         // emoji list
  unlockHint: string;
}

export const WORLD_AVATAR_PACKS: WorldAvatarPack[] = [
  {
    worldId: 'dino',
    worldName: 'Dinosaurie Världen',
    worldEmoji: '🦕',
    avatars: ['🦕', '🌋', '🥚', '🦴'],
    unlockHint: 'Slutför ett uppdrag i Dinosaurie Världen',
  },
  {
    worldId: 'fantasy',
    worldName: 'Fantasy Världen',
    worldEmoji: '🏰',
    avatars: ['🏰', '🐉', '⚔️', '🪄'],
    unlockHint: 'Slutför ett uppdrag i Fantasy Världen',
  },
  {
    worldId: 'scifi',
    worldName: 'Sci-Fi Världen',
    worldEmoji: '🚀',
    avatars: ['🚀', '🤖', '👽', '🛸'],
    unlockHint: 'Slutför ett uppdrag i Sci-Fi Världen',
  },
  {
    worldId: 'gym',
    worldName: 'Rymd Akademin',
    worldEmoji: '🌌',
    avatars: ['🌌', '🔭', '🪐', '⭐'],
    unlockHint: 'Slutför ett uppdrag i Rymd Akademin',
  },
];

// Flat array: indices 0-15 = base, 16+ = world avatars in order dino/fantasy/scifi/gym
export const ALL_AVATARS: string[] = [
  ...BASE_AVATARS,
  ...WORLD_AVATAR_PACKS.flatMap(p => p.avatars),
];

// ─── Unlock helpers ───────────────────────────────────────────────────────────

/** Returns the WorldId for a given avatar index, or null if it's a base avatar. */
export function getAvatarWorld(index: number): WorldId | null {
  if (index < BASE_AVATARS.length) return null;
  const packIndex = Math.floor((index - BASE_AVATARS.length) / 4);
  return WORLD_AVATAR_PACKS[packIndex]?.worldId ?? null;
}

/** Returns true if the world's avatar pack is unlocked for this student. */
export function isWorldPackUnlocked(studentId: string, worldId: WorldId): boolean {
  const progress = getQuestProgress(studentId);
  const worldQuestIds = QUESTS.filter(q => q.worldId === worldId).map(q => q.id);
  return progress.some(p => worldQuestIds.includes(p.questId) && p.completed);
}

/** Returns true if a specific avatar index is available to the student. */
export function isAvatarUnlocked(studentId: string, index: number): boolean {
  if (index < BASE_AVATARS.length) return true;
  const worldId = getAvatarWorld(index);
  if (!worldId) return false;
  return isWorldPackUnlocked(studentId, worldId);
}
