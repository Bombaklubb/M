import { EarButton } from '@/components/EarButton';
import { getLevelTitle, xpForNextLevel } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * Elevens samlade poäng.
 *
 * Siffran är det läraren bad om: hur mycket eleven samlat ihop totalt, inte
 * hur långt hon har kvar. Mätaren fanns redan men visade bara en stapel –
 * "hur mycket" gick inte att avläsa, och det är just "hur mycket" en elev
 * räknar upp för sig själv och för sin kompis.
 *
 * Rutan ligger på BÅDA sidorna eleven kan komma till på egen hand, framsteg
 * och kistor, och ser likadan ut på båda. Samma siffra på två ställen som
 * ser olika ut läses som två olika siffror.
 *
 * Siffran står stort och med tusentalsavstånd enligt svensk skrivregel
 * (1 240, inte 1,240). Stapeln under säger hur långt det är till nästa nivå
 * – aldrig procent, aldrig antal fel.
 *
 * `paFarg` används på kistsidan, som har ett färgat sidhuvud att ligga mot.
 */
export function PoangRuta({
  xp,
  level,
  paFarg = false,
  visaNiva = true,
  className,
}: {
  xp: number;
  level: number;
  paFarg?: boolean;
  /**
   * Nivåraden under stapeln. Stängs av på framstegssidan, där sidhuvudet
   * redan säger "Nivå 3 · Ordjägare" en knapp bort – samma text två gånger
   * inom en skärmhöjd läses som två olika saker.
   */
  visaNiva?: boolean;
  className?: string;
}) {
  const till = xpForNextLevel(xp);
  const poang = xp.toLocaleString('sv-SE');
  const uppläst =
    level >= 10
      ? `Du har ${xp} poäng. Du är på högsta nivån, ${getLevelTitle(level)}.`
      : `Du har ${xp} poäng. Det är ${till.next - till.current} poäng kvar till nästa nivå.`;

  return (
    <section
      className={cn(
        'flex items-center gap-3 rounded-card p-4 sm:gap-4',
        paFarg ? 'bg-white/95 dark:bg-ink-800' : 'bg-white/85 dark:bg-ink-800/85',
        className
      )}
    >
      <span className="text-4xl leading-none sm:text-5xl" aria-hidden>⭐</span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* tabular-nums: siffran ska inte hoppa i sidled när poängen växer. */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tabular-nums leading-none sm:text-4xl" aria-hidden>
            {poang}
          </span>
          <span className="text-lg font-bold text-ink-500 dark:text-ink-300" aria-hidden>
            poäng
          </span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700 sm:h-5">
          <div
            role="img"
            aria-label={`${till.current} av ${till.next} till nästa nivå`}
            className="h-full bg-lime-500 transition-[width] duration-500"
            style={{ width: `${till.pct}%` }}
          />
        </div>

        {visaNiva && (
          <span className="text-sm font-bold text-ink-500 dark:text-ink-300" aria-hidden>
            Nivå {level} · {getLevelTitle(level)}
          </span>
        )}
      </div>

      <EarButton token={{ id: 'poang', text: uppläst, lang: 'sv-SE' }} label="Dina poäng" />
    </section>
  );
}
