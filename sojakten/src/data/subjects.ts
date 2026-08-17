import { Chapter, SubjectId, Subject } from '../types';
import { SUBJECTS } from './subjectMeta';
import { AK4_HISTORIA } from './ak4/historia';
import { AK4_RELIGION } from './ak4/religion';
import { AK4_SAMHALLE } from './ak4/samhalle';
import { AK5_HISTORIA } from './ak5/historia';
import { AK5_GEOGRAFI } from './ak5/geografi';
import { AK5_RELIGION } from './ak5/religion';
import { AK5_SAMHALLE } from './ak5/samhalle';
import { AK6_HISTORIA } from './ak6/historia';
import { AK6_GEOGRAFI } from './ak6/geografi';
import { AK6_SAMHALLE } from './ak6/samhalle';
import { AK6_RELIGION } from './ak6/religion';

export { SUBJECTS };

export const ALL_CHAPTERS: Chapter[] = [
  ...AK4_HISTORIA,
  ...AK4_RELIGION,
  ...AK4_SAMHALLE,
  ...AK5_HISTORIA,
  ...AK5_GEOGRAFI,
  ...AK5_RELIGION,
  ...AK5_SAMHALLE,
  ...AK6_HISTORIA,
  ...AK6_GEOGRAFI,
  ...AK6_SAMHALLE,
  ...AK6_RELIGION,
];

export function getChaptersForSubjectAndGrade(subjectId: SubjectId, grade: number): Chapter[] {
  return ALL_CHAPTERS.filter(c => c.subjectId === subjectId && c.grade === String(grade));
}

export function getSubject(id: SubjectId): Subject {
  return SUBJECTS.find(s => s.id === id)!;
}

export function getChaptersForSubject(subjectId: SubjectId): Chapter[] {
  return ALL_CHAPTERS.filter(c => c.subjectId === subjectId);
}

/** Ämnen som har minst ett kapitel i den valda årskursen. */
export function getSubjectsWithContent(grade: number): Subject[] {
  return SUBJECTS.filter(s => ALL_CHAPTERS.some(c => c.subjectId === s.id && c.grade === String(grade)));
}

/** Alla årskurser som har minst ett kapitel. */
export function getAvailableGrades(): number[] {
  const grades = new Set<number>();
  for (const c of ALL_CHAPTERS) if (c.grade) grades.add(Number(c.grade));
  return [...grades].sort((a, b) => a - b);
}
