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

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = xpToLevel(newXP);
      const next: GameState = { ...prev, xp: newXP, level: newLevel };
      saveState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const completeModule = useCallback((moduleId: number, score: number, badgeName?: string) => {
    setState(prev => {
      const today = new Date().toISOString().split('T')[0];
      const alreadyCompletedToday = prev.lastPlayedDate === today;
      const newStreak = alreadyCompletedToday
        ? prev.streak
        : prev.lastPlayedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
          ? prev.streak + 1
          : 1;

      const updatedBadges = badgeName && !prev.badges.includes(badgeName)
        ? [...prev.badges, badgeName]
        : prev.badges;

      const updatedModules = prev.completedModules.includes(moduleId)
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

  return { state, addXP, completeModule, resetProgress };
}
