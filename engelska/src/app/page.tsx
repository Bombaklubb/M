"use client";
// deploy trigger 2026-03-13
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { AVATARS } from "@/lib/avatars";
import type { StudentData } from "@/lib/types";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { MagicCard } from "@/components/magicui/magic-card";

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-emerald-50 flex items-center justify-center p-4 gap-6 relative overflow-hidden">

        {/* Background decorative orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-300/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }} />
        </div>

        {/* Left: sprakdjungeln + sprakstaden */}
        <div className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0">
          {stageCards.slice(0, 2).map((s, i) => (
            <MagicCard
              key={s.name}
              gradientColor="#6366f130"
              className="rounded-3xl overflow-hidden aspect-[4/3] relative border-3 border-white/60 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                boxShadow: "0 6px 0 0 rgba(99, 102, 241, 0.2), 0 10px 20px -4px rgba(99, 102, 241, 0.15)",
                animation: `float 3s ease-in-out infinite ${i * 0.5}s`
              } as React.CSSProperties}
            >
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${s.gradient} to-transparent`} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-base leading-tight drop-shadow-lg">{s.name}</p>
                <p className="text-white/80 text-sm font-medium">{s.label}</p>
              </div>
            </MagicCard>
          ))}
        </div>

        {/* Center: login card */}
        <div className="w-full max-w-md animate-slide-up flex-shrink-0">
          {/* Title */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4 text-5xl animate-float border-4 border-emerald-300"
              style={{
                boxShadow: "0 8px 0 0 rgba(16, 185, 129, 0.4), 0 12px 24px -4px rgba(16, 185, 129, 0.3), inset 0 4px 8px 0 rgba(255, 255, 255, 0.4)"
              }}
            >
              🌿
            </div>
            <h1 className="text-5xl font-black tracking-tight drop-shadow-sm">
              <AnimatedGradientText>Engelskajakten</AnimatedGradientText>
            </h1>
            <p className="text-emerald-600 mt-2 text-lg font-bold">
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Login form - Clay card with BorderBeam */}
          <div
            className="relative bg-white rounded-4xl p-8 border-3 border-indigo-100 overflow-hidden"
            style={{
              boxShadow: "0 8px 0 0 rgba(99, 102, 241, 0.15), 0 16px 32px -8px rgba(99, 102, 241, 0.2), inset 0 4px 8px 0 rgba(255, 255, 255, 0.8)"
            }}
          >
            <BorderBeam
              size={300}
              duration={12}
              colorFrom="#6366f1"
              colorTo="#a855f7"
              borderWidth={2}
            />
            <h2 className="text-2xl font-bold text-indigo-900 mb-1">Välkommen!</h2>
            <p className="text-indigo-400 text-base mb-6 font-medium">
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
                <p className="text-base font-bold text-indigo-700 mb-3">Välj din karaktär</p>
                <div className="grid grid-cols-5 gap-3">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      title={avatar.name}
                      className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 overflow-hidden text-2xl cursor-pointer border-3 ${
                        selectedAvatar === avatar.id
                          ? "border-emerald-400 scale-110 bg-emerald-50"
                          : "border-indigo-100 bg-indigo-50 hover:border-indigo-300 hover:scale-105"
                      }`}
                      style={{
                        boxShadow: selectedAvatar === avatar.id
                          ? "0 4px 0 0 rgba(16, 185, 129, 0.3), 0 6px 12px -2px rgba(16, 185, 129, 0.2), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
                          : "0 3px 0 0 rgba(99, 102, 241, 0.15), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
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
                <p className="text-sm font-bold text-emerald-600 mt-3 text-center">
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
                className="w-full text-xl py-4 rounded-2xl disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  boxShadow: nameInput.trim()
                    ? "0 4px 0 0 rgba(5, 150, 105, 0.4), 0 6px 16px -2px rgba(5, 150, 105, 0.3)"
                    : "0 3px 0 0 rgba(0,0,0,0.1)"
                } as React.CSSProperties}
              >
                Starta jakten! 🚀
              </ShimmerButton>
            </form>
          </div>
        </div>

        {/* Right: sprakarenan + sprakakademin */}
        <div className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0">
          {stageCards.slice(2, 4).map((s, i) => (
            <MagicCard
              key={s.name}
              gradientColor="#8b5cf630"
              className="rounded-3xl overflow-hidden aspect-[4/3] relative border-3 border-white/60 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                boxShadow: "0 6px 0 0 rgba(99, 102, 241, 0.2), 0 10px 20px -4px rgba(99, 102, 241, 0.15)",
                animation: `float 3s ease-in-out infinite ${(i + 2) * 0.5}s`
              } as React.CSSProperties}
            >
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${s.gradient} to-transparent`} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-base leading-tight drop-shadow-lg">{s.name}</p>
                <p className="text-white/80 text-sm font-medium">{s.label}</p>
              </div>
            </MagicCard>
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Klickbar startsidebild */}
        <div className="relative select-none">
          <img
            src="/content/basta-engelskajakten.png"
            alt="Engelskajakten"
            className="w-full h-auto block rounded-2xl shadow-lg"
            draggable={false}
          />

          {/* Klickbara zoner över de 4 korten */}
          <Link href="/world/lagstadiet" aria-label="Språkdjungeln"
            className="absolute hover:bg-white/10 transition-colors rounded-xl"
            style={{ top: "10%", left: "2%", width: "47%", height: "42%" }}
          />
          <Link href="/world/mellanstadiet" aria-label="Språkstaden"
            className="absolute hover:bg-white/10 transition-colors rounded-xl"
            style={{ top: "10%", left: "51%", width: "47%", height: "42%" }}
          />
          <Link href="/world/hogstadiet" aria-label="Språkarenan"
            className="absolute hover:bg-white/10 transition-colors rounded-xl"
            style={{ top: "55%", left: "2%", width: "47%", height: "42%" }}
          />
          <Link href="/world/gymnasiet" aria-label="Språkakademin"
            className="absolute hover:bg-white/10 transition-colors rounded-xl"
            style={{ top: "55%", left: "51%", width: "47%", height: "42%" }}
          />
        </div>
      </main>
    </div>
  );
}
// deploy trigger 2026-03-15
