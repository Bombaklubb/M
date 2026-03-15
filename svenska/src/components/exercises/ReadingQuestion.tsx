"use client";

import { useState } from "react";
import type { ReadingQuestion as RQ } from "@/lib/types";

const LEVEL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  "on-the-line": {
    label: "På raden",
    color: "bg-sv-100 dark:bg-sv-900/30 text-sv-700 dark:text-sv-300",
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
  isLast?: boolean;
}

export default function ReadingQuestion({ question, onAnswer, isLast }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const level = LEVEL_LABELS[question.type] ?? LEVEL_LABELS["on-the-line"];

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  function optionStyle(idx: number): string {
    const base =
      "w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base touch-manipulation ";
    if (!revealed) {
      return base + "border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 hover:border-sv-400 hover:bg-sv-50 dark:hover:bg-sv-900/30 cursor-pointer";
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
      <span className={`badge text-xs ${level.color}`}>
        {level.icon} {level.label}
      </span>

      <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
        {question.question}
      </p>

      {question.hint && (
        <div className="rounded-xl overflow-hidden border border-amber-200 dark:border-amber-700">
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <span className="flex items-center gap-2"><span>💡</span><span>Tips</span></span>
            <span className="text-amber-500 text-xs">{showHint ? "▲" : "▼"}</span>
          </button>
          {showHint && (
            <div className="px-4 py-3 text-sm text-amber-900 dark:text-amber-200 bg-amber-50/60 dark:bg-amber-900/10 border-t border-amber-200 dark:border-amber-700">
              {question.hint}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button key={idx} className={optionStyle(idx)} onClick={() => handleSelect(idx)} disabled={revealed}>
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
        <div className="bg-sv-50 dark:bg-sv-900/30 border border-sv-200 dark:border-sv-700 rounded-xl p-4 text-sm text-sv-800 dark:text-sv-200 animate-slide-up">
          💡 {question.explanation}
        </div>
      )}

      {revealed && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => onAnswer(selected === question.correctIndex)}
            className="btn-primary animate-slide-up"
            style={{ background: "linear-gradient(135deg, #006AA7, #004a75)" }}
          >
            {isLast ? "Visa resultat →" : "Nästa fråga →"}
          </button>
        </div>
      )}
    </div>
  );
}
