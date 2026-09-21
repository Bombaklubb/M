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
        'btn-pop grid h-11 w-11 min-h-0 shrink-0 place-items-center rounded-tile sm:h-14 sm:w-14',
        // Neutral, aldrig turkos. Turkos är appens färg för LYSSNA – öronen,
        // och den stora lyssna-igen-knappen. Den här knappen lyssnar inte,
        // den stänger av. Delade den färgen blandades de ihop, och en elev
        // som ville höra om instruktionen stängde av ljudet i stället.
        av
          ? 'border-amberx-600 bg-amberx-100 text-amberx-700 dark:bg-amberx-600/30 dark:text-amberx-300'
          : 'border-ink-300 bg-white text-ink-700 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-200',
        paFarg && 'border-white/40',
        className
      )}
    >
      {av ? (
        <VolumeX className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} aria-hidden />
      ) : (
        <Volume2 className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} aria-hidden />
      )}
    </button>
  );
}
