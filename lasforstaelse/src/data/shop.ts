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
  { emoji: '🍕', name: 'Pizzaninja', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍩', name: 'Munkmonster', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🧀', name: 'Ost med attityd', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍔', name: 'Hamburgarbossen', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🌭', name: 'Korvlegenden', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🥑', name: 'Avokadohipstern', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🍿', name: 'Popcornpartyt', rarity: 'rare', price: 400, group: 'Roligt' },
  { emoji: '🧁', name: 'Cupcakekungen', rarity: 'epic', price: 1000, group: 'Roligt' },
  { emoji: '🍪', name: 'Kakgansen', rarity: 'epic', price: 1000, group: 'Roligt' },
  { emoji: '🍝', name: 'Spagettimonstret', rarity: 'epic', price: 1000, group: 'Roligt' },
  { emoji: '🥞', name: 'Pannkaksprinsen', rarity: 'legendary', price: 2500, group: 'Roligt' },
  { emoji: '🦷', name: 'Tandfeansen', rarity: 'legendary', price: 2500, group: 'Roligt' },

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
export interface ShopTheme {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  background: string;  // CSS-bakgrund för hela appen (ljust läge)
  swatch: string;      // liten förhandsvisning i butiken
}

export const SHOP_THEMES: ShopTheme[] = [
  { id: 'ocean',   name: 'Havsdjup',    rarity: 'common',    price: 300,
    background: 'linear-gradient(160deg,#e0f2fe 0%,#bae6fd 55%,#7dd3fc 100%)',
    swatch: 'linear-gradient(135deg,#bae6fd,#38bdf8)' },
  { id: 'sunset',  name: 'Solnedgång',  rarity: 'common',    price: 300,
    background: 'linear-gradient(160deg,#fff7ed 0%,#fed7aa 50%,#fdba74 100%)',
    swatch: 'linear-gradient(135deg,#fdba74,#fb7185)' },
  { id: 'forest',  name: 'Trollskog',   rarity: 'rare',      price: 700,
    background: 'linear-gradient(160deg,#ecfdf5 0%,#bbf7d0 55%,#86efac 100%)',
    swatch: 'linear-gradient(135deg,#86efac,#059669)' },
  { id: 'candy',   name: 'Godislandet', rarity: 'rare',      price: 700,
    background: 'linear-gradient(160deg,#fdf2f8 0%,#fbcfe8 50%,#f9a8d4 100%)',
    swatch: 'linear-gradient(135deg,#f9a8d4,#ec4899)' },
  { id: 'lavender',name: 'Lavendeldröm',rarity: 'epic',      price: 1500,
    background: 'linear-gradient(160deg,#f5f3ff 0%,#ddd6fe 50%,#c4b5fd 100%)',
    swatch: 'linear-gradient(135deg,#c4b5fd,#7c3aed)' },
  { id: 'galaxy',  name: 'Rymden',      rarity: 'legendary', price: 3200,
    background: 'linear-gradient(160deg,#312e81 0%,#1e1b4b 50%,#0f172a 100%)',
    swatch: 'linear-gradient(135deg,#6366f1,#0f172a)' },

  // --- Djurmönster ---
  { id: 'zebra', name: 'Zebra', rarity: 'rare', price: 800,
    background: 'repeating-linear-gradient(60deg,#1f2937 0 22px,#f8fafc 22px 44px)',
    swatch: 'repeating-linear-gradient(60deg,#1f2937 0 8px,#f8fafc 8px 16px)' },
  { id: 'tiger', name: 'Tiger', rarity: 'rare', price: 800,
    background: 'repeating-linear-gradient(75deg,#1c1917 0 8px,transparent 8px 34px),linear-gradient(160deg,#fb923c,#f97316)',
    swatch: 'repeating-linear-gradient(75deg,#1c1917 0 4px,transparent 4px 14px),linear-gradient(160deg,#fb923c,#f97316)' },
  { id: 'leopard', name: 'Leopard', rarity: 'epic', price: 1600,
    background: 'radial-gradient(circle,transparent 26%,#7c2d12 28% 42%,transparent 44%) 0 0 / 46px 46px,radial-gradient(circle,transparent 26%,#92400e 28% 42%,transparent 44%) 23px 23px / 46px 46px,#f3e3bf',
    swatch: 'radial-gradient(circle,transparent 26%,#7c2d12 28% 42%,transparent 44%) 0 0 / 22px 22px,radial-gradient(circle,transparent 26%,#92400e 28% 42%,transparent 44%) 11px 11px / 22px 22px,#f3e3bf' },
  { id: 'cow', name: 'Ko', rarity: 'rare', price: 800,
    background: 'radial-gradient(ellipse 42px 30px at 25% 30%,#1f2937 60%,transparent 62%) 0 0 / 120px 120px,radial-gradient(ellipse 52px 36px at 78% 72%,#1f2937 60%,transparent 62%) 0 0 / 120px 120px,#ffffff',
    swatch: 'radial-gradient(ellipse 16px 12px at 28% 32%,#1f2937 60%,transparent 62%) 0 0 / 40px 40px,radial-gradient(ellipse 18px 12px at 76% 70%,#1f2937 60%,transparent 62%) 0 0 / 40px 40px,#ffffff' },
  { id: 'bee', name: 'Humla', rarity: 'rare', price: 800,
    background: 'repeating-linear-gradient(45deg,#facc15 0 24px,#1f2937 24px 48px)',
    swatch: 'repeating-linear-gradient(45deg,#facc15 0 9px,#1f2937 9px 18px)' },

  // --- Regnbåge & drömskt ---
  { id: 'rainbow', name: 'Regnbåge', rarity: 'epic', price: 1600,
    background: 'linear-gradient(135deg,#fecaca,#fed7aa,#fef08a,#bbf7d0,#bae6fd,#ddd6fe)',
    swatch: 'linear-gradient(135deg,#fecaca,#fef08a,#bbf7d0,#bae6fd,#ddd6fe)' },
  { id: 'unicorn', name: 'Enhörning', rarity: 'legendary', price: 3500,
    background: 'linear-gradient(160deg,#fbcfe8 0%,#ddd6fe 35%,#bae6fd 70%,#bbf7d0 100%)',
    swatch: 'linear-gradient(160deg,#fbcfe8,#ddd6fe,#bae6fd,#bbf7d0)' },
  { id: 'candystripe', name: 'Godisränder', rarity: 'rare', price: 800,
    background: 'repeating-linear-gradient(45deg,#f9a8d4 0 20px,#fff1f2 20px 40px)',
    swatch: 'repeating-linear-gradient(45deg,#f9a8d4 0 8px,#fff1f2 8px 16px)' },

  // --- Mönster & former ---
  { id: 'dots', name: 'Prickigt', rarity: 'common', price: 400,
    background: 'radial-gradient(#f472b6 20%,transparent 22%) 0 0 / 36px 36px,radial-gradient(#60a5fa 20%,transparent 22%) 18px 18px / 36px 36px,#fef9ff',
    swatch: 'radial-gradient(#f472b6 20%,transparent 22%) 0 0 / 16px 16px,radial-gradient(#60a5fa 20%,transparent 22%) 8px 8px / 16px 16px,#fef9ff' },
  { id: 'checker', name: 'Rutigt', rarity: 'common', price: 400,
    background: 'repeating-conic-gradient(#e0e7ff 0% 25%,#c7d2fe 0% 50%) 0 0 / 48px 48px',
    swatch: 'repeating-conic-gradient(#e0e7ff 0% 25%,#c7d2fe 0% 50%) 0 0 / 20px 20px' },
  { id: 'waves', name: 'Vågor', rarity: 'rare', price: 800,
    background: 'radial-gradient(circle at 50% 0,#7dd3fc 25%,transparent 26%) 0 0 / 30px 15px,radial-gradient(circle at 50% 100%,#bae6fd 25%,transparent 26%) 15px 8px / 30px 15px,#e0f2fe',
    swatch: 'radial-gradient(circle at 50% 0,#7dd3fc 25%,transparent 26%) 0 0 / 16px 8px,radial-gradient(circle at 50% 100%,#bae6fd 25%,transparent 26%) 8px 4px / 16px 8px,#e0f2fe' },
  { id: 'hearts', name: 'Hjärtan', rarity: 'rare', price: 800,
    background: "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3E%3Cpath%20d='M20,32C20,32,6,23,6,14C6,9,10,7,13,7C16,7,19,10,20,12C21,10,24,7,27,7C30,7,34,9,34,14C34,23,20,32,20,32Z'%20fill='%23fb7185'/%3E%3C/svg%3E\") 0 0 / 40px 40px,#fff1f2",
    swatch: "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3E%3Cpath%20d='M20,32C20,32,6,23,6,14C6,9,10,7,13,7C16,7,19,10,20,12C21,10,24,7,27,7C30,7,34,9,34,14C34,23,20,32,20,32Z'%20fill='%23fb7185'/%3E%3C/svg%3E\") 0 0 / 28px 28px,#fff1f2" },
  { id: 'starry', name: 'Stjärnhimmel', rarity: 'epic', price: 1600,
    background: 'radial-gradient(1.6px 1.6px at 18px 24px,#fff,transparent) 0 0 / 90px 90px,radial-gradient(1.4px 1.4px at 55px 60px,#fff,transparent) 0 0 / 90px 90px,radial-gradient(1px 1px at 78px 30px,#e0e7ff,transparent) 0 0 / 90px 90px,radial-gradient(1.6px 1.6px at 35px 80px,#fff,transparent) 0 0 / 90px 90px,radial-gradient(1px 1px at 5px 55px,#c7d2fe,transparent) 0 0 / 90px 90px,linear-gradient(160deg,#1e1b4b,#0f172a)',
    swatch: 'radial-gradient(1px 1px at 6px 8px,#fff,transparent) 0 0 / 18px 18px,radial-gradient(1px 1px at 13px 14px,#fff,transparent) 0 0 / 18px 18px,linear-gradient(160deg,#1e1b4b,#0f172a)' },
  { id: 'pixel', name: 'Pixel', rarity: 'rare', price: 800,
    background: 'linear-gradient(rgba(79,70,229,0.18) 1px,transparent 1px) 0 0 / 18px 18px,linear-gradient(90deg,rgba(79,70,229,0.18) 1px,transparent 1px) 0 0 / 18px 18px,#eef2ff',
    swatch: 'linear-gradient(rgba(79,70,229,0.30) 1px,transparent 1px) 0 0 / 9px 9px,linear-gradient(90deg,rgba(79,70,229,0.30) 1px,transparent 1px) 0 0 / 9px 9px,#eef2ff' },
];

export const THEME_MAP: Record<string, ShopTheme> = Object.fromEntries(
  SHOP_THEMES.map(t => [t.id, t])
);
