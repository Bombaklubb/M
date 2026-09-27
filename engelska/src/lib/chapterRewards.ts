import type { StudentData, ChestType, StageId, MysteryBoxReward, Chest } from "./types";
import {
  chestsEarnedFromPoints,
  chestsEarnedFromExercises,
  rollMysteryBox,
  checkAchievementBadges,
  getBossGate,
  completedModulesInStage,
  bossWinsInStage,
} from "./gamification";
import { loadGamification, saveGamification, addBonusPoints } from "./storage";

export interface ChapterRewards {
  /** Eleven efter eventuella poäng ur mysterielådan. */
  student: StudentData;
  /** Första nya kistan, för resultatrutan. */
  chest?: ChestType;
  /** Sant om just det här kapitlet öppnade världens bosstrid. */
  bossJustUnlocked: boolean;
  mystery: MysteryBoxReward | null;
}

/**
 * Kistor, mysterielåda, märken och bossmeddelande efter ett klarat kapitel.
 *
 * Samma regler som grammatik-, stavnings- och spelkapitlen använder. Ordsökningen
 * saknade dem helt: en klarad ordsökning räknades för bosslåset och spellåset men
 * gav varken kistor för antal kapitel, kistor för poänggränser eller någon chans
 * till mysterielådan.
 *
 * `before` är eleven innan kapitlet sparades och `updated` efter.
 */
export function applyChapterRewards(opts: {
  before: { totalPoints: number; bossGateOpen: boolean };
  updated: StudentData;
  stageId: StageId;
  wasAlreadyCompleted: boolean;
}): ChapterRewards {
  const { before, updated, stageId, wasAlreadyCompleted } = opts;
  const gam = loadGamification();
  const prevExercises = gam.exercisesCompleted;
  const newExercises = wasAlreadyCompleted ? prevExercises : prevExercises + 1;

  const pointChests = chestsEarnedFromPoints(
    before.totalPoints, updated.totalPoints, gam.pointsMilestonesRewarded, gam.chests
  );
  // Ett kapitel som redan var klart räknas inte en gång till.
  const exChests = wasAlreadyCompleted
    ? []
    : chestsEarnedFromExercises(prevExercises, newExercises, gam.exerciseMilestonesRewarded, gam.chests);
  const newChests: Chest[] = [...pointChests.map((c) => c.chest), ...exChests.map((c) => c.chest)];

  const mystery = wasAlreadyCompleted ? null : rollMysteryBox(gam.badges, newExercises, gam.chests);
  const mysteryChest: Chest[] =
    mystery?.type === "chest" && mystery.chestType
      ? [{ id: `chest_m_${Date.now()}`, type: mystery.chestType, earnedAt: new Date().toISOString(), opened: false }]
      : [];
  const badges = [...gam.badges];
  if (mystery && !badges.includes("mystery_hunter")) badges.push("mystery_hunter");
  if (mystery?.type === "badge" && mystery.badgeId && !badges.includes(mystery.badgeId)) badges.push(mystery.badgeId);

  const newGam = {
    ...gam,
    chests: [...gam.chests, ...newChests, ...mysteryChest],
    badges,
    exercisesCompleted: newExercises,
    pointsMilestonesRewarded: [...gam.pointsMilestonesRewarded, ...pointChests.map((c) => c.milestone)],
    exerciseMilestonesRewarded: [...gam.exerciseMilestonesRewarded, ...exChests.map((c) => c.milestone)],
  };
  const achievementBadges = checkAchievementBadges(updated, newGam);
  if (achievementBadges.length > 0) newGam.badges = [...newGam.badges, ...achievementBadges];
  saveGamification(newGam);

  const mysteryPoints = mystery?.type === "points" && mystery.points ? mystery.points : 0;
  const student = mysteryPoints > 0 ? addBonusPoints(updated, mysteryPoints) : updated;

  const bossGateOpen = getBossGate(
    completedModulesInStage(student, stageId),
    bossWinsInStage(newGam, stageId)
  ).unlocked;

  return {
    student,
    chest: newChests[0]?.type,
    bossJustUnlocked: bossGateOpen && !before.bossGateOpen,
    mystery,
  };
}
