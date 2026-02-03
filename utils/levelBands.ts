/**
 * Band-based level system for reading comprehension
 * Maps levels 1-20 to school grade bands with specific parameters
 */

export interface BandConfig {
  schoolStage: string;
  gradeRange: string;
  minLevel: number;
  maxLevel: number;
  minWords: number;
  maxWords: number;
  questionFocus: string;
  vocabTier: string;
}

export const LEVEL_BANDS: BandConfig[] = [
  {
    schoolStage: 'Lågstadiet',
    gradeRange: 'åk 1-3',
    minLevel: 1,
    maxLevel: 6,
    minWords: 70,
    maxWords: 300,
    questionFocus: 'Hitta i text, konkreta detaljer, enkel förståelse',
    vocabTier: 'Konkret vokabulär, korta meningar'
  },
  {
    schoolStage: 'Mellanstadiet',
    gradeRange: 'åk 4-6',
    minLevel: 7,
    maxLevel: 13,
    minWords: 300,
    maxWords: 650,
    questionFocus: 'Inferens, sammanfattning, syfte, ordkunskap',
    vocabTier: 'Mer abstrakt vokabulär, varierande meningslängd'
  },
  {
    schoolStage: 'Högstadiet',
    gradeRange: 'åk 7-9',
    minLevel: 14,
    maxLevel: 17,
    minWords: 650,
    maxWords: 950,
    questionFocus: 'Fler-stegs inferens, textstruktur, stil/retorik grund, analys',
    vocabTier: 'Ämnesspecifik vokabulär, komplexa meningar'
  },
  {
    schoolStage: 'Gymnasiet',
    gradeRange: '',
    minLevel: 18,
    maxLevel: 20,
    minWords: 950,
    maxWords: 1200,
    questionFocus: 'Analys, argumentation, retorik, värdering, källkritik',
    vocabTier: 'Akademisk vokabulär, avancerad syntax'
  }
];

/**
 * Get the band configuration for a given level
 */
export function getBandForLevel(level: number): BandConfig {
  const band = LEVEL_BANDS.find(
    b => level >= b.minLevel && level <= b.maxLevel
  );

  if (!band) {
    throw new Error(`Invalid level: ${level}. Must be between 1 and 20.`);
  }

  return band;
}

/**
 * Calculate target word count for a specific level
 * Scales linearly within the band's range
 */
export function getWordCountForLevel(level: number): number {
  const band = getBandForLevel(level);

  // Calculate position within band (0 to 1)
  const levelsInBand = band.maxLevel - band.minLevel + 1;
  const positionInBand = level - band.minLevel;
  const normalizedPosition = levelsInBand === 1 ? 0.5 : positionInBand / (levelsInBand - 1);

  // Linear interpolation between min and max words
  const wordRange = band.maxWords - band.minWords;
  const targetWords = Math.round(band.minWords + (wordRange * normalizedPosition));

  return targetWords;
}

/**
 * Get formatted display label for a level
 */
export function getLevelLabel(level: number): string {
  const band = getBandForLevel(level);
  const gradeInfo = band.gradeRange ? ` (${band.schoolStage} ${band.gradeRange})` : ` (${band.schoolStage})`;
  return `Nivå ${level}${gradeInfo}`;
}

/**
 * Get parameters for text generation based on level
 */
export function getGenerationParams(level: number) {
  const band = getBandForLevel(level);
  const wordCount = getWordCountForLevel(level);

  return {
    level,
    schoolStage: band.schoolStage,
    gradeRange: band.gradeRange,
    targetWords: wordCount,
    minWords: Math.max(wordCount - 50, band.minWords),
    maxWords: Math.min(wordCount + 50, band.maxWords),
    questionFocus: band.questionFocus,
    vocabTier: band.vocabTier
  };
}
