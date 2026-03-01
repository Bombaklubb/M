"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { loadStudent, createStudent, clearStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import type { StudentData } from "@/lib/types";

export default function HomePage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStudent(loadStudent());
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const data = createStudent(nameInput.trim());
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
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
        {/* Background image */}
        <img
          src="/content/sprakdjungeln.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Djungelöverlay – täcker bildens text och ger djupkänsla */}
        <div className="absolute inset-0 bg-jungle-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Login card */}
        <div className="relative z-10 w-full max-w-md animate-slide-up">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white text-shadow">
              Engelskajakten
            </h1>
            <p className="text-jungle-200 mt-2 text-lg">
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
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full btn-primary bg-jungle-600 hover:bg-jungle-700 disabled:bg-gray-200 disabled:text-gray-400 text-lg py-4"
              >
                Starta jakten! 🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── Stage image map ────────────────────────────────────────────────────────
  const stageImages: Record<string, string> = {
    lagstadiet: "/content/sprakdjungeln.png",
    mellanstadiet: "/content/sprakstaden.png",
    hogstadiet: "/content/sprakarenan.png",
    gymnasiet: "/content/sprakakademin.png",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome banner */}
        <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Hej, {student.name}! 👋</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Välj en värld och fortsätt din engelska resa.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-700 rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-amber-700 dark:text-amber-400">⭐ {student.totalPoints}</div>
              <div className="text-xs text-amber-600 dark:text-amber-500">totala poäng</div>
            </div>
            <Link
              href="/profile"
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl px-4 py-3 text-center transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              👤 Min sida
            </Link>
          </div>
        </div>

        {/* Stage grid */}
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-4">Engelskajakten</h2>
        <div className="grid grid-cols-2 gap-4">
          {STAGES.map((stage) => (
            <Link key={stage.id} href={`/world/${stage.id}`} className="group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
                <img
                  src={stageImages[stage.id]}
                  alt={stage.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xl">{stage.emoji}</span>
                    <h3 className="text-white font-black text-lg leading-tight">
                      {stage.name}
                    </h3>
                  </div>
                  <p className="text-white/70 text-sm">{stage.grades}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
