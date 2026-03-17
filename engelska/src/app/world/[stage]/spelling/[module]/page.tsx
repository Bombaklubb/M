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
import { loadStudent, saveModuleProgress, loadGamification, saveGamification } from "@/lib/storage";
import { chestsEarnedFromPoints, chestsEarnedFromExercises, rollMysteryBox, BOSS_UNLOCK_THRESHOLD } from "@/lib/gamification";
import MysteryBoxPopup from "@/components/ui/MysteryBoxPopup";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent, SpellingModule, GrammarExercise, ChestType, MysteryBoxReward } from "@/lib/types";

const POINTS_PER_CORRECT = 10;

interface Props {
  params: Promise<{ stage: string; module: string }>;
}

export default function SpellingModulePage({ params }: Props) {
  const { stage: stageId, module: moduleId } = use(params);
  const stage = getStage(stageId);
  const router = useRouter();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [mod, setMod] = useState<SpellingModule | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<"intro" | "exercises">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [chestEarned, setChestEarned] = useState<ChestType | undefined>();
  const [bossJustUnlocked, setBossJustUnlocked] = useState(false);
  const [mysteryBox, setMysteryBox] = useState<MysteryBoxReward | null>(null);

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    fetch(`/content/${stageId}/content.json`)
      .then((r) => r.json())
      .then((data: StageContent) => {
        const found = data.spelling?.find((m) => m.id === moduleId);
        if (found) setMod(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [stageId, moduleId]);

  if (!stage) return notFound();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-4xl animate-bounce-slow">✏️</div>
      </div>
    );
  }

  if (!mod) return notFound();

  const exercises = mod.exercises;
  const totalExercises = exercises.length;
  const currentExercise: GrammarExercise | undefined = exercises[currentIndex];
  const progress = (currentIndex / totalExercises) * 100;

  function handleAnswer(correct: boolean) {
    const newResults = [...results, correct];
    setResults(newResults);

    if (currentIndex + 1 >= totalExercises) {
      const totalCorrect = newResults.filter(Boolean).length;
      const pts = totalCorrect * POINTS_PER_CORRECT;
      const passed = totalCorrect / totalExercises >= 0.6;
      const finalPts = passed ? pts + mod!.bonusPoints : pts;

      if (student) {
        const updated = saveModuleProgress(student, stage!.id, "spelling", mod!.id, finalPts, passed);
        setStudent(updated);

        const gam = loadGamification();
        const prevPoints = student.totalPoints;
        const newPoints = updated.totalPoints;
        const prevEx = gam.exercisesCompleted;
        const newEx = prevEx + 1;
        const pointChests = chestsEarnedFromPoints(prevPoints, newPoints, gam.pointsMilestonesRewarded);
        const exChests = chestsEarnedFromExercises(prevEx, newEx, gam.exerciseMilestonesRewarded);
        const allNewChests = [...pointChests.map((c) => c.chest), ...exChests.map((c) => c.chest)];
        const firstChest = allNewChests[0];
        const wasBossUnlocked = gam.bossUnlocked;
        const nowBossUnlocked = wasBossUnlocked || newEx >= BOSS_UNLOCK_THRESHOLD;
        const mystery = rollMysteryBox(gam.badges, newEx);
        const extraMysteryChest = mystery?.type === "chest" && mystery.chestType
          ? [{ id: `chest_m_${Date.now()}`, type: mystery.chestType, earnedAt: new Date().toISOString(), opened: false } as import("@/lib/types").Chest]
          : [];
        const mysteryBadge = mystery?.type === "badge" && mystery.badgeId ? mystery.badgeId : null;
        const mysteryPoints = mystery?.type === "points" && mystery.points ? mystery.points : 0;
        saveGamification({
          ...gam,
          chests: [...gam.chests, ...allNewChests, ...extraMysteryChest],
          badges: mysteryBadge && !gam.badges.includes(mysteryBadge) ? [...gam.badges, mysteryBadge] : gam.badges,
          exercisesCompleted: newEx,
          bossUnlocked: nowBossUnlocked,
          pointsMilestonesRewarded: [...gam.pointsMilestonesRewarded, ...pointChests.map((c) => c.milestone)],
          exerciseMilestonesRewarded: [...gam.exerciseMilestonesRewarded, ...exChests.map((c) => c.milestone)],
        });
        if (mysteryPoints > 0) setStudent({ ...updated, totalPoints: updated.totalPoints + mysteryPoints });
        if (firstChest) setChestEarned(firstChest.type as ChestType);
        if (nowBossUnlocked && !wasBossUnlocked) setBossJustUnlocked(true);
        if (mystery) setMysteryBox(mystery);
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
    if (mysteryBox) {
      setShowResult(false);
    } else {
      router.push(`/world/${stageId}`);
    }
  }

  function handleMysteryClose() {
    setMysteryBox(null);
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
                <p className="text-white/70 text-sm">{mod.description}</p>
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
                <p>{mod.description}</p>
                <p className="mt-2 text-blue-600 dark:text-blue-300 text-xs">
                  Övningen innehåller {totalExercises} frågor. Läs varje fråga noga innan du svarar!
                </p>
              </div>
            )}

            <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-3 sm:pt-4">
              <button
                onClick={() => setPhase("exercises")}
                className="btn-primary bg-blue-500 hover:bg-blue-600 w-full sm:w-auto justify-center"
              >
                Börja övningen →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Exercise phase ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="card min-h-[260px] sm:min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              {currentIndex + 1} / {totalExercises}
            </span>
            {currentExercise && (
              <span className="badge bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs">
                {currentExercise.type === "multiple-choice"
                  ? "🔘 Flerval"
                  : currentExercise.type === "fill-in-blank"
                  ? "✏️ Fyll i"
                  : "🔤 Bygg mening"}
              </span>
            )}
          </div>

          {currentExercise && (
            <div key={`${moduleId}-${currentIndex}`}>
              {currentExercise.type === "multiple-choice" && (
                <MultipleChoice
                  exercise={currentExercise}
                  onAnswer={handleAnswer}
                  isLast={currentIndex + 1 === totalExercises}
                />
              )}
              {currentExercise.type === "fill-in-blank" && (
                <FillInBlank
                  exercise={currentExercise}
                  onAnswer={handleAnswer}
                  isLast={currentIndex + 1 === totalExercises}
                />
              )}
              {currentExercise.type === "build-sentence" && (
                <BuildSentence
                  exercise={currentExercise}
                  onAnswer={handleAnswer}
                  isLast={currentIndex + 1 === totalExercises}
                />
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>✓ {results.filter(Boolean).length} rätt</span>
          <span>✗ {results.filter((r) => !r).length} fel</span>
          <span className="text-amber-600 dark:text-amber-400">⭐ {earnedPoints} poäng</span>
        </div>
      </main>

      {showResult && (
        <ResultModal
          points={earnedPoints}
          bonusPoints={mod.bonusPoints}
          totalCorrect={totalCorrect}
          totalQuestions={totalExercises}
          chestEarned={chestEarned}
          bossUnlocked={bossJustUnlocked}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}

      {!showResult && mysteryBox && (
        <MysteryBoxPopup reward={mysteryBox} onClose={handleMysteryClose} />
      )}
    </div>
  );
}
