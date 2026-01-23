import { Badge, BadgeType, User, TextResult } from '../types';

/**
 * Badge definitioner med ikoner och beskrivningar
 */
export const BADGE_DEFINITIONS: Record<BadgeType, Omit<Badge, 'earnedAt'>> = {
  [BadgeType.FIRST_TEXT]: {
    type: BadgeType.FIRST_TEXT,
    name: 'Första steget',
    description: 'Läste din första text!',
    icon: '🌟',
  },
  [BadgeType.TEN_TEXTS]: {
    type: BadgeType.TEN_TEXTS,
    name: 'Bokmal',
    description: 'Läste 10 texter',
    icon: '📚',
  },
  [BadgeType.FIFTY_TEXTS]: {
    type: BadgeType.FIFTY_TEXTS,
    name: 'Läshjälte',
    description: 'Läste 50 texter',
    icon: '🦸',
  },
  [BadgeType.HUNDRED_TEXTS]: {
    type: BadgeType.HUNDRED_TEXTS,
    name: 'Läsmästare',
    description: 'Läste 100 texter!',
    icon: '👑',
  },
  [BadgeType.FIVE_DAY_STREAK]: {
    type: BadgeType.FIVE_DAY_STREAK,
    name: 'Femma!',
    description: 'Läste 5 dagar i rad',
    icon: '🔥',
  },
  [BadgeType.TEN_DAY_STREAK]: {
    type: BadgeType.TEN_DAY_STREAK,
    name: 'Tiotal',
    description: 'Läste 10 dagar i rad',
    icon: '💪',
  },
  [BadgeType.THIRTY_DAY_STREAK]: {
    type: BadgeType.THIRTY_DAY_STREAK,
    name: 'Månadsmästare',
    description: 'Läste 30 dagar i rad!',
    icon: '🏆',
  },
  [BadgeType.PERFECT_SCORE]: {
    type: BadgeType.PERFECT_SCORE,
    name: 'Perfekt!',
    description: 'Fick 100% på en text',
    icon: '💯',
  },
  [BadgeType.FIVE_PERFECT]: {
    type: BadgeType.FIVE_PERFECT,
    name: 'Stjärnelev',
    description: 'Fick 100% fem gånger',
    icon: '⭐',
  },
  [BadgeType.LEVEL_UP]: {
    type: BadgeType.LEVEL_UP,
    name: 'Nivå upp!',
    description: 'Gick upp en nivå',
    icon: '📈',
  },
  [BadgeType.REACH_LEVEL_5]: {
    type: BadgeType.REACH_LEVEL_5,
    name: 'Toppnivå',
    description: 'Nådde nivå 5!',
    icon: '🎯',
  },
};

/**
 * Kontrollerar om användaren ska få nya badges baserat på resultat
 */
export const checkForNewBadges = (
  user: User,
  result: TextResult,
  previousLevel: number
): Badge[] => {
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();

  // Första texten
  if (user.completedTexts === 1 && !hasBadge(user, BadgeType.FIRST_TEXT)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.FIRST_TEXT], earnedAt: now });
  }

  // 10 texter
  if (user.completedTexts === 10 && !hasBadge(user, BadgeType.TEN_TEXTS)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.TEN_TEXTS], earnedAt: now });
  }

  // 50 texter
  if (user.completedTexts === 50 && !hasBadge(user, BadgeType.FIFTY_TEXTS)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.FIFTY_TEXTS], earnedAt: now });
  }

  // 100 texter
  if (user.completedTexts === 100 && !hasBadge(user, BadgeType.HUNDRED_TEXTS)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.HUNDRED_TEXTS], earnedAt: now });
  }

  // Perfect score
  if (result.score === result.totalQuestions) {
    if (!hasBadge(user, BadgeType.PERFECT_SCORE)) {
      newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.PERFECT_SCORE], earnedAt: now });
    }
    // Räkna antal perfekta resultat (skulle behöva hålla koll i user-objektet)
  }

  // Streak badges
  if (user.streak === 5 && !hasBadge(user, BadgeType.FIVE_DAY_STREAK)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.FIVE_DAY_STREAK], earnedAt: now });
  }
  if (user.streak === 10 && !hasBadge(user, BadgeType.TEN_DAY_STREAK)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.TEN_DAY_STREAK], earnedAt: now });
  }
  if (user.streak === 30 && !hasBadge(user, BadgeType.THIRTY_DAY_STREAK)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.THIRTY_DAY_STREAK], earnedAt: now });
  }

  // Level up
  if (user.currentLevel > previousLevel && !hasBadge(user, BadgeType.LEVEL_UP)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.LEVEL_UP], earnedAt: now });
  }

  // Reached level 5
  if (user.currentLevel === 5 && !hasBadge(user, BadgeType.REACH_LEVEL_5)) {
    newBadges.push({ ...BADGE_DEFINITIONS[BadgeType.REACH_LEVEL_5], earnedAt: now });
  }

  return newBadges;
};

/**
 * Kontrollerar om användaren redan har ett specifikt badge
 */
const hasBadge = (user: User, badgeType: BadgeType): boolean => {
  return user.badges.some(b => b.type === badgeType);
};

/**
 * Hämtar alla tillgängliga badges (för visning)
 */
export const getAllBadges = (): Omit<Badge, 'earnedAt'>[] => {
  return Object.values(BADGE_DEFINITIONS);
};
