"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import { loadStudent, clearStudent, exportProgress, generateShareCode } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import type { StudentData, StageId } from "@/lib/types";

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [showShareCode, setShowShareCode] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setStudent(loadStudent());
  }, []);

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Du är inte inloggad.</p>
          <Link href="/" className="btn-primary bg-blue-500 hover:bg-blue-600">
            Gå till startsidan
          </Link>
        </div>
      </div>
    );
  }

  function getStageStats(stageId: StageId) {
    const s = student!.stages[stageId];
    const grammarMods = Object.values(s.grammarModules);
    const readingMods = Object.values(s.readingModules);
    const all = [...grammarMods, ...readingMods];
    const completed = all.filter((m) => m.completed).length;
    const totalPoints = all.reduce((sum, m) => sum + m.points, 0);
    return { completed, totalPoints, grammarMods, readingMods };
  }

  function handleExport() {
    exportProgress(student);
  }

  function handleShare() {
    const code = generateShareCode(student);
    setShareCode(code);
    setShowShareCode(true);
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    clearStudent();
    window.location.href = "/";
  }

  const joinDate = new Date(student.createdAt).toLocaleDateString("sv-SE");
  const lastActive = new Date(student.lastActive).toLocaleDateString("sv-SE");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header student={student} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile hero */}
        <div className="card bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black">{student.name}</h1>
              <p className="text-blue-200 text-sm">Aktiv sedan {joinDate}</p>
              <p className="text-blue-200 text-sm">Senast aktiv: {lastActive}</p>
            </div>
            <div className="ml-auto text-center">
              <div className="text-4xl font-black">⭐ {student.totalPoints}</div>
              <div className="text-blue-200 text-sm">totala poäng</div>
            </div>
          </div>
        </div>

        {/* Stage overview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">📊 Progression per stadie</h2>
          <div className="space-y-3">
            {STAGES.map((stage) => {
              const { completed, totalPoints, grammarMods, readingMods } =
                getStageStats(stage.id);
              const total = grammarMods.length + readingMods.length;
              const pct = total > 0 ? (completed / total) * 100 : 0;

              return (
                <Link key={stage.id} href={`/world/${stage.id}`} className="block group">
                  <div className="card hover:shadow-md transition-shadow group-hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{stage.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                        <p className="text-sm text-gray-500">{stage.grades}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600">⭐ {totalPoints}</div>
                        <div className="text-xs text-gray-400">
                          {completed}/{total === 0 ? "?" : total} moduler
                        </div>
                      </div>
                    </div>
                    <ProgressBar
                      value={pct}
                      colorClass={
                        stage.id === "lagstadiet"
                          ? "bg-jungle-500"
                          : stage.id === "mellanstadiet"
                          ? "bg-city-500"
                          : stage.id === "hogstadiet"
                          ? "bg-global-500"
                          : "bg-summit-600"
                      }
                      showPercent
                    />

                    {/* Detailed breakdown */}
                    {(grammarMods.length > 0 || readingMods.length > 0) && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2 text-xs text-center">
                          <div className="font-semibold">
                            {grammarMods.filter((m) => m.completed).length}/
                            {grammarMods.length}
                          </div>
                          <div className="text-gray-500">📝 Grammatik</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-xs text-center">
                          <div className="font-semibold">
                            {readingMods.filter((m) => m.completed).length}/
                            {readingMods.length}
                          </div>
                          <div className="text-gray-500">📖 Läsning</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚙️ Hantera data</h2>
          <div className="space-y-3">
            {/* Export */}
            <button
              onClick={handleExport}
              className="w-full btn-secondary border-gray-300 text-gray-700 hover:bg-gray-50 justify-start gap-3"
            >
              <span className="text-xl">💾</span>
              <div className="text-left">
                <div className="font-semibold">Exportera framsteg</div>
                <div className="text-xs text-gray-400">
                  Spara en .json-fil med dina framsteg
                </div>
              </div>
            </button>

            {/* Share code */}
            <button
              onClick={handleShare}
              className="w-full btn-secondary border-gray-300 text-gray-700 hover:bg-gray-50 justify-start gap-3"
            >
              <span className="text-xl">🔗</span>
              <div className="text-left">
                <div className="font-semibold">Dela framstegskod</div>
                <div className="text-xs text-gray-400">
                  Generera en kod att visa för lärare/förälder
                </div>
              </div>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className={`w-full btn-secondary justify-start gap-3 transition-colors ${
                confirmReset
                  ? "border-red-400 text-red-600 hover:bg-red-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">🗑️</span>
              <div className="text-left">
                <div className="font-semibold">
                  {confirmReset ? "Bekräfta: ta bort all data?" : "Återställ framsteg"}
                </div>
                <div className="text-xs text-gray-400">
                  {confirmReset
                    ? "Klicka igen för att bekräfta – detta går inte att ångra!"
                    : "Börja om från noll"}
                </div>
              </div>
            </button>
            {confirmReset && (
              <button
                onClick={() => setConfirmReset(false)}
                className="text-sm text-gray-400 hover:text-gray-600 w-full text-center"
              >
                Avbryt
              </button>
            )}
          </div>
        </div>

        {/* Share code modal */}
        {showShareCode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-slide-up">
              <h3 className="text-xl font-bold mb-2">🔗 Framstegskod</h3>
              <p className="text-gray-500 text-sm mb-4">
                Kopiera denna kod och visa den för din lärare eller förälder.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-xs break-all max-h-32 overflow-y-auto text-gray-600 mb-4">
                {shareCode}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyCode}
                  className="flex-1 btn-primary bg-blue-500 hover:bg-blue-600"
                >
                  {codeCopied ? "✓ Kopierad!" : "📋 Kopiera"}
                </button>
                <button
                  onClick={() => setShowShareCode(false)}
                  className="flex-1 btn-secondary border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
