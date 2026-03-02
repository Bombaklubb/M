"use client";

import { useState } from "react";
import type { ReadingQuestion as RQ } from "@/lib/types";
import { playCorrect, playWrong } from "@/lib/sounds";

const LEVEL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  "on-the-line": {
    label: "På raden",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    icon: "📄",
  },
  "between-the-lines": {
    label: "Mellan raderna",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    icon: "🔍",
  },
  "beyond-the-lines": {
    label: "Bortom raderna",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    icon: "💭",
  },
};

interface Props {
  question: RQ;
  onAnswer: (correct: boolean) => void;
}

export default function ReadingQuestion({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const level = LEVEL_LABELS[question.type] ?? LEVEL_LABELS["on-the-line"];

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const correct = idx === question.correctIndex;
    if (correct) playCorrect();
    else playWrong();
    setTimeout(() => onAnswer(correct), 1200);
  }

  function optionStyle(idx: number): string {
    const base =
      "w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-200 text-base ";
    if (!revealed) {
      return base + "border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer";
    }
    if (idx === question.correctIndex) {
      return base + "border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 animate-pop";
    }
    if (idx === selected && selected !== question.correctIndex) {
      return base + "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 animate-shake";
    }
    return base + "border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500";
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Level badge */}
      <span className={`badge text-xs ${level.color}`}>
        {level.icon} {level.label}
      </span>

      <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
        {question.question}
      </p>

      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={optionStyle(idx)}
            onClick={() => handleSelect(idx)}
            disabled={revealed}
          >
            <span className="inline-flex items-center gap-3">
              <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm flex-shrink-0">
                {revealed && idx === question.correctIndex
                  ? "✓"
                  : revealed && idx === selected && selected !== question.correctIndex
                  ? "✗"
                  : String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </span>
          </button>
        ))}
      </div>

      {revealed && question.explanation && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200 animate-slide-up">
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}
