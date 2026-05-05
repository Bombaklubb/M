import { ChapterProgress, AchievementStats, SubjectId } from '../types';

const PROGRESS_KEY = 'so_progress';
const STATS_KEY = 'so_stats';

interface StoredStats {
  totalCorrect: number;
  totalAnswered: number;
}

export function getProgress(): ChapterProgress[] {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]'); }
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
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{"totalCorrect":0,"totalAnswered":0}'); }
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
