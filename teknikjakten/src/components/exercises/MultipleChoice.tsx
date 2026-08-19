import { useState } from 'react';
import { MultipleChoiceExercise } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function pick(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onAnswer(idx === exercise.correctIndex), 1000);
  }

  return (
    <div className="space-y-3">
      <p className="text-lg sm:text-xl font-black text-gray-800 leading-snug">{exercise.question}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {exercise.options.map((opt, idx) => {
          const isCorrect = idx === exercise.correctIndex;
          const isSelected = selected === idx;
          const revealed = selected !== null;

          let cls = 'clay-card-sm p-4 text-left w-full transition-all cursor-pointer min-h-[56px] flex items-center gap-3 ';
          if (!revealed) {
            cls += 'hover:scale-[1.01] active:scale-[0.99] active:translate-y-0.5';
          } else if (isCorrect) {
            cls += 'border-2 border-green-400 bg-green-50';
          } else if (isSelected && !isCorrect) {
            cls += 'border-2 border-red-400 bg-red-50';
          } else {
            cls += 'opacity-60';
          }

          return (
            <button key={idx} onClick={() => pick(idx)} disabled={revealed} className={cls}>
              {revealed && isCorrect && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
              {revealed && isSelected && !isCorrect && <XCircle size={20} className="text-red-500 flex-shrink-0" />}
              {(!revealed || (!isCorrect && !isSelected)) && (
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
              )}
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{opt}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && exercise.explanation && (
        <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
          <p className="text-sm font-semibold text-indigo-800">💡 {exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
