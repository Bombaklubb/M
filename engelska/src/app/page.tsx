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

        {/* Clickable world map */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <img
            src="/content/nya-engelskajakten.png"
            alt="Engelskajakten karta"
            className="w-full h-auto block"
            draggable={false}
          />

          {/* Språkdjungeln – täcker bild-texten och visar korrekt å */}
          <a
            href="#lagstadiet"
            className="absolute group"
            style={{ left: "5%", top: "41%" }}
          >
            <div className="bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl px-3 py-2 shadow-lg cursor-pointer">
              <div className="text-white font-bold text-sm leading-tight">Språkdjungeln</div>
              <div className="text-orange-100 text-xs">Åk 1–3</div>
            </div>
          </a>

          {/* Språkstaden */}
          <a
            href="#mellanstadiet"
            className="absolute group"
            style={{ left: "37%", top: "65%" }}
          >
            <div className="bg-blue-700 hover:bg-blue-800 transition-colors rounded-xl px-3 py-2 shadow-lg cursor-pointer">
              <div className="text-white font-bold text-sm leading-tight">Språkstaden</div>
              <div className="text-blue-100 text-xs">Åk 4–6</div>
            </div>
          </a>

          {/* Språkarenan – täcker otydlig k och fel å */}
          <a
            href="#hogstadiet"
            className="absolute group"
            style={{ left: "64%", top: "36%" }}
          >
            <div className="bg-teal-600 hover:bg-teal-700 transition-colors rounded-xl px-3 py-2 shadow-lg cursor-pointer">
              <div className="text-white font-bold text-sm leading-tight">Språkarenan</div>
              <div className="text-teal-100 text-xs">Åk 7–9</div>
            </div>
          </a>

          {/* Språkakademin */}
          <a
            href="#gymnasiet"
            className="absolute group"
            style={{ left: "60%", top: "65%" }}
          >
            <div className="bg-slate-700 hover:bg-slate-800 transition-colors rounded-xl px-3 py-2 shadow-lg cursor-pointer">
              <div className="text-white font-bold text-sm leading-tight">Språkakademin</div>
              <div className="text-slate-300 text-xs">Gymnasiet</div>
            </div>
          </a>
        </div>

        {/* Stage sections – scrollas till vid klick på kartan */}
        {STAGES.map((stage) => (
          <div key={stage.id} id={stage.id} className="scroll-mt-6 mt-6">
            <Link href={`/world/${stage.id}`} className="block group">
              <div className={`${stage.bgClass} rounded-3xl p-6 text-white shadow-lg hover:opacity-95 transition-opacity`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{stage.emoji}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black">{stage.name}</h2>
                    <p className="text-white/70 text-sm">{stage.grades}</p>
                  </div>
                  <span className="text-2xl text-white/60 group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <p className="mt-3 text-white/80 text-sm">{stage.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
