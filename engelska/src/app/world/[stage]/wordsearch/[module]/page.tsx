"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import ResultModal from "@/components/ui/ResultModal";
import WordSearch from "@/components/exercises/WordSearch";
import MysteryBoxPopup from "@/components/ui/MysteryBoxPopup";
import { loadStudent, saveModuleProgress, loadGamification, getModuleProgress, getRepeatMultiplier } from "@/lib/storage";
import { rollLuckyBonus, type LuckyBonus } from "@/lib/luckyBonus";
import { getBossGate, completedModulesInStage, bossWinsInStage } from "@/lib/gamification";
import { applyChapterRewards } from "@/lib/chapterRewards";
import { getStage } from "@/lib/stages";
import type { StudentData, StageContent, WordSearchModule, ChestType, StageId, MysteryBoxReward } from "@/lib/types";

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
  const [modalPoints, setModalPoints] = useState(0);
  const [modalLucky, setModalLucky] = useState<LuckyBonus | null>(null);
  const [chestEarned, setChestEarned] = useState<ChestType | undefined>();
  const [bossJustUnlocked, setBossJustUnlocked] = useState(false);
  const [mysteryBox, setMysteryBox] = useState<MysteryBoxReward | null>(null);
  const [attemptNum, setAttemptNum] = useState(1);

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
    const rawPts = mod!.bonusPoints + 50;
    if (student) {
      const existingProgress = getModuleProgress(student, stage!.id, "wordsearch", mod!.id);
      const priorAttempts = existingProgress?.attempts ?? 0;
      const repeatMult = getRepeatMultiplier(priorAttempts);
      const adjustedPts = Math.round(rawPts * repeatMult);
      // Turbonus: sällsynt slumpbonus (×2/×3) på det som tjänades in nu
      const luck = rollLuckyBonus(student.name, adjustedPts);
      setModalLucky(luck);
      // Turbonus får aldrig lyfta ett omgjort försök över förstaförsökets värde.
      const totalWithLuck = Math.min(adjustedPts + (luck?.extra ?? 0), rawPts);
      setModalPoints(adjustedPts);
      setAttemptNum(priorAttempts + 1);

      // Läget före sparningen: saveModuleProgress ändrar eleven.
      const stageKey = stage!.id as StageId;
      const before = {
        totalPoints: student.totalPoints,
        bossGateOpen: getBossGate(completedModulesInStage(student, stageKey), bossWinsInStage(loadGamification(), stageKey)).unlocked,
      };
      const wasAlreadyCompleted = existingProgress?.completed ?? false;
      const updated = saveModuleProgress(student, stage!.id, "wordsearch", mod!.id, totalWithLuck, true);
      // Kistor, mysterielåda och bossmeddelande – samma regler som övriga kapitel.
      const rewards = applyChapterRewards({ before, updated, stageId: stageKey, wasAlreadyCompleted });
      setStudent(rewards.student);
      setChestEarned(rewards.chest);
      setBossJustUnlocked(rewards.bossJustUnlocked);
      if (rewards.mystery) setMysteryBox(rewards.mystery);
    }
    setShowResult(true);
  }

  function handleMysteryClose() {
    setMysteryBox(null);
    router.push(`/world/${stageId}?tab=wordsearch`);
  }

  function handleRetry() {
    setShowResult(false);
  }

  function handleContinue() {
    // Har eleven fått en mysterielåda visas den först; den leder sedan vidare.
    if (mysteryBox) setShowResult(false);
    else router.push(`/world/${stageId}?tab=wordsearch`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header student={student} />

      <div className={`${stage.bgClass} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link prefetch={false}
            href={`/world/${stageId}?tab=wordsearch`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors py-3 -my-1"
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
          points={modalPoints}
          bonusPoints={0}
          totalCorrect={mod.words.length}
          totalQuestions={mod.words.length}
          repeatAttemptNumber={attemptNum}
          lucky={modalLucky}
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
