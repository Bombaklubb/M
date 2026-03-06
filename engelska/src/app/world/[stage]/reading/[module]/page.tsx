"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import ResultModal from "@/components/ui/ResultModal";
import ReadingQuestionComponent from "@/components/exercises/ReadingQuestion";
import { loadStudent, saveModuleProgress } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent, ReadingModule } from "@/lib/types";

const POINTS_PER_CORRECT = 10;

interface Props {
  params: Promise<{ stage: string; module: string }>;
}

type Phase = "intro" | "reading" | "questions" | "done";

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
          student,
          stage!.id,
          "reading",
          mod!.id,
          finalPts,
          passed
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

  // ─── Intro / help phase ───────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header student={student} />

        <div className={`${stage.bgClass} text-white`}>
          <div className="max-w-3xl mx-auto px-4 py-6">
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

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="card space-y-5">
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
                    className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-amber-900 dark:text-amber-200 text-sm"
                  >
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-blue-800 dark:text-blue-200 text-sm">
                <p>Läs texten noggrant. Försök förstå vad som händer och varför.</p>
                <p className="mt-2">Du kan läsa texten igen medan du svarar på frågorna!</p>
              </div>
            )}

            <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-4">
              <button
                onClick={() => setPhase("reading")}
                className="btn-primary bg-blue-500 hover:bg-blue-600"
              >
                Läs texten →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Reading phase ────────────────────────────────────────────────────────
  if (phase === "reading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header student={student} />

        <div className={`${stage.bgClass} text-white`}>
          <div className="max-w-3xl mx-auto px-4 py-6">
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

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="card">
            {/* Reading instruction */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-6 flex gap-3">
              <span className="text-xl">📖</span>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Läs texten noggrant. Du får svara på frågor efteråt — du kan
                scrolla tillbaka om du vill!
              </p>
            </div>

            {/* Text */}
            <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-100 leading-relaxed mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{mod.title}</h2>
              {mod.author && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">av {mod.author}</p>
              )}
              {mod.text.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4 text-base leading-7">
                  {para}
                </p>
              ))}
            </article>

            {/* Continue button */}
            <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-4">
              <button
                onClick={() => setPhase("questions")}
                className="btn-primary bg-blue-500 hover:bg-blue-600"
              >
                Svara på frågor →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Questions phase ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      <div className={`${stage.bgClass} text-white`}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href={`/world/${stageId}`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors"
          >
            ← {stage.name}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{mod.icon}</span>
            <div>
              <h1 className="text-xl font-black text-shadow">{mod.title}</h1>
              <p className="text-white/70 text-sm">Frågor om texten</p>
            </div>
          </div>
          <ProgressBar
            value={(currentIndex / totalQuestions) * 100}
            colorClass="bg-white/80"
            label={`Fråga ${currentIndex + 1} av ${totalQuestions}`}
          />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {/* Re-read link */}
        <button
          onClick={() => setPhase("reading")}
          className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
        >
          ← Läs texten igen
        </button>

        <div className="card min-h-[280px]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-400 font-medium">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          {currentQuestion && (
            <div key={`${moduleId}-q-${currentIndex}`}>
              <ReadingQuestionComponent
                question={currentQuestion}
                onAnswer={handleAnswer}
                isLast={currentIndex + 1 === totalQuestions}
              />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <span>✓ {results.filter(Boolean).length} rätt</span>
          <span>✗ {results.filter((r) => !r).length} fel</span>
          <span className="text-amber-600">⭐ {earnedPoints} poäng</span>
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
