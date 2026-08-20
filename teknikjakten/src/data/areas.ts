import { Chapter, AreaId, Area } from '../types';
import { AREAS } from './areaMeta';
import { GRUNDER } from './chapters/grunder';
import { BOSTAD } from './chapters/bostad';
import { VARDAG } from './chapters/vardag';

export { AREAS };

/**
 * Alla kapitel i appen.
 *
 * TOMT TILLS VIDARE – kapitlen skrivs när bokens innehåll är uppladdat.
 * Ett kapitel per innehållsavsnitt i boken, i egna filer per område
 * (src/data/chapters/rorelse.ts …), importerade hit:
 *
 *   import { RORELSE } from './chapters/rorelse';
 *   export const ALL_CHAPTERS: Chapter[] = [...RORELSE];
 *
 * Den här filen importeras bara av vyer som laddas med React.lazy, så
 * kapiteldatan hamnar aldrig i startpaketet.
 */
export const ALL_CHAPTERS: Chapter[] = [
  ...GRUNDER,
  ...BOSTAD,
  ...VARDAG,
];

/** Kapitlen i ett område, i den ordning de står i boken. */
export function getChaptersForArea(areaId: AreaId): Chapter[] {
  return ALL_CHAPTERS.filter(c => c.areaId === areaId);
}

export function getArea(id: AreaId): Area | undefined {
  return AREAS.find(a => a.id === id);
}

/** Områden som har minst ett kapitel – tomma döljs. */
export function getAreasWithContent(): Area[] {
  return AREAS.filter(a => ALL_CHAPTERS.some(c => c.areaId === a.id));
}
