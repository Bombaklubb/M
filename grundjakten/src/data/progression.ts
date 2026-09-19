/**
 * Bokstavsresan – åtta stationer.
 *
 * Ordningen är LJUDORDNING, inte alfabetisk. Motiveringen står i
 * data/letters.ts: uthållbara ljud och vokaler först, klusiler sist eftersom
 * talsyntesen inte klarar dem isolerat.
 *
 * Varför det spelar roll i siffror, räknat ur ordbanken: efter station 1
 * (S O L A R M) kan eleven läsa åtta ord. Hade stationerna gått alfabetiskt
 * hade hon kunnat läsa ETT ord ("bad") efter två stationer, och de tre första
 * bokstäverna hade varit B, C och D – varav två är klusiler som talsyntesen
 * uttalar fel. Alfabetisk ordning tränas i stället i Övningsbanken, i gruppen
 * "Alfabetet".
 *
 * Station 1 är medvetet den klassiska SALORM-gruppen. Den är större än de
 * andra därför att den måste bära de första riktiga orden – en station som
 * bara låser upp ett par ord går inte att bygga ett pass av.
 *
 * DEN HÄR TABELLEN ÄR SANNINGEN om vilket steg en bokstav hör till.
 * `Letter.step` och ett ords steg härleds ur den (stepForLetter /
 * stepForGraphemes) i stället för att skrivas av för hand – tre kopior av
 * samma indelning glider isär, och när de gör det syns det inte, det yttrar
 * sig bara som att fel innehåll dyker upp i övningarna.
 */
export interface ProgressionStep {
  step: number;
  letters: string[];
  icon: string;
}

export const PROGRESSION_STEPS: ProgressionStep[] = [
  { step: 1, letters: ['s', 'o', 'l', 'a', 'r', 'm'], icon: '☀️' },
  { step: 2, letters: ['i', 'v', 'e', 'n'], icon: '🦌' },
  { step: 3, letters: ['t', 'f', 'ä'], icon: '5️⃣' },
  { step: 4, letters: ['k', 'ö', 'u'], icon: '🐄' },
  { step: 5, letters: ['p', 'å', 'g'], icon: '🐷' },
  { step: 6, letters: ['b', 'd', 'h'], icon: '📖' },
  { step: 7, letters: ['j', 'y', 'c'], icon: '🚲' },
  { step: 8, letters: ['x', 'z', 'w', 'q'], icon: '🏁' },
];

export const MAX_STEP = PROGRESSION_STEPS.length;

const STEG_PER_BOKSTAV: Record<string, number> = Object.fromEntries(
  PROGRESSION_STEPS.flatMap((s) => s.letters.map((id) => [id, s.step]))
);

/** Steget där bokstaven introduceras. MAX_STEP + 1 för okända id:n. */
export function stepForLetter(id: string): number {
  return STEG_PER_BOKSTAV[id] ?? MAX_STEP + 1;
}

/**
 * Lägsta steg där ALLA grafem i ett ord är kända – alltså tidigast när ordet
 * går att ljuda.
 *
 * Grafem är inte alltid en bokstav: banken håller ihop ng, sk, skj, rd, rt och
 * ck till ett ljud. De delas därför upp i sina bokstäver här, för ett ord kan
 * inte läsas förrän varenda bokstav i det är introducerad.
 */
export function stepForGraphemes(graphemes: string[]): number {
  let hogst = 1;
  for (const g of graphemes) {
    for (const bokstav of [...g]) {
      const steg = stepForLetter(bokstav);
      if (steg > hogst) hogst = steg;
    }
  }
  return hogst;
}

export function lettersForStep(step: number): string[] {
  return PROGRESSION_STEPS.find((s) => s.step === step)?.letters ?? [];
}

/** Alla bokstäver som är upplåsta till och med `step`. */
export function unlockedLetters(step: number): string[] {
  return PROGRESSION_STEPS.filter((s) => s.step <= step).flatMap((s) => s.letters);
}
