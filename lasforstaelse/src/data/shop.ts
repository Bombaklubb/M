// Butik (Shop) catalog for Läsjakten
// Allt som går att köpa med poäng. Rent kosmetiskt.
// Poäng som spenderas dras från en separat "plånbok"
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

/**
 * Sällsynthetens utseende i butiken.
 *
 * Alla kort såg likadana ut förut: vit ruta, samma kant, samma skugga. Att en
 * legendarisk vara kostade tio gånger mer syntes bara i priset, och för en elev
 * som ännu inte läser siffror snabbt fanns ingen skillnad alls. Här får varje
 * steg en egen färg på både kanten, skenet och plattan bakom varan, så att
 * skillnaden går att se på håll.
 *
 * Färgen är aldrig ensam bärare av information – texten i chipet säger samma
 * sak, vilket krävs för den som inte skiljer färgerna åt.
 */
export const RARITY_STYLE: Record<Rarity, {
  /** Bakgrund på plattan bakom varan. */
  pedestal: string;
  /** Kortets kantfärg. */
  border: string;
  /** Sken runt kortet. */
  glow: string;
  /** Färg på priset i ljust läge. Mörk nog för 4,5:1 mot vitt kort. */
  accent: string;
  /**
   * Samma accent för mörkt läge. Behövs som eget värde: färgen sätts som
   * inline-stil, och en inline-stil går inte att åsidosätta med Tailwinds
   * dark:-klasser. Utan den blev priset nästan osynligt på ett mörkt kort.
   */
  accentDark: string;
  /** Strålkastaren bakom varan på plattan. */
  spot: string;
}> = {
  common: {
    pedestal: 'linear-gradient(150deg,#f8fafc,#e2e8f0)',
    border: 'rgba(100,116,139,0.30)',
    glow: 'rgba(100,116,139,0.14)',
    accent: '#475569',
    accentDark: '#cbd5e1',
    spot: 'rgba(255,255,255,0.95)',
  },
  rare: {
    pedestal: 'linear-gradient(150deg,#eff6ff,#bfdbfe)',
    border: 'rgba(59,130,246,0.45)',
    glow: 'rgba(59,130,246,0.20)',
    accent: '#1d4ed8',
    accentDark: '#93c5fd',
    spot: 'rgba(96,165,250,0.50)',
  },
  epic: {
    pedestal: 'linear-gradient(150deg,#faf5ff,#e9d5ff)',
    border: 'rgba(168,85,247,0.45)',
    glow: 'rgba(168,85,247,0.22)',
    accent: '#7e22ce',
    accentDark: '#d8b4fe',
    spot: 'rgba(192,132,252,0.55)',
  },
  legendary: {
    pedestal: 'linear-gradient(150deg,#fffbeb,#fde68a)',
    border: 'rgba(245,158,11,0.55)',
    glow: 'rgba(245,158,11,0.28)',
    accent: '#b45309',
    accentDark: '#fcd34d',
    spot: 'rgba(251,191,36,0.60)',
  },
  mythic: {
    pedestal: 'linear-gradient(150deg,#fdf4ff,#fbcfe8 45%,#fde68a)',
    border: 'rgba(217,70,239,0.55)',
    glow: 'rgba(217,70,239,0.30)',
    accent: '#a21caf',
    accentDark: '#f0abfc',
    spot: 'rgba(232,121,249,0.55)',
  },
};

// Avatarer
export type AvatarGroup =
  | 'Utvalda' | 'Djur' | 'Skoltema' | 'Fordon' | 'Fantasi' | 'Roligt' | 'Säsong';

export interface ShopAvatar {
  id: string;
  emoji: string;
  name: string;
  rarity: Rarity;
  price: number;
  group: AvatarGroup;
}

export const AVATAR_GROUP_ORDER: AvatarGroup[] = [
  'Utvalda', 'Djur', 'Skoltema', 'Fordon', 'Fantasi', 'Roligt', 'Säsong',
];

