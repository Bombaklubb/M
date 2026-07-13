import { ChapterProgress, AchievementStats, SubjectId } from '../types';

const PROGRESS_KEY = 'so_progress';
const STATS_KEY = 'so_stats';
const VERSION_KEY = 'so_version';

/**
 * Höj detta tal vid inkompatibla ändringar i datastrukturen.
 * Vid versionsskillnad rensas sparad data i stället för att krascha appen.
 */
const STORAGE_VERSION = 1;

function ensureVersion(): void {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored === String(STORAGE_VERSION)) return;
    if (stored === null && localStorage.getItem(PROGRESS_KEY) === null && localStorage.getItem(STATS_KEY) === null) {
      // Färsk installation – stämpla bara versionen.
      localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
      return;
    }
    if (stored === null) {
      // Data från tiden före versionsstämpeln – nuvarande format är v1, behåll datan.
      localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
      return;
    }
    // Okänd/äldre version – rensa hellre än att krascha.
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
  } catch { /* localStorage kan saknas (privat läge) – kör vidare utan */ }
}

interface StoredStats {
  totalCorrect: number;
  totalAnswered: number;
}

function isValidProgress(p: unknown): p is ChapterProgress {
  return typeof p === 'object' && p !== null
    && typeof (p as ChapterProgress).chapterId === 'string'
    && typeof (p as ChapterProgress).bestScore === 'number';
}

export function getProgress(): ChapterProgress[] {
  ensureVersion();
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isValidProgress) : [];
  }
  catch { return []; }
}

export function getChapterProgress(chapterId: string): ChapterProgress | null {
  return getProgress().find(p => p.chapterId === chapterId) ?? null;
}

export function saveChapterProgress(progress: ChapterProgress): void {
  const all = getProgress();
  const idx = all.findIndex(p => p.chapterId === progress.chapterId);
  if (idx >= 0) {
    all[idx] = {
      ...progress,
      bestScore: Math.max(all[idx].bestScore, progress.bestScore),
      stars: Math.max(all[idx].stars, progress.stars),
      totalAttempts: all[idx].totalAttempts + 1,
    };
  } else {
    all.push({ ...progress, totalAttempts: 1 });
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
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
  localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  return updated;
}

export function buildAchievementStats(): AchievementStats {
  const progress = getProgress();
  const stats = getStats();
  const completedChapters = progress.filter(p => p.completed).length;
  const subjectCounts: Record<SubjectId, number> = { historia: 0, geografi: 0, religion: 0, samhalle: 0 };
  progress.filter(p => p.completed).forEach(p => {
    const subjectId = p.chapterId.split('-')[1] as SubjectId;
    if (subjectId in subjectCounts) subjectCounts[subjectId]++;
  });
  return { completedChapters, progress, subjectCounts, ...stats };
}

export function calcStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}
