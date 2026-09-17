import type { Exercise } from '@/types';

/**
 * Passkön.
 *
 * Den viktigaste regeln i hela appen: ett missat svar ger INTE poängavdrag.
 * Uppgiften läggs tillbaka i kön tre platser längre fram (eller sist om det
 * är färre kvar) och passet slutar först när varje uppgift är rätt en gång.
 * Alltså slutar varje pass i framgång.
 *
 * firstTryCorrect räknas bara för lärarvyn och visas aldrig för eleven.
 */
export interface QueueState {
  /** Uppgifter som återstår, i ordning. */
  pending: Exercise[];
  /** Antal unika uppgifter i passet – styr framstegsprickarna. */
  total: number;
  /** Unika uppgifter som klarats. */
  cleared: number;
  firstTryCorrect: number;
  /** Uppgifts-id som redan missats en gång i det här passet. */
  missed: Set<string>;
  startedAt: number;
  xpEarned: number;
}

export const XP_FIRST_TRY = 5;
/** Rätt efter hjälp ger fortfarande poäng – XP mäter ansträngning, inte träffsäkerhet. */
export const XP_WITH_HELP = 3;

export function createQueue(exercises: Exercise[]): QueueState {
  return {
    pending: [...exercises],
    total: exercises.length,
    cleared: 0,
    firstTryCorrect: 0,
    missed: new Set(),
    startedAt: Date.now(),
    xpEarned: 0,
  };
}

export function currentExercise(q: QueueState): Exercise | null {
  return q.pending[0] ?? null;
}

/** Hur många gånger den aktuella uppgiften har missats i det här passet. */
export function missCount(q: QueueState): number {
  const current = currentExercise(q);
  return current && q.missed.has(current.id) ? 1 : 0;
}

export function markCorrect(q: QueueState): QueueState {
  const current = currentExercise(q);
  if (!current) return q;
  const wasFirstTry = !q.missed.has(current.id);
  return {
    ...q,
    pending: q.pending.slice(1),
    cleared: q.cleared + 1,
    firstTryCorrect: q.firstTryCorrect + (wasFirstTry ? 1 : 0),
    xpEarned: q.xpEarned + (wasFirstTry ? XP_FIRST_TRY : XP_WITH_HELP),
  };
}

export function markMissed(q: QueueState): QueueState {
  const current = currentExercise(q);
  if (!current) return q;
  const rest = q.pending.slice(1);
  // Tillbaka tre platser fram – tillräckligt långt för att inte kännas som
  // en tillrättavisning, tillräckligt nära för att fortfarande vara färskt.
  const insertAt = Math.min(3, rest.length);
  const pending = [...rest.slice(0, insertAt), current, ...rest.slice(insertAt)];
  const missed = new Set(q.missed);
  missed.add(current.id);
  return { ...q, pending, missed };
}

export function isDone(q: QueueState): boolean {
  return q.pending.length === 0;
}

export function elapsedSeconds(q: QueueState): number {
  return Math.round((Date.now() - q.startedAt) / 1000);
}
