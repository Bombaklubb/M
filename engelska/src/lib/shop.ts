// ─── Butik (Affären) – katalog ──────────────────────────────────────────────
// Allt som går att köpa med poäng. Rent kosmetiskt – påverkar aldrig inlärning.
// Poäng som spenderas dras från en separat "plånbok" (livstidspoäng − spenderat),
// så student.totalPoints och alla kistor/utmärkelser rörs aldrig.

export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export const RARITY_LABELS: Record<Rarity, string> = {
  common: "Vanlig",
  rare: "Sällsynt",
  epic: "Episk",
  legendary: "Legendarisk",
  mythic: "Mytisk",
};

export const RARITY_RING: Record<Rarity, string> = {
  common: "from-slate-300 to-slate-400",
  rare: "from-sky-400 to-blue-500",
  epic: "from-violet-400 to-fuchsia-500",
  legendary: "from-amber-400 to-orange-500",
  mythic: "from-fuchsia-500 via-purple-600 to-amber-400",
};

// ─── Avatarer ─────────────────────────────────────────────────────────────────
export type AvatarGroup =
  | "Djur" | "Fordon" | "Yrken" | "Skoltema" | "Roligt" | "Säsong" | "Fantasi" | "Sällsynt";

export interface ShopAvatar {
  id: string;
  emoji: string;
  name: string;
  rarity: Rarity;
  price: number;
  group: AvatarGroup;
}

export const AVATAR_GROUP_ORDER: AvatarGroup[] = [
  "Djur", "Skoltema", "Fordon", "Yrken", "Roligt", "Säsong", "Fantasi", "Sällsynt",
];

