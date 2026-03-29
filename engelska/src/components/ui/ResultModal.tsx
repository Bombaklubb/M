"use client";

import type { ChestType } from "@/lib/types";
import { CHEST_META } from "@/lib/gamification";

function ChestImage({ type }: { type: ChestType }) {
  return (
    <img
      src={CHEST_META[type].image}
      alt={CHEST_META[type].label}
      className="w-10 h-10 flex-shrink-0 object-contain"
    />
  );
}

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
    <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white dark:bg-gray-800 rounded-4xl p-8 max-w-md w-full text-center animate-slide-up border-4 border-indigo-100 dark:border-gray-700"
        style={{
          boxShadow: "0 10px 0 0 rgba(99, 102, 241, 0.15), 0 20px 40px -8px rgba(99, 102, 241, 0.25), inset 0 4px 8px 0 rgba(255, 255, 255, 0.8)"
        }}
      >
        <div className="text-7xl mb-4 animate-bounce-slow">{passed ? "🎉" : "💪"}</div>

        <h2 className="text-3xl font-black text-indigo-900 dark:text-gray-100 mb-2">
          {passed ? "Bra jobbat!" : "Försök igen!"}
        </h2>

        <p className="text-indigo-400 dark:text-gray-400 mb-6 text-lg font-medium">
          {passed
            ? "Du klarade övningen med godkänt resultat."
            : "Du är nästan framme – öva lite till!"}
        </p>

        {/* Score ring */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${
              passed ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30" : "border-orange-400 bg-orange-50 dark:bg-orange-900/30"
            }`}
            style={{
              boxShadow: passed
                ? "0 6px 0 0 rgba(16, 185, 129, 0.3), inset 0 4px 8px 0 rgba(255, 255, 255, 0.8)"
                : "0 6px 0 0 rgba(251, 146, 60, 0.3), inset 0 4px 8px 0 rgba(255, 255, 255, 0.8)"
            }}
          >
            <span className={`text-4xl font-black ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}`}>
              {pct}%
            </span>
            <span className="text-sm text-indigo-400 dark:text-gray-400 mt-1 font-bold">
              {totalCorrect}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Points */}
        <div
          className="bg-gradient-to-b from-amber-50 to-amber-100 dark:bg-amber-900/30 border-3 border-amber-300 dark:border-amber-700 rounded-2xl p-5 mb-6"
          style={{
            boxShadow: "0 4px 0 0 rgba(245, 158, 11, 0.25), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
          }}
        >
          <div className="flex items-center justify-center gap-3 text-amber-700 dark:text-amber-300">
            <span className="text-3xl">⭐</span>
            <div>
              <span className="text-3xl font-black">{points}</span>
              <span className="text-lg ml-1 font-bold">poäng</span>
            </div>
          </div>
          {bonusPoints > 0 && passed && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-bold">
              + {bonusPoints} bonuspoäng för godkänt! 🏆
            </p>
          )}
        </div>

        {/* Chest earned notification */}
        {chestEarned && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-3 mb-4 flex items-center gap-3">
            <ChestImage type={chestEarned} />
            <div className="text-left">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Du fick en {CHEST_META[chestEarned].label}!
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
        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 btn-secondary border-indigo-200 dark:border-gray-600 text-indigo-600 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700"
          >
            🔄 Försök igen
          </button>
          <button
            onClick={onContinue}
            className="flex-1 btn-primary bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 border-3 border-indigo-400"
          >
            Fortsätt →
          </button>
        </div>
      </div>
    </div>
  );
}
