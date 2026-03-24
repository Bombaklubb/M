"use client";

import { useState } from "react";
import type { MysteryBoxReward, ChestType } from "@/lib/types";
import { CHEST_META } from "@/lib/gamification";

interface MysteryBoxPopupProps {
  reward: MysteryBoxReward;
  onClose: () => void;
}

function ChestImage({ type }: { type: ChestType }) {
  return (
    <img
      src={CHEST_META[type].image}
      alt={CHEST_META[type].label}
      className="w-16 h-16 mx-auto object-contain"
    />
  );
}

export default function MysteryBoxPopup({ reward, onClose }: MysteryBoxPopupProps) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    setOpened(true);
  }

  const REWARD_ICONS: Record<string, string> = { points: "⭐", badge: "🎖️" };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
        style={{
          border: "3px solid #a855f7",
          boxShadow: "0 8px 32px rgba(168,85,247,0.3), 0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {!opened ? (
          <>
            {/* Mystery box closed state */}
            <div
              className="text-7xl mb-4 animate-bounce cursor-pointer select-none"
              style={{ animationDuration: "1s" }}
            >
              🎁
            </div>
            <h2 className="text-2xl font-black text-purple-700 dark:text-purple-300 mb-2">
              Mysterykista!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Du hittade en mysterykista! Klicka för att öppna den.
            </p>
            <button
              onClick={handleOpen}
              className="w-full py-3 px-6 rounded-2xl font-bold text-white text-lg cursor-pointer transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                border: "3px solid #7c3aed",
                boxShadow: "0 4px 12px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              Öppna kistan!
            </button>
          </>
        ) : (
          <>
            {/* Mystery box opened state */}
            <div
              className="mb-4 select-none"
              style={{
                animation: "pop 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
              }}
            >
              {reward.type === "chest" && reward.chestType
                ? <ChestImage type={reward.chestType} />
                : <span className="text-7xl">{REWARD_ICONS[reward.type]}</span>
              }
            </div>
            <h2 className="text-2xl font-black text-purple-700 dark:text-purple-300 mb-2">
              Du vann!
            </h2>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">
              {reward.description}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl font-bold text-white text-base cursor-pointer transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "3px solid #16a34a",
                boxShadow: "0 4px 12px rgba(34,197,94,0.4)",
              }}
            >
              Häftigt! Fortsätt →
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pop {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
