import { Volume2, VolumeX } from 'lucide-react';
import { useLjud } from '@/hooks/useLjud';
import { cn } from '@/lib/utils';

/**
 * Ljud på / ljud av.
 *
 * Finns på varje skärm, även mitt i ett pass. Ljud är appens huvudkanal, så
 * den som vill ha tyst måste kunna få det direkt där hon är – inte leta sig
 * till en inställningssida hon ändå inte kan läsa.
 *
 * Läget bärs av ikonen och av färgen: högtalare i blått när ljudet är på,
 * överstruken högtalare i grått när det är av. Aldrig bara färg – en
 * färgblind elev ska se skillnaden på formen.
 */
export function LjudKnapp({
  paFarg = false,
  className,
}: {
  paFarg?: boolean;
  className?: string;
}) {
  const { av, vaxla } = useLjud();

  return (
    <button
      type="button"
      onClick={vaxla}
      aria-label={av ? 'Ljud av. Tryck för att slå på ljudet.' : 'Ljud på. Tryck för att stänga av ljudet.'}
      aria-pressed={av}
      title={av ? 'Ljud av' : 'Ljud på'}
      className={cn(
        'btn-pop grid h-14 w-14 min-h-0 shrink-0 place-items-center rounded-tile',
        av
          ? 'border-ink-400 bg-ink-200 text-ink-600 dark:bg-ink-700 dark:text-ink-300'
          : 'border-aqua-700 bg-aqua-500 text-white',
        paFarg && 'border-white/40',
        className
      )}
    >
      {av ? (
        <VolumeX className="h-7 w-7" strokeWidth={2.5} aria-hidden />
      ) : (
        <Volume2 className="h-7 w-7" strokeWidth={2.5} aria-hidden />
      )}
    </button>
  );
}
