import type { Choice, Exercise, Lang, QuizEx, SpeechToken } from '@/types';
import { mulberry32, pickN, shuffle, type Rng } from '@/lib/rng';

/**
 * Hjälpare som gör om ordbankerna till övningar.
 *
 * Målet är att en uppgift i katalogen ska vara en till tre rader. All
 * upprepning – tala-token, blandning, distraktorer, passtorlek – ligger här,
 * så att den som lägger till "Skriv ordet – Frukter" bara behöver en ordlista.
 */

export const PASS = 8;

export function sv(id: string, text: string, lang: Lang = 'sv-SE'): SpeechToken {
  return { id, text, lang };
}

let counter = 0;
/** Unikt id per övning. Kön kräver att två uppgifter aldrig delar id. */
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

interface ChoiceInput {
  word?: string;
  emoji?: string;
  letter?: string;
  /** Det som sägs. Standard är ordet, bokstaven eller emoji-namnet. */
  say?: string;
}

function toChoice(input: ChoiceInput, correct: boolean, lang: Lang): Choice {
  const label = input.say ?? input.word ?? input.letter ?? '';
  return {
    id: `c-${input.word ?? input.letter ?? input.emoji ?? label}-${correct ? 'r' : 'f'}`,
    word: input.word,
    emoji: input.emoji,
    letter: input.letter,
    say: sv(`say-${label.toLowerCase()}`, label, lang),
    correct,
  };
}

export interface QuizInput {
  prompt: string;
  /** Det öronknappen upprepar. Standard är instruktionen. */
  replay?: string;
  shown?: QuizEx['shown'];
  ratt: ChoiceInput;
  fel: ChoiceInput[];
  lang?: Lang;
  compact?: boolean;
}

export function quiz(input: QuizInput, rng: Rng): Exercise {
  const lang = input.lang ?? 'sv-SE';
  const choices = shuffle(
    [toChoice(input.ratt, true, lang), ...input.fel.map((f) => toChoice(f, false, lang))],
    rng
  );
  return {
    id: uid('q'),
    kind: 'quiz',
    module: 'ovningsbank',
    shown: input.shown,
    choices,
    compact: input.compact ?? choices.length <= 2,
    prompt: sv(`p-${input.prompt}`, input.prompt, lang),
    replay: sv(`r-${input.replay ?? input.prompt}`, input.replay ?? input.prompt, lang),
    xp: 5,
  };
}

export interface TypeWordInput {
  prompt: string;
  answer: string;
  /** Extra godtagna svar utöver answer, i gemener. */
  ocksa?: string[];
  emoji?: string;
  sentence?: string;
  digits?: boolean;
  lang?: Lang;
  /** Det öronknappen upprepar. Standard är svaret – eleven ska höra ordet. */
  replay?: string;
}

export function typeWord(input: TypeWordInput): Exercise {
  const lang = input.lang ?? 'sv-SE';
  return {
    id: uid('t'),
    kind: 'type-the-word',
    module: 'ovningsbank',
    answer: input.answer,
    accept: [input.answer.toLowerCase(), ...(input.ocksa ?? []).map((a) => a.toLowerCase())],
    emoji: input.emoji,
    sentence: input.sentence,
    digits: input.digits,
    prompt: sv(`p-${input.prompt}`, input.prompt, lang),
    replay: sv(`r-${input.replay ?? input.answer}`, input.replay ?? input.answer, lang),
    xp: 5,
  };
}

export function orderItems(prompt: string, target: string[], rng: Rng, lang: Lang = 'sv-SE'): Exercise {
  return {
    id: uid('o'),
    kind: 'order-items',
    module: 'ovningsbank',
    target,
    items: shuffle(target, rng),
    prompt: sv(`p-${prompt}`, prompt, lang),
    replay: sv(`p-${prompt}`, prompt, lang),
    xp: 5,
  };
}

/**
 * Kör en fabrik tills passet är fullt.
 *
 * Fabriken får returnera null när den inte kan bygga något meningsfullt av
 * den post den råkade få – samma regel som i de andra generatorerna: hellre
 * ett kortare pass än en halvfylld uppgift.
 */
export function buildPass(
  seed: number,
  size: number,
  factory: (rng: Rng, index: number) => Exercise | null
): Exercise[] {
  const rng = mulberry32(seed);
  const out: Exercise[] = [];
  let guard = 0;
  while (out.length < size && guard++ < size * 20) {
    const made = factory(rng, out.length);
    if (made) out.push(made);
  }
  return out;
}

/**
 * Bygger ett pass genom att gå igenom en bank utan upprepning.
 *
 * Det här är standardfallet: en uppgift som "Motsatsord 1" ska ta olika ord
 * varje gång, men aldrig samma ord två gånger i samma pass.
 */
export function buildFromBank<T>(
  seed: number,
  bank: T[],
  size: number,
  make: (item: T, rng: Rng, bank: T[]) => Exercise | null
): Exercise[] {
  const rng = mulberry32(seed);
  const urval = pickN(bank, Math.min(size, bank.length), rng);
  const out: Exercise[] = [];
  for (const item of urval) {
    const made = make(item, rng, bank);
    if (made) out.push(made);
  }
  return out;
}

/** Två slumpmässiga distraktorer ur en lista strängar. */
export function andraOrd(bank: string[], utom: string[], rng: Rng, n = 2): string[] {
  return pickN(bank.filter((o) => !utom.includes(o)), n, rng);
}
