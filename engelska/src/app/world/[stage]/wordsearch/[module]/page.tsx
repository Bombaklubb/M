"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ResultModal from "@/components/ui/ResultModal";
import WordSearch from "@/components/exercises/WordSearch";
import { loadStudent, saveModuleProgress } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent, WordSearchModule } from "@/lib/types";

interface Props {
  params: Promise<{ stage: string; module: string }>;
}

export default function WordSearchModulePage({ params }: Props) {
  const { stage: stageId, module: moduleId } = use(params);
  const stage = getStage(stageId);
  const router = useRouter();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [mod, setMod] = useState<WordSearchModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    fetch(`/content/${stageId}/content.json`)
      .then((r) => r.json())
      .then((data: StageContent) => {
        const found = data.wordsearch?.find((m) => m.id === moduleId);
        if (found) setMod(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [stageId, moduleId]);

  if (!stage) return notFound();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">🔍</div>
      </div>
    );
  }
  if (!mod) return notFound();

  function handleComplete() {
    const pts = mod!.bonusPoints + 50;
    if (student) {
      const updated = saveModuleProgress(student, stage!.id, "wordsearch", mod!.id, pts, true);
      setStudent(updated);
    }
    setShowResult(true);
  }

  function handleRetry() {
    setShowResult(false);
  }

  function handleContinue() {
    router.push(`/world/${stageId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      <div className={`${stage.bgClass} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href={`/world/${stageId}`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors"
          >
            ← {stage.name}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{mod.icon}</span>
            <div>
              <h1 className="text-xl font-black text-shadow">{mod.title}</h1>
              <p className="text-white/70 text-sm">🔍 Ordsökning · {mod.description}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">
          <WordSearch words={mod.words} onComplete={handleComplete} />
        </div>
      </main>

      {showResult && (
        <ResultModal
          points={mod.bonusPoints + 50}
          bonusPoints={0}
          totalCorrect={mod.words.length}
          totalQuestions={mod.words.length}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
