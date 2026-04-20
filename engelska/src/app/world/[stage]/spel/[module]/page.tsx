"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ResultModal from "@/components/ui/ResultModal";
import CoinGame from "@/components/exercises/CoinGame";
import {
  loadStudent,
  saveModuleProgress,
  loadGamification,
  saveGamification,
  getModuleProgress,
} from "@/lib/storage";
import {
  chestsEarnedFromPoints,
  chestsEarnedFromExercises,
  rollMysteryBox,
  checkAchievementBadges,
  BOSS_UNLOCK_THRESHOLD,
} from "@/lib/gamification";
import MysteryBoxPopup from "@/components/ui/MysteryBoxPopup";
import { getStage } from "@/lib/stages";
import type {
  StudentData,
  StageContent,
  CoinGameModule,
  ChestType,
  MysteryBoxReward,
} from "@/lib/types";

const POINTS_PER_COIN = 10;

interface Props {
  params: Promise<{ stage: string; module: string }>;
}

export default function SpelModulePage({ params }: Props) {
  const { stage: stageId, module: moduleId } = use(params);
  const stage = getStage(stageId);
  const router = useRouter();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [mod, setMod] = useState<CoinGameModule | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<"intro" | "game" | "done">("intro");
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [livesLeft, setLivesLeft] = useState(3);
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
        const found = data.spel?.find((m) => m.id === moduleId);
        if (found) setMod(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [stageId, moduleId]);

  if (!stage) return notFound();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-4xl animate-bounce-slow">🪙</div>
      </div>
    );
  }

  if (!mod) return notFound();

  const totalQuestions = mod.questions.length;

  function handleGameComplete(coins: number, lives: number) {
    setCoinsCollected(coins);
    setLivesLeft(lives);
    setPhase("done");

    const pts = coins * POINTS_PER_COIN;
    const passed = coins / totalQuestions >= 0.6;
    const finalPts = passed ? pts + mod!.bonusPoints : pts;

    if (student) {
      const wasAlreadyCompleted = getModuleProgress(student, stage!.id, "spel", mod!.id)?.completed ?? false;
      const prevPoints = student.totalPoints; // capture BEFORE saveModuleProgress mutates it
      const updated = saveModuleProgress(
        student,
        stage!.id,
        "spel",
        mod!.id,
        finalPts,
        passed
      );
      setStudent(updated);

      const gam = loadGamification();
      const newPoints = updated.totalPoints;
      const prevEx = gam.exercisesCompleted;
      const newEx = wasAlreadyCompleted ? prevEx : prevEx + 1;

      const pointChests = chestsEarnedFromPoints(
        prevPoints,
        newPoints,
        gam.pointsMilestonesRewarded,
        gam.chests
      );
      const exChests = wasAlreadyCompleted ? [] : chestsEarnedFromExercises(
        prevEx,
        newEx,
        gam.exerciseMilestonesRewarded,
        gam.chests
      );
      const allNewChests = [
        ...pointChests.map((c) => c.chest),
        ...exChests.map((c) => c.chest),
      ];
      const firstChest = allNewChests[0];
      const wasBossUnlocked = gam.bossUnlocked;
      const nowBossUnlocked = wasBossUnlocked || newEx >= BOSS_UNLOCK_THRESHOLD;
      const mystery = wasAlreadyCompleted ? null : rollMysteryBox(gam.badges, newEx, gam.chests);
      const extraMysteryChest =
        mystery?.type === "chest" && mystery.chestType
          ? [
              {
                id: `chest_m_${Date.now()}`,
                type: mystery.chestType,
                earnedAt: new Date().toISOString(),
                opened: false,
              } as import("@/lib/types").Chest,
            ]
          : [];
      const mysteryBadge =
        mystery?.type === "badge" && mystery.badgeId ? mystery.badgeId : null;
      const mysteryPoints =
        mystery?.type === "points" && mystery.points ? mystery.points : 0;

      const earlyBadgesSpel = [...gam.badges];
      if (mystery && !earlyBadgesSpel.includes("mystery_hunter")) earlyBadgesSpel.push("mystery_hunter");
      if (mysteryBadge && !earlyBadgesSpel.includes(mysteryBadge)) earlyBadgesSpel.push(mysteryBadge);
      const baseBadgesSpel = earlyBadgesSpel;
      const newGamSpel = {
        ...gam,
        chests: [...gam.chests, ...allNewChests, ...extraMysteryChest],
        badges: baseBadgesSpel,
        exercisesCompleted: newEx,
        bossUnlocked: nowBossUnlocked,
        pointsMilestonesRewarded: [
          ...gam.pointsMilestonesRewarded,
          ...pointChests.map((c) => c.milestone),
        ],
        exerciseMilestonesRewarded: [
          ...gam.exerciseMilestonesRewarded,
          ...exChests.map((c) => c.milestone),
        ],
      };
      const achievementBadgesSpel = checkAchievementBadges(updated, newGamSpel);
      if (achievementBadgesSpel.length > 0) newGamSpel.badges = [...newGamSpel.badges, ...achievementBadgesSpel];
      saveGamification(newGamSpel);

      if (mysteryPoints > 0)
        setStudent({ ...updated, totalPoints: updated.totalPoints + mysteryPoints });
      if (firstChest) setChestEarned(firstChest.type as ChestType);
      if (nowBossUnlocked && !wasBossUnlocked) setBossJustUnlocked(true);
      if (mystery) setMysteryBox(mystery);
    }

    setShowResult(true);
  }

  function handleRetry() {
    setCoinsCollected(0);
    setLivesLeft(3);
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

  const earnedPoints = coinsCollected * POINTS_PER_COIN;

  // ── Intro ──────────────────────────────────────────────────────────────────
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
              <span className="text-2xl">🪙</span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                Hur spelet fungerar
              </h2>
            </div>

            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2.5 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
                <span className="mt-0.5 flex-shrink-0">🪙</span>
                <span>Svara rätt för att samla mynt. Du har {totalQuestions} mynt att samla!</span>
              </li>
              <li className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2.5 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
                <span className="mt-0.5 flex-shrink-0">🛡️</span>
                <span>Du har 3 liv. Varje fel svar kostar ett liv.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2.5 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
                <span className="mt-0.5 flex-shrink-0">🏃</span>
                <span>Din löpare springer framåt för varje rätt svar!</span>
              </li>
            </ul>

            <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-3 sm:pt-4">
              <button
                onClick={() => setPhase("game")}
                className="btn-primary bg-amber-500 hover:bg-amber-600 w-full sm:w-auto justify-center"
              >
                Börja springa! 🏃
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Game ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      <div className={`${stage.bgClass} text-white`}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href={`/world/${stageId}`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
          >
            ← Avsluta
          </Link>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{mod.icon}</span>
              <span className="font-bold text-sm">{mod.title}</span>
            </div>
            <span className="text-amber-300 font-bold text-sm">⭐ {earnedPoints}p</span>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <CoinGame
          key={phase}
          questions={mod.questions}
          onComplete={handleGameComplete}
        />
      </main>

      {showResult && (
        <ResultModal
          points={earnedPoints}
          bonusPoints={mod.bonusPoints}
          totalCorrect={coinsCollected}
          totalQuestions={totalQuestions}
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
