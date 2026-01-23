/**
 * Beräknar ny nivå baserat på resultat
 * 80%+ rätt = nivå upp (max 20)
 * under 50% = nivå ner (min 1)
 */
export const calculateNewLevel = (
  currentLevel: number,
  correctAnswers: number,
  totalQuestions: number
): number => {
  const percentage = (correctAnswers / totalQuestions) * 100;

  if (percentage >= 80 && currentLevel < 20) {
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
 * Nivåbeskrivningar (1-20 för årskurs 1-9)
 */
export const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Årskurs 1 - Mycket enkla texter med korta meningar',
  2: 'Årskurs 1 - Enkla texter med vardagliga ord',
  3: 'Årskurs 2 - Lite längre texter, enkelt språk',
  4: 'Årskurs 2 - Varierade meningar, vanliga ord',
  5: 'Årskurs 3 - Längre meningar, lite svårare ord',
  6: 'Årskurs 3 - Mer varierat språk och innehåll',
  7: 'Årskurs 3 - Rikare ordförråd, blandade meningar',
  8: 'Årskurs 4 - Längre texter med mer komplexitet',
  9: 'Årskurs 4 - Varierande innehåll och språk',
  10: 'Årskurs 4 - Utmanande texter med rikare språk',
  11: 'Årskurs 5 - Avancerade texter och ordförråd',
  12: 'Årskurs 5 - Komplexa meningar och teman',
  13: 'Årskurs 5 - Djupare innehåll och nyanser',
  14: 'Årskurs 6 - Mycket varierande språk och innehåll',
  15: 'Årskurs 6 - Utmanande texter med djup',
  16: 'Årskurs 7 - Högstadietexter med komplexitet',
  17: 'Årskurs 7 - Avancerade teman och språk',
  18: 'Årskurs 8 - Sofistikerade texter och innehåll',
  19: 'Årskurs 8 - Mycket utmanande texter',
  20: 'Årskurs 9 - Experttexter för högstadiet',
};

/**
 * Antalet ord per nivå (1-20)
 */
export const WORD_COUNT_BY_LEVEL: Record<number, { min: number; max: number }> = {
  1: { min: 50, max: 100 },
  2: { min: 100, max: 150 },
  3: { min: 150, max: 200 },
  4: { min: 200, max: 250 },
  5: { min: 250, max: 300 },
  6: { min: 300, max: 350 },
  7: { min: 350, max: 400 },
  8: { min: 400, max: 450 },
  9: { min: 450, max: 500 },
  10: { min: 500, max: 550 },
  11: { min: 550, max: 600 },
  12: { min: 600, max: 650 },
  13: { min: 650, max: 700 },
  14: { min: 700, max: 750 },
  15: { min: 750, max: 800 },
  16: { min: 800, max: 900 },
  17: { min: 900, max: 1000 },
  18: { min: 1000, max: 1100 },
  19: { min: 1100, max: 1200 },
  20: { min: 1200, max: 1500 },
};
