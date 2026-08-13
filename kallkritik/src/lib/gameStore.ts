import { useState, useCallback } from 'react';
import { GameState } from '@/types';
import { xpToLevel } from './utils';
import { storageKeyFor } from './userStore';

const DEFAULT_STATE: GameState = {
  xp: 0,
  level: 1,
  completedModules: [],
  badges: [],
  streak: 0,
  lastPlayedDate: '',
  moduleHighScores: {},
};

function loadState(storageKey: string): GameState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(storageKey: string, state: GameState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// Progress sparas per inloggat namn. Montera om komponenten (key={user})
// vid användarbyte så att useState-initialiseraren läser rätt nyckel.
export function useGameStore(userName: string) {
  const storageKey = storageKeyFor(userName);
  const [state, setState] = useState<GameState>(() => loadState(storageKey));

  // Ett resultat räknas som "klarat" först vid minst 50 % rätt.
  // Utan gränsen delas diplomet ut även till den som svarat fel på allt.
  const PASS_PERCENT = 50;

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = xpToLevel(newXP);
      const next: GameState = { ...prev, xp: newXP, level: newLevel };
      saveState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  // Full XP första gången, kraftigt reducerad vid omspel – annars kan man
  // farma maxnivå genom att spela samma modul om och om igen.
  const awardModuleXP = useCallback((moduleId: number, xpEarned: number) => {
    setState(prev => {
      const alreadyPlayed = prev.moduleHighScores[moduleId] !== undefined;
      const amount = alreadyPlayed ? Math.round(xpEarned * 0.25) : xpEarned;
      const newXP = prev.xp + amount;
      const next: GameState = { ...prev, xp: newXP, level: xpToLevel(newXP) };
      saveState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const completeModule = useCallback((moduleId: number, score: number, badgeName?: string) => {
    setState(prev => {
      // Lokalt datum (sv-SE ger YYYY-MM-DD) – toISOString är UTC och
      // skulle räkna kvällspass efter kl. 22 som gårdagens dag.
      const today = new Date().toLocaleDateString('sv-SE');
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE');
      const alreadyCompletedToday = prev.lastPlayedDate === today;
      const newStreak = alreadyCompletedToday
        ? prev.streak
        : prev.lastPlayedDate === yesterday
          ? prev.streak + 1
          : 1;

      const updatedBadges = badgeName && !prev.badges.includes(badgeName)
        ? [...prev.badges, badgeName]
        : prev.badges;

      const passed = score >= PASS_PERCENT;
      const updatedModules = !passed || prev.completedModules.includes(moduleId)
        ? prev.completedModules
        : [...prev.completedModules, moduleId];

      const oldHigh = prev.moduleHighScores[moduleId] ?? 0;
      const updatedScores = score > oldHigh
        ? { ...prev.moduleHighScores, [moduleId]: score }
        : prev.moduleHighScores;

      const next: GameState = {
        ...prev,
        completedModules: updatedModules,
        badges: updatedBadges,
        streak: newStreak,
        lastPlayedDate: today,
        moduleHighScores: updatedScores,
      };
      saveState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const resetProgress = useCallback(() => {
    const next = { ...DEFAULT_STATE };
    saveState(storageKey, next);
    setState(next);
  }, [storageKey]);

  return { state, addXP, awardModuleXP, completeModule, resetProgress };
}
