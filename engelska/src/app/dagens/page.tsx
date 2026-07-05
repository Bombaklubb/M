"use client";

import { useState, useEffect, useMemo, type ReactNode, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import { Confetti } from "@/components/magicui/confetti";
import { loadStudent } from "@/lib/storage";
import {
  getDailyQuestions, getDailyChallengeRecord, completeDailyChallenge, getStudentStage,
  DAILY_CHALLENGE_SIZE, DAILY_POINTS_PER_CORRECT, DAILY_PERFECT_BONUS,
  type DailyChallengeRecord,
} from "@/lib/dailyChallenge";
import type { StudentData } from "@/lib/types";

type Phase = "intro" | "play" | "result";

const MAX_POINTS = DAILY_CHALLENGE_SIZE * DAILY_POINTS_PER_CORRECT + DAILY_PERFECT_BONUS;

const CARD_STYLE: CSSProperties = {
  background: "rgba(15,20,60,0.85)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(120,150,255,0.28)",
};
const ORANGE_BTN: CSSProperties = {
  background: "linear-gradient(135deg,#f59e0b,#d97706)",
  border: "2px solid #d97706",
};

export default function DagensPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState<null | { picked: string; correct: boolean }>(null);
  const [result, setResult] = useState<DailyChallengeRecord | null>(null);

  useEffect(() => {
    setStudent(loadStudent());
    setLoading(false);
  }, []);

  const questions = useMemo(
    () => (student ? getDailyQuestions(getStudentStage(student)) : []),
    [student]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">🗓️</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Du är inte inloggad.</p>
          <Link href="/" className="btn-primary bg-blue-500 hover:bg-blue-600">
            Gå till startsidan
          </Link>
        </div>
      </div>
    );
  }

  const doneToday = getDailyChallengeRecord(student.name);
  const q = questions[index];

  function pickAnswer(opt: string) {
    if (answered || !q) return;
    const correct = opt === q.en;
    if (correct) setCorrectCount((c) => c + 1);
    setAnswered({ picked: opt, correct });
  }

  function next() {
    if (index + 1 >= questions.length) {
      const rec = completeDailyChallenge(correctCount, questions.length);
      setResult(rec);
      setStudent(loadStudent()); // uppdatera poäng i headern
      setPhase("result");
    } else {
      setIndex((i) => i + 1);
      setAnswered(null);
    }
  }

  const hero = (children: ReactNode) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />
      <div className="text-white" style={{ background: "linear-gradient(135deg,#78350f 0%,#b45309 50%,#d97706 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🗓️</span>
            <div>
              <h1 className="text-2xl font-black">Dagens utmaning</h1>
              <p className="text-white/70 text-sm">{DAILY_CHALLENGE_SIZE} blandade frågor – en gång per dag!</p>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-2xl mx-auto px-4 py-6 pb-16">{children}</main>
    </div>
  );

  // ── Redan gjord idag ────────────────────────────────────────────────────────
  if (doneToday && phase !== "result") {
    return hero(
      <div className="rounded-3xl p-8 text-center text-white" style={CARD_STYLE}>
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-xl font-black mb-2">Klar för idag!</h2>
        <p className="text-white/70 mb-1">
          Du fick <strong className="text-amber-300">{doneToday.correct}/{doneToday.total}</strong> rätt
          och tjänade <strong className="text-amber-300">⭐ {doneToday.pointsEarned}</strong>.
        </p>
        {doneToday.perfectChest && <p className="text-emerald-300 text-sm font-bold">+ en bronskista! 🎁</p>}
        <p className="text-white/50 text-sm mt-4">Kom tillbaka imorgon för en ny utmaning!</p>
        <button onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer"
          style={ORANGE_BTN}>
          Till startsidan
        </button>
      </div>
    );
  }

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return hero(
      <div className="rounded-3xl p-8 text-center text-white" style={CARD_STYLE}>
        <div className="text-5xl mb-3">🗓️</div>
        <h2 className="text-xl font-black mb-3">Redo för dagens utmaning?</h2>
        <ul className="text-white/75 text-sm space-y-1.5 mb-6">
          <li>🇬🇧 {DAILY_CHALLENGE_SIZE} blandade frågor för din nivå</li>
          <li>⭐ {DAILY_POINTS_PER_CORRECT} poäng per rätt svar</li>
          <li>🏆 +{DAILY_PERFECT_BONUS} bonuspoäng och en bronskista vid alla rätt</li>
          <li>☝️ Kan bara göras en gång per dag</li>
        </ul>
        <p className="text-amber-300 font-bold text-sm mb-6">Upp till ⭐ {MAX_POINTS} idag!</p>
        <button onClick={() => setPhase("play")}
          className="px-8 py-3.5 rounded-2xl font-black text-white text-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{ ...ORANGE_BTN, boxShadow: "0 4px 16px rgba(217,119,6,0.4)" }}>
          Starta! 🚀
        </button>
      </div>
    );
  }

  // ── Resultat ────────────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const perfect = result.correct === result.total;
    return hero(
      <>
        <Confetti trigger count={perfect ? 140 : 80} />
        <div className="rounded-3xl p-8 text-center text-white" style={CARD_STYLE}>
          <div className="text-6xl mb-3">{perfect ? "🏆" : result.correct >= 3 ? "🌟" : "💪"}</div>
          <h2 className="text-2xl font-black mb-2">
            {perfect ? "ALLA RÄTT!" : result.correct >= 3 ? "Bra jobbat!" : "Bra kämpat!"}
          </h2>
          <p className="text-white/75 mb-4">
            Du fick <strong className="text-amber-300">{result.correct}/{result.total}</strong> rätt
          </p>
          <div className="rounded-2xl px-4 py-3 mb-2 inline-block" style={{ background: "rgba(255,255,255,0.10)" }}>
            <p className="text-3xl font-black text-amber-300">+{result.pointsEarned} ⭐</p>
          </div>
          {result.perfectChest && (
            <p className="text-emerald-300 font-bold mt-2">🎁 Du fick en bronskista – öppna den under Kistor!</p>
          )}
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            {result.perfectChest && (
              <Link href="/kistor"
                className="px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg,#10b981,#047857)", border: "2px solid #047857" }}>
                Öppna kistan 🎁
              </Link>
            )}
            <button onClick={() => router.push("/")}
              className="px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer"
              style={ORANGE_BTN}>
              Till startsidan
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Spelläge ────────────────────────────────────────────────────────────────
  if (!q) {
    return hero(
      <div className="text-center text-white/80 py-10">
        <p>Inga frågor hittades för din nivå idag.</p>
      </div>
    );
  }

  return hero(
    <div className="rounded-3xl p-6 text-white" style={CARD_STYLE}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="font-bold text-white/70">Fråga {index + 1} av {questions.length}</span>
        <span className="font-bold text-amber-300">✓ {correctCount} rätt</span>
      </div>
      <div className="h-2 bg-white/15 rounded-full overflow-hidden mb-5">
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%`, background: "linear-gradient(90deg,#f59e0b,#d97706)" }} />
      </div>

      {/* Fråga */}
      <h2 className="text-lg font-black mb-5">
        Vad heter <span className="text-amber-300">”{q.sv}”</span> på engelska?
      </h2>

      {/* Alternativ */}
      <div className="grid gap-2.5">
        {q.options.map((opt) => {
          const picked = answered?.picked === opt;
          const isCorrect = opt === q.en;
          let style: CSSProperties = { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" };
          if (answered) {
            if (isCorrect) style = { background: "rgba(16,185,129,0.25)", border: "2px solid #10b981" };
            else if (picked) style = { background: "rgba(239,68,68,0.25)", border: "2px solid #ef4444" };
            else style = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", opacity: 0.6 };
          }
          return (
            <button key={opt} onClick={() => pickAnswer(opt)} disabled={!!answered}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold transition-all active:scale-[0.99] cursor-pointer disabled:cursor-default"
              style={style}>
              {opt}
              {answered && isCorrect && <span className="float-right">✓</span>}
              {answered && picked && !isCorrect && <span className="float-right">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback + nästa */}
      {answered && (
        <div className="mt-5">
          <p className={`font-black mb-1 ${answered.correct ? "text-emerald-300" : "text-rose-300"}`}>
            {answered.correct ? "Rätt! 🎉" : "Fel svar"}
          </p>
          {!answered.correct && (
            <p className="text-white/70 text-sm mb-3">
              Rätt svar: <strong className="text-emerald-300">{q.en}</strong>
            </p>
          )}
          <button onClick={next}
            className="w-full py-3.5 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
            style={ORANGE_BTN}>
            {index + 1 >= questions.length ? "Se resultat →" : "Nästa fråga →"}
          </button>
        </div>
      )}
    </div>
  );
}
