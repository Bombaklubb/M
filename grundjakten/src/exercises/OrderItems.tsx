import { useEffect, useState } from 'react';
import type { OrderItemsEx } from '@/types';
import { cn } from '@/lib/utils';
import { playMiss, playPlace } from '@/lib/sfx';
import { play } from '@/lib/audio';
import { EarButton } from '@/components/EarButton';

/**
 * Lägg i rätt ordning.
 *
 * Alfabetisk ordning, veckodagar, månader. Eleven klickar objekten i tur och
 * ordning – samma tryck-för-att-placera som ordkorten, och av samma skäl:
 * drag på en Chromebook-styrplatta gör övningen till ett finmotoriktest.
 *
 * Fel objekt studsar tillbaka med en mjuk duns. Inget avdrag, ingen röd
 * markering – eleven kan prova igen direkt.
 */
export function OrderItems({
  exercise,
  onAnswer,
  locked,
}: {
  exercise: OrderItemsEx;
  onAnswer: (correct: boolean) => void;
  locked: boolean;
}) {
  const [placerade, setPlacerade] = useState<string[]>([]);
  const [studsar, setStudsar] = useState<number | null>(null);

  useEffect(() => {
    setPlacerade([]);
    setStudsar(null);
  }, [exercise.id]);

  const tryck = (item: string, index: number) => {
    if (locked || placerade.includes(item)) return;

    void play({ id: `ord-${item.toLowerCase()}`, text: item, lang: 'sv-SE' });

    if (item !== exercise.target[placerade.length]) {
      playMiss();
      setStudsar(index);
      window.setTimeout(() => setStudsar(null), 320);
      return;
    }

    playPlace();
    const nasta = [...placerade, item];
    setPlacerade(nasta);
    if (nasta.length === exercise.target.length) {
      window.setTimeout(() => onAnswer(true), 450);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      {/* Luckorna. Numren gör ordningen synlig även för den som inte läser. */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {exercise.target.map((_, i) => (
          <div
            key={i}
            className={cn(
              'reading relative grid h-20 min-w-[8rem] place-items-center rounded-tile border-4 px-4',
              'text-3xl font-bold',
              placerade[i]
                ? 'border-lime-500 bg-lime-100 text-ink-900 animate-pop-in'
                : 'border-dashed border-ink-300 bg-white dark:bg-ink-800'
            )}
          >
            <span
              className="absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full
                         bg-brand-500 text-sm font-black text-white"
              aria-hidden
            >
              {i + 1}
            </span>
            {placerade[i] ?? ''}
          </div>
        ))}
      </div>

      <div className="flex max-w-3xl flex-wrap justify-center gap-4">
        {exercise.items.map((item, i) => (
          <div key={`${item}-${i}`} className={cn('relative', placerade.includes(item) && 'invisible')}>
            <button
              type="button"
              disabled={locked || placerade.includes(item)}
              aria-label={item}
              onClick={() => tryck(item, i)}
              className={cn(
                'tile-pop reading h-20 min-w-[8rem] px-5 text-3xl font-bold text-ink-800',
                'bg-white dark:bg-ink-800 dark:text-ink-100',
                studsar === i && 'animate-nudge'
              )}
            >
              {item}
            </button>
            <EarButton
              size="sm"
              token={{ id: `ord-${item.toLowerCase()}`, text: item, lang: 'sv-SE' }}
              label={item}
              className="absolute -right-2 -top-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
