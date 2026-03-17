"use client";
// deploy trigger 2026-03-13
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { AVATARS } from "@/lib/avatars";
import type { StudentData, StageId } from "@/lib/types";
import { NumberTicker } from "@/components/magicui/number-ticker";

// Stage accent colors
const stageAccents: Record<string, { from: string; to: string; badge: string }> = {
  lagstadiet:    { from: "#14532d", to: "#166534", badge: "#4ade80" },
  mellanstadiet: { from: "#0f2b6b", to: "#1d4ed8", badge: "#93c5fd" },
  hogstadiet:    { from: "#7f1d1d", to: "#b91c1c", badge: "#fca5a5" },
  gymnasiet:     { from: "#1f2937", to: "#374151", badge: "#d1d5db" },
};

const stageImages: Record<string, string> = {
  lagstadiet:    "/content/sprakdjungeln.png",
  mellanstadiet: "/content/sprakstaden.png",
  hogstadiet:    "/content/sprakarenan.png",
  gymnasiet:     "/content/sprakakademin.png",
};

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

// Decorative floating letters for background
const FLOAT_ITEMS = [
  { text: "A", x: "6%",  y: "10%", size: "2.5rem", delay: "0s",   dur: "6s"  },
  { text: "B", x: "87%", y: "7%",  size: "2rem",   delay: "0.8s", dur: "7s"  },
  { text: "C", x: "4%",  y: "68%", size: "3rem",   delay: "1.5s", dur: "5s"  },
  { text: "D", x: "91%", y: "63%", size: "1.8rem", delay: "2s",   dur: "8s"  },
  { text: "E", x: "14%", y: "86%", size: "2rem",   delay: "0.4s", dur: "6.5s"},
  { text: "F", x: "79%", y: "83%", size: "2.5rem", delay: "1.2s", dur: "7s"  },
  { text: "?", x: "74%", y: "28%", size: "2.8rem", delay: "0.6s", dur: "5.5s"},
  { text: "!", x: "19%", y: "38%", size: "2rem",   delay: "1.8s", dur: "6s"  },
  { text: "Z", x: "49%", y: "4%",  size: "1.6rem", delay: "2.5s", dur: "7.5s"},
  { text: "X", x: "59%", y: "91%", size: "2rem",   delay: "3s",   dur: "6s"  },
];

const BG = "linear-gradient(160deg, #0a1744 0%, #0e2882 30%, #1242a0 55%, #0d246b 80%, #0a1744 100%)";

