"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { useDarkMode } from "@/lib/useDarkMode";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { AVATARS } from "@/lib/avatars";
import type { StudentData, StageId } from "@/lib/types";
import { NumberTicker } from "@/components/magicui/number-ticker";

const stageAccents: Record<string, { badge: string }> = {
  lagstadiet:    { badge: "#4ade80" },
  mellanstadiet: { badge: "#93c5fd" },
  hogstadiet:    { badge: "#fca5a5" },
  gymnasiet:     { badge: "#d1d5db" },
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

const FLOAT_ITEMS = [
  { text: "A", x: "6%",  y: "10%", size: "2rem",   delay: "0s",   dur: "6s"  },
  { text: "B", x: "87%", y: "7%",  size: "1.8rem",  delay: "0.8s", dur: "7s"  },
  { text: "C", x: "4%",  y: "68%", size: "2.5rem",  delay: "1.5s", dur: "5s"  },
  { text: "D", x: "91%", y: "63%", size: "1.6rem",  delay: "2s",   dur: "8s"  },
  { text: "E", x: "14%", y: "86%", size: "1.8rem",  delay: "0.4s", dur: "6.5s"},
  { text: "?", x: "74%", y: "28%", size: "2rem",    delay: "0.6s", dur: "5.5s"},
  { text: "!", x: "19%", y: "38%", size: "1.6rem",  delay: "1.8s", dur: "6s"  },
  { text: "Z", x: "49%", y: "4%",  size: "1.4rem",  delay: "2.5s", dur: "7.5s"},
];

const BG_LIGHT = "linear-gradient(160deg, #0a1744 0%, #0e2882 30%, #1242a0 55%, #0d246b 80%, #0a1744 100%)";
const BG_DARK  = "linear-gradient(160deg, #020810 0%, #040d22 30%, #081535 55%, #040b1c 80%, #020810 100%)";

export default function HomePage() {
  const [student,        setStudent]        = useState<StudentData | null>(null);
  const [nameInput,      setNameInput]      = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("ninja");
  const [loading,        setLoading]        = useState(true);
  const { dark, toggle } = useDarkMode();

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

  const bg = dark ? BG_DARK : BG_LIGHT;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  if (!student) {
    const cardBg    = dark ? "rgba(5,15,45,0.95)"    : "rgba(255,255,255,0.97)";
    const labelClr  = dark ? "rgba(180,200,255,0.7)" : "rgba(10,36,99,0.6)";
    const inputBg   = dark ? "rgba(10,25,70,0.8)"    : "rgba(235,240,255,0.7)";
    const inputBdr  = dark ? "rgba(60,90,200,0.4)"   : "rgba(10,36,99,0.15)";
    const inputTxt  = dark ? "#c7d8ff"               : "#0a2463";
    const inputPh   = dark ? "rgba(150,170,230,0.4)" : "rgba(10,36,99,0.25)";
    const avSelBg   = dark ? "rgba(60,100,220,0.2)"  : "rgba(29,78,216,0.1)";
    const avSelBdr  = dark ? "rgba(100,140,255,0.7)" : "rgba(29,78,216,0.7)";
    const avBg      = dark ? "rgba(255,255,255,0.04)": "rgba(10,36,99,0.03)";
    const avBdr     = dark ? "rgba(60,90,200,0.2)"   : "rgba(10,36,99,0.08)";
    const selName   = dark ? "#93c5fd"               : "#2563eb";

    return (
      <div
        className="min-h-screen flex items-center justify-center p-3 relative overflow-hidden"
        style={{ background: bg }}
      >
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="absolute top-3 right-3 z-20 p-2 rounded-xl transition-all cursor-pointer"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
          aria-label={dark ? "Ljust läge" : "Mörkt läge"}
        >
          <span className="text-base leading-none">{dark ? "☀️" : "🌙"}</span>
        </button>

        {/* Floating letters */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          {FLOAT_ITEMS.map((item) => (
            <span
              key={item.text + item.x}
              className="absolute font-black text-white/[0.06] animate-float"
              style={{ left: item.x, top: item.y, fontSize: item.size, animationDuration: item.dur, animationDelay: item.delay }}
            >
              {item.text}
            </span>
          ))}
        </div>

        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #dc2626, transparent)" }} />
        </div>

        {/* Login card */}
        <div className="relative w-full max-w-sm animate-slide-up z-10">

          {/* Logo + title (above card, compact) */}
          <div className="flex items-center gap-3 justify-center mb-3">
            <div
              className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
              style={{ boxShadow: "0 0 24px rgba(59,130,246,0.5), 0 0 48px rgba(220,38,38,0.2)" }}
            >
              <img src="/content/engelskajakten-icon.png" alt="Engelskajakten" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-tight">Engelskajakten</h1>
              <p className="text-blue-200/80 text-xs font-medium">Lär dig engelska på ett roligt sätt!</p>
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: cardBg,
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            <form onSubmit={handleLogin} className="space-y-3">

              {/* Name */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: labelClr }}>
                  Vad heter du?
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ditt namn..."
                  autoFocus
                  maxLength={30}
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all border"
                  style={{
                    background: inputBg,
                    borderColor: inputBdr,
                    color: inputTxt,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(29,78,216,0.7)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.12)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = inputBdr; e.currentTarget.style.boxShadow = "none"; }}
                />
                {/* workaround to keep inputPh & inputBdr in scope */}
                <style>{`input::placeholder { color: ${inputPh}; }`}</style>
              </div>

              {/* Avatars */}
              <div>
                <p className="text-xs font-bold mb-1.5" style={{ color: labelClr }}>
                  Välj din karaktär
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      title={avatar.name}
                      className="aspect-square rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden cursor-pointer"
                      style={{
                        background:  selectedAvatar === avatar.id ? avSelBg : avBg,
                        border:      `2px solid ${selectedAvatar === avatar.id ? avSelBdr : avBdr}`,
                        transform:   selectedAvatar === avatar.id ? "scale(1.08)" : "scale(1)",
                        boxShadow:   selectedAvatar === avatar.id ? "0 0 10px rgba(29,78,216,0.3)" : "none",
                      }}
                    >
                      {avatar.image
                        ? <img src={avatar.image} alt={avatar.name} className="w-full h-full object-contain p-0.5" />
                        : <span className="text-base">{avatar.emoji}</span>
                      }
                    </button>
                  ))}
                </div>
                {selectedAvatar && (
                  <p className="text-[10px] font-medium mt-1 text-center" style={{ color: selName }}>
                    {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full py-3 rounded-xl font-black text-white text-sm transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: nameInput.trim() ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "rgba(10,36,99,0.15)",
                  boxShadow:  nameInput.trim() ? "0 4px 16px rgba(220,38,38,0.45), inset 0 1px 0 rgba(255,255,255,0.2)" : "none",
                }}
              >
                Starta jakten!
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── Logged in: stage selection ──────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div
            className="w-16 h-16 rounded-2xl overflow-hidden mb-3"
            style={{ boxShadow: "0 0 32px rgba(59,130,246,0.5), 0 0 64px rgba(220,38,38,0.2)" }}
          >
            <img src="/content/engelskajakten-icon.png" alt="Engelskajakten" className="w-full h-full object-cover" />
          </div>
          <p className="text-white/50 text-xs font-bold tracking-widest uppercase">Välj din värld</p>
        </div>

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
                    background: dark ? "rgba(10,20,55,0.95)" : "rgba(255,255,255,0.97)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={stageImages[stage.id]}
                      alt={stage.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45))" }} />
                    <span
                      className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(0,0,0,0.45)", border: `1px solid ${accent.badge}60`, color: accent.badge }}
                    >
                      {stage.grades}
                    </span>
                    {done > 0 && (
                      <span className="absolute top-3 right-3 text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30">
                        ✓ {done}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className={`font-black text-base leading-tight ${dark ? "text-blue-100" : "text-blue-900"}`}>
                      {stage.name}
                    </h3>
                    <p className={`text-xs mt-0.5 ${dark ? "text-blue-300/60" : "text-blue-900/50"}`}>{stage.subtitle}</p>

                    <div className="flex items-center justify-between mt-3">
                      {pts > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500 text-sm">⭐</span>
                          <NumberTicker value={pts} className="text-amber-500 font-bold text-sm" duration={800} />
                          <span className={`text-xs ${dark ? "text-blue-300/40" : "text-blue-900/40"}`}>p</span>
                        </div>
                      ) : (
                        <span className={`text-xs font-medium ${dark ? "text-blue-300/40" : "text-blue-900/40"}`}>Inte börjat än</span>
                      )}
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 group-hover:shadow-md"
                        style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", color: "white", boxShadow: "0 2px 8px rgba(220,38,38,0.4)" }}
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
    </div>
  );
}
