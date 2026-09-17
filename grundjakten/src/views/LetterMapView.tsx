import type { Progress, StudentProfile } from '@/types';
import { PROGRESSION_STEPS } from '@/data/progression';
import { LETTER_BY_ID } from '@/data/letters';
import { play } from '@/lib/audio';
import { cn } from '@/lib/utils';

/**
 * Bokstavsresan – åtta stationer på en väg.
 *
 * Presenteras som en spelkarta, inte som en läslista. Det är medvetet: en
 * klasskamrat som tittar över axeln ska se ett spel någon är bra på, inte
 * ett åk 1-material.
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
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 py-5">
      <header className="mb-6 flex items-center gap-4">
        <button
          type="button"
          aria-label="Tillbaka"
          onClick={onBack}
          className="btn-pop grid h-14 w-14 place-items-center rounded-tile border-ink-300
                     bg-ink-100 text-2xl dark:border-ink-600 dark:bg-ink-800"
        >
          <span aria-hidden>←</span>
        </button>
        <h1 className="text-3xl font-extrabold">Bokstavsresan</h1>
      </header>

      <div className="grid gap-4">
        {PROGRESSION_STEPS.map((s) => {
          const locked = s.step > profile.progressionStep;
          const mastered = s.letters.filter((id) => progress.letters[id]?.mastered).length;
          return (
            <button
              key={s.step}
              type="button"
              disabled={locked}
              aria-label={
                locked
                  ? `Station ${s.step}, låst`
                  : `Station ${s.step}: ${s.letters.map((id) => LETTER_BY_ID[id]?.upper).join(', ')}`
              }
              onPointerDown={() => {
                if (!locked) void play({ id: `st-${s.step}`, text: `Station ${s.step}`, lang: 'sv-SE' });
              }}
              onClick={() => !locked && onStart(s.step)}
              className={cn(
                'btn-pop flex items-center gap-5 rounded-card px-6 py-5',
                locked
                  ? 'border-ink-300 bg-ink-200 opacity-50 dark:bg-ink-800'
                  : 'border-brand-700 bg-white dark:bg-ink-800'
              )}
            >
              <span className="text-5xl leading-none" aria-hidden>
                {locked ? '🔒' : s.icon}
              </span>

              <span className="flex flex-1 flex-wrap gap-2">
                {s.letters.map((id) => (
                  <span
                    key={id}
                    className={cn(
                      'reading grid h-12 w-10 place-items-center rounded-tile text-2xl font-bold',
                      progress.letters[id]?.mastered
                        ? 'bg-lime-400 text-ink-900'
                        : 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200'
                    )}
                  >
                    {LETTER_BY_ID[id]?.upper}
                  </span>
                ))}
              </span>

              {!locked && (
                <span className="text-sm font-bold text-ink-400" aria-hidden>
                  {mastered}/{s.letters.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
