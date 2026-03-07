"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ResultModal from "@/components/ui/ResultModal";
import ReadingQuestionComponent from "@/components/exercises/ReadingQuestion";
import { loadStudent, saveModuleProgress } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent, ReadingModule } from "@/lib/types";

const POINTS_PER_CORRECT = 10;

interface Props {
  params: Promise<{ stage: string; module: string }>;
}

type Phase = "intro" | "reading" | "done";

export default function ReadingModulePage({ params }: Props) {
  const { stage: stageId, module: moduleId } = use(params);
  const stage = getStage(stageId);
  const router = useRouter();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [mod, setMod] = useState<ReadingModule | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    fetch(`/content/${stageId}/content.json`)
      .then((r) => r.json())
      .then((data: StageContent) => {
        const found = data.reading.find((m) => m.id === moduleId);
        if (found) setMod(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [stageId, moduleId]);

  if (!stage) return notFound();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">{stage.emoji}</div>
      </div>
    );
  }

  if (!mod) return notFound();

  const questions = mod.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  function handleAnswer(correct: boolean) {
    const newResults = [...results, correct];
    setResults(newResults);

    if (currentIndex + 1 >= totalQuestions) {
      const totalCorrect = newResults.filter(Boolean).length;
      const pts = totalCorrect * POINTS_PER_CORRECT;
      const passed = (totalCorrect / totalQuestions) >= 0.6;
      const finalPts = passed ? pts + mod!.bonusPoints : pts;

      if (student) {
        const updated = saveModuleProgress(
          student, stage!.id, "reading", mod!.id, finalPts, passed
        );
        setStudent(updated);
      }
      setShowResult(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setResults([]);
    setShowResult(false);
    setPhase("intro");
  }

  function handleContinue() {
    router.push(`/world/${stageId}`);
  }

  const totalCorrect = results.filter(Boolean).length;
  const earnedPoints = totalCorrect * POINTS_PER_CORRECT;

  // ─── Intro phase ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header student={student} />

        <div className={`${stage.bgClass} text-white`}>
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
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
                <p className="text-white/70 text-sm">📖 Läsförståelse · {mod.description}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="card space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Tänk på det här innan du börjar!
              </h2>
            </div>

            {mod.helpText && mod.helpText.length > 0 ? (
              <ul className="space-y-3">
                {mod.helpText.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-amber-900 dark:text-amber-200 text-sm leading-relaxed"
                  >
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-3 sm:p-4 text-blue-800 dark:text-blue-200 text-sm">
                <p>Läs texten noggrant. Frågorna visas bredvid texten – du kan läsa om när du vill!</p>
              </div>
            )}

            <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-3 sm:pt-4">
              <button
                onClick={() => setPhase("reading")}
                className="btn-primary bg-blue-500 hover:bg-blue-600 w-full sm:w-auto justify-center"
              >
                Börja läsa →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Reading + Questions split view ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      {/* Coloured banner */}
      <div className={`${stage.bgClass} text-white`}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href={`/world/${stageId}`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-2 transition-colors"
          >
            ← {stage.name}
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mod.icon}</span>
              <div>
                <h1 className="text-lg font-black text-shadow">{mod.title}</h1>
                <p className="text-white/70 text-sm">{mod.description}</p>
              </div>
            </div>
            {/* Progress indicator */}
            <div className="flex-shrink-0 text-sm text-white/80 font-semibold">
              Fråga {Math.min(currentIndex + 1, totalQuestions)}/{totalQuestions}
            </div>
          </div>
        </div>
      </div>

      {/* Split layout: text left, question right */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* ── Left: Reading text (sticky on desktop) ── */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-20">
            <div className="card h-full">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-lg">📖</span>
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Läs texten</h2>
                <span className="ml-auto text-xs text-gray-400">Du kan scrolla</span>
              </div>
              <div className="overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-200px)] pr-1">
                {mod.author && (
                  <p className="text-xs text-gray-400 italic mb-3">av {mod.author}</p>
                )}
                {mod.text.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-4 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-100">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Questions ── */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Score bar */}
            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 px-1">
              <span className="text-green-600 dark:text-green-400 font-semibold">✓ {results.filter(Boolean).length} rätt</span>
              <span className="text-red-500 dark:text-red-400 font-semibold">✗ {results.filter((r) => !r).length} fel</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">⭐ {earnedPoints} p</span>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 flex-wrap px-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i < results.length
                      ? results[i] ? "bg-green-500 w-5" : "bg-red-400 w-5"
                      : i === currentIndex
                      ? "bg-blue-500 w-5"
                      : "bg-gray-200 dark:bg-gray-700 w-3"
                  }`}
                />
              ))}
            </div>

            {/* Current question */}
            <div className="card min-h-[220px]">
              {currentQuestion && !showResult && (
                <div key={`${moduleId}-q-${currentIndex}`}>
                  <ReadingQuestionComponent
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    isLast={currentIndex + 1 === totalQuestions}
                  />
                </div>
              )}
              {showResult && (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <span className="text-5xl">{totalCorrect >= totalQuestions * 0.6 ? "🎉" : "💪"}</span>
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {totalCorrect} av {totalQuestions} rätt!
                  </p>
                  <p className="text-amber-600 font-semibold">⭐ {earnedPoints} poäng</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showResult && (
        <ResultModal
          points={earnedPoints}
          bonusPoints={mod.bonusPoints}
          totalCorrect={totalCorrect}
          totalQuestions={totalQuestions}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
