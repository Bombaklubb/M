"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import {
  loadStudent,
  saveStudent,
  loadGamification,
  saveGamification,
} from "@/lib/storage";
import {
  CHEST_META,
  ALL_BADGES,
  BOSS_UNLOCK_THRESHOLD,
  getBadge,
  openWoodChest,
  openSilverChest,
  openGoldChest,
} from "@/lib/gamification";
import type { StudentData, GamificationData, Chest, ChestType } from "@/lib/types";

function ChestCard({
  chest,
  onOpen,
}: {
  chest: Chest;
  onOpen: (id: string) => void;
}) {
  const meta = CHEST_META[chest.type];
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    if (chest.opened || animating) return;
    setAnimating(true);
    setTimeout(() => {
      onOpen(chest.id);
      setAnimating(false);
    }, 500);
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col items-center p-5 rounded-3xl transition-all ${
        !chest.opened
          ? `bg-gradient-to-br ${meta.color} hover:scale-105 active:scale-95 cursor-pointer`
          : "bg-gray-100 dark:bg-gray-700 cursor-default opacity-60"
      }`}
      style={{
        border: "3px solid",
        borderColor: chest.opened ? "#cbd5e1" : "rgba(255,255,255,0.3)",
        boxShadow: chest.opened
          ? "none"
          : `0 6px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)`,
        transform: animating ? "scale(1.08) rotate(-3deg)" : "scale(1)",
        transition: "transform 0.15s ease-out, box-shadow 0.15s",
      }}
    >
      <span
        className="text-5xl mb-3 select-none"
        style={{
          filter: chest.opened ? "grayscale(1)" : "none",
          animation: animating ? "shake 0.4s ease-in-out" : "none",
        }}
      >
        {chest.opened ? "🔓" : meta.emoji}
      </span>

      <span
        className={`text-sm font-bold mb-1 ${
          chest.opened ? "text-gray-400 dark:text-gray-500" : "text-white"
        }`}
      >
        {meta.label}
      </span>

      {chest.opened ? (
        <span className="text-xs text-gray-400 dark:text-gray-500">Öppnad</span>
      ) : (
        <span className="text-xs text-white/80 mt-1">Tryck för att öppna</span>
      )}

      {chest.opened && chest.openedReward && (
        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 leading-snug">
          {chest.openedReward}
        </p>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg) scale(1.05); }
          40% { transform: rotate(8deg) scale(1.1); }
          60% { transform: rotate(-5deg) scale(1.05); }
          80% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

interface RewardResult {
  description: string;
  points: number;
}

function RewardPopup({
  result,
  onClose,
}: {
  result: RewardResult;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center"
        style={{
          border: "3px solid #f59e0b",
          boxShadow: "0 8px 32px rgba(245,158,11,0.35), 0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div className="text-6xl mb-4" style={{ animation: "popIn 0.4s cubic-bezier(0.36,0.07,0.19,0.97)" }}>
          🎉
        </div>
        <h2 className="text-2xl font-black text-amber-700 dark:text-amber-300 mb-3">
          Lådan är öppnad!
        </h2>
        <p className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
          {result.description}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white text-base cursor-pointer transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            border: "3px solid #d97706",
            boxShadow: "0 4px 12px rgba(217,119,6,0.4)",
          }}
        >
          Toppen! ✓
        </button>
        <style jsx>{`
          @keyframes popIn {
            0% { transform: scale(0.3); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function KistorPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [gam, setGam] = useState<GamificationData | null>(null);
  const [rewardResult, setRewardResult] = useState<RewardResult | null>(null);

  useEffect(() => {
    const s = loadStudent();
    if (!s) { router.push("/"); return; }
    setStudent(s);
    setGam(loadGamification());
  }, []);

  if (!student || !gam) return null;

  const unopened = gam.chests.filter((c) => !c.opened);
  const opened = gam.chests.filter((c) => c.opened);
  const exercisesLeft = Math.max(0, BOSS_UNLOCK_THRESHOLD - gam.exercisesCompleted);

  function handleOpenChest(chestId: string) {
    if (!gam || !student) return;

    const chest = gam.chests.find((c) => c.id === chestId);
    if (!chest || chest.opened) return;

    let result: { points: number; badge?: string; bonusChest?: Chest; description: string };

    if (chest.type === "wood") {
      result = { ...openWoodChest(), badge: undefined, bonusChest: undefined };
    } else if (chest.type === "silver") {
      result = openSilverChest(gam.badges);
    } else {
      result = openGoldChest(gam.badges);
    }

    const newChests = gam.chests.map((c) =>
      c.id === chestId ? { ...c, opened: true, openedReward: result.description } : c
    );
    const newBadges = result.badge && !gam.badges.includes(result.badge)
      ? [...gam.badges, result.badge]
      : gam.badges;
    if (result.bonusChest) newChests.push(result.bonusChest);

    const newGam = { ...gam, chests: newChests, badges: newBadges };
    saveGamification(newGam);
    setGam({ ...newGam });

    const updatedStudent = { ...student, totalPoints: student.totalPoints + result.points };
    saveStudent(updatedStudent);
    setStudent(updatedStudent);

    setRewardResult({ description: result.description, points: result.points });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      <div
        className="text-white"
        style={{ background: "linear-gradient(135deg, #92400e, #b45309, #d97706)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Tillbaka
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <div>
              <h1 className="text-2xl font-black">Hemliga Kistor</h1>
              <p className="text-white/70 text-sm">Öppna kistor och vinn belöningar!</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Boss challenge card */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: gam.bossUnlocked
              ? "linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)"
              : "linear-gradient(135deg, #374151, #4b5563)",
            border: "3px solid",
            borderColor: gam.bossUnlocked ? "#ef4444" : "#6b7280",
            boxShadow: gam.bossUnlocked
              ? "0 6px 24px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "none",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{gam.bossUnlocked ? "⚔️" : "🔒"}</span>
              <div>
                <h2 className="text-lg font-black text-white">Boss Challenge</h2>
                <p className="text-white/70 text-sm">
                  {gam.bossUnlocked
                    ? `Utmana bossen! Du har vunnit ${gam.bossWins} gång${gam.bossWins !== 1 ? "er" : ""}.`
                    : `Slutför ${exercisesLeft} övning${exercisesLeft !== 1 ? "ar" : ""} till för att låsa upp.`}
                </p>
              </div>
            </div>
            {gam.bossUnlocked && (
              <Link
                href="/boss"
                className="px-5 py-2.5 rounded-2xl font-bold text-sm text-red-900 cursor-pointer transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                  border: "2px solid #fca5a5",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                }}
              >
                Utmana bossen! ⚔️
              </Link>
            )}
            {!gam.bossUnlocked && (
              <div className="text-white/50 text-sm font-medium">
                {gam.exercisesCompleted}/{BOSS_UNLOCK_THRESHOLD} övningar
              </div>
            )}
          </div>

          {!gam.bossUnlocked && (
            <div className="mt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/40 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (gam.exercisesCompleted / BOSS_UNLOCK_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Unopened chests */}
        <section>
          <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>🎁</span>
            Oöppnade kistor
            {unopened.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {unopened.length}
              </span>
            )}
          </h2>
          {unopened.length === 0 ? (
            <div className="rounded-3xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <p className="text-5xl mb-3">🏅</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Inga kistor just nu. Slutför övningar för att tjäna kistor!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {unopened.map((chest) => (
                <ChestCard key={chest.id} chest={chest} onOpen={handleOpenChest} />
              ))}
            </div>
          )}
        </section>

        {/* Badges */}
        {gam.badges.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>🎖️</span>
              Dina märken ({gam.badges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gam.badges.map((badgeId) => {
                const badge = getBadge(badgeId);
                if (!badge) return null;
                return (
                  <div
                    key={badgeId}
                    className="flex flex-col items-center p-4 rounded-3xl"
                    style={{
                      background: "linear-gradient(135deg, #006AA7, #004a75)",
                      border: "3px solid #004a75",
                      boxShadow: "0 4px 16px rgba(0,106,167,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    <span className="text-3xl mb-2">{badge.emoji}</span>
                    <span className="text-xs font-bold text-white text-center leading-snug">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Opened chests history */}
        {opened.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>🔓</span>
              Öppnade kistor ({opened.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {opened.map((chest) => (
                <ChestCard key={chest.id} chest={chest} onOpen={() => {}} />
              ))}
            </div>
          </section>
        )}

        {/* How to earn chests */}
        <section className="rounded-3xl p-5 bg-sv-50 dark:bg-sv-950 border-2 border-sv-200 dark:border-sv-700">
          <h3 className="font-bold text-sv-900 dark:text-sv-100 mb-3 flex items-center gap-2">
            <span>💡</span> Hur tjänar man kistor?
          </h3>
          <p className="text-xs font-semibold text-sv-700 dark:text-sv-300 uppercase tracking-wide mb-2">Poängmilstolpar</p>
          <ul className="space-y-1.5 text-sm text-sv-900 dark:text-sv-100 mb-4">
            <li className="flex items-start gap-2"><span>📦</span><span><strong>Trälåda:</strong> 100, 200, 600 poäng</span></li>
            <li className="flex items-start gap-2"><span>🪙</span><span><strong>Silverlåda:</strong> 300, 500, 750, 1 500, 2 000 poäng</span></li>
            <li className="flex items-start gap-2"><span>🏆</span><span><strong>Guldlåda:</strong> 1 000, 2 500, 3 500, 5 000, 7 000, 10 000, 15 000 poäng</span></li>
          </ul>
          <p className="text-xs font-semibold text-sv-700 dark:text-sv-300 uppercase tracking-wide mb-2">Övningsmilstolpar</p>
          <ul className="space-y-1.5 text-sm text-sv-900 dark:text-sv-100 mb-4">
            <li className="flex items-start gap-2"><span>📦</span><span><strong>Trälåda:</strong> 5, 10 övningar</span></li>
            <li className="flex items-start gap-2"><span>🪙</span><span><strong>Silverlåda:</strong> 15, 20, 40 övningar</span></li>
            <li className="flex items-start gap-2"><span>🏆</span><span><strong>Guldlåda:</strong> 30, 60, 75, 100, 150 övningar</span></li>
          </ul>
          <div className="flex items-start gap-2 text-sm text-sv-900 dark:text-sv-100 pt-2 border-t border-sv-200 dark:border-sv-700">
            <span>🎁</span>
            <span><strong>Mysterylåda:</strong> Slumpmässig chans efter varje övning!</span>
          </div>
        </section>
      </main>

      {rewardResult && (
        <RewardPopup
          result={rewardResult}
          onClose={() => setRewardResult(null)}
        />
      )}
    </div>
  );
}
