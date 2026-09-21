import { ArrowRight, Home, Volume2 } from 'lucide-react';
import type { SpeechToken } from '@/types';
import { useSpeak } from '@/hooks/useSpeak';
import { useLjud } from '@/hooks/useLjud';
import { LjudKnapp } from '@/components/LjudKnapp';
import { cn } from '@/lib/utils';

interface Props {
  replay: SpeechToken;
  onHome: () => void;
  /** Satt först när uppgiften är klarad. Då är pilen enda vägen vidare. */
  onNext?: () => void;
}

/**
 * Den fasta listen längst ned: hem, stort öra och – när uppgiften är klarad –
 * den gröna pilen vidare.
 *
 * Örat är den största tryckytan på skärmen med flit; det är elevens enda väg
 * tillbaka in i uppgiften om hon tappat tråden, och hon kan inte läsa sig
 * till någon annan.
 *
 * Pilen ligger HÄR, i listen som alltid finns, i stället för under uppgiften.
 * Listen har fast höjd, så pilen kan dyka upp och försvinna utan att resten
 * av skärmen hoppar – och utan att uppgiften trycks ned under skärmkanten.
 * Den glöder, eftersom en elev som inte kan läsa måste kunna se att det är
 * den hon ska trycka på härnäst.
 */
export function ListenAgainBar({ replay, onHome, onNext }: Props) {
  const { speaking, speak } = useSpeak();
  const { av } = useLjud();

  return (
    <div className="sticky bottom-0 z-30 flex shrink-0 items-center justify-center gap-3
                    border-t-2 border-ink-200 bg-white/95 px-3 py-2 backdrop-blur
                    dark:border-ink-700 dark:bg-ink-900/95
                    [@media(min-height:760px)]:gap-5 [@media(min-height:760px)]:py-3">
      <button
        type="button"
        aria-label="Gå hem"
        onClick={onHome}
        className="btn-pop grid h-14 w-14 min-h-0 place-items-center rounded-tile border-ink-300
                   bg-ink-100 text-ink-700 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-200"
      >
        <Home className="h-6 w-6" strokeWidth={2.5} aria-hidden />
      </button>

      <LjudKnapp />

      <button
        type="button"
        aria-label={av ? 'Lyssna igen. Ljudet är avstängt.' : 'Lyssna igen'}
        onClick={() => void speak(replay)}
        className={cn(
          'btn-pop grid h-14 w-24 min-h-0 place-items-center rounded-tile border-aqua-700',
          'bg-aqua-500 text-white [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:w-28',
          speaking && 'animate-ear-pulse',
          av && 'opacity-40'
        )}
      >
        <Volume2 className="h-8 w-8" strokeWidth={2.5} aria-hidden />
      </button>

      {onNext && (
        <button
          type="button"
          aria-label="Nästa uppgift"
          onClick={onNext}
          autoFocus
          className="btn-pop grid h-14 w-28 min-h-0 animate-guide-glow place-items-center
                     rounded-tile border-lime-700 bg-lime-500 text-white
                     [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:w-32"
        >
          <ArrowRight className="h-9 w-9" strokeWidth={3} aria-hidden />
        </button>
      )}
    </div>
  );
}
