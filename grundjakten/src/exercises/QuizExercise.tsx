import type { Choice, QuizEx } from '@/types';
import { ChoiceGrid } from '@/components/ChoiceGrid';

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
    <div className="flex w-full flex-col items-center gap-8">
      {shown?.emoji && (
        <span className="text-[7rem] leading-none" aria-hidden>{shown.emoji}</span>
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

      {shown?.sentence && (
        <span className="reading max-w-3xl rounded-card border-4 border-aqua-200 bg-white px-8 py-5
                         text-center text-4xl font-medium text-ink-900 dark:bg-ink-800 dark:text-ink-50">
          {shown.sentence}
        </span>
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
