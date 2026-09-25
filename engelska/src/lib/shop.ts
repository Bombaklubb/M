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
  { id: "av-puppy",      emoji: "🐶", name: "Valpen",        rarity: "common", price: 100, group: "Djur" },
  { id: "av-kitten",     emoji: "🐱", name: "Kattungen",     rarity: "common", price: 100, group: "Djur" },
  { id: "av-rabbit",     emoji: "🐰", name: "Kaninen",       rarity: "common", price: 100, group: "Djur" },
  { id: "av-chick",      emoji: "🐥", name: "Kycklingen",    rarity: "common", price: 100, group: "Djur" },
  { id: "av-penguin",    emoji: "🐧", name: "Pingvinen",     rarity: "common", price: 100, group: "Djur" },
  { id: "av-koala",      emoji: "🐨", name: "Koalan",        rarity: "common", price: 100, group: "Djur" },
  { id: "av-zebra",      emoji: "🦓", name: "Zebran",        rarity: "rare", price: 400, group: "Djur" },
  { id: "av-giraffe",    emoji: "🦒", name: "Giraffen",      rarity: "rare", price: 400, group: "Djur" },
  { id: "av-otter",      emoji: "🦦", name: "Uttern",        rarity: "rare", price: 400, group: "Djur" },
  { id: "av-owl2",       emoji: "🦉", name: "Snöugglan",     rarity: "rare", price: 400, group: "Djur" },
  { id: "av-peacock",    emoji: "🦚", name: "Påfågeln",      rarity: "epic", price: 1000, group: "Djur" },
  { id: "av-flamingo",   emoji: "🦩", name: "Flamingon",     rarity: "epic", price: 1000, group: "Djur" },
  { id: "av-dodo",       emoji: "🦤", name: "Dronten",       rarity: "legendary", price: 2500, group: "Djur" },

  // ── Skoltema ──────────────────────────────────────────────────────────────
  { id: "av-bookworm",   emoji: "🤓", name: "Bokmasken",     rarity: "common", price: 100, group: "Skoltema" },
  { id: "av-painter",    emoji: "🎨", name: "Konstnären",    rarity: "common", price: 100, group: "Skoltema" },
  { id: "av-musician",   emoji: "🎸", name: "Musikstjärnan", rarity: "common", price: 100, group: "Skoltema" },
  { id: "av-scientist2", emoji: "🧪", name: "Vetenskapsgeniet", rarity: "rare", price: 400, group: "Skoltema" },
  { id: "av-wordmaster", emoji: "🔤", name: "Språkmästaren", rarity: "rare", price: 400, group: "Skoltema" },
  { id: "av-librarian",  emoji: "📚", name: "Bibliotekarien",rarity: "rare", price: 400, group: "Skoltema" },
  { id: "av-inventor",   emoji: "💡", name: "Uppfinnaren",   rarity: "rare", price: 400, group: "Skoltema" },

  // ── Fordon ────────────────────────────────────────────────────────────────
  { id: "av-car",        emoji: "🚗", name: "Bilen",         rarity: "common", price: 100, group: "Fordon" },
  { id: "av-bus",        emoji: "🚌", name: "Bussen",        rarity: "common", price: 100, group: "Fordon" },
  { id: "av-bike",       emoji: "🚲", name: "Cykeln",        rarity: "common", price: 100, group: "Fordon" },
  { id: "av-motorcycle", emoji: "🏍️", name: "Motorcykeln",   rarity: "rare", price: 400, group: "Fordon" },
  { id: "av-firetruck",  emoji: "🚒", name: "Brandbilen",    rarity: "rare", price: 400, group: "Fordon" },
  { id: "av-tractor",    emoji: "🚜", name: "Traktorn",      rarity: "epic", price: 1000, group: "Fordon" },
  { id: "av-rocket",     emoji: "🚀", name: "Raketen",       rarity: "epic", price: 1000, group: "Fordon" },
  { id: "av-racecar",    emoji: "🏎️", name: "Racerbilen",    rarity: "legendary", price: 2500, group: "Fordon" },

  // ── Yrken ─────────────────────────────────────────────────────────────────
  { id: "av-police",     emoji: "👮", name: "Polisen",       rarity: "common", price: 100, group: "Yrken" },
  { id: "av-chef",       emoji: "👨‍🍳", name: "Kocken",        rarity: "common", price: 100, group: "Yrken" },
  { id: "av-teacher",    emoji: "🧑‍🏫", name: "Läraren",       rarity: "common", price: 100, group: "Yrken" },
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
  { id: "av-poop",       emoji: "💩", name: "Glad bajskorv",    rarity: "common", price: 100, group: "Roligt" },
  { id: "av-clown",      emoji: "🤡", name: "Clownen",          rarity: "common", price: 100, group: "Roligt" },
  { id: "av-pizza",      emoji: "🍕", name: "Pizzaslicen",      rarity: "common", price: 100, group: "Roligt" },
  { id: "av-donut",      emoji: "🍩", name: "Munken",           rarity: "common", price: 100, group: "Roligt" },
  { id: "av-burger",     emoji: "🍔", name: "Hungriga hamburgaren", rarity: "common", price: 100, group: "Roligt" },
  { id: "av-popcorn",    emoji: "🍿", name: "Poppande popcorn",  rarity: "common", price: 100, group: "Roligt" },
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

