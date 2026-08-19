import React, { createContext, useContext, useState } from 'react';
import { AppView, Area, Chapter, ChapterProgress, ExerciseSessionResult } from '../types';
import { getChapterProgress, saveChapterProgress, calcStars, addStats } from '../utils/storage';
// Importeras från areaMeta (inte areas) så att kapiteldata inte hamnar i
// startpaketet – vyerna som behöver innehållet laddas separat.
import { AREAS } from '../data/areaMeta';

export type StudyTab = 'concepts' | 'key-points' | 'cause-effect' | 'word-search' | 'test' | 'flashcards' | 'sant-falskt' | 'matcha' | 'tidslinje';

interface AppContextValue {
  currentView: AppView;
  selectedGrade: number | null;
  selectedArea: Area | null;
  selectedChapter: Chapter | null;
  exitTicketChapter: Chapter | null;
  lastResult: ExerciseSessionResult | null;
  studyInitialTab: StudyTab;

  setView: (view: AppView) => void;
  selectGrade: (grade: number) => void;
  selectArea: (area: Area) => void;
  selectChapter: (chapter: Chapter) => void;
  openChapterStudy: (chapter: Chapter, tab?: StudyTab) => void;
  startExitTicket: (chapter: Chapter) => void;
  /** Vy som Snabbkoll ska återvända till (den vy den startades från). */
  exitTicketReturnView: AppView;
  submitChapterResult: (chapterId: string, correctAnswers: number, totalQuestions: number) => ExerciseSessionResult;
  getChapterProgressFor: (chapterId: string) => ChapterProgress | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('grade-select');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [exitTicketChapter, setExitTicketChapter] = useState<Chapter | null>(null);
  const [exitTicketReturnView, setExitTicketReturnView] = useState<AppView>('chapter-map');
  const [lastResult, setLastResult] = useState<ExerciseSessionResult | null>(null);
  const [studyInitialTab, setStudyInitialTab] = useState<StudyTab>('concepts');

  function setView(view: AppView) { setCurrentView(view); }

  function selectGrade(grade: number) {
    setSelectedGrade(grade);
    setCurrentView('area-select');
  }

  function selectArea(area: Area) {
    setSelectedArea(area);
    setCurrentView('chapter-map');
  }

  /**
   * Synkar årskurs och område med kapitlet som öppnas. Utan detta kan eleven hamna
   * i ett kapitel från en annan årskurs (t.ex. via sökningen) och sedan möta en
   * kapitelkarta där kapitlet hen just läste inte finns.
   */
  function syncContextTo(chapter: Chapter) {
    setSelectedChapter(chapter);
    if (chapter.grade) setSelectedGrade(Number(chapter.grade));
    const area = AREAS.find(a => a.id === chapter.areaId);
    if (area) setSelectedArea(area);
  }

  function openChapterStudy(chapter: Chapter, tab: StudyTab = 'concepts') {
    syncContextTo(chapter);
    setStudyInitialTab(tab);
    // Kapitel utan sammanfattning går direkt till övningarna – men bara om det
    // finns några, annars skulle övningsvyn krascha på en tom lista.
    if (chapter.summary) setCurrentView('chapter-study');
    else if (chapter.exercises.length > 0) setCurrentView('chapter-exercise');
    else setCurrentView('chapter-map');
  }

  function selectChapter(chapter: Chapter) {
    syncContextTo(chapter);
    if (chapter.exercises.length > 0) setCurrentView('chapter-exercise');
    else if (chapter.summary) setCurrentView('chapter-study');
    else setCurrentView('chapter-map');
  }

  function startExitTicket(chapter: Chapter) {
    if (chapter.exercises.length === 0) return;
    syncContextTo(chapter);
    setExitTicketChapter(chapter);
    setExitTicketReturnView(currentView === 'exit-ticket' ? 'chapter-map' : currentView);
    setCurrentView('exit-ticket');
  }

  function getChapterProgressFor(chapterId: string) {
    return getChapterProgress(chapterId);
  }

  function submitChapterResult(
    chapterId: string,
    correctAnswers: number,
    totalQuestions: number,
  ): ExerciseSessionResult {
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
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
      currentView, selectedGrade, selectedArea, selectedChapter, exitTicketChapter,
      exitTicketReturnView, lastResult, studyInitialTab,
      setView, selectGrade, selectArea, selectChapter, openChapterStudy, startExitTicket,
      submitChapterResult, getChapterProgressFor,
    }}>
      {children}
    </AppContext.Provider>
  );
}
