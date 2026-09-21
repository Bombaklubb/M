import { useEffect, useRef, useState } from 'react';
import { Delete } from 'lucide-react';
import type { TypeTheWordEx } from '@/types';
import { cn } from '@/lib/utils';
import { ALFABETET } from '@/data/banks';
import { play } from '@/lib/audio';

/**
 * Skriv ordet.
 *
 * Riktig stavning: eleven hör ordet och skriver det, utan brickor att luta
 * sig mot. Därför ligger den här övningen senare i progressionen än
 * "Bygg ordet".
 *
 * Skärmtangentbordet finns alltid. Det är inte bara en touch-fallback – en
 * Chromebook kan stå på amerikansk layout, och då finns å, ä och ö inte på
 * tangenterna alls.
 *
 * Svaret kontrolleras först när eleven trycker på knappen, inte medan hon
 * skriver. Att bli underkänd mitt i ett ord vore förödande för någon som
 * tycker att skrivandet är svårt.
 */
export function TypeTheWord({
  exercise,
  onAnswer,
  locked,
  facit,
}: {
  exercise: TypeTheWordEx;
  onAnswer: (correct: boolean) => void;
  locked: boolean;
  /**
   * Rätt svar, satt efter tredje missen.
   *
   * Den här övningen har inga alternativ att peka på, så lotsningen som
   * räddar flervalsfrågorna finns inte här. Utan facit kunde eleven skriva
   * fel hur många gånger som helst utan att något hände – hon satt fast.
   */
  facit?: string | null;
}) {
  const [text, setText] = useState('');
  const alive = useRef(true);

  useEffect(() => {
    setText('');
  }, [exercise.id]);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    if (locked) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        setText((t) => t.slice(0, -1));
        return;
      }
      if (e.key === 'Enter') {
        submit();
        return;
      }
      if (e.key.length !== 1) return;
      // Bokstäver och siffror, inget annat – skiljetecken ska inte smyga in.
      if (!/[\p{L}\p{N}]/u.test(e.key)) return;
      setText((t) => (t.length >= 20 ? t : t + e.key.toLowerCase()));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id, locked, text]);

  const submit = () => {
    if (locked || facit || !text.trim()) return;
    onAnswer(exercise.accept.includes(text.trim().toLowerCase()));
  };

  const tangenter = exercise.digits
    ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    : ALFABETET;

  return (
    <div className="flex w-full flex-col items-center gap-3 [@media(min-height:760px)]:gap-6">
      {/* Bilden ÄR frågan för en elev som inte kan läsa, så den ska vara
          skärmens största sak. Den låg förut på 3.5rem (56 px) och växte
          till 6rem först vid 760 px fönsterhöjd – ett vanligt Chrome-fönster
          på en bärbar är lägre än så, så läraren fick den minsta varianten
          med 284 px oanvänd yta under. Stegen nedan är mätta: även den
          största lämnar över 100 px luft utan att något hamnar under
          skärmkanten. */}
      {exercise.emoji && (
        <span className="text-[6rem] leading-none
                         [@media(min-height:700px)]:text-[8rem]
                         [@media(min-height:760px)]:text-[10rem]"
              aria-hidden>{exercise.emoji}</span>
      )}

      {exercise.sentence && (
        <span className="reading max-w-3xl rounded-card border-4 border-aqua-200 bg-white px-8 py-4
                         text-center text-3xl font-medium text-ink-900 dark:bg-ink-800 dark:text-ink-50">
          {exercise.sentence}
        </span>
      )}

      {/* Skrivfältet. Ingen <input>, för att Chromebookens eget skärmtangentbord
          inte ska poppa upp ovanpå appens egna knappar. */}
      <div
        className="reading grid min-h-[4rem] w-full max-w-2xl place-items-center rounded-card
                   border-4 border-dashed border-brand-300 bg-white px-6 dark:bg-ink-800
                   [@media(min-height:760px)]:min-h-[6rem]"
        role="textbox"
        aria-label={facit ? `Rätt svar: ${facit}` : `Ditt svar: ${text || 'tomt'}`}
        aria-live="polite"
      >
        <span
          className={cn(
            'text-4xl font-bold tracking-wide [@media(min-height:760px)]:text-6xl',
            // Facit står i grönt: det är rätt svar, inte elevens försök.
            facit ? 'text-lime-600 dark:text-lime-400' : 'text-brand-700 dark:text-brand-300'
          )}
        >
          {facit ?? (text || ' ')}
        </span>
      </div>

      {/* max-w-4xl: 29 bokstäver ska rymmas på två rader, annars hamnar Ö
          ensamt på en tredje och ser ut som något annat än en tangent. */}
      <div className="flex max-w-4xl flex-wrap justify-center gap-1.5">
        {tangenter.map((t) => (
          <button
            key={t}
            type="button"
            disabled={locked}
            aria-label={exercise.digits ? `Siffran ${t}` : `Bokstaven ${t.toUpperCase()}`}
            onPointerDown={() => {
              if (!exercise.digits) void play({ id: `kn-${t}`, text: t, lang: 'sv-SE' });
            }}
            onClick={() => setText((v) => (v.length >= 20 ? v : v + t))}
            className="tile-pop reading h-11 w-10 min-h-0 bg-white text-xl font-bold text-ink-800
                       dark:bg-ink-800 dark:text-ink-100
                       [@media(min-height:760px)]:h-14 [@media(min-height:760px)]:w-12
                       [@media(min-height:760px)]:text-2xl"
          >
            {exercise.digits ? t : t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Radera en bokstav"
          disabled={locked || !text}
          onClick={() => setText((t) => t.slice(0, -1))}
          className="btn-pop grid h-12 w-16 min-h-0 place-items-center rounded-tile border-ink-300
                     bg-ink-100 disabled:opacity-40 dark:border-ink-600 dark:bg-ink-800
                     [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:w-20"
        >
          <Delete size={26} aria-hidden />
        </button>

        <button
          type="button"
          aria-label="Klar"
          disabled={locked || !text.trim()}
          onClick={submit}
          className={cn(
            'btn-pop grid h-12 w-32 min-h-0 place-items-center rounded-tile border-lime-700',
            'bg-lime-500 text-2xl text-white disabled:opacity-40',
            '[@media(min-height:760px)]:h-16 [@media(min-height:760px)]:w-36',
            '[@media(min-height:760px)]:text-3xl'
          )}
        >
          <span aria-hidden>✓</span>
        </button>
      </div>
    </div>
  );
}