// OBS: id:n är permanenta — ägda avatarer sparas via id, inte array-index.
export const SHOP_AVATARS: ShopAvatar[] = [
  // ── Djur ──────────────────────────────────────────────────────────────────
  { id: "av-puppy",      emoji: "🐶", name: "Valpen",        rarity: "common", price: 150, group: "Djur" },
  { id: "av-kitten",     emoji: "🐱", name: "Kattungen",     rarity: "common", price: 150, group: "Djur" },
  { id: "av-rabbit",     emoji: "🐰", name: "Kaninen",       rarity: "common", price: 150, group: "Djur" },
  { id: "av-chick",      emoji: "🐥", name: "Kycklingen",    rarity: "common", price: 150, group: "Djur" },
  { id: "av-penguin",    emoji: "🐧", name: "Pingvinen",     rarity: "common", price: 150, group: "Djur" },
  { id: "av-koala",      emoji: "🐨", name: "Koalan",        rarity: "common", price: 150, group: "Djur" },
  { id: "av-zebra",      emoji: "🦓", name: "Zebran",        rarity: "rare", price: 400, group: "Djur" },
  { id: "av-giraffe",    emoji: "🦒", name: "Giraffen",      rarity: "rare", price: 400, group: "Djur" },
  { id: "av-otter",      emoji: "🦦", name: "Uttern",        rarity: "rare", price: 400, group: "Djur" },
  { id: "av-owl2",       emoji: "🦉", name: "Snöugglan",     rarity: "rare", price: 400, group: "Djur" },
  { id: "av-peacock",    emoji: "🦚", name: "Påfågeln",      rarity: "epic", price: 1000, group: "Djur" },
  { id: "av-flamingo",   emoji: "🦩", name: "Flamingon",     rarity: "epic", price: 1000, group: "Djur" },
  { id: "av-dodo",       emoji: "🦤", name: "Dronten",       rarity: "legendary", price: 2500, group: "Djur" },

  // ── Skoltema ──────────────────────────────────────────────────────────────
  { id: "av-bookworm",   emoji: "🤓", name: "Bokmasken",     rarity: "common", price: 150, group: "Skoltema" },
  { id: "av-painter",    emoji: "🎨", name: "Konstnären",    rarity: "common", price: 150, group: "Skoltema" },
  { id: "av-musician",   emoji: "🎸", name: "Musikstjärnan", rarity: "common", price: 150, group: "Skoltema" },
  { id: "av-scientist2", emoji: "🧪", name: "Vetenskapsgeniet", rarity: "rare", price: 400, group: "Skoltema" },
  { id: "av-wordmaster", emoji: "🔤", name: "Språkmästaren", rarity: "rare", price: 400, group: "Skoltema" },
  { id: "av-librarian",  emoji: "📚", name: "Bibliotekarien",rarity: "rare", price: 400, group: "Skoltema" },
  { id: "av-inventor",   emoji: "💡", name: "Uppfinnaren",   rarity: "rare", price: 400, group: "Skoltema" },

  // ── Fordon ────────────────────────────────────────────────────────────────
  { id: "av-car",        emoji: "🚗", name: "Bilen",         rarity: "common", price: 150, group: "Fordon" },
  { id: "av-bus",        emoji: "🚌", name: "Bussen",        rarity: "common", price: 150, group: "Fordon" },
  { id: "av-bike",       emoji: "🚲", name: "Cykeln",        rarity: "common", price: 150, group: "Fordon" },
  { id: "av-motorcycle", emoji: "🏍️", name: "Motorcykeln",   rarity: "rare", price: 400, group: "Fordon" },
  { id: "av-firetruck",  emoji: "🚒", name: "Brandbilen",    rarity: "rare", price: 400, group: "Fordon" },
  { id: "av-tractor",    emoji: "🚜", name: "Traktorn",      rarity: "epic", price: 1000, group: "Fordon" },
  { id: "av-rocket",     emoji: "🚀", name: "Raketen",       rarity: "epic", price: 1000, group: "Fordon" },
  { id: "av-racecar",    emoji: "🏎️", name: "Racerbilen",    rarity: "legendary", price: 2500, group: "Fordon" },

  // ── Yrken ─────────────────────────────────────────────────────────────────
  { id: "av-police",     emoji: "👮", name: "Polisen",       rarity: "common", price: 150, group: "Yrken" },
  { id: "av-chef",       emoji: "👨‍🍳", name: "Kocken",        rarity: "common", price: 150, group: "Yrken" },
  { id: "av-teacher",    emoji: "🧑‍🏫", name: "Läraren",       rarity: "common", price: 150, group: "Yrken" },
  { id: "av-doctor",     emoji: "👨‍⚕️", name: "Doktorn",       rarity: "rare", price: 400, group: "Yrken" },
  { id: "av-firefighter",emoji: "👨‍🚒", name: "Brandmannen",   rarity: "rare", price: 400, group: "Yrken" },
  { id: "av-detective2", emoji: "🕵️", name: "Detektiven",    rarity: "rare", price: 400, group: "Yrken" },
  { id: "av-astronaut2", emoji: "👨‍🚀", name: "Astronauten",   rarity: "epic", price: 1000, group: "Yrken" },
  { id: "av-pilot",      emoji: "👨‍✈️", name: "Piloten",       rarity: "epic", price: 1000, group: "Yrken" },

  // ── Roligt ────────────────────────────────────────────────────────────────
  { id: "av-potato",     emoji: "🥔", name: "Potatis med solglasögon", rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-taco",       emoji: "🌮", name: "Dansande taco",   rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-banana",     emoji: "🍌", name: "Flygande banan",  rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-zombie",     emoji: "🧟", name: "Zombie med läsglasögon", rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-pickle",     emoji: "🥒", name: "Sur gurka",       rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-broccoli",   emoji: "🥦", name: "Broccolisuperhjälte", rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-poop",       emoji: "💩", name: "Glad bajskorv",    rarity: "common", price: 150, group: "Roligt" },
  { id: "av-clown",      emoji: "🤡", name: "Clownen",          rarity: "common", price: 150, group: "Roligt" },
  { id: "av-pizza",      emoji: "🍕", name: "Pizzaslicen",      rarity: "common", price: 150, group: "Roligt" },
  { id: "av-donut",      emoji: "🍩", name: "Munken",           rarity: "common", price: 150, group: "Roligt" },
  { id: "av-burger",     emoji: "🍔", name: "Hungriga hamburgaren", rarity: "common", price: 150, group: "Roligt" },
  { id: "av-popcorn",    emoji: "🍿", name: "Poppande popcorn",  rarity: "common", price: 150, group: "Roligt" },
  { id: "av-egg",        emoji: "🍳", name: "Stekta ägget",     rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-icecream",   emoji: "🍦", name: "Smältande glassen", rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-mushroom",   emoji: "🍄", name: "Svampen",          rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-cactus",     emoji: "🌵", name: "Taggiga kaktusen", rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-snail",      emoji: "🐌", name: "Snabba snigeln",   rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-sloth",      emoji: "🦥", name: "Lata sengångaren", rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-skull",      emoji: "💀", name: "Skrattande skallen", rarity: "rare", price: 400, group: "Roligt" },
  { id: "av-alienmon",   emoji: "👽", name: "Fnissande utomjordingen", rarity: "epic", price: 1000, group: "Roligt" },
  { id: "av-zany",       emoji: "🤪", name: "Tokiga galningen",  rarity: "epic", price: 1000, group: "Roligt" },
  { id: "av-explode",    emoji: "🤯", name: "Exploderande huvudet", rarity: "epic", price: 1000, group: "Roligt" },

  // ── Säsong ────────────────────────────────────────────────────────────────
  { id: "av-easter",     emoji: "🐇", name: "Påskhare",        rarity: "rare", price: 400, group: "Säsong" },
  { id: "av-pirate2",    emoji: "🏴‍☠️", name: "Sommarpirat",    rarity: "rare", price: 400, group: "Säsong" },
  { id: "av-halloween",  emoji: "👻", name: "Halloween-spöke",  rarity: "rare", price: 400, group: "Säsong" },
  { id: "av-santa",      emoji: "🎅", name: "Jultomte",         rarity: "rare", price: 400, group: "Säsong" },
  { id: "av-snowman",    emoji: "⛄", name: "Snögubbe",         rarity: "rare", price: 400, group: "Säsong" },

  // ── Fantasi ───────────────────────────────────────────────────────────────
  { id: "av-icemage",    emoji: "🧊", name: "Ismagiker",        rarity: "epic", price: 1000, group: "Fantasi" },
  { id: "av-shadow",     emoji: "🗡️", name: "Skuggkrigare",     rarity: "epic", price: 1000, group: "Fantasi" },
  { id: "av-alien",      emoji: "👾", name: "Rymdvarelsen",     rarity: "epic", price: 1000, group: "Fantasi" },
  { id: "av-timetravel", emoji: "⏳", name: "Tidsresenär",      rarity: "legendary", price: 2500, group: "Fantasi" },
  { id: "av-goldrobot",  emoji: "🦾", name: "Guldrobot",        rarity: "legendary", price: 2500, group: "Fantasi" },
  { id: "av-rainbow",    emoji: "🌈", name: "Regnbågsväktare",  rarity: "legendary", price: 2500, group: "Fantasi" },

  // ── Sällsynt (mytiska) ────────────────────────────────────────────────────
  { id: "av-diamond",    emoji: "💎", name: "Diamantdrake",          rarity: "mythic", price: 5000, group: "Sällsynt" },
  { id: "av-galaxy",     emoji: "💫", name: "Galaxhjälte",           rarity: "mythic", price: 5000, group: "Sällsynt" },
  { id: "av-wizardball", emoji: "🔮", name: "Legendarisk trollkarl", rarity: "mythic", price: 5000, group: "Sällsynt" },
];

