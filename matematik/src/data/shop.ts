// ─── Butik (Shop) catalog ──────────────────────────────────────────────────────
// Allt som går att köpa med poäng. Rent kosmetiskt – påverkar aldrig inlärning
// eller kistor. Poäng som spenderas dras från en separat "plånbok"
// (intjänat − spenderat), så livstidstotalen och kist-milstolparna rörs aldrig.

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Vanlig',
  rare: 'Sällsynt',
  epic: 'Episk',
  legendary: 'Legendarisk',
};

export const RARITY_RING: Record<Rarity, string> = {
  common: 'from-slate-300 to-slate-400',
  rare: 'from-sky-400 to-blue-500',
  epic: 'from-violet-400 to-fuchsia-500',
  legendary: 'from-amber-400 to-orange-500',
};

// ─── Avatarer ───────────────────────────────────────────────────────────────────
export type AvatarGroup = 'Djur' | 'Fantasi' | 'Fordon' | 'Yrken';

export interface ShopAvatar {
  emoji: string;
  name: string;
  rarity: Rarity;
  price: number;
  group: AvatarGroup;
}

// Visningsordning för avatar-grupperna i butiken.
export const AVATAR_GROUP_ORDER: AvatarGroup[] = ['Djur', 'Fantasi', 'Fordon', 'Yrken'];

// OBS: lägg ALLTID till nya avatarer sist – köp sparas som index i denna array,
// så ändrad ordning skulle flytta vad någon redan äger. (De 24 första behåller
// sin ursprungsordning; renderingen grupperar via group-fältet, inte arrayordning.)
export const SHOP_AVATARS: ShopAvatar[] = [
  // ── Ursprungliga (Djur + Fantasi) – ordning får EJ ändras ───────────────────────
  { emoji: '🐶', name: 'Valpen',       rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐱', name: 'Kattungen',    rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐰', name: 'Kaninen',      rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐥', name: 'Kycklingen',   rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐧', name: 'Pingvinen',    rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐨', name: 'Koalan',       rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🦓', name: 'Zebran',       rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦒', name: 'Giraffen',     rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦔', name: 'Igelkotten',   rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦦', name: 'Uttern',       rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦥', name: 'Sengångaren',  rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦉', name: 'Ugglan',       rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦚', name: 'Påfågeln',     rarity: 'epic', price: 1000, group: 'Djur' },
  { emoji: '🦩', name: 'Flamingon',    rarity: 'epic', price: 1000, group: 'Djur' },
  { emoji: '🐲', name: 'Drakungen',    rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '🦂', name: 'Skorpionen',   rarity: 'epic', price: 1000, group: 'Djur' },
  { emoji: '🦏', name: 'Noshörningen', rarity: 'epic', price: 1000, group: 'Djur' },
  { emoji: '🐙', name: 'Bläckfisken',  rarity: 'epic', price: 1000, group: 'Djur' },
  { emoji: '🧞', name: 'Anden',        rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🧚', name: 'Älvan',        rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🧛', name: 'Vampyren',     rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🦹', name: 'Superskurken', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🦤', name: 'Dronten',      rarity: 'legendary', price: 2500, group: 'Djur' },
  { emoji: '🐦‍🔥', name: 'Fenix',     rarity: 'legendary', price: 2500, group: 'Fantasi' },

  // ── Fordon (tillagda) ─────────────────────────────────────────────────────────
  { emoji: '🚗', name: 'Bilen',        rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚙', name: 'Stadsjeepen',  rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚕', name: 'Taxin',        rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚌', name: 'Bussen',       rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚲', name: 'Cykeln',       rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🛻', name: 'Pickupen',     rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🏍️', name: 'Motorcykeln',  rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🚓', name: 'Polisbilen',   rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🚑', name: 'Ambulansen',   rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🚒', name: 'Brandbilen',   rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🚜', name: 'Traktorn',     rarity: 'epic', price: 1000, group: 'Fordon' },
  { emoji: '🚚', name: 'Lastbilen',    rarity: 'epic', price: 1000, group: 'Fordon' },
  { emoji: '🚛', name: 'Långtradaren', rarity: 'epic', price: 1000, group: 'Fordon' },
  { emoji: '🏎️', name: 'Racerbilen',   rarity: 'legendary', price: 2500, group: 'Fordon' },

  // ── Yrken (tillagda) ──────────────────────────────────────────────────────────
  { emoji: '👮', name: 'Polisen',        rarity: 'common', price: 150, group: 'Yrken' },
  { emoji: '👷', name: 'Byggaren',       rarity: 'common', price: 150, group: 'Yrken' },
  { emoji: '👨‍🍳', name: 'Kocken',        rarity: 'common', price: 150, group: 'Yrken' },
  { emoji: '👨‍🌾', name: 'Bonden',        rarity: 'common', price: 150, group: 'Yrken' },
  { emoji: '🧑‍🏫', name: 'Läraren',       rarity: 'common', price: 150, group: 'Yrken' },
  { emoji: '👨‍⚕️', name: 'Doktorn',       rarity: 'rare', price: 400, group: 'Yrken' },
  { emoji: '👨‍🚒', name: 'Brandmannen',   rarity: 'rare', price: 400, group: 'Yrken' },
  { emoji: '👨‍🔧', name: 'Mekanikern',    rarity: 'rare', price: 400, group: 'Yrken' },
  { emoji: '🕵️', name: 'Detektiven',     rarity: 'rare', price: 400, group: 'Yrken' },
  { emoji: '💂', name: 'Gardisten',      rarity: 'rare', price: 400, group: 'Yrken' },
  { emoji: '👨‍🚀', name: 'Astronauten',   rarity: 'epic', price: 1000, group: 'Yrken' },
  { emoji: '👨‍✈️', name: 'Piloten',       rarity: 'epic', price: 1000, group: 'Yrken' },
  { emoji: '👨‍🔬', name: 'Forskaren',     rarity: 'epic', price: 1000, group: 'Yrken' },
  { emoji: '👨‍💻', name: 'Programmeraren', rarity: 'epic', price: 1000, group: 'Yrken' },
  { emoji: '🧑‍⚖️', name: 'Domaren',       rarity: 'legendary', price: 2500, group: 'Yrken' },
  { emoji: '🧑‍🎤', name: 'Artisten',      rarity: 'legendary', price: 2500, group: 'Yrken' },
];

