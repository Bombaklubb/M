import type { StudentData, StageId } from "./types";
import type { IconType } from "react-icons";
import {
  GiSprout, GiScrollQuill, GiOpenBook, GiPencil, GiLeafSwirl,
  GiBullseye, GiStarMedal, GiDiamondTrophy, GiTrophyCup, GiLaurelCrown,
  GiMagnifyingGlass, GiCrossedSwords,
  GiWorld, GiStarKey, GiCastleRuins, GiLaurels,
  GiEarthAmerica, GiFireball, GiSwordsEmblem, GiImperialCrown,
  GiMountainClimbing, GiGraduateCap, GiMountaintop, GiGems,
  GiRocketFlight, GiStrong, GiStarFormation, GiCrown, GiSoccerBall,
} from "react-icons/gi";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  stageId: StageId | "global";
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function stageStats(student: StudentData, stageId: StageId) {
  const s = student.stages[stageId];
  const gram  = Object.values(s.grammarModules).filter((m) => m.completed);
  const read  = Object.values(s.readingModules).filter((m) => m.completed);
  const spell = Object.values(s.spellingModules    ?? {}).filter((m) => m.completed);
  const ws    = Object.values(s.wordsearchModules  ?? {}).filter((m) => m.completed);
  const all   = [...gram, ...read, ...spell, ...ws];
  const points = all.reduce((sum, m) => sum + m.points, 0);
  return { gram: gram.length, read: read.length, spell: spell.length,
           ws: ws.length, total: all.length, points };
}

