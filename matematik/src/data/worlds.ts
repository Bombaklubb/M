export type WorldId = 'dino' | 'fantasy' | 'scifi' | 'gym';

export interface World {
  id: WorldId;
  name: string;
  subtitle: string;
  emoji: string;
  grades: string[];
  minGrade: number;
  maxGrade: number;
  bg: string;           // tailwind gradient
  accent: string;       // tailwind color
  accentHex: string;
  cardBg: string;
  topicIds: string[];
  islandEmojis: string[];
  storyIntro: string;
}

export const WORLDS: World[] = [
  {
    id: 'dino',
    name: 'Dinosaurie Världen',
    subtitle: 'Grunderna – Åk 1–3',
    emoji: '🦕',
    grades: ['1', '2', '3'],
    minGrade: 1,
    maxGrade: 3,
    bg: 'from-green-400 via-emerald-500 to-teal-600',
    accent: 'emerald',
    accentHex: '#10b981',
    cardBg: 'bg-emerald-50',
    topicIds: ['rakna-till-10', 'addition-bas', 'subtraktion-bas', 'former-och-figurer', 'klockan', 'rakna-till-100', 'enheter'],
    islandEmojis: ['🌿', '🦕', '🥚', '🌋', '🦖', '🪨'],
    storyIntro: 'Hjälp dinosaurierna att lösa matteproblem och rädda dinosaurieäggen!',
  },
  {
    id: 'fantasy',
    name: 'Fantasy Världen',
    subtitle: 'Mellanstadiet – Åk 4–6',
    emoji: '🏰',
    grades: ['4', '5', '6'],
    minGrade: 4,
    maxGrade: 6,
    bg: 'from-purple-500 via-violet-500 to-fuchsia-600',
    accent: 'purple',
    accentHex: '#8b5cf6',
    cardBg: 'bg-purple-50',
    topicIds: ['multiplikation-intro', 'division-intro', 'brak', 'decimaler', 'procent', 'geometri-omfang'],
    islandEmojis: ['🧙', '🏰', '🐉', '⚔️', '🪄', '💎'],
    storyIntro: 'Lös magiska gåtor för att befria drakskatten och rädda kungariket!',
  },
  {
    id: 'scifi',
    name: 'Sci-Fi Världen',
    subtitle: 'Högstadiet – Åk 7–9',
    emoji: '🚀',
    grades: ['7', '8', '9'],
    minGrade: 7,
    maxGrade: 9,
    bg: 'from-blue-600 via-indigo-600 to-cyan-600',
    accent: 'blue',
    accentHex: '#3b82f6',
    cardBg: 'bg-blue-50',
    topicIds: ['algebra-intro', 'ekvationer', 'statistik', 'geometri-area', 'funktioner', 'sannolikhet'],
    islandEmojis: ['🛸', '🌍', '🤖', '⚗️', '💡', '🌌'],
    storyIntro: 'Rädda rymdstationen med matte – fixa rymdsyret och navigera planeterna!',
  },
  {
    id: 'gym',
    name: 'Rymd Akademin',
    subtitle: 'Gymnasiet – Gym 1–3',
    emoji: '🌌',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    maxGrade: 12,
    bg: 'from-slate-700 via-indigo-800 to-purple-900',
    accent: 'indigo',
    accentHex: '#6366f1',
    cardBg: 'bg-indigo-50',
    topicIds: ['trigonometri', 'derivata', 'sannolikhet', 'funktioner'],
    islandEmojis: ['🌠', '🔭', '🪐', '⭐', '🌙', '💫'],
    storyIntro: 'Mästare på avancerad matematik – lösa universums mysterier!',
  },
];

export const gradeToWorld = (grade: string): WorldId => {
  const map: Record<string, WorldId> = {
    '1': 'dino', '2': 'dino', '3': 'dino',
    '4': 'fantasy', '5': 'fantasy', '6': 'fantasy',
    '7': 'scifi', '8': 'scifi', '9': 'scifi',
    'gym1': 'gym', 'gym2': 'gym', 'gym3': 'gym',
  };
  return map[grade] ?? 'dino';
};

export const getAccessibleWorlds = (gradeNum: number): WorldId[] => {
  const all: WorldId[] = [];
  if (gradeNum >= 1) all.push('dino');
  if (gradeNum >= 4) all.push('fantasy');
  if (gradeNum >= 7) all.push('scifi');
  if (gradeNum >= 10) all.push('gym');
  return all;
};