// ─── Ramar (avatar-frames) ──────────────────────────────────────────────────────
export interface ShopFrame {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  ring: string;   // CSS background för själva ringen
  glow: string;   // CSS färg för glow (box-shadow)
  animated?: boolean;
}

export const SHOP_FRAMES: ShopFrame[] = [
  { id: 'amber',   name: 'Bronsring',    rarity: 'common', price: 250,
    ring: 'linear-gradient(135deg,#fbbf24,#b45309)', glow: 'rgba(245,158,11,0.6)' },
  { id: 'ocean',   name: 'Havsring',     rarity: 'common', price: 250,
    ring: 'linear-gradient(135deg,#38bdf8,#1d4ed8)', glow: 'rgba(56,189,248,0.6)' },
  { id: 'emerald', name: 'Smaragdring',  rarity: 'rare', price: 700,
    ring: 'linear-gradient(135deg,#34d399,#047857)', glow: 'rgba(16,185,129,0.6)' },
  { id: 'sunset',  name: 'Solnedgång',   rarity: 'rare', price: 700,
    ring: 'linear-gradient(135deg,#fb7185,#f59e0b)', glow: 'rgba(251,113,133,0.6)' },
  { id: 'royal',   name: 'Kunglig ring', rarity: 'epic', price: 1600,
    ring: 'linear-gradient(135deg,#a78bfa,#6d28d9)', glow: 'rgba(167,139,250,0.7)' },
  { id: 'gold',    name: 'Guldlyx',      rarity: 'epic', price: 1600,
    ring: 'linear-gradient(135deg,#fde047,#b45309)', glow: 'rgba(250,204,21,0.75)' },
  { id: 'rainbow', name: 'Regnbåge',     rarity: 'legendary', price: 3500, animated: true,
    ring: 'conic-gradient(from 0deg,#f87171,#fbbf24,#34d399,#38bdf8,#a78bfa,#f87171)', glow: 'rgba(255,255,255,0.6)' },
  { id: 'cosmic',  name: 'Kosmisk ring', rarity: 'legendary', price: 3500, animated: true,
    ring: 'conic-gradient(from 0deg,#22d3ee,#a78bfa,#ec4899,#22d3ee)', glow: 'rgba(167,139,250,0.8)' },
];

