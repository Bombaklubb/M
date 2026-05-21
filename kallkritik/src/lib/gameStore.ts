import { useState, useCallback } from 'react';
import { GameState } from '@/types';
import { xpToLevel } from './utils';

const STORAGE_KEY = 'kallkritik_game_state';

const DEFAULT_STATE: GameState = {
  xp: 0,
  level: 1,
  completedModules: [],
  badges: [],
  streak: 0,
  lastPlayedDate: '',
  moduleHighScores: {},
};

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useGameStore() {
  const [state, setState] = useState<GameState>(() => loadState());

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = xpToLevel(newXP);
      const next: GameState = { ...prev, xp: newXP, level: newLevel };
      saveState(next);
      return next;
    });
  }, []);

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
      saveState(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const next = { ...DEFAULT_STATE };
    saveState(next);
    setState(next);
  }, []);

  return { state, addXP, completeModule, resetProgress };
}
