// Butik (Shop) catalog for Readhunt
// Allt som går att köpa med poäng. Rent kosmetiskt.
// Poäng som spenderas dras från en separat "plånbok"
// (intjänat − spenderat), så livstidstotalen och kist-milstolparna rörs aldrig.

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

export const RARITY_RING: Record<Rarity, string> = {
  common: 'from-slate-300 to-slate-400',
  rare: 'from-sky-400 to-blue-500',
  epic: 'from-violet-400 to-fuchsia-500',
  legendary: 'from-amber-400 to-orange-500',
  mythic: 'from-fuchsia-500 via-purple-600 to-amber-400',
};

// Plattan som varan står på i affären: bakgrund (pedestal) och strålkastaren
// bakom varan (spot), båda i sällsynthetens färg.
export const RARITY_STAGE: Record<Rarity, { pedestal: string; spot: string }> = {
  common:    { pedestal: 'linear-gradient(150deg,#f8fafc,#e2e8f0)', spot: 'rgba(255,255,255,0.95)' },
  rare:      { pedestal: 'linear-gradient(150deg,#eff6ff,#bfdbfe)', spot: 'rgba(96,165,250,0.50)' },
  epic:      { pedestal: 'linear-gradient(150deg,#faf5ff,#e9d5ff)', spot: 'rgba(192,132,252,0.55)' },
  legendary: { pedestal: 'linear-gradient(150deg,#fffbeb,#fde68a)', spot: 'rgba(251,191,36,0.60)' },
  mythic:    { pedestal: 'linear-gradient(150deg,#fdf4ff,#fbcfe8 45%,#fde68a)', spot: 'rgba(232,121,249,0.55)' },
};

// Avatarer
export type AvatarGroup =
  | 'Featured' | 'Animals' | 'School' | 'Vehicles' | 'Fantasy' | 'Funny' | 'Seasons';

export interface ShopAvatar {
  emoji: string;
  name: string;
  rarity: Rarity;
  price: number;
  group: AvatarGroup;
}

export const AVATAR_GROUP_ORDER: AvatarGroup[] = [
  'Featured', 'Animals', 'School', 'Vehicles', 'Fantasy', 'Funny', 'Seasons',
];

