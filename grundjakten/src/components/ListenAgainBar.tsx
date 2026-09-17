import { Home, Volume2 } from 'lucide-react';
import type { SpeechToken } from '@/types';
import { useSpeak } from '@/hooks/useSpeak';
import { cn } from '@/lib/utils';
import { play, setRateScale } from '@/lib/audio';

interface Props {
  replay: SpeechToken;
  onHome: () => void;
  baseRate: number;
}

/**
 * Den fasta listen längst ned: stort öra, sköldpadda för långsamt, hem.
 *
 * Örat är den största tryckytan på skärmen med flit – det är elevens enda
 * väg tillbaka in i uppgiften om hon tappat tråden, och hon kan inte läsa
 * sig till någon annan.
 */
export function ListenAgainBar({ replay, onHome, baseRate }: Props) {
  const { speaking, speak } = useSpeak();

  const slowReplay = async () => {
    setRateScale(0.6);
    await play(replay);
    setRateScale(baseRate);
  };

  return (
    <div className="sticky bottom-0 z-30 flex items-center justify-center gap-4
                    border-t-2 border-ink-200 bg-white/95 px-4 py-3 backdrop-blur
                    dark:border-ink-700 dark:bg-ink-900/95">
      <button
        type="button"
        aria-label="Gå hem"
        onClick={onHome}
        className="btn-pop grid h-16 w-16 place-items-center rounded-tile border-ink-300 bg-ink-100
                   text-ink-700 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-200"
      >
        <Home className="h-7 w-7" strokeWidth={2.5} aria-hidden />
      </button>

      <button
        type="button"
        aria-label="Lyssna igen"
        onClick={() => void speak(replay)}
        className={cn(
          'btn-pop grid h-20 w-32 place-items-center rounded-tile border-aqua-700 bg-aqua-500 text-white',
          speaking && 'animate-ear-pulse'
        )}
      >
        <Volume2 className="h-10 w-10" strokeWidth={2.5} aria-hidden />
      </button>

      <button
        type="button"
        aria-label="Lyssna långsamt"
        onClick={() => void slowReplay()}
        className="btn-pop grid h-16 w-16 place-items-center rounded-tile border-lime-700 bg-lime-500 text-white"
      >
        <span aria-hidden className="text-3xl">🐢</span>
      </button>
    </div>
  );
}
