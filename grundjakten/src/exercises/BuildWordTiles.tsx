import { useEffect, useState } from 'react';
import type { BuildWordTilesEx } from '@/types';
import { cn } from '@/lib/utils';
import { playMiss, playPlace } from '@/lib/sfx';
import { LETTER_BY_ID } from '@/data/letters';
import { play } from '@/lib/audio';

/**
 * Bygg ordet av brickor.
 *
 * KLICK är den primära interaktionen, inte drag: att dra med en
 * Chromebook-styrplatta är svårt och skulle göra övningen till ett test i
 * finmotorik i stället för i stavning. En bricka i fel lucka studsar
 * tillbaka med en mjuk duns – ingen röd markering, inget avdrag.
 */
export function BuildWordTiles({
  exercise,
  onAnswer,
  locked,
}: {
  exercise: BuildWordTilesEx;
  onAnswer: (correct: boolean) => void;
  locked: boolean;
}) {
  const [placed, setPlaced] = useState<(string | null)[]>([]);
  const [used, setUsed] = useState<number[]>([]);
  const [bounce, setBounce] = useState<number | null>(null);

  useEffect(() => {
    setPlaced(Array(exercise.target.length).fill(null));
    setUsed([]);
    setBounce(null);
  }, [exercise.id, exercise.target.length]);

  const nextSlot = placed.findIndex((p) => p === null);

  const tap = (tile: string, index: number) => {
    if (locked || used.includes(index) || nextSlot === -1) return;

    const letter = LETTER_BY_ID[tile];
    if (letter) void play(letter.name);

    if (tile !== exercise.target[nextSlot]) {
      // Fel bricka: studsa tillbaka, säg ingenting elakt, räkna inte ned.
      playMiss();
      setBounce(index);
      window.setTimeout(() => setBounce(null), 320);
      return;
    }

    playPlace();
    const nextPlaced = [...placed];
    nextPlaced[nextSlot] = tile;
    setPlaced(nextPlaced);
    setUsed([...used, index]);

    if (nextPlaced.every((p) => p !== null)) {
      window.setTimeout(() => onAnswer(true), 350);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {exercise.emoji && <span className="text-8xl leading-none">{exercise.emoji}</span>}

      <div className="flex gap-3">
        {placed.map((slot, i) => (
          <div
            key={i}
            className={cn(
              'reading grid h-24 w-20 place-items-center rounded-tile border-4 text-5xl font-bold',
              slot
                ? 'border-lime-500 bg-lime-100 text-ink-900 animate-pop-in'
                : 'border-dashed border-ink-300 bg-white dark:bg-ink-800'
            )}
          >
            {slot ? slot.toUpperCase() : ''}
          </div>
        ))}
      </div>

      <div className="flex max-w-2xl flex-wrap justify-center gap-3">
        {exercise.tiles.map((tile, i) => (
          <button
            key={`${tile}-${i}`}
            type="button"
            disabled={locked || used.includes(i)}
            aria-label={`Bokstaven ${tile.toUpperCase()}`}
            onClick={() => tap(tile, i)}
            className={cn(
              'tile-pop reading h-20 w-16 bg-white text-4xl font-bold text-ink-800',
              'dark:bg-ink-800 dark:text-ink-100',
              used.includes(i) && 'invisible',
              bounce === i && 'animate-nudge'
            )}
          >
            {tile.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
