"use client";

import { useState } from "react";
import type { MultipleChoiceExercise } from "@/lib/types";
import { playCorrect, playWrong } from "@/lib/sounds";

interface Props {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const correct = idx === exercise.correctIndex;
    if (correct) playCorrect();
    else playWrong();
    setTimeout(() => onAnswer(correct), 1200);
  }

  function optionStyle(idx: number): string {
    const base =
      "w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-200 text-base ";
    if (!revealed) {
      return base + "border-gray-200 hover:border-blue-400 hover:bg-blue-50 active:scale-98 cursor-pointer";
    }
    if (idx === exercise.correctIndex) {
      return base + "border-green-400 bg-green-50 text-green-800 animate-pop";
    }
    if (idx === selected && selected !== exercise.correctIndex) {
      return base + "border-red-400 bg-red-50 text-red-800 animate-shake";
    }
    return base + "border-gray-100 bg-gray-50 text-gray-400";
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-xl font-semibold text-gray-800 leading-relaxed">
        {exercise.question}
      </p>

      <div className="space-y-3">
        {exercise.options.map((opt, idx) => (
          <button
            key={idx}
            className={optionStyle(idx)}
            onClick={() => handleSelect(idx)}
            disabled={revealed}
          >
            <span className="inline-flex items-center gap-3">
              <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm flex-shrink-0">
                {revealed && idx === exercise.correctIndex
                  ? "✓"
                  : revealed && idx === selected && selected !== exercise.correctIndex
                  ? "✗"
                  : String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </span>
          </button>
        ))}
      </div>

      {revealed && exercise.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 animate-slide-up">
          💡 {exercise.explanation}
        </div>
      )}
    </div>
  );
}
