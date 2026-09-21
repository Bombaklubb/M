import { GrundjaktenLogo } from '@/components/GrundjaktenLogo';
import { cn } from '@/lib/utils';

/**
 * Appens märke, klickbart.
 *
 * Ligger längst till vänster i huvudet på varje sida och går alltid hem. Det
 * ger en fast punkt: var eleven än hamnat finns samma bild på samma plats,
 * och den leder tillbaka till de tre korten.
 *
 * Syns INTE under ett pass. Där finns redan en hus-knapp längst ned, och en
 * andra väg ut mitt i en uppgift är något en elev kan trycka på av misstag
 * och tappa passet på.
 *
 * `paFarg` används på de sidor som har ett färgat sidhuvud. Märket är självt
 * lila och skulle smälta in i den lila hjälten på Om-sidan, så där får det en
 * vit bakgrundsplatta och vit text.
 */
export function AppMarke({
  onHome,
  paFarg = false,
  className,
}: {
  onHome: () => void;
  paFarg?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onHome}
      aria-label="Grundjakten, gå till startsidan"
      className={cn(
        'flex h-11 min-h-0 shrink-0 items-center gap-1.5 rounded-tile px-1.5',
        'sm:h-14 sm:gap-2 sm:px-2',
        paFarg ? 'text-white hover:bg-white/15' : 'hover:bg-white/70 dark:hover:bg-ink-800/70',
        className
      )}
    >
      <span className={cn(paFarg && 'rounded-xl bg-white/90 p-0.5')}>
        <GrundjaktenLogo size={36} className="h-8 w-8 sm:h-9 sm:w-9" />
      </span>
      <span
        className={cn(
          'hidden font-extrabold tracking-tight sm:block sm:text-xl',
          paFarg ? 'text-white' : 'text-brand-700 dark:text-brand-300'
        )}
      >
        Grundjakten
      </span>
    </button>
  );
}
