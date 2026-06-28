// ─── Butik (Shop) catalog ──────────────────────────────────────────────────────
// Allt som går att köpa med poäng. Rent kosmetiskt – påverkar aldrig inlärning
// eller kistor. Poäng som spenderas dras från en separat "plånbok"
// (intjänat − spenderat), så livstidstotalen och kist-milstolparna rörs aldrig.

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Vanlig',
  rare: 'Sällsynt',
  epic: 'Episk',
  legendary: 'Legendarisk',
  mythic: 'Mytisk',
};

export const RARITY_RING: Record<Rarity, string> = {
  common: 'from-slate-300 to-slate-400',
  rare: 'from-sky-400 to-blue-500',
  epic: 'from-violet-400 to-fuchsia-500',
  legendary: 'from-amber-400 to-orange-500',
  mythic: 'from-fuchsia-500 via-purple-600 to-amber-400',
};

// ─── Avatarer ───────────────────────────────────────────────────────────────────
export type AvatarGroup =
  | 'Djur' | 'Fantasi' | 'Fordon' | 'Yrken'
  | 'Skoltema' | 'Roligt' | 'Sällsynt' | 'Säsong' | 'Figurer';

export interface ShopAvatar {
  emoji: string;
  name: string;
  rarity: Rarity;
  price: number;
  group: AvatarGroup;
}

