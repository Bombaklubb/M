import { WorldId } from './worlds';

export interface CollectibleItem {
  id: string;
  worldId: WorldId;
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;  // human-readable
}

export const COLLECTION_ITEMS: CollectibleItem[] = [
  // Dino world
  { id: 'dino-baby',    worldId: 'dino',    name: 'Baby Dino',       emoji: '🦕', description: 'Räddat från vulkanen!',          rarity: 'common',    unlockCondition: 'Slutför quest: Rädda Dinosaurieäggen' },
  { id: 'dino-crown',   worldId: 'dino',    name: 'Dinokungens krona', emoji: '👑', description: 'Kung över räknandet!',          rarity: 'rare',      unlockCondition: 'Slutför quest: Dinosauriernas Talräkning' },
  { id: 'dino-egg',     worldId: 'dino',    name: 'Dinoägg',         emoji: '🥚', description: 'Hittat i grönskan.',             rarity: 'common',    unlockCondition: 'Klara 3 kapitel i Dinosaurie Världen' },
  { id: 'dino-volcano', worldId: 'dino',    name: 'Vulkansimulator', emoji: '🌋', description: 'Klarat vulkantestet!',           rarity: 'epic',      unlockCondition: 'Få 3 stjärnor i alla Dino-kapitel' },

  // Fantasy world
  { id: 'dragon-gem',   worldId: 'fantasy', name: 'Drakens Juvel',   emoji: '💎', description: 'Vunnen från draken!',            rarity: 'rare',      unlockCondition: 'Slutför quest: Drakens Skatt' },
  { id: 'magic-wand',   worldId: 'fantasy', name: 'Trollstav',       emoji: '🪄', description: 'Trollkarlarnas examen!',         rarity: 'epic',      unlockCondition: 'Slutför quest: Trollkarlsskolan' },
  { id: 'castle-flag',  worldId: 'fantasy', name: 'Borgens fana',    emoji: '🏰', description: 'Försvarare av kungariket!',      rarity: 'common',    unlockCondition: 'Klara 3 kapitel i Fantasy Världen' },
  { id: 'dragon-scale', worldId: 'fantasy', name: 'Drakfjäll',       emoji: '🐉', description: 'Extremt sällsynt!',             rarity: 'legendary', unlockCondition: 'Få 3 stjärnor i alla Fantasy-kapitel' },

  // Sci-fi world
  { id: 'space-helmet', worldId: 'scifi',   name: 'Rymdhjälm',       emoji: '👨‍🚀', description: 'Du räddade syret!',           rarity: 'rare',      unlockCondition: 'Slutför quest: Rädda Syret i Rymden' },
  { id: 'robot-buddy',  worldId: 'scifi',   name: 'Robotvän',        emoji: '🤖', description: 'Byggd av dig!',                 rarity: 'epic',      unlockCondition: 'Slutför quest: Robotfabriken' },
  { id: 'space-badge',  worldId: 'scifi',   name: 'Rymdbricka',      emoji: '🛸', description: 'Certified space mathematician!', rarity: 'common',   unlockCondition: 'Klara 3 kapitel i Sci-Fi Världen' },
  { id: 'black-hole',   worldId: 'scifi',   name: 'Svart Hål',       emoji: '🌌', description: 'Beräknade singulariteten!',     rarity: 'legendary', unlockCondition: 'Få 3 stjärnor i alla Sci-Fi-kapitel' },
  { id: 'star-chart',   worldId: 'scifi',   name: 'Stjärnkarta',     emoji: '🗺️', description: 'Navigerade hem genom rymden!',  rarity: 'rare',      unlockCondition: 'Slutför quest: Navigation i Rymden' },
  { id: 'data-crystal', worldId: 'scifi',   name: 'Datakristall',    emoji: '💎', description: 'Analyserade stationens data!',  rarity: 'epic',      unlockCondition: 'Slutför quest: Dataanalys på Stationen' },

  // Gym world
  { id: 'universe-map', worldId: 'gym',     name: 'Universumkarta',  emoji: '🗺️', description: 'Universum kartlagt!',           rarity: 'epic',      unlockCondition: 'Slutför quest: Universums Mysterium' },
  { id: 'star-prof',    worldId: 'gym',     name: 'Stjärnprofessor', emoji: '🌠', description: 'Akademins finaste titel!',      rarity: 'legendary', unlockCondition: 'Klara alla gym-kapitel med 3 stjärnor' },
  { id: 'telescope',    worldId: 'gym',     name: 'Teleskop',        emoji: '🔭', description: 'Tittar bortom horisonten.',     rarity: 'rare',      unlockCondition: 'Klara 3 kapitel i Rymd Akademin' },
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
