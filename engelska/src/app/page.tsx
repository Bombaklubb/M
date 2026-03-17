"use client";
// deploy trigger 2026-03-13
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { AVATARS } from "@/lib/avatars";
import type { StudentData, StageId } from "@/lib/types";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { MagicCard } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";

const stageImages: Record<string, string> = {
  lagstadiet:    "/content/sprakdjungeln.png",
  mellanstadiet: "/content/sprakstaden.png",
  hogstadiet:    "/content/sprakarenan.png",
  gymnasiet:     "/content/sprakakademin.png",
};

const stageGradients: Record<string, string> = {
  lagstadiet:    "from-emerald-950/90",
  mellanstadiet: "from-blue-950/90",
  hogstadiet:    "from-purple-950/90",
  gymnasiet:     "from-gray-950/90",
};

const stageBeams: Record<string, [string, string]> = {
  lagstadiet:    ["#4ade80", "#22c55e"],
  mellanstadiet: ["#60a5fa", "#3b82f6"],
  hogstadiet:    ["#c084fc", "#a855f7"],
  gymnasiet:     ["#9ca3af", "#6b7280"],
};

function getStagePoints(student: StudentData, stageId: string): number {
  const sp = student.stages[stageId as StageId];
  if (!sp) return 0;
  let pts = 0;
  for (const m of Object.values(sp.grammarModules   ?? {})) pts += m.points;
  for (const m of Object.values(sp.readingModules   ?? {})) pts += m.points;
  for (const m of Object.values(sp.spellingModules  ?? {})) pts += m.points;
  for (const m of Object.values(sp.wordsearchModules ?? {})) pts += m.points;
  for (const m of Object.values(sp.crosswordModules ?? {})) pts += m.points;
  return pts;
}

