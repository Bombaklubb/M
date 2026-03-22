"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ModuleCard from "@/components/ui/ModuleCard";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent } from "@/lib/types";
import { BorderBeam } from "@/components/magicui/border-beam";

interface RuleItem {
  term: string;
  explanation: string;
  examples: string[];
}

interface RuleSection {
  id: string;
  title: string;
  icon: string;
  content: RuleItem[];
}

interface Props {
  params: Promise<{ stage: string }>;
}

type Tab = "grammar" | "reading" | "spelling" | "wordsearch" | "crossword" | "regler";

export default function WorldPage({ params }: Props) {
  const { stage: stageId } = use(params);
  const stage = getStage(stageId);

  const [student, setStudent] = useState<StudentData | null>(null);
  const [content, setContent] = useState<StageContent | null>(null);
  const [rules, setRules] = useState<RuleSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("grammar");

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    fetch(`/content/${stageId}/content.json`)
      .then((r) => r.json())
      .then((data: StageContent) => setContent(data))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
    fetch(`/content/${stageId}/rules.json`)
      .then((r) => r.json())
      .then((data: { sections: RuleSection[] }) => setRules(data.sections))
      .catch(() => {});
  }, [stageId]);

  if (!stage) return notFound();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">{stage.emoji}</div>
      </div>
    );
  }

  const stageProgress = student?.stages[stage.id as keyof typeof student.stages];

  function getModuleProgress(kind: "grammar" | "reading" | "spelling" | "wordsearch" | "crossword", moduleId: string) {
    if (!stageProgress) return null;
    const map =
      kind === "grammar"    ? stageProgress.grammarModules
      : kind === "reading"  ? stageProgress.readingModules
      : kind === "spelling" ? (stageProgress.spellingModules    ?? {})
      : kind === "wordsearch" ? (stageProgress.wordsearchModules ?? {})
      : (stageProgress.crosswordModules ?? {});
    return map[moduleId] ?? null;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "grammar",    label: "📝 Grammatik" },
    { id: "reading",    label: "📖 Läsning" },
    { id: "spelling",   label: "✏️ Stavning" },
    { id: "regler",     label: "📐 Språkregler" },
    { id: "wordsearch", label: "🔍 Ordsökning" },
    { id: "crossword",  label: "🔠 Korsord" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header student={student} />

      {/* Hero */}
      <div className={`relative overflow-hidden ${stage.bgClass}`}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full transition-colors mb-4"
          >
            ← Tillbaka
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-6xl drop-shadow-lg">{stage.emoji}</span>
            <div>
              <h1 className="text-3xl font-black text-white text-shadow">{stage.name}</h1>
              <p className="text-white/70 font-semibold mt-0.5">{stage.subtitle} · {stage.grades}</p>
              <p className="text-white/60 text-sm mt-1">{stage.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {student && stageProgress && (
        <div className="bg-white/95 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 py-3 flex gap-3 flex-wrap">
            {[
              { label: "Grammatik", icon: "📝", count: Object.values(stageProgress.grammarModules).filter((m) => m.completed).length,                  total: content?.grammar.length ?? 0 },
              { label: "Läsning",   icon: "📖", count: Object.values(stageProgress.readingModules).filter((m) => m.completed).length,                  total: content?.reading.length ?? 0 },
              { label: "Stavning",  icon: "✏️", count: Object.values(stageProgress.spellingModules    ?? {}).filter((m) => m.completed).length,        total: content?.spelling?.length ?? 0 },
              { label: "Ordsök.",   icon: "🔍", count: Object.values(stageProgress.wordsearchModules  ?? {}).filter((m) => m.completed).length,        total: content?.wordsearch?.length ?? 0 },
              { label: "Korsord",   icon: "🔠", count: Object.values(stageProgress.crosswordModules   ?? {}).filter((m) => m.completed).length,        total: content?.crossword?.length ?? 0 },
            ].map(({ label, icon, count, total }) => {
              const done = total > 0 && count === total;
              return (
                <div
                  key={label}
                  className={`relative overflow-hidden border rounded-xl px-3 py-2 text-center transition-colors ${
                    done
                      ? `${stage.borderClass} bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700`
                      : "bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600"
                  }`}
                >
                  {done && (
                    <BorderBeam size={80} duration={6} colorFrom="#ffffff" colorTo="rgba(255,255,255,0.4)" borderWidth={1.5} />
                  )}
                  <div className="text-base">{icon}</div>
                  <div className={`text-lg font-black ${done ? stage.textClass : "text-gray-900 dark:text-gray-100"}`}>
                    {count}/{total}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="overflow-x-auto pb-1 mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-max min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? `${stage.colorClass} text-white shadow-md`
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language rules */}
        {activeTab === "regler" ? (
          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="card text-center py-8 text-gray-400">Laddar regler...</div>
            ) : (
              rules.map((section) => (
                <details key={section.id} className="card group" open>
                  <summary className="flex items-center gap-3 cursor-pointer list-none select-none">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base flex-1">{section.title}</h2>
                    <span className="text-gray-400 text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
                  </summary>
                  <div className="mt-4 space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    {section.content.map((item, i) => (
                      <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
                        <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">{item.term}</div>
                        {item.explanation && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{item.explanation}</div>
                        )}
                        {item.examples.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.examples.map((ex, j) => (
                              <span key={j} className="bg-en-50 dark:bg-en-900/30 border border-en-200 dark:border-en-700 rounded-lg px-2.5 py-1 text-xs text-en-800 dark:text-en-200 font-mono">
                                {ex}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ))
            )}
          </div>

        ) : !content ? (
          <div className="card text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Kunde inte ladda innehåll.</p>
          </div>

        ) : (
          <div className="space-y-2">
            {(
              activeTab === "grammar"    ? content.grammar
              : activeTab === "reading" ? content.reading
              : activeTab === "spelling" ? (content.spelling   ?? [])
              : activeTab === "wordsearch" ? (content.wordsearch ?? [])
              : (content.crossword ?? [])
            ).map((mod, idx, arr) => {
              const isFinalTest = mod.id.endsWith("-sluttest");
              return (
                <div key={mod.id}>
                  {isFinalTest && (
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-600 to-transparent" />
                      <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-full px-4 py-1.5 text-amber-700 dark:text-amber-300 font-bold text-sm">
                        <span>🏆</span>
                        <span>Sluttest</span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-600 to-transparent" />
                    </div>
                  )}
                  <ModuleCard
                    id={mod.id}
                    title={mod.title}
                    description={mod.description}
                    icon={mod.icon}
                    kind={activeTab as "grammar" | "reading" | "spelling" | "wordsearch" | "crossword"}
                    stage={stage}
                    progress={getModuleProgress(activeTab as "grammar" | "reading" | "spelling" | "wordsearch" | "crossword", mod.id)}
                    locked={false}
                    prevModuleTitle={idx > 0 ? arr[idx - 1].title : null}
                    isFinalTest={isFinalTest}
                  />
                </div>
              );
            })}
            {(
              (activeTab === "wordsearch" && (content.wordsearch ?? []).length === 0) ||
              (activeTab === "crossword"  && (content.crossword  ?? []).length === 0)
            ) && (
              <div className="card text-center py-10 text-gray-400">
                <div className="text-3xl mb-2">{activeTab === "wordsearch" ? "🔍" : "🔠"}</div>
                <p>Inga moduler tillgängliga ännu.</p>
              </div>
            )}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
