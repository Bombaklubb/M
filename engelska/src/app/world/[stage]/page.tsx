"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ModuleCard from "@/components/ui/ModuleCard";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent } from "@/lib/types";
import { NumberTicker } from "@/components/magicui/number-ticker";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-4xl animate-bounce-slow">{stage.emoji}</div>
      </div>
    );
  }

  const stageProgress = student?.stages[stage.id as keyof typeof student.stages];

  function getModuleProgress(kind: "grammar" | "reading" | "spelling" | "wordsearch" | "crossword", moduleId: string) {
    if (!stageProgress) return null;
    const map =
      kind === "grammar" ? stageProgress.grammarModules
      : kind === "reading" ? stageProgress.readingModules
      : kind === "spelling" ? (stageProgress.spellingModules ?? {})
      : kind === "wordsearch" ? (stageProgress.wordsearchModules ?? {})
      : (stageProgress.crosswordModules ?? {});
    return map[moduleId] ?? null;
  }

  const stageImages: Record<string, string> = {
    lagstadiet: "/content/sprakdjungeln.png",
    mellanstadiet: "/content/sprakstaden.png",
    hogstadiet: "/content/sprakarenan.png",
    gymnasiet: "/content/sprakakademin.png",
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "grammar", label: "📝 Grammatik" },
    { id: "reading", label: "📖 Läsning" },
    { id: "spelling", label: "✏️ Stavning" },
    { id: "regler", label: "📐 Språkregler" },
    { id: "wordsearch", label: "🔍 Ordsökning" },
    { id: "crossword", label: "🔠 Korsord" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img src={stageImages[stage.id]} alt={stage.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <Link
            href="/"
            className="self-start inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-full transition-colors"
          >
            ← Tillbaka
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white">{stage.name}</h1>
            <p className="text-white/70 font-medium mt-0.5">{stage.subtitle} · {stage.grades}</p>
            <p className="text-white/60 text-sm mt-1">{stage.description}</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {student && stageProgress && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 sm:gap-3 flex-wrap">
            {[
              { label: "Grammatik", icon: "📝", count: Object.values(stageProgress.grammarModules).filter((m) => m.completed).length, total: content?.grammar.length ?? 0 },
              { label: "Läsning",   icon: "📖", count: Object.values(stageProgress.readingModules).filter((m) => m.completed).length, total: content?.reading.length ?? 0 },
              { label: "Stavning",  icon: "✏️", count: Object.values(stageProgress.spellingModules ?? {}).filter((m) => m.completed).length, total: content?.spelling?.length ?? 0 },
              { label: "Ordsök.",   icon: "🔍", count: Object.values(stageProgress.wordsearchModules ?? {}).filter((m) => m.completed).length, total: content?.wordsearch?.length ?? 0 },
              { label: "Korsord",   icon: "🔠", count: Object.values(stageProgress.crosswordModules ?? {}).filter((m) => m.completed).length, total: content?.crossword?.length ?? 0 },
            ].map(({ label, icon, count, total }) => {
              const allDone = total > 0 && count === total;
              const hasProgress = count > 0;
              return (
                <div
                  key={label}
                  className={`relative overflow-hidden border-2 rounded-2xl px-3 py-2.5 text-center transition-all duration-200 flex-1 min-w-[60px] ${
                    allDone
                      ? `${stage.borderClass} bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-sm`
                      : "bg-gray-50 dark:bg-gray-700/80 border-gray-100 dark:border-gray-600"
                  }`}
                  style={allDone ? {
                    boxShadow: "0 3px 0 0 rgba(34,197,94,0.15), inset 0 1px 3px 0 rgba(255,255,255,0.7)"
                  } : undefined}
                >
                  {allDone && (
                    <BorderBeam size={80} duration={6} colorFrom="#4ade80" colorTo="#22c55e" borderWidth={1.5} />
                  )}
                  <div className="text-sm mb-0.5">{icon}</div>
                  <div className={`font-black text-base leading-none flex items-center justify-center gap-0.5 ${allDone ? stage.textClass : hasProgress ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                    {hasProgress ? (
                      <NumberTicker value={count} className={allDone ? stage.textClass : "text-gray-900 dark:text-gray-100"} duration={600} />
                    ) : (
                      <span>0</span>
                    )}
                    <span className="text-gray-400 dark:text-gray-500 font-bold text-sm">/{total}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs — scrollable on small screens */}
        <div className="overflow-x-auto pb-1 mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-max min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
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

        {/* Language rules tab */}
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
                              <span key={j} className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg px-2.5 py-1 text-xs text-blue-800 dark:text-blue-200 font-mono">
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
              activeTab === "grammar" ? content.grammar
              : activeTab === "reading" ? content.reading
              : activeTab === "spelling" ? (content.spelling ?? [])
              : activeTab === "wordsearch" ? (content.wordsearch ?? [])
              : (content.crossword ?? [])
            ).map((mod, idx, arr) => (
              <ModuleCard
                key={mod.id}
                id={mod.id}
                title={mod.title}
                description={mod.description}
                icon={mod.icon}
                kind={activeTab as "grammar" | "reading" | "spelling" | "wordsearch" | "crossword"}
                stage={stage}
                progress={getModuleProgress(activeTab as "grammar" | "reading" | "spelling" | "wordsearch" | "crossword", mod.id)}
                locked={false}
                prevModuleTitle={idx > 0 ? arr[idx - 1].title : null}
              />
            ))}
            {(
              (activeTab === "wordsearch" && (content.wordsearch ?? []).length === 0) ||
              (activeTab === "crossword" && (content.crossword ?? []).length === 0)
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
  );
}
