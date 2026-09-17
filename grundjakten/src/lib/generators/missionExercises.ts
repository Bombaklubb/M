import type { Choice, Exercise, LevelBand, SpeechToken } from '@/types';
import {
  ANIMALS, PLACES, SENTENCE_TEMPLATES, THINGS,
  type BankId, type BankWord, type NounWord,
} from '@/data/sentences';
import { picturableWords, wordsUpToStep } from '@/data/words';
import { LETTER_BY_ID } from '@/data/letters';
import { soundTokenFor } from '@/lib/audio';
import { mulberry32, pick, pickN, shuffle, type Rng } from '@/lib/rng';

/**
 * Dagens uppdrag.
 *
 * Fem steg som alltid har samma form och samma ikoner, men vars svårighet
 * följer elevens nivåband. Det är avsiktligt: eleven ska känna igen
 * uppdraget från dag till dag även när innehållet växer med henne.
 *
 *   1. Läs ordet      – avkodning (eller ljudning på lägre nivå)
 *   2. Välj rätt bild  – ord ↔ bild
 *   3. Läs meningen    – meningsläsning, bedöms inte
 *   4. Svara           – läsförståelse
 *   5. Skriv           – bygg meningen av ordkort
 *
 * Allt genereras ur data som redan finns. Inga handskrivna uppdrag.
 */

function sv(id: string, text: string, rate?: number): SpeechToken {
  return { id, text, lang: 'sv-SE', rate };
}

const STEP_LABELS = {
  read: 'Läs ordet',
  picture: 'Välj rätt bild',
  sentence: 'Läs meningen',
  answer: 'Svara',
  write: 'Skriv',
} as const;

function bankOf(id: BankId): (BankWord | NounWord)[] {
  if (id === 'place') return PLACES;
  if (id === 'thing') return THINGS;
  return ANIMALS;
}

/** "en boll" blir två kort, inte ett. Därför expanderas till en ordlista. */
function expandSlot(word: BankWord | NounWord): string[] {
  return 'article' in word ? [word.article, word.text] : [word.text];
}

interface BuiltSentence {
  words: string[];
  text: string;
  question: string;
  answer: BankWord | NounWord;
  answerBank: BankId;
}

function buildSentence(rng: Rng): BuiltSentence {
  const template = pick(SENTENCE_TEMPLATES, rng);
  const chosen: Partial<Record<BankId, BankWord | NounWord>> = {};

  const words: string[] = [];
  for (const part of template.parts) {
    const slot = part.match(/^\{(place|thing|animal)\}$/);
    if (!slot) {
      words.push(part);
      continue;
    }
    const bank = slot[1] as BankId;
    // Samma bank kan förekomma två gånger i en mall – då ska det vara samma ord.
    const word = chosen[bank] ?? pick(bankOf(bank), rng);
    chosen[bank] = word;
    words.push(...expandSlot(word));
  }

  // Meningen börjar med stor bokstav oavsett om första ordet är "Leo" eller "en".
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  const answer = chosen[template.askBank] ?? pick(bankOf(template.askBank), rng);
  return {
    words,
    text: words.join(' ') + '.',
    question: template.question,
    answer,
    answerBank: template.askBank,
  };
}

