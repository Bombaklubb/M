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
    accentHex: '#c08a2c',
    textClass: 'text-amber-900',
    headingFont: 'font-historia',
    pageBgClass: 'page-bg-historia',
    headerClass: 'header-historia',
    inkHex: '#2d1d0c',
    progressHex: '#c08a2c',
  },
  {
    id: 'geografi',
    name: 'Geografi',
    shortName: 'GE',
    emoji: '🌍',
    cardClass: 'clay-geografi',
    accentHex: '#1f7a4d',
    textClass: 'text-emerald-900',
    headingFont: 'font-geografi',
    pageBgClass: 'page-bg-geografi',
    headerClass: 'header-geografi',
    inkHex: '#0a3525',
    progressHex: '#1f7a4d',
  },
  {
    id: 'religion',
    name: 'Religionskunskap',
    shortName: 'RE',
    emoji: '🕊️',
    cardClass: 'clay-religion',
    accentHex: '#5b2a86',
    textClass: 'text-violet-900',
    headingFont: 'font-religion',
    pageBgClass: 'page-bg-religion',
    headerClass: 'header-religion',
    inkHex: '#1c0e2e',
    progressHex: '#5b2a86',
  },
  {
    id: 'samhalle',
    name: 'Samhällskunskap',
    shortName: 'SH',
    emoji: '🏛️',
    cardClass: 'clay-samhalle',
    accentHex: '#1d4dd6',
    textClass: 'text-blue-900',
    headingFont: 'font-samhalle',
    pageBgClass: 'page-bg-samhalle',
    headerClass: 'header-samhalle',
    inkHex: '#0a0a14',
    progressHex: '#1d4dd6',
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
