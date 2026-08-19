import { useState } from 'react';
import { SpotTheErrorExercise } from '../../types';
import { XCircle, CheckCircle } from 'lucide-react';

interface Props {
  exercise: SpotTheErrorExercise;
  onAnswer: (isCorrect: boolean) => void;
}

export default function SpotTheError({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    onAnswer(i === exercise.correctIndex);
  }

  return (
    <div>
      {/* Wrong statement banner */}
      <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 mb-5">
        <p className="text-xs font-black text-red-500 uppercase tracking-wide mb-2">🚨 Felaktigt påstående</p>
        <p className="text-base font-semibold text-gray-800 leading-relaxed italic">"{exercise.wrongStatement}"</p>
      </div>

      <p className="font-heading font-bold text-gray-800 text-lg mb-4">{exercise.question}</p>

      <div className="space-y-3">
        {exercise.options.map((opt, i) => {
          const isCorrect = i === exercise.correctIndex;
          const isSelected = selected === i;

          let cls = 'clay-card-sm p-4 w-full text-left transition-all cursor-pointer';
          if (selected === null) {
            cls += ' hover:scale-[1.01] active:scale-[0.99]';
          } else if (isCorrect) {
            cls += ' border-green-400 bg-green-50';
          } else if (isSelected) {
            cls += ' border-red-400 bg-red-50';
          } else {
            cls += ' opacity-50';
          }

          return (
            <button key={i} onClick={() => choose(i)} disabled={selected !== null} className={cls}>
              <div className="flex items-start gap-3">
                {selected !== null && (
                  isCorrect
                    ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    : isSelected
                      ? <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      : <span className="w-[18px] flex-shrink-0" />
                )}
                <p className="text-sm font-semibold text-gray-700 leading-relaxed">{opt}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && exercise.explanation && (
        <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
          <p className="text-sm font-semibold text-indigo-800">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
