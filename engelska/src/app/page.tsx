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

  useEffect(() => {
    setStudent(loadStudent());
    setLoading(false);
  }, []);

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
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-4 text-5xl animate-float border-4 border-white/30"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 0 0 rgba(0,0,0,0.2), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)"
              }}
            >
              🇬🇧
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg">
              Engelskajakten
            </h1>
            <p className="mt-2 text-lg font-bold text-white/80">
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Login card */}
          <div
            className="bg-white rounded-4xl p-8"
            style={{
              boxShadow: "0 8px 0 0 rgba(0,0,0,0.2), 0 20px 40px -8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.9)"
            }}
          >
            <h2 className="text-2xl font-bold mb-1" style={{ color: "#1e3268" }}>Välkommen!</h2>
            <p className="text-gray-500 text-base mb-6 font-medium">
              Skriv ditt namn för att börja eller fortsätta.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ditt namn..."
                className="input-field text-xl"
                autoFocus
                maxLength={30}
              />

              {/* Avatar selection */}
              <div>
                <p className="text-base font-bold mb-3" style={{ color: "#1e40af" }}>Välj din karaktär</p>
                <div className="grid grid-cols-5 gap-3">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      title={avatar.name}
                      className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 overflow-hidden text-2xl cursor-pointer border-3 ${
                        selectedAvatar === avatar.id
                          ? "border-en-400 scale-110 bg-en-50"
                          : "border-en-100 bg-en-50 hover:border-en-300 hover:scale-105"
                      }`}
                      style={{
                        boxShadow: selectedAvatar === avatar.id
                          ? "0 4px 0 0 rgba(37,99,235,0.3), inset 0 2px 4px 0 rgba(255,255,255,0.8)"
                          : "0 3px 0 0 rgba(37,99,235,0.1), inset 0 2px 4px 0 rgba(255,255,255,0.8)"
                      }}
                    >
                      {avatar.image ? (
                        <img src={avatar.image} alt={avatar.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        avatar.emoji
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm font-bold mt-3 text-center text-en-500">
                  {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                </p>
              </div>

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full btn-primary text-xl py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: nameInput.trim() ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "rgba(0,0,0,0.1)" }}
              >
                Starta jakten! 🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── Logged in – stage selection ─────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white drop-shadow">Välj din värld</h2>
          <p className="text-white/70 font-medium mt-1">
            Välkommen tillbaka, {student.name}! Vilket stadie vill du träna på?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {STAGES.map((stage) => {
            const pts  = getStagePoints(student, stage.id);
            const done = getStageCompleted(student, stage.id);

            return (
              <Link key={stage.id} href={`/world/${stage.id}`} className="block group">
                <div
                  className={`relative rounded-3xl overflow-hidden border-3 transition-all duration-200 group-hover:-translate-y-2 cursor-pointer ${stage.borderClass}`}
                  style={{
                    boxShadow: "0 6px 0 0 rgba(0, 0, 0, 0.15), 0 12px 24px -6px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {/* Background */}
                  <div className={`${stage.bgClass} p-6 pb-8`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-5xl drop-shadow-lg">{stage.emoji}</span>
                      {pts > 0 && (
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                          <span className="text-yellow-300 text-sm">⭐</span>
                          <span className="text-white font-bold text-sm">{pts}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-white text-shadow">{stage.name}</h3>
                    <p className="text-white/70 font-semibold text-sm mt-0.5">{stage.subtitle} · {stage.grades}</p>
                    <p className="text-white/60 text-xs mt-2 leading-relaxed">{stage.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
                    {done > 0 ? (
                      <span className="text-sm font-semibold flex items-center gap-1.5 text-green-600 dark:text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        {done} modul{done !== 1 ? "er" : ""} klarade
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                        Inte börjat än
                      </span>
                    )}
                    <span
                      className="text-sm font-bold px-4 py-1.5 rounded-xl text-white transition-transform group-hover:scale-105"
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
