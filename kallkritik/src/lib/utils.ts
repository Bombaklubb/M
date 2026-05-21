import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function xpToLevel(xp: number): number {
  // Level thresholds: 0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700
  const thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];
  let level = 1;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1;
  }
  return Math.min(level, 10);
}

export function xpForNextLevel(currentXp: number): { current: number; next: number; progress: number } {
  const thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 99999];
  const level = xpToLevel(currentXp);
  const currentThreshold = thresholds[level - 1];
  const nextThreshold = thresholds[level];
  const progress = nextThreshold === 99999
    ? 100
    : Math.round(((currentXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
  return { current: currentXp - currentThreshold, next: nextThreshold - currentThreshold, progress };
}

export function getLevelTitle(level: number): string {
  const titles = [
    'Nybörjare', 'Elev', 'Analytiker', 'Granskare', 'Detektiv',
    'Expert', 'Mästare', 'Veteran', 'Legende', 'Källkritikguru',
  ];
  return titles[Math.min(level - 1, 9)];
}
