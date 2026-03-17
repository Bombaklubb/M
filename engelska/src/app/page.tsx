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
    const stageCards = STAGES.map((s) => ({
      emoji: s.emoji,
      name: s.name,
      label: s.grades,
      color: s.bgClass,
    }));

    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 gap-6"
        style={{
          background: "linear-gradient(135deg, #e8f0fd 0%, #f0f4ff 30%, #fff5f5 70%, #f0f8ff 100%)"
        }}
      >
        {/* Left stage cards */}
        <div className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0">
          {stageCards.slice(0, 2).map((s, i) => (
            <div
              key={s.name}
              className={`rounded-3xl overflow-hidden aspect-[4/3] relative border-3 border-white/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${s.color}`}
              style={{
                boxShadow: "0 6px 0 0 rgba(37, 99, 235, 0.2), 0 10px 20px -4px rgba(37, 99, 235, 0.15)",
                animation: `float 3s ease-in-out infinite ${i * 0.5}s`
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="text-4xl mb-2">{s.emoji}</div>
                <p className="text-white font-bold text-base leading-tight drop-shadow-lg">{s.name}</p>
                <p className="text-white/80 text-sm font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center: login card */}
        <div className="w-full max-w-md animate-slide-up flex-shrink-0">
          {/* Title */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-4 text-5xl animate-float border-4 border-white/60"
              style={{
                background: "linear-gradient(135deg, #2563eb, #1e40af)",
                boxShadow: "0 8px 0 0 rgba(30, 64, 175, 0.4), 0 12px 24px -4px rgba(37, 99, 235, 0.3), inset 0 4px 8px 0 rgba(255, 255, 255, 0.3)"
              }}
            >
              🇬🇧
            </div>
            <h1 className="text-5xl font-black tracking-tight drop-shadow-sm" style={{ color: "#1e3268" }}>
              Engelskajakten
            </h1>
            <p className="mt-2 text-lg font-bold" style={{ color: "#2563eb" }}>
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Login card */}
          <div
            className="bg-white rounded-4xl p-8 border-3 border-en-100"
            style={{
              boxShadow: "0 8px 0 0 rgba(37, 99, 235, 0.12), 0 16px 32px -8px rgba(37, 99, 235, 0.18), inset 0 4px 8px 0 rgba(255, 255, 255, 0.8)"
            }}
          >
            <h2 className="text-2xl font-bold mb-1" style={{ color: "#1e3268" }}>Välkommen!</h2>
            <p className="text-en-400 text-base mb-6 font-medium">
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
                          ? "0 4px 0 0 rgba(37, 99, 235, 0.3), 0 6px 12px -2px rgba(37, 99, 235, 0.2), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
                          : "0 3px 0 0 rgba(37, 99, 235, 0.12), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
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
                <p className="text-sm font-bold mt-3 text-center" style={{ color: "#2563eb" }}>
                  {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                </p>
              </div>

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full btn-primary text-xl py-4 rounded-2xl border-3 border-en-400 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 disabled:border-gray-200"
                style={{ background: nameInput.trim() ? "linear-gradient(135deg, #dc2626, #b91c1c)" : undefined }}
              >
                Starta jakten! 🚀
              </button>
            </form>
          </div>
        </div>

        {/* Right stage cards */}
        <div className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0">
          {stageCards.slice(2, 4).map((s, i) => (
            <div
              key={s.name}
              className={`rounded-3xl overflow-hidden aspect-[4/3] relative border-3 border-white/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${s.color}`}
              style={{
                boxShadow: "0 6px 0 0 rgba(37, 99, 235, 0.2), 0 10px 20px -4px rgba(37, 99, 235, 0.15)",
                animation: `float 3s ease-in-out infinite ${(i + 2) * 0.5}s`
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="text-4xl mb-2">{s.emoji}</div>
                <p className="text-white font-bold text-base leading-tight drop-shadow-lg">{s.name}</p>
                <p className="text-white/80 text-sm font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Logged in – stage selection ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-en-50 dark:bg-gray-900">
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-en-900 dark:text-gray-100">Välj din värld</h2>
          <p className="text-en-400 dark:text-gray-400 font-medium mt-1">
            Välkommen tillbaka, {student.name}! Totalt ⭐ {student.totalPoints} poäng.
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