export const SHOP_AVATAR_MAP: Record<string, ShopAvatar> = Object.fromEntries(
  SHOP_AVATARS.map((a) => [a.id, a])
);

// ─── Ramar (avatar-frames) ────────────────────────────────────────────────────
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
  { id: "amber",   name: "Bronsring",    rarity: "common", price: 250,
    ring: "linear-gradient(135deg,#fbbf24,#b45309)", glow: "rgba(245,158,11,0.6)" },
  { id: "ocean",   name: "Havsring",     rarity: "common", price: 250,
    ring: "linear-gradient(135deg,#38bdf8,#1d4ed8)", glow: "rgba(56,189,248,0.6)" },
  { id: "emerald", name: "Smaragdring",  rarity: "rare", price: 700,
    ring: "linear-gradient(135deg,#34d399,#047857)", glow: "rgba(16,185,129,0.6)" },
  { id: "sunset",  name: "Solnedgång",   rarity: "rare", price: 700,
    ring: "linear-gradient(135deg,#fb7185,#f59e0b)", glow: "rgba(251,113,133,0.6)" },
  { id: "royal",   name: "Kunglig ring", rarity: "epic", price: 1600,
    ring: "linear-gradient(135deg,#a78bfa,#6d28d9)", glow: "rgba(167,139,250,0.7)" },
  { id: "gold",    name: "Guldlyx",      rarity: "epic", price: 1600,
    ring: "linear-gradient(135deg,#fde047,#b45309)", glow: "rgba(250,204,21,0.75)" },
  { id: "rainbow", name: "Regnbåge",     rarity: "legendary", price: 3500, animated: true,
    ring: "conic-gradient(from 0deg,#f87171,#fbbf24,#34d399,#38bdf8,#a78bfa,#f87171)", glow: "rgba(255,255,255,0.6)" },
  { id: "cosmic",  name: "Kosmisk ring", rarity: "legendary", price: 3500, animated: true,
    ring: "conic-gradient(from 0deg,#22d3ee,#a78bfa,#ec4899,#22d3ee)", glow: "rgba(167,139,250,0.8)" },
];

