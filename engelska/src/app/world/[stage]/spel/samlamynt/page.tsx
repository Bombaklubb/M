"use client";

import { useState, useCallback, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData } from "@/lib/types";
import { WORD_PAIRS, shuffle, makeOptions } from "@/lib/gameVocab";

const MAX_LIVES = 3;
const TOTAL_COINS = 10;

interface Question { sv: string; en: string; options: string[] }
type Phase = "intro" | "playing" | "victory" | "defeat";

function buildQuestions(stageId: string): Question[] {
  const pairs = shuffle(WORD_PAIRS[stageId] ?? WORD_PAIRS.lagstadiet);
  const enPool = pairs.map(p => p.en);
  return pairs.map(p => ({
    sv: p.sv,
    en: p.en,
    options: makeOptions(p.en, enPool),
  }));
}

interface Props { params: Promise<{ stage: string }> }

export default function SamlaMyntPage({ params }: Props) {
  const { stage: stageId } = use(params);
  const stage = getStage(stageId);
  const [student, setStudent] = useState<StudentData | null>(null);
  useEffect(() => { setStudent(loadStudent()); }, []);
  if (!stage) return notFound();
  return <SamlaMyntGame stageId={stageId} stageName={stage.name} student={student} />;
}

function SamlaMyntGame({ stageId, stageName, student }: {
  stageId: string; stageName: string; student: StudentData | null;
}) {
  const [phase, setPhase]       = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx]           = useState(0);
  const [coins, setCoins]       = useState(0);
  const [lives, setLives]       = useState(MAX_LIVES);
  const [score, setScore]       = useState(0);
  const [streak, setStreak]     = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [runnerAnim, setRunnerAnim] = useState<"idle" | "run" | "stumble">("idle");

  const q = questions[idx];
  // runner position: 0–100% of track (based on coins collected)
  const runnerPct = Math.min(96, (coins / TOTAL_COINS) * 96);

  const startGame = useCallback(() => {
    const qs = buildQuestions(stageId);
    setQuestions(qs);
    setIdx(0);
    setCoins(0);
    setLives(MAX_LIVES);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setRunnerAnim("idle");
    setPhase("playing");
  }, [stageId]);

  const handleAnswer = useCallback((opt: string) => {
    if (feedback || !q) return;
    const ok = opt === q.en;

    if (ok) {
      setFeedback("correct");
      setRunnerAnim("run");
      const ns = streak + 1;
      setStreak(ns);
      setScore(s => s + 10 + Math.floor(ns / 3) * 5);
      const newCoins = coins + 1;
      setCoins(newCoins);
      if (newCoins >= TOTAL_COINS) {
        setTimeout(() => setPhase("victory"), 700);
        return;
      }
    } else {
      setFeedback("wrong");
      setRunnerAnim("stumble");
      setStreak(0);
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => setPhase("defeat"), 700);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setRunnerAnim("idle");
      setIdx(i => (i + 1) % questions.length);
    }, 600);
  }, [feedback, q, streak, coins, lives, questions.length]);

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header student={student} />
      <div className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-sm w-full">
          <div className="text-7xl mb-4">🏃</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">Samla mynt!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Välj rätt engelsk översättning så springer löparen framåt och samlar mynt. Samla {TOTAL_COINS} mynt för att vinna!
          </p>
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-6 text-sm space-y-2 text-left">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Mynt att samla</span>
              <span className="font-bold text-yellow-500">🪙 {TOTAL_COINS} st</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Liv</span>
              <span className="font-bold text-blue-500">🛡️ {MAX_LIVES} st</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Nivå</span>
              <span className="font-bold">{stageName}</span>
            </div>
          </div>
          <button
            onClick={startGame}
            className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-2xl transition active:scale-95 cursor-pointer shadow-lg"
            style={{ boxShadow: "0 4px 0 0 #16a34a" }}
          >
            Starta!
          </button>
          <Link href={`/world/${stageId}`} className="mt-4 block text-gray-400 hover:text-gray-600 text-sm transition">← Tillbaka</Link>
        </div>
      </div>
    </div>
  );

  // ── Victory ────────────────────────────────────────────────────────────────
  if (phase === "victory") return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header student={student} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="text-7xl mb-4">🏆</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-1">Bra jobbat!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Du samlade alla {TOTAL_COINS} mynt!</p>
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-black text-yellow-500">{TOTAL_COINS}</p>
              <p className="text-gray-400 text-xs">Mynt</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{score}</p>
              <p className="text-gray-400 text-xs">Poäng</p>
            </div>
            <div>
              <p className="text-2xl font-black text-blue-500">{lives}</p>
              <p className="text-gray-400 text-xs">Liv kvar</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={startGame} className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl transition active:scale-95 cursor-pointer" style={{ boxShadow: "0 4px 0 0 #16a34a" }}>
              Spela igen
            </button>
            <Link href={`/world/${stageId}`} className="text-gray-400 hover:text-gray-600 text-sm transition">← Tillbaka till Spel</Link>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Defeat ─────────────────────────────────────────────────────────────────
  if (phase === "defeat") return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header student={student} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="text-7xl mb-4">😵</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-1">Försök igen!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Du samlade {coins} av {TOTAL_COINS} mynt.</p>
          <div className="flex flex-col gap-3">
            <button onClick={startGame} className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl transition active:scale-95 cursor-pointer" style={{ boxShadow: "0 4px 0 0 #16a34a" }}>
              Försök igen
            </button>
            <Link href={`/world/${stageId}`} className="text-gray-400 hover:text-gray-600 text-sm transition">← Tillbaka till Spel</Link>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Playing ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header student={student} />
      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-20 pb-8 flex flex-col gap-5">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => setPhase("intro")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-semibold transition cursor-pointer">
            ← Avsluta
          </button>
          <span className="text-amber-500 font-bold text-sm">⭐ {score}p</span>
        </div>

        {/* Track */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Coin row */}
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-2">
            {Array.from({ length: TOTAL_COINS }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-5 rounded-full transition-all duration-300 ${
                  i < coins
                    ? "bg-yellow-400 shadow-sm"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          {/* Runner track */}
          <div className="relative mx-3 mb-3 rounded-xl overflow-hidden" style={{ height: 80 }}>
            {/* Sky */}
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30" />
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-green-500 rounded-b-xl">
              {/* Dashes on ground */}
              <div className="absolute inset-0 flex items-center gap-6 px-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-1 w-6 bg-green-400 rounded-full" />
                ))}
              </div>
            </div>
            {/* Runner */}
            <div
              className="absolute bottom-5 transition-all duration-500"
              style={{ left: `calc(${runnerPct}% - 16px)` }}
            >
              <span
                className={`text-3xl select-none block transition-transform duration-300 ${
                  runnerAnim === "run"     ? "-translate-y-1"
                  : runnerAnim === "stumble" ? "translate-x-1 opacity-70"
                  : ""
                }`}
                style={{ filter: feedback === "correct" ? "drop-shadow(0 0 6px #fbbf24)" : undefined }}
              >
                🏃
              </span>
            </div>
            {/* Coin sparkle on collect */}
            {feedback === "correct" && (
              <div
                className="absolute bottom-8 text-lg animate-bounce pointer-events-none"
                style={{ left: `calc(${runnerPct}% - 8px)` }}
              >
                🪙
              </div>
            )}
          </div>
        </div>

        {/* Question */}
        {q && (
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 text-center transition-colors duration-200 shadow-sm ${
            feedback === "correct" ? "border-green-400 bg-green-50 dark:bg-green-900/20"
            : feedback === "wrong"   ? "border-red-400 bg-red-50 dark:bg-red-900/20"
            : "border-gray-200 dark:border-gray-700"
          }`}>
            <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">🇸🇪 Vad heter det på engelska?</p>
            <p className="text-gray-900 dark:text-gray-100 text-2xl font-black">{q.sv}</p>
            {feedback === "wrong" && (
              <p className="text-red-500 text-sm mt-1 font-semibold">Rätt svar: <span className="font-black">{q.en}</span></p>
            )}
          </div>
        )}

        {/* Answer buttons */}
        {q && (
          <div className="grid grid-cols-2 gap-3">
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback}
                className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all cursor-pointer border-2 active:scale-95 ${
                  feedback
                    ? opt === q.en
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                style={!feedback ? { boxShadow: "0 2px 0 0 #e5e7eb" } : undefined}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Lives */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span
              key={i}
              className={`text-2xl transition-all duration-300 ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}
            >
              🛡️
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
