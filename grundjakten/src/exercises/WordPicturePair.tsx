import { useEffect, useMemo, useState } from 'react';
import type { WordPicturePairEx } from '@/types';
import { play } from '@/lib/audio';
import { EarButton } from '@/components/EarButton';
import { playMiss, playPlace } from '@/lib/sfx';
import { cn, stortOrd } from '@/lib/utils';
import { mulberry32, shuffle } from '@/lib/rng';

/**
 * Para ihop ord och bild.
 *
 * Tränar orden som ordbilder – eleven kopplar ihop ordet med vad det betyder
 * utan att behöva ljuda det. Ordet läses upp när hon trycker på det; annars
 * vore övningen ren gissning för någon som inte avkodar.
 *
 * Tryck-tryck, inte drag: välj ett ord, välj sedan en bild.
 */
export function WordPicturePair({
  exercise,
  onAnswer,
  locked,
}: {
  exercise: WordPicturePairEx;
  onAnswer: (correct: boolean) => void;
  locked: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);

  /**
   * Bilderna blandas så att raderna inte ligger parvis mitt emot varandra.
   *
   * Fröet togs förut ur `exercise.id.LENGTH`, alltså hur många tecken id:t
   * har – i praktiken samma tal för varje uppgift. Alla uppgifter fick
   * därmed samma permutation, och med tre par blev den ofta identiteten:
   * rätt ord stod rakt ovanför sin egen bild. Läraren såg det direkt, och
   * då är övningen ett positionstest och inte en läsövning.
   *
   * Nu seedas den ur id:ts INNEHÅLL, och resultatet kontrolleras: ingen bild
   * får hamna på sin egen plats. Går det inte på tjugo försök roteras
   * listan ett steg, vilket alltid uppfyller villkoret.
   */
  const pictures = useMemo(() => {
    const par = exercise.pairs;
    if (par.length < 2) return par;

    let fro = 2166136261;
    for (const tecken of exercise.id) {
      fro = Math.imul(fro ^ tecken.charCodeAt(0), 16777619);
    }
    const rng = mulberry32(fro >>> 0);

    for (let i = 0; i < 20; i++) {
      const kandidat = shuffle(par, rng);
      if (kandidat.every((p, j) => p.id !== par[j].id)) return kandidat;
    }
    return [...par.slice(1), par[0]];
  }, [exercise.id, exercise.pairs]);

  useEffect(() => {
    setPicked(null);
    setMatched([]);
    setWrong(null);
  }, [exercise.id]);

  const tapWord = (id: string) => {
    if (locked || matched.includes(id)) return;
    const pair = exercise.pairs.find((p) => p.id === id);
    if (pair) void play(pair.say);
    setPicked(id);
  };

  const tapPicture = (id: string) => {
    if (locked || matched.includes(id)) return;
    if (!picked) {
      // Ingen ordvalt än – säg ordet så eleven förstår vad bilden heter.
      const pair = exercise.pairs.find((p) => p.id === id);
      if (pair) void play(pair.say);
      return;
    }

    if (picked !== id) {
      playMiss();
      setWrong(id);
      window.setTimeout(() => setWrong(null), 320);
      setPicked(null);
      return;
    }

    playPlace();
    const next = [...matched, id];
    setMatched(next);
    setPicked(null);
    if (next.length === exercise.pairs.length) {
      window.setTimeout(() => onAnswer(true), 400);
    }
  };

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-3">
        {exercise.pairs.map((pair) => (
          <div key={pair.id} className="relative">
            <button
              type="button"
              disabled={locked || matched.includes(pair.id)}
              aria-label={`Ordet ${pair.word}`}
              onClick={() => tapWord(pair.id)}
              className={cn(
                'tile-pop reading min-w-[9rem] px-5 py-4 text-4xl font-bold',
                matched.includes(pair.id)
                  ? 'border-lime-500 bg-lime-100 text-ink-900 opacity-60'
                  : picked === pair.id
                    ? 'border-brand-600 bg-brand-100 text-ink-900 ring-4 ring-brand-400'
                    : 'bg-white text-ink-800 dark:bg-ink-800 dark:text-ink-100'
              )}
            >
              {stortOrd(pair.word)}
            </button>
            <EarButton size="sm" token={pair.say} label={pair.word}
              className="absolute -right-2 -top-2" />
          </div>
        ))}
      </div>

      <span className="text-3xl text-ink-400" aria-hidden>↕</span>

      <div className="flex flex-wrap justify-center gap-3">
        {pictures.map((pair) => (
          <div key={pair.id} className="relative">
            <button
              type="button"
              disabled={locked || matched.includes(pair.id)}
              aria-label={`Bilden ${pair.word}`}
              onClick={() => tapPicture(pair.id)}
              className={cn(
                'tile-pop grid h-32 w-32 place-items-center text-6xl',
                matched.includes(pair.id)
                  ? 'border-lime-500 bg-lime-100 opacity-60'
                  : 'bg-white dark:bg-ink-800',
                wrong === pair.id && 'animate-nudge'
              )}
            >
              <span aria-hidden>{pair.emoji}</span>
            </button>
            <EarButton size="sm" token={pair.say} label={pair.word}
              className="absolute -right-2 -top-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
