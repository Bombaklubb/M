/**
 * Bokstavsresan – åtta stationer.
 *
 * Varje station låser upp några bokstäver. Motiveringen till ordningen står i
 * data/letters.ts: uthållbara ljud och vokaler först så att eleven kan bilda
 * riktiga ord redan efter station 1, klusiler sist eftersom talsyntesen inte
 * klarar dem.
 */
export interface ProgressionStep {
  step: number;
  letters: string[];
  icon: string;
  /** Visas i lärarläget, aldrig för eleven. */
  note: string;
}

export const PROGRESSION_STEPS: ProgressionStep[] = [
  { step: 1, letters: ['s', 'o', 'l', 'a'], icon: '☀️', note: 'sol, sal, los' },
  { step: 2, letters: ['r', 'm', 'i'], icon: '🐭', note: 'ris, ros, mos, mor, arm, sim' },
  { step: 3, letters: ['v', 'e', 'n'], icon: '🌊', note: 'ren, sen, vas, nos, ner' },
  { step: 4, letters: ['t', 'f', 'ä'], icon: '🦊', note: 'fem, tar, fin, tre, näs' },
  { step: 5, letters: ['k', 'ö', 'u'], icon: '🔑', note: 'kul, kö, mus, sur, ko' },
  { step: 6, letters: ['p', 'å', 'g'], icon: '🐷', note: 'på, gå, pil, gul, apa' },
  { step: 7, letters: ['b', 'd', 'h', 'j'], icon: '🏀', note: 'bok, bil, dam, hus, hej' },
  { step: 8, letters: ['y', 'c', 'x', 'z', 'w', 'q'], icon: '🏁', note: 'ovanliga bokstäver' },
];

export const MAX_STEP = PROGRESSION_STEPS.length;

export function lettersForStep(step: number): string[] {
  return PROGRESSION_STEPS.find((s) => s.step === step)?.letters ?? [];
}

/** Alla bokstäver som är upplåsta till och med `step`. */
export function unlockedLetters(step: number): string[] {
  return PROGRESSION_STEPS.filter((s) => s.step <= step).flatMap((s) => s.letters);
}
