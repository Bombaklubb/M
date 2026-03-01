"use client";

import { useState, useRef } from "react";
import type { FillInBlankExercise } from "@/lib/types";
import { playCorrect, playWrong } from "@/lib/sounds";

interface Props {
  exercise: FillInBlankExercise;
  onAnswer: (correct: boolean) => void;
}

export default function FillInBlank({ exercise, onAnswer }: Props) {
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
    if (correct) playCorrect();
    else playWrong();
    setTimeout(() => onAnswer(correct), 1300);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  const borderColor =
    state === "correct"
      ? "border-green-400 bg-green-50"
      : state === "wrong"
      ? "border-red-400 bg-red-50"
      : "border-blue-300 bg-white focus-within:border-blue-500";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sentence with blank */}
      <div className="text-xl font-medium text-gray-800 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-2">
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

      {/* Input */}
      {state === "idle" && (
        <div className="space-y-3">
          <div className={`flex gap-2 rounded-xl border-2 overflow-hidden transition-colors ${borderColor}`}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv ditt svar här..."
              className="flex-1 px-4 py-3 text-lg bg-transparent outline-none"
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

          {exercise.hint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
            >
              {showHint ? `💡 Tips: ${exercise.hint}` : "💡 Visa tips"}
            </button>
          )}
        </div>
      )}

      {/* Feedback */}
      {state !== "idle" && (
        <div
          className={`rounded-xl p-4 border animate-slide-up ${
            state === "correct"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
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
    </div>
  );
}
