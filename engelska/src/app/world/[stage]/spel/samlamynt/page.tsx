"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData } from "@/lib/types";
import { WORD_PAIRS, shuffle } from "@/lib/gameVocab";

const QUESTION_TIMER = 15;
const FALL_INTERVAL_MS = 80;
const FALL_STEP = 0.55;

interface Question { sv: string; en: string; wrong: string; coinLane: 0 | 1 }
type Phase = "intro" | "playing" | "result";

interface FallingItem { id: number; text: string; isCoin: boolean; lane: 0 | 1; y: number }

function buildQuestions(stageId: string): Question[] {
  const pairs = shuffle(WORD_PAIRS[stageId] ?? WORD_PAIRS.lagstadiet);
  const allEn = pairs.map(p => p.en);
  return pairs.map(p => {
    const wrong = shuffle(allEn.filter(e => e !== p.en))[0] ?? "wrong";
    const coinLane: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
    return { sv: p.sv, en: p.en, wrong, coinLane };
  });
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
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [playerLane, setPlayerLane] = useState<0 | 1>(0);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<"coin" | "hit" | null>(null);
  const [answered, setAnswered] = useState(false);
  const [qTimer, setQTimer] = useState(QUESTION_TIMER);
  const idRef = useRef(0);
  const fallRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[idx];

  const startGame = useCallback(() => {
    const qs = buildQuestions(stageId);
    setQuestions(qs);
    setIdx(0);
    setPlayerLane(0);
    setItems([]);
    setCoins(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setFeedback(null);
    setAnswered(false);
    setQTimer(QUESTION_TIMER);
    idRef.current = 0;
    setPhase("playing");
  }, [stageId]);

  // Build items when question changes
  useEffect(() => {
    if (phase !== "playing" || !q) return;
    setAnswered(false);
    setFeedback(null);
    setQTimer(QUESTION_TIMER);
    const coin: FallingItem = { id: idRef.current++, text: q.en,    isCoin: true,  lane: q.coinLane,       y: 0 };
    const bomb: FallingItem = { id: idRef.current++, text: q.wrong, isCoin: false, lane: (1 - q.coinLane) as 0|1, y: 0 };
    setItems([coin, bomb]);
  }, [idx, phase, q]);

  // Fall animation
  useEffect(() => {
    if (phase !== "playing" || answered) { clearInterval(fallRef.current!); return; }
    fallRef.current = setInterval(() => {
      setItems(prev => prev.map(it => ({ ...it, y: it.y + FALL_STEP })));
    }, FALL_INTERVAL_MS);
    return () => clearInterval(fallRef.current!);
  }, [phase, answered, idx]);

  // Question countdown
  useEffect(() => {
    if (phase !== "playing" || answered) { clearInterval(qTimerRef.current!); return; }
    qTimerRef.current = setInterval(() => {
      setQTimer(t => {
        if (t <= 1) { clearInterval(qTimerRef.current!); handleTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(qTimerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, answered, idx]);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setFeedback("hit");
    const nl = lives - 1;
    setLives(nl);
    setStreak(0);
    if (nl <= 0) { setTimeout(() => setPhase("result"), 700); return; }
    setTimeout(() => {
      setItems([]);
      setIdx(i => { const n = i + 1; if (n >= questions.length) { setPhase("result"); return i; } return n; });
    }, 700);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, lives, questions.length]);

  // Collision detection
  useEffect(() => {
    if (answered || phase !== "playing") return;
    const near = items.filter(it => it.y >= 76 && it.y <= 92);
    for (const it of near) {
      if (it.lane === playerLane) { handleCollect(it); break; }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, playerLane, answered]);

  const handleCollect = (it: FallingItem) => {
    if (answered) return;
    clearInterval(qTimerRef.current!);
    setAnswered(true);
    if (it.isCoin) {
      setCoins(c => c + 1);
      const ns = streak + 1;
      setStreak(ns);
      setBestStreak(b => Math.max(b, ns));
      setScore(s => s + 10 + ns * 2);
      setFeedback("coin");
    } else {
      setStreak(0);
      const nl = lives - 1;
      setLives(nl);
      setFeedback("hit");
      if (nl <= 0) { setTimeout(() => setPhase("result"), 700); return; }
    }
    setTimeout(() => {
      setItems([]);
      setIdx(i => { const n = i + 1; if (n >= questions.length) { setPhase("result"); return i; } return n; });
    }, 600);
  };

  const timerPct = (qTimer / QUESTION_TIMER) * 100;
  const timerColor = qTimer <= 5 ? "bg-rose-500" : qTimer <= 9 ? "bg-amber-500" : "bg-cyan-500";

  if (phase === "intro") return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <Header student={student} />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-4">🪙</div>
          <h1 className="text-3xl font-black text-white mb-2">Samla mynt!</h1>
          <p className="text-yellow-300 text-sm mb-6 leading-relaxed">
            Rätt engelsk översättning faller ner som guldmynt. Fel svar är bomber. Rör dig till rätt bana!
          </p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between text-white/80"><span>Tid per fråga</span><span className="font-bold text-cyan-400">{QUESTION_TIMER}s</span></div>
            <div className="flex justify-between text-white/80"><span>Liv</span><span className="font-bold text-red-400">❤️❤️❤️</span></div>
            <div className="flex justify-between text-white/80"><span>Nivå</span><span className="font-bold text-amber-400">{stageName}</span></div>
          </div>
          <p className="text-xs text-white/50 mb-6">💡 Klicka på rätt bana för att samla myntet!</p>
          <button onClick={startGame} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-lg rounded-2xl hover:opacity-90 transition active:scale-95 cursor-pointer">Starta!</button>
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
          <div className="text-6xl mb-3">{lives > 0 ? "🏆" : "💔"}</div>
          <h2 className="text-2xl font-black text-white mb-1">{lives > 0 ? "Bra springning!" : "Du kraschade!"}</h2>
          <p className="text-yellow-300 text-sm mb-5">{coins} mynt samlade</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Mynt", value: coins, emoji: "🪙" },
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
            <button onClick={startGame} className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition active:scale-95 cursor-pointer">Spela igen</button>
            <Link href={`/world/${stageId}`} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition text-center">Tillbaka</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <Header student={student} />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-4 flex flex-col" style={{ height: "100svh" }}>
        {/* HUD */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold">🪙 {coins}</span>
            {streak >= 3 && <span className="text-orange-400 font-black text-sm">🔥 {streak}</span>}
          </div>
          <span className={`text-xl font-black ${qTimer <= 5 ? "text-rose-400 animate-pulse" : "text-white"}`}>{qTimer}s</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-base ${i < lives ? "text-red-400" : "text-white/20"}`}>❤️</span>
            ))}
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
        </div>

        {/* Question */}
        {q && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3 text-center">
            <p className="text-white/50 text-xs mb-1">🇸🇪 Vad heter det på engelska?</p>
            <p className="text-white text-xl font-black">{q.sv}</p>
          </div>
        )}

        {/* Two lanes */}
        <div className="flex gap-3 flex-1 min-h-0" style={{ minHeight: 200 }}>
          {([0, 1] as const).map(lane => {
            const laneItems = items.filter(it => it.lane === lane);
            const isPlayer = playerLane === lane;
            return (
              <button
                key={lane}
                onClick={() => setPlayerLane(lane)}
                className={`flex-1 relative rounded-2xl overflow-hidden transition-all cursor-pointer ${
                  isPlayer ? "border-2 border-yellow-400/60 bg-yellow-900/20" : "border border-white/10 bg-white/5"
                }`}
              >
                <div className="absolute top-2 left-0 right-0 text-center text-white/30 text-xs pointer-events-none">
                  {lane === 0 ? "Vänster" : "Höger"}
                </div>

                {/* Falling items */}
                {laneItems.map(it => (
                  <div key={it.id} className="absolute left-0 right-0 flex justify-center pointer-events-none" style={{ top: `${it.y}%` }}>
                    <div className={`px-4 py-2 rounded-full font-black text-sm shadow-lg ${
                      it.isCoin ? "bg-yellow-500 text-yellow-900 shadow-yellow-500/40" : "bg-red-700 text-red-100 shadow-red-700/40"
                    }`}>
                      {it.isCoin ? "🪙" : "💣"} {it.text}
                    </div>
                  </div>
                ))}

                {/* Player car */}
                {isPlayer && (
                  <div className={`absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none transition-all duration-200 ${
                    feedback === "coin" ? "scale-125" : feedback === "hit" ? "opacity-50" : "scale-100"
                  }`}>
                    <svg viewBox="0 0 64 28" width="72" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M6 20 Q4 20 3 18 L3 15 Q3 13 6 12 L14 8 Q18 5 26 5 L42 5 Q50 5 54 8 L59 12 Q62 13 62 15 L62 18 Q61 20 59 20 Z" fill="#ef4444" />
                      <path d="M22 11 L24 5.5 Q26 5 28 5 L38 5 Q40 5 42 5.5 L44 11 Z" fill="#1e1b4b" opacity="0.9" />
                      <rect x="14" y="13" width="36" height="2.5" rx="1" fill="#fbbf24" opacity="0.85" />
                      <circle cx="16" cy="21" r="5.5" fill="#1f2937" /><circle cx="16" cy="21" r="3" fill="#374151" /><circle cx="16" cy="21" r="1.2" fill="#9ca3af" />
                      <circle cx="50" cy="21" r="5.5" fill="#1f2937" /><circle cx="50" cy="21" r="3" fill="#374151" /><circle cx="50" cy="21" r="1.2" fill="#9ca3af" />
                      <ellipse cx="2" cy="16" rx="3" ry="1.5" fill="#f97316" opacity="0.9" />
                      <text x="32" y="17" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">01</text>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}

          {/* Feedback overlay */}
          {feedback && (
            <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 text-2xl font-black pointer-events-none ${
              feedback === "coin" ? "text-yellow-400" : "text-rose-400"
            }`}>
              {feedback === "coin" ? "+🪙" : "💥 Aj!"}
            </div>
          )}
        </div>

        <p className="text-center text-white/25 text-xs mt-2">
          Klicka på rätt bana för att samla myntet — du har {QUESTION_TIMER}s!
        </p>
      </div>
    </div>
  );
}
