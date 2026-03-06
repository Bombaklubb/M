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
  light: "Ljus",
  light_brown: "Mellanbrun",
  dark: "Mörk",
};

export const HERO_TYPES: HeroType[] = [
  { id: "explorer",  name_sv: "Upptäckaren",  unlock_points: 0 },
  { id: "scientist", name_sv: "Forskaren",    unlock_points: 400 },
  { id: "athlete",   name_sv: "Idrottaren",   unlock_points: 800 },
  { id: "wizard",    name_sv: "Trollkarlen",  unlock_points: 1200 },
  { id: "inventor",  name_sv: "Uppfinnaren",  unlock_points: 1600 },
  { id: "scholar",   name_sv: "Akademikern",  unlock_points: 2200 },
];

export const HERO_ATTRIBUTES: HeroAttribute[] = [
  // Hats
  { id: "explorer_hat",    type: "hat",       name_sv: "Upptäckarhatt",  unlock_points: 200 },
  { id: "cap",             type: "hat",       name_sv: "Keps",           unlock_points: 900 },
  { id: "wizard_hat",      type: "hat",       name_sv: "Trollkarlshatt", unlock_points: 1000 },
  { id: "graduation_cap",  type: "hat",       name_sv: "Studentmössa",   unlock_condition: "complete_sprakarena" },
  // Shirts
  { id: "hoodie",          type: "shirt",     name_sv: "Hoodie",         unlock_points: 600 },
  { id: "lab_coat",        type: "shirt",     name_sv: "Labbrock",       unlock_points: 700 },
  { id: "explorer_jacket", type: "shirt",     name_sv: "Upptäckarjacka", unlock_points: 1100 },
  { id: "armor_shirt",     type: "shirt",     name_sv: "Rustningströja", unlock_points: 1500 },
  // Accessories
  { id: "backpack",        type: "accessory", name_sv: "Ryggsäck",       unlock_points: 350 },
  { id: "glasses",         type: "accessory", name_sv: "Glasögon",       unlock_points: 500 },
  { id: "compass",         type: "accessory", name_sv: "Kompass",        unlock_points: 850 },
  { id: "book",            type: "accessory", name_sv: "Bok",            unlock_points: 1200 },
  { id: "magic_wand",      type: "accessory", name_sv: "Trollstav",      unlock_points: 1400 },
  { id: "trophy",          type: "accessory", name_sv: "Trofé",          unlock_points: 2500 },
  // Effects
  { id: "star_glow",       type: "effect",    name_sv: "Stjärnglöd",     unlock_points: 1800 },
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
  hat: "Hattar",
  shirt: "Tröjor",
  accessory: "Tillbehör",
  effect: "Effekter",
};
