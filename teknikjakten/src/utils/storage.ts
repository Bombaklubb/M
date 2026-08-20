import { ChapterProgress, AchievementStats, AreaId } from '../types';

const PROGRESS_KEY = 'tj_progress';
const STATS_KEY = 'tj_stats';
const VERSION_KEY = 'tj_version';

/**
 * Höj detta tal vid inkompatibla ändringar i datastrukturen.
 * Vid versionsskillnad rensas sparad data i stället för att krascha appen.
 */
const STORAGE_VERSION = 1;

/**
 * Kapitel-id:n som bytt namn. Nyckel = gammalt id, värde = nytt id.
 * Utan detta tappar eleven sina sparade resultat när ett kapitel byter id.
 */
const RENAMED_CHAPTER_IDS: Record<string, string> = {};

interface StoredStats {
  totalCorrect: number;
  totalAnswered: number;
}

/** Cachar den parsade listan så att en render med många kapitelkort inte parsar om localStorage per kort. */
let progressCache: ChapterProgress[] | null = null;

function ensureVersion(): void {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored === String(STORAGE_VERSION)) return;
    if (stored === null) {
      // Antingen färsk installation eller data från tiden före versionsstämpeln.
      // Nuvarande format är v1 i båda fallen – behåll datan och stämpla.
      localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
      return;
    }
    // Okänd/äldre version – rensa hellre än att krascha.
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
    progressCache = null;
  } catch { /* localStorage kan saknas (privat läge) – kör vidare utan */ }
}

function isValidProgress(p: unknown): p is ChapterProgress {
  return typeof p === 'object' && p !== null
    && typeof (p as ChapterProgress).chapterId === 'string'
    && typeof (p as ChapterProgress).bestScore === 'number';
}

/** Skriver om gamla kapitel-id:n och slår ihop poster om både gammalt och nytt id finns. */
function migrateIds(list: ChapterProgress[]): { list: ChapterProgress[]; changed: boolean } {
  let changed = false;
  const byId = new Map<string, ChapterProgress>();
  for (const entry of list) {
    const newId = RENAMED_CHAPTER_IDS[entry.chapterId];
    if (newId) changed = true;
    const id = newId ?? entry.chapterId;
    const existing = byId.get(id);
    byId.set(id, existing
      ? {
          chapterId: id,
          completed: existing.completed || entry.completed,
          bestScore: Math.max(existing.bestScore, entry.bestScore),
          stars: Math.max(existing.stars, entry.stars),
          totalAttempts: existing.totalAttempts + entry.totalAttempts,
        }
      : { ...entry, chapterId: id });
  }
  return { list: [...byId.values()], changed };
}

export function getProgress(): ChapterProgress[] {
  if (progressCache) return progressCache;
  ensureVersion();
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
    const valid = Array.isArray(parsed) ? parsed.filter(isValidProgress) : [];
    const { list, changed } = migrateIds(valid);
    if (changed) localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    progressCache = list;
    return list;
  }
  catch { progressCache = []; return progressCache; }
}

export function getChapterProgress(chapterId: string): ChapterProgress | null {
  return getProgress().find(p => p.chapterId === chapterId) ?? null;
}

export function saveChapterProgress(progress: ChapterProgress): void {
  const all = [...getProgress()];
  const idx = all.findIndex(p => p.chapterId === progress.chapterId);
  if (idx >= 0) {
    const prev = all[idx];
    all[idx] = {
      ...progress,
      // Bästa resultatet ska aldrig kunna försämras av ett sämre omtag.
      completed: prev.completed || progress.completed,
      bestScore: Math.max(prev.bestScore, progress.bestScore),
      stars: Math.max(prev.stars, progress.stars),
      totalAttempts: prev.totalAttempts + 1,
    };
  } else {
    all.push({ ...progress, totalAttempts: 1 });
  }
  progressCache = all;
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch { /* fullt/saknas */ }
}

export function getStats(): StoredStats {
  ensureVersion();
  try {
    const parsed = JSON.parse(localStorage.getItem(STATS_KEY) || '{"totalCorrect":0,"totalAnswered":0}');
    if (typeof parsed?.totalCorrect === 'number' && typeof parsed?.totalAnswered === 'number') return parsed;
    return { totalCorrect: 0, totalAnswered: 0 };
  }
  catch { return { totalCorrect: 0, totalAnswered: 0 }; }
}

export function addStats(correct: number, total: number): StoredStats {
  const s = getStats();
  const updated = { totalCorrect: s.totalCorrect + correct, totalAnswered: s.totalAnswered + total };
  try { localStorage.setItem(STATS_KEY, JSON.stringify(updated)); } catch { /* fullt/saknas */ }
  return updated;
}

export function buildAchievementStats(): AchievementStats {
  const progress = getProgress();
  const stats = getStats();
  const completed = progress.filter(p => p.completed);
  // Områdesdelen av kapitel-id:t: rorelse-enkla-maskiner -> 'rorelse'.
  const areaCounts: Partial<Record<AreaId, number>> = {};
  completed.forEach(p => {
    const areaId = p.chapterId.split('-')[0] as AreaId;
    if (areaId) areaCounts[areaId] = (areaCounts[areaId] ?? 0) + 1;
  });
  return { completedChapters: completed.length, progress, areaCounts, ...stats };
}

export function calcStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}