export const FRAME_MAP: Record<string, ShopFrame> = Object.fromEntries(
  SHOP_FRAMES.map((f) => [f.id, f])
);

// ─── Teman (profilbakgrunder med mönster) ───────────────────────────────────
// `css` är ett komplett CSS background-värde som läggs på profilens topp-kort.
// En mörk scrim läggs alltid ovanpå så vit text alltid syns.
// animated === true ⇒ bakgrunden glider långsamt (kräver background-size 200%).
export interface ShopTheme {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  css: string;
  animated?: boolean;
}

export const SHOP_THEMES: ShopTheme[] = [
  // ── Mönster ───────────────────────────────────────────────────────────────
  { id: "th-zebra",   name: "Zebra",        rarity: "rare", price: 600,
    css: "repeating-linear-gradient(48deg,#111827 0 20px,#f9fafb 20px 40px)" },
  { id: "th-tiger",   name: "Tiger",        rarity: "rare", price: 600,
    css: "repeating-linear-gradient(75deg,#1c1917 0 9px,#ea580c 9px 42px)" },
  { id: "th-cow",     name: "Ko-fläckar",   rarity: "rare", price: 600,
    css: "radial-gradient(circle,#111827 32%,transparent 34%) 0 0/90px 90px,radial-gradient(circle,#111827 32%,transparent 34%) 45px 45px/90px 90px,#f9fafb" },
  { id: "th-leopard", name: "Leopard",      rarity: "epic", price: 1400,
    css: "radial-gradient(circle,#78350f 20%,transparent 22%) 0 0/52px 52px,radial-gradient(circle,#78350f 20%,transparent 22%) 26px 26px/52px 52px,linear-gradient(160deg,#f59e0b,#d97706)" },
  { id: "th-giraffe", name: "Giraff",       rarity: "epic", price: 1400,
    css: "radial-gradient(circle,#92400e 38%,transparent 40%) 0 0/70px 70px,radial-gradient(circle,#92400e 38%,transparent 40%) 35px 35px/70px 70px,#fcd34d" },

  // ── Färg & form ─────────────────────────────────────────────────────────────
  { id: "th-dots",    name: "Prickar",      rarity: "common", price: 350,
    css: "radial-gradient(circle,#ffffff 22%,transparent 24%) 0 0/30px 30px,linear-gradient(160deg,#2563eb,#1e40af)" },
  { id: "th-checker", name: "Schackrutor",  rarity: "common", price: 350,
    css: "conic-gradient(#1f2937 90deg,#374151 90deg 180deg,#1f2937 180deg 270deg,#374151 270deg) 0 0/54px 54px" },
  { id: "th-camo",    name: "Kamouflage",   rarity: "rare", price: 700,
    css: "radial-gradient(circle at 20% 30%,#3f6212 0 34px,transparent 36px),radial-gradient(circle at 72% 62%,#1a2e05 0 42px,transparent 44px),radial-gradient(circle at 50% 92%,#4d7c0f 0 32px,transparent 34px),#65a30d" },
  { id: "th-disco",   name: "Disco",        rarity: "epic", price: 1400,
    css: "repeating-linear-gradient(45deg,#ec4899 0 22px,#8b5cf6 22px 44px,#3b82f6 44px 66px,#22c55e 66px 88px)" },
  { id: "th-bubbles", name: "Bubbelhav",    rarity: "rare", price: 700,
    css: "radial-gradient(circle at 28% 82%,rgba(255,255,255,0.35) 0 12px,transparent 14px),radial-gradient(circle at 68% 40%,rgba(255,255,255,0.28) 0 20px,transparent 22px),radial-gradient(circle at 85% 78%,rgba(255,255,255,0.3) 0 9px,transparent 11px),linear-gradient(160deg,#0369a1,#0891b2)" },

  // ── Regnbåge & galax ────────────────────────────────────────────────────────
  { id: "th-rainbow", name: "Regnbåge",     rarity: "epic", price: 1600,
    css: "linear-gradient(135deg,#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#8b5cf6)" },
  { id: "th-galaxy",  name: "Galax",        rarity: "epic", price: 1600,
    css: "radial-gradient(circle,#ffffff 1px,transparent 2px) 0 0/42px 42px,radial-gradient(circle,#ffffff 1px,transparent 2px) 21px 21px/64px 64px,linear-gradient(160deg,#1e1b4b,#4c1d95,#312e81)" },

  // ── Animerade (legendariska) ──────────────────────────────────────────────
  { id: "th-rainbow-flow", name: "Regnbågsvirvel", rarity: "legendary", price: 3500, animated: true,
    css: "linear-gradient(60deg,#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#8b5cf6,#ef4444)" },
  { id: "th-aurora", name: "Norrsken",      rarity: "legendary", price: 3500, animated: true,
    css: "linear-gradient(120deg,#042f2e,#065f46,#1e3a8a,#4c1d95,#065f46)" },
];

