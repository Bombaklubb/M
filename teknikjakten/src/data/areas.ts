import { Chapter, AreaId, Area } from '../types';
import { AREAS } from './areaMeta';

export { AREAS };

/**
 * Alla kapitel i appen.
 *
 * TOMT TILLS VIDARE. Kapitlen läggs i egna filer per årskurs och område
 * (src/data/ak4/material.ts, src/data/ak5/system.ts …) och importeras hit:
 *
 *   import { AK4_MATERIAL } from './ak4/material';
 *   export const ALL_CHAPTERS: Chapter[] = [...AK4_MATERIAL, ...];
 *
 * Så länge listan är tom visar appen sina tomma lägen i stället för att krascha:
 * årskurser utan innehåll döljs, och områden utan kapitel i vald årskurs visas inte.
 */
export const ALL_CHAPTERS: Chapter[] = [];

/**
 * Kapitel för ett område i EN årskurs. Använd alltid denna – aldrig ett urval
 * utan årskursfilter – så att en elev i åk 4 inte skickas in i åk 5-innehåll.
 */
export function getChaptersForAreaAndGrade(areaId: AreaId, grade: number): Chapter[] {
  return ALL_CHAPTERS.filter(c => c.areaId === areaId && c.grade === String(grade));
}

export function getArea(id: AreaId): Area | undefined {
  return AREAS.find(a => a.id === id);
}

export function getChaptersForArea(areaId: AreaId): Chapter[] {
  return ALL_CHAPTERS.filter(c => c.areaId === areaId);
}

/** Områden som har minst ett kapitel i den valda årskursen – tomma döljs. */
export function getAreasWithContent(grade: number): Area[] {
  return AREAS.filter(a => ALL_CHAPTERS.some(c => c.areaId === a.id && c.grade === String(grade)));
}

/** Alla årskurser som har minst ett kapitel. */
export function getAvailableGrades(): number[] {
  const grades = new Set<number>();
  for (const c of ALL_CHAPTERS) if (c.grade) grades.add(Number(c.grade));
  return [...grades].sort((a, b) => a - b);
}
