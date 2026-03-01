"use client";

import { useState } from "react";
import type { BuildSentenceExercise } from "@/lib/types";
import { playCorrect, playWrong, playClick } from "@/lib/sounds";

interface Props {
  exercise: BuildSentenceExercise;
  onAnswer: (correct: boolean) => void;
}

export default function BuildSentence({ exercise, onAnswer }: Props) {
  // Track which words have been placed and their order
  const [placed, setPlaced] = useState<number[]>([]); // indices into exercise.words
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");

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
    setTimeout(() => onAnswer(correct), 1400);
  }

  function reset() {
    setPlaced([]);
    setState("idle");
  }

  const correctSentence = exercise.correctOrder.map((i) => exercise.words[i]).join(" ");

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xl font-semibold text-gray-800">{exercise.instruction}</p>

      {/* Sentence construction area */}
      <div
        className={`min-h-[64px] p-3 rounded-xl border-2 flex flex-wrap gap-2 items-start transition-colors ${
          state === "correct"
            ? "border-green-400 bg-green-50"
            : state === "wrong"
            ? "border-red-400 bg-red-50"
            : "border-dashed border-blue-300 bg-blue-50/50"
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
                ? "bg-white border-blue-300 text-blue-800 hover:bg-red-50 hover:border-red-300 hover:text-red-700 active:scale-95"
                : state === "correct"
                ? "bg-green-100 border-green-300 text-green-800"
                : "bg-red-100 border-red-300 text-red-800"
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
              className="px-4 py-2 rounded-xl border-2 border-gray-200 bg-white text-gray-800 font-medium text-sm hover:border-blue-400 hover:bg-blue-50 active:scale-95 transition-all duration-150"
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
            className="btn-secondary border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
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
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
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
    </div>
  );
}
