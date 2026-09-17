import type { Choice, Lang, MicroText, Theme, ThemeWord } from '@/types';
import { segment } from '@/lib/segment';

/**
 * Kompakt sätt att skriva ett tema.
 *
 * Utan det här skulle varje temaord behöva sitt grafem-fält och sitt
 * talsyntes-token för hand – fyra rader per ord, hundratals rader per tema,
 * och en felkälla i varje. Här skrivs ett ord som `['skepp', '⛵']` och
 * resten härleds.
 */

export interface ThemeInput {
  id: string;
  title: string;
  subject: 'NO' | 'SO' | 'engelska';
  icon: string;
  lang?: Lang;
  /** [ord, emoji]. Färdiga teman ska alltid ha bild på varje ord. */
  words: [string, string][];
  microTexts?: {
    sentences: string[];
    /** [fråga, det rätta ordet]. Alternativen byggs ur temats egna ord. */
    questions: [string, string][];
  }[];
}

function makeWord(text: string, emoji: string | null, lang: Lang): ThemeWord {
  return {
    id: `tw-${text.toLowerCase().replace(/\s+/g, '-')}`,
    text,
    emoji,
    graphemes: segment(text),
    lang,
    say: { id: `word-${text.toLowerCase()}`, text, lang },
  };
}

function choicesFor(answer: ThemeWord, pool: ThemeWord[], seed: number): Choice[] {
  const others = pool.filter((w) => w.id !== answer.id && w.emoji);
  // Stabil rotation i stället för slump: frågorna är få per tema, och en
  // deterministisk uppsättning gör temat lätt att granska i lärarläget.
  const wrong = [others[seed % others.length], others[(seed + 3) % others.length]]
    .filter((w, i, arr): w is ThemeWord => Boolean(w) && arr.indexOf(w) === i)
    .slice(0, 2);

  const all: Choice[] = [
    { id: `c-${answer.id}`, emoji: answer.emoji ?? undefined, say: answer.say, correct: true },
    ...wrong.map((w) => ({
      id: `c-${w.id}`,
      emoji: w.emoji ?? undefined,
      say: w.say,
      correct: false,
    })),
  ];

  // Rätt svar ska inte alltid ligga först.
  const shift = seed % all.length;
  return [...all.slice(shift), ...all.slice(0, shift)];
}

export function defineTheme(input: ThemeInput): Theme {
  const lang: Lang = input.lang ?? 'sv-SE';
  const words = input.words.map(([text, emoji]) => makeWord(text, emoji, lang));

  const microTexts: MicroText[] = (input.microTexts ?? []).map((mt, mi) => {
    const body = mt.sentences.join(' ');
    return {
      id: `${input.id}-mt${mi + 1}`,
      sentences: mt.sentences,
      say: { id: `mt-${input.id}-${mi}`, text: body, lang },
      questions: mt.questions.map(([ask, answerText], qi) => {
        const answer =
          words.find((w) => w.text.toLowerCase() === answerText.toLowerCase()) ?? words[0];
        return {
          id: `${input.id}-mt${mi + 1}-q${qi + 1}`,
          ask: { id: `ask-${input.id}-${mi}-${qi}`, text: ask, lang },
          choices: choicesFor(answer, words, mi * 3 + qi),
        };
      }),
    };
  });

  return {
    id: input.id,
    title: input.title,
    subject: input.subject,
    icon: input.icon,
    lang,
    origin: 'curated',
    words,
    microTexts,
  };
}
