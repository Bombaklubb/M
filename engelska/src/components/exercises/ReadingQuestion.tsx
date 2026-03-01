"use client";

import { useState } from "react";
import type { ReadingQuestion as RQ } from "@/lib/types";
import { playCorrect, playWrong } from "@/lib/sounds";

const LEVEL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  "on-the-line": {
    label: "På raden",
    color: "bg-blue-100 text-blue-700",
    icon: "📄",
  },
  "between-the-lines": {
    label: "Mellan raderna",
    color: "bg-purple-100 text-purple-700",
    icon: "🔍",
  },
  "beyond-the-lines": {
    label: "Bortom raderna",
    color: "bg-orange-100 text-orange-700",
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
      return base + "border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
    }
    if (idx === question.correctIndex) {
      return base + "border-green-400 bg-green-50 text-green-800 animate-pop";
    }
    if (idx === selected && selected !== question.correctIndex) {
      return base + "border-red-400 bg-red-50 text-red-800 animate-shake";
    }
    return base + "border-gray-100 bg-gray-50 text-gray-400";
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Level badge */}
      <span className={`badge text-xs ${level.color}`}>
        {level.icon} {level.label}
      </span>

      <p className="text-lg font-semibold text-gray-800 leading-relaxed">
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 animate-slide-up">
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}
