"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import { loadStudent, createStudent, clearStudent, importProgress } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import type { StudentData, StageId } from "@/lib/types";

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

  function stagePoints(stageId: StageId): number {
    if (!student) return 0;
    const stage = student.stages[stageId];
    return [
      ...Object.values(stage.grammarModules),
      ...Object.values(stage.readingModules),
    ].reduce((sum, m) => sum + m.points, 0);
  }

  function stageCompleted(stageId: StageId): number {
    if (!student) return 0;
    const stage = student.stages[stageId];
    return [
      ...Object.values(stage.grammarModules),
      ...Object.values(stage.readingModules),
    ].filter((m) => m.completed).length;
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

  // ─── World map ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header student={student} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black">
                Hej, {student.name}! 👋
              </h1>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">🗺️ Välj din värld</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STAGES.map((stage) => {
            const pts = stagePoints(stage.id);
            const done = stageCompleted(stage.id);
            return (
              <Link key={stage.id} href={`/world/${stage.id}`} className="group block">
                <div
                  className={`${stage.bgClass} rounded-3xl p-6 text-white relative overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}
                >
                  {/* Background decoration */}
                  <div className="absolute -right-6 -top-6 text-[120px] opacity-10 select-none">
                    {stage.emoji}
                  </div>

                  <div className="relative">
                    <div className="text-4xl mb-2">{stage.emoji}</div>
                    <h3 className="text-xl font-black text-shadow">{stage.name}</h3>
                    <p className="text-sm text-white/70 font-medium">{stage.subtitle} · {stage.grades}</p>
                    <p className="text-sm text-white/80 mt-2">{stage.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="bg-white/20 px-2 py-1 rounded-lg">
                          ⭐ {pts} p
                        </span>
                        {done > 0 && (
                          <span className="bg-white/20 px-2 py-1 rounded-lg">
                            ✓ {done} klara
                          </span>
                        )}
                      </div>
                      <span className="bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-xl group-hover:bg-opacity-90 transition-all">
                        Utforska →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick tip */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Tips!</p>
            <p className="text-amber-700 text-sm">
              Du kan alltid byta världar – ingen av dem är låst. Samla poäng
              för att låsa upp extra moduler inuti varje värld.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
