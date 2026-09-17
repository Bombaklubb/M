import { useEffect, useState } from 'react';
import type { BuildSentenceCardsEx } from '@/types';
import { cn } from '@/lib/utils';
import { playMiss, playPlace } from '@/lib/sfx';
import { play } from '@/lib/audio';

/**
 * Bygg meningen av ordkort.
 *
 * Det här är hela skrivspåret i v1, och valet är medvetet: fri text går inte
 * att rätta automatiskt, men en mening byggd av kort går. Appen kan
 * kontrollera ordföljden, att meningen börjar med stor bokstav och att
 * punkten hamnar sist – de tre sakerna eleven faktiskt ska lära sig här.
 *
 * Klick, inte drag: en Chromebook-styrplatta gör dragning till ett test i
 * finmotorik i stället för i meningsbyggnad. Fel kort studsar tillbaka med en
 * mjuk duns, utan avdrag.
 */
export function BuildSentenceCards({
  exercise,
  onAnswer,
  locked,
}: {
  exercise: BuildSentenceCardsEx;
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

  const tap = (card: string, index: number) => {
    if (locked || used.includes(index) || nextSlot === -1) return;

    if (card !== exercise.target[nextSlot]) {
      playMiss();
      setBounce(index);
      window.setTimeout(() => setBounce(null), 320);
      return;
    }

    if (card !== '.') void play({ id: `word-${card.toLowerCase()}`, text: card, lang: 'sv-SE' });
    playPlace();

    const nextPlaced = [...placed];
    nextPlaced[nextSlot] = card;
    setPlaced(nextPlaced);
    setUsed([...used, index]);

    if (nextPlaced.every((p) => p !== null)) {
      window.setTimeout(() => onAnswer(true), 400);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {exercise.emoji && <span className="text-7xl leading-none" aria-hidden>{exercise.emoji}</span>}

      {/* Luckorna. Punktluckan är smalare så att den syns som något annat än ett ord. */}
      <div className="flex min-h-[5.5rem] flex-wrap items-center justify-center gap-2">
        {placed.map((slot, i) => {
          const isPeriodSlot = exercise.target[i] === '.';
          return (
            <div
              key={i}
              className={cn(
                'reading grid h-20 place-items-center rounded-tile border-4 text-4xl font-bold',
                isPeriodSlot ? 'w-14' : 'min-w-[6rem] px-3',
                slot
                  ? 'border-lime-500 bg-lime-100 text-ink-900 animate-pop-in'
                  : 'border-dashed border-ink-300 bg-white dark:bg-ink-800'
              )}
            >
              {slot ?? ''}
            </div>
          );
        })}
      </div>

      <div className="flex max-w-3xl flex-wrap justify-center gap-3">
        {exercise.cards.map((card, i) => (
          <button
            key={`${card}-${i}`}
            type="button"
            disabled={locked || used.includes(i)}
            aria-label={card === '.' ? 'Punkt' : `Ordet ${card}`}
            onClick={() => tap(card, i)}
            className={cn(
              'tile-pop reading h-20 bg-white text-3xl font-bold text-ink-800',
              'dark:bg-ink-800 dark:text-ink-100',
              card === '.' ? 'w-14' : 'min-w-[6rem] px-4',
              used.includes(i) && 'invisible',
              bounce === i && 'animate-nudge'
            )}
          >
            {card}
          </button>
        ))}
      </div>
    </div>
  );
}
