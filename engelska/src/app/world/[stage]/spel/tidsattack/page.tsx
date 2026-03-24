"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData } from "@/lib/types";
import { WORD_PAIRS, shuffle, makeOptions } from "@/lib/gameVocab";

const GAME_DURATION = 60;

interface Question { sv: string; en: string; options: string[] }
type Phase = "intro" | "playing" | "result";

function buildQuestions(stageId: string): Question[] {
  const pairs = shuffle(WORD_PAIRS[stageId] ?? WORD_PAIRS.lagstadiet);
  const enPool = pairs.map(p => p.en);
  return pairs.map(p => ({
    sv: p.sv, en: p.en,
    options: makeOptions(p.en, enPool),
  }));
}

interface Props { params: Promise<{ stage: string }> }

export default function TidsattackPage({ params }: Props) {
  const { stage: stageId } = use(params);
  const stage = getStage(stageId);
  const [student, setStudent] = useState<StudentData | null>(null);
  useEffect(() => { setStudent(loadStudent()); }, []);
  if (!stage) return notFound();
  return <TidsattackGame stageId={stageId} stageName={stage.name} student={student} />;
}

function TidsattackGame({ stageId, stageName, student }: {
  stageId: string; stageName: string; student: StudentData | null;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[idx];

  const startGame = useCallback(() => {
    const qs = buildQuestions(stageId);
    setQuestions(qs);
    setIdx(0);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCorrect(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setPhase("playing");
  }, [stageId]);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase("result"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  const handleAnswer = useCallback((opt: string) => {
    if (feedback || !q) return;
    const ok = opt === q.en;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) {
      const ns = streak + 1;
      setStreak(ns);
      setBestStreak(b => Math.max(b, ns));
      setScore(s => s + 10 + Math.floor(ns / 3) * 5);
      setCorrect(c => c + 1);
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      setFeedback(null);
      setIdx(i => (i + 1) % questions.length);
    }, 350);
  }, [feedback, q, streak, questions.length]);

  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft <= 10 ? "bg-rose-500" : timeLeft <= 20 ? "bg-amber-500" : "bg-cyan-500";

  if (phase === "intro") return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <Header student={student} />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-4">⏱️</div>
          <h1 className="text-3xl font-black text-white mb-2">Tidsattack!</h1>
          <p className="text-cyan-300 text-sm mb-6 leading-relaxed">
            Svara på så många ord du kan på {GAME_DURATION} sekunder. Välj rätt engelsk översättning!
          </p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between text-white/80"><span>Tid</span><span className="font-bold text-cyan-400">{GAME_DURATION}s</span></div>
            <div className="flex justify-between text-white/80"><span>Nivå</span><span className="font-bold text-amber-400">{stageName}</span></div>
          </div>
          <button onClick={startGame} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black text-lg rounded-2xl hover:opacity-90 transition active:scale-95 cursor-pointer">
            Starta!
          </button>
          <Link href={`/world/${stageId}`} className="mt-4 block text-indigo-300 text-sm hover:text-white transition">← Tillbaka</Link>
        </div>
      </div>
    </div>
  );

  if (phase === "result") return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <Header student={student} />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-3">⏱️</div>
          <h2 className="text-2xl font-black text-white mb-1">Tiden är ute!</h2>
          <p className="text-cyan-300 text-sm mb-5">{correct + (score - correct * 10) / 5} frågor besvarade</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Rätt", value: correct, emoji: "✅" },
              { label: "Poäng", value: score, emoji: "🎯" },
              { label: "Streak", value: bestStreak, emoji: "🔥" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xl">{s.emoji}</div>
                <div className="text-white font-black text-lg">{s.value}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={startGame} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold rounded-xl hover:opacity-90 transition active:scale-95 cursor-pointer">Spela igen</button>
            <Link href={`/world/${stageId}`} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition text-center">Tillbaka</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <Header student={student} />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* HUD */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold text-sm">🎯 {score}</span>
            {streak >= 3 && <span className="text-orange-400 font-black text-sm">🔥 {streak}</span>}
          </div>
          <span className={`text-2xl font-black ${timeLeft <= 10 ? "text-rose-400 animate-pulse" : "text-white"}`}>{timeLeft}s</span>
        </div>

        {/* Timer bar */}
        <div className="h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
        </div>

        {/* Question */}
        {q && (
          <>
            <div className={`bg-white/5 border rounded-2xl p-6 mb-4 text-center transition-colors duration-200 ${
              feedback === "correct" ? "border-emerald-400/60 bg-emerald-900/20"
              : feedback === "wrong" ? "border-rose-400/60 bg-rose-900/20"
              : "border-white/10"
            }`}>
              <p className="text-white/50 text-xs mb-1">🇸🇪 Vad heter det på engelska?</p>
              <p className="text-white text-2xl font-black">{q.sv}</p>
              {feedback && (
                <p className={`text-lg font-black mt-2 ${feedback === "correct" ? "text-emerald-400" : "text-rose-400"}`}>
                  {feedback === "correct" ? "✓ Rätt!" : `✗ Rätt svar: ${q.en}`}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {q.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                  className={`border rounded-xl px-3 py-3 font-bold text-sm transition cursor-pointer ${
                    feedback
                      ? opt === q.en
                        ? "bg-emerald-600/80 border-emerald-400 text-white"
                        : "bg-white/5 border-white/10 text-white/40"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