export default function HomePage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("ninja");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStudent(loadStudent());
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const data = createStudent(nameInput.trim(), selectedAvatar);
    setStudent(data);
  }

  function handleLogout() {
    clearStudent();
    setStudent(null);
    setNameInput("");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Login screen ────────────────────────────────────────────────────────────
  if (!student) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: BG }}
      >
        {/* Floating decorative letters */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          {FLOAT_ITEMS.map((item) => (
            <span
              key={item.text + item.x}
              className="absolute font-black text-white/[0.07] animate-float"
              style={{
                left: item.x,
                top: item.y,
                fontSize: item.size,
                animationDuration: item.dur,
                animationDelay: item.delay,
              }}
            >
              {item.text}
            </span>
          ))}
        </div>

        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #dc2626, transparent)" }}
          />
          <div
            className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #ffffff, transparent)" }}
          />
        </div>

        {/* Login card */}
        <div className="relative w-full max-w-md animate-slide-up z-10">

          {/* Logo & title */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-22 h-22 rounded-2xl overflow-hidden mb-4 animate-float"
              style={{ boxShadow: "0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(220,38,38,0.25)" }}
            >
              <img
                src="/content/engelskajakten-icon.png"
                alt="Engelskajakten"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
              Engelskajakten
            </h1>
            <p className="text-blue-200 text-sm font-medium mt-1">
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.97)",
              border: "1px solid rgba(255,255,255,0.4)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Name input */}
              <div>
                <label className="block text-sm font-bold mb-2 text-blue-900/70">
                  Vad heter du?
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ditt namn..."
                  autoFocus
                  maxLength={30}
                  className="w-full px-4 py-3.5 rounded-2xl text-blue-900 placeholder-blue-900/30 text-base font-medium focus:outline-none transition-all bg-blue-50/60 border border-blue-200"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(29,78,216,0.7)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Avatar selection */}
              <div>
                <p className="text-sm font-bold mb-2 text-blue-900/70">
                  Välj din karaktär
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      title={avatar.name}
                      className="aspect-square rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden cursor-pointer"
                      style={{
                        background: selectedAvatar === avatar.id
                          ? "rgba(29,78,216,0.12)"
                          : "rgba(10,36,99,0.04)",
                        border: selectedAvatar === avatar.id
                          ? "2px solid rgba(29,78,216,0.8)"
                          : "2px solid rgba(10,36,99,0.1)",
                        transform: selectedAvatar === avatar.id ? "scale(1.1)" : "scale(1)",
                        boxShadow: selectedAvatar === avatar.id
                          ? "0 0 12px rgba(29,78,216,0.3)"
                          : "none",
                      }}
                    >
                      {avatar.image ? (
                        <img
                          src={avatar.image}
                          alt={avatar.name}
                          className="w-full h-full object-contain p-0.5"
                        />
                      ) : (
                        <span className="text-xl">{avatar.emoji}</span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedAvatar && (
                  <p className="text-xs font-medium text-blue-600 mt-2 text-center">
                    {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full py-3.5 rounded-2xl font-black text-white text-base transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: nameInput.trim()
                    ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                    : "rgba(10,36,99,0.1)",
                  boxShadow: nameInput.trim()
                    ? "0 4px 20px rgba(220,38,38,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "none",
                }}
              >
                Starta jakten!
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-6 text-white/30">
            Kontakt: martin.akdogan@enkoping.se
          </p>
        </div>
      </div>
    );
  }

  // ─── Logged-in: stage selection ──────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden mb-4"
            style={{ boxShadow: "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(220,38,38,0.2)" }}
          >
            <img
              src="/content/engelskajakten-icon.png"
              alt="Engelskajakten"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-white/50 text-xs font-bold tracking-widest uppercase">
            Välj din värld
          </p>
        </div>

        {/* Stage cards — 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STAGES.map((stage) => {
            const pts    = getStagePoints(student, stage.id);
            const done   = getStageCompleted(student, stage.id);
            const accent = stageAccents[stage.id];

            return (
              <Link key={stage.id} href={`/world/${stage.id}`} className="block group cursor-pointer">
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl"
                  style={{
                    background: "rgba(255,255,255,0.97)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Image header */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={stageImages[stage.id]}
                      alt={stage.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45))",
                      }}
                    />
                    {/* Grade badge */}
                    <span
                      className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        border: `1px solid ${accent.badge}60`,
                        color: accent.badge,
                      }}
                    >
                      {stage.grades}
                    </span>
                    {/* Completed badge */}
                    {done > 0 && (
                      <span className="absolute top-3 right-3 text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30">
                        ✓ {done}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="text-blue-900 font-black text-base leading-tight">
                      {stage.name}
                    </h3>
                    <p className="text-blue-900/50 text-xs mt-0.5">{stage.subtitle}</p>

                    <div className="flex items-center justify-between mt-3">
                      {pts > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500 text-sm">⭐</span>
                          <NumberTicker
                            value={pts}
                            className="text-amber-600 font-bold text-sm"
                            duration={800}
                          />
                          <span className="text-blue-900/40 text-xs">p</span>
                        </div>
                      ) : (
                        <span className="text-blue-900/40 text-xs font-medium">
                          Inte börjat än
                        </span>
                      )}
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 group-hover:shadow-md"
                        style={{
                          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                          color: "white",
                          boxShadow: "0 2px 8px rgba(220,38,38,0.4)",
                        }}
                      >
                        Öppna →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-white/25">
        <span>Kontakt: martin.akdogan@enkoping.se</span>
        <span className="mx-3">·</span>
        <span>Engelskajakten av Martin Akdogan</span>
      </footer>
    </div>
  );
}
// deploy trigger 2026-03-15
