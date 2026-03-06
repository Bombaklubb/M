"use client";

import { useState } from "react";
import type { BuildSentenceExercise } from "@/lib/types";
import { playCorrect, playWrong, playClick } from "@/lib/sounds";

interface Props {
  exercise: BuildSentenceExercise;
  onAnswer: (correct: boolean) => void;
  isLast?: boolean;
}

export default function BuildSentence({ exercise, onAnswer, isLast }: Props) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);

  const available = exercise.words.map((_, idx) => idx).filter((idx) => !placed.includes(idx));

  function addWord(idx: number) {
    if (state !== "idle") return;
    playClick();
    setPlaced((prev) => [...prev, idx]);
  }

  function removeWord(posInPlaced: number) {
    if (state !== "idle") return;
    playClick();
    setPlaced((prev) => prev.filter((_, i) => i !== posInPlaced));
  }

  function checkAnswer() {
    if (placed.length !== exercise.words.length) return;
    const correct =
      placed.length === exercise.correctOrder.length &&
      placed.every((wordIdx, pos) => wordIdx === exercise.correctOrder[pos]);
    setState(correct ? "correct" : "wrong");
    if (correct) playCorrect();
    else playWrong();
  }

  function reset() {
    setPlaced([]);
    setState("idle");
  }

  const correctSentence = exercise.correctOrder.map((i) => exercise.words[i]).join(" ");

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{exercise.instruction}</p>

      {/* Tips */}
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

      {/* Sentence construction area */}
      <div
        className={`min-h-[64px] p-3 rounded-xl border-2 flex flex-wrap gap-2 items-start transition-colors ${
          state === "correct"
            ? "border-green-400 bg-green-50 dark:bg-green-900/30"
            : state === "wrong"
            ? "border-red-400 bg-red-50 dark:bg-red-900/30"
            : "border-dashed border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
        }`}
      >
        {placed.length === 0 && state === "idle" && (
          <span className="text-gray-400 text-sm italic self-center">
            Klicka på ord nedan för att bygga meningen...
          </span>
        )}
        {placed.map((wordIdx, pos) => (
          <button
            key={`${wordIdx}-${pos}`}
            onClick={() => removeWord(pos)}
            disabled={state !== "idle"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
              state === "idle"
                ? "bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 hover:text-red-700 active:scale-95"
                : state === "correct"
                ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-800 dark:text-red-300"
            }`}
          >
            {exercise.words[wordIdx]}
          </button>
        ))}
      </div>

      {/* Available word bank */}
      {state === "idle" && (
        <div className="flex flex-wrap gap-2">
          {available.map((idx) => (
            <button
              key={idx}
              onClick={() => addWord(idx)}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium text-sm hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-95 transition-all duration-150"
            >
              {exercise.words[idx]}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      {state === "idle" && (
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="btn-secondary border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
          >
            🔄 Rensa
          </button>
          <button
            onClick={checkAnswer}
            disabled={placed.length !== exercise.words.length}
            className="btn-primary bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-sm"
          >
            Kontrollera ✓
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
            {state === "correct"
              ? "✓ Perfekt!"
              : `✗ Inte riktigt. Rätt: "${correctSentence}"`}
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
