import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { useSpeak } from '@/hooks/useSpeak';
import { beatFor, isFinale, STORY_LENGTH } from '@/data/story';
import type { Progress, StudentProfile } from '@/types';
import { cn } from '@/lib/utils';
import { todayStamp } from '@/lib/utils';

const STEP_ICONS = ['📖', '🖼️', '📝', '❓', '✏️'];

/**
 * Uppdragsskärmen – appens framsida.
 *
 * Ett uppdrag om dagen, fem steg, fem minuter. Berättelsen om Leo läses upp
 * och eleven behöver aldrig läsa den själv.
 *
 * Poängen med skärmen är att den tar bort valet: en elev som inte kan läsa
 * en meny ska inte behöva navigera i en. Här finns en enda stor knapp.
 */
export function MissionView({
  profile,
  progress,
  onStart,
  onBack,
}: {
  profile: StudentProfile;
  progress: Progress;
  onStart: () => void;
  onBack: () => void;
}) {
  const { speak } = useSpeak();
  const beat = beatFor(progress.missionBeat);
  const doneToday = progress.lastMissionDate === todayStamp();
  const finale = isFinale(progress.missionBeat);

  useAutoSpeak(
    { id: `beat-${beat.id}`, text: beat.text, lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

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
        <h1 className="text-3xl font-extrabold">Dagens uppdrag</h1>
      </header>

      {/* Berättelsen. Stor bild, uppläst text – ingen läsning krävs. */}
      <div className="mb-8 flex flex-col items-center gap-5 rounded-card border-2 border-brand-200
                      bg-white px-6 py-8 text-center dark:border-ink-700 dark:bg-ink-800">
        <span className={cn('text-8xl leading-none', finale && 'animate-pop-in')} aria-hidden>
          {beat.emoji}
        </span>
        <p className="reading max-w-xl text-2xl font-medium leading-snug">{beat.text}</p>
        <button
          type="button"
          aria-label="Lyssna igen"
          onClick={() => void speak({ id: `beat-${beat.id}`, text: beat.text, lang: 'sv-SE' })}
          className="btn-pop grid h-16 w-24 place-items-center rounded-tile border-aqua-700
                     bg-aqua-500 text-3xl text-white"
        >
          <span aria-hidden>🔊</span>
        </button>
      </div>

      {/* De fem stegen som ikoner, så eleven vet vad som väntar. */}
      <div className="mb-8 flex justify-center gap-3" role="img" aria-label="Fem steg i uppdraget">
        {STEP_ICONS.map((icon, i) => (
          <span
            key={i}
            className="grid h-16 w-16 place-items-center rounded-tile border-2 border-ink-200
                       bg-white text-3xl dark:border-ink-700 dark:bg-ink-800"
            aria-hidden
          >
            {icon}
          </span>
        ))}
      </div>

      <button
        type="button"
        aria-label={doneToday ? 'Gör uppdraget igen' : 'Starta uppdraget'}
        onClick={onStart}
        className={cn(
          'btn-pop mx-auto flex items-center gap-5 rounded-card px-12 py-7 text-white',
          doneToday ? 'border-aqua-700 bg-aqua-500' : 'border-lime-700 bg-lime-500'
        )}
      >
        <span className="text-5xl leading-none" aria-hidden>{doneToday ? '🔁' : '▶️'}</span>
        <span className="text-3xl font-extrabold">{doneToday ? 'En gång till' : 'Starta'}</span>
      </button>

      {/* Hur långt i berättelsen eleven kommit. Aldrig som siffra eller procent. */}
      <div
        className="mt-10 flex flex-wrap justify-center gap-1.5"
        role="img"
        aria-label={`${(progress.missionBeat % STORY_LENGTH) + 1} av ${STORY_LENGTH} delar i berättelsen`}
      >
        {Array.from({ length: STORY_LENGTH }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-3 w-3 rounded-full',
              i < progress.missionBeat % STORY_LENGTH
                ? 'bg-lime-500'
                : i === progress.missionBeat % STORY_LENGTH
                  ? 'bg-brand-500'
                  : 'bg-ink-300 dark:bg-ink-700'
            )}
          />
        ))}
      </div>
    </div>
  );
}