export const FRAME_MAP: Record<string, ShopFrame> = Object.fromEntries(
  SHOP_FRAMES.map(f => [f.id, f])
);

// ─── Titlar ─────────────────────────────────────────────────────────────────────
export interface ShopTitle {
  id: string;
  label: string;
  rarity: Rarity;
  price: number;
}

export const SHOP_TITLES: ShopTitle[] = [
  { id: 'rookie',    label: 'Nykomling',         rarity: 'common', price: 200 },
  { id: 'counter',   label: 'Räknehjälte',       rarity: 'common', price: 200 },
  { id: 'hunter',    label: 'Taljägaren',        rarity: 'rare', price: 550 },
  { id: 'collector', label: 'Stjärnsamlare',     rarity: 'rare', price: 550 },
  { id: 'master',    label: 'Mästarräknare',     rarity: 'epic', price: 1400 },
  { id: 'wizard',    label: 'Mattetrollkarl',    rarity: 'epic', price: 1400 },
  { id: 'legend',    label: 'Matte-Legenden',    rarity: 'legendary', price: 3000 },
  { id: 'brain',     label: 'Universums Hjärna', rarity: 'legendary', price: 3000 },
];

export const TITLE_MAP: Record<string, ShopTitle> = Object.fromEntries(
  SHOP_TITLES.map(t => [t.id, t])
);

// ─── Profilbakgrunder ────────────────────────────────────────────────────────────
// Färgrika men mörka nog att vit text alltid syns (med lätt scrim ovanpå).
export interface ShopBackground {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  css: string; // CSS background-värde
}

export const SHOP_BACKGROUNDS: ShopBackground[] = [
  { id: 'sunrise',    name: 'Soluppgång',  rarity: 'common', price: 350,
    css: 'linear-gradient(160deg,#7c2d12,#c2410c,#ea580c)' },
  { id: 'sea',        name: 'Djuphav',     rarity: 'common', price: 350,
    css: 'linear-gradient(160deg,#0c4a6e,#0369a1,#0891b2)' },
  { id: 'forest',     name: 'Skog',        rarity: 'rare', price: 900,
    css: 'linear-gradient(160deg,#14532d,#15803d,#16a34a)' },
  { id: 'lavender',   name: 'Lavendel',    rarity: 'rare', price: 900,
    css: 'linear-gradient(160deg,#4c1d95,#6d28d9,#7c3aed)' },
  { id: 'galaxy',     name: 'Galax',       rarity: 'epic', price: 2200,
    css: 'linear-gradient(160deg,#1e1b4b,#4c1d95,#312e81)' },
  { id: 'aurora',     name: 'Norrsken',    rarity: 'epic', price: 2200,
    css: 'linear-gradient(160deg,#042f2e,#065f46,#1e3a8a)' },
  { id: 'rainbow-bg', name: 'Regnbåge',    rarity: 'legendary', price: 4500,
    css: 'linear-gradient(160deg,#be123c,#b45309,#15803d,#1d4ed8,#6d28d9)' },
  { id: 'gold-bg',    name: 'Guldskimmer', rarity: 'legendary', price: 4500,
    css: 'linear-gradient(160deg,#78350f,#b45309,#f59e0b)' },
];

export const BACKGROUND_MAP: Record<string, ShopBackground> = Object.fromEntries(
  SHOP_BACKGROUNDS.map(b => [b.id, b])
);
