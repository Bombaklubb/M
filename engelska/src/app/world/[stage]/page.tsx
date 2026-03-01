"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ModuleCard from "@/components/ui/ModuleCard";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent, GrammarModule, ReadingModule } from "@/lib/types";

interface Props {
  params: Promise<{ stage: string }>;
}

export default function WorldPage({ params }: Props) {
  const { stage: stageId } = use(params);
  const stage = getStage(stageId);

  const [student, setStudent] = useState<StudentData | null>(null);
  const [content, setContent] = useState<StageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"grammar" | "reading">("grammar");

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    // Load JSON content for this stage
    fetch(`/content/${stageId}/content.json`)
      .then((r) => r.json())
      .then((data: StageContent) => setContent(data))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
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

  function getModuleProgress(kind: "grammar" | "reading", moduleId: string) {
    if (!stageProgress) return null;
    const map =
      kind === "grammar" ? stageProgress.grammarModules : stageProgress.readingModules;
    return map[moduleId] ?? null;
  }

  // Linear unlocking: first module always open, each subsequent requires the previous to be completed
  function isModuleLocked(
    mods: Array<GrammarModule | ReadingModule>,
    index: number,
    kind: "grammar" | "reading"
  ): boolean {
    if (index === 0) return false;
    const prev = mods[index - 1];
    return !getModuleProgress(kind, prev.id)?.completed;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header student={student} />

      {/* Hero */}
      <div className={`${stage.bgClass} text-white`}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            ← Tillbaka till världskartan
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-6xl">{stage.emoji}</span>
            <div>
              <h1 className="text-3xl font-black text-shadow">{stage.name}</h1>
              <p className="text-white/70 font-medium">
                {stage.subtitle} · {stage.grades}
              </p>
              <p className="text-white/80 mt-1 text-sm">{stage.description}</p>
            </div>
          </div>

          {/* Stats */}
          {student && stageProgress && (
            <div className="flex gap-4 mt-6 flex-wrap">
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
              ].map(({ label, count, total }) => (
                <div key={label} className="glass rounded-2xl px-4 py-3 text-center">
                  <div className="text-2xl font-black">
                    {count}/{total}
                  </div>
                  <div className="text-xs text-white/70">{label} klara</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
          {(["grammar", "reading"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "grammar" ? "📝 Grammatik" : "📖 Läsförståelse"}
            </button>
          ))}
        </div>

        {/* Module list */}
        {!content ? (
          <div className="card text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Kunde inte ladda innehåll.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === "grammar" ? content.grammar : content.reading).map((mod, idx, arr) => (
              <ModuleCard
                key={mod.id}
                id={mod.id}
                title={mod.title}
                description={mod.description}
                icon={mod.icon}
                kind={activeTab}
                stage={stage}
                progress={getModuleProgress(activeTab, mod.id)}
                locked={isModuleLocked(arr, idx, activeTab)}
                prevModuleTitle={idx > 0 ? arr[idx - 1].title : null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
