import React, { createContext, useContext, useState } from 'react';
import { AppView, Subject, Chapter, ExerciseSessionResult } from '../types';
import { getProgress, getChapterProgress, saveChapterProgress, calcStars, addStats } from '../utils/storage';
import { getChaptersForSubject, ALL_CHAPTERS } from '../data/subjects';

type StudyTab = 'concepts' | 'key-points' | 'cause-effect' | 'word-search' | 'test' | 'questions';

interface AppContextValue {
  currentView: AppView;
  selectedSubject: Subject | null;
  selectedChapter: Chapter | null;
  exitTicketChapter: Chapter | null;
  lastResult: ExerciseSessionResult | null;
  studyInitialTab: StudyTab;

  setView: (view: AppView) => void;
  selectSubject: (subject: Subject) => void;
  selectChapter: (chapter: Chapter) => void;
  openChapterStudy: (chapter: Chapter, tab?: StudyTab) => void;
  startExitTicket: (chapter: Chapter) => void;
  submitChapterResult: (chapterId: string, correctAnswers: number, totalQuestions: number) => ExerciseSessionResult;
  isChapterUnlocked: (chapterId: string) => boolean;
  getChapterProgressFor: (chapterId: string) => import('../types').ChapterProgress | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('subject-select');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [exitTicketChapter, setExitTicketChapter] = useState<Chapter | null>(null);
  const [lastResult, setLastResult] = useState<ExerciseSessionResult | null>(null);
  const [studyInitialTab, setStudyInitialTab] = useState<StudyTab>('concepts');

  function setView(view: AppView) { setCurrentView(view); }

  function selectSubject(subject: Subject) {
    setSelectedSubject(subject);
    setCurrentView('chapter-map');
  }

  function openChapterStudy(chapter: Chapter, tab: StudyTab = 'concepts') {
    setSelectedChapter(chapter);
    setStudyInitialTab(tab);
    if (chapter.summary) {
      setCurrentView('chapter-study');
    } else {
      setCurrentView('chapter-exercise');
    }
  }

  function selectChapter(chapter: Chapter) {
    setSelectedChapter(chapter);
    setCurrentView('chapter-exercise');
  }

  function startExitTicket(chapter: Chapter) {
    setExitTicketChapter(chapter);
    setCurrentView('exit-ticket');
  }

  function isChapterUnlocked(_chapterId: string): boolean {
    return true;
  }

  function getChapterProgressFor(chapterId: string) {
    return getChapterProgress(chapterId);
  }

  function submitChapterResult(
    chapterId: string,
    correctAnswers: number,
    totalQuestions: number,
  ): ExerciseSessionResult {
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const stars = calcStars(score);
    const existing = getChapterProgress(chapterId);
    const isNewBest = !existing || score > existing.bestScore;

    saveChapterProgress({
      chapterId,
      completed: stars >= 1,
      bestScore: score,
      stars,
      totalAttempts: 1,
    });
    addStats(correctAnswers, totalQuestions);

    const result: ExerciseSessionResult = { chapterId, correctAnswers, totalQuestions, score, stars, isNewBest };
    setLastResult(result);
    setCurrentView('chapter-result');
    return result;
  }

  return (
    <AppContext.Provider value={{
      currentView, selectedSubject, selectedChapter, exitTicketChapter, lastResult, studyInitialTab,
      setView, selectSubject, selectChapter, openChapterStudy, startExitTicket,
      submitChapterResult, isChapterUnlocked, getChapterProgressFor,
    }}>
      {children}
    </AppContext.Provider>
  );
}
