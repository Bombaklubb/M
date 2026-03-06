"use client";

import { useState, useRef } from "react";
import type { FillInBlankExercise } from "@/lib/types";

interface Props {
  exercise: FillInBlankExercise;
  onAnswer: (correct: boolean) => void;
  isLast?: boolean;
}

export default function FillInBlank({ exercise, onAnswer, isLast }: Props) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parts = exercise.sentence.split("___");

  function handleSubmit() {
    if (state !== "idle" || !input.trim()) return;
    const correct =
      input.trim().toLowerCase() === exercise.answer.toLowerCase();
    setState(correct ? "correct" : "wrong");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  const borderColor =
    state === "correct"
      ? "border-green-400 bg-green-50 dark:bg-green-900/30"
      : state === "wrong"
      ? "border-red-400 bg-red-50 dark:bg-red-900/30"
      : "border-blue-300 bg-white dark:bg-gray-700 dark:border-blue-600 focus-within:border-blue-500";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sentence with blank */}
      <div className="text-xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-2">
        <span>{parts[0]}</span>
        <span
          className={`inline-flex items-center border-b-4 px-1 min-w-[80px] transition-colors duration-300 ${
            state === "correct"
              ? "border-green-400 text-green-700"
              : state === "wrong"
              ? "border-red-400 text-red-700"
              : "border-blue-400 text-blue-700"
          }`}
        >
          {state !== "idle" ? (
            <span className="font-bold">
              {state === "correct" ? input : exercise.answer}
            </span>
          ) : (
            <span className="text-gray-400 text-sm italic">svar</span>
          )}
        </span>
        {parts[1] && <span>{parts[1]}</span>}
      </div>

      {/* Tips – always visible if hint exists */}
      {exercise.hint && (
        <div className="rounded-xl overflow-hidden border border-amber-200 dark:border-amber-700">
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>💡</span>
              <span>Tips</span>
            </span>
            <span className="text-amber-500 text-xs">{showHint ? "▲" : "▼"}</span>
          </button>
          {showHint && (
            <div className="px-4 py-3 text-sm text-amber-900 dark:text-amber-200 bg-amber-50/60 dark:bg-amber-900/10 border-t border-amber-200 dark:border-amber-700">
              {exercise.hint}
            </div>
          )}
        </div>
      )}

      {/* Input */}
      {state === "idle" && (
        <div className={`flex gap-2 rounded-xl border-2 overflow-hidden transition-colors ${borderColor}`}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv ditt svar här..."
            className="flex-1 px-4 py-3 text-lg bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white font-semibold transition-colors"
          >
            ✓
          </button>
        </div>
      )}

      {/* Feedback */}
      {state !== "idle" && (
        <div
          className={`rounded-xl p-4 border animate-slide-up ${
            state === "correct"
              ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300"
          }`}
        >
          <p className="font-semibold">
            {state === "correct" ? "✓ Rätt!" : `✗ Fel. Rätt svar: "${exercise.answer}"`}
          </p>
          {exercise.explanation && (
            <p className="text-sm mt-1 opacity-80">💡 {exercise.explanation}</p>
          )}
        </div>
      )}

      {state !== "idle" && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => onAnswer(state === "correct")}
            className="btn-primary bg-blue-500 hover:bg-blue-600 animate-slide-up"
          >
            {isLast ? "Visa resultat →" : "Nästa fråga →"}
          </button>
        </div>
      )}
    </div>
  );
}