// ─── Definitions ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  // ── Språkdjungeln ──────────────────────────────────────────────────────────
  { id: "lag-1",  stageId: "lagstadiet", icon: "🌱", title: "Djungelentrant",     description: "Klara din första modul i Språkdjungeln." },
  { id: "lag-2",  stageId: "lagstadiet", icon: "📝", title: "Grammatiker",        description: "Klara en grammatikmodul i Språkdjungeln." },
  { id: "lag-3",  stageId: "lagstadiet", icon: "📖", title: "Läsaren",            description: "Klara en läsförståelsemodul i Språkdjungeln." },
  { id: "lag-4",  stageId: "lagstadiet", icon: "✏️", title: "Stavaren",           description: "Klara en stavningsmodul i Språkdjungeln." },
  { id: "lag-5",  stageId: "lagstadiet", icon: "🌿", title: "Djungelmästare",     description: "Klara 5 moduler i Språkdjungeln." },
  { id: "lag-6",  stageId: "lagstadiet", icon: "🎯", title: "Tredubbel utmaning", description: "Klara minst en modul av varje typ i Språkdjungeln." },
  { id: "lag-7",  stageId: "lagstadiet", icon: "⭐", title: "Poängjägare I",      description: "Samla 50 poäng i Språkdjungeln." },
  { id: "lag-8",  stageId: "lagstadiet", icon: "💎", title: "Poängemästare I",    description: "Samla 150 poäng i Språkdjungeln." },
  { id: "lag-9",  stageId: "lagstadiet", icon: "🏆", title: "Djungelhjälte",      description: "Klara 10 moduler i Språkdjungeln." },
  { id: "lag-10", stageId: "lagstadiet", icon: "🌟", title: "Djungelkung",        description: "Klara 18 moduler i Språkdjungeln." },
  { id: "lag-11", stageId: "lagstadiet", icon: "🔍", title: "Ordjägaren I",       description: "Klara en ordsökningsmodul i Språkdjungeln." },

  // ── Språkstaden ────────────────────────────────────────────────────────────
  { id: "mel-1",  stageId: "mellanstadiet", icon: "🏙️", title: "Stadsnykomling",      description: "Klara din första modul i Språkstaden." },
  { id: "mel-2",  stageId: "mellanstadiet", icon: "📝", title: "Stadsgrammatiker",    description: "Klara en grammatikmodul i Språkstaden." },
  { id: "mel-3",  stageId: "mellanstadiet", icon: "📖", title: "Stadsläsaren",        description: "Klara en läsförståelsemodul i Språkstaden." },
  { id: "mel-4",  stageId: "mellanstadiet", icon: "✏️", title: "Stadsstavar",         description: "Klara en stavningsmodul i Språkstaden." },
  { id: "mel-5",  stageId: "mellanstadiet", icon: "🌆", title: "Stadsmästare",        description: "Klara 5 moduler i Språkstaden." },
  { id: "mel-6",  stageId: "mellanstadiet", icon: "🎯", title: "Stadsutmaningen",     description: "Klara minst en modul av varje typ i Språkstaden." },
  { id: "mel-7",  stageId: "mellanstadiet", icon: "⭐", title: "Poängjägare II",      description: "Samla 50 poäng i Språkstaden." },
  { id: "mel-8",  stageId: "mellanstadiet", icon: "💎", title: "Poängemästare II",    description: "Samla 150 poäng i Språkstaden." },
  { id: "mel-9",  stageId: "mellanstadiet", icon: "🏆", title: "Stadshjälte",         description: "Klara 10 moduler i Språkstaden." },
  { id: "mel-10", stageId: "mellanstadiet", icon: "🌟", title: "Stadslegende",        description: "Klara 18 moduler i Språkstaden." },
  { id: "mel-11", stageId: "mellanstadiet", icon: "🔍", title: "Ordjägaren II",       description: "Klara en ordsökningsmodul i Språkstaden." },

  // ── Språkarenan ────────────────────────────────────────────────────────────
  { id: "hog-1",  stageId: "hogstadiet", icon: "🌐", title: "Arenaentrant",       description: "Klara din första modul i Språkarenan." },
  { id: "hog-2",  stageId: "hogstadiet", icon: "📝", title: "Arenagramatiker",    description: "Klara en grammatikmodul i Språkarenan." },
  { id: "hog-3",  stageId: "hogstadiet", icon: "📖", title: "Arenäläsaren",       description: "Klara en läsförståelsemodul i Språkarenan." },
  { id: "hog-4",  stageId: "hogstadiet", icon: "✏️", title: "Arenastavar",        description: "Klara en stavningsmodul i Språkarenan." },
  { id: "hog-5",  stageId: "hogstadiet", icon: "🔥", title: "Arenakämpe",         description: "Klara 5 moduler i Språkarenan." },
  { id: "hog-6",  stageId: "hogstadiet", icon: "🎯", title: "Arenatrippeln",      description: "Klara minst en modul av varje typ i Språkarenan." },
  { id: "hog-7",  stageId: "hogstadiet", icon: "⭐", title: "Poängjägare III",    description: "Samla 50 poäng i Språkarenan." },
  { id: "hog-8",  stageId: "hogstadiet", icon: "💎", title: "Poängemästare III",  description: "Samla 150 poäng i Språkarenan." },
  { id: "hog-9",  stageId: "hogstadiet", icon: "🏆", title: "Arenamästare",       description: "Klara 10 moduler i Språkarenan." },
  { id: "hog-10", stageId: "hogstadiet", icon: "🌟", title: "Arenalegende",       description: "Klara 18 moduler i Språkarenan." },
  { id: "hog-11", stageId: "hogstadiet", icon: "🔍", title: "Ordjägaren III",     description: "Klara en ordsökningsmodul i Språkarenan." },

  // ── Språkakademin ──────────────────────────────────────────────────────────
  { id: "gym-1",  stageId: "gymnasiet", icon: "🏔️", title: "Akademiklättrare",     description: "Klara din första modul i Språkakademin." },
  { id: "gym-2",  stageId: "gymnasiet", icon: "📝", title: "Akademigrammatiker",   description: "Klara en grammatikmodul i Språkakademin." },
  { id: "gym-3",  stageId: "gymnasiet", icon: "📖", title: "Akademiläsaren",       description: "Klara en läsförståelsemodul i Språkakademin." },
  { id: "gym-4",  stageId: "gymnasiet", icon: "✏️", title: "Akademistavar",        description: "Klara en stavningsmodul i Språkakademin." },
  { id: "gym-5",  stageId: "gymnasiet", icon: "🔥", title: "Akademikämpe",         description: "Klara 5 moduler i Språkakademin." },
  { id: "gym-6",  stageId: "gymnasiet", icon: "🎯", title: "Akademitrippeln",      description: "Klara minst en modul av varje typ i Språkakademin." },
  { id: "gym-7",  stageId: "gymnasiet", icon: "⭐", title: "Poängjägare IV",       description: "Samla 50 poäng i Språkakademin." },
  { id: "gym-8",  stageId: "gymnasiet", icon: "💎", title: "Poängemästare IV",     description: "Samla 150 poäng i Språkakademin." },
  { id: "gym-9",  stageId: "gymnasiet", icon: "🏆", title: "Akademimästare",       description: "Klara 10 moduler i Språkakademin." },
  { id: "gym-10", stageId: "gymnasiet", icon: "🌟", title: "Akademilegende",       description: "Klara 18 moduler i Språkakademin." },
  { id: "gym-11", stageId: "gymnasiet", icon: "🔍", title: "Ordjägaren IV",        description: "Klara en ordsökningsmodul i Språkakademin." },

  // ── Globala ────────────────────────────────────────────────────────────────
  { id: "global-1", stageId: "global", icon: "🚀", title: "Första steget",       description: "Klara din allra första modul." },
  { id: "global-2", stageId: "global", icon: "💪", title: "Fleritdig",           description: "Klara moduler i 2 olika stadier." },
  { id: "global-3", stageId: "global", icon: "🌍", title: "Världserövrare",      description: "Klara moduler i alla 4 stadier." },
  { id: "global-4", stageId: "global", icon: "⭐", title: "100 poäng",           description: "Samla totalt 100 poäng." },
  { id: "global-5", stageId: "global", icon: "👑", title: "Mästaren",            description: "Samla totalt 500 poäng." },
  { id: "global-6", stageId: "global", icon: "⚽", title: "Fotbollsstjärnan",    description: "Klara 20 moduler totalt." },
  { id: "global-7", stageId: "global", icon: "🎓", title: "Engelskaexperten",    description: "Samla totalt 1000 poäng." },
];

