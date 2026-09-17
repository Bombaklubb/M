import { useEffect, useState } from 'react';
import type { SessionResult } from './SessionView';
import { playChest } from '@/lib/sfx';
import { play } from '@/lib/audio';

/**
 * Belöningsskärmen.
 *
 * Här finns medvetet INGEN träffsäkerhet: inga procent, inget "6 av 8 rätt",
 * inga röda siffror. Stjärnorna ges för att passet är slutfört. Belöningen
 * gäller att eleven gjorde jobbet, för det är det beteendet som är värt att
 * förstärka hos någon som har det här svårt.
 */
export function RewardView({
  result,
  onAgain,
  onHome,
}: {
  result: SessionResult;
  onAgain: () => void;
  onHome: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void play({ id: 'reward', text: 'Bra jobbat!', lang: 'sv-SE' });
    const timer = window.setTimeout(() => {
      setOpen(true);
      playChest();
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  // En stjärna för att ha gjort passet, resten för flyt – aldrig färre än en.
  const stars = 1 + (result.firstTryCorrect >= result.total * 0.6 ? 1 : 0) +
                    (result.firstTryCorrect >= result.total * 0.85 ? 1 : 0);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center gap-8 px-4">
      <div className="flex gap-3" role="img" aria-label={`${stars} av 3 stjärnor`}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`text-7xl ${i < stars ? 'animate-pop-in' : 'opacity-25 grayscale'}`}
            style={{ animationDelay: `${i * 180}ms` }}
            aria-hidden
          >
            ⭐
          </span>
        ))}
      </div>

      <span
        className={`text-9xl leading-none ${open ? 'animate-pop-in' : 'animate-chest-shake'}`}
        aria-hidden
      >
        {open ? '🎁' : '📦'}
      </span>

      <p className="text-4xl font-extrabold text-brand-600 dark:text-brand-300" aria-hidden>
        +{result.xpEarned} ⭐
      </p>

      <div className="flex gap-5">
        <button
          type="button"
          aria-label="Gå hem"
          onClick={onHome}
          className="btn-pop grid h-20 w-24 place-items-center rounded-tile border-ink-300
                     bg-ink-100 text-4xl dark:border-ink-600 dark:bg-ink-800"
        >
          <span aria-hidden>🏠</span>
        </button>
        <button
          type="button"
          aria-label="En till"
          onClick={onAgain}
          className="btn-pop grid h-20 w-32 place-items-center rounded-tile border-lime-700
                     bg-lime-500 text-4xl text-white"
        >
          <span aria-hidden>▶️</span>
        </button>
      </div>
    </div>
  );
}
