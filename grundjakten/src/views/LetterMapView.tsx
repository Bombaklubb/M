import type { Progress, StudentProfile } from '@/types';
import { PROGRESSION_STEPS } from '@/data/progression';
import { LETTER_BY_ID } from '@/data/letters';
import { newWordsAtStep } from '@/data/words';
import { EarButton } from '@/components/EarButton';
import { play } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { AppMarke } from '@/components/AppMarke';
import { LjudKnapp } from '@/components/LjudKnapp';

/** Så många ordbilder får plats utan att kortet växer ur skärmen. */
const MAX_ORD = 6;

/**
 * Bokstavsresan – åtta stationer på en väg.
 *
 * Presenteras som en spelkarta, inte som en läslista. Det är medvetet: en
 * klasskamrat som tittar över axeln ska se ett spel någon är bra på, inte
 * ett åk 1-material.
 *
 * Varje kort visar ORDEN stationen låser upp. Det är kortets viktigaste rad:
 * utan den ser indelningen godtycklig ut – varför skulle S, O, L, A, R och M
 * höra ihop? – och med den är svaret självklart, för det är precis de
 * bokstäver som behövs för sol, arm, mor, orm, ram och ros. Eleven läser inte
 * orden, hon ser bilderna och förstår vad hon kommer att kunna.
 *
 * Låsta stationer visar sina ord dämpat. De är en morot, inte en hemlighet.
 */
export function LetterMapView({
  profile,
  progress,
  onStart,
  onBack,
}: {
  profile: StudentProfile;
  progress: Progress;
  onStart: (step: number) => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 py-4
                    [@media(min-height:760px)]:py-5">
      <header className="mb-4 flex items-center gap-4 [@media(min-height:760px)]:mb-6">
        <AppMarke onHome={onBack} />
        <LjudKnapp />
        <button
          type="button"
          aria-label="Tillbaka"
          onClick={onBack}
          className="btn-pop grid h-14 w-14 place-items-center rounded-tile border-ink-300
                     bg-ink-100 text-2xl dark:border-ink-600 dark:bg-ink-800"
        >
          <span aria-hidden>←</span>
        </button>
        <h1 className="truncate text-2xl font-extrabold sm:text-3xl">Bokstavsresan</h1>
      </header>

      <div className="grid gap-3 pb-6 [@media(min-height:760px)]:gap-4">
        {PROGRESSION_STEPS.map((s) => {
          const locked = s.step > profile.progressionStep;
          const mastered = s.letters.filter((id) => progress.letters[id]?.mastered).length;
          const ord = newWordsAtStep(s.step).filter((w) => w.emoji !== null).slice(0, MAX_ORD);

          return (
            <div
              key={s.step}
              className={cn(
                'rounded-card border-2 px-4 py-3 [@media(min-height:760px)]:px-5',
                locked
                  ? 'border-ink-300 bg-ink-100/80 dark:border-ink-700 dark:bg-ink-800/60'
                  : 'border-brand-700 bg-white shadow-pop dark:bg-ink-800'
              )}
            >
              {/* Själva stationsknappen. Orden ligger UTANFÖR den, eftersom
                  varje ord har ett eget öra – ett öra inuti en knapp som
                  startar passet blir en fälla. */}
              <button
                type="button"
                disabled={locked}
                aria-label={
                  locked
                    ? `Station ${s.step}, låst. Bokstäver: ${s.letters.map((id) => LETTER_BY_ID[id]?.upper).join(', ')}`
                    : `Station ${s.step}: ${s.letters.map((id) => LETTER_BY_ID[id]?.upper).join(', ')}.` +
                      (ord.length ? ` Här lär du dig läsa ${ord.map((w) => w.text).join(', ')}.` : '')
                }
                onPointerDown={() => {
                  if (!locked) void play({ id: `st-${s.step}`, text: `Station ${s.step}`, lang: 'sv-SE' });
                }}
                onClick={() => !locked && onStart(s.step)}
                className={cn(
                  'flex w-full items-center gap-4 rounded-tile text-left',
                  locked && 'opacity-50'
                )}
              >
                <span className="text-4xl leading-none [@media(min-height:760px)]:text-5xl" aria-hidden>
                  {locked ? '🔒' : s.icon}
                </span>

                <span className="flex flex-1 flex-wrap gap-1.5">
                  {s.letters.map((id) => (
                    <span
                      key={id}
                      className={cn(
                        'reading grid h-11 w-9 place-items-center rounded-tile text-xl font-bold',
                        progress.letters[id]?.mastered
                          ? 'bg-lime-400 text-ink-900'
                          : 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200'
                      )}
                    >
                      <span aria-hidden>{LETTER_BY_ID[id]?.upper}</span>
                    </span>
                  ))}
                </span>

                {!locked && (
                  <span className="shrink-0 text-sm font-bold text-ink-400" aria-hidden>
                    {mastered}/{s.letters.length}
                  </span>
                )}
              </button>

              {/* Vad stationen ger. Bilden bär beskedet, örat läser ordet. */}
              {ord.length > 0 && (
                <div className={cn('mt-2 flex flex-wrap items-center gap-2', locked && 'opacity-50')}>
                  {ord.map((w) => (
                    <span
                      key={w.id}
                      className="flex items-center gap-1 rounded-tile bg-ink-100 py-1 pl-2 pr-1
                                 dark:bg-ink-700"
                    >
                      <span className="text-xl leading-none" aria-hidden>{w.emoji}</span>
                      <span className="reading text-base font-bold" aria-hidden>{w.text}</span>
                      <EarButton size="sm" token={w.say} label={w.text} className="h-9 w-9 text-sm" />
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
