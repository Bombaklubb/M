"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
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
  for (const m of Object.values(sp.readingModules    ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.spellingModules   ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.wordsearchModules ?? {})) if (m.completed) done++;
  return done;
}

export default function HomePage() {
  const [student,        setStudent]        = useState<StudentData | null>(null);
  const [nameInput,      setNameInput]      = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("ninja");
  const [loading,        setLoading]        = useState(true);
  const [returningName,  setReturningName]  = useState<string | null>(null);

  useEffect(() => {
    setStudent(loadStudent());
    setLoading(false);
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
                          <p className="text-white/70 font-semibold text-sm mt-0.5">{stage.subtitle} · {stage.grades}</p>
                          <p className="text-white/55 text-xs mt-1 leading-snug line-clamp-2">{stage.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white dark:bg-gray-800 px-5 py-3 flex items-center justify-between">
                      {done > 0 ? (
                        <span className="text-sm font-semibold flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span><NumberTicker value={done} duration={500} /> modul{done !== 1 ? "er" : ""} klarade</span>
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Inte börjat än
                        </span>
                      )}
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