// ─── Unlock checker ──────────────────────────────────────────────────────────

export function isUnlocked(a: Achievement, student: StudentData): boolean {
  const stages: StageId[] = ["lagstadiet", "mellanstadiet", "hogstadiet", "gymnasiet"];

  if (a.stageId === "global") {
    const totalCompleted = stages.reduce(
      (sum, id) => sum + stageStats(student, id).total, 0
    );
    const stagesWithProgress = stages.filter(
      (id) => stageStats(student, id).total > 0
    ).length;

    if (a.id === "global-1") return totalCompleted >= 1;
    if (a.id === "global-2") return stagesWithProgress >= 2;
    if (a.id === "global-3") return stagesWithProgress >= 4;
    if (a.id === "global-4") return student.totalPoints >= 100;
    if (a.id === "global-5") return student.totalPoints >= 500;
    if (a.id === "global-6") return totalCompleted >= 20;
    if (a.id === "global-7") return student.totalPoints >= 1000;
    return false;
  }

  const sid = a.stageId as StageId;
  const { gram, read, spell, ws, total, points } = stageStats(student, sid);

  const prefix = sid === "lagstadiet" ? "lag"
    : sid === "mellanstadiet" ? "mel"
    : sid === "hogstadiet"    ? "hog"
    : "gym";

  if (a.id === `${prefix}-1`)  return total >= 1;
  if (a.id === `${prefix}-2`)  return gram >= 1;
  if (a.id === `${prefix}-3`)  return read >= 1;
  if (a.id === `${prefix}-4`)  return spell >= 1;
  if (a.id === `${prefix}-5`)  return total >= 5;
  if (a.id === `${prefix}-6`)  return gram >= 1 && read >= 1 && spell >= 1;
  if (a.id === `${prefix}-7`)  return points >= 50;
  if (a.id === `${prefix}-8`)  return points >= 150;
  if (a.id === `${prefix}-9`)  return total >= 10;
  if (a.id === `${prefix}-10`) return total >= 18;
  if (a.id === `${prefix}-11`) return ws >= 1;
  return false;
}

// ─── Game-icons components per achievement ID ─────────────────────────────────
// Pattern: -1 = entrant, -2 = grammar, -3 = reading, -4 = spelling,
//          -5 = stage master, -6 = triple, -7 = points I, -8 = points II,
//          -9 = hero, -10 = legend, -11 = wordsearch
export const ACHIEVEMENT_ICONS: Record<string, IconType> = {
  // Språkdjungeln (lagstadiet)
  "lag-1":  GiSprout,        "lag-2":  GiScrollQuill,  "lag-3":  GiOpenBook,
  "lag-4":  GiPencil,        "lag-5":  GiLeafSwirl,    "lag-6":  GiBullseye,
  "lag-7":  GiStarMedal,     "lag-8":  GiDiamondTrophy,"lag-9":  GiTrophyCup,
  "lag-10": GiLaurelCrown,   "lag-11": GiMagnifyingGlass, "lag-12": GiCrossedSwords,
  // Språkstaden (mellanstadiet)
  "mel-1":  GiWorld,         "mel-2":  GiScrollQuill,  "mel-3":  GiOpenBook,
  "mel-4":  GiPencil,        "mel-5":  GiStarKey,      "mel-6":  GiBullseye,
  "mel-7":  GiStarMedal,     "mel-8":  GiDiamondTrophy,"mel-9":  GiTrophyCup,
  "mel-10": GiLaurels,       "mel-11": GiMagnifyingGlass, "mel-12": GiCrossedSwords,
  // Språkarenan (hogstadiet)
  "hog-1":  GiEarthAmerica,  "hog-2":  GiScrollQuill,  "hog-3":  GiOpenBook,
  "hog-4":  GiPencil,        "hog-5":  GiFireball,     "hog-6":  GiBullseye,
  "hog-7":  GiStarMedal,     "hog-8":  GiDiamondTrophy,"hog-9":  GiSwordsEmblem,
  "hog-10": GiImperialCrown, "hog-11": GiMagnifyingGlass, "hog-12": GiCrossedSwords,
  // Språkakademin (gymnasiet)
  "gym-1":  GiMountainClimbing,"gym-2": GiScrollQuill, "gym-3":  GiOpenBook,
  "gym-4":  GiPencil,        "gym-5":  GiGems,         "gym-6":  GiBullseye,
  "gym-7":  GiStarMedal,     "gym-8":  GiDiamondTrophy,"gym-9":  GiGraduateCap,
  "gym-10": GiMountaintop,   "gym-11": GiMagnifyingGlass, "gym-12": GiCrossedSwords,
  // Global
  "global-1": GiRocketFlight, "global-2": GiStrong,    "global-3": GiEarthAmerica,
  "global-4": GiStarFormation,"global-5": GiCrown,     "global-6": GiSoccerBall,
  "global-7": GiGraduateCap,
};