function getStageCompleted(student: StudentData, stageId: string): number {
  const sp = student.stages[stageId as StageId];
  if (!sp) return 0;
  let done = 0;
  for (const m of Object.values(sp.grammarModules   ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.readingModules   ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.spellingModules  ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.wordsearchModules ?? {})) if (m.completed) done++;
  for (const m of Object.values(sp.crosswordModules ?? {})) if (m.completed) done++;
  return done;
}

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">🌿</div>
      </div>
    );
  }

  // ─── Login screen ───────────────────────────────────────────────────────────
  if (!student) {
    const stageCards = [
      { img: "/content/sprakdjungeln.png", name: "Språkdjungeln", label: "Åk 1–3", gradient: "from-emerald-900/80" },
      { img: "/content/sprakstaden.png",   name: "Språkstaden",   label: "Åk 4–6", gradient: "from-blue-900/80" },
      { img: "/content/sprakarenan.png",   name: "Språkarenan",   label: "Åk 7–9", gradient: "from-purple-900/80" },
      { img: "/content/sprakakademin.png", name: "Språkakademin", label: "Gymnasiet", gradient: "from-gray-900/80" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-emerald-50 flex items-center justify-center p-3 gap-4 relative overflow-hidden">

        {/* Background decorative orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-300/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }} />
        </div>

        {/* Left: sprakdjungeln + sprakstaden */}
        <div className="hidden lg:flex flex-col gap-3 w-48 xl:w-56 flex-shrink-0">
          {stageCards.slice(0, 2).map((s, i) => (
            <MagicCard
              key={s.name}
              gradientColor="#6366f130"
              className="rounded-2xl overflow-hidden aspect-[4/3] relative border-2 border-white/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                boxShadow: "0 4px 0 0 rgba(99, 102, 241, 0.2), 0 8px 16px -4px rgba(99, 102, 241, 0.15)",
                animation: `float 3s ease-in-out infinite ${i * 0.5}s`
              } as React.CSSProperties}
            >
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${s.gradient} to-transparent`} />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight drop-shadow-lg">{s.name}</p>
                <p className="text-white/80 text-xs font-medium">{s.label}</p>
              </div>
            </MagicCard>
          ))}
        </div>

        {/* Center: login card */}
        <div className="w-full max-w-sm animate-slide-up flex-shrink-0">
          {/* Title */}
          <div className="text-center mb-3">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2 animate-float overflow-hidden"
              style={{
                boxShadow: "0 5px 0 0 rgba(59, 130, 246, 0.4), 0 8px 18px -4px rgba(59, 130, 246, 0.3)"
              }}
            >
              <img src="/content/engelskajakten-icon.png" alt="Engelskajakten" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-black tracking-tight drop-shadow-sm">
              <AnimatedGradientText>Engelskajakten</AnimatedGradientText>
            </h1>
            <p className="text-emerald-600 mt-1 text-sm font-bold">
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Login form - Clay card with BorderBeam */}
          <div
            className="relative bg-white rounded-3xl p-5 border-2 border-indigo-100 overflow-hidden"
            style={{
              boxShadow: "0 6px 0 0 rgba(99, 102, 241, 0.15), 0 12px 24px -8px rgba(99, 102, 241, 0.2), inset 0 3px 6px 0 rgba(255, 255, 255, 0.8)"
            }}
          >
            <BorderBeam
              size={300}
              duration={12}
              colorFrom="#6366f1"
              colorTo="#a855f7"
              borderWidth={2}
            />
            <div className="relative">
            <h2 className="text-lg font-bold text-indigo-900 mb-0.5">Välkommen!</h2>
            <p className="text-indigo-400 text-sm mb-3 font-medium">
              Skriv ditt namn för att börja eller fortsätta.
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ditt namn..."
                className="input-field text-base"
                autoFocus
                maxLength={30}
              />

              {/* Avatar selection */}
              <div>
                <p className="text-sm font-bold text-indigo-700 mb-2">Välj din karaktär</p>
                <div className="grid grid-cols-5 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      title={avatar.name}
                      className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden text-xl cursor-pointer border-2 ${
                        selectedAvatar === avatar.id
                          ? "border-emerald-400 scale-110 bg-emerald-50"
                          : "border-indigo-100 bg-indigo-50 hover:border-indigo-300 hover:scale-105"
                      }`}
                      style={{
                        boxShadow: selectedAvatar === avatar.id
                          ? "0 3px 0 0 rgba(16, 185, 129, 0.3), 0 4px 8px -2px rgba(16, 185, 129, 0.2), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
                          : "0 2px 0 0 rgba(99, 102, 241, 0.15), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
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
                <p className="text-xs font-bold text-emerald-600 mt-1.5 text-center">
                  {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                </p>
              </div>

              <ShimmerButton
                type="submit"
                disabled={!nameInput.trim()}
                background={nameInput.trim()
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #d1d5db, #9ca3af)"
                }
                className="w-full text-base py-3 rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  boxShadow: nameInput.trim()
                    ? "0 3px 0 0 rgba(5, 150, 105, 0.4), 0 5px 12px -2px rgba(5, 150, 105, 0.3)"
                    : "0 2px 0 0 rgba(0,0,0,0.1)"
                } as React.CSSProperties}
              >
                Starta jakten! 🚀
              </ShimmerButton>
            </form>
            </div>
          </div>
        </div>

        {/* Right: sprakarenan + sprakakademin */}
        <div className="hidden lg:flex flex-col gap-3 w-48 xl:w-56 flex-shrink-0">
          {stageCards.slice(2, 4).map((s, i) => (
            <MagicCard
              key={s.name}
              gradientColor="#8b5cf630"
              className="rounded-2xl overflow-hidden aspect-[4/3] relative border-2 border-white/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                boxShadow: "0 4px 0 0 rgba(99, 102, 241, 0.2), 0 8px 16px -4px rgba(99, 102, 241, 0.15)",
                animation: `float 3s ease-in-out infinite ${(i + 2) * 0.5}s`
              } as React.CSSProperties}
            >
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${s.gradient} to-transparent`} />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight drop-shadow-lg">{s.name}</p>
                <p className="text-white/80 text-xs font-medium">{s.label}</p>
              </div>
            </MagicCard>
          ))}
        </div>

      </div>
    );
  }

  // ─── Logged-in: stage selection dashboard ──────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-3">

        {/* Welcome banner */}
        <div className="mb-2 animate-fade-in">
          <h2 className="text-xl font-black text-indigo-900 dark:text-gray-100">
            Hej, {student.name}! 👋
          </h2>
          <p className="text-indigo-400 dark:text-gray-400 font-medium text-xs mt-0.5">
            Välj en värld och fortsätt din engelska resa.
          </p>
        </div>

        {/* Stage cards grid */}
        <div className="grid grid-cols-2 gap-2">
          {STAGES.map((stage, i) => {
            const pts  = getStagePoints(student, stage.id);
            const done = getStageCompleted(student, stage.id);
            const beamColors = stageBeams[stage.id];
            const hasProgress = pts > 0 || done > 0;

            return (
              <Link key={stage.id} href={`/world/${stage.id}`} className="block group">
                <MagicCard
                  gradientColor={`${beamColors[0]}20`}
                  className="relative rounded-2xl overflow-hidden border-2 border-white/20 dark:border-gray-700/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl cursor-pointer"
                  style={{
                    aspectRatio: "3/1",
                    boxShadow: hasProgress
                      ? `0 5px 0 0 ${beamColors[0]}35, 0 8px 20px -4px ${beamColors[0]}20`
                      : "0 4px 0 0 rgba(99,102,241,0.12), 0 8px 16px -4px rgba(99,102,241,0.08)",
                    animation: `float 4s ease-in-out infinite ${i * 0.4}s`
                  } as React.CSSProperties}
                >
                  {/* Background image */}
                  <img
                    src={stageImages[stage.id]}
                    alt={stage.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${stageGradients[stage.id]} via-black/30 to-transparent`} />

                  {/* BorderBeam on stages with progress */}
                  {hasProgress && (
                    <BorderBeam
                      size={180}
                      duration={8}
                      colorFrom={beamColors[0]}
                      colorTo={beamColors[1]}
                      borderWidth={2}
                    />
                  )}

                  {/* Top-right badge */}
                  {done > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
                        ✓ {done}
                      </span>
                    </div>
                  )}

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-black text-sm leading-tight drop-shadow-lg">
                      {stage.name}
                    </h3>
                    <p className="text-white/65 text-xs font-medium">{stage.grades}</p>

                    {pts > 0 ? (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-amber-400 text-xs">⭐</span>
                        <NumberTicker
                          value={pts}
                          className="text-white font-bold text-xs"
                          duration={800}
                        />
                        <span className="text-white/55 text-xs">p</span>
                      </div>
                    ) : (
                      <p className="mt-1 text-white/50 text-xs font-medium group-hover:text-white/80 transition-colors">
                        Börja här →
                      </p>
                    )}
                  </div>
                </MagicCard>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
// deploy trigger 2026-03-15
