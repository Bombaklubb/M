import type { Choice, Exercise } from '@/types';
import { ChoiceExercise } from './ChoiceExercise';
import { TypeTheLetter } from './TypeTheLetter';
import { BuildWordTiles } from './BuildWordTiles';
import { LetterFormation } from './LetterFormation';
import { BuildSentenceCards } from './BuildSentenceCards';
import { MicroTextExercise } from './MicroTextExercise';
import { WordPicturePair } from './WordPicturePair';
import { QuizExercise } from './QuizExercise';
import { TypeTheWord } from './TypeTheWord';
import { OrderItems } from './OrderItems';

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

    case 'quiz':
      return (
        <QuizExercise
          exercise={exercise}
          onAnswer={onAnswer}
          locked={locked}
          guideTo={guideTo}
          wrongId={wrongId}
        />
      );

    case 'type-the-word':
      return <TypeTheWord exercise={exercise} onAnswer={onAnswer} locked={locked} />;

    case 'order-items':
      return <OrderItems exercise={exercise} onAnswer={onAnswer} locked={locked} />;

    case 'build-sentence-cards':
      return <BuildSentenceCards exercise={exercise} onAnswer={onAnswer} locked={locked} />;

    case 'word-picture-pair':
      return <WordPicturePair exercise={exercise} onAnswer={onAnswer} locked={locked} />;

    case 'micro-text':
      return (
        <MicroTextExercise
          exercise={exercise}
          onAnswer={onAnswer}
          locked={locked}
          guideTo={guideTo}
          wrongId={wrongId}
        />
      );

    // Typad men inte genererad än.
    case 'first-sound-sort':
      return null;

    default: {
      const exhaustive: never = exercise;
      void exhaustive;
      return null;
    }
  }
}
