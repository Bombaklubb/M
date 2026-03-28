"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import { loadStudent, saveStudent, loadGamification, saveGamification } from "@/lib/storage";
import { BOSS_QUESTIONS, getBadge } from "@/lib/gamification";
import type { StudentData, GamificationData, Chest } from "@/lib/types";

const BOSS_BONUS_POINTS = 150;
const PASS_THRESHOLD = 0.6;

const CAT_LABELS: Record<string, string> = {
  grammar: "Grammatik",
  spelling: "Stavning",
  reading: "Läsförståelse",
};
const CAT_COLORS: Record<string, string> = {
  grammar: "bg-sv-100 dark:bg-sv-900/40 text-sv-700 dark:text-sv-300",
  spelling: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  reading: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
};

type Phase = "intro" | "battle" | "win" | "lose";

export default function BossPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [gam, setGam] = useState<GamificationData | null>(null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const s = loadStudent();
    if (!s) { router.push("/"); return; }
    const g = loadGamification();
    setStudent(s);
    setGam(g);
    if (!g.bossUnlocked) router.push("/kistor");
  }, []);

  if (!student || !gam) return null;

  const questions = BOSS_QUESTIONS;
  const currentQ = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  function handleSelect(idx: number) {
    if (confirmed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null || confirmed) return;
    setConfirmed(true);

    setTimeout(() => {
      const correct = selected === currentQ.correctIndex;
      const newResults = [...results, correct];

      if (currentIndex + 1 >= questions.length) {
        const totalCorrect = newResults.filter(Boolean).length;
        const passed = totalCorrect / questions.length >= PASS_THRESHOLD;

        const currentGam = gam!;
        const currentStudent = student!;

        if (passed) {
          const bonusChest: Chest = {
            id: `chest_boss_${Date.now()}`,
            type: "wood",
            earnedAt: new Date().toISOString(),
            opened: false,
          };
          const hasBossSlayer = currentGam.badges.includes("boss_slayer");
          const newBadges = hasBossSlayer ? currentGam.badges : [...currentGam.badges, "boss_slayer"];
          const newGam: GamificationData = {
            chests: [...currentGam.chests, bonusChest],
            badges: newBadges,
            exercisesCompleted: currentGam.exercisesCompleted,
            bossUnlocked: currentGam.bossUnlocked,
            bossWins: currentGam.bossWins + 1,
            bossLastAttempt: new Date().toISOString(),
            pointsMilestonesRewarded: currentGam.pointsMilestonesRewarded,
            exerciseMilestonesRewarded: currentGam.exerciseMilestonesRewarded,
          };
          saveGamification(newGam);
          setGam(newGam);

          const updatedStudent: StudentData = { ...currentStudent, totalPoints: currentStudent.totalPoints + BOSS_BONUS_POINTS };
          saveStudent(updatedStudent);
          setStudent(updatedStudent);
        } else {
          const newGam: GamificationData = {
            chests: currentGam.chests,
            badges: currentGam.badges,
            exercisesCompleted: currentGam.exercisesCompleted,
            bossUnlocked: currentGam.bossUnlocked,
            bossWins: currentGam.bossWins,
            bossLastAttempt: new Date().toISOString(),
            pointsMilestonesRewarded: currentGam.pointsMilestonesRewarded,
            exerciseMilestonesRewarded: currentGam.exerciseMilestonesRewarded,
          };
          saveGamification(newGam);
          setGam(newGam);
        }

        setResults(newResults);
        setPhase(passed ? "win" : "lose");
      } else {
        setResults(newResults);
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setSelected(null);
          setConfirmed(false);
        }, 600);
      }
    }, 400);
  }

  function handleRetry() {
    setCurrentIndex(0);
    setResults([]);
    setSelected(null);
    setConfirmed(false);
    setPhase("battle");
  }

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header student={student} />
        <div
          className="text-white"
          style={{ background: "linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)" }}
        >
          <div className="max-w-3xl mx-auto px-4 py-6">
            <Link href="/kistor" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              ← Hemliga kistor
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-4xl">⚔️</span>
              <div>
                <h1 className="text-2xl font-black">Boss Challenge</h1>
                <p className="text-white/70 text-sm">Bevis att du är ett svenskaproffs!</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div
            className="rounded-3xl p-6 space-y-5"
            style={{
              background: "white",
              border: "3px solid #fca5a5",
              boxShadow: "0 8px 32px rgba(239,68,68,0.15), 0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div className="text-center">
              <div className="text-7xl mb-3" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>
                👹
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Möt bossen!</h2>
              <p className="text-gray-500 text-sm">
                Svara rätt på minst 6 av 10 frågor för att vinna.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-red-50 rounded-2xl p-3 border border-red-200">
                <p className="text-2xl font-black text-red-600">10</p>
                <p className="text-xs text-red-500">frågor</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
                <p className="text-2xl font-black text-amber-600">+{BOSS_BONUS_POINTS}</p>
                <p className="text-xs text-amber-500">bonuspoäng</p>
              </div>
              <div className="bg-sv-50 rounded-2xl p-3 border border-sv-200">
                <p className="text-2xl font-black text-sv-600">⚔️</p>
                <p className="text-xs text-sv-500">märke</p>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                Vinn: Bonuspoäng + märket "Bossbesegrare" + trälåda!
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">↺</span>
                Förlora: Försök igen när du vill.
              </li>
            </ul>

            <button
              onClick={() => setPhase("battle")}
              className="w-full py-4 rounded-2xl font-black text-white text-lg cursor-pointer transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                border: "3px solid #b91c1c",
                boxShadow: "0 6px 20px rgba(220,38,38,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              Starta striden! ⚔️
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "battle") {
    const isCorrect = confirmed && selected === currentQ.correctIndex;
    const isWrong = confirmed && selected !== null && selected !== currentQ.correctIndex;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header student={student} />

        <div
          className="text-white"
          style={{ background: "linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)" }}
        >
          <div className="max-w-3xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">
                Fråga {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-white/70 text-sm">
                ✓ {results.filter(Boolean).length} rätt
              </span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 py-6">
          <div
            className="rounded-3xl p-6"
            style={{
              background: "white",
              border: "3px solid #fca5a5",
              boxShadow: "0 6px 24px rgba(239,68,68,0.12), 0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${CAT_COLORS[currentQ.category]}`}>
                {CAT_LABELS[currentQ.category]}
              </span>
              <span className="text-2xl">👹</span>
            </div>

            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 leading-snug">
              {currentQ.question}
            </p>

            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                let style: React.CSSProperties = {
                  border: "3px solid #e5e7eb",
                  background: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                };

                if (confirmed) {
                  if (idx === currentQ.correctIndex) {
                    style = {
                      border: "3px solid #22c55e",
                      background: "#f0fdf4",
                      boxShadow: "0 2px 8px rgba(34,197,94,0.2)",
                    };
                  } else if (idx === selected) {
                    style = {
                      border: "3px solid #ef4444",
                      background: "#fef2f2",
                      boxShadow: "0 2px 8px rgba(239,68,68,0.2)",
                    };
                  }
                } else if (idx === selected) {
                  style = {
                    border: "3px solid #dc2626",
                    background: "#fff1f2",
                    boxShadow: "0 2px 8px rgba(220,38,38,0.2)",
                  };
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={confirmed}
                    className="w-full text-left px-4 py-3 rounded-2xl font-medium text-gray-800 dark:text-gray-100 transition-all cursor-pointer disabled:cursor-default"
                    style={style}
                  >
                    <span className="font-bold text-gray-500 mr-2">
                      {["A", "B", "C", "D"][idx]}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!confirmed && (
              <button
                onClick={handleConfirm}
                disabled={selected === null}
                className="mt-5 w-full py-3 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: selected !== null
                    ? "linear-gradient(135deg, #dc2626, #991b1b)"
                    : "#d1d5db",
                  border: "3px solid",
                  borderColor: selected !== null ? "#b91c1c" : "#9ca3af",
                }}
              >
                Svara!
              </button>
            )}

            {confirmed && (
              <div className={`mt-5 rounded-2xl p-3 text-center font-bold ${
                isCorrect
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : "bg-red-100 text-red-700 border-2 border-red-300"
              }`}>
                {isCorrect ? "✓ Rätt!" : `✗ Fel! Rätt svar: ${currentQ.options[currentQ.correctIndex]}`}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "win") {
    const totalCorrect = results.filter(Boolean).length;
    const badge = getBadge("boss_slayer");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header student={student} />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              border: "3px solid #86efac",
              boxShadow: "0 8px 32px rgba(34,197,94,0.2)",
            }}
          >
            <div className="text-7xl mb-4" style={{ animation: "bounce 0.6s ease-out" }}>
              🏆
            </div>
            <h1 className="text-3xl font-black text-green-800 mb-2">Du vann!</h1>
            <p className="text-green-600 mb-6">
              {totalCorrect}/{questions.length} rätt – bossen är besegrad!
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-3 border border-green-200">
                <p className="text-2xl font-black text-green-600">+{BOSS_BONUS_POINTS}</p>
                <p className="text-xs text-green-500">bonuspoäng</p>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-green-200">
                <p className="text-2xl">{badge?.emoji ?? "⚔️"}</p>
                <p className="text-xs text-green-500">Bossbesegrare</p>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-green-200">
                <p className="text-2xl">📦</p>
                <p className="text-xs text-green-500">Trälåda!</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/kistor"
                className="flex-1 py-3 rounded-2xl font-bold text-white text-center cursor-pointer transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  border: "3px solid #15803d",
                }}
              >
                Öppna kistor →
              </Link>
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-2xl font-bold text-green-700 border-2 border-green-300 bg-white cursor-pointer transition-all hover:bg-green-50 active:scale-95"
              >
                Spela igen
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const totalCorrect = results.filter(Boolean).length;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div
          className="rounded-3xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
            border: "3px solid #fca5a5",
            boxShadow: "0 8px 32px rgba(239,68,68,0.15)",
          }}
        >
          <div className="text-7xl mb-4">💪</div>
          <h1 className="text-3xl font-black text-red-800 mb-2">Nästan!</h1>
          <p className="text-red-600 mb-6">
            {totalCorrect}/{questions.length} rätt – du behöver 6 för att vinna.
          </p>

          <p className="text-sm text-red-500 mb-6">
            Öva mer och försök igen. Du klarar det!
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-2xl font-bold text-white cursor-pointer transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                border: "3px solid #b91c1c",
              }}
            >
              Försök igen ↺
            </button>
            <Link
              href="/"
              className="flex-1 py-3 rounded-2xl font-bold text-red-700 border-2 border-red-300 bg-white cursor-pointer text-center transition-all hover:bg-red-50 active:scale-95"
            >
              Öva mer
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
