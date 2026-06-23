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

// Avatarer
export type AvatarGroup =
  | 'Utvalda' | 'Djur' | 'Skoltema' | 'Fordon' | 'Fantasi' | 'Roligt' | 'Säsong';

export interface ShopAvatar {
  emoji: string;
  name: string;
  rarity: Rarity;
  price: number;
  group: AvatarGroup;
}

export const AVATAR_GROUP_ORDER: AvatarGroup[] = [
  'Utvalda', 'Djur', 'Skoltema', 'Fordon', 'Fantasi', 'Roligt', 'Säsong',
];

// OBS: lägg ALLTID till nya avatarer sist – köp sparas som index
export const SHOP_AVATARS: ShopAvatar[] = [
  // Utvalda (featured)
  { emoji: '🎨', name: 'Konstnärssjälen', rarity: 'rare', price: 400, group: 'Utvalda' },
  { emoji: '🤖', name: 'Cyborgen', rarity: 'rare', price: 400, group: 'Utvalda' },
  { emoji: '🎮', name: 'Pixelhjälten', rarity: 'rare', price: 400, group: 'Utvalda' },
  { emoji: '👾', name: 'Retrofiguren', rarity: 'rare', price: 400, group: 'Utvalda' },

  // Djur
  { emoji: '🐶', name: 'Valpen', rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐱', name: 'Kattungen', rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐰', name: 'Kaninen', rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐥', name: 'Kycklingen', rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐧', name: 'Pingvinen', rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🐨', name: 'Koalan', rarity: 'common', price: 150, group: 'Djur' },
  { emoji: '🦓', name: 'Zebran', rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦒', name: 'Giraffen', rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦔', name: 'Igelkotten', rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦦', name: 'Uttern', rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦥', name: 'Sengångaren', rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦉', name: 'Ugglan', rarity: 'rare', price: 400, group: 'Djur' },
  { emoji: '🦚', name: 'Påfågeln', rarity: 'epic', price: 1000, group: 'Djur' },
  { emoji: '🦩', name: 'Flamingon', rarity: 'epic', price: 1000, group: 'Djur' },
  { emoji: '🐬', name: 'Delfinen', rarity: 'rare', price: 400, group: 'Djur' },

  // Skoltema
  { emoji: '🐛', name: 'Bokmasken', rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🔢', name: 'Mattesnillet', rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🎨', name: 'Konstnären', rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🎵', name: 'Musikstjärnan', rarity: 'common', price: 150, group: 'Skoltema' },
  { emoji: '🔬', name: 'Vetenskapsgeniet', rarity: 'rare', price: 400, group: 'Skoltema' },
  { emoji: '📚', name: 'Språkmästaren', rarity: 'rare', price: 400, group: 'Skoltema' },
  { emoji: '📖', name: 'Bibliotekarien', rarity: 'rare', price: 400, group: 'Skoltema' },
  { emoji: '💡', name: 'Uppfinnaren', rarity: 'rare', price: 400, group: 'Skoltema' },

  // Fordon
  { emoji: '🚗', name: 'Bilen', rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚙', name: 'Stadsjeepen', rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚕', name: 'Taxin', rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚌', name: 'Bussen', rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🚲', name: 'Cykeln', rarity: 'common', price: 150, group: 'Fordon' },
  { emoji: '🛻', name: 'Pickupen', rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🏍️', name: 'Motorcykeln', rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🚓', name: 'Polisbilen', rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🚑', name: 'Ambulansen', rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🚒', name: 'Brandbilen', rarity: 'rare', price: 400, group: 'Fordon' },
  { emoji: '🏎️', name: 'Racerbilen', rarity: 'legendary', price: 2500, group: 'Fordon' },

  // Fantasi
  { emoji: '🐲', name: 'Drakungen', rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '🧞', name: 'Anden', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🧚', name: 'Älvan', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🧛', name: 'Vampyren', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🦹', name: 'Superskurken', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🐦‍🔥', name: 'Fenix', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🐉', name: 'Elddrake', rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '🧊', name: 'Ismagiker', rarity: 'epic', price: 1000, group: 'Fantasi' },
  { emoji: '⏳', name: 'Tidsresenär', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '🌈', name: 'Regnbågsväktare', rarity: 'legendary', price: 2500, group: 'Fantasi' },
  { emoji: '💎', name: 'Diamantdrake', rarity: 'mythic', price: 5000, group: 'Fantasi' },
  { emoji: '💫', name: 'Galaxhjälte', rarity: 'mythic', price: 5000, group: 'Fantasi' },
  { emoji: '🔮', name: 'Legendarisk trollkarl', rarity: 'mythic', price: 5000, group: 'Fantasi' },

  // Roligt
  { emoji: '🥔', name: 'Potatis med solglasögon', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🌮', name: 'Dansande taco', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍌', name: 'Flygande banan', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🧟', name: 'Zombie med läsglasögon', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🥒', name: 'Sur gurka', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🥦', name: 'Broccolisuperhjälte', rarity: 'rare', price: 400, group: 'Roligt' },

  // Säsong
  { emoji: '🐇', name: 'Påskhare', rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '🏴‍☠️', name: 'Sommarpirat', rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '👻', name: 'Halloween-spöke', rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '🎅', name: 'Jultomte', rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '⛄', name: 'Snögubbe', rarity: 'rare', price: 400, group: 'Säsong' },
  { emoji: '💐', name: 'Midsommarfigur', rarity: 'rare', price: 400, group: 'Säsong' },
];

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
