import { useEffect, useState } from 'react';
import type { ReadSentenceEx } from '@/types';
import { play } from '@/lib/audio';
import { cn } from '@/lib/utils';

/**
 * Läs meningen.
 *
 * Bedöms inte, precis som att forma en bokstav. Eleven trycker på ett ord i
 * taget för att höra det – det är själva stödstrukturen: hon kan ta sig
 * igenom meningen i sin egen takt utan att någon rättar henne.
 *
 * På nivå 1–2 läses meningen upp direkt, eftersom eleven inte avkodar än.
 * På nivå 3+ är den tyst tills eleven själv ber om ljudet, annars vore det
 * ingen läsning.
 */
export function ReadSentence({
  exercise,
  onAnswer,
  locked,
}: {
  exercise: ReadSentenceEx;
  onAnswer: (correct: boolean) => void;
  locked: boolean;
}) {
  const [heard, setHeard] = useState<number[]>([]);

  useEffect(() => {
    setHeard([]);
    if (!exercise.autoRead) return;
    const timer = window.setTimeout(() => void play(exercise.whole), 900);
    return () => window.clearTimeout(timer);
  }, [exercise.id, exercise.autoRead, exercise.whole]);

  const tapWord = (i: number) => {
    void play(exercise.wordTokens[i]);
    setHeard((h) => (h.includes(i) ? h : [...h, i]));
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex max-w-4xl flex-wrap items-end justify-center gap-x-3 gap-y-4">
        {exercise.words.map((word, i) => (
          <button
            key={`${word}-${i}`}
            type="button"
            aria-label={`Lyssna på ordet ${word}`}
            onClick={() => tapWord(i)}
            className={cn(
              'reading rounded-tile px-3 py-2 text-6xl font-bold leading-none transition-colors',
              heard.includes(i)
                ? 'bg-aqua-100 text-aqua-700'
                : 'text-ink-900 hover:bg-ink-100 dark:text-ink-50 dark:hover:bg-ink-800'
            )}
          >
            {word}
          </button>
        ))}
        <span className="reading text-6xl font-bold leading-none" aria-hidden>.</span>
      </div>

      <button
        type="button"
        aria-label="Klar, gå vidare"
        disabled={locked}
        onClick={() => onAnswer(true)}
        className="btn-pop grid h-20 w-40 place-items-center rounded-tile border-lime-700
                   bg-lime-500 text-4xl text-white"
      >
        <span aria-hidden>✓</span>
      </button>
    </div>
  );
}
