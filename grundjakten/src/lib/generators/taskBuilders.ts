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
 * Vad eleven faktiskt blir tillfrågad om.
 *
 * Används för att en och samma fråga inte ska ställas två gånger i samma
 * pass. Nyckeln är det eleven SER eller ska svara – inte uppgiftens id, som
 * är slumpat och alltid unikt.
 *
 * `null` betyder "går inte att jämföra" och då sker ingen sållning; hellre
 * en möjlig upprepning än ett pass som tystnar för att nyckeln var fel.
 */
export function fraganI(ex: Exercise): string | null {
  if (ex.kind === 'type-the-word') return `svar:${ex.answer}`;
  if (ex.kind === 'build-word-tiles') return `bygg:${ex.target.join('')}`;
  if (ex.kind === 'build-sentence-cards') return `mening:${ex.target.join(' ')}`;
  if (ex.kind === 'order-items') return `ordning:${ex.target.join(',')}`;
  // wordId täcker Bokstavsresans ordövningar. Att ljuda "sol" och sedan läsa
  // "sol" är två olika uppgifter för den som byggt appen, men samma ord för
  // eleven – och det är eleven regeln gäller.
  if ('wordId' in ex && ex.wordId) return `ord:${ex.wordId}`;
  if ('shownWord' in ex && ex.shownWord) return `ord:${ex.shownWord}`;
  if ('shown' in ex && ex.shown) {
    const s = ex.shown as {
      word?: string; letter?: string; sentence?: string; emoji?: string;
    };
    if (s.word) return `ord:${s.word}`;
    if (s.sentence) return `mening:${s.sentence}`;
    if (s.emoji) return `bild:${s.emoji}`;
    if (s.letter) return `bokstav:${s.letter}`;
  }
  return null;
}

/**
 * Kör en fabrik tills passet är fullt – utan att ställa samma fråga två gånger.
 *
 * Sållningen är hela poängen. Fabriken slumpar fram en fråga i taget och
 * mindes ingenting, så samma ord kunde komma upp flera gånger i samma pass.
 * Läraren såg "fotboll" två gånger, och mätningen gav 46 sådana upprepningar
 * fördelade på elva uppgifter. En elev som redan svarat rätt på ett ord och
 * får det igen tror att hon svarade fel.
 *
 * Passet blir hellre KORTARE än upprepande: "Veckodagar före/efter" har bara
 * sju dagar att fråga om, och då är sju frågor rätt antal, inte åtta med en
 * dubblett. Vakten på `size * 20` försök finns för banker som tar slut.
 */
export function buildPass(
  seed: number,
  size: number,
  factory: (rng: Rng, index: number) => Exercise | null
): Exercise[] {
  const rng = mulberry32(seed);
  const out: Exercise[] = [];
  const stallda = new Set<string>();
  let guard = 0;
  while (out.length < size && guard++ < size * 20) {
    const made = factory(rng, out.length);
    if (!made) continue;
    const nyckel = fraganI(made);
    if (nyckel !== null) {
      if (stallda.has(nyckel)) continue;
      stallda.add(nyckel);
    }
    out.push(made);
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
  make: (item: T, rng: Rng, bank: T[], index: number) => Exercise | null
): Exercise[] {
  const rng = mulberry32(seed);
  const urval = pickN(bank, Math.min(size, bank.length), rng);
  const out: Exercise[] = [];
  const stallda = new Set<string>();

  for (const [index, item] of urval.entries()) {
    const made = make(item, rng, bank, index);
    if (!made) continue;
    // Olika bankposter kan ändå ge SAMMA fråga på skärmen, och det är frågan
    // eleven ser. Två fall fanns på riktigt: [...KORTA_ORD, ...DJUR] har
    // "apa" i båda listorna, och "Adjektiv välj rätt form" hämtade åtta
    // olika adjektiv men slumpade meningsramen separat, så "flera ___ bilar"
    // kunde komma upp fyra gånger.
    const nyckel = fraganI(made);
    if (nyckel !== null) {
      if (stallda.has(nyckel)) continue;
      stallda.add(nyckel);
    }
    out.push(made);
  }
  return out;
}

/** Två slumpmässiga distraktorer ur en lista strängar. */
export function andraOrd(bank: string[], utom: string[], rng: Rng, n = 2): string[] {
  return pickN(bank.filter((o) => !utom.includes(o)), n, rng);
}
