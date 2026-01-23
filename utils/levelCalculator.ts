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
 * Nivåbeskrivningar (Årskurs 1-9)
 */
export const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Årskurs 1 - Nybörjare',
  2: 'Årskurs 1 - Grundläggande',
  3: 'Årskurs 2 - Tidig utveckling',
  4: 'Årskurs 2 - Fortsatt utveckling',
  5: 'Årskurs 3 - Växande ordförråd',
  6: 'Årskurs 3 - Ökad förståelse',
  7: 'Årskurs 4 - Mellanstadiet börjar',
  8: 'Årskurs 4 - God läsförståelse',
  9: 'Årskurs 5 - Utvecklad läsare',
  10: 'Årskurs 5 - Skicklig läsare',
  11: 'Årskurs 5 - Mycket skicklig',
  12: 'Årskurs 6 - Avancerad läsare',
  13: 'Årskurs 6 - Expert mellanstadiet',
  14: 'Årskurs 7 - Högstadiet börjar',
  15: 'Årskurs 7 - God analys',
  16: 'Årskurs 7 - Kritisk läsare',
  17: 'Årskurs 8 - Avancerad analys',
  18: 'Årskurs 8 - Mycket avancerad',
  19: 'Årskurs 9 - Expertnivå',
  20: 'Årskurs 9 - Mästarnivå',
};

/**
 * Antalet ord per nivå (Årskurs 1-9)
 */
export const WORD_COUNT_BY_LEVEL: Record<number, { min: number; max: number }> = {
  1: { min: 50, max: 80 },      // Årskurs 1
  2: { min: 80, max: 120 },     // Årskurs 1
  3: { min: 100, max: 150 },    // Årskurs 2
  4: { min: 130, max: 180 },    // Årskurs 2
  5: { min: 150, max: 200 },    // Årskurs 3
  6: { min: 180, max: 230 },    // Årskurs 3
  7: { min: 200, max: 250 },    // Årskurs 4
  8: { min: 230, max: 280 },    // Årskurs 4
  9: { min: 250, max: 300 },    // Årskurs 5
  10: { min: 280, max: 330 },   // Årskurs 5
  11: { min: 300, max: 350 },   // Årskurs 5
  12: { min: 320, max: 380 },   // Årskurs 6
  13: { min: 350, max: 400 },   // Årskurs 6
  14: { min: 380, max: 450 },   // Årskurs 7
  15: { min: 400, max: 480 },   // Årskurs 7
  16: { min: 430, max: 500 },   // Årskurs 7
  17: { min: 450, max: 550 },   // Årskurs 8
  18: { min: 500, max: 600 },   // Årskurs 8
  19: { min: 550, max: 650 },   // Årskurs 9
  20: { min: 600, max: 700 },   // Årskurs 9
};

/**
 * Mappar nivå till årskurs
 */
export const LEVEL_TO_GRADE: Record<number, number> = {
  1: 1, 2: 1,
  3: 2, 4: 2,
  5: 3, 6: 3,
  7: 4, 8: 4,
  9: 5, 10: 5, 11: 5,
  12: 6, 13: 6,
  14: 7, 15: 7, 16: 7,
  17: 8, 18: 8,
  19: 9, 20: 9,
};
