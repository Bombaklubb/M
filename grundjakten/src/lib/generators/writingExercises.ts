import type { Exercise, LevelBand } from '@/types';
import { LETTER_BY_ID } from '@/data/letters';
import { unlockedLetters } from '@/data/progression';
import { wordsUpToStep } from '@/data/words';
import { soundTokenFor } from '@/lib/audio';
import { mulberry32, pick, pickN, shuffle, type Rng } from '@/lib/rng';

const PASS_SIZE = 8;

/**
 * Tryck bokstaven du hör.
 *
 * Det här är appens huvudsakliga "skriva"-övning, och det är ett medvetet
 * val: handskrift på en Chromebook-styrplatta är dålig och utestänger elever
 * med motoriska svårigheter. Tangentbordet är dessutom det verktyg de
 * faktiskt kommer att skriva med.
 *
 * Skärmtangentbordet visar bara upplåsta bokstäver, så valmängden är liten
 * och chansen att lyckas hög.
 */
function makeTypeLetter(letterId: string, unlocked: string[], rng: Rng): Exercise {
  const letter = LETTER_BY_ID[letterId];
  return {
    id: `ex-type-${letterId}-${Math.floor(rng() * 1e6)}`,
    kind: 'type-the-letter',
    module: 'skriva',
    letterId,
    accepts: [letter.lower, letter.upper],
    keyboardLetters: unlocked,
    prompt: { id: `p-type-${letterId}`, text: `Tryck på ${letter.upper}`, lang: 'sv-SE' },
    replay: soundTokenFor(letter),
    xp: 5,
  };
}

/** Bygg ordet av bokstavsbrickor – stavning utan att forma bokstäver. */
function makeBuildWord(step: number, level: LevelBand, rng: Rng): Exercise | null {
  const maxLen = level >= 3 ? 5 : 3;
  const candidates = wordsUpToStep(step).filter((w) => w.graphemes.length <= maxLen);
  if (!candidates.length) return null;
  const word = pick(candidates, rng);
  const unlocked = unlockedLetters(step).filter((id) => !word.graphemes.includes(id));
  const noise = pickN(unlocked, 2, rng);
  return {
    id: `ex-build-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'build-word-tiles',
    module: 'skriva',
    wordId: word.id,
    target: word.graphemes,
    tiles: shuffle([...word.graphemes, ...noise], rng),
    emoji: word.emoji,
    prompt: { id: 'p-build', text: 'Bygg ordet du hör.', lang: 'sv-SE' },
    replay: word.say,
    xp: 5,
  };
}

/** Forma bokstaven. Att spåra själv är alltid frivilligt och bedöms aldrig. */
function makeFormation(letterId: string, rng: Rng): Exercise {
  const letter = LETTER_BY_ID[letterId];
  return {
    id: `ex-form-${letterId}-${Math.floor(rng() * 1e6)}`,
    kind: 'letter-formation',
    module: 'skriva',
    letterId,
    traceOptional: true,
    prompt: { id: `p-form-${letterId}`, text: `Så här skriver man ${letter.upper}`, lang: 'sv-SE' },
    replay: letter.name,
    xp: 5,
  };
}

export type WriteMode = 'type' | 'build' | 'form';

export function generateWritePass(
  mode: WriteMode,
  step: number,
  level: LevelBand,
  seed = Date.now()
): Exercise[] {
  const rng = mulberry32(seed);
  const unlocked = unlockedLetters(step);
  const focus = unlockedLetters(step).filter((id) => LETTER_BY_ID[id]?.step === step);
  const pool = shuffle([...focus, ...focus, ...unlocked], rng);
  const out: Exercise[] = [];

  let guard = 0;
  while (out.length < PASS_SIZE && guard++ < 200) {
    let made: Exercise | null = null;
    if (mode === 'type') made = makeTypeLetter(pick(pool, rng), unlocked, rng);
    else if (mode === 'build') made = makeBuildWord(step, level, rng);
    else made = makeFormation(pick(pool, rng), rng);

    if (made && !out.some((e) => e.id === made!.id)) out.push(made);
  }
  return out;
}