// ─── Teman (ritade scener och mönster bakom sidan) ─────────────────────────
// Själva bilderna ritas i themeArt.ts, som SVG i koden. Här står bara vad som
// kan köpas. `art` är namnet på ritfunktionen.
//
// id:t är det eleverna har köpt, så ett befintligt id får aldrig ändras. De
// nitton teman som fanns före omritningen behåller både id och pris.

export type ThemeCategory = "natur" | "djur" | "spel" | "fantasy" | "riddare" | "anime" | "fest" | "monster";

export const THEME_CATEGORY_LABELS: Record<ThemeCategory, string> = {
  natur: "🌲 Natur & rymd",
  djur: "🐼 Djur",
  spel: "🎮 Spel",
  fantasy: "🐉 Fantasy",
  riddare: "🏰 Riddare",
  anime: "🌸 Anime & manga",
  fest: "🪩 Fest & sport",
  monster: "🎨 Mönster",
};

export const THEME_CATEGORY_ORDER: ThemeCategory[] = ["natur", "djur", "spel", "fantasy", "riddare", "anime", "fest", "monster"];

export interface ShopTheme {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  category: ThemeCategory;
  /** Ritfunktionen i themeArt.ts. */
  art: string;
}

export const SHOP_THEMES: ShopTheme[] = [
  // ── Natur & rymd ──────────────────────────────────────────────────────────
  { id: "th-skog",         name: "Skogen",           rarity: "common",    price: 350,  category: "natur",   art: "skog" },
  { id: "th-hav",          name: "Havet",            rarity: "common",    price: 350,  category: "natur",   art: "hav" },
  { id: "th-vinter",       name: "Vintern",          rarity: "common",    price: 350,  category: "natur",   art: "vinter" },
  { id: "th-bubbles",      name: "Bubbelhav",        rarity: "rare",      price: 700,  category: "natur",   art: "bubbelhav" },
  { id: "th-solnedgang",   name: "Solnedgången",     rarity: "rare",      price: 700,  category: "natur",   art: "solnedgang" },
  { id: "th-rymd",         name: "Rymden",           rarity: "rare",      price: 700,  category: "natur",   art: "rymd" },
  { id: "th-rainbow",      name: "Regnbåge",         rarity: "epic",      price: 1600, category: "natur",   art: "regnbage" },
  { id: "th-vulkan",       name: "Vulkanen",         rarity: "epic",      price: 1400, category: "natur",   art: "lava" },
  { id: "th-galaxy",       name: "Galax",            rarity: "epic",      price: 1600, category: "natur",   art: "galax" },
  { id: "th-stjarnhimmel", name: "Stjärnhimmel",     rarity: "legendary", price: 3500, category: "natur",   art: "stjarnhimmel" },
  { id: "th-aurora",       name: "Norrsken",         rarity: "legendary", price: 3500, category: "natur",   art: "norrsken" },

  // ── Djur ──────────────────────────────────────────────────────────────────
  { id: "th-tassar",       name: "Tassavtryck",      rarity: "common",    price: 350,  category: "djur",    art: "tassar" },
  { id: "th-pingviner",    name: "Pingvinisen",      rarity: "rare",      price: 600,  category: "djur",    art: "pingviner" },
  { id: "th-fjarilar",     name: "Fjärilsängen",     rarity: "rare",      price: 600,  category: "djur",    art: "fjarilar" },
  { id: "th-zebra",        name: "Zebra",            rarity: "rare",      price: 600,  category: "djur",    art: "zebra" },
  { id: "th-tiger",        name: "Tiger",            rarity: "rare",      price: 600,  category: "djur",    art: "tiger" },
  { id: "th-cow",          name: "Ko-fläckar",       rarity: "rare",      price: 600,  category: "djur",    art: "ko" },
  { id: "th-hastar",       name: "Hästhage",         rarity: "rare",      price: 600,  category: "djur",    art: "hastar" },
  { id: "th-pandaskog",    name: "Pandaskogen",      rarity: "rare",      price: 700,  category: "djur",    art: "pandaskog" },
  { id: "th-savann",       name: "Savannen",         rarity: "rare",      price: 700,  category: "djur",    art: "savann" },
  { id: "th-leopard",      name: "Leopard",          rarity: "epic",      price: 1400, category: "djur",    art: "leopard" },
  { id: "th-giraffe",      name: "Giraff",           rarity: "epic",      price: 1400, category: "djur",    art: "giraff" },
  { id: "th-korallrev",    name: "Korallrevet",      rarity: "epic",      price: 1400, category: "djur",    art: "korallrev" },

  // ── Spel ──────────────────────────────────────────────────────────────────
  { id: "th-plattform",    name: "Plattformsspelet", rarity: "rare",      price: 600,  category: "spel",    art: "plattform" },
  { id: "th-tvspel",       name: "TV-spel",          rarity: "rare",      price: 700,  category: "spel",    art: "tvspel" },
  { id: "th-dataspel",     name: "Dataspel",         rarity: "rare",      price: 700,  category: "spel",    art: "dataspel" },
  { id: "th-arkad",        name: "Arkadhallen",      rarity: "rare",      price: 700,  category: "spel",    art: "arkad" },
  { id: "th-blockvarld",   name: "Blockvärlden",     rarity: "epic",      price: 1400, category: "spel",    art: "blockvarld" },

  // ── Fantasy ───────────────────────────────────────────────────────────────
  { id: "th-kristallgrotta", name: "Kristallgrottan", rarity: "rare",     price: 700,  category: "fantasy", art: "kristallgrotta" },
  { id: "th-trollskog",    name: "Trollskogen",      rarity: "epic",      price: 1400, category: "fantasy", art: "trollskog" },
  { id: "th-trollkarl",    name: "Trollkarlens torn", rarity: "epic",     price: 1400, category: "fantasy", art: "trollkarl" },
  { id: "th-enhorning",    name: "Enhörningsriket",  rarity: "legendary", price: 3500, category: "fantasy", art: "enhorning" },
  { id: "th-drakberget",   name: "Drakberget",       rarity: "legendary", price: 3500, category: "fantasy", art: "drakberget" },
  { id: "th-rainbow-flow", name: "Regnbågsvirvel",   rarity: "legendary", price: 3500, category: "fantasy", art: "regnbagsvirvel" },

  // ── Riddare ───────────────────────────────────────────────────────────────
  { id: "th-tornerspel",   name: "Tornerspelet",     rarity: "rare",      price: 600,  category: "riddare", art: "tornerspel" },
  { id: "th-vapenskold",   name: "Vapensköldar",     rarity: "rare",      price: 700,  category: "riddare", art: "vapenskold" },
  { id: "th-riddarborg",   name: "Riddarborgen",     rarity: "epic",      price: 1400, category: "riddare", art: "riddarborg" },
  { id: "th-kungasal",     name: "Kungasalen",       rarity: "legendary", price: 3500, category: "riddare", art: "kungasal" },

  // ── Anime & manga ─────────────────────────────────────────────────────────
  { id: "th-actionlinjer", name: "Actionlinjer",     rarity: "rare",      price: 600,  category: "anime",   art: "actionlinjer" },
  { id: "th-mangasida",    name: "Mangasidan",       rarity: "rare",      price: 600,  category: "anime",   art: "mangaraster" },
  { id: "th-kawaii",       name: "Kawaii",           rarity: "rare",      price: 700,  category: "anime",   art: "kawaii" },
  { id: "th-serierutor",   name: "Serierutor",       rarity: "rare",      price: 700,  category: "anime",   art: "serierutor" },
  { id: "th-animehimmel",  name: "Animehimmel",      rarity: "rare",      price: 700,  category: "anime",   art: "animehimmel" },
  { id: "th-sakura",       name: "Körsbärsblom",     rarity: "epic",      price: 1400, category: "anime",   art: "sakura" },
  { id: "th-neonstad",     name: "Neonstaden",       rarity: "epic",      price: 1400, category: "anime",   art: "neonstad" },

  // ── Fest & sport ──────────────────────────────────────────────────────────
  { id: "th-fotboll",      name: "Fotbollsplan",     rarity: "rare",      price: 600,  category: "fest",    art: "fotboll" },
  { id: "th-dans",         name: "Dansgolv",         rarity: "epic",      price: 1400, category: "fest",    art: "dans" },
  { id: "th-disco",        name: "Disco",            rarity: "epic",      price: 1400, category: "fest",    art: "disco" },

  // ── Mönster ───────────────────────────────────────────────────────────────
  { id: "th-dots",         name: "Prickar",          rarity: "common",    price: 350,  category: "monster", art: "prickigt" },
  { id: "th-checker",      name: "Schackrutor",      rarity: "common",    price: 350,  category: "monster", art: "rutmonster" },
  { id: "th-godis",        name: "Godis",            rarity: "rare",      price: 600,  category: "monster", art: "godis" },
  { id: "th-camo",         name: "Kamouflage",       rarity: "rare",      price: 700,  category: "monster", art: "kamouflage" },
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
  { id: "fx-snow",    name: "Snöfall",       rarity: "common", price: 100, emoji: "❄️", motion: "fall",   count: 16 },
  { id: "fx-rain",    name: "Regn",          rarity: "common", price: 100, emoji: "💧", motion: "fall",   count: 18 },
  { id: "fx-bubbles", name: "Bubblor",       rarity: "common", price: 100, emoji: "🫧", motion: "rise",   count: 14 },
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
