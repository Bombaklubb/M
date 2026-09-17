import type { Choice, Exercise, LevelBand, SpeechToken, WordEntry } from '@/types';
import { LETTERS, LETTER_BY_ID } from '@/data/letters';
import { unlockedLetters } from '@/data/progression';
import { wordsUpToStep, picturableWords } from '@/data/words';
import { SIGHT_WORDS } from '@/data/sightWords';
import { hasIsolatedSound, soundTokenFor } from '@/lib/audio';
import { mulberry32, pick, pickN, shuffle, type Rng } from '@/lib/rng';

const PASS_SIZE = 8;

function sv(id: string, text: string, rate?: number): SpeechToken {
  return { id, text, lang: 'sv-SE', rate };
}

function letterChoice(id: string, correct: boolean): Choice {
  const letter = LETTER_BY_ID[id];
  return {
    id: `c-${id}`,
    letter: letter.upper,
    say: letter.name,
    correct,
  };
}

function wordChoice(w: WordEntry, correct: boolean, withEmoji: boolean): Choice {
  return {
    id: `c-${w.id}`,
    word: withEmoji ? undefined : w.text,
    emoji: withEmoji ? (w.emoji ?? undefined) : undefined,
    say: w.say,
    correct,
  };
}

/**
 * Hör ljudet, välj bokstaven.
 *
 * Genereras BARA för bokstäver där hasIsolatedSound() är sant. För klusiler
 * finns inget pålitligt isolerat fonem i v1, och att generera övningen ändå
 * skulle innebära att eleven tränar på ett ljud som är fel. Se lib/audio.ts.
 */
function makeSoundMatch(letterId: string, pool: string[], rng: Rng): Exercise | null {
  const letter = LETTER_BY_ID[letterId];
  if (!hasIsolatedSound(letter)) return null;
  const others = pickN(pool.filter((id) => id !== letterId), 2, rng);
  if (others.length < 2) return null;
  const choices = shuffle(
    [letterChoice(letterId, true), ...others.map((id) => letterChoice(id, false))],
    rng
  );
  return {
    id: `ex-snd-${letterId}-${Math.floor(rng() * 1e6)}`,
    kind: 'letter-sound-match',
    module: 'bokstaver',
    letterId,
    choices,
    prompt: sv(`p-snd-${letterId}`, 'Vilken bokstav låter så här?'),
    replay: soundTokenFor(letter),
    xp: 5,
  };
}

/**
 * Se bokstaven, välj bilden som börjar på den.
 *
 * Det här är arbetshästen för klusilerna: den fungerar perfekt för B, D, G,
 * K, P och T utan att något isolerat fonem behövs.
 */
function makePictureMatch(letterId: string, step: number, rng: Rng): Exercise | null {
  const letter = LETTER_BY_ID[letterId];
  const pool = picturableWords(step);
  const matching = pool.filter((w) => w.graphemes[0] === letterId);
  // Nyckelordet duger som korrekt alternativ när inget ord i banken passar.
  const correctWord: { text: string; emoji: string; say: SpeechToken } =
    matching.length > 0
      ? { text: matching[0].text, emoji: matching[0].emoji!, say: matching[0].say }
      : { text: letter.keyword.word, emoji: letter.keyword.emoji, say: letter.keyword.wordOnly };

  // Samma sak här: distraktorbilderna läses aldrig, så de får komma från hela
  // ordbanken. De får bara inte råka börja på samma bokstav som svaret.
  const wrong = pickN(
    picturableWords(8).filter((w) => w.graphemes[0] !== letterId),
    2,
    rng
  );
  if (wrong.length < 2) return null;

  const choices = shuffle(
    [
      { id: `c-${correctWord.text}`, emoji: correctWord.emoji, say: correctWord.say, correct: true },
      ...wrong.map((w) => ({ id: `c-${w.id}`, emoji: w.emoji!, say: w.say, correct: false })),
    ],
    rng
  );
  return {
    id: `ex-pic-${letterId}-${Math.floor(rng() * 1e6)}`,
    kind: 'letter-picture-match',
    module: 'bokstaver',
    letterId,
    choices,
    prompt: sv(`p-pic-${letterId}`, `Vilken bild börjar på ${letter.upper}?`),
    replay: sv(`p-pic-${letterId}`, `Vilken bild börjar på ${letter.upper}?`),
    xp: 5,
  };
}

