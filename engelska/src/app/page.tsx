"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import { loadStudent, createStudent, clearStudent, importProgress } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import type { StudentData } from "@/lib/types";

export default function HomePage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [importError, setImportError] = useState("");

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

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    try {
      const data = await importProgress(file);
      setStudent(data);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Importfel");
    }
    e.target.value = "";
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">🎯</div>
      </div>
    );
  }

  // ─── Login screen ───────────────────────────────────────────────────────────
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🎯</div>
            <h1 className="text-4xl font-black text-white text-shadow">
              Engelskajakten
            </h1>
            <p className="text-blue-200 mt-2 text-lg">
              Lär dig engelska på ett roligt sätt!
            </p>
          </div>

          {/* Login form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Välkommen!</h2>
            <p className="text-gray-500 text-sm mb-6">
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
                className="w-full btn-primary bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-lg py-4"
              >
                Starta jakten! 🚀
              </button>
            </form>

            {/* Import */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">
                Har du sparat framsteg tidigare?
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 font-medium">
                📂 Importera framsteg
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="sr-only"
                />
              </label>
              {importError && (
                <p className="text-red-500 text-xs mt-1">{importError}</p>
              )}
            </div>
          </div>

          {/* Stages preview */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {STAGES.map((s) => (
              <div
                key={s.id}
                className="glass rounded-2xl p-4 text-white text-center"
              >
                <div className="text-3xl mb-1">{s.emoji}</div>
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-white/70">{s.grades}</div>
              </div>
            ))}
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
    <div className="min-h-screen bg-gray-50">
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black">Hej, {student.name}! 👋</h1>
              <p className="text-blue-100 mt-1">
                Välj en värld och fortsätt din engelska resa.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-2xl px-5 py-3 text-center">
                <div className="text-3xl font-black">⭐ {student.totalPoints}</div>
                <div className="text-xs text-white/70">totala poäng</div>
              </div>
              <Link
                href="/profile"
                className="bg-white/20 hover:bg-white/30 rounded-2xl px-4 py-3 text-center transition-colors text-sm font-medium"
              >
                👤 Min sida
              </Link>
            </div>
          </div>
        </div>

        {/* Stage grid */}
        <h2 className="text-2xl font-black text-gray-800 mb-4">Engelskajakten</h2>
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
