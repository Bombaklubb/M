import { Subject, Chapter, SubjectId } from '../types';
import { AK5_HISTORIA } from './ak5/historia';
import { AK5_GEOGRAFI } from './ak5/geografi';
import { AK5_RELIGION } from './ak5/religion';
import { AK5_SAMHALLE } from './ak5/samhalle';

export const SUBJECTS: Subject[] = [
  {
    id: 'historia',
    name: 'Historia',
    shortName: 'HI',
    emoji: '⚔️',
    cardClass: 'clay-historia',
    accentHex: '#f59e0b',
    textClass: 'text-amber-800',
  },
  {
    id: 'geografi',
    name: 'Geografi',
    shortName: 'GE',
    emoji: '🌍',
    cardClass: 'clay-geografi',
    accentHex: '#10b981',
    textClass: 'text-emerald-800',
  },
  {
    id: 'religion',
    name: 'Religionskunskap',
    shortName: 'RE',
    emoji: '🕊️',
    cardClass: 'clay-religion',
    accentHex: '#8b5cf6',
    textClass: 'text-violet-800',
  },
  {
    id: 'samhalle',
    name: 'Samhällskunskap',
    shortName: 'SH',
    emoji: '🏛️',
    cardClass: 'clay-samhalle',
    accentHex: '#3b82f6',
    textClass: 'text-blue-800',
  },
];

export const ALL_CHAPTERS: Chapter[] = [
  ...AK5_HISTORIA,
  ...AK5_GEOGRAFI,
  ...AK5_RELIGION,
  ...AK5_SAMHALLE,
];

export function getSubject(id: SubjectId): Subject {
  return SUBJECTS.find(s => s.id === id)!;
}

export function getChaptersForSubject(subjectId: SubjectId): Chapter[] {
  return ALL_CHAPTERS.filter(c => c.subjectId === subjectId);
}