/** Uppdrag 1 – Läs ordet. Avkodning på nivå 3+, ljudning under det. */
function stepReadWord(step: number, level: LevelBand, rng: Rng): Exercise | null {
  // Bara MÅLORDET måste ligga på elevens steg. Distraktorerna är bilder som
  // eleven aldrig läser, så de får hämtas ur hela ordbanken – annars går
  // steg 1 inte att bygga alls, eftersom bara "sol" har bild där.
  const pool = picturableWords(step);
  if (pool.length === 0) return null;
  const word = pick(pool, rng);
  const wrong = pickN(picturableWords(8).filter((w) => w.id !== word.id), 2, rng);
  if (wrong.length < 2) return null;

  const choices: Choice[] = shuffle(
    [
      { id: `c-${word.id}`, emoji: word.emoji!, say: word.say, correct: true },
      ...wrong.map((w) => ({ id: `c-${w.id}`, emoji: w.emoji!, say: w.say, correct: false })),
    ],
    rng
  );

  if (level >= 3) {
    return {
      id: `m-read-${word.id}-${Math.floor(rng() * 1e6)}`,
      kind: 'read-word-pick-picture',
      module: 'uppdrag',
      label: STEP_LABELS.read,
      wordId: word.id,
      shownWord: word.text,
      choices,
      prompt: sv('p-m-read', 'Läs ordet. Vilken bild är det?'),
      replay: sv('p-m-read', 'Läs ordet. Vilken bild är det?'),
      xp: 5,
    };
  }

  // Under nivå 3 kan eleven inte avkoda ännu – då ljudar appen ordet i stället.
  return {
    id: `m-blend-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'blend-word',
    module: 'uppdrag',
    label: STEP_LABELS.read,
    wordId: word.id,
    parts: word.graphemes.map((g) => {
      const letter = LETTER_BY_ID[g];
      return letter ? soundTokenFor(letter) : sv(`g-${g}`, g, 0.55);
    }),
    choices,
    prompt: sv('p-m-blend', 'Ljuda ihop ordet. Vilken bild blir det?'),
    replay: word.say,
    xp: 5,
  };
}

/** Uppdrag 2 – Välj rätt bild. Fungerar på alla nivåer, inget läsande. */
function stepPickPicture(sentence: BuiltSentence, rng: Rng): Exercise | null {
  const bank = bankOf(sentence.answerBank);
  const wrong = pickN(bank.filter((w) => w.text !== sentence.answer.text), 2, rng);
  if (wrong.length < 2) return null;

  const choices: Choice[] = shuffle(
    [
      {
        id: `c-${sentence.answer.text}`,
        emoji: sentence.answer.emoji,
        say: sv(`word-${sentence.answer.text}`, sentence.answer.text),
        correct: true,
      },
      ...wrong.map((w) => ({
        id: `c-${w.text}`,
        emoji: w.emoji,
        say: sv(`word-${w.text}`, w.text),
        correct: false,
      })),
    ],
    rng
  );

  return {
    id: `m-pic-${sentence.answer.text}-${Math.floor(rng() * 1e6)}`,
    kind: 'listen-pick-picture',
    module: 'uppdrag',
    label: STEP_LABELS.picture,
    choices,
    prompt: sv(`p-m-pic-${sentence.answer.text}`, `Vilken bild visar ${sentence.answer.text}?`),
    replay: sv(`word-${sentence.answer.text}`, sentence.answer.text),
    xp: 5,
  };
}

/** Uppdrag 3 – Läs meningen. Bedöms inte. */
function stepReadSentence(sentence: BuiltSentence, level: LevelBand, rng: Rng): Exercise {
  return {
    id: `m-sent-${Math.floor(rng() * 1e6)}`,
    kind: 'read-sentence',
    module: 'uppdrag',
    label: STEP_LABELS.sentence,
    words: sentence.words,
    whole: sv(`sent-${sentence.text}`, sentence.text),
    wordTokens: sentence.words.map((w) => sv(`word-${w.toLowerCase()}`, w)),
    // Nivå 1–2 får meningen uppläst direkt; nivå 3+ ska försöka själv först.
    autoRead: level < 3,
    prompt: sv('p-m-sent', 'Läs meningen. Tryck på ett ord för att höra det.'),
    replay: sv(`sent-${sentence.text}`, sentence.text),
    xp: 5,
  };
}

/** Uppdrag 4 – Svara på frågan. Meningen står kvar på skärmen. */
function stepAnswer(sentence: BuiltSentence, rng: Rng): Exercise | null {
  const bank = bankOf(sentence.answerBank);
  const wrong = pickN(bank.filter((w) => w.text !== sentence.answer.text), 2, rng);
  if (wrong.length < 2) return null;

  const choices: Choice[] = shuffle(
    [
      {
        id: `a-${sentence.answer.text}`,
        emoji: sentence.answer.emoji,
        say: sv(`word-${sentence.answer.text}`, sentence.answer.text),
        correct: true,
      },
      ...wrong.map((w) => ({
        id: `a-${w.text}`,
        emoji: w.emoji,
        say: sv(`word-${w.text}`, w.text),
        correct: false,
      })),
    ],
    rng
  );

  return {
    id: `m-ans-${Math.floor(rng() * 1e6)}`,
    kind: 'sentence-question',
    module: 'uppdrag',
    label: STEP_LABELS.answer,
    sentence: sentence.text,
    choices,
    prompt: sv(`p-m-ans-${sentence.question}`, sentence.question),
    replay: sv(`p-m-ans-${sentence.question}`, sentence.question),
    xp: 5,
  };
}

/**
 * Uppdrag 5 – Skriv.
 *
 * Nivå 3+ bygger hela meningen av ordkort, med punkten som eget kort. Under
 * det bygger eleven ett ord av bokstavsbrickor i stället – att sortera sex
 * ordkort kräver en läsförmåga hon inte har än.
 */
function stepWrite(sentence: BuiltSentence, step: number, level: LevelBand, rng: Rng): Exercise | null {
  if (level >= 3) {
    const target = [...sentence.words, '.'];
    // En eller två distraktorer, men aldrig ord som redan finns i meningen –
    // då skulle två kort se identiska ut och eleven gissa i onödan.
    const noise = pickN(
      ['och', 'inte', 'stor', 'sedan', 'här'].filter((w) => !sentence.words.includes(w)),
      target.length <= 4 ? 1 : 2,
      rng
    );
    return {
      id: `m-write-${Math.floor(rng() * 1e6)}`,
      kind: 'build-sentence-cards',
      module: 'uppdrag',
      label: STEP_LABELS.write,
      target,
      cards: shuffle([...target, ...noise], rng),
      emoji: sentence.answer.emoji,
      prompt: sv('p-m-write', 'Bygg meningen. Stor bokstav först och punkt sist.'),
      replay: sv(`sent-${sentence.text}`, sentence.text),
      xp: 5,
    };
  }

  const candidates = wordsUpToStep(step).filter((w) => w.graphemes.length <= 3);
  if (!candidates.length) return null;
  const word = pick(candidates, rng);
  const noise = pickN(
    ['s', 'o', 'l', 'a', 'r', 'm'].filter((g) => !word.graphemes.includes(g)),
    2,
    rng
  );
  return {
    id: `m-buildw-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'build-word-tiles',
    module: 'uppdrag',
    label: STEP_LABELS.write,
    wordId: word.id,
    target: word.graphemes,
    tiles: shuffle([...word.graphemes, ...noise], rng),
    emoji: word.emoji,
    prompt: sv('p-m-buildw', 'Bygg ordet du hör.'),
    replay: word.say,
    xp: 5,
  };
}

/**
 * Bygger dagens uppdrag.
 *
 * Uppdrag 2–5 delar SAMMA mening, så eleven möter ordet i bild, i mening, i
 * fråga och i bygge. Det är avsikten: fyra möten med samma ord på fem minuter
 * gör mer för ordförrådet än fem lösryckta övningar.
 *
 * Returnerar färre än fem steg hellre än ett halvfyllt – samma regel som i
 * de andra generatorerna.
 */
export function generateMission(step: number, level: LevelBand, seed = Date.now()): Exercise[] {
  const rng = mulberry32(seed);
  const sentence = buildSentence(rng);

  const steps = [
    stepReadWord(step, level, rng),
    stepPickPicture(sentence, rng),
    stepReadSentence(sentence, level, rng),
    stepAnswer(sentence, rng),
    stepWrite(sentence, step, level, rng),
  ];

  return steps.filter((s): s is Exercise => s !== null);
}
