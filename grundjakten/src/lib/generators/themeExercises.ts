import type { Choice, Exercise, ExerciseKind, LevelBand, Theme, ThemeWord } from '@/types';
import { generateLetterPass } from './letterExercises';
import { mulberry32, pick, pickN, shuffle, type Rng } from '@/lib/rng';

/**
 * Klassens tema.
 *
 * Eleven arbetar med SAMMA ord som resten av klassen, men via lyssna-och-peka,
 * bildstöd och ordbygge i stället för löpande text. Det är hela svaret på
 * frågan "vad gör hon när de andra läser".
 *
 * Två regler styr generatorn:
 *
 *  1. Ett ord utan bild tas inte bort – det får bara färre övningstyper.
 *     Egna teman där läraren inte hittat en emoji ska fortfarande fungera.
 *  2. Ett pass är inte bara tema. Tre av åtta uppgifter hämtas från elevens
 *     vanliga bokstavsspår, så fonikträningen fortsätter även under SO-passet
 *     och ett tema med sex ord inte blir repetitivt på fem minuter.
 */

const PASS_SIZE = 8;
const THEME_ITEMS = 5;

/** Övningstyper ett enskilt ord klarar av, givet bild och nivå. */
export function kindsForWord(word: ThemeWord, level: LevelBand): ExerciseKind[] {
  // Kräver aldrig bild: eleven hör ordet och bygger det av brickor.
  const kinds: ExerciseKind[] = ['build-word-tiles'];

  if (word.emoji) {
    kinds.push('listen-pick-picture');
    if (level >= 3) kinds.push('read-word-pick-picture', 'word-picture-pair');
  }
  return kinds;
}

function pictureChoices(answer: ThemeWord, pool: ThemeWord[], rng: Rng): Choice[] | null {
  const others = pool.filter((w) => w.id !== answer.id && w.emoji);
  const wrong = pickN(others, 2, rng);
  // Hellre ingen övning än en med tomma rutor.
  if (wrong.length < 2) return null;

  return shuffle(
    [
      { id: `c-${answer.id}`, emoji: answer.emoji ?? undefined, say: answer.say, correct: true },
      ...wrong.map((w) => ({
        id: `c-${w.id}`,
        emoji: w.emoji ?? undefined,
        say: w.say,
        correct: false,
      })),
    ],
    rng
  );
}

function makeListenPick(theme: Theme, word: ThemeWord, rng: Rng): Exercise | null {
  const choices = pictureChoices(word, theme.words, rng);
  if (!choices) return null;
  return {
    id: `th-lp-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'listen-pick-picture',
    module: 'tema',
    choices,
    prompt: {
      id: `p-th-lp-${word.id}`,
      text: theme.lang === 'en-GB' ? `Which picture shows ${word.text}?` : `Vilken bild visar ${word.text}?`,
      lang: theme.lang,
    },
    replay: word.say,
    xp: 5,
  };
}

function makeReadWord(theme: Theme, word: ThemeWord, rng: Rng): Exercise | null {
  const choices = pictureChoices(word, theme.words, rng);
  if (!choices) return null;
  return {
    id: `th-rw-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'read-word-pick-picture',
    module: 'tema',
    wordId: word.id,
    shownWord: word.text,
    choices,
    prompt: {
      id: 'p-th-rw',
      text: theme.lang === 'en-GB' ? 'Read the word. Which picture is it?' : 'Läs ordet. Vilken bild är det?',
      lang: theme.lang,
    },
    replay: {
      id: 'p-th-rw',
      text: theme.lang === 'en-GB' ? 'Read the word. Which picture is it?' : 'Läs ordet. Vilken bild är det?',
      lang: theme.lang,
    },
    xp: 5,
  };
}