// Visningsordning för avatar-grupperna i butiken.
export const AVATAR_GROUP_ORDER: AvatarGroup[] = [
  'Figurer', 'Djur', 'Skoltema', 'Fordon', 'Yrken', 'Roligt', 'Säsong', 'Fantasi', 'Sällsynt',
];

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

  // ── Djur (tillagda) ───────────────────────────────────────────────────────────
  { emoji: '🐬', name: 'Delfinen',     rarity: 'rare', price: 400, group: 'Djur' },

  // ── Skoltema (tillagda) ───────────────────────────────────────────────────────
  { emoji: '🤓', name: 'Bokmask',        rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🧮', name: 'Mattesnille',    rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🎨', name: 'Konstnär',       rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🎸', name: 'Musikstjärna',   rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🧪', name: 'Vetenskapsgeni', rarity: 'rare', price: 400, group: 'Skoltema' },
  { emoji: '🔤', name: 'Språkmästare',   rarity: 'rare', price: 400, group: 'Skoltema' },
  { emoji: '📚', name: 'Bibliotekarie',  rarity: 'rare', price: 400, group: 'Skoltema' },
  { emoji: '💡', name: 'Uppfinnare',     rarity: 'rare', price: 400, group: 'Skoltema' },

  // ── Roligt & knasigt (tillagda) ───────────────────────────────────────────────
  { emoji: '🥔', name: 'Potatis med solglasögon', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🌮', name: 'Dansande taco',           rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍌', name: 'Flygande banan',          rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🧟', name: 'Zombie med läsglasögon',  rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🥒', name: 'Sur gurka',               rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🥦', name: 'Broccolisuperhjälte',     rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '👹', name: 'Toffelmonster',           rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '☕', name: 'Kaffekopp med ansikte',   rarity: 'rare', price: 400, group: 'Roligt' },

  // ── Säsong (tillagda) ─────────────────────────────────────────────────────────
  { emoji: '🐇', name: 'Påskhare',        rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '🏴‍☠️', name: 'Sommarpirat',    rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '👻', name: 'Halloween-spöke', rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '🎅', name: 'Jultomte',        rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '⛄', name: 'Snögubbe',        rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '💐', name: 'Midsommarfigur',  rarity: 'rare', price: 400, group: 'Säsong' },

  // ── Fantasi (tillagda, dyrare) ────────────────────────────────────────────────
  { emoji: '🐉', name: 'Elddrake',        rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '🧊', name: 'Ismagiker',       rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '🗡️', name: 'Skuggkrigare',    rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '👾', name: 'Rymdkejsare',     rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '⏳', name: 'Tidsresenär',     rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🦾', name: 'Guldrobot',       rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🌈', name: 'Regnbågsväktare', rarity: 'legendary', price: 2500, group: 'Fantasi' },

  // ── Sällsynt (tillagda, mycket dyra – mytiska) ────────────────────────────────
  { emoji: '💎', name: 'Diamantdrake',          rarity: 'mythic', price: 5000, group: 'Sällsynt' },
  { emoji: '💫', name: 'Galaxhjälte',           rarity: 'mythic', price: 5000, group: 'Sällsynt' },
  { emoji: '🔮', name: 'Legendarisk trollkarl', rarity: 'mythic', price: 5000, group: 'Sällsynt' },

  // ── Figurer (DiceBear-genererade) ─────────────────────────────────────────────
  // "db:<stil>:<seed>" – ritas som bild av FramedAvatar via utils/dicebear.ts
  { emoji: 'db:funEmoji:Bubbla',   name: 'Glada gänget',     rarity: 'common', price: 150, group: 'Figurer' },
  { emoji: 'db:funEmoji:Kano',     name: 'Fjantet',          rarity: 'common', price: 150, group: 'Figurer' },
  { emoji: 'db:funEmoji:Toff',     name: 'Busfiguren',       rarity: 'common', price: 150, group: 'Figurer' },
  { emoji: 'db:adventurer:Aria',   name: 'Äventyraren',      rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:adventurer:Milo',   name: 'Upptäckaren',      rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:funEmoji:Vera',     name: 'Solstrålen',       rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:adventurer:Otto',   name: 'Kompisen',         rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:adventurer:Iris',   name: 'Drömmaren',        rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:funEmoji:Liv',      name: 'Konstnärssjälen',  rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:bottts:Rex',        name: 'Roboten',          rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:bottts:Volt',       name: 'Cyborgen',         rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:pixelArt:Bit',      name: 'Pixelhjälten',     rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:pixelArt:Nova',     name: 'Retrofiguren',     rarity: 'rare', price: 400, group: 'Figurer' },
  { emoji: 'db:adventurer:Saga',   name: 'Hjälten',          rarity: 'epic', price: 1000, group: 'Figurer' },
  { emoji: 'db:bottts:Titan',      name: 'Megaboten',        rarity: 'epic', price: 1000, group: 'Figurer' },
  { emoji: 'db:pixelArt:Zix',      name: '8-bitaren',        rarity: 'epic', price: 1000, group: 'Figurer' },

  // ── Roligt & knasigt (fler – tillagda sist för att bevara köp-index) ──────────
  { emoji: '💩', name: 'Bajsemojin',         rarity: 'common', price: 150, group: 'Roligt' },
  { emoji: '🤡', name: 'Clownen',            rarity: 'common', price: 150, group: 'Roligt' },
  { emoji: '🤠', name: 'Cowboyfjanten',      rarity: 'common', price: 150, group: 'Roligt' },
  { emoji: '🥸', name: 'Mästerförklädnaden', rarity: 'common', price: 150, group: 'Roligt' },
  { emoji: '🤪', name: 'Tokfjanten',         rarity: 'common', price: 150, group: 'Roligt' },
  { emoji: '🍕', name: 'Pizzakungen',        rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍔', name: 'Hamburgerhjälten',   rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍩', name: 'Munkmonstret',       rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍪', name: 'Kakmonstret',        rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🌭', name: 'Korv i bröd',        rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🥑', name: 'Avokadokämpen',      rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🦆', name: 'Knasankan',          rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍄', name: 'Svampfiguren',       rarity: 'epic', price: 1000, group: 'Roligt' },
  { emoji: '🍦', name: 'Glassgänget',        rarity: 'epic', price: 1000, group: 'Roligt' },
  { emoji: '🐡', name: 'Blåsfisken',         rarity: 'legendary', price: 2500, group: 'Roligt' },
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

// ─── Teman (profilbakgrunder med mönster) ──────────────────────────────────────
// `css` är ett komplett CSS background-värde. animated === true ⇒ bakgrunden
// glider långsamt (klassen .shop-theme-animated sätter background-size + animation).
export interface ShopBackground {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  css: string; // CSS background-värde
  animated?: boolean;
}

export const SHOP_BACKGROUNDS: ShopBackground[] = [
  // ── Enfärgade toningar ────────────────────────────────────────────────────────
  { id: 'sunrise',    name: 'Soluppgång',  rarity: 'common', price: 350,
    css: 'linear-gradient(160deg,#7c2d12,#c2410c,#ea580c)' },
  { id: 'sea',        name: 'Djuphav',     rarity: 'common', price: 350,
    css: 'linear-gradient(160deg,#0c4a6e,#0369a1,#0891b2)' },
  { id: 'forest',     name: 'Skog',        rarity: 'rare', price: 900,
    css: 'linear-gradient(160deg,#14532d,#15803d,#16a34a)' },
  { id: 'gold-bg',    name: 'Guldskimmer', rarity: 'legendary', price: 4500,
    css: 'linear-gradient(160deg,#78350f,#b45309,#f59e0b)' },

  // ── Mönster ───────────────────────────────────────────────────────────────────
  { id: 'th-zebra',   name: 'Zebra',        rarity: 'rare', price: 600,
    css: 'repeating-linear-gradient(48deg,#111827 0 20px,#f9fafb 20px 40px)' },
  { id: 'th-tiger',   name: 'Tiger',        rarity: 'rare', price: 600,
    css: 'repeating-linear-gradient(75deg,#1c1917 0 9px,#ea580c 9px 42px)' },
  { id: 'th-cow',     name: 'Ko-fläckar',   rarity: 'rare', price: 600,
    css: 'radial-gradient(circle,#111827 32%,transparent 34%) 0 0/90px 90px,radial-gradient(circle,#111827 32%,transparent 34%) 45px 45px/90px 90px,#f9fafb' },
  { id: 'th-leopard', name: 'Leopard',      rarity: 'epic', price: 1400,
    css: 'radial-gradient(circle,#78350f 20%,transparent 22%) 0 0/52px 52px,radial-gradient(circle,#78350f 20%,transparent 22%) 26px 26px/52px 52px,linear-gradient(160deg,#f59e0b,#d97706)' },
  { id: 'th-giraffe', name: 'Giraff',       rarity: 'epic', price: 1400,
    css: 'radial-gradient(circle,#92400e 38%,transparent 40%) 0 0/70px 70px,radial-gradient(circle,#92400e 38%,transparent 40%) 35px 35px/70px 70px,#fcd34d' },

  // ── Färg & form ─────────────────────────────────────────────────────────────
  { id: 'th-dots',    name: 'Prickar',      rarity: 'common', price: 350,
    css: 'radial-gradient(circle,#ffffff 22%,transparent 24%) 0 0/30px 30px,linear-gradient(160deg,#2563eb,#1e40af)' },
  { id: 'th-checker', name: 'Schackrutor',  rarity: 'common', price: 350,
    css: 'conic-gradient(#1f2937 90deg,#374151 90deg 180deg,#1f2937 180deg 270deg,#374151 270deg) 0 0/54px 54px' },
  { id: 'th-camo',    name: 'Kamouflage',   rarity: 'rare', price: 700,
    css: 'radial-gradient(circle at 20% 30%,#3f6212 0 34px,transparent 36px),radial-gradient(circle at 72% 62%,#1a2e05 0 42px,transparent 44px),radial-gradient(circle at 50% 92%,#4d7c0f 0 32px,transparent 34px),#65a30d' },
  { id: 'th-disco',   name: 'Disco',        rarity: 'epic', price: 1400,
    css: 'repeating-linear-gradient(45deg,#ec4899 0 22px,#8b5cf6 22px 44px,#3b82f6 44px 66px,#22c55e 66px 88px)' },
  { id: 'th-bubbles', name: 'Bubbelhav',    rarity: 'rare', price: 700,
    css: 'radial-gradient(circle at 28% 82%,rgba(255,255,255,0.35) 0 12px,transparent 14px),radial-gradient(circle at 68% 40%,rgba(255,255,255,0.28) 0 20px,transparent 22px),radial-gradient(circle at 85% 78%,rgba(255,255,255,0.3) 0 9px,transparent 11px),linear-gradient(160deg,#0369a1,#0891b2)' },

  // ── Regnbåge & galax ────────────────────────────────────────────────────────
  { id: 'th-rainbow', name: 'Regnbåge',     rarity: 'epic', price: 1600,
    css: 'linear-gradient(135deg,#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#8b5cf6)' },
  { id: 'th-galaxy',  name: 'Galax',        rarity: 'epic', price: 1600,
    css: 'radial-gradient(circle,#ffffff 1px,transparent 2px) 0 0/42px 42px,radial-gradient(circle,#ffffff 1px,transparent 2px) 21px 21px/64px 64px,linear-gradient(160deg,#1e1b4b,#4c1d95,#312e81)' },

  // ── Animerade (legendariska) ──────────────────────────────────────────────────
  { id: 'th-rainbow-flow', name: 'Regnbågsvirvel', rarity: 'legendary', price: 3500, animated: true,
    css: 'linear-gradient(60deg,#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#8b5cf6,#ef4444)' },
  { id: 'th-aurora', name: 'Norrsken',      rarity: 'legendary', price: 3500, animated: true,
    css: 'linear-gradient(120deg,#042f2e,#065f46,#1e3a8a,#4c1d95,#065f46)' },
];

export const BACKGROUND_MAP: Record<string, ShopBackground> = Object.fromEntries(
  SHOP_BACKGROUNDS.map(b => [b.id, b])
);

// ─── Effekter (animerade partiklar på profilen) ─────────────────────────────────
export type EffectMotion = 'fall' | 'rise' | 'twinkle';

export interface ShopEffect {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  emoji: string;
  motion: EffectMotion;
  count: number;
}

export const SHOP_EFFECTS: ShopEffect[] = [
  { id: 'fx-snow',    name: 'Snöfall',       rarity: 'common', price: 100, emoji: '❄️', motion: 'fall',   count: 16 },
  { id: 'fx-rain',    name: 'Regn',          rarity: 'common', price: 100, emoji: '💧', motion: 'fall',   count: 18 },
  { id: 'fx-bubbles', name: 'Bubblor',       rarity: 'common', price: 100, emoji: '🫧', motion: 'rise',   count: 14 },
  { id: 'fx-confetti',name: 'Konfetti',      rarity: 'rare', price: 700, emoji: '🎊', motion: 'fall',   count: 18 },
  { id: 'fx-hearts',  name: 'Hjärtan',       rarity: 'rare', price: 700, emoji: '💕', motion: 'rise',   count: 14 },
  { id: 'fx-sparkle', name: 'Stjärnglitter', rarity: 'rare', price: 800, emoji: '✨', motion: 'twinkle', count: 16 },
  { id: 'fx-leaves',  name: 'Höstlöv',       rarity: 'rare', price: 800, emoji: '🍂', motion: 'fall',   count: 14 },
  { id: 'fx-petals',  name: 'Körsbärsblom',  rarity: 'rare', price: 800, emoji: '🌸', motion: 'fall',   count: 14 },
  { id: 'fx-fire',    name: 'Gnistor',       rarity: 'epic', price: 1600, emoji: '🔥', motion: 'rise',   count: 14 },
  { id: 'fx-stars',   name: 'Stjärnstoft',   rarity: 'epic', price: 1600, emoji: '🌟', motion: 'twinkle', count: 16 },
  { id: 'fx-shooting',name: 'Stjärnfall',    rarity: 'legendary', price: 3000, emoji: '🌠', motion: 'fall', count: 12 },
];

export const EFFECT_MAP: Record<string, ShopEffect> = Object.fromEntries(
  SHOP_EFFECTS.map(e => [e.id, e])
);
