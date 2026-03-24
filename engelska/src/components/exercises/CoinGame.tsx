"use client";

import { useState, useEffect } from "react";
import type { CoinGameQuestion } from "@/lib/types";

interface Props {
  questions: CoinGameQuestion[];
  onComplete: (coinsCollected: number, livesLeft: number) => void;
}

const MAX_LIVES = 3;
const LABELS = ["A", "B", "C", "D"];

export default function CoinGame({ questions, onComplete }: Props) {
  const total = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [coinsCollected, setCoinsCollected] = useState(0);
  // coinStatus: true = correct, false = wrong, null = not answered yet
  const [coinStatus, setCoinStatus] = useState<(boolean | null)[]>(
    Array(total).fill(null)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [runnerX, setRunnerX] = useState(0);
  const [shake, setShake] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Update runner position based on coins collected
  useEffect(() => {
    const pct = total > 0 ? (coinsCollected / total) * 82 : 0;
    setRunnerX(pct);
  }, [coinsCollected, total]);

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);

    const correct = idx === currentQuestion.correctIndex;
    const newStatus = [...coinStatus];
    newStatus[currentIndex] = correct;
    setCoinStatus(newStatus);

    if (correct) {
      setCoinsCollected((c) => c + 1);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  function handleNext() {
    const nextIndex = currentIndex + 1;
    const gameDone = nextIndex >= total || lives <= 0;

    if (gameDone) {
      const finalCoins = coinStatus.filter((s) => s === true).length +
        (selected === currentQuestion.correctIndex ? 1 : 0);
      // already counted in coinsCollected
      onComplete(coinsCollected, lives <= 0 && selected !== currentQuestion.correctIndex ? 0 : lives);
    } else {
      setCurrentIndex(nextIndex);
      setSelected(null);
      setRevealed(false);
    }
  }

  function optionStyle(idx: number): string {
    const base =
      "w-full text-left px-3 py-3 sm:px-4 sm:py-3.5 rounded-xl border-2 font-semibold transition-all duration-200 text-sm touch-manipulation flex items-center gap-2.5 ";
    if (!revealed) {
      return (
        base +
        "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer active:scale-95"
      );
    }
    if (idx === currentQuestion.correctIndex) {
      return (
        base +
        "border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300"
      );
    }
    if (idx === selected && selected !== currentQuestion.correctIndex) {
      return (
        base +
        "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300"
      );
    }
    return (
      base +
      "border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
    );
  }

  const isGameOver = revealed && lives <= 0 && selected !== currentQuestion.correctIndex;
  const isLastQuestion = currentIndex + 1 >= total;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Coin progress track ── */}
      <div className="flex gap-1.5 flex-wrap justify-center px-1">
        {questions.map((_, i) => {
          const status = coinStatus[i];
          return (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i < total
                  ? "flex-1 min-w-[18px] max-w-[36px]"
                  : "w-5"
              } ${
                status === true
                  ? "bg-amber-400"
                  : status === false
                  ? "bg-red-300"
                  : i === currentIndex
                  ? "bg-blue-300"
                  : "bg-gray-200 dark:bg-gray-600"
              }`}
            />
          );
        })}
      </div>

      {/* ── Game arena ── */}
      <div className="rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600">
        {/* Sky */}
        <div
          className="relative bg-sky-200 dark:bg-sky-900"
          style={{ height: "90px" }}
        >
          {/* Runner */}
          <div
            className={`absolute bottom-0 text-3xl select-none transition-all duration-500 ${shake ? "animate-shake" : ""}`}
            style={{ left: `${runnerX}%`, lineHeight: 1 }}
          >
            🏃
          </div>
        </div>
        {/* Ground */}
        <div className="bg-green-500 dark:bg-green-700 h-4 relative">
          {/* Dashed lane markings */}
          <div className="absolute inset-0 flex items-center px-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-green-400/60 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Lives ── */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: MAX_LIVES }).map((_, i) => (
          <span
            key={i}
            className={`text-2xl transition-all duration-300 ${
              i < lives ? "opacity-100" : "opacity-20 grayscale"
            }`}
          >
            🛡️
          </span>
        ))}
      </div>

      {/* ── Question ── */}
      <div className="card !py-4 !px-4 sm:!px-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪙</span>
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
            Mynt {currentIndex + 1} av {total}
          </span>
        </div>

        <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 leading-snug">
          {currentQuestion.question}
        </p>

        {/* ── Answer buttons ── */}
        <div className="grid grid-cols-2 gap-2">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              className={optionStyle(idx)}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  revealed && idx === currentQuestion.correctIndex
                    ? "bg-green-500 border-green-500 text-white"
                    : revealed &&
                      idx === selected &&
                      selected !== currentQuestion.correctIndex
                    ? "bg-red-500 border-red-500 text-white"
                    : ""
                }`}
              >
                {revealed && idx === currentQuestion.correctIndex
                  ? "✓"
                  : revealed &&
                    idx === selected &&
                    selected !== currentQuestion.correctIndex
                  ? "✗"
                  : LABELS[idx]}
              </span>
              <span className="leading-tight">{opt}</span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {revealed && currentQuestion.explanation && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            💡 {currentQuestion.explanation}
          </div>
        )}

        {/* Next button */}
        {revealed && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleNext}
              className={`btn-primary ${
                isGameOver
                  ? "bg-gray-500 hover:bg-gray-600"
                  : selected === currentQuestion.correctIndex
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {isLastQuestion || isGameOver ? "Visa resultat →" : "Nästa mynt →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
