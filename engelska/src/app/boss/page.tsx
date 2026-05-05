"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/ui/Header";
import { loadStudent, saveStudent, loadGamification, saveGamification } from "@/lib/storage";
import { BOSS_CONFIGS, CHEST_META, getBadge } from "@/lib/gamification";
import type { StudentData, GamificationData, Chest, ChestType } from "@/lib/types";
import type { BossId, BossQuestion } from "@/lib/gamification";
import { getPositiveFeedback } from "@/lib/feedback";

type Phase = "intro" | "battle" | "win" | "lose";

// ─── Multiple Choice Battle ───────────────────────────────────────────────────

function MCQuestion({
  q,
  accentColor,
  onAnswer,
}: {
  q: Extract<BossQuestion, { type: "multiple-choice" }>;
  accentColor: string;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  function handleConfirm() {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    const correct = selected === q.correctIndex;
    if (correct) setFeedbackMsg(getPositiveFeedback());
    setTimeout(() => onAnswer(correct), 800);
  }

  const CAT_COLORS: Record<string, string> = {
    grammar: "bg-blue-100 text-blue-700",
    spelling: "bg-green-100 text-green-700",
    reading: "bg-purple-100 text-purple-700",
  };
  const CAT_LABELS: Record<string, string> = { grammar: "Grammatik", spelling: "Stavning", reading: "Läsförståelse" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${CAT_COLORS[q.category]}`}>
          {CAT_LABELS[q.category]}
        </span>
      </div>

      <p className="text-lg font-bold text-gray-900 leading-snug">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let style: React.CSSProperties = { border: "3px solid #e5e7eb", background: "white" };
          if (confirmed) {
            if (idx === q.correctIndex) style = { border: "3px solid #22c55e", background: "#f0fdf4" };
            else if (idx === selected) style = { border: "3px solid #ef4444", background: "#fef2f2" };
          } else if (idx === selected) {
            style = { border: `3px solid ${accentColor}`, background: "#fff" };
          }
          return (
            <button
              key={idx}
              onClick={() => { if (!confirmed) setSelected(idx); }}
              disabled={confirmed}
              className="w-full text-left px-4 py-3 rounded-2xl font-medium text-gray-800 transition-all cursor-pointer disabled:cursor-default"
              style={style}
            >
              <span className="font-bold text-gray-400 mr-2">{["A","B","C","D"][idx]}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {!confirmed && (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          className="w-full py-3 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: selected !== null ? accentColor : "#d1d5db", border: "3px solid transparent" }}
        >
          Svara!
        </button>
      )}

      {confirmed && (
        <div className={`rounded-2xl p-3 text-center font-bold ${
          selected === q.correctIndex
            ? "bg-green-100 text-green-700 border-2 border-green-300"
            : "bg-red-100 text-red-700 border-2 border-red-300"
        }`}>
          {selected === q.correctIndex
            ? `✓ ${feedbackMsg}`
            : `✗ Fel! Rätt svar: ${q.options[q.correctIndex]}`}
        </div>
      )}
    </div>
  );
}

// ─── Fill-in-Blank Battle ─────────────────────────────────────────────────────

function FillInQuestion({
  q,
  accentColor,
  onAnswer,
}: {
  q: Extract<BossQuestion, { type: "fill-in-blank" }>;
  accentColor: string;
  onAnswer: (correct: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleConfirm() {
    if (!input.trim() || confirmed) return;
    const answer = input.trim().toLowerCase();
    const correct =
      answer === q.answer.toLowerCase() ||
      (q.alternativeAnswers ?? []).some((a) => answer === a.toLowerCase());
    setIsCorrect(correct);
    setConfirmed(true);
    setTimeout(() => onAnswer(correct), 900);
  }

  const parts = q.sentence.split("___");

  return (
    <div className="space-y-5">
      <div className="text-base font-semibold text-gray-900 leading-relaxed">
        {parts[0]}
        <span
          className="inline-block min-w-[80px] border-b-2 text-center mx-1 font-black"
          style={{ borderColor: confirmed ? (isCorrect ? "#22c55e" : "#ef4444") : accentColor, color: accentColor }}
        >
          {confirmed ? (isCorrect ? input : q.answer) : (input || "___")}
        </span>
        {parts[1]}
      </div>

      {q.hint && !confirmed && (
        <p className="text-xs text-gray-400 italic">Tips: {q.hint}</p>
      )}

      {!confirmed && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); }}
            placeholder="Skriv svaret..."
            className="flex-1 px-4 py-3 rounded-2xl border-3 border-gray-200 focus:outline-none focus:border-current font-medium text-gray-900"
            style={{ borderColor: input ? accentColor : undefined } as React.CSSProperties}
            maxLength={40}
          />
          <button
            onClick={handleConfirm}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: input.trim() ? accentColor : "#d1d5db" }}
          >
            OK
          </button>
        </div>
      )}

      {confirmed && (
        <div className={`rounded-2xl p-3 text-center font-bold ${
          isCorrect
            ? "bg-green-100 text-green-700 border-2 border-green-300"
            : "bg-red-100 text-red-700 border-2 border-red-300"
        }`}>
          {isCorrect ? `✓ Rätt stavat!` : `✗ Fel! Rätt svar: "${q.answer}"`}
        </div>
      )}
    </div>
  );
}

// ─── Build Sentence Battle ────────────────────────────────────────────────────

function BuildSentenceQuestion({
  q,
  accentColor,
  onAnswer,
}: {
  q: Extract<BossQuestion, { type: "build-sentence" }>;
  accentColor: string;
  onAnswer: (correct: boolean) => void;
}) {
  const [chosen, setChosen] = useState<number[]>([]); // indices into q.words
  const [confirmed, setConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const available = q.words.map((_, i) => i).filter((i) => !chosen.includes(i));

  function addWord(idx: number) {
    if (confirmed) return;
    setChosen([...chosen, idx]);
  }

  function removeWord(pos: number) {
    if (confirmed) return;
    setChosen(chosen.filter((_, i) => i !== pos));
  }

  function handleConfirm() {
    if (chosen.length === 0 || confirmed) return;
    const correct =
      chosen.length === q.correctOrder.length &&
      chosen.every((wordIdx, pos) => wordIdx === q.correctOrder[pos]);
    setIsCorrect(correct);
    setConfirmed(true);
    setTimeout(() => onAnswer(correct), 900);
  }

  const correctSentence = q.correctOrder.map((i) => q.words[i]).join(" ");

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-gray-600">{q.instruction}</p>

      {/* Sentence being built */}
      <div
        className="min-h-[52px] p-3 rounded-2xl flex flex-wrap gap-2 items-center"
        style={{
          background: confirmed
            ? isCorrect ? "#f0fdf4" : "#fef2f2"
            : "rgba(0,0,0,0.04)",
          border: `2px solid ${confirmed ? (isCorrect ? "#86efac" : "#fca5a5") : "#e5e7eb"}`,
        }}
      >
        {chosen.length === 0 ? (
          <span className="text-gray-400 text-sm italic">Klicka på orden nedan...</span>
        ) : (
          chosen.map((wordIdx, pos) => (
            <button
              key={pos}
              onClick={() => removeWord(pos)}
              disabled={confirmed}
              className="px-3 py-1.5 rounded-xl font-bold text-sm transition-all"
              style={{
                background: accentColor,
                color: "white",
                boxShadow: "0 2px 0 0 rgba(0,0,0,0.2)",
              }}
            >
              {q.words[wordIdx]}
            </button>
          ))
        )}
      </div>

      {/* Word bank */}
      {!confirmed && (
        <div className="flex flex-wrap gap-2">
          {available.map((wordIdx) => (
            <button
              key={wordIdx}
              onClick={() => addWord(wordIdx)}
              className="px-3 py-2 rounded-xl font-semibold text-sm border-2 border-gray-200 bg-white hover:border-current transition-all active:scale-95 cursor-pointer"
              style={{ color: "#374151" }}
            >
              {q.words[wordIdx]}
            </button>
          ))}
        </div>
      )}

      {!confirmed && (
        <div className="flex gap-2">
          <button
            onClick={() => setChosen([])}
            className="px-4 py-2.5 rounded-2xl font-bold text-gray-500 border-2 border-gray-200 bg-white text-sm cursor-pointer hover:bg-gray-50 transition-all"
          >
            Rensa
          </button>
          <button
            onClick={handleConfirm}
            disabled={chosen.length === 0}
            className="flex-1 py-2.5 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: chosen.length > 0 ? accentColor : "#d1d5db" }}
          >
            Kolla svaret!
          </button>
        </div>
      )}

      {confirmed && (
        <div className={`rounded-2xl p-3 text-center font-bold text-sm ${
          isCorrect
            ? "bg-green-100 text-green-700 border-2 border-green-300"
            : "bg-red-100 text-red-700 border-2 border-red-300"
        }`}>
          {isCorrect ? "✓ Perfekt ordning!" : `✗ Rätt ordning: "${correctSentence}"`}
        </div>
      )}
    </div>
  );
}

// ─── Inner page (needs useSearchParams) ──────────────────────────────────────

function BossPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bossId = (searchParams.get("type") ?? "dragon") as BossId;
  const boss = BOSS_CONFIGS[bossId] ?? BOSS_CONFIGS.dragon;

  const [student, setStudent] = useState<StudentData | null>(null);
  const [gam, setGam] = useState<GamificationData | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [earnedBossPoints, setEarnedBossPoints] = useState(0);

  useEffect(() => {
    const s = loadStudent();
    if (!s) { router.push("/"); return; }
    const g = loadGamification();
    setStudent(s);
    setGam(g);
    if (!g.bossUnlocked) router.push("/kistor");
  }, []);

  if (!student || !gam) return null;

  const questions = boss.questions;
  const currentQ = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  function handleAnswer(correct: boolean) {
    const newResults = [...results, correct];

    if (currentIndex + 1 >= questions.length) {
      const totalCorrect = newResults.filter(Boolean).length;
      const passed = totalCorrect / questions.length >= boss.passThreshold;
      const currentGam = gam!;
      const currentStudent = student!;

      if (passed) {
        const bonusChest: Chest = {
          id: `chest_boss_${Date.now()}`,
          type: boss.rewardChestType as ChestType,
          earnedAt: new Date().toISOString(),
          opened: false,
        };
        const newBadges = currentGam.badges.includes(boss.rewardBadgeId)
          ? currentGam.badges
          : [...currentGam.badges, boss.rewardBadgeId];
        const beatenBefore = currentGam.bossesBeaten ?? [];
        const newBossesBeaten = beatenBefore.includes(boss.id)
          ? beatenBefore
          : [...beatenBefore, boss.id];

        const winCounts = currentGam.bossWinCounts ?? {};
        const prevWins = winCounts[boss.id] ?? 0;
        const earnedPoints = prevWins === 0 ? Math.min(boss.rewardPoints, 200)
                           : prevWins === 1 ? 50
                           : 0;
        const newWinCounts = { ...winCounts, [boss.id]: prevWins + 1 };

        const newGam: GamificationData = {
          ...currentGam,
          chests: [...currentGam.chests, bonusChest],
          badges: newBadges,
          bossWins: currentGam.bossWins + 1,
          bossesBeaten: newBossesBeaten,
          bossWinCounts: newWinCounts,
          bossLastAttempt: new Date().toISOString(),
        };
        saveGamification(newGam);
        setGam(newGam);
        setEarnedBossPoints(earnedPoints);

        const updatedStudent = { ...currentStudent, totalPoints: currentStudent.totalPoints + earnedPoints };
        saveStudent(updatedStudent);
        setStudent(updatedStudent);
      } else {
        const newGam: GamificationData = {
          ...currentGam,
          bossLastAttempt: new Date().toISOString(),
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
      }, 300);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setResults([]);
    setPhase("battle");
  }

  // ─── Intro ───────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header student={student} />
        <div className="text-white" style={{ background: boss.gradient }}>
          <div className="max-w-3xl mx-auto px-4 py-6">
            <Link href="/kistor" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              ← Hemliga kistor
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-4xl">⚔️</span>
              <div>
                <h1 className="text-2xl font-black">Boss Challenge</h1>
                <p className="text-white/70 text-sm">Bevis att du är ett engelskaproffs!</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div
            className="rounded-3xl p-6 space-y-5"
            style={{
              background: boss.cardBg,
              border: `3px solid ${boss.borderColor}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <div className="text-center">
              <div className="text-7xl mb-3" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
                {boss.emoji}
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">{boss.name}</h2>
              <p className="text-sm font-semibold" style={{ color: boss.accentColor }}>{boss.subtitle}</p>
              <p className="text-gray-500 text-sm mt-2">{boss.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <p className="text-2xl font-black" style={{ color: boss.accentColor }}>{questions.length}</p>
                <p className="text-xs text-gray-400">frågor</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                {(() => { const w = (gam?.bossWinCounts ?? {})[boss.id] ?? 0; const pts = w === 0 ? Math.min(boss.rewardPoints, 200) : w === 1 ? 50 : 0; return <><p className="text-2xl font-black text-amber-500">+{pts}</p><p className="text-xs text-gray-400">bonuspoäng</p></>; })()}
              </div>
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <img
                  src={CHEST_META[boss.rewardChestType].image}
                  alt={CHEST_META[boss.rewardChestType].label}
                  className="w-8 h-6 mx-auto object-contain"
                />
                <p className="text-xs text-gray-400">{CHEST_META[boss.rewardChestType].label}</p>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                Vinn: Bonuspoäng + märke + {CHEST_META[boss.rewardChestType].label.toLowerCase()}!
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
                background: boss.gradient,
                border: `3px solid ${boss.accentColor}`,
                boxShadow: `0 6px 20px rgba(0,0,0,0.2)`,
              }}
            >
              Starta striden! ⚔️
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ─── Battle ──────────────────────────────────────────────────────────────
  if (phase === "battle") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header student={student} />
        <div className="text-white" style={{ background: boss.gradient }}>
          <div className="max-w-3xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">
                Fråga {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-white/70 text-sm flex items-center gap-1.5">
                <span className="text-xl">{boss.emoji}</span>
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
              border: `3px solid ${boss.borderColor}`,
              boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
            }}
          >
            {currentQ.type === "multiple-choice" && (
              <MCQuestion
                key={currentIndex}
                q={currentQ as Extract<BossQuestion, { type: "multiple-choice" }>}
                accentColor={boss.accentColor}
                onAnswer={handleAnswer}
              />
            )}
            {currentQ.type === "fill-in-blank" && (
              <FillInQuestion
                key={currentIndex}
                q={currentQ as Extract<BossQuestion, { type: "fill-in-blank" }>}
                accentColor={boss.accentColor}
                onAnswer={handleAnswer}
              />
            )}
            {currentQ.type === "build-sentence" && (
              <BuildSentenceQuestion
                key={currentIndex}
                q={currentQ as Extract<BossQuestion, { type: "build-sentence" }>}
                accentColor={boss.accentColor}
                onAnswer={handleAnswer}
              />
            )}
          </div>
        </main>
      </div>
    );
  }

  // ─── Win ─────────────────────────────────────────────────────────────────
  if (phase === "win") {
    const totalCorrect = results.filter(Boolean).length;
    const badge = getBadge(boss.rewardBadgeId);
    return (
      <div className="min-h-screen bg-gray-50">
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
            <div className="text-7xl mb-4">🏆</div>
            <h1 className="text-3xl font-black text-green-800 mb-2">Du vann!</h1>
            <p className="text-green-600 mb-2">
              {totalCorrect}/{questions.length} rätt – {boss.name} är besegrad!
            </p>
            <p className="text-green-500 text-sm mb-6">{boss.emoji} {boss.name} flydde besegrat!</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-3 border border-green-200">
                <p className="text-2xl font-black text-amber-500">+{earnedBossPoints}</p>
                <p className="text-xs text-green-500">bonuspoäng</p>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-green-200">
                <p className="text-2xl">{badge?.emoji ?? "⚔️"}</p>
                <p className="text-xs text-green-500">{badge?.label ?? "Märke"}</p>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-green-200">
                <img
                  src={CHEST_META[boss.rewardChestType].image}
                  alt={CHEST_META[boss.rewardChestType].label}
                  className="w-8 h-6 mx-auto object-contain"
                />
                <p className="text-xs text-green-500">{CHEST_META[boss.rewardChestType].label}!</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/kistor"
                className="flex-1 py-3 rounded-2xl font-bold text-white text-center cursor-pointer transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", border: "3px solid #15803d" }}
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

  // ─── Lose ────────────────────────────────────────────────────────────────
  const totalCorrect = results.filter(Boolean).length;
  const needed = Math.ceil(questions.length * boss.passThreshold);
  return (
    <div className="min-h-screen bg-gray-50">
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
          <p className="text-red-600 mb-2">{totalCorrect}/{questions.length} rätt – du behöver {needed} för att vinna.</p>
          <p className="text-sm text-red-500 mb-6">Öva mer och försök igen. Du klarar det!</p>

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-2xl font-bold text-white cursor-pointer transition-all active:scale-95"
              style={{ background: boss.gradient, border: `3px solid ${boss.accentColor}` }}
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

// ─── Page export with Suspense ────────────────────────────────────────────────

export default function BossPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-4xl animate-bounce">⚔️</span></div>}>
      <BossPageInner />
    </Suspense>
  );
}
