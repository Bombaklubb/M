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
