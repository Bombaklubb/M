import { useState, useCallback } from 'react';
import { User, TextResult, Badge } from '../types';
import { saveResult, getUserResults } from '../utils/storage';
import { calculateNewLevel, calculatePoints, updateStreak } from '../utils/levelCalculator';
import { checkForNewBadges } from '../utils/badgeSystem';

export const useProgress = (user: User | null, updateUser: (user: User) => void) => {
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  const recordResult = useCallback(
    (
      textTitle: string,
      level: number,
      topic: string,
      correctAnswers: number,
      totalQuestions: number
    ) => {
      if (!user) return;

      const previousLevel = user.currentLevel;
      const newLevel = calculateNewLevel(previousLevel, correctAnswers, totalQuestions);
      const pointsEarned = calculatePoints(level, correctAnswers);

      // Uppdatera streak
      const streakChange = updateStreak(user.lastActivity);
      let newStreak = user.streak;

      if (streakChange === -1) {
        newStreak = 1; // Återställ streak
      } else if (streakChange === 1) {
        newStreak = user.streak + 1; // Öka streak
      }
      // Om streakChange är 0, behåll samma streak (samma dag)

      // Skapa resultat
      const result: TextResult = {
        id: `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: user.id,
        textTitle,
        level,
        topic,
        score: correctAnswers,
        totalQuestions,
        pointsEarned,
        completedAt: new Date().toISOString(),
      };

      saveResult(result);

      // Uppdatera användare
      const updatedUser: User = {
        ...user,
        currentLevel: newLevel,
        totalPoints: user.totalPoints + pointsEarned,
        streak: newStreak,
        lastActivity: new Date().toISOString(),
        completedTexts: user.completedTexts + 1,
      };

      // Kontrollera för nya badges
      const earnedBadges = checkForNewBadges(updatedUser, result, previousLevel);

      if (earnedBadges.length > 0) {
        updatedUser.badges = [...updatedUser.badges, ...earnedBadges];
        setNewBadges(earnedBadges);
      }

      updateUser(updatedUser);

      return {
        newLevel,
        pointsEarned,
        newBadges: earnedBadges,
        levelChanged: newLevel !== previousLevel,
      };
    },
    [user, updateUser]
  );

  const getResults = useCallback(() => {
    if (!user) return [];
    return getUserResults(user.id);
  }, [user]);

  const clearNewBadges = useCallback(() => {
    setNewBadges([]);
  }, []);

  return {
    recordResult,
    getResults,
    newBadges,
    clearNewBadges,
  };
};