// OBS: lägg ALLTID till nya avatarer sist – köp sparas som index
export const SHOP_AVATARS: ShopAvatar[] = [
  // Utvalda (featured)
  { emoji: '🎨', name: 'The Artist Soul', rarity: 'rare', price: 400, group: 'Featured' },
  { emoji: '🤖', name: 'The Robot', rarity: 'rare', price: 400, group: 'Featured' },
  { emoji: '🎮', name: 'The Pixel Hero', rarity: 'rare', price: 400, group: 'Featured' },
  { emoji: '👾', name: 'The Retro Alien', rarity: 'rare', price: 400, group: 'Featured' },

  // Djur
  { emoji: '🐶', name: 'The Puppy', rarity: 'common', price: 150, group: 'Animals' },
  { emoji: '🐱', name: 'The Kitten', rarity: 'common', price: 150, group: 'Animals' },
  { emoji: '🐰', name: 'The Bunny', rarity: 'common', price: 150, group: 'Animals' },
  { emoji: '🐥', name: 'The Chick', rarity: 'common', price: 150, group: 'Animals' },
  { emoji: '🐧', name: 'The Penguin', rarity: 'common', price: 150, group: 'Animals' },
  { emoji: '🐨', name: 'The Koala', rarity: 'common', price: 150, group: 'Animals' },
  { emoji: '🦓', name: 'The Zebra', rarity: 'rare', price: 400, group: 'Animals' },
  { emoji: '🦒', name: 'The Giraffe', rarity: 'rare', price: 400, group: 'Animals' },
  { emoji: '🦔', name: 'The Hedgehog', rarity: 'rare', price: 400, group: 'Animals' },
  { emoji: '🦦', name: 'The Otter', rarity: 'rare', price: 400, group: 'Animals' },
  { emoji: '🦥', name: 'The Sloth', rarity: 'rare', price: 400, group: 'Animals' },
  { emoji: '🦉', name: 'The Owl', rarity: 'rare', price: 400, group: 'Animals' },
  { emoji: '🦚', name: 'The Peacock', rarity: 'epic', price: 1000, group: 'Animals' },
  { emoji: '🦩', name: 'The Flamingo', rarity: 'epic', price: 1000, group: 'Animals' },
  { emoji: '🐬', name: 'The Dolphin', rarity: 'rare', price: 400, group: 'Animals' },

  // Skoltema
  { emoji: '🐛', name: 'The Bookworm', rarity: 'common', price: 150, group: 'School' },
  { emoji: '🧮', name: 'The Math Whiz', rarity: 'common', price: 150, group: 'School' },
  { emoji: '🖌️', name: 'The Painter', rarity: 'common', price: 150, group: 'School' }, // var 🎨, samma som The Artist Soul
  { emoji: '🎵', name: 'The Music Star', rarity: 'common', price: 150, group: 'School' },
  { emoji: '🔬', name: 'The Science Genius', rarity: 'rare', price: 400, group: 'School' },
  { emoji: '🗣️', name: 'The Language Master', rarity: 'rare', price: 400, group: 'School' },
  { emoji: '📖', name: 'The Librarian', rarity: 'rare', price: 400, group: 'School' },
  { emoji: '💡', name: 'The Inventor', rarity: 'rare', price: 400, group: 'School' },

  // Fordon
  { emoji: '🚗', name: 'The Car', rarity: 'common', price: 150, group: 'Vehicles' },
  { emoji: '🚙', name: 'The SUV', rarity: 'common', price: 150, group: 'Vehicles' },
  { emoji: '🚕', name: 'The Taxi', rarity: 'common', price: 150, group: 'Vehicles' },
  { emoji: '🚌', name: 'The Bus', rarity: 'common', price: 150, group: 'Vehicles' },
  { emoji: '🚲', name: 'The Bike', rarity: 'common', price: 150, group: 'Vehicles' },
  { emoji: '🛻', name: 'The Pickup', rarity: 'rare', price: 400, group: 'Vehicles' },
  { emoji: '🏍️', name: 'The Motorbike', rarity: 'rare', price: 400, group: 'Vehicles' },
  { emoji: '🚓', name: 'The Police Car', rarity: 'rare', price: 400, group: 'Vehicles' },
  { emoji: '🚑', name: 'The Ambulance', rarity: 'rare', price: 400, group: 'Vehicles' },
  { emoji: '🚒', name: 'The Fire Truck', rarity: 'rare', price: 400, group: 'Vehicles' },
  { emoji: '🏎️', name: 'The Race Car', rarity: 'legendary', price: 2500, group: 'Vehicles' },

  // Fantasi
  { emoji: '🐲', name: 'The Baby Dragon', rarity: 'epic', price: 1000, group: 'Fantasy' },
  { emoji: '🧞', name: 'The Genie', rarity: 'legendary', price: 2500, group: 'Fantasy' },
  { emoji: '🧚', name: 'The Fairy', rarity: 'legendary', price: 2500, group: 'Fantasy' },
  { emoji: '🧛', name: 'The Vampire', rarity: 'legendary', price: 2500, group: 'Fantasy' },
  { emoji: '🦹', name: 'The Supervillain', rarity: 'legendary', price: 2500, group: 'Fantasy' },
  { emoji: '🐦‍🔥', name: 'Phoenix', rarity: 'legendary', price: 2500, group: 'Fantasy' },
  { emoji: '🐉', name: 'Fire Dragon', rarity: 'epic', price: 1000, group: 'Fantasy' },
  { emoji: '🧊', name: 'The Magic Ice Cube', rarity: 'epic', price: 1000, group: 'Fantasy' },
  { emoji: '⏳', name: 'The Hourglass of Time', rarity: 'legendary', price: 2500, group: 'Fantasy' },
  { emoji: '🌈', name: 'Over the Rainbow', rarity: 'legendary', price: 2500, group: 'Fantasy' },
  { emoji: '💎', name: 'The Diamond', rarity: 'mythic', price: 5000, group: 'Fantasy' },
  { emoji: '💫', name: 'Stardust', rarity: 'mythic', price: 5000, group: 'Fantasy' },
  { emoji: '🔮', name: 'The Crystal Ball', rarity: 'mythic', price: 5000, group: 'Fantasy' },

  // Roligt
  { emoji: '🥔', name: 'The Couch Potato', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🌮', name: 'Taco Tuesday', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🍌', name: 'Top Banana', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🧟', name: 'Zombie on a Monday', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🥒', name: 'Cool as a Cucumber', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🥦', name: 'Mighty Broccoli', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🍕', name: 'Pizza Pal', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🍩', name: 'Donut Worry', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🧀', name: 'The Big Cheese', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🍔', name: 'The Burger Boss', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🌭', name: 'The Hot Dog Legend', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🥑', name: 'Holy Guacamole', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🍿', name: 'Popcorn Party', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🧁', name: 'Cupcake Cutie', rarity: 'epic', price: 1000, group: 'Funny' },
  { emoji: '🍪', name: 'Smart Cookie', rarity: 'epic', price: 1000, group: 'Funny' },
  { emoji: '🍝', name: 'Spaghetti Tangle', rarity: 'epic', price: 1000, group: 'Funny' },
  { emoji: '🥞', name: 'The Pancake Stack', rarity: 'legendary', price: 2500, group: 'Funny' },
  { emoji: '🦷', name: 'The Shiny Tooth', rarity: 'legendary', price: 2500, group: 'Funny' },

  // Säsong
  { emoji: '🐇', name: 'Easter Bunny', rarity: 'rare', price: 400, group: 'Seasons' },
  { emoji: '🏴‍☠️', name: 'The Pirate Flag', rarity: 'rare', price: 400, group: 'Seasons' },
  { emoji: '👻', name: 'Halloween Ghost', rarity: 'rare', price: 400, group: 'Seasons' },
  { emoji: '🎅', name: 'Santa Claus', rarity: 'rare', price: 400, group: 'Seasons' },
  { emoji: '⛄', name: 'Snowman', rarity: 'rare', price: 400, group: 'Seasons' },
  { emoji: '💐', name: 'Midsummer Flowers', rarity: 'rare', price: 400, group: 'Seasons' },

  // Fler knasiga (tillagda sist – köp sparas som index)
  { emoji: '🥸', name: 'Master of Disguise', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🤪', name: 'The Goofball', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🤡', name: 'The Silly Clown', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🍄', name: 'The Fun Guy', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🧦', name: 'The Lost Sock', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🐌', name: 'Speedy the Snail', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🥚', name: 'The Egghead', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🤓', name: 'The Know-It-All', rarity: 'rare', price: 400, group: 'Funny' },
  { emoji: '🌶️', name: 'Hot Stuff', rarity: 'epic', price: 1000, group: 'Funny' },
  { emoji: '🦙', name: 'Llama Drama', rarity: 'epic', price: 1000, group: 'Funny' },
  { emoji: '🦕', name: 'Dino-Mite', rarity: 'epic', price: 1000, group: 'Funny' },
  { emoji: '🐐', name: 'The GOAT', rarity: 'legendary', price: 2500, group: 'Funny' },
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
  { id: 'amber', name: 'Bronze Ring', rarity: 'common', price: 250,
    ring: 'linear-gradient(135deg,#fbbf24,#b45309)', glow: 'rgba(245,158,11,0.6)' },
  { id: 'ocean', name: 'Ocean Ring', rarity: 'common', price: 250,
    ring: 'linear-gradient(135deg,#38bdf8,#1d4ed8)', glow: 'rgba(56,189,248,0.6)' },
  { id: 'emerald', name: 'Emerald Ring', rarity: 'rare', price: 700,
    ring: 'linear-gradient(135deg,#34d399,#047857)', glow: 'rgba(16,185,129,0.6)' },
  { id: 'sunset', name: 'Sunset', rarity: 'rare', price: 700,
    ring: 'linear-gradient(135deg,#fb7185,#f59e0b)', glow: 'rgba(251,113,133,0.6)' },
  { id: 'royal', name: 'Royal Ring', rarity: 'epic', price: 1600,
    ring: 'linear-gradient(135deg,#a78bfa,#6d28d9)', glow: 'rgba(167,139,250,0.7)' },
  { id: 'gold', name: 'Golden Luxury', rarity: 'epic', price: 1600,
    ring: 'linear-gradient(135deg,#fde047,#b45309)', glow: 'rgba(250,204,21,0.75)' },
  { id: 'rainbow', name: 'Rainbow', rarity: 'legendary', price: 3500, animated: true,
    ring: 'conic-gradient(from 0deg,#f87171,#fbbf24,#34d399,#38bdf8,#a78bfa,#f87171)', glow: 'rgba(255,255,255,0.6)' },
  { id: 'cosmic', name: 'Cosmic Ring', rarity: 'legendary', price: 3500, animated: true,
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
  { id: 'stars',     name: 'Sparkling Stars', rarity: 'rare',      price: 500,  emoji: '✨', kind: 'twinkle', glow: 'rgba(250,204,21,0.55)' },
  { id: 'flames',    name: 'Flames',            rarity: 'epic',      price: 1200, emoji: '🔥', kind: 'rise',    glow: 'rgba(249,115,22,0.60)' },
  { id: 'rainbow',   name: 'Rainbow',            rarity: 'epic',      price: 1200, emoji: '🌈', kind: 'pulse',   glow: 'rgba(168,85,247,0.55)' },
  { id: 'lightning', name: 'Lightning',             rarity: 'legendary', price: 2800, emoji: '⚡', kind: 'flash',   glow: 'rgba(56,189,248,0.65)' },
  { id: 'snow',      name: 'Snowflakes',          rarity: 'rare',      price: 500,  emoji: '❄️', kind: 'fall',    glow: 'rgba(125,211,252,0.55)' },
  { id: 'confetti',  name: 'Confetti',            rarity: 'legendary', price: 2800, emoji: '🎉', kind: 'burst',   glow: 'rgba(236,72,153,0.55)' },
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
  { id: 'ocean',   name: 'Deep Ocean',    rarity: 'common',    price: 300,
    background: 'linear-gradient(160deg,#e0f2fe 0%,#bae6fd 55%,#7dd3fc 100%)',
    swatch: 'linear-gradient(135deg,#bae6fd,#38bdf8)' },
  { id: 'sunset',  name: 'Sunset',  rarity: 'common',    price: 300,
    background: 'linear-gradient(160deg,#fff7ed 0%,#fed7aa 50%,#fdba74 100%)',
    swatch: 'linear-gradient(135deg,#fdba74,#fb7185)' },
  { id: 'forest',  name: 'Enchanted Forest',   rarity: 'rare',      price: 700,
    background: 'linear-gradient(160deg,#ecfdf5 0%,#bbf7d0 55%,#86efac 100%)',
    swatch: 'linear-gradient(135deg,#86efac,#059669)' },
  { id: 'candy',   name: 'Candy Land', rarity: 'rare',      price: 700,
    background: 'linear-gradient(160deg,#fdf2f8 0%,#fbcfe8 50%,#f9a8d4 100%)',
    swatch: 'linear-gradient(135deg,#f9a8d4,#ec4899)' },
  { id: 'lavender',name: 'Lavender Dream',rarity: 'epic',      price: 1500,
    background: 'linear-gradient(160deg,#f5f3ff 0%,#ddd6fe 50%,#c4b5fd 100%)',
    swatch: 'linear-gradient(135deg,#c4b5fd,#7c3aed)' },
  { id: 'galaxy',  name: 'Outer Space',      rarity: 'legendary', price: 3200,
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
  { id: 'cow', name: 'Cow', rarity: 'rare', price: 800,
    background: 'radial-gradient(ellipse 42px 30px at 25% 30%,#1f2937 60%,transparent 62%) 0 0 / 120px 120px,radial-gradient(ellipse 52px 36px at 78% 72%,#1f2937 60%,transparent 62%) 0 0 / 120px 120px,#ffffff',
    swatch: 'radial-gradient(ellipse 16px 12px at 28% 32%,#1f2937 60%,transparent 62%) 0 0 / 40px 40px,radial-gradient(ellipse 18px 12px at 76% 70%,#1f2937 60%,transparent 62%) 0 0 / 40px 40px,#ffffff' },
  { id: 'bee', name: 'Bumblebee', rarity: 'rare', price: 800,
    background: 'repeating-linear-gradient(45deg,#facc15 0 24px,#1f2937 24px 48px)',
    swatch: 'repeating-linear-gradient(45deg,#facc15 0 9px,#1f2937 9px 18px)' },

  // --- Regnbåge & drömskt ---
  { id: 'rainbow', name: 'Rainbow', rarity: 'epic', price: 1600,
    background: 'linear-gradient(135deg,#fecaca,#fed7aa,#fef08a,#bbf7d0,#bae6fd,#ddd6fe)',
    swatch: 'linear-gradient(135deg,#fecaca,#fef08a,#bbf7d0,#bae6fd,#ddd6fe)' },
  { id: 'unicorn', name: 'Unicorn', rarity: 'legendary', price: 3500,
    background: 'linear-gradient(160deg,#fbcfe8 0%,#ddd6fe 35%,#bae6fd 70%,#bbf7d0 100%)',
    swatch: 'linear-gradient(160deg,#fbcfe8,#ddd6fe,#bae6fd,#bbf7d0)' },
  { id: 'candystripe', name: 'Candy Stripes', rarity: 'rare', price: 800,
    background: 'repeating-linear-gradient(45deg,#f9a8d4 0 20px,#fff1f2 20px 40px)',
    swatch: 'repeating-linear-gradient(45deg,#f9a8d4 0 8px,#fff1f2 8px 16px)' },

  // --- Mönster & former ---
  { id: 'dots', name: 'Polka Dots', rarity: 'common', price: 400,
    background: 'radial-gradient(#f472b6 20%,transparent 22%) 0 0 / 36px 36px,radial-gradient(#60a5fa 20%,transparent 22%) 18px 18px / 36px 36px,#fef9ff',
    swatch: 'radial-gradient(#f472b6 20%,transparent 22%) 0 0 / 16px 16px,radial-gradient(#60a5fa 20%,transparent 22%) 8px 8px / 16px 16px,#fef9ff' },
  { id: 'checker', name: 'Checkers', rarity: 'common', price: 400,
    background: 'repeating-conic-gradient(#e0e7ff 0% 25%,#c7d2fe 0% 50%) 0 0 / 48px 48px',
    swatch: 'repeating-conic-gradient(#e0e7ff 0% 25%,#c7d2fe 0% 50%) 0 0 / 20px 20px' },
  { id: 'waves', name: 'Waves', rarity: 'rare', price: 800,
    background: 'radial-gradient(circle at 50% 0,#7dd3fc 25%,transparent 26%) 0 0 / 30px 15px,radial-gradient(circle at 50% 100%,#bae6fd 25%,transparent 26%) 15px 8px / 30px 15px,#e0f2fe',
    swatch: 'radial-gradient(circle at 50% 0,#7dd3fc 25%,transparent 26%) 0 0 / 16px 8px,radial-gradient(circle at 50% 100%,#bae6fd 25%,transparent 26%) 8px 4px / 16px 8px,#e0f2fe' },
  { id: 'hearts', name: 'Hearts', rarity: 'rare', price: 800,
    background: "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3E%3Cpath%20d='M20,32C20,32,6,23,6,14C6,9,10,7,13,7C16,7,19,10,20,12C21,10,24,7,27,7C30,7,34,9,34,14C34,23,20,32,20,32Z'%20fill='%23fb7185'/%3E%3C/svg%3E\") 0 0 / 40px 40px,#fff1f2",
    swatch: "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3E%3Cpath%20d='M20,32C20,32,6,23,6,14C6,9,10,7,13,7C16,7,19,10,20,12C21,10,24,7,27,7C30,7,34,9,34,14C34,23,20,32,20,32Z'%20fill='%23fb7185'/%3E%3C/svg%3E\") 0 0 / 28px 28px,#fff1f2" },
  { id: 'starry', name: 'Starry Sky', rarity: 'epic', price: 1600,
    background: 'radial-gradient(1.6px 1.6px at 18px 24px,#fff,transparent) 0 0 / 90px 90px,radial-gradient(1.4px 1.4px at 55px 60px,#fff,transparent) 0 0 / 90px 90px,radial-gradient(1px 1px at 78px 30px,#e0e7ff,transparent) 0 0 / 90px 90px,radial-gradient(1.6px 1.6px at 35px 80px,#fff,transparent) 0 0 / 90px 90px,radial-gradient(1px 1px at 5px 55px,#c7d2fe,transparent) 0 0 / 90px 90px,linear-gradient(160deg,#1e1b4b,#0f172a)',
    swatch: 'radial-gradient(1px 1px at 6px 8px,#fff,transparent) 0 0 / 18px 18px,radial-gradient(1px 1px at 13px 14px,#fff,transparent) 0 0 / 18px 18px,linear-gradient(160deg,#1e1b4b,#0f172a)' },
  { id: 'pixel', name: 'Pixel', rarity: 'rare', price: 800,
    background: 'linear-gradient(rgba(79,70,229,0.18) 1px,transparent 1px) 0 0 / 18px 18px,linear-gradient(90deg,rgba(79,70,229,0.18) 1px,transparent 1px) 0 0 / 18px 18px,#eef2ff',
    swatch: 'linear-gradient(rgba(79,70,229,0.30) 1px,transparent 1px) 0 0 / 9px 9px,linear-gradient(90deg,rgba(79,70,229,0.30) 1px,transparent 1px) 0 0 / 9px 9px,#eef2ff' },
];

export const THEME_MAP: Record<string, ShopTheme> = Object.fromEntries(
  SHOP_THEMES.map(t => [t.id, t])
);