export const THEME_MAP: Record<string, ShopTheme> = Object.fromEntries(
  SHOP_THEMES.map((t) => [t.id, t])
);

// ─── Effekter (animerade partiklar på profilen) ─────────────────────────────
export type EffectMotion = "fall" | "rise" | "twinkle";

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
  { id: "fx-snow",    name: "Snöfall",       rarity: "common", price: 300, emoji: "❄️", motion: "fall",   count: 16 },
  { id: "fx-rain",    name: "Regn",          rarity: "common", price: 300, emoji: "💧", motion: "fall",   count: 18 },
  { id: "fx-bubbles", name: "Bubblor",       rarity: "common", price: 350, emoji: "🫧", motion: "rise",   count: 14 },
  { id: "fx-confetti",name: "Konfetti",      rarity: "rare", price: 700, emoji: "🎊", motion: "fall",   count: 18 },
  { id: "fx-hearts",  name: "Hjärtan",       rarity: "rare", price: 700, emoji: "💕", motion: "rise",   count: 14 },
  { id: "fx-sparkle", name: "Stjärnglitter", rarity: "rare", price: 800, emoji: "✨", motion: "twinkle", count: 16 },
  { id: "fx-leaves",  name: "Höstlöv",       rarity: "rare", price: 800, emoji: "🍂", motion: "fall",   count: 14 },
  { id: "fx-petals",  name: "Körsbärsblom",  rarity: "rare", price: 800, emoji: "🌸", motion: "fall",   count: 14 },
  { id: "fx-fire",    name: "Gnistor",       rarity: "epic", price: 1600, emoji: "🔥", motion: "rise",   count: 14 },
  { id: "fx-stars",   name: "Stjärnstoft",   rarity: "epic", price: 1600, emoji: "🌟", motion: "twinkle", count: 16 },
  { id: "fx-shooting",name: "Stjärnfall",    rarity: "legendary", price: 3000, emoji: "🌠", motion: "fall", count: 12 },
];

export const EFFECT_MAP: Record<string, ShopEffect> = Object.fromEntries(
  SHOP_EFFECTS.map((e) => [e.id, e])
);
