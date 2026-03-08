import { WorldId } from './worlds';
import { StudentStats } from '../types';

export interface CollectibleItem {
  id: string;
  worldId: WorldId;
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;  // human-readable
  statUnlock: (stats: StudentStats) => boolean; // unlockable via regular practice
}

export const COLLECTION_ITEMS: CollectibleItem[] = [
  // ── Dino world ──────────────────────────────────────────────────────────────
  {
    id: 'dino-logic-lamp',
    worldId: 'dino',
    name: 'Logiklyktan',
    emoji: '🔦',
    description: 'Lyste upp rimligheten i urtiden!',
    rarity: 'rare',
    unlockCondition: 'Klara Rimlighetsövningen (Dino)',
    statUnlock: (s) => s.progress.some(p => p.topicId === 'rimlighetsoevningar-lag' && p.completed),
  },
  {
    id: 'dino-baby',
    worldId: 'dino',
    name: 'Baby Dino',
    emoji: '🦕',
    description: 'Räddat från vulkanen!',
    rarity: 'common',
    unlockCondition: 'Slutför ditt första ämnesområde',
    statUnlock: (s) => s.completedTopics >= 1,
  },
  {
    id: 'dino-egg',
    worldId: 'dino',
    name: 'Dinoägg',
    emoji: '🥚',
    description: 'Hittat i grönskan.',
    rarity: 'common',
    unlockCondition: 'Slutför 3 ämnesområden',
    statUnlock: (s) => s.completedTopics >= 3,
  },
  {
    id: 'dino-crown',
    worldId: 'dino',
    name: 'Dinokungens krona',
    emoji: '👑',
    description: 'Kung över räknandet!',
    rarity: 'rare',
    unlockCondition: 'Slutför 5 ämnesområden',
    statUnlock: (s) => s.completedTopics >= 5,
  },
  {
    id: 'dino-volcano',
    worldId: 'dino',
    name: 'Vulkansimulator',
    emoji: '🌋',
    description: 'Klarat vulkantestet!',
    rarity: 'epic',
    unlockCondition: 'Få 3 stjärnor på minst ett ämne',
    statUnlock: (s) => s.progress.some(p => p.stars === 3),
  },

  // ── Fantasy world ────────────────────────────────────────────────────────────
  {
    id: 'fantasy-truth-mirror',
    worldId: 'fantasy',
    name: 'Sanningens spegel',
    emoji: '🪞',
    description: 'Avslöjar sant och falskt med magi!',
    rarity: 'rare',
    unlockCondition: 'Klara Rimlighetsövningen (Fantasy)',
    statUnlock: (s) => s.progress.some(p => p.topicId === 'rimlighetsoevningar-mel' && p.completed),
  },
  {
    id: 'weekly-trophy',
    worldId: 'fantasy',
    name: 'Veckotroféet',
    emoji: '🏆',
    description: 'Vunnit av veckans mästare!',
    rarity: 'rare',
    unlockCondition: 'Samla 100 poäng på en vecka',
    statUnlock: (s) => s.points.weeklyPoints >= 100,
  },
  {
    id: 'castle-flag',
    worldId: 'fantasy',
    name: 'Borgens fana',
    emoji: '🏰',
    description: 'Försvarare av kungariket!',
    rarity: 'common',
    unlockCondition: 'Svara rätt på 25 uppgifter',
    statUnlock: (s) => s.totalCorrect >= 25,
  },
  {
    id: 'dragon-gem',
    worldId: 'fantasy',
    name: 'Drakens Juvel',
    emoji: '💎',
    description: 'Vunnen från draken!',
    rarity: 'rare',
    unlockCondition: 'Slutför 4 ämnesområden',
    statUnlock: (s) => s.completedTopics >= 4,
  },
  {
    id: 'magic-wand',
    worldId: 'fantasy',
    name: 'Trollstav',
    emoji: '🪄',
    description: 'Trollkarlarnas examen!',
    rarity: 'epic',
    unlockCondition: 'Svara rätt på 50 uppgifter',
    statUnlock: (s) => s.totalCorrect >= 50,
  },
  {
    id: 'dragon-scale',
    worldId: 'fantasy',
    name: 'Drakfjäll',
    emoji: '🐉',
    description: 'Extremt sällsynt!',
    rarity: 'legendary',
    unlockCondition: 'Få 3 stjärnor på 5 olika ämnen',
    statUnlock: (s) => s.progress.filter(p => p.stars === 3).length >= 5,
  },

  // ── Sci-fi world ─────────────────────────────────────────────────────────────
  {
    id: 'scifi-logic-chip',
    worldId: 'scifi',
    name: 'Logikprocessorn',
    emoji: '🧮',
    description: 'Beräknar rimlighet i rymdfart!',
    rarity: 'epic',
    unlockCondition: 'Klara Rimlighetsövningen (Sci-Fi)',
    statUnlock: (s) => s.progress.some(p => p.topicId === 'rimlighetsoevningar-hog' && p.completed),
  },
  {
    id: 'tenday-badge',
    worldId: 'scifi',
    name: 'Aktivitetsbrickan',
    emoji: '🎖️',
    description: 'Tio dagar av rymdmatematik!',
    rarity: 'epic',
    unlockCondition: 'Var aktiv totalt 10 dagar',
    statUnlock: (s) => s.daysActive >= 10,
  },
  {
    id: 'space-badge',
    worldId: 'scifi',
    name: 'Rymdbricka',
    emoji: '🛸',
    description: 'Certified space mathematician!',
    rarity: 'common',
    unlockCondition: 'Svara rätt på 10 uppgifter',
    statUnlock: (s) => s.totalCorrect >= 10,
  },
  {
    id: 'space-helmet',
    worldId: 'scifi',
    name: 'Rymdhjälm',
    emoji: '👨‍🚀',
    description: 'Du räddade syret!',
    rarity: 'rare',
    unlockCondition: 'Slutför 6 ämnesområden',
    statUnlock: (s) => s.completedTopics >= 6,
  },
  {
    id: 'star-chart',
    worldId: 'scifi',
    name: 'Stjärnkarta',
    emoji: '🗺️',
    description: 'Navigerade hem genom rymden!',
    rarity: 'rare',
    unlockCondition: 'Var aktiv 3 dagar i rad',
    statUnlock: (s) => s.points.streak >= 3,
  },
  {
    id: 'robot-buddy',
    worldId: 'scifi',
    name: 'Robotvän',
    emoji: '🤖',
    description: 'Byggd av dig!',
    rarity: 'epic',
    unlockCondition: 'Svara rätt på 100 uppgifter',
    statUnlock: (s) => s.totalCorrect >= 100,
  },
  {
    id: 'data-crystal',
    worldId: 'scifi',
    name: 'Datakristall',
    emoji: '💎',
    description: 'Analyserade stationens data!',
    rarity: 'epic',
    unlockCondition: 'Nå nivå 5',
    statUnlock: (s) => s.points.level >= 5,
  },
  {
    id: 'black-hole',
    worldId: 'scifi',
    name: 'Svart Hål',
    emoji: '🌌',
    description: 'Beräknade singulariteten!',
    rarity: 'legendary',
    unlockCondition: 'Nå nivå 9',
    statUnlock: (s) => s.points.level >= 9,
  },

  // ── Gym world ─────────────────────────────────────────────────────────────────
  {
    id: 'gym-logic-eye',
    worldId: 'gym',
    name: 'Universums logik',
    emoji: '👁️',
    description: 'Ser igenom universums matematiska sanning!',
    rarity: 'epic',
    unlockCondition: 'Klara Rimlighetsövningen (Gym)',
    statUnlock: (s) => s.progress.some(p => p.topicId === 'rimlighetsoevningar-gym' && p.completed),
  },
  {
    id: 'all-rimlighet-compass',
    worldId: 'gym',
    name: 'Världskompass',
    emoji: '🧭',
    description: 'Klarade rimlighetsövningar i ALLA världar!',
    rarity: 'legendary',
    unlockCondition: 'Klara ALLA 4 Rimlighetsövningar',
    statUnlock: (s) =>
      ['rimlighetsoevningar-lag','rimlighetsoevningar-mel','rimlighetsoevningar-hog','rimlighetsoevningar-gym']
        .every(id => s.progress.some(p => p.topicId === id && p.completed)),
  },
  {
    id: 'telescope',
    worldId: 'gym',
    name: 'Teleskop',
    emoji: '🔭',
    description: 'Tittar bortom horisonten.',
    rarity: 'rare',
    unlockCondition: 'Slutför 8 ämnesområden',
    statUnlock: (s) => s.completedTopics >= 8,
  },
  {
    id: 'universe-map',
    worldId: 'gym',
    name: 'Universumkarta',
    emoji: '🗺️',
    description: 'Universum kartlagt!',
    rarity: 'epic',
    unlockCondition: 'Slutför 12 ämnesområden',
    statUnlock: (s) => s.completedTopics >= 12,
  },
  {
    id: 'star-prof',
    worldId: 'gym',
    name: 'Stjärnprofessor',
    emoji: '🌠',
    description: 'Akademins finaste titel!',
    rarity: 'legendary',
    unlockCondition: 'Nå max-nivå (nivå 10)',
    statUnlock: (s) => s.points.level >= 10,
  },
];

export const RARITY_COLORS: Record<string, string> = {
  common:    'from-gray-300 to-slate-400',
  rare:      'from-blue-400 to-cyan-500',
  epic:      'from-purple-500 to-violet-600',
  legendary: 'from-amber-400 to-orange-500',
};

export const RARITY_LABELS: Record<string, string> = {
  common: 'Vanlig', rare: 'Sällsynt', epic: 'Episk', legendary: 'Legendarisk',
};
