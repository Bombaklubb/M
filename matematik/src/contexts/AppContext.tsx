import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Student, AppView, Topic, MattChest, MysteryBoxReward,

} from '../types';
import {
  getCurrentStudent, setCurrentStudent, getProgress,
  getPoints, initPoints, getAchievements, addPoints,
  grantAchievement, saveTopicProgress, calcStars,
  recordTopicSession, saveStudent,
} from '../utils/storage';
import {
  loadGamification, saveGamification,
  chestsEarnedFromPoints, chestsEarnedFromExercises,
  chestsEarnedFromTopicEvent,
  rollMysteryBox, BOSS_UNLOCK_THRESHOLD,
} from '../utils/chestStorage';
import { ACHIEVEMENTS } from '../data/achievements';
import { TOPICS } from '../data/topics';
import { WORLDS, WorldId } from '../data/worlds';

export type ExtendedView =
  | AppView
  | 'world-dino' | 'world-fantasy' | 'world-scifi' | 'world-gym'
  | 'quick-drill' | 'error-bank' | 'quest' | 'collection' | 'my-page'
  | 'sluttest' | 'kistor';

interface AppContextValue {
  currentStudent: Student | null;
  currentView: ExtendedView;
  selectedTopic: Topic | null;
  isTeacher: boolean;
  sluttestWorldId: WorldId | null;
  questWorldId: WorldId | null;
  pendingChestResult: { newChests: MattChest[]; mysteryReward: MysteryBoxReward | null } | null;
  clearPendingChestResult: () => void;
  login: (student: Student) => void;
  logout: () => void;
  setView: (view: ExtendedView) => void;
  selectTopic: (topic: Topic) => void;
  setTeacher: (val: boolean) => void;
  startSluttest: (worldId: WorldId) => void;
  startQuest: (worldId: WorldId) => void;
  getStudentStats: (student: Student) => any;
  submitTopicResult: (topicId: string, correct: number, total: number, timeSpent: number) => { newAchievements: string[]; pointsGained: number; newChests: MattChest[]; mysteryReward: MysteryBoxReward | null };
  updateAvatar: (avatarIndex: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentStudent, setCurrentStudentState] = useState<Student | null>(getCurrentStudent);
  const [currentView, setCurrentView] = useState<ExtendedView>(getCurrentStudent() ? 'dashboard' : 'login');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isTeacher, setIsTeacherState] = useState(false);
  const [sluttestWorldId, setSluttestWorldId] = useState<WorldId | null>(null);
  const [questWorldId, setQuestWorldId] = useState<WorldId | null>(null);
  const [pendingChestResult, setPendingChestResult] = useState<{ newChests: MattChest[]; mysteryReward: MysteryBoxReward | null } | null>(null);

  const login = useCallback((student: Student) => {
    setCurrentStudent(student);
    setCurrentStudentState(student);
    initPoints(student.id);
    setCurrentView('dashboard');
  }, []);

  const logout = useCallback(() => {
    setCurrentStudent(null);
    setCurrentStudentState(null);
    setCurrentView('login');
    setIsTeacherState(false);
  }, []);

  const setView = useCallback((view: ExtendedView) => setCurrentView(view), []);

  const selectTopic = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('topic-instruction');
  }, []);

  const setTeacher = useCallback((val: boolean) => {
    setIsTeacherState(val);
    setCurrentView(val ? 'teacher' : 'dashboard');
  }, []);

  const startSluttest = useCallback((worldId: WorldId) => {
    setSluttestWorldId(worldId);
    setCurrentView('sluttest');
  }, []);

  const startQuest = useCallback((worldId: WorldId) => {
    setQuestWorldId(worldId);
    setCurrentView('quest');
  }, []);

  const getStudentStats = useCallback((student: Student) => {
    const progress = getProgress(student.id);
    const points = getPoints(student.id) ?? initPoints(student.id);
    const achievements = getAchievements(student.id);
    const totalCorrect = progress.reduce((s, p) => s + p.correctAnswers, 0);
    const totalAnswered = progress.reduce((s, p) => s + p.totalQuestions, 0);
    const completedTopics = progress.filter(p => p.completed).length;
    return {
      student, points, progress, achievements, totalCorrect, totalAnswered,
      completedTopics, totalTopics: TOPICS.length,
      daysActive: Math.max(1, Math.round((new Date(points.lastActiveDate||student.createdAt).getTime() - new Date(student.createdAt).getTime()) / 86400000) + 1),
    };
  }, []);

  const clearPendingChestResult = useCallback(() => setPendingChestResult(null), []);

  const updateAvatar = useCallback((avatarIndex: number) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, avatar: avatarIndex };
    saveStudent(updated);
    setCurrentStudent(updated);
    setCurrentStudentState(updated);
  }, [currentStudent]);

  const submitTopicResult = useCallback((topicId: string, correct: number, total: number, timeSpent: number) => {
    if (!currentStudent) return { newAchievements: [], pointsGained: 0, newChests: [], mysteryReward: null };
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = calcStars(score);
    const basePoints = correct * 10 + (stars === 3 ? 30 : stars === 2 ? 15 : 0);
    saveTopicProgress(currentStudent.id, { topicId, completed: score >= 50, bestScore: score, totalAttempts: 1, correctAnswers: correct, totalQuestions: total, lastAttempt: new Date().toISOString(), stars, timeSpent });
    recordTopicSession(currentStudent.id, topicId, correct, total);

    // Track points before adding to detect milestones
    const prevPoints = getPoints(currentStudent.id)?.total ?? 0;
    addPoints(currentStudent.id, basePoints);
    const newPoints = prevPoints + basePoints;

    // Achievements
    const stats = getStudentStats(currentStudent);
    const alreadyEarned = new Set(getAchievements(currentStudent.id).map(a => a.achievementId));
    const newAchievements: string[] = [];
    for (const ach of ACHIEVEMENTS) {
      if (!alreadyEarned.has(ach.id) && ach.condition(stats)) {
        grantAchievement(currentStudent.id, ach.id);
        newAchievements.push(ach.id);
      }
    }

    // Chest gamification
    const gam = loadGamification(currentStudent.id);
    const prevExercises = gam.exercisesCompleted;
    const newExercises = prevExercises + 1;

    const pointChests = chestsEarnedFromPoints(prevPoints, newPoints, gam.pointsMilestonesRewarded);
    const exerciseChests = chestsEarnedFromExercises(prevExercises, newExercises, gam.exerciseMilestonesRewarded);

    // Topic / world completion chests
    const progressAfter = getProgress(currentStudent.id);
    const worldForTopic = WORLDS.find(w => w.topicIds.includes(topicId));
    const allWorldTopicsCompleted = worldForTopic
      ? TOPICS.filter(t => worldForTopic.topicIds.includes(t.id))
          .every(t => progressAfter.some(p => p.topicId === t.id && p.completed))
      : false;
    const topicEventResult = chestsEarnedFromTopicEvent({
      topicId,
      worldId: worldForTopic?.id ?? null,
      score,
      stars,
      allWorldTopicsCompleted,
      gam,
    });

    const allNewChests = [
      ...pointChests,
      ...exerciseChests,
      ...topicEventResult.chests.map(c => ({ chest: c })),
    ];

    const mysteryReward = rollMysteryBox(gam.badges, prevExercises);
    let updatedBadges = [...gam.badges];
    let mysteryChest: MattChest | null = null;

    if (mysteryReward) {
      if (mysteryReward.type === 'badge' && mysteryReward.badgeId && !updatedBadges.includes(mysteryReward.badgeId)) {
        updatedBadges.push(mysteryReward.badgeId);
      } else if (mysteryReward.type === 'chest' && mysteryReward.chestType) {
        mysteryChest = {
          id: `chest_${Date.now()}_mystery`,
          type: mysteryReward.chestType,
          earnedAt: new Date().toISOString(),
          opened: false,
        };
      } else if (mysteryReward.type === 'points' && mysteryReward.points) {
        addPoints(currentStudent.id, mysteryReward.points);
      }
    }

    const updatedGam = {
      ...gam,
      chests: [
        ...gam.chests,
        ...allNewChests.map(c => c.chest),
        ...(mysteryChest ? [mysteryChest] : []),
      ],
      badges: updatedBadges,
      exercisesCompleted: newExercises,
      bossUnlocked: gam.bossUnlocked || newExercises >= BOSS_UNLOCK_THRESHOLD,
      pointsMilestonesRewarded: [
        ...gam.pointsMilestonesRewarded,
        ...pointChests.map(c => c.milestone),
      ],
      exerciseMilestonesRewarded: [
        ...gam.exerciseMilestonesRewarded,
        ...exerciseChests.map(c => c.milestone),
      ],
      topicCompletionChestsRewarded: topicEventResult.topicCompletionChestsRewarded,
      topic3StarChestsRewarded: topicEventResult.topic3StarChestsRewarded,
      topicPerfectChestsRewarded: topicEventResult.topicPerfectChestsRewarded,
      worldCompletionChestsRewarded: topicEventResult.worldCompletionChestsRewarded,
    };
    saveGamification(currentStudent.id, updatedGam);

    const chestResult = {
      newChests: allNewChests.map(c => c.chest),
      mysteryReward,
    };
    setPendingChestResult(chestResult);

    return {
      newAchievements,
      pointsGained: basePoints,
      ...chestResult,
    };
  }, [currentStudent, getStudentStats]);

  return (
    <AppContext.Provider value={{ currentStudent, currentView, selectedTopic, isTeacher, sluttestWorldId, questWorldId, pendingChestResult, clearPendingChestResult, login, logout, setView, selectTopic, setTeacher, startSluttest, startQuest, getStudentStats, submitTopicResult, updateAvatar }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
