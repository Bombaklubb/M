"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import { loadStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { ACHIEVEMENTS, isUnlocked } from "@/lib/achievements";
import { getAvatar } from "@/lib/avatars";
import type { StudentData, StageId } from "@/lib/types";

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    setStudent(loadStudent());
  }, []);

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Du är inte inloggad.</p>
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
    const spellingMods = Object.values(s.spellingModules ?? {});
    const all = [...grammarMods, ...readingMods, ...spellingMods];
    const completed = all.filter((m) => m.completed).length;
    const totalPoints = all.reduce((sum, m) => sum + m.points, 0);
    return { completed, totalPoints, grammarMods, readingMods, spellingMods };
  }

  const joinDate = new Date(student.createdAt).toLocaleDateString("sv-SE");
  const lastActive = new Date(student.lastActive).toLocaleDateString("sv-SE");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile hero */}
        <div className="card bg-gradient-to-br from-gray-800 to-gray-900 text-white border-none dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-5xl">
              {getAvatar(student.avatar ?? "ninja").emoji}
            </div>
            <div>
              <h1 className="text-2xl font-black">{student.name}</h1>
              <p className="text-gray-300 text-sm">Aktiv sedan {joinDate}</p>
              <p className="text-gray-300 text-sm">Senast aktiv: {lastActive}</p>
            </div>
            <div className="ml-auto text-center">
              <div className="text-4xl font-black">⭐ {student.totalPoints}</div>
              <div className="text-gray-300 text-sm">totala poäng</div>
            </div>
          </div>
        </div>

        {/* Stage overview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">📊 Progression per stadie</h2>
          <div className="space-y-3">
            {STAGES.map((stage) => {
              const { completed, totalPoints, grammarMods, readingMods, spellingMods } =
                getStageStats(stage.id);
              const total = grammarMods.length + readingMods.length + spellingMods.length;
              const pct = total > 0 ? (completed / total) * 100 : 0;

              return (
                <Link key={stage.id} href={`/world/${stage.id}`} className="block group">
                  <div className="card hover:shadow-md transition-shadow group-hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{stage.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{stage.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stage.grades}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600 dark:text-amber-400">⭐ {totalPoints}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
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
                    {(grammarMods.length > 0 || readingMods.length > 0 || spellingMods.length > 0) && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-xs text-center">
                          <div className="font-semibold dark:text-gray-100">
                            {grammarMods.filter((m) => m.completed).length}/
                            {grammarMods.length}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">📝 Grammatik</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-xs text-center">
                          <div className="font-semibold dark:text-gray-100">
                            {readingMods.filter((m) => m.completed).length}/
                            {readingMods.length}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">📖 Läsning</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-xs text-center">
                          <div className="font-semibold dark:text-gray-100">
                            {spellingMods.filter((m) => m.completed).length}/
                            {spellingMods.length}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">✏️ Stavning</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">🏅 Utmärkelser</h2>
          <div className="space-y-4">
            {STAGES.map((stage) => {
              const stageAchievements = ACHIEVEMENTS.filter((a) => a.stageId === stage.id);
              const unlockedCount = stageAchievements.filter((a) => isUnlocked(a, student!)).length;
              return (
                <div key={stage.id} className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{stage.emoji}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{stage.name}</h3>
                    <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                      {unlockedCount}/{stageAchievements.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {stageAchievements.map((a) => {
                      const unlocked = isUnlocked(a, student!);
                      return (
                        <div
                          key={a.id}
                          className={`flex items-center gap-2 rounded-xl p-2 transition-colors ${
                            unlocked
                              ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800"
                              : "bg-gray-50 dark:bg-gray-700/50 opacity-50"
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{unlocked ? a.icon : "🔒"}</span>
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold leading-tight ${unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                              {a.title}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight truncate">{a.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Global achievements */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌍</span>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Globala utmärkelser</h3>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                  {ACHIEVEMENTS.filter((a) => a.stageId === "global" && isUnlocked(a, student!)).length}/
                  {ACHIEVEMENTS.filter((a) => a.stageId === "global").length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACHIEVEMENTS.filter((a) => a.stageId === "global").map((a) => {
                  const unlocked = isUnlocked(a, student!);
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center gap-2 rounded-xl p-2 transition-colors ${
                        unlocked
                          ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800"
                          : "bg-gray-50 dark:bg-gray-700/50 opacity-50"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{unlocked ? a.icon : "🔒"}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold leading-tight ${unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                          {a.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight truncate">{a.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
