import { useState } from 'react';
import { TrueFalseExercise } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  exercise: TrueFalseExercise;
  onAnswer: (correct: boolean) => void;
}

export default function TrueFalse({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<boolean | null>(null);

  function pick(val: boolean) {
    if (selected !== null) return;
    setSelected(val);
    setTimeout(() => onAnswer(val === exercise.isTrue), 900);
  }

  const revealed = selected !== null;

  function btnClass(val: boolean) {
    const base = 'flex-1 py-5 rounded-3xl font-heading font-bold text-xl flex items-center justify-center gap-3 transition-all cursor-pointer min-h-[80px] ';
    if (!revealed) return base + 'clay-card-sm hover:scale-[1.02] active:scale-[0.98] active:translate-y-0.5';
    const isCorrectAnswer = val === exercise.isTrue;
    const isChosen = selected === val;
    if (isCorrectAnswer) return base + 'border-2 border-green-400 bg-green-50';
    if (isChosen && !isCorrectAnswer) return base + 'border-2 border-red-400 bg-red-50';
    return base + 'opacity-50 clay-card-sm';
  }

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-black text-gray-800 leading-snug">{exercise.question}</p>

      <div className="flex gap-4 mt-6">
        <button onClick={() => pick(true)} disabled={revealed} className={btnClass(true)}>
          {revealed && exercise.isTrue && <CheckCircle size={24} className="text-green-500" />}
          {revealed && selected === true && !exercise.isTrue && <XCircle size={24} className="text-red-500" />}
          <span>Sant</span>
          <span className="text-2xl">✅</span>
        </button>
        <button onClick={() => pick(false)} disabled={revealed} className={btnClass(false)}>
          {revealed && !exercise.isTrue && <CheckCircle size={24} className="text-green-500" />}
          {revealed && selected === false && exercise.isTrue && <XCircle size={24} className="text-red-500" />}
          <span>Falskt</span>
          <span className="text-2xl">❌</span>
        </button>
      </div>

      {revealed && exercise.explanation && (
        <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
          <p className="text-sm font-semibold text-indigo-800">💡 {exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
