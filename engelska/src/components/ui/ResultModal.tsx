"use client";

import type { ChestType } from "@/lib/types";

const CHEST_LABELS: Record<ChestType, string> = {
  wood: "Trälåda",
  silver: "Silverlåda",
  gold: "Guldlåda",
};
const CHEST_EMOJIS: Record<ChestType, string> = {
  wood: "📦",
  silver: "🪙",
  gold: "🏆",
};

interface ResultModalProps {
  points: number;
  bonusPoints: number;
  totalCorrect: number;
  totalQuestions: number;
  chestEarned?: ChestType;
  bossUnlocked?: boolean;
  onContinue: () => void;
  onRetry: () => void;
}

export default function ResultModal({
  points,
  bonusPoints,
  totalCorrect,
  totalQuestions,
  chestEarned,
  bossUnlocked,
  onContinue,
  onRetry,
}: ResultModalProps) {
  const pct = Math.round((totalCorrect / totalQuestions) * 100);
  const passed = pct >= 60;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-slide-up">
        <div className="text-6xl mb-4">{passed ? "🎉" : "💪"}</div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {passed ? "Bra jobbat!" : "Försök igen!"}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {passed
            ? "Du klarade övningen med godkänt resultat."
            : "Du är nästan framme – öva lite till!"}
        </p>

        {/* Score ring */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-8 ${
              passed ? "border-green-400 bg-green-50 dark:bg-green-900/30" : "border-orange-400 bg-orange-50 dark:bg-orange-900/30"
            }`}
          >
            <span className={`text-3xl font-black ${passed ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}>
              {pct}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {totalCorrect}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Points */}
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
            <span className="text-2xl">⭐</span>
            <div>
              <span className="text-2xl font-black">{points}</span>
              <span className="text-sm ml-1">poäng</span>
            </div>
          </div>
          {bonusPoints > 0 && passed && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              + {bonusPoints} bonuspoäng för godkänt! 🏆
            </p>
          )}
        </div>

        {/* Chest earned notification */}
        {chestEarned && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-3 mb-4 flex items-center gap-3">
            <span className="text-3xl">{CHEST_EMOJIS[chestEarned]}</span>
            <div className="text-left">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Du fick en {CHEST_LABELS[chestEarned]}!
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Öppna den på Hemliga kistor-sidan.
              </p>
            </div>
          </div>
        )}

        {/* Boss unlocked notification */}
        {bossUnlocked && (
          <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 rounded-2xl p-3 mb-4 flex items-center gap-3">
            <span className="text-3xl">⚔️</span>
            <div className="text-left">
              <p className="text-sm font-bold text-red-800 dark:text-red-300">
                Boss Challenge upplåst!
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Gå till Hemliga kistor för att utmana bossen.
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 btn-secondary border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            🔄 Försök igen
          </button>
          <button
            onClick={onContinue}
            className="flex-1 btn-primary bg-blue-500 hover:bg-blue-600"
          >
            Fortsätt →
          </button>
        </div>
      </div>
    </div>
  );
}
