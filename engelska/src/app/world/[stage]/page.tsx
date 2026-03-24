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
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";

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

type Tab = "grammar" | "reading" | "spelling" | "wordsearch" | "regler" | "spel";

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

  function getModuleProgress(kind: "grammar" | "reading" | "spelling" | "wordsearch", moduleId: string) {
    if (!stageProgress) return null;
    const map =
      kind === "grammar"    ? stageProgress.grammarModules
      : kind === "reading"  ? stageProgress.readingModules
      : kind === "spelling" ? (stageProgress.spellingModules    ?? {})
      : (stageProgress.wordsearchModules ?? {});
    return map[moduleId] ?? null;
  }

  // SVG icons for tabs
  const tabIcons: Record<Tab, React.ReactNode> = {
    grammar: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    reading: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    spelling: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    regler: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    wordsearch: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    spel: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "grammar",    label: "Grammatik" },
    { id: "reading",    label: "Läsning" },
    { id: "spelling",   label: "Stavning" },
    { id: "regler",     label: "Språkregler" },
    { id: "wordsearch", label: "Ordsökning" },
    { id: "spel",       label: "Spel" },
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
              { label: "Grammatik", icon: tabIcons.grammar,    count: Object.values(stageProgress.grammarModules).filter((m) => m.completed).length,             total: content?.grammar.length ?? 0 },
              { label: "Läsning",   icon: tabIcons.reading,    count: Object.values(stageProgress.readingModules).filter((m) => m.completed).length,             total: content?.reading.length ?? 0 },
              { label: "Stavning",  icon: tabIcons.spelling,   count: Object.values(stageProgress.spellingModules    ?? {}).filter((m) => m.completed).length,   total: content?.spelling?.length ?? 0 },
              { label: "Ordsök.",   icon: tabIcons.wordsearch, count: Object.values(stageProgress.wordsearchModules  ?? {}).filter((m) => m.completed).length,   total: content?.wordsearch?.length ?? 0 },
            ].map(({ label, icon, count, total }) => {
              const done = total > 0 && count === total;
              return (
                <div
                  key={label}
                  className={`relative overflow-hidden border-2 rounded-2xl px-3 py-2 text-center transition-all duration-200 cursor-default ${
                    done
                      ? `${stage.borderClass} bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700`
                      : "bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600"
                  }`}
                  style={{ boxShadow: done ? "0 3px 0 0 rgba(0,0,0,0.08)" : undefined }}
                >
                  {done && (
                    <BorderBeam size={80} duration={6} colorFrom="#ffffff" colorTo="rgba(255,255,255,0.4)" borderWidth={1.5} />
                  )}
                  <div className={`flex justify-center mb-0.5 ${done ? stage.textClass : "text-gray-500 dark:text-gray-400"}`}>
                    {icon}
                  </div>
                  <div className={`text-lg font-black ${done ? stage.textClass : "text-gray-900 dark:text-gray-100"}`}>
                    <NumberTicker value={count} duration={600} suffix={`/${total}`} />
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
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? `${stage.colorClass} text-white shadow-md`
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/50"
                }`}
                style={activeTab === tab.id ? { boxShadow: "0 3px 0 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)" } : {}}
              >
                {tabIcons[tab.id]}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              activeTab === "grammar"    ? content.grammar
              : activeTab === "reading" ? content.reading
              : activeTab === "spelling" ? (content.spelling   ?? [])
              : activeTab === "wordsearch" ? (content.wordsearch ?? [])
              : (content.wordsearch ?? [])
            ).map((mod, idx, arr) => {
              const isFinalTest = mod.id.endsWith("-sluttest");
              return (
                <BlurFade key={mod.id} delay={idx * 0.04} duration={0.35} className={isFinalTest ? "sm:col-span-2" : ""}>
                  {isFinalTest && (
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-600 to-transparent" />
                      <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-full px-4 py-1.5 text-amber-700 dark:text-amber-300 font-bold text-sm"
                        style={{ boxShadow: "0 3px 0 0 rgba(245,158,11,0.15)" }}>
                        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9H4a2 2 0 0 1-2-2V5h4" /><path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
                          <path d="M12 17c-4 0-7-3-7-7V5h14v5c0 4-3 7-7 7z" /><path d="M12 17v4" /><path d="M8 21h8" />
                        </svg>
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
                    kind={activeTab as "grammar" | "reading" | "spelling" | "wordsearch"}
                    stage={stage}
                    progress={getModuleProgress(activeTab as "grammar" | "reading" | "spelling" | "wordsearch", mod.id)}
                    locked={false}
                    prevModuleTitle={idx > 0 ? arr[idx - 1].title : null}
                    isFinalTest={isFinalTest}
                  />
                </BlurFade>
              );
            })}
            {(activeTab === "wordsearch" && (content.wordsearch ?? []).length === 0) && (
              <div className="card text-center py-10 text-gray-400">
                <div className="text-3xl mb-2">🔍</div>
                <p>Inga moduler tillgängliga ännu.</p>
              </div>
            )}
          </div>
        )}

        {/* Games hub */}
        {activeTab === "spel" && (
          <div>
            <div className="mb-6 text-center">
              <div className="text-4xl mb-2">🎮</div>
              <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">Spel</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Träna engelskan med roliga spel!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/world/${stage.id}/spel/memory`}
                className={`card group border-3 transition-all duration-200 hover:-translate-y-1 cursor-pointer ${stage.borderClass}`}
                style={{ boxShadow: "0 4px 0 0 rgba(99,102,241,0.15), 0 8px 16px -4px rgba(99,102,241,0.1)" }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-3 ${stage.colorClass} border-white/20`}
                    style={{ boxShadow: "0 3px 0 0 rgba(0,0,0,0.15)" }}>
                    🃏
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 dark:text-gray-100 text-base">Memory</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Para ihop svenska ord med engelska översättningar!</p>
                    <div className="mt-2 flex gap-2 flex-wrap text-xs">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold">🟢 Lätt – 8 kort</span>
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full font-semibold">🟡 Medel – 14 kort</span>
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold">🔴 Svår – 20 kort</span>
                    </div>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors text-xl flex-shrink-0">→</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
