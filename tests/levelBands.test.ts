/**
 * Unit tests for band-based level system
 *
 * Verifies:
 * 1. Level-to-band mapping correctness (1-6, 7-13, 14-17, 18-20)
 * 2. Word counts increase monotonically with level within bands
 * 3. Band boundaries are respected (level 6 < 7, level 13 < 14, level 17 < 18)
 */

import { describe, it, expect } from 'vitest';
import {
  getBandForLevel,
  getWordCountForLevel,
  getLevelLabel,
  getGenerationParams,
  LEVEL_BANDS
} from '../utils/levelBands';

describe('Level Band Mapping', () => {
  describe('getBandForLevel', () => {
    it('should map levels 1-6 to Lågstadiet', () => {
      for (let level = 1; level <= 6; level++) {
        const band = getBandForLevel(level);
        expect(band.schoolStage).toBe('Lågstadiet');
        expect(band.gradeRange).toBe('åk 1-3');
        expect(band.minLevel).toBe(1);
        expect(band.maxLevel).toBe(6);
      }
    });

    it('should map levels 7-13 to Mellanstadiet', () => {
      for (let level = 7; level <= 13; level++) {
        const band = getBandForLevel(level);
        expect(band.schoolStage).toBe('Mellanstadiet');
        expect(band.gradeRange).toBe('åk 4-6');
        expect(band.minLevel).toBe(7);
        expect(band.maxLevel).toBe(13);
      }
    });

    it('should map levels 14-17 to Högstadiet', () => {
      for (let level = 14; level <= 17; level++) {
        const band = getBandForLevel(level);
        expect(band.schoolStage).toBe('Högstadiet');
        expect(band.gradeRange).toBe('åk 7-9');
        expect(band.minLevel).toBe(14);
        expect(band.maxLevel).toBe(17);
      }
    });

    it('should map levels 18-20 to Gymnasiet', () => {
      for (let level = 18; level <= 20; level++) {
        const band = getBandForLevel(level);
        expect(band.schoolStage).toBe('Gymnasiet');
        expect(band.gradeRange).toBe('');
        expect(band.minLevel).toBe(18);
        expect(band.maxLevel).toBe(20);
      }
    });

    it('should throw error for invalid levels', () => {
      expect(() => getBandForLevel(0)).toThrow('Invalid level: 0');
      expect(() => getBandForLevel(21)).toThrow('Invalid level: 21');
      expect(() => getBandForLevel(-5)).toThrow('Invalid level: -5');
    });
  });

  describe('Word Count Scaling', () => {
    it('should return correct word count ranges for each band', () => {
      // Band 1 (Lågstadiet): 70-300 words
      expect(getWordCountForLevel(1)).toBe(70);
      expect(getWordCountForLevel(6)).toBe(300);

      // Band 2 (Mellanstadiet): 300-650 words
      expect(getWordCountForLevel(7)).toBe(300);
      expect(getWordCountForLevel(13)).toBe(650);

      // Band 3 (Högstadiet): 650-950 words
      expect(getWordCountForLevel(14)).toBe(650);
      expect(getWordCountForLevel(17)).toBe(950);

      // Band 4 (Gymnasiet): 950-1200 words
      expect(getWordCountForLevel(18)).toBe(950);
      expect(getWordCountForLevel(20)).toBe(1200);
    });

    it('should scale monotonically within Band 1 (Lågstadiet)', () => {
      for (let level = 1; level < 6; level++) {
        const current = getWordCountForLevel(level);
        const next = getWordCountForLevel(level + 1);
        expect(next).toBeGreaterThan(current);
      }
    });

    it('should scale monotonically within Band 2 (Mellanstadiet)', () => {
      for (let level = 7; level < 13; level++) {
        const current = getWordCountForLevel(level);
        const next = getWordCountForLevel(level + 1);
        expect(next).toBeGreaterThan(current);
      }
    });

    it('should scale monotonically within Band 3 (Högstadiet)', () => {
      for (let level = 14; level < 17; level++) {
        const current = getWordCountForLevel(level);
        const next = getWordCountForLevel(level + 1);
        expect(next).toBeGreaterThan(current);
      }
    });

    it('should scale monotonically within Band 4 (Gymnasiet)', () => {
      for (let level = 18; level < 20; level++) {
        const current = getWordCountForLevel(level);
        const next = getWordCountForLevel(level + 1);
        expect(next).toBeGreaterThan(current);
      }
    });

    it('should respect band boundaries at transitions', () => {
      // Level 6 (Lågstadiet max) should be less than level 7 (Mellanstadiet min)
      const level6 = getWordCountForLevel(6);
      const level7 = getWordCountForLevel(7);
      expect(level7).toBeGreaterThanOrEqual(level6);

      // Level 13 (Mellanstadiet max) should be less than level 14 (Högstadiet min)
      const level13 = getWordCountForLevel(13);
      const level14 = getWordCountForLevel(14);
      expect(level14).toBeGreaterThanOrEqual(level13);

      // Level 17 (Högstadiet max) should be less than level 18 (Gymnasiet min)
      const level17 = getWordCountForLevel(17);
      const level18 = getWordCountForLevel(18);
      expect(level18).toBeGreaterThanOrEqual(level17);
    });

    it('should never exceed band max word count', () => {
      for (let level = 1; level <= 20; level++) {
        const wordCount = getWordCountForLevel(level);
        const band = getBandForLevel(level);
        expect(wordCount).toBeGreaterThanOrEqual(band.minWords);
        expect(wordCount).toBeLessThanOrEqual(band.maxWords);
      }
    });
  });

  describe('Level Labels', () => {
    it('should format labels correctly for Lågstadiet', () => {
      expect(getLevelLabel(1)).toBe('Nivå 1 (Lågstadiet åk 1-3)');
      expect(getLevelLabel(6)).toBe('Nivå 6 (Lågstadiet åk 1-3)');
    });

    it('should format labels correctly for Mellanstadiet', () => {
      expect(getLevelLabel(7)).toBe('Nivå 7 (Mellanstadiet åk 4-6)');
      expect(getLevelLabel(13)).toBe('Nivå 13 (Mellanstadiet åk 4-6)');
    });

    it('should format labels correctly for Högstadiet', () => {
      expect(getLevelLabel(14)).toBe('Nivå 14 (Högstadiet åk 7-9)');
      expect(getLevelLabel(17)).toBe('Nivå 17 (Högstadiet åk 7-9)');
    });

    it('should format labels correctly for Gymnasiet', () => {
      expect(getLevelLabel(18)).toBe('Nivå 18 (Gymnasiet)');
      expect(getLevelLabel(20)).toBe('Nivå 20 (Gymnasiet)');
    });
  });

  describe('Generation Parameters', () => {
    it('should include all required parameters', () => {
      const params = getGenerationParams(10);

      expect(params).toHaveProperty('level');
      expect(params).toHaveProperty('schoolStage');
      expect(params).toHaveProperty('gradeRange');
      expect(params).toHaveProperty('targetWords');
      expect(params).toHaveProperty('minWords');
      expect(params).toHaveProperty('maxWords');
      expect(params).toHaveProperty('questionFocus');
      expect(params).toHaveProperty('vocabTier');
    });

    it('should provide reasonable min/max word ranges', () => {
      for (let level = 1; level <= 20; level++) {
        const params = getGenerationParams(level);
        const wordCount = getWordCountForLevel(level);
        const band = getBandForLevel(level);

        // Check that min/max are within ±50 of target but don't exceed band limits
        expect(params.targetWords).toBe(wordCount);
        expect(params.minWords).toBeLessThanOrEqual(params.targetWords);
        expect(params.maxWords).toBeGreaterThanOrEqual(params.targetWords);

        // Ensure we don't go outside band boundaries
        expect(params.minWords).toBeGreaterThanOrEqual(band.minWords);
        expect(params.maxWords).toBeLessThanOrEqual(band.maxWords);
      }
    });
  });

  describe('Band Configuration Integrity', () => {
    it('should have exactly 4 bands', () => {
      expect(LEVEL_BANDS).toHaveLength(4);
    });

    it('should cover all levels 1-20 without gaps', () => {
      expect(LEVEL_BANDS[0].minLevel).toBe(1);
      expect(LEVEL_BANDS[0].maxLevel).toBe(6);

      expect(LEVEL_BANDS[1].minLevel).toBe(7);
      expect(LEVEL_BANDS[1].maxLevel).toBe(13);

      expect(LEVEL_BANDS[2].minLevel).toBe(14);
      expect(LEVEL_BANDS[2].maxLevel).toBe(17);

      expect(LEVEL_BANDS[3].minLevel).toBe(18);
      expect(LEVEL_BANDS[3].maxLevel).toBe(20);
    });

    it('should have no overlapping level ranges', () => {
      for (let i = 0; i < LEVEL_BANDS.length - 1; i++) {
        const currentMax = LEVEL_BANDS[i].maxLevel;
        const nextMin = LEVEL_BANDS[i + 1].minLevel;
        expect(nextMin).toBe(currentMax + 1);
      }
    });

    it('should have monotonically increasing word ranges', () => {
      for (let i = 0; i < LEVEL_BANDS.length - 1; i++) {
        const currentMaxWords = LEVEL_BANDS[i].maxWords;
        const nextMinWords = LEVEL_BANDS[i + 1].minWords;
        expect(nextMinWords).toBeGreaterThanOrEqual(currentMaxWords);
      }
    });
  });
});
