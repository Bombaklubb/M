import type { Choice, Exercise } from '@/types';
import { ChoiceExercise } from './ChoiceExercise';
import { TypeTheLetter } from './TypeTheLetter';
import { BuildWordTiles } from './BuildWordTiles';
import { LetterFormation } from './LetterFormation';

/**
 * Uttömmande switch på Exercise['kind'].
 *
 * `never`-fallet i default gör att en ny övningstyp utan komponent blir ett
 * kompileringsfel i stället för en tom skärm hos en elev.
 */
export function ExerciseRenderer({
  exercise,
  onAnswer,
  locked,
  guideTo,
  wrongId,
}: {
  exercise: Exercise;
  onAnswer: (correct: boolean, choice?: Choice) => void;
  locked: boolean;
  guideTo: string | null;
  wrongId: string | null;
}) {
  switch (exercise.kind) {
    case 'letter-sound-match':
    case 'letter-picture-match':
    case 'blend-word':
    case 'read-word-pick-picture':
    case 'sight-word-pick':
    case 'listen-pick-picture':
      return (
        <ChoiceExercise
          exercise={exercise}
          onAnswer={onAnswer}
          locked={locked}
          guideTo={guideTo}
          wrongId={wrongId}
        />
      );

    case 'type-the-letter':
      return <TypeTheLetter exercise={exercise} onAnswer={onAnswer} locked={locked} />;

    case 'build-word-tiles':
      return <BuildWordTiles exercise={exercise} onAnswer={onAnswer} locked={locked} />;

    case 'letter-formation':
      return <LetterFormation exercise={exercise} onAnswer={onAnswer} locked={locked} />;

    // Fas 3 – parallellspåret. Genereras inte än.
    case 'first-sound-sort':
    case 'word-picture-pair':
    case 'micro-text':
      return null;

    default: {
      const exhaustive: never = exercise;
      void exhaustive;
      return null;
    }
  }
}
