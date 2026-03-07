import type { SkinTone } from "./types";

export type { SkinTone };

export interface HeroType {
  id: string;
  name_sv: string;
  unlock_points: number;
}

export interface HeroAttribute {
  id: string;
  type: "hat" | "shirt" | "accessory" | "effect";
  name_sv: string;
  unlock_points?: number;
  unlock_condition?: string;
}

export const SKIN_TONE_LABELS: Record<SkinTone, string> = {
  light:       "Ljus",
  light_brown: "Mellanbrun",
  dark:        "Mörk",
};

export const HERO_TYPES: HeroType[] = [
  { id: "explorer",    name_sv: "Upptäckaren",    unlock_points: 0 },
  { id: "scientist",   name_sv: "Forskaren",      unlock_points: 400 },
  { id: "athlete",     name_sv: "Idrottaren",     unlock_points: 800 },
  { id: "footballer",  name_sv: "Fotbollaren",    unlock_points: 1000 },
  { id: "wizard",      name_sv: "Trollkarlen",    unlock_points: 1200 },
  { id: "inventor",    name_sv: "Uppfinnaren",    unlock_points: 1600 },
  { id: "scholar",     name_sv: "Akademikern",    unlock_points: 2200 },
];

export const HERO_ATTRIBUTES: HeroAttribute[] = [
  // ── Hattar (11 st) ──────────────────────────────────────────
  { id: "headband",      type: "hat", name_sv: "Pannband",        unlock_points: 100 },
  { id: "explorer_hat",  type: "hat", name_sv: "Upptäckarhatt",   unlock_points: 200 },
  { id: "beanie",        type: "hat", name_sv: "Mössa",           unlock_points: 350 },
  { id: "cap",           type: "hat", name_sv: "Keps",            unlock_points: 500 },
  { id: "santa_hat",     type: "hat", name_sv: "Tomteluva",       unlock_points: 650 },
  { id: "cowboy_hat",    type: "hat", name_sv: "Cowboyhatt",      unlock_points: 800 },
  { id: "wizard_hat",    type: "hat", name_sv: "Trollkarlshatt",  unlock_points: 1000 },
  { id: "top_hat",       type: "hat", name_sv: "Cylinderhatt",    unlock_points: 1300 },
  { id: "crown",         type: "hat", name_sv: "Krona",           unlock_points: 1700 },
  { id: "viking_helmet", type: "hat", name_sv: "Vikinghjälm",     unlock_points: 2000 },
  { id: "graduation_cap",type: "hat", name_sv: "Studentmössa",    unlock_condition: "complete_sprakarena" },

  // ── Tröjor (10 st) ──────────────────────────────────────────
  { id: "tshirt",          type: "shirt", name_sv: "Stjärntröja",     unlock_points: 50 },
  { id: "hoodie",          type: "shirt", name_sv: "Hoodie",          unlock_points: 300 },
  { id: "striped_shirt",   type: "shirt", name_sv: "Randig tröja",    unlock_points: 550 },
  { id: "lab_coat",        type: "shirt", name_sv: "Labbrock",        unlock_points: 700 },
  { id: "sport_jersey",    type: "shirt", name_sv: "Sporttröja",      unlock_points: 900 },
  { id: "cape",            type: "shirt", name_sv: "Superhjältekappa",unlock_points: 1100 },
  { id: "explorer_jacket", type: "shirt", name_sv: "Upptäckarjacka",  unlock_points: 1300 },
  { id: "winter_jacket",   type: "shirt", name_sv: "Vinterjacka",     unlock_points: 1500 },
  { id: "armor_shirt",     type: "shirt", name_sv: "Rustningströja",  unlock_points: 1800 },
  { id: "tuxedo",          type: "shirt", name_sv: "Kostym",          unlock_points: 2200 },

  // ── Tillbehör (12 st) ───────────────────────────────────────
  { id: "pencil",      type: "accessory", name_sv: "Penna",       unlock_points: 100 },
  { id: "backpack",    type: "accessory", name_sv: "Ryggsäck",    unlock_points: 350 },
  { id: "glasses",     type: "accessory", name_sv: "Glasögon",    unlock_points: 500 },
  { id: "football_ball", type: "accessory", name_sv: "Fotboll",   unlock_points: 650 },
  { id: "compass",     type: "accessory", name_sv: "Kompass",     unlock_points: 850 },
  { id: "camera",      type: "accessory", name_sv: "Kamera",      unlock_points: 1000 },
  { id: "sword",       type: "accessory", name_sv: "Svärd",       unlock_points: 1150 },
  { id: "book",        type: "accessory", name_sv: "Bok",         unlock_points: 1300 },
  { id: "guitar",      type: "accessory", name_sv: "Gitarr",      unlock_points: 1500 },
  { id: "magic_wand",  type: "accessory", name_sv: "Trollstav",   unlock_points: 1700 },
  { id: "telescope",   type: "accessory", name_sv: "Kikare",      unlock_points: 2000 },
  { id: "trophy",      type: "accessory", name_sv: "Trofé",       unlock_points: 2500 },

  // ── Effekter (10 st) ────────────────────────────────────────
  { id: "flower_wreath", type: "effect", name_sv: "Blomsterkrans", unlock_points: 400 },
  { id: "rainbow_trail", type: "effect", name_sv: "Regnbåge",      unlock_points: 700 },
  { id: "sparkles",      type: "effect", name_sv: "Gnistor",        unlock_points: 950 },
  { id: "fire_aura",     type: "effect", name_sv: "Eldglöd",        unlock_points: 1200 },
  { id: "ice_aura",      type: "effect", name_sv: "Isglöd",         unlock_points: 1400 },
  { id: "star_glow",     type: "effect", name_sv: "Stjärnglöd",     unlock_points: 1600 },
  { id: "cloud_halo",    type: "effect", name_sv: "Molnhalo",       unlock_points: 1900 },
  { id: "lightning",     type: "effect", name_sv: "Blixt",          unlock_points: 2100 },
  { id: "shadow_clone",  type: "effect", name_sv: "Skuggklon",      unlock_points: 2400 },
  { id: "golden_shine",  type: "effect", name_sv: "Guldglans",      unlock_points: 3000 },
];

export function isAttributeUnlocked(
  attr: HeroAttribute,
  totalPoints: number,
  hogstadietCompleted: number
): boolean {
  if (attr.unlock_condition === "complete_sprakarena") {
    return hogstadietCompleted >= 5;
  }
  return totalPoints >= (attr.unlock_points ?? 0);
}

export const ATTRIBUTE_TYPE_LABELS: Record<HeroAttribute["type"], string> = {
  hat:       "Hattar",
  shirt:     "Tröjor",
  accessory: "Tillbehör",
  effect:    "Effekter",
};
