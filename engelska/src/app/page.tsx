"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { AVATARS } from "@/lib/avatars";
import type { StudentData, StageId } from "@/lib/types";

function getStagePoints(student: StudentData, stageId: string): number {
  const sp = student.stages[stageId as StageId];
  if (!sp) return 0;
  let pts = 0;
  for (const m of Object.values(sp.grammarModules    ?? {})) pts += m.points;
  for (const m of Object.values(sp.readingModules    ?? {})) pts += m.points;
  for (const m of Object.values(sp.spellingModules   ?? {})) pts += m.points;
  for (const m of Object.values(sp.wordsearchModules ?? {})) pts += m.points;
  for (const m of Object.values(sp.crosswordModules  ?? {})) pts += m.points;
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
  for (const m of Object.values(sp.crosswordModules  ?? {})) if (m.completed) done++;
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

  // Check if the typed name belongs to an existing student on this device
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

  // ─── Login screen ────────────────────────────────────────────────────────────
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">

          {/* Title */}
          <div className="text-center mb-4">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-3 animate-float border-4 border-white/30 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 0 0 rgba(0,0,0,0.2), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)"
              }}
            >
              <img src="/engelskajakten-logo.png" alt="Union Jack" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
              Engelskajakten
            </h1>
            <p className="mt-1 text-base font-bold text-white/80">
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Login card */}
          <div
            className="bg-white rounded-4xl p-5"
            style={{
              boxShadow: "0 8px 0 0 rgba(0,0,0,0.2), 0 20px 40px -8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.9)"
            }}
          >
            <h2 className="text-xl font-bold mb-0.5" style={{ color: "#1e3268" }}>Välkommen!</h2>
            <p className="text-gray-500 text-sm mb-4 font-medium">
              Skriv ditt namn för att börja eller fortsätta.
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ditt namn..."
                className="input-field !py-2.5 !text-base"
                autoFocus
                maxLength={30}
              />

              {/* Returning student indicator */}
              {returningName && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-200">
                  <span className="text-green-600 text-base">✓</span>
                  <p className="text-green-700 text-sm font-semibold">
                    Hej {returningName}! Din sparade progress hämtas.
                  </p>
                </div>
              )}

              {/* Avatar selection */}
              <div>
                <p className="text-sm font-bold mb-2" style={{ color: "#1e40af" }}>Välj din karaktär</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      title={avatar.name}
                      className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden text-xl cursor-pointer border-2 ${
                        selectedAvatar === avatar.id
                          ? "border-en-400 scale-110 bg-en-50"
                          : "border-en-100 bg-en-50 hover:border-en-300 hover:scale-105"
                      }`}
                      style={{
                        boxShadow: selectedAvatar === avatar.id
                          ? "0 3px 0 0 rgba(37,99,235,0.3), inset 0 2px 4px 0 rgba(255,255,255,0.8)"
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

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full btn-primary text-base py-3 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: nameInput.trim() ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "rgba(0,0,0,0.1)" }}
              >
                {returningName ? "Fortsätt jakten! →" : "Starta jakten! 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── Logged in – stage selection ─────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col">
      <Header student={student} onLogout={handleLogout} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 flex flex-col min-h-0">
        <div className="mb-3">
          <h2 className="text-xl font-black text-white drop-shadow">Välj din värld</h2>
          <p className="text-white/70 font-medium text-sm mt-0.5">
            Välkommen tillbaka, {student.name}! Vilket stadie vill du träna på?
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0">
          {STAGES.map((stage) => {
            const pts  = getStagePoints(student, stage.id);
            const done = getStageCompleted(student, stage.id);

            return (
              <Link key={stage.id} href={`/world/${stage.id}`} className="block group h-full">
                <div
                  className={`relative rounded-2xl overflow-hidden border-3 transition-all duration-200 group-hover:-translate-y-1 cursor-pointer h-full flex flex-col ${stage.borderClass}`}
                  style={{
                    boxShadow: "0 4px 0 0 rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {/* Background – grows to fill available height */}
                  <div className={`flex-1 ${stage.bgClass} px-5 py-5 flex items-center`}>
                    <div className="flex items-center gap-4 w-full">
                      <span className="text-5xl drop-shadow-lg flex-shrink-0">{stage.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xl font-black text-white text-shadow leading-tight">{stage.name}</h3>
                          {pts > 0 && (
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-0.5 flex items-center gap-1 flex-shrink-0">
                              <span className="text-yellow-300 text-sm">⭐</span>
                              <span className="text-white font-bold text-sm">{pts}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-white/70 font-medium text-sm mt-1">{stage.subtitle} · {stage.grades}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-white dark:bg-gray-800 px-5 py-3 flex items-center justify-between">
                    {done > 0 ? (
                      <span className="text-sm font-semibold flex items-center gap-1 text-green-600 dark:text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        {done} modul{done !== 1 ? "er" : ""} klarade
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                        Inte börjat än
                      </span>
                    )}
                    <span
                      className="text-sm font-bold px-4 py-1.5 rounded-lg text-white transition-transform group-hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                    >
                      Öppna →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
