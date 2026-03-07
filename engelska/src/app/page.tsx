"use client";
// deploy trigger
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { AVATARS } from "@/lib/avatars";
import type { StudentData } from "@/lib/types";

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
      { img: "/content/sprakdjungeln.png", name: "Språkdjungeln", label: "Åk 1–3" },
      { img: "/content/sprakstaden.png",   name: "Språkstaden",   label: "Åk 4–6" },
      { img: "/content/sprakarenan.png",   name: "Språkarenan",   label: "Åk 7–9" },
      { img: "/content/sprakakademin.png", name: "Språkakademin", label: "Gymnasiet" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center p-4 gap-6">

        {/* Left: sprakdjungeln + sprakstaden */}
        <div className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0">
          {stageCards.slice(0, 2).map((s) => (
            <div key={s.name} className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] relative">
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight">{s.name}</p>
                <p className="text-white/70 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center: login card */}
        <div className="w-full max-w-md animate-slide-up flex-shrink-0">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white text-shadow">
              Engelskajakten
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Login form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Välkommen!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Skriv ditt namn för att börja eller fortsätta.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
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
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Välj din karaktär</p>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      title={avatar.name}
                      className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all overflow-hidden ${
                        selectedAvatar === avatar.id
                          ? "bg-gray-200 dark:bg-gray-600 ring-2 ring-gray-500 scale-110"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {avatar.image ? (
                        <img src={avatar.image} alt={avatar.name} className="w-full h-full object-contain p-0.5" />
                      ) : (
                        avatar.emoji
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                </p>
              </div>

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full btn-primary bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-lg py-4"
              >
                Starta jakten!
              </button>
            </form>
          </div>
        </div>

        {/* Right: sprakarenan + sprakakademin */}
        <div className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0">
          {stageCards.slice(2, 4).map((s) => (
            <div key={s.name} className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] relative">
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight">{s.name}</p>
                <p className="text-white/70 text-xs">{s.label}</p>
              </div>
            </div>
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