/** Ljuda ihop: appen säger s… o… l… och eleven väljer bilden. */
function makeBlend(word: WordEntry, rng: Rng): Exercise | null {
  if (!word.emoji) return null;
  // Distraktorerna är bilder eleven aldrig läser, så de behöver inte ligga på
  // hennes steg. Att begränsa dem gjorde tidiga steg nästan obyggbara.
  const wrong = pickN(picturableWords(8).filter((w) => w.id !== word.id), 2, rng);
  if (wrong.length < 2) return null;

  const parts = word.graphemes.map((g) => {
    const letter = LETTER_BY_ID[g];
    return letter ? soundTokenFor(letter) : sv(`g-${g}`, g, 0.55);
  });

  return {
    id: `ex-blend-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'blend-word',
    module: 'bokstaver',
    wordId: word.id,
    parts,
    choices: shuffle(
      [wordChoice(word, true, true), ...wrong.map((w) => wordChoice(w, false, true))],
      rng
    ),
    prompt: sv(`p-blend-${word.id}`, 'Ljuda ihop ordet. Vilken bild blir det?'),
    replay: word.say,
    xp: 5,
  };
}

/** Läs ordet själv – ordet SÄGS inte förrän eleven svarat. */
function makeReadWord(word: WordEntry, rng: Rng): Exercise | null {
  if (!word.emoji) return null;
  const wrong = pickN(picturableWords(8).filter((w) => w.id !== word.id), 2, rng);
  if (wrong.length < 2) return null;
  return {
    id: `ex-read-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'read-word-pick-picture',
    module: 'bokstaver',
    wordId: word.id,
    shownWord: word.text,
    choices: shuffle(
      [wordChoice(word, true, true), ...wrong.map((w) => wordChoice(w, false, true))],
      rng
    ),
    prompt: sv(`p-read`, 'Vilket ord står här? Välj rätt bild.'),
    // Öronknappen upprepar INSTRUKTIONEN, inte svaret – annars vore det ingen läsning.
    replay: sv(`p-read`, 'Vilket ord står här? Välj rätt bild.'),
    xp: 5,
  };
}

/** Ordbild: hör ordet, välj rätt skriven form bland lika ord. */
function makeSightWord(rng: Rng): Exercise | null {
  const target = pick(SIGHT_WORDS, rng);
  const wrong = pickN(SIGHT_WORDS.filter((w) => w.id !== target.id), 2, rng);
  if (wrong.length < 2) return null;
  return {
    id: `ex-sight-${target.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'sight-word-pick',
    module: 'bokstaver',
    wordId: target.id,
    choices: shuffle(
      [wordChoice(target, true, false), ...wrong.map((w) => wordChoice(w, false, false))],
      rng
    ),
    prompt: sv('p-sight', 'Vilket ord hör du?'),
    replay: target.say,
    xp: 5,
  };
}

/**
 * Bygger ett pass på 8 uppgifter för Bokstäver.
 *
 * Övningstyperna viktas efter nivåband: band 1 är bara igenkänning, band 2
 * lägger till ljudning, band 3 riktig avkodning och ordbilder.
 */
export function generateLetterPass(step: number, level: LevelBand, seed = Date.now()): Exercise[] {
  const rng = mulberry32(seed);
  const unlocked = unlockedLetters(step);
  const words = wordsUpToStep(step);
  const out: Exercise[] = [];

  // Bokstäverna från det aktuella steget viktas upp – det är dem eleven jobbar på.
  const focus = LETTERS.filter((l) => l.step === step).map((l) => l.id);
  const letterPool = shuffle([...focus, ...focus, ...unlocked], rng);

  let guard = 0;
  while (out.length < PASS_SIZE && guard++ < 200) {
    const roll = rng();
    let made: Exercise | null = null;

    if (level === 1) {
      made = roll < 0.5
        ? makeSoundMatch(pick(letterPool, rng), unlocked, rng)
        : makePictureMatch(pick(letterPool, rng), step, rng);
    } else if (level === 2) {
      if (roll < 0.3) made = makeSoundMatch(pick(letterPool, rng), unlocked, rng);
      else if (roll < 0.6) made = makePictureMatch(pick(letterPool, rng), step, rng);
      else if (words.length) made = makeBlend(pick(words, rng), rng);
    } else {
      if (roll < 0.2) made = makePictureMatch(pick(letterPool, rng), step, rng);
      else if (roll < 0.5 && words.length) made = makeBlend(pick(words, rng), rng);
      else if (roll < 0.8 && words.length) made = makeReadWord(pick(words, rng), rng);
      else made = makeSightWord(rng);
    }

    // Generatorn skickar aldrig ut en övning den inte kunnat fylla helt.
    // Den returnerar hellre färre uppgifter än en med tomma rutor.
    if (made && !out.some((e) => e.id === made!.id)) out.push(made);
  }

  return out;
}
