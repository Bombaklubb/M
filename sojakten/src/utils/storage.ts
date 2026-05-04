import { ChapterProgress } from '../types';

const PROGRESS_KEY = 'so_progress';

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

export function calcStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}
