import { useEffect, useState } from 'react';
import type { Choice, Exercise } from '@/types';
import { ChoiceGrid } from '@/components/ChoiceGrid';
import { LETTER_BY_ID } from '@/data/letters';
import { useSpeak } from '@/hooks/useSpeak';

type ChoiceKind = Extract<
  Exercise,
  { choices: Choice[] }
>;

/**
 * Alla övningar som handlar om att välja bland alternativ renderas här.
 *
 * Det som skiljer dem åt är vad som visas OVANFÖR alternativen: en stor
 * bokstav, ett skrivet ord, eller ingenting alls (då är ljudet hela frågan).
 */
export function ChoiceExercise({
  exercise,
  onAnswer,
  locked,
  guideTo,
  wrongId,
}: {
  exercise: ChoiceKind;
  onAnswer: (correct: boolean, choice: Choice) => void;
  locked: boolean;
  guideTo: string | null;
  wrongId: string | null;
}) {
  const { speakAll } = useSpeak();
  const [blended, setBlended] = useState(false);

  useEffect(() => {
    setBlended(false);
  }, [exercise.id]);

  // Ljudningsövningen spelar grafemen i följd innan eleven väljer.
  useEffect(() => {
    if (exercise.kind !== 'blend-word' || blended) return;
    setBlended(true);
    const timer = window.setTimeout(() => {
      void speakAll([...exercise.parts, exercise.replay], 380);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [exercise, blended, speakAll]);

  const header = () => {
    if (exercise.kind === 'letter-picture-match') {
      const letter = LETTER_BY_ID[exercise.letterId];
      return (
        <div className="reading text-center text-[8rem] font-bold leading-none text-brand-600 dark:text-brand-300">
          {letter.upper}
          <span className="text-ink-400">{letter.lower}</span>
        </div>
      );
    }
    if (exercise.kind === 'read-word-pick-picture') {
      return (
        <div className="reading rounded-card border-4 border-brand-200 bg-white px-10 py-6
                        text-7xl font-bold text-ink-900 dark:bg-ink-800 dark:text-ink-50">
          {exercise.shownWord}
        </div>
      );
    }
    if (exercise.kind === 'blend-word') {
      return (
        <div className="flex gap-3" aria-hidden>
          {exercise.parts.map((_, i) => (
            <span key={i} className="h-4 w-4 rounded-full bg-brand-400" />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {header()}
      <ChoiceGrid
        choices={exercise.choices}
        disabled={locked}
        guideTo={guideTo}
        wrongId={wrongId}
        onPick={(choice) => onAnswer(choice.correct, choice)}
      />
    </div>
  );
}
