"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ModuleCard from "@/components/ui/ModuleCard";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent, GrammarModule, ReadingModule } from "@/lib/types";

interface GrammarTip {
  title_en: string;
  title_sv: string;
  rule: string;
  example: string;
  tip: string;
}

interface Props {
  params: Promise<{ stage: string }>;
}

export default function WorldPage({ params }: Props) {
  const { stage: stageId } = use(params);
  const stage = getStage(stageId);

  const [student, setStudent] = useState<StudentData | null>(null);
  const [content, setContent] = useState<StageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"grammar" | "reading" | "spelling" | "tips">("grammar");
  const [tips, setTips] = useState<GrammarTip[]>([]);

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    // Load JSON content for this stage
    fetch(`/content/${stageId}/content.json`)
      .then((r) => r.json())
      .then((data: StageContent) => setContent(data))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
    fetch("/content/grammar-tips.json")
      .then((r) => r.json())
      .then((data: GrammarTip[]) => setTips(data))
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

  function getModuleProgress(kind: "grammar" | "reading" | "spelling", moduleId: string) {
    if (!stageProgress) return null;
    const map =
      kind === "grammar"
        ? stageProgress.grammarModules
        : kind === "reading"
        ? stageProgress.readingModules
        : (stageProgress.spellingModules ?? {});
    return map[moduleId] ?? null;
  }

  function isModuleLocked(): boolean {
    return false;
  }

  const stageImages: Record<string, string> = {
    lagstadiet: "/content/sprakdjungeln.png",
    mellanstadiet: "/content/sprakstaden.png",
    hogstadiet: "/content/sprakarenan.png",
    gymnasiet: "/content/sprakakademin.png",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      {/* Hero – stage image */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={stageImages[stage.id]}
          alt={stage.name}
          className="w-full h-full object-cover"
        />
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
          <div className="max-w-5xl mx-auto px-4 py-4 flex gap-4 flex-wrap">
            {[
              {
                label: "Grammatik",
                count: Object.values(stageProgress.grammarModules).filter((m) => m.completed).length,
                total: content?.grammar.length ?? 0,
              },
              {
                label: "Läsning",
                count: Object.values(stageProgress.readingModules).filter((m) => m.completed).length,
                total: content?.reading.length ?? 0,
              },
              {
                label: "Stavning",
                count: Object.values(stageProgress.spellingModules ?? {}).filter((m) => m.completed).length,
                total: content?.spelling?.length ?? 0,
              },
            ].map(({ label, count, total }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{count}/{total}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{label} klara</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
          {(["grammar", "reading", "spelling", "tips"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab === "grammar" ? "📝 Grammatik" : tab === "reading" ? "📖 Läsförståelse" : tab === "spelling" ? "✏️ Stavning" : "💡 Tips"}
            </button>
          ))}
        </div>

        {/* Tips tab */}
        {activeTab === "tips" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {tips.map((t) => (
              <div key={t.title_en} className="card space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t.title_sv}</div>
                    <div className="text-xs text-gray-400">{t.title_en}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t.rule}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t.example}</p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                  {t.tip}
                </div>
              </div>
            ))}
          </div>
        ) : !content ? (
          <div className="card text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Kunde inte ladda innehåll.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === "grammar"
              ? content.grammar
              : activeTab === "reading"
              ? content.reading
              : (content.spelling ?? [])
            ).map((mod, idx, arr) => (
              <ModuleCard
                key={mod.id}
                id={mod.id}
                title={mod.title}
                description={mod.description}
                icon={mod.icon}
                kind={activeTab === "tips" ? "grammar" : activeTab}
                stage={stage}
                progress={getModuleProgress(activeTab === "tips" ? "grammar" : activeTab, mod.id)}
                locked={isModuleLocked()}
                prevModuleTitle={idx > 0 ? arr[idx - 1].title : null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
