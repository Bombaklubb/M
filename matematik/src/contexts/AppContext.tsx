import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Student, AppView, Topic, StudentStats, PointsRecord,
  TopicProgress, EarnedAchievement, LEVEL_THRESHOLDS,
} from '../types';
import {
  getCurrentStudent, setCurrentStudent, getProgress,
  getPoints, initPoints, getAchievements, addPoints,
  grantAchievement, saveTopicProgress, calcStars,
  recordTopicSession,
} from '../utils/storage';
import { ACHIEVEMENTS } from '../data/achievements';
import { TOPICS } from '../data/topics';

interface AppContextValue {
  currentStudent: Student | null;
  currentView: AppView;
  selectedTopic: Topic | null;
  isTeacher: boolean;

  login: (student: Student) => void;
  logout: () => void;
  setView: (view: AppView) => void;
  selectTopic: (topic: Topic) => void;
  setTeacher: (val: boolean) => void;

  getStudentStats: (student: Student) => StudentStats;
  submitTopicResult: (
    topicId: string,
    correct: number,
    total: number,
    timeSpent: number
  ) => { newAchievements: string[]; pointsGained: number };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentStudent, setCurrentStudentState] = useState<Student | null>(
    getCurrentStudent
  );
  const [currentView, setCurrentView] = useState<AppView>(
    getCurrentStudent() ? 'dashboard' : 'login'
  );
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isTeacher, setIsTeacherState] = useState(false);

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

  const setView = useCallback((view: AppView) => {
    setCurrentView(view);
  }, []);

  const selectTopic = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('topic-instruction');
  }, []);

  const setTeacher = useCallback((val: boolean) => {
    setIsTeacherState(val);
    if (val) setCurrentView('teacher');
    else setCurrentView('dashboard');
  }, []);

  const getStudentStats = useCallback((student: Student): StudentStats => {
    const progress = getProgress(student.id);
    const points = getPoints(student.id) ?? initPoints(student.id);
    const achievements = getAchievements(student.id);
    const totalCorrect = progress.reduce((s, p) => s + p.correctAnswers, 0);
    const totalAnswered = progress.reduce((s, p) => s + p.totalQuestions, 0);
    const completedTopics = progress.filter(p => p.completed).length;

    return {
      student,
      points,
      progress,
      achievements,
      totalCorrect,
      totalAnswered,
      completedTopics,
      totalTopics: TOPICS.length,
      daysActive: calcDaysActive(student.createdAt, points.lastActiveDate),
    };
  }, []);

  const submitTopicResult = useCallback((
    topicId: string,
    correct: number,
    total: number,
    timeSpent: number
  ) => {
    if (!currentStudent) return { newAchievements: [], pointsGained: 0 };

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = calcStars(score);
    const basePoints = correct * 10 + (stars === 3 ? 30 : stars === 2 ? 15 : 0);

    // Save progress
    const progress: TopicProgress = {
      topicId,
      completed: score >= 50,
      bestScore: score,
      totalAttempts: 1,
      correctAnswers: correct,
      totalQuestions: total,
      lastAttempt: new Date().toISOString(),
      stars,
      timeSpent,
    };
    saveTopicProgress(currentStudent.id, progress);
    recordTopicSession(currentStudent.id, topicId, correct, total);

    // Add points
    const pointsRecord = addPoints(currentStudent.id, basePoints);

    // Check achievements
    const stats = getStudentStats(currentStudent);
    const alreadyEarned = new Set(getAchievements(currentStudent.id).map(a => a.achievementId));
    const newAchievements: string[] = [];

    for (const ach of ACHIEVEMENTS) {
      if (!alreadyEarned.has(ach.id) && ach.condition(stats)) {
        grantAchievement(currentStudent.id, ach.id);
        newAchievements.push(ach.id);
      }
    }

    return { newAchievements, pointsGained: basePoints };
  }, [currentStudent, getStudentStats]);

  return (
    <AppContext.Provider value={{
      currentStudent,
      currentView,
      selectedTopic,
      isTeacher,
      login,
      logout,
      setView,
      selectTopic,
      setTeacher,
      getStudentStats,
      submitTopicResult,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function calcDaysActive(createdAt: string, lastActiveDate: string): number {
  if (!lastActiveDate) return 0;
  const start = new Date(createdAt).getTime();
  const last = new Date(lastActiveDate).getTime();
  return Math.max(1, Math.round((last - start) / 86400000) + 1);
}