function makeBuildWord(theme: Theme, word: ThemeWord, rng: Rng): Exercise | null {
  // Långa temaord blir en oöverskådlig radda brickor. Håll dem korta.
  if (word.graphemes.length > 6) return null;
  const otherGraphemes = theme.words
    .flatMap((w) => w.graphemes)
    .filter((g) => !word.graphemes.includes(g));
  const noise = pickN([...new Set(otherGraphemes)], 2, rng);

  return {
    id: `th-bw-${word.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'build-word-tiles',
    module: 'tema',
    wordId: word.id,
    target: word.graphemes,
    tiles: shuffle([...word.graphemes, ...noise], rng),
    emoji: word.emoji,
    prompt: {
      id: 'p-th-bw',
      text: theme.lang === 'en-GB' ? 'Build the word you hear.' : 'Bygg ordet du hör.',
      lang: theme.lang,
    },
    replay: word.say,
    xp: 5,
  };
}

/** Para ihop tre ord med tre bilder. Tränar temaorden som ordbilder. */
function makePairs(theme: Theme, rng: Rng): Exercise | null {
  const withPictures = theme.words.filter((w) => w.emoji);
  if (withPictures.length < 3) return null;
  const chosen = pickN(withPictures, 3, rng);

  return {
    id: `th-pair-${Math.floor(rng() * 1e6)}`,
    kind: 'word-picture-pair',
    module: 'tema',
    pairs: chosen.map((w) => ({
      id: w.id,
      word: w.text,
      emoji: w.emoji!,
      say: w.say,
    })),
    prompt: {
      id: 'p-th-pair',
      text: theme.lang === 'en-GB' ? 'Match the word to the picture.' : 'Para ihop ordet med bilden.',
      lang: theme.lang,
    },
    replay: {
      id: 'p-th-pair',
      text: theme.lang === 'en-GB' ? 'Match the word to the picture.' : 'Para ihop ordet med bilden.',
      lang: theme.lang,
    },
    xp: 5,
  };
}

/** Uppläst minitext med bildfrågor. Kräver nivå 4. */
function makeMicroText(theme: Theme, rng: Rng): Exercise | null {
  if (theme.microTexts.length === 0) return null;
  const text = pick(theme.microTexts, rng);
  if (text.questions.length === 0) return null;

  return {
    id: `th-mt-${text.id}-${Math.floor(rng() * 1e6)}`,
    kind: 'micro-text',
    module: 'tema',
    themeId: theme.id,
    text,
    prompt: {
      id: `p-th-mt`,
      text: theme.lang === 'en-GB' ? 'Listen to the text.' : 'Lyssna på texten.',
      lang: theme.lang,
    },
    replay: text.say,
    xp: 5,
  };
}

export type ThemeMode = 'lyssna' | 'para' | 'text';

/**
 * Bygger ett temapass.
 *
 * `mode` motsvarar de tre korten på temaskärmen. Returnerar en tom lista om
 * temat inte räcker till läget – anroparen visar då inte kortet alls, i
 * stället för att låta eleven trycka på något som leder till en tom skärm.
 */
export function generateThemePass(
  theme: Theme,
  mode: ThemeMode,
  step: number,
  level: LevelBand,
  seed = Date.now()
): Exercise[] {
  const rng = mulberry32(seed);
  const out: Exercise[] = [];

  if (mode === 'text') {
    const mt = makeMicroText(theme, rng);
    if (!mt) return [];
    out.push(mt);
    // En minitext ensam är ett för kort pass. Fyll på med ordövningar från
    // samma tema, så eleven möter textens ord igen direkt efteråt.
    let guard = 0;
    while (out.length < 4 && guard++ < 60) {
      const word = pick(theme.words, rng);
      const made = word.emoji ? makeListenPick(theme, word, rng) : makeBuildWord(theme, word, rng);
      if (made && !out.some((e) => e.id === made.id)) out.push(made);
    }
    return out;
  }

  if (mode === 'para') {
    let guard = 0;
    while (out.length < 4 && guard++ < 40) {
      const made = makePairs(theme, rng);
      if (!made) break;
      out.push(made);
    }
    return out;
  }

  // 'lyssna' – temats huvudläge. Fem temaord, sedan tre från bokstavsspåret.
  let guard = 0;
  while (out.length < THEME_ITEMS && guard++ < 120) {
    const word = pick(theme.words, rng);
    const kinds = kindsForWord(word, level);
    const kind = pick(kinds, rng);

    let made: Exercise | null = null;
    if (kind === 'listen-pick-picture') made = makeListenPick(theme, word, rng);
    else if (kind === 'read-word-pick-picture') made = makeReadWord(theme, word, rng);
    else if (kind === 'build-word-tiles') made = makeBuildWord(theme, word, rng);
    else if (kind === 'word-picture-pair') made = makePairs(theme, rng);

    if (made && !out.some((e) => e.id === made!.id)) out.push(made);
  }

  // Fonikträningen ska inte pausas för att eleven jobbar med SO.
  const letters = generateLetterPass(step, level, seed + 1).slice(0, PASS_SIZE - out.length);
  return [...out, ...letters];
}
