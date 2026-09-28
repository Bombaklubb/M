import type { Choice, QuizEx } from '@/types';
import { ChoiceGrid } from '@/components/ChoiceGrid';
import { LagesBild } from '@/components/LagesBild';

/**
 * Generell flervalsövning.
 *
 * Den här enda komponenten renderar huvuddelen av övningsbanken. Det som
 * skiljer uppgifterna åt är vad som står ovanför alternativen – en bokstav,
 * ett ord, en mening eller en bild – inte mekaniken.
 *
 * Tvåvalsuppgifter (en/ett, rätt stavning) körs kompakt: två stora rutor
 * bredvid varandra läser bättre än två halvtomma jätterutor.
 */
export function QuizExercise({
  exercise,
  onAnswer,
  locked,
  guideTo,
  wrongId,
}: {
  exercise: QuizEx;
  onAnswer: (correct: boolean, choice?: Choice) => void;
  locked: boolean;
  guideTo: string | null;
  wrongId: string | null;
}) {
  const shown = exercise.shown;

  return (
    <div className="flex w-full flex-col items-center gap-6 [@media(min-height:760px)]:gap-8">

      {/* Bilden krymper när ett ord står under den, så att bild, ord och
          svar ryms på en Chromebook utan att eleven behöver scrolla. */}
      {shown?.emoji && (
        <span
          className={shown.word
            ? 'text-[5rem] leading-none [@media(min-height:760px)]:text-[6.5rem]'
            : 'text-[7rem] leading-none'}
          aria-hidden
        >
          {shown.emoji}
        </span>
      )}

      {shown?.letter && (
        <span className="reading text-[8rem] font-bold leading-none text-brand-600 dark:text-brand-300">
          {shown.letter}
        </span>
      )}

      {shown?.word && (
        <span className="reading rounded-card border-4 border-brand-200 bg-white px-10 py-5
                         text-6xl font-bold text-ink-900 dark:bg-ink-800 dark:text-ink-50">
          {shown.word}
        </span>
      )}

      {/* Bilden till ett lägesord står BREDVID meningen, inte ovanför: på en
          Chromebook är skärmen bara runt 650 px hög när webbläsaren tagit
          sitt, och bild, mening och tre svar på höjden klipptes. På en smal
          skärm hamnar bilden ovanför igen. */}
      {(shown?.sentence || shown?.scen) && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          {shown.scen && <LagesBild scen={shown.scen} />}
          {shown.sentence && (
            <span className="reading max-w-3xl rounded-card border-4 border-aqua-200 bg-white px-8 py-5
                             text-center text-4xl font-medium text-ink-900 dark:bg-ink-800 dark:text-ink-50">
              {shown.sentence}
            </span>
          )}
        </div>
      )}

      <ChoiceGrid
        compact={exercise.compact}
        choices={exercise.choices}
        disabled={locked}
        guideTo={guideTo}
        wrongId={wrongId}
        onPick={(choice) => onAnswer(choice.correct, choice)}
      />
    </div>
  );
}
