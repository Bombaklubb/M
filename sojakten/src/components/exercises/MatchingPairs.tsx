import { useState, useMemo } from 'react';
import { MatchingExercise } from '../../types';
import { CheckCircle } from 'lucide-react';

interface Props {
  exercise: MatchingExercise;
  onAnswer: (correct: boolean) => void;
}

export default function MatchingPairs({ exercise, onAnswer }: Props) {
  const shuffledRight = useMemo(() => [...exercise.pairs].sort(() => Math.random() - 0.5), [exercise.id]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<{ leftIdx: number; rightIdx: number; correct: boolean }[]>([]);
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const matchedLefts = new Set(matched.map(m => m.leftIdx));
  const matchedRights = new Set(matched.map(m => m.rightIdx));

  function pickLeft(idx: number) {
    if (done || matchedLefts.has(idx)) return;
    setSelectedLeft(idx);
  }

  function pickRight(rightIdx: number) {
    if (done || matchedRights.has(rightIdx) || selectedLeft === null) return;
    const leftPair = exercise.pairs[selectedLeft];
    const rightPair = shuffledRight[rightIdx];
    const correct = leftPair.right === rightPair.right;

    const newMatch = { leftIdx: selectedLeft, rightIdx, correct };
    const newMatched = [...matched, newMatch];
    setMatched(newMatched);
    setSelectedLeft(null);

    if (!correct) {
      setWrongFlash(rightIdx);
      setTimeout(() => {
        setWrongFlash(null);
        setMatched(prev => prev.filter(m => m !== newMatch));
      }, 700);
      return;
    }

    if (newMatched.filter(m => m.correct).length === exercise.pairs.length) {
      setDone(true);
      const allCorrect = newMatched.every(m => m.correct);
      setTimeout(() => onAnswer(allCorrect), 600);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-black text-gray-800 leading-snug">{exercise.question}</p>
      <p className="text-xs text-gray-500 font-semibold">Tryck på ett ord till vänster, sedan rätt match till höger.</p>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* Left column */}
        <div className="space-y-2">
          {exercise.pairs.map((pair, idx) => {
            const isMatched = matchedLefts.has(idx);
            const isSelected = selectedLeft === idx;
            return (
              <button
                key={idx}
                onClick={() => pickLeft(idx)}
                disabled={isMatched || done}
                className={`
                  w-full p-3 rounded-2xl text-sm font-bold text-left transition-all min-h-[52px]
                  ${isMatched
                    ? 'bg-green-100 border-2 border-green-300 text-green-800 cursor-default'
                    : isSelected
                    ? 'bg-indigo-100 border-2 border-indigo-400 text-indigo-900 scale-[1.02]'
                    : 'clay-card-sm hover:border-indigo-300 cursor-pointer active:scale-95'}
                `}
              >
                {isMatched && <CheckCircle size={14} className="inline mr-1 text-green-500" />}
                {pair.left}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {shuffledRight.map((pair, rightIdx) => {
            const match = matched.find(m => m.rightIdx === rightIdx && m.correct);
            const isMatched = !!match;
            const isWrong = wrongFlash === rightIdx;
            return (
              <button
                key={rightIdx}
                onClick={() => pickRight(rightIdx)}
                disabled={isMatched || done || selectedLeft === null}
                className={`
                  w-full p-3 rounded-2xl text-sm font-bold text-left transition-all min-h-[52px]
                  ${isMatched
                    ? 'bg-green-100 border-2 border-green-300 text-green-800 cursor-default'
                    : isWrong
                    ? 'bg-red-100 border-2 border-red-400 text-red-800 animate-bounce'
                    : selectedLeft !== null
                    ? 'clay-card-sm hover:border-purple-400 hover:bg-purple-50 cursor-pointer active:scale-95'
                    : 'clay-card-sm opacity-60 cursor-default'}
                `}
              >
                {isMatched && <CheckCircle size={14} className="inline mr-1 text-green-500" />}
                {pair.right}
              </button>
            );
          })}
        </div>
      </div>

      {done && exercise.explanation && (
        <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
          <p className="text-sm font-semibold text-indigo-800">💡 {exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
