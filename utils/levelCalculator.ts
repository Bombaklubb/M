/**
 * Beräknar ny nivå baserat på resultat
 * 80%+ rätt = nivå upp (max 5)
 * under 50% = nivå ner (min 1)
 */
export const calculateNewLevel = (
  currentLevel: number,
  correctAnswers: number,
  totalQuestions: number
): number => {
  const percentage = (correctAnswers / totalQuestions) * 100;

  if (percentage >= 80 && currentLevel < 5) {
    return currentLevel + 1;
  } else if (percentage < 50 && currentLevel > 1) {
    return currentLevel - 1;
  }

  return currentLevel;
};

/**
 * Beräknar poäng baserat på nivå och antal rätt svar
 */
export const calculatePoints = (level: number, correctAnswers: number): number => {
  const basePoints = 10;
  return basePoints * correctAnswers * level;
};

/**
 * Kontrollerar om användaren ska få en streak uppdatering
 */
export const updateStreak = (lastActivity: string): number => {
  if (!lastActivity) return 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastActivity);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Om senaste aktivitet var igår eller idag, fortsätt streak
  if (diffDays === 0) {
    return 0; // Ingen förändring om samma dag
  } else if (diffDays === 1) {
    return 1; // Öka streak om senaste aktivitet var igår
  }

  // Annars börjar streak om från 1
  return -1; // Signal att återställa till 1
};

/**
 * Nivåbeskrivningar
 */
export const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Nybörjare - Korta texter med enkelt språk',
  2: 'Grundläggande - Lite längre texter och fler ord',
  3: 'Medel - Bra blandning av enkelt och svårare språk',
  4: 'Avancerad - Längre texter med rikare ordförråd',
  5: 'Expert - Utmanande texter för skickliga läsare',
};

/**
 * Antalet ord per nivå
 */
export const WORD_COUNT_BY_LEVEL: Record<number, { min: number; max: number }> = {
  1: { min: 100, max: 150 },
  2: { min: 150, max: 200 },
  3: { min: 200, max: 250 },
  4: { min: 250, max: 300 },
  5: { min: 300, max: 400 },
};
