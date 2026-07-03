"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent, claimDailyBonus } from "@/lib/storage";
import { getDailyQuests, loadQuestState, claimQuest, questProgress, type Quest, type QuestState } from "@/lib/quests";
import { STAGES } from "@/lib/stages";
import { AVATARS } from "@/lib/avatars";
import type { StudentData, StageId } from "@/lib/types";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

function getStagePoints(student: StudentData, stageId: string): number {
  const sp = student.stages[stageId as StageId];
  if (!sp) return 0;
  let pts = 0;
  for (const m of Object.values(sp.grammarModules    ?? {})) pts += m.points;
  for (const m of Object.values(sp.readingModules    ?? {})) pts += m.points;
  for (const m of Object.values(sp.spellingModules   ?? {})) pts += m.points;
  for (const m of Object.values(sp.wordsearchModules ?? {})) pts += m.points;
  return pts;
}

function getStageCompleted(student: StudentData, stageId: string): number {
  const sp = student.stages[stageId as StageId];
  if (!sp) return 0;
  let done = 0;
  for (const m of Object.values(sp.grammarModules    ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.spellingModules   ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.wordsearchModules ?? {})) if (m.completed) done++;
  return done;
}

// Small circular progress ring shown on each stage card
function ProgressRing({ pct }: { pct: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  const done = pct >= 100;
  const started = pct > 0;
  const color = done ? "#16a34a" : started ? "#f59e0b" : "#cbd5e1";
  return (
    <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="4" />
        <circle
          cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}

export default function HomePage() {
  const [student,        setStudent]        = useState<StudentData | null>(null);
  const [nameInput,      setNameInput]      = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("ninja");
  const [loading,        setLoading]        = useState(true);
  const [returningName,  setReturningName]  = useState<string | null>(null);
  const [totals,         setTotals]         = useState<Record<string, number>>({});
  const [dailyBonus,     setDailyBonus]     = useState(0);
  const [questState,     setQuestState]     = useState<QuestState | null>(null);

  useEffect(() => {
    const s = loadStudent();
    if (s) {
      const bonus = claimDailyBonus();
      if (bonus > 0) {
        setDailyBonus(bonus);
        setStudent(loadStudent()); // ladda om med uppdaterade poäng
      } else {
        setStudent(s);
      }
      setQuestState(loadQuestState(s.name));
    } else {
      setStudent(s);
    }
    setLoading(false);
    // Fetch total module counts per stage for the progress rings
    Promise.all(
      STAGES.map((s) =>
        fetch(`/content/${s.id}/content.json`)
          .then((r) => r.json())
          .then((d) => [
            s.id,
            (d.grammar?.length ?? 0) + (d.spelling?.length ?? 0) + (d.wordsearch?.length ?? 0),
          ] as [string, number])
          .catch(() => [s.id, 0] as [string, number])
      )
    ).then((entries) => setTotals(Object.fromEntries(entries)));
  }, []);

  function handleNameChange(value: string) {
    setNameInput(value);
    if (typeof window === "undefined") return;
    const key = `engelskajakten_student_${value.toLowerCase().trim()}`;
    setReturningName(value.trim().length >= 2 && localStorage.getItem(key) ? value.trim() : null);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setStudent(createStudent(nameInput.trim(), selectedAvatar));
  }

  function handleLogout() {
    clearStudent();
    setStudent(null);
    setNameInput("");
  }

  function handleClaimQuest(q: Quest) {
    if (!student) return;
    const reward = claimQuest(student.name, q);
    if (reward > 0) {
      setStudent(loadStudent());
      setQuestState(loadQuestState(student.name));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">🇬🇧</div>
      </div>
    );
  }

  // ─── Login screen ─────────────────────────────────────────────────────────────
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Title */}
          <BlurFade delay={0} duration={0.5} inView>
            <div className="text-center mb-5">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-4 animate-float border-4 border-white/30 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 0 0 rgba(0,0,0,0.2), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)"
                }}
              >
                <img src="/union-jack.svg" alt="Union Jack" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg">
                Engelskajakten
              </h1>
              <p className="mt-2 text-lg font-bold">
                <AnimatedGradientText className="text-lg font-black" style={{
                  backgroundImage: "linear-gradient(135deg, #fbbf24, #f9fafb, #60a5fa, #f9fafb, #fbbf24)",
                  backgroundSize: "300% auto",
                }}>
                  Lär dig engelska på ett roligt sätt!
                </AnimatedGradientText>
              </p>
            </div>
          </BlurFade>

          {/* Login card */}
          <BlurFade delay={0.15} duration={0.5} inView>
            <div
              className="bg-white rounded-4xl p-6"
              style={{
                boxShadow: "0 8px 0 0 rgba(0,0,0,0.2), 0 20px 40px -8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.9)"
              }}
            >
              <h2 className="text-2xl font-black mb-0.5" style={{ color: "#1e3268" }}>Välkommen!</h2>
              <p className="text-gray-500 text-sm mb-5 font-medium">
                Skriv ditt namn för att börja eller fortsätta.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ditt namn..."
                  className="input-field !py-3 !text-base"
                  autoFocus
                  maxLength={30}
                />

                {returningName && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-green-50 border-2 border-green-200">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <p className="text-green-700 text-sm font-semibold">
                      Hej {returningName}! Din sparade progress hämtas.
                    </p>
                  </div>
                )}

                {/* Avatar selection */}
                <div>
                  <p className="text-sm font-bold mb-2.5" style={{ color: "#1e40af" }}>Välj din karaktär</p>
                  <div className="grid grid-cols-8 gap-2">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar.id)}
                        title={avatar.name}
                        className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 overflow-hidden text-xl cursor-pointer border-3 ${
                          selectedAvatar === avatar.id
                            ? "border-en-400 scale-110 bg-en-50"
                            : "border-en-100 bg-en-50 hover:border-en-300 hover:scale-105"
                        }`}
                        style={{
                          boxShadow: selectedAvatar === avatar.id
                            ? "0 4px 0 0 rgba(37,99,235,0.25), inset 0 2px 4px 0 rgba(255,255,255,0.8)"
                            : "0 2px 0 0 rgba(37,99,235,0.1), inset 0 2px 4px 0 rgba(255,255,255,0.8)"
                        }}
                      >
                        {avatar.image ? (
                          <img src={avatar.image} alt={avatar.name} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          avatar.emoji
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-bold mt-1.5 text-center text-en-500">
                    {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                  </p>
                </div>

                <ShimmerButton
                  type="submit"
                  disabled={!nameInput.trim()}
                  className="w-full py-3.5 text-base rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  background={nameInput.trim()
                    ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                    : "rgba(0,0,0,0.1)"
                  }
                  style={{
                    boxShadow: nameInput.trim()
                      ? "0 4px 0 0 rgba(185,28,28,0.4), 0 8px 16px -4px rgba(185,28,28,0.3)"
                      : "none"
                  }}
                >
                  {returningName ? "Fortsätt jakten! →" : "Starta jakten! 🚀"}
                </ShimmerButton>
              </form>
            </div>
          </BlurFade>
        </div>
      </div>
    );
  }

  // ─── Logged in – stage selection ──────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col">
      <Header student={student} onLogout={handleLogout} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 flex flex-col min-h-0">
        {dailyBonus > 0 && (
          <BlurFade delay={0} duration={0.4} inView>
            <div
              className="mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white border-2 border-white/30"
              style={{ boxShadow: "0 4px 0 0 rgba(5,150,105,0.4), 0 8px 16px -4px rgba(5,150,105,0.3)" }}
              role="status"
            >
              <span className="flex items-center gap-2 font-black">
                <span className="text-2xl">🎁</span>
                Daglig bonus! +{dailyBonus} ⭐ för att du kom tillbaka idag
              </span>
              <button
                onClick={() => setDailyBonus(0)}
                className="text-white/80 hover:text-white text-xl leading-none px-1 cursor-pointer"
                aria-label="Stäng"
              >
                ✕
              </button>
            </div>
          </BlurFade>
        )}
        {/* Dagens uppdrag */}
        {questState && (
          <BlurFade delay={0.02} duration={0.4} inView>
            <div className="mb-4 rounded-2xl border-2 border-white/25 bg-white/10 backdrop-blur-sm p-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-white font-black text-sm">📋 Dagens uppdrag</h3>
                <span className="text-white/60 text-xs font-bold hidden sm:inline">Nya uppdrag varje dag!</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {getDailyQuests().map((q) => {
                  const prog = Math.min(questProgress(questState, q), q.target);
                  const done = prog >= q.target;
                  const claimed = questState.claimed.includes(q.id);
                  return (
                    <div key={q.id} className="rounded-xl bg-white/10 border border-white/20 px-3 py-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-white text-xs font-bold truncate">{q.icon} {q.title}</span>
                        <span className="text-amber-300 text-xs font-black flex-shrink-0">+{q.reward} ⭐</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-white/15 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-400" : "bg-amber-400"}`}
                          style={{ width: `${(prog / q.target) * 100}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-white/60 text-[11px] font-bold">{prog}/{q.target}</span>
                        {claimed ? (
                          <span className="text-emerald-300 text-[11px] font-black">Hämtad ✓</span>
                        ) : done ? (
                          <button
                            onClick={() => handleClaimQuest(q)}
                            className="text-[11px] font-black text-white bg-emerald-500 hover:bg-emerald-400 rounded-lg px-2.5 py-1 cursor-pointer transition active:scale-95"
                          >
                            Hämta! 🎁
                          </button>
                        ) : (
                          <span className="text-white/40 text-[11px] font-bold">Pågår…</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BlurFade>
        )}

        <BlurFade delay={0} duration={0.4} inView>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white drop-shadow">Välj din värld</h2>
            <p className="text-white/70 font-medium text-sm mt-0.5">
              Välkommen tillbaka, <span className="text-white font-black">{student.name}</span>! Vilket stadie vill du träna på?
            </p>
          </div>
        </BlurFade>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0">
          {STAGES.map((stage, i) => {
            const pts  = getStagePoints(student, stage.id);
            const done = getStageCompleted(student, stage.id);
            const total = totals[stage.id] ?? 0;
            const pct  = total > 0 ? (done / total) * 100 : 0;

            return (
              <BlurFade key={stage.id} delay={0.05 + i * 0.07} duration={0.4} inView>
                <Link href={`/world/${stage.id}`} className="block group h-full">
                  <div
                    className={`relative rounded-3xl overflow-hidden border-3 transition-all duration-200 group-hover:-translate-y-1.5 group-hover:scale-[1.01] cursor-pointer h-full flex flex-col ${stage.borderClass}`}
                    style={{
                      boxShadow: "0 5px 0 0 rgba(0,0,0,0.18), 0 10px 24px -4px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    {/* Background */}
                    <div className={`flex-1 ${stage.bgClass} px-5 py-5 flex items-center`}>
                      <div className="flex items-center gap-4 w-full">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 border-3 border-white/25"
                          style={{
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(4px)",
                            boxShadow: "0 4px 0 0 rgba(0,0,0,0.15), inset 0 2px 4px 0 rgba(255,255,255,0.25)"
                          }}
                        >
                          {stage.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xl font-black text-white text-shadow leading-tight">{stage.name}</h3>
                            {pts > 0 && (
                              <div
                                className="bg-white/20 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 flex-shrink-0 border border-white/30"
                                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }}
                              >
                                <svg className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <NumberTicker value={pts} className="text-white font-black text-sm" duration={600} />
                              </div>
                            )}
                          </div>
                          <p className="text-white/70 font-semibold text-sm mt-0.5">{stage.subtitle}</p>
                          <p className="text-white/55 text-xs mt-1 leading-snug line-clamp-2">{stage.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white dark:bg-gray-800 px-5 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ProgressRing pct={pct} />
                        {done > 0 ? (
                          <span className="text-sm font-semibold flex items-center gap-1.5 text-green-600 dark:text-green-400">
                            <span className="truncate">
                              <NumberTicker value={done} duration={500} />
                              {total > 0 ? `/${total}` : ""} modul{done !== 1 ? "er" : ""} klarade
                            </span>
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Inte börjat än
                          </span>
                        )}
                      </div>
                      <ShimmerButton
                        background="linear-gradient(135deg, #dc2626, #b91c1c)"
                        className="text-sm px-4 py-1.5 rounded-xl"
                        style={{ boxShadow: "0 3px 0 0 rgba(185,28,28,0.35)" }}
                      >
                        Öppna →
                      </ShimmerButton>
                    </div>
                  </div>
                </Link>
              </BlurFade>
            );
          })}
        </div>
      </main>
    </div>
  );
}
