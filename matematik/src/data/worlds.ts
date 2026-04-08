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
    emoji: '🦖',
    grades: ['1', '2', '3'],
    minGrade: 1,
    maxGrade: 3,
    bg: 'from-green-400 via-emerald-500 to-teal-600',
    accent: 'emerald',
    accentHex: '#10b981',
    cardBg: 'bg-emerald-50',
    topicIds: [
      // Tal & räkning (rad 1–2)
      'rakna-till-10', 'rakna-till-100', 'enheter',
      'taluppfattning-lag-1', 'taluppfattning-lag-2', 'likheter-monster',
      // Addition & subtraktion (rad 3–4)
      'addition-bas', 'addition-strategier', 'subtraktion-bas',
      'subtraktion-strategier', 'former-och-figurer', 'klockan',
      // Övrigt (rad 5)
      'problemlosning-lag', 'matematik-begrepp-lag', 'rimlighetsoevningar-lag',
      // Geometri – vinklar & symmetri
      'vinklar-lag', 'symmetri-lag',
      // Tallinjen, Omvandling & Positionssystemet
      'tallinjen-lag', 'omv-mat-lag', 'omv-vikt-lag', 'position-lag',
    ],
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
    topicIds: [
      // Multiplikation Steg 1–3 (rad 1)
      'multiplikation-steg-1', 'multiplikation-steg-2', 'multiplikation-steg-3',
      // Division Steg 1–3 (rad 2)
      'division-steg-1', 'division-steg-2', 'division-steg-3',
      // Bråk Steg 1–3 (rad 3)
      'brak-steg-1', 'brak-steg-2', 'brak-steg-3',
      // Procent Steg 1–3 (rad 4)
      'procent-steg-1', 'procent-steg-2', 'procent-steg-3',
      // Ekvationer Steg 1–3 (rad 5)
      'ekvationer-mel-steg-1', 'ekvationer-mel-steg-2', 'ekvationer-mel-steg-3',
      // Tal & decimaltal (rad 6)
      'klockan-mel', 'decimaler', 'taluppfattning-1',
      // Taluppfattning & strategier (rad 7)
      'taluppfattning-2', 'primtal-faktorer', 'huvudrakning',
      // Geometri & statistik (rad 8)
      'geometri-omfang', 'geometri-mel', 'statistik-mel',
      // Övrigt (rad 9)
      'matematik-begrepp-mel', 'rimlighetsoevningar-mel',
      // Geometri – vinklar & symmetri
      'vinklar-mel', 'symmetri-mel',
      // Tallinjen, Omvandling & Positionssystemet
      'tallinjen-mel', 'omv-mat-mel', 'omv-vikt-mel', 'position-mel',
    ],
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
    topicIds: [
      // Algebra Steg 1–3 (rad 1)
      'algebra-steg-1', 'algebra-steg-2', 'algebra-steg-3',
      // Ekvationer Steg 1–3 (rad 2)
      'ekvationer-steg-1', 'ekvationer-steg-2', 'ekvationer-steg-3',
      // Potenser Steg 1–3 (rad 3)
      'potenser-steg-1', 'potenser-steg-2', 'potenser-steg-3',
      // Bråk Steg 1–3 (rad 4 — alla steg samlade)
      'brak-steg-1', 'brak-steg-2', 'brak-steg-3',
      // Procent Steg 1–3 (rad 5 — alla steg samlade)
      'procent-steg-1', 'procent-steg-2', 'procent-steg-3',
      // Tal & räknefärdighet (rad 6)
      'negativa-tal', 'avrundning', 'prioritering',
      // Algebraiska uttryck (rad 7)
      'standardform', 'forenkla-uttryck', 'distributiva-lagen',
      // Formler & koordinater (rad 8)
      'formler-variabler', 'koordinatsystem', 'rata-linjen',
      // Proportioner & skala (rad 9)
      'proportioner', 'skala', 'enhetsomvandlingar-hog',
      // Geometri (rad 10)
      'vinkelregler', 'pythagoras', 'geometri-volym',
      // Funktioner & statistik (rad 11)
      'funktioner', 'sannolikhet', 'statistik',
      // Area & problemlösning (rad 12)
      'geometri-area', 'statistik-spridning', 'problemlosning-hog',
      // Övrigt (rad 13)
      'matematik-begrepp-hog', 'rimlighetsoevningar-hog',
      // Geometri – symmetri
      'symmetri-hog',
    ],
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
    topicIds: [
      // Funktioner & ekvationer (rad 1)
      'ekvationer-gym', 'funktioner', 'trigonometri',
      // Derivata & sannolikhet (rad 2)
      'derivata', 'sannolikhet', 'matematik-begrepp-gym',
      // Övrigt (rad 3)
      'rimlighetsoevningar-gym',
    ],
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
