import type { SpeechToken } from '@/types';
import { cn } from '@/lib/utils';
import { play } from '@/lib/audio';

/**
 * Örat – den lilla lyssna-knappen.
 *
 * Regeln i appen: **allt eleven kan välja mellan ska gå att lyssna på.** Ett
 * alternativ utan öra är en gissning för någon som inte kan läsa, inte ett
 * val. Därför sitter den här knappen på varje svarsalternativ, varje bricka
 * och varje ordkort.
 *
 * Örat stoppar händelsen från att bubbla vidare, så att ett tryck på örat
 * aldrig råkar räknas som ett svar.
 */
export function EarButton({
  token,
  label,
  size = 'md',
  className,
}: {
  token: SpeechToken;
  /** Vad örat läser upp, för skärmläsare. */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const sizes = {
    sm: 'h-10 w-10 text-base',
    md: 'h-12 w-12 text-xl',
  };

  return (
    <button
      type="button"
      aria-label={`Lyssna: ${label}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        void play(token);
      }}
      className={cn(
        'grid min-h-0 place-items-center rounded-full border-2 border-aqua-700',
        'bg-aqua-500 text-white shadow-pop-sm active:translate-y-0.5',
        sizes[size],
        className
      )}
    >
      <span aria-hidden>👂</span>
    </button>
  );
}
