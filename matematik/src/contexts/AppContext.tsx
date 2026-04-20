import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  Student, AppView, Topic, MattChest, MysteryBoxReward,

} from '../types';
import {
  getCurrentStudent, setCurrentStudent, getProgress,
  getPoints, initPoints, getAchievements, addPoints,
  grantAchievement, saveTopicProgress, calcStars,
  recordTopicSession, saveStudent, addAppMinutes,
} from '../utils/storage';
import { trackVisit, trackSessionEnd, trackHeartbeat } from '../utils/analytics';
import {
  loadGamification, saveGamification,
  chestsEarnedFromPoints, chestsEarnedFromExercises,
  chestsEarnedFromTopicEvent,
  rollMysteryBox, BOSS_UNLOCK_THRESHOLD, MAX_CHESTS_PER_TYPE,
} from '../utils/chestStorage';
import { ACHIEVEMENTS } from '../data/achievements';
import { TOPICS } from '../data/topics';
import { WORLDS, WorldId } from '../data/worlds';

export type ExtendedView =
  | AppView
  | 'world-dino' | 'world-fantasy' | 'world-scifi' | 'world-gym'
  | 'quick-drill' | 'error-bank' | 'quest' | 'collection' | 'my-page'
  | 'sluttest' | 'kistor'
  | 'games' | 'game-quick-answer' | 'game-boss-battle' | 'game-time-attack' | 'game-collect-coins'
  | 'game-memory' | 'game-hangman';

interface AppContextValue {
  currentStudent: Student | null;
  currentView: ExtendedView;
  selectedTopic: Topic | null;
  isTeacher: boolean;
  sluttestWorldId: WorldId | null;
  questWorldId: WorldId | null;
  gameWorldId: WorldId | null;
  errorBankWorldId: WorldId | null;
  pendingChestResult: { newChests: MattChest[]; mysteryReward: MysteryBoxReward | null; wasAlreadyCompleted: boolean } | null;
  clearPendingChestResult: () => void;
  login: (student: Student) => void;
  logout: () => void;
  setView: (view: ExtendedView) => void;
  selectTopic: (topic: Topic) => void;
  setTeacher: (val: boolean) => void;
  startSluttest: (worldId: WorldId) => void;
  startQuest: (worldId: WorldId) => void;
  startGames: (worldId: WorldId) => void;
  startErrorBank: (worldId: WorldId) => void;
  getStudentStats: (student: Student) => any;
  submitTopicResult: (topicId: string, correct: number, total: number, timeSpent: number) => { newAchievements: string[]; pointsGained: number; newChests: MattChest[]; mysteryReward: MysteryBoxReward | null; wasAlreadyCompleted: boolean };
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
  const [gameWorldId, setGameWorldId] = useState<WorldId | null>(null);
  const [errorBankWorldId, setErrorBankWorldId] = useState<WorldId | null>(null);
  const [pendingChestResult, setPendingChestResult] = useState<{ newChests: MattChest[]; mysteryReward: MysteryBoxReward | null; wasAlreadyCompleted: boolean } | null>(null);

  const sessionStartRef = useRef<number | null>(null);

  const login = useCallback((student: Student) => {
    setCurrentStudent(student);
    setCurrentStudentState(student);
    initPoints(student.id);
    const now = Date.now();
    sessionStorage.setItem('math_session_start', now.toString());
    sessionStartRef.current = now;
    trackVisit();
    setCurrentView('dashboard');
  }, []);

  const logout = useCallback(() => {
    const start = sessionStorage.getItem('math_session_start');
    if (start && currentStudent) {
      const elapsed = Date.now() - parseInt(start);
      const mins = Math.floor(elapsed / 60000);
      addAppMinutes(currentStudent.id, mins);
      trackSessionEnd(Math.floor(elapsed / 1000));
    }
    sessionStorage.removeItem('math_session_start');
    sessionStartRef.current = null;
    setCurrentStudent(null);
    setCurrentStudentState(null);
    setCurrentView('login');
    setIsTeacherState(false);
  }, [currentStudent]);

  // Heartbeat – skicka var 2:e minut när elev är inloggad
  useEffect(() => {
    if (!currentStudent) return;
    trackHeartbeat(); // direkt vid inloggning
    const interval = setInterval(trackHeartbeat, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentStudent]);

  // Track session end on page close
  useEffect(() => {
    const handleUnload = () => {
      const start = sessionStorage.getItem('math_session_start');
      if (start) {
        const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
        trackSessionEnd(elapsed);
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
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

  const startGames = useCallback((worldId: WorldId) => {
    setGameWorldId(worldId);
    setCurrentView('games');
  }, []);

  const startErrorBank = useCallback((worldId: WorldId) => {
    setErrorBankWorldId(worldId);
    setCurrentView('error-bank');
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
    if (!currentStudent) return { newAchievements: [], pointsGained: 0, newChests: [], mysteryReward: null, wasAlreadyCompleted: false };
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = calcStars(score);
    // Förhindra fusk: inga poäng om ämnet redan är klarat
    const prevProgress = getProgress(currentStudent.id).find(p => p.topicId === topicId);
    const wasAlreadyCompleted = prevProgress?.completed === true;
    const basePoints = wasAlreadyCompleted ? 0 : correct * 10 + (stars === 3 ? 30 : stars === 2 ? 15 : 0);
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
    // Räkna bara upp exercisesCompleted när ett ämne klaras för första gången
    const newExercises = (!wasAlreadyCompleted && score >= 50) ? prevExercises + 1 : prevExercises;

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

    const allNewChestsRaw = [
      ...pointChests,
      ...exerciseChests,
      ...topicEventResult.chests.map(c => ({ chest: c })),
    ];

    // Cap at MAX_CHESTS_PER_TYPE per valör
    const chestCountByType: Record<string, number> = {};
    for (const c of gam.chests) {
      chestCountByType[c.type] = (chestCountByType[c.type] ?? 0) + 1;
    }
    const allNewChests = allNewChestsRaw.filter(item => {
      const t = item.chest.type;
      const count = chestCountByType[t] ?? 0;
      if (count >= MAX_CHESTS_PER_TYPE) return false;
      chestCountByType[t] = count + 1;
      return true;
    });

    const mysteryReward = rollMysteryBox(gam.badges, prevExercises);
    let updatedBadges = [...gam.badges];
    let mysteryChest: MattChest | null = null;

    if (mysteryReward) {
      if (mysteryReward.type === 'badge' && mysteryReward.badgeId && !updatedBadges.includes(mysteryReward.badgeId)) {
        updatedBadges.push(mysteryReward.badgeId);
      } else if (mysteryReward.type === 'chest' && mysteryReward.chestType) {
        const t = mysteryReward.chestType;
        if ((chestCountByType[t] ?? 0) < MAX_CHESTS_PER_TYPE) {
          mysteryChest = {
            id: `chest_${Date.now()}_mystery`,
            type: t,
            earnedAt: new Date().toISOString(),
            opened: false,
          };
        }
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
      wasAlreadyCompleted,
    };
    setPendingChestResult(chestResult);

    return {
      newAchievements,
      pointsGained: basePoints,
      ...chestResult,
    };
  }, [currentStudent, getStudentStats]);

  return (
    <AppContext.Provider value={{ currentStudent, currentView, selectedTopic, isTeacher, sluttestWorldId, questWorldId, gameWorldId, errorBankWorldId, pendingChestResult, clearPendingChestResult, login, logout, setView, selectTopic, setTeacher, startSluttest, startQuest, startGames, startErrorBank, getStudentStats, submitTopicResult, updateAvatar }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
