"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import ResultModal from "@/components/ui/ResultModal";
import MultipleChoice from "@/components/exercises/MultipleChoice";
import FillInBlank from "@/components/exercises/FillInBlank";
import BuildSentence from "@/components/exercises/BuildSentence";
import { loadStudent, saveModuleProgress } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type {
  StudentData,
  StageContent,
  GrammarModule,
  GrammarExercise,
} from "@/lib/types";

const POINTS_PER_CORRECT = 10;

interface Props {
  params: Promise<{ stage: string; module: string }>;
}

export default function GrammarModulePage({ params }: Props) {
  const { stage: stageId, module: moduleId } = use(params);
  const stage = getStage(stageId);
  const router = useRouter();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [mod, setMod] = useState<GrammarModule | null>(null);
  const [loading, setLoading] = useState(true);

  // Exercise state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    fetch(`/content/${stageId}/content.json`)
      .then((r) => r.json())
      .then((data: StageContent) => {
        const found = data.grammar.find((m) => m.id === moduleId);
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

  const exercises = mod.exercises;
  const totalExercises = exercises.length;
  const currentExercise: GrammarExercise | undefined = exercises[currentIndex];
  const progress = ((currentIndex) / totalExercises) * 100;

  function handleAnswer(correct: boolean) {
    const newResults = [...results, correct];
    setResults(newResults);

    if (currentIndex + 1 >= totalExercises) {
      // Module done — compute score and save
      const totalCorrect = newResults.filter(Boolean).length;
      const pts = totalCorrect * POINTS_PER_CORRECT;
      const passed = (totalCorrect / totalExercises) >= 0.6;
      const finalPts = passed ? pts + mod!.bonusPoints : pts;

      if (student) {
        const updated = saveModuleProgress(
          student,
          stage!.id,
          "grammar",
          mod!.id,
          finalPts,
          passed
        );
        setStudent(updated);
      }
      setShowResult(true);
    } else {
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setResults([]);
    setShowResult(false);
  }

  function handleContinue() {
    router.push(`/world/${stageId}`);
  }

  const totalCorrect = results.filter(Boolean).length;
  const earnedPoints = totalCorrect * POINTS_PER_CORRECT;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header student={student} />

      {/* Progress header */}
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
              <p className="text-white/70 text-sm">{mod.description}</p>
            </div>
          </div>
          <ProgressBar
            value={progress}
            colorClass="bg-white/80"
            label={`Fråga ${Math.min(currentIndex + 1, totalExercises)} av ${totalExercises}`}
            showPercent={false}
          />
        </div>
      </div>

      {/* Exercise card */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card min-h-[300px]">
          {/* Exercise counter + type badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-400 font-medium">
              {currentIndex + 1} / {totalExercises}
            </span>
            {currentExercise && (
              <span className="badge bg-blue-100 text-blue-700 text-xs">
                {currentExercise.type === "multiple-choice"
                  ? "🔘 Flerval"
                  : currentExercise.type === "fill-in-blank"
                  ? "✏️ Fyll i"
                  : "🔤 Bygg mening"}
              </span>
            )}
          </div>

          {/* Render exercise */}
          {currentExercise && (
            <div key={`${moduleId}-${currentIndex}`}>
              {currentExercise.type === "multiple-choice" && (
                <MultipleChoice exercise={currentExercise} onAnswer={handleAnswer} />
              )}
              {currentExercise.type === "fill-in-blank" && (
                <FillInBlank exercise={currentExercise} onAnswer={handleAnswer} />
              )}
              {currentExercise.type === "build-sentence" && (
                <BuildSentence exercise={currentExercise} onAnswer={handleAnswer} />
              )}
            </div>
          )}
        </div>

        {/* Running score */}
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
          <span>✓ {results.filter(Boolean).length} rätt</span>
          <span>✗ {results.filter((r) => !r).length} fel</span>
          <span className="text-amber-600">⭐ {earnedPoints} poäng</span>
        </div>
      </main>

      {/* Result modal */}
      {showResult && (
        <ResultModal
          points={earnedPoints}
          bonusPoints={mod.bonusPoints}
          totalCorrect={totalCorrect}
          totalQuestions={totalExercises}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
