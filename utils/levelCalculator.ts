/**
 * Beräknar ny nivå baserat på resultat
 * Alla rätt = nivå upp (max 20)
 * 1 eller fler fel = nivå ner (min 1)
 */
export const calculateNewLevel = (
  currentLevel: number,
  correctAnswers: number,
  totalQuestions: number
): number => {
  // Alla rätt → gå upp 1 nivå
  if (correctAnswers === totalQuestions && currentLevel < 20) {
    return currentLevel + 1;
  }
  // 1 eller fler fel → gå ner 1 nivå
  else if (correctAnswers < totalQuestions && currentLevel > 1) {
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
 * Nivå 1-9 mappar direkt till årskurs 1-9
 * Nivå 10-20 är extra utmaningsnivåer
 */
export const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Årskurs 1 - Mycket enkla texter med korta meningar',
  2: 'Årskurs 2 - Enkla texter med vardagliga ord',
  3: 'Årskurs 3 - Lite längre texter, varierat språk',
  4: 'Årskurs 4 - Längre texter med mer komplexitet',
  5: 'Årskurs 5 - Avancerade texter och ordförråd',
  6: 'Årskurs 6 - Mycket varierande språk och innehåll',
  7: 'Årskurs 7 - Högstadietexter med komplexitet',
  8: 'Årskurs 8 - Sofistikerade texter och innehåll',
  9: 'Årskurs 9 - Experttexter för högstadiet',
  10: 'Nivå 10 - Extra utmaning för åk 4-5',
  11: 'Nivå 11 - Extra utmaning för åk 5',
  12: 'Nivå 12 - Extra utmaning för åk 5-6',
  13: 'Nivå 13 - Extra utmaning för åk 6',
  14: 'Nivå 14 - Extra utmaning för åk 6-7',
  15: 'Nivå 15 - Extra utmaning för åk 7',
  16: 'Nivå 16 - Extra utmaning för åk 7-8',
  17: 'Nivå 17 - Extra utmaning för åk 8',
  18: 'Nivå 18 - Extra utmaning för åk 8-9',
  19: 'Nivå 19 - Extra utmaning för åk 9',
  20: 'Nivå 20 - Maximal utmaning',
};

/**
 * Antalet ord per nivå (1-20)
 * Nivå 1-9 mappar till årskurs 1-9
 */
export const WORD_COUNT_BY_LEVEL: Record<number, { min: number; max: number }> = {
  1: { min: 50, max: 100 },
  2: { min: 100, max: 150 },
  3: { min: 150, max: 250 },
  4: { min: 250, max: 350 },
  5: { min: 350, max: 500 },
  6: { min: 500, max: 650 },
  7: { min: 650, max: 800 },
  8: { min: 800, max: 1000 },
  9: { min: 1000, max: 1200 },
  10: { min: 400, max: 550 },
  11: { min: 500, max: 600 },
  12: { min: 600, max: 700 },
  13: { min: 700, max: 800 },
  14: { min: 750, max: 900 },
  15: { min: 850, max: 1000 },
  16: { min: 950, max: 1100 },
  17: { min: 1000, max: 1200 },
  18: { min: 1100, max: 1300 },
  19: { min: 1200, max: 1400 },
  20: { min: 1300, max: 1500 },
};