// Ägande sparas via stabilt id (inte array-index), så ordningen här kan ändras fritt.
export const SHOP_AVATARS: ShopAvatar[] = [
  // Utvalda (featured)
  { id: 'konstnarssjalen', emoji: '🎨', name: 'Konstnärssjälen', rarity: 'rare', price: 400, group: 'Utvalda' },
  { id: 'cyborgen', emoji: '🤖', name: 'Cyborgen', rarity: 'rare', price: 400, group: 'Utvalda' },
  { id: 'pixelhjalten', emoji: '🎮', name: 'Pixelhjälten', rarity: 'rare', price: 400, group: 'Utvalda' },
  { id: 'retrofiguren', emoji: '👾', name: 'Retrofiguren', rarity: 'rare', price: 400, group: 'Utvalda' },

  // Djur
  { id: 'valpen', emoji: '🐶', name: 'Valpen', rarity: 'common', price: 150, group: 'Djur' },
  { id: 'kattungen', emoji: '🐱', name: 'Kattungen', rarity: 'common', price: 150, group: 'Djur' },
  { id: 'kaninen', emoji: '🐰', name: 'Kaninen', rarity: 'common', price: 150, group: 'Djur' },
  { id: 'kycklingen', emoji: '🐥', name: 'Kycklingen', rarity: 'common', price: 150, group: 'Djur' },
  { id: 'pingvinen', emoji: '🐧', name: 'Pingvinen', rarity: 'common', price: 150, group: 'Djur' },
  { id: 'koalan', emoji: '🐨', name: 'Koalan', rarity: 'common', price: 150, group: 'Djur' },
  { id: 'zebran', emoji: '🦓', name: 'Zebran', rarity: 'rare', price: 400, group: 'Djur' },
  { id: 'giraffen', emoji: '🦒', name: 'Giraffen', rarity: 'rare', price: 400, group: 'Djur' },
  { id: 'igelkotten', emoji: '🦔', name: 'Igelkotten', rarity: 'rare', price: 400, group: 'Djur' },
  { id: 'uttern', emoji: '🦦', name: 'Uttern', rarity: 'rare', price: 400, group: 'Djur' },
  { id: 'sengangaren', emoji: '🦥', name: 'Sengångaren', rarity: 'rare', price: 400, group: 'Djur' },
  { id: 'ugglan', emoji: '🦉', name: 'Ugglan', rarity: 'rare', price: 400, group: 'Djur' },
  { id: 'pafageln', emoji: '🦚', name: 'Påfågeln', rarity: 'epic', price: 1000, group: 'Djur' },
  { id: 'flamingon', emoji: '🦩', name: 'Flamingon', rarity: 'epic', price: 1000, group: 'Djur' },
  { id: 'delfinen', emoji: '🐬', name: 'Delfinen', rarity: 'rare', price: 400, group: 'Djur' },

  // Skoltema
  { id: 'bokmasken', emoji: '🐛', name: 'Bokmasken', rarity: 'common', price: 150, group: 'Skoltema' },
  { id: 'mattesnillet', emoji: '🔢', name: 'Mattesnillet', rarity: 'common', price: 150, group: 'Skoltema' },
  { id: 'konstnaren', emoji: '🖌️', name: 'Konstnären', rarity: 'common', price: 150, group: 'Skoltema' },
  { id: 'musikstjarnan', emoji: '🎵', name: 'Musikstjärnan', rarity: 'common', price: 150, group: 'Skoltema' },
  { id: 'vetenskapsgeniet', emoji: '🔬', name: 'Vetenskapsgeniet', rarity: 'rare', price: 400, group: 'Skoltema' },
  { id: 'sprakmastaren', emoji: '📚', name: 'Språkmästaren', rarity: 'rare', price: 400, group: 'Skoltema' },
  { id: 'bibliotekarien', emoji: '📖', name: 'Bibliotekarien', rarity: 'rare', price: 400, group: 'Skoltema' },
  { id: 'uppfinnaren', emoji: '💡', name: 'Uppfinnaren', rarity: 'rare', price: 400, group: 'Skoltema' },

  // Fordon
  { id: 'bilen', emoji: '🚗', name: 'Bilen', rarity: 'common', price: 150, group: 'Fordon' },
  { id: 'stadsjeepen', emoji: '🚙', name: 'Stadsjeepen', rarity: 'common', price: 150, group: 'Fordon' },
  { id: 'taxin', emoji: '🚕', name: 'Taxin', rarity: 'common', price: 150, group: 'Fordon' },
  { id: 'bussen', emoji: '🚌', name: 'Bussen', rarity: 'common', price: 150, group: 'Fordon' },
  { id: 'cykeln', emoji: '🚲', name: 'Cykeln', rarity: 'common', price: 150, group: 'Fordon' },
  { id: 'pickupen', emoji: '🛻', name: 'Pickupen', rarity: 'rare', price: 400, group: 'Fordon' },
  { id: 'motorcykeln', emoji: '🏍️', name: 'Motorcykeln', rarity: 'rare', price: 400, group: 'Fordon' },
  { id: 'polisbilen', emoji: '🚓', name: 'Polisbilen', rarity: 'rare', price: 400, group: 'Fordon' },
  { id: 'ambulansen', emoji: '🚑', name: 'Ambulansen', rarity: 'rare', price: 400, group: 'Fordon' },
  { id: 'brandbilen', emoji: '🚒', name: 'Brandbilen', rarity: 'rare', price: 400, group: 'Fordon' },
  { id: 'racerbilen', emoji: '🏎️', name: 'Racerbilen', rarity: 'legendary', price: 2500, group: 'Fordon' },

  // Fantasi
  { id: 'drakungen', emoji: '🐲', name: 'Drakungen', rarity: 'epic', price: 1000, group: 'Fantasi' },
  { id: 'anden', emoji: '🧞', name: 'Anden', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { id: 'alvan', emoji: '🧚', name: 'Älvan', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { id: 'vampyren', emoji: '🧛', name: 'Vampyren', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { id: 'superskurken', emoji: '🦹', name: 'Superskurken', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { id: 'fenix', emoji: '🐦‍🔥', name: 'Fenix', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { id: 'elddrake', emoji: '🐉', name: 'Elddrake', rarity: 'epic', price: 1000, group: 'Fantasi' },
  { id: 'ismagiker', emoji: '🧊', name: 'Ismagiker', rarity: 'epic', price: 1000, group: 'Fantasi' },
  { id: 'tidsresenar', emoji: '⏳', name: 'Tidsresenär', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { id: 'regnbagsvaktare', emoji: '🌈', name: 'Regnbågsväktare', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { id: 'diamantdrake', emoji: '💎', name: 'Diamantdrake', rarity: 'mythic', price: 5000, group: 'Fantasi' },
  { id: 'galaxhjalte', emoji: '💫', name: 'Galaxhjälte', rarity: 'mythic', price: 5000, group: 'Fantasi' },
  { id: 'legendarisk-trollkarl', emoji: '🔮', name: 'Legendarisk trollkarl', rarity: 'mythic', price: 5000, group: 'Fantasi' },

  // Roligt
  { id: 'potatis-med-solglasogon', emoji: '🥔', name: 'Potatis med solglasögon', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'dansande-taco', emoji: '🌮', name: 'Dansande taco', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'flygande-banan', emoji: '🍌', name: 'Flygande banan', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'zombie-med-lasglasogon', emoji: '🧟', name: 'Zombie med läsglasögon', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'sur-gurka', emoji: '🥒', name: 'Sur gurka', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'broccolisuperhjalte', emoji: '🥦', name: 'Broccolisuperhjälte', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'pizzaninja', emoji: '🍕', name: 'Pizzaninja', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'munkmonster', emoji: '🍩', name: 'Munkmonster', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'ost-med-attityd', emoji: '🧀', name: 'Ost med attityd', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'hamburgarbossen', emoji: '🍔', name: 'Hamburgarbossen', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'korvlegenden', emoji: '🌭', name: 'Korvlegenden', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'avokadohipstern', emoji: '🥑', name: 'Avokadohipstern', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'popcornpartyt', emoji: '🍿', name: 'Popcornpartyt', rarity: 'rare', price: 400, group: 'Roligt' },
  { id: 'cupcakekungen', emoji: '🧁', name: 'Cupcakekungen', rarity: 'epic', price: 1000, group: 'Roligt' },
  { id: 'kakgansen', emoji: '🍪', name: 'Kakgansen', rarity: 'epic', price: 1000, group: 'Roligt' },
  { id: 'spagettimonstret', emoji: '🍝', name: 'Spagettimonstret', rarity: 'epic', price: 1000, group: 'Roligt' },
  { id: 'pannkaksprinsen', emoji: '🥞', name: 'Pannkaksprinsen', rarity: 'legendary', price: 2500, group: 'Roligt' },
  { id: 'tandfeansen', emoji: '🦷', name: 'Tandfeansen', rarity: 'legendary', price: 2500, group: 'Roligt' },

  // Säsong
  { id: 'paskhare', emoji: '🐇', name: 'Påskhare', rarity: 'rare', price: 400, group: 'Säsong' },
  { id: 'sommarpirat', emoji: '🏴‍☠️', name: 'Sommarpirat', rarity: 'rare', price: 400, group: 'Säsong' },
  { id: 'halloween-spoke', emoji: '👻', name: 'Halloween-spöke', rarity: 'rare', price: 400, group: 'Säsong' },
  { id: 'jultomte', emoji: '🎅', name: 'Jultomte', rarity: 'rare', price: 400, group: 'Säsong' },
  { id: 'snogubbe', emoji: '⛄', name: 'Snögubbe', rarity: 'rare', price: 400, group: 'Säsong' },
  { id: 'midsommarfigur', emoji: '💐', name: 'Midsommarfigur', rarity: 'rare', price: 400, group: 'Säsong' },
];

export const AVATAR_MAP: Record<string, ShopAvatar> = Object.fromEntries(
  SHOP_AVATARS.map(a => [a.id, a])
);

// Ramar (avatar-frames)
export interface ShopFrame {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  ring: string;
  glow: string;
  animated?: boolean;
}

export const SHOP_FRAMES: ShopFrame[] = [
  { id: 'amber', name: 'Bronsring', rarity: 'common', price: 250,
    ring: 'linear-gradient(135deg,#fbbf24,#b45309)', glow: 'rgba(245,158,11,0.6)' },
  { id: 'ocean', name: 'Havsring', rarity: 'common', price: 250,
    ring: 'linear-gradient(135deg,#38bdf8,#1d4ed8)', glow: 'rgba(56,189,248,0.6)' },
  { id: 'emerald', name: 'Smaragdring', rarity: 'rare', price: 700,
    ring: 'linear-gradient(135deg,#34d399,#047857)', glow: 'rgba(16,185,129,0.6)' },
  { id: 'sunset', name: 'Solnedgång', rarity: 'rare', price: 700,
    ring: 'linear-gradient(135deg,#fb7185,#f59e0b)', glow: 'rgba(251,113,133,0.6)' },
  { id: 'royal', name: 'Kunglig ring', rarity: 'epic', price: 1600,
    ring: 'linear-gradient(135deg,#a78bfa,#6d28d9)', glow: 'rgba(167,139,250,0.7)' },
  { id: 'gold', name: 'Guldlyx', rarity: 'epic', price: 1600,
    ring: 'linear-gradient(135deg,#fde047,#b45309)', glow: 'rgba(250,204,21,0.75)' },
  { id: 'rainbow', name: 'Regnbåge', rarity: 'legendary', price: 3500, animated: true,
    ring: 'conic-gradient(from 0deg,#f87171,#fbbf24,#34d399,#38bdf8,#a78bfa,#f87171)', glow: 'rgba(255,255,255,0.6)' },
  { id: 'cosmic', name: 'Kosmisk ring', rarity: 'legendary', price: 3500, animated: true,
    ring: 'conic-gradient(from 0deg,#22d3ee,#a78bfa,#ec4899,#22d3ee)', glow: 'rgba(167,139,250,0.8)' },
];

export const FRAME_MAP: Record<string, ShopFrame> = Object.fromEntries(
  SHOP_FRAMES.map(f => [f.id, f])
);

// Effekter (avatar-effects) – animerade partiklar runt avataren
export type EffectKind = 'twinkle' | 'rise' | 'fall' | 'flash' | 'burst' | 'pulse';

export interface ShopEffect {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  emoji: string;       // partikel-emoji som ringlar runt avataren
  kind: EffectKind;    // vilken animation partiklarna använder
  glow: string;        // sken bakom avataren
}

export const SHOP_EFFECTS: ShopEffect[] = [
  { id: 'stars',     name: 'Glittrande stjärnor', rarity: 'rare',      price: 500,  emoji: '✨', kind: 'twinkle', glow: 'rgba(250,204,21,0.55)' },
  { id: 'flames',    name: 'Eldlågor',            rarity: 'epic',      price: 1200, emoji: '🔥', kind: 'rise',    glow: 'rgba(249,115,22,0.60)' },
  { id: 'rainbow',   name: 'Regnbåge',            rarity: 'epic',      price: 1200, emoji: '🌈', kind: 'pulse',   glow: 'rgba(168,85,247,0.55)' },
  { id: 'lightning', name: 'Blixtar',             rarity: 'legendary', price: 2800, emoji: '⚡', kind: 'flash',   glow: 'rgba(56,189,248,0.65)' },
  { id: 'snow',      name: 'Snöflingor',          rarity: 'rare',      price: 500,  emoji: '❄️', kind: 'fall',    glow: 'rgba(125,211,252,0.55)' },
  { id: 'confetti',  name: 'Konfetti',            rarity: 'legendary', price: 2800, emoji: '🎉', kind: 'burst',   glow: 'rgba(236,72,153,0.55)' },
];

export const EFFECT_MAP: Record<string, ShopEffect> = Object.fromEntries(
  SHOP_EFFECTS.map(e => [e.id, e])
);

// Teman (themes) – byter appens bakgrund (ljust läge)
// ─── Teman ────────────────────────────────────────────────────────────────────
//
// Temana var tidigare CSS-gradienter och enkla ränder. Bredvid Grundjaktens och
// Engelskajaktens ritade scener såg de platta ut. Bilderna ritas nu som SVG i
// src/utils/themeArt.ts, samma ritmodul som Engelskajakten använder, och `art`
// är namnet på ritfunktionen.
//
// id:t är det eleverna har köpt, så ett befintligt id får aldrig ändras. De 25
// teman som fanns före omritningen behåller id, namn, sällsynthet och pris –
// bara bilden är ny. Ett enda undantag i namnet: Humla heter nu Fjärilsängen,
// eftersom den ritade bilden är en blomsteräng med fjärilar och inte randig.

export type ThemeCategory =
  | 'natur' | 'djur' | 'spel' | 'fantasy' | 'riddare' | 'anime' | 'fest' | 'monster';

export const THEME_CATEGORY_LABELS: Record<ThemeCategory, string> = {
  natur: '🌲 Natur & rymd',
  djur: '🐼 Djur',
  spel: '🎮 Spel',
  fantasy: '🐉 Fantasy',
  riddare: '🏰 Riddare',
  anime: '🌸 Anime & manga',
  fest: '🪩 Fest & sport',
  monster: '🎨 Mönster',
};

export const THEME_CATEGORY_ORDER: ThemeCategory[] = [
  'natur', 'djur', 'spel', 'fantasy', 'riddare', 'anime', 'fest', 'monster',
];

export interface ShopTheme {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  category: ThemeCategory;
  /** Ritfunktionen i themeArt.ts. */
  art?: string;
  /**
   * Äldre CSS-bakgrund, för det enda tema som saknar en ritad motsvarighet.
   * Används bara när `art` saknas.
   */
  background?: string;
}

export const SHOP_THEMES: ShopTheme[] = [
  // ── Natur & rymd ──────────────────────────────────────────────────────────
  { id: 'skog',        name: 'Skogen',          rarity: 'common',    price: 400,  category: 'natur',   art: 'skog' },
  { id: 'vinter',      name: 'Vintern',         rarity: 'common',    price: 400,  category: 'natur',   art: 'vinter' },
  { id: 'waves',       name: 'Vågor',           rarity: 'rare',      price: 800,  category: 'natur',   art: 'hav' },
  { id: 'ocean',       name: 'Havsdjup',        rarity: 'common',    price: 300,  category: 'natur',   art: 'bubbelhav' },
  { id: 'sunset',      name: 'Solnedgång',      rarity: 'common',    price: 300,  category: 'natur',   art: 'solnedgang' },
  { id: 'rainbow',     name: 'Regnbåge',        rarity: 'epic',      price: 1600, category: 'natur',   art: 'regnbage' },
  { id: 'vulkan',      name: 'Vulkanen',        rarity: 'epic',      price: 1600, category: 'natur',   art: 'lava' },
  { id: 'galax',       name: 'Galax',           rarity: 'epic',      price: 1600, category: 'natur',   art: 'galax' },
  { id: 'starry',      name: 'Stjärnhimmel',    rarity: 'epic',      price: 1600, category: 'natur',   art: 'stjarnhimmel' },
  { id: 'galaxy',      name: 'Rymden',          rarity: 'legendary', price: 3200, category: 'natur',   art: 'rymd' },
  { id: 'norrsken',    name: 'Norrsken',        rarity: 'legendary', price: 3500, category: 'natur',   art: 'norrsken' },

  // ── Djur ──────────────────────────────────────────────────────────────────
  { id: 'tassar',      name: 'Tassavtryck',     rarity: 'common',    price: 400,  category: 'djur',    art: 'tassar' },
  { id: 'zebra',       name: 'Zebra',           rarity: 'rare',      price: 800,  category: 'djur',    art: 'zebra' },
  { id: 'tiger',       name: 'Tiger',           rarity: 'rare',      price: 800,  category: 'djur',    art: 'tiger' },
  { id: 'cow',         name: 'Ko',              rarity: 'rare',      price: 800,  category: 'djur',    art: 'ko' },
  { id: 'bee',         name: 'Fjärilsängen',    rarity: 'rare',      price: 800,  category: 'djur',    art: 'fjarilar' },
  { id: 'hastar',      name: 'Hästar',          rarity: 'rare',      price: 800,  category: 'djur',    art: 'hastar' },
  { id: 'pingviner',   name: 'Pingvinisen',     rarity: 'rare',      price: 800,  category: 'djur',    art: 'pingviner' },
  { id: 'pandaskog',   name: 'Pandaskogen',     rarity: 'rare',      price: 800,  category: 'djur',    art: 'pandaskog' },
  { id: 'savann',      name: 'Savannen',        rarity: 'rare',      price: 800,  category: 'djur',    art: 'savann' },
  { id: 'leopard',     name: 'Leopard',         rarity: 'epic',      price: 1600, category: 'djur',    art: 'leopard' },
  { id: 'giraff',      name: 'Giraff',          rarity: 'epic',      price: 1600, category: 'djur',    art: 'giraff' },
  { id: 'korallrev',   name: 'Korallrevet',     rarity: 'epic',      price: 1600, category: 'djur',    art: 'korallrev' },

  // ── Spel ──────────────────────────────────────────────────────────────────
  { id: 'plattform',   name: 'Plattformsspelet',rarity: 'rare',      price: 800,  category: 'spel',    art: 'plattform' },
  { id: 'arkad',       name: 'Arkadhallen',     rarity: 'rare',      price: 800,  category: 'spel',    art: 'arkad' },
  { id: 'pixel',       name: 'Pixel',           rarity: 'rare',      price: 800,  category: 'spel',    art: 'blockvarld' },
  { id: 'tvspel',      name: 'Tv-spel',         rarity: 'epic',      price: 1600, category: 'spel',    art: 'tvspel' },
  { id: 'dataspel',    name: 'Dataspel',        rarity: 'epic',      price: 1600, category: 'spel',    art: 'dataspel' },

  // ── Fantasy ───────────────────────────────────────────────────────────────
  { id: 'forest',      name: 'Trollskog',       rarity: 'rare',      price: 700,  category: 'fantasy', art: 'trollskog' },
  { id: 'lavender',    name: 'Lavendeldröm',    rarity: 'epic',      price: 1500, category: 'fantasy', art: 'kristallgrotta' },
  { id: 'trollkarl',   name: 'Trollkarlens torn', rarity: 'epic',    price: 1600, category: 'fantasy', art: 'trollkarl' },
  { id: 'unicorn',     name: 'Enhörning',       rarity: 'legendary', price: 3500, category: 'fantasy', art: 'enhorning' },
  { id: 'drakberget',  name: 'Drakberget',      rarity: 'legendary', price: 3500, category: 'fantasy', art: 'drakberget' },
  { id: 'virvel',      name: 'Regnbågsvirvel',  rarity: 'legendary', price: 3500, category: 'fantasy', art: 'regnbagsvirvel' },

  // ── Riddare ───────────────────────────────────────────────────────────────
  { id: 'tornerspel',  name: 'Tornerspelet',    rarity: 'rare',      price: 800,  category: 'riddare', art: 'tornerspel' },
  { id: 'vapenskold',  name: 'Vapensköldar',    rarity: 'rare',      price: 800,  category: 'riddare', art: 'vapenskold' },
  { id: 'riddarborg',  name: 'Riddarborgen',    rarity: 'epic',      price: 1600, category: 'riddare', art: 'riddarborg' },
  { id: 'kungasal',    name: 'Kungasalen',      rarity: 'legendary', price: 3500, category: 'riddare', art: 'kungasal' },

  // ── Anime & manga ─────────────────────────────────────────────────────────
  { id: 'actionlinjer',name: 'Actionlinjer',    rarity: 'rare',      price: 800,  category: 'anime',   art: 'actionlinjer' },
  { id: 'mangasida',   name: 'Mangasidan',      rarity: 'rare',      price: 800,  category: 'anime',   art: 'mangaraster' },
  { id: 'serierutor',  name: 'Serierutor',      rarity: 'rare',      price: 800,  category: 'anime',   art: 'serierutor' },
  { id: 'animehimmel', name: 'Animehimmel',     rarity: 'rare',      price: 800,  category: 'anime',   art: 'animehimmel' },
  { id: 'hearts',      name: 'Hjärtan',         rarity: 'rare',      price: 800,  category: 'anime',   art: 'kawaii' },
  { id: 'sakura',      name: 'Körsbärsblom',    rarity: 'epic',      price: 1600, category: 'anime',   art: 'sakura' },
  { id: 'neonstad',    name: 'Neonstaden',      rarity: 'epic',      price: 1600, category: 'anime',   art: 'neonstad' },

  // ── Fest & sport ──────────────────────────────────────────────────────────
  { id: 'fotboll',     name: 'Fotboll',         rarity: 'rare',      price: 800,  category: 'fest',    art: 'fotboll' },
  { id: 'dans',        name: 'Dans',            rarity: 'rare',      price: 800,  category: 'fest',    art: 'dans' },
  { id: 'disco',       name: 'Disco',           rarity: 'epic',      price: 1600, category: 'fest',    art: 'disco' },

  // ── Mönster ───────────────────────────────────────────────────────────────
  { id: 'dots',        name: 'Prickigt',        rarity: 'common',    price: 400,  category: 'monster', art: 'prickigt' },
  { id: 'checker',     name: 'Rutigt',          rarity: 'common',    price: 400,  category: 'monster', art: 'rutmonster' },
  { id: 'candy',       name: 'Godislandet',     rarity: 'rare',      price: 700,  category: 'monster', art: 'godis' },
  { id: 'kamouflage',  name: 'Kamouflage',      rarity: 'rare',      price: 800,  category: 'monster', art: 'kamouflage' },
  // Godisränder har ingen ritad motsvarighet som inte redan används. Den får
  // behålla sitt randmönster hellre än att två teman visar samma bild.
  { id: 'candystripe', name: 'Godisränder',     rarity: 'rare',      price: 800,  category: 'monster',
    background: 'repeating-linear-gradient(45deg,#f9a8d4 0 20px,#fff1f2 20px 40px)' },
];

export const THEME_MAP: Record<string, ShopTheme> = Object.fromEntries(
  SHOP_THEMES.map(t => [t.id, t])
);
