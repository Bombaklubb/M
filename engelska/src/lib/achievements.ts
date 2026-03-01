import type { StudentData, StageId } from "./types";

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
  const gram = Object.values(s.grammarModules).filter((m) => m.completed);
  const read = Object.values(s.readingModules).filter((m) => m.completed);
  const spell = Object.values(s.spellingModules ?? {}).filter((m) => m.completed);
  const all = [...gram, ...read, ...spell];
  const points = all.reduce((sum, m) => sum + m.points, 0);
  return { gram: gram.length, read: read.length, spell: spell.length, total: all.length, points };
}

// ─── Definitions ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  // ── Språkdjungeln ──────────────────────────────────────────────────────────
  { id: "lag-1",  stageId: "lagstadiet", icon: "🌱", title: "Djungelentrant",     description: "Klara din första modul i Språkdjungeln." },
  { id: "lag-2",  stageId: "lagstadiet", icon: "📝", title: "Grammatiker",        description: "Klara en grammatikmodul i Språkdjungeln." },
  { id: "lag-3",  stageId: "lagstadiet", icon: "📖", title: "Läsaren",            description: "Klara en läsförståelsemodul i Språkdjungeln." },
  { id: "lag-4",  stageId: "lagstadiet", icon: "✏️", title: "Stavaren",           description: "Klara en stavningsmodul i Språkdjungeln." },
  { id: "lag-5",  stageId: "lagstadiet", icon: "🌿", title: "Djungelmästare",     description: "Klara 3 moduler i Språkdjungeln." },
  { id: "lag-6",  stageId: "lagstadiet", icon: "🎯", title: "Tredubbel utmaning", description: "Klara minst en modul av varje typ i Språkdjungeln." },
  { id: "lag-7",  stageId: "lagstadiet", icon: "⭐", title: "Poängjägare I",      description: "Samla 30 poäng i Språkdjungeln." },
  { id: "lag-8",  stageId: "lagstadiet", icon: "💎", title: "Poängemästare I",    description: "Samla 80 poäng i Språkdjungeln." },
  { id: "lag-9",  stageId: "lagstadiet", icon: "🏆", title: "Djungelhjälte",      description: "Klara 5 moduler i Språkdjungeln." },
  { id: "lag-10", stageId: "lagstadiet", icon: "🌟", title: "Djungelkung",        description: "Klara alla 7 moduler i Språkdjungeln." },

  // ── Språkstaden ────────────────────────────────────────────────────────────
  { id: "mel-1",  stageId: "mellanstadiet", icon: "🏙️", title: "Stadsnykomling",      description: "Klara din första modul i Språkstaden." },
  { id: "mel-2",  stageId: "mellanstadiet", icon: "📝", title: "Stadsgrammatiker",    description: "Klara en grammatikmodul i Språkstaden." },
  { id: "mel-3",  stageId: "mellanstadiet", icon: "📖", title: "Stadsläsaren",        description: "Klara en läsförståelsemodul i Språkstaden." },
  { id: "mel-4",  stageId: "mellanstadiet", icon: "✏️", title: "Stadsstavar",         description: "Klara en stavningsmodul i Språkstaden." },
  { id: "mel-5",  stageId: "mellanstadiet", icon: "🌆", title: "Stadsmästare",        description: "Klara 3 moduler i Språkstaden." },
  { id: "mel-6",  stageId: "mellanstadiet", icon: "🎯", title: "Stadsutmaningen",     description: "Klara minst en modul av varje typ i Språkstaden." },
  { id: "mel-7",  stageId: "mellanstadiet", icon: "⭐", title: "Poängjägare II",      description: "Samla 30 poäng i Språkstaden." },
  { id: "mel-8",  stageId: "mellanstadiet", icon: "💎", title: "Poängemästare II",    description: "Samla 80 poäng i Språkstaden." },
  { id: "mel-9",  stageId: "mellanstadiet", icon: "🏆", title: "Stadshjälte",         description: "Klara 5 moduler i Språkstaden." },
  { id: "mel-10", stageId: "mellanstadiet", icon: "🌟", title: "Stadslegende",        description: "Klara alla 7 moduler i Språkstaden." },

  // ── Språkarenan ────────────────────────────────────────────────────────────
  { id: "hog-1",  stageId: "hogstadiet", icon: "🌐", title: "Arenaentrant",      description: "Klara din första modul i Språkarenan." },
  { id: "hog-2",  stageId: "hogstadiet", icon: "📝", title: "Arenagramatiker",   description: "Klara en grammatikmodul i Språkarenan." },
  { id: "hog-3",  stageId: "hogstadiet", icon: "📖", title: "Arenäläsaren",      description: "Klara en läsförståelsemodul i Språkarenan." },
  { id: "hog-4",  stageId: "hogstadiet", icon: "✏️", title: "Arenastavar",       description: "Klara en stavningsmodul i Språkarenan." },
  { id: "hog-5",  stageId: "hogstadiet", icon: "🔥", title: "Arenakämpe",        description: "Klara 3 moduler i Språkarenan." },
  { id: "hog-6",  stageId: "hogstadiet", icon: "🎯", title: "Arenatrippeln",     description: "Klara minst en modul av varje typ i Språkarenan." },
  { id: "hog-7",  stageId: "hogstadiet", icon: "⭐", title: "Poängjägare III",   description: "Samla 30 poäng i Språkarenan." },
  { id: "hog-8",  stageId: "hogstadiet", icon: "💎", title: "Poängemästare III", description: "Samla 80 poäng i Språkarenan." },
  { id: "hog-9",  stageId: "hogstadiet", icon: "🏆", title: "Arenamästare",      description: "Klara 5 moduler i Språkarenan." },
  { id: "hog-10", stageId: "hogstadiet", icon: "🌟", title: "Arenalegende",      description: "Klara alla 7 moduler i Språkarenan." },

  // ── Språkakademin ──────────────────────────────────────────────────────────
  { id: "gym-1",  stageId: "gymnasiet", icon: "🏔️", title: "Akademiklättrare",    description: "Klara din första modul i Språkakademin." },
  { id: "gym-2",  stageId: "gymnasiet", icon: "📝", title: "Akademigrammatiker",  description: "Klara en grammatikmodul i Språkakademin." },
  { id: "gym-3",  stageId: "gymnasiet", icon: "📖", title: "Akademiläsaren",      description: "Klara en läsförståelsemodul i Språkakademin." },
  { id: "gym-4",  stageId: "gymnasiet", icon: "✏️", title: "Akademistavar",       description: "Klara en stavningsmodul i Språkakademin." },
  { id: "gym-5",  stageId: "gymnasiet", icon: "🔥", title: "Akademikämpe",        description: "Klara 3 moduler i Språkakademin." },
  { id: "gym-6",  stageId: "gymnasiet", icon: "🎯", title: "Akademitrippeln",     description: "Klara minst en modul av varje typ i Språkakademin." },
  { id: "gym-7",  stageId: "gymnasiet", icon: "⭐", title: "Poängjägare IV",      description: "Samla 30 poäng i Språkakademin." },
  { id: "gym-8",  stageId: "gymnasiet", icon: "💎", title: "Poängemästare IV",    description: "Samla 80 poäng i Språkakademin." },
  { id: "gym-9",  stageId: "gymnasiet", icon: "🏆", title: "Akademimästare",      description: "Klara 5 moduler i Språkakademin." },
  { id: "gym-10", stageId: "gymnasiet", icon: "🌟", title: "Akademilegende",      description: "Klara alla 7 moduler i Språkakademin." },

  // ── Globala ────────────────────────────────────────────────────────────────
  { id: "global-1", stageId: "global", icon: "🚀", title: "Första steget",       description: "Klara din allra första modul." },
  { id: "global-2", stageId: "global", icon: "💪", title: "Fleritdig",           description: "Klara moduler i 2 olika stadier." },
  { id: "global-3", stageId: "global", icon: "🌍", title: "Världserövrare",      description: "Klara moduler i alla 4 stadier." },
  { id: "global-4", stageId: "global", icon: "⭐", title: "100 poäng",           description: "Samla totalt 100 poäng." },
  { id: "global-5", stageId: "global", icon: "👑", title: "Mästaren",            description: "Samla totalt 300 poäng." },
];

// ─── Unlock checker ──────────────────────────────────────────────────────────

export function isUnlocked(a: Achievement, student: StudentData): boolean {
  const stages: StageId[] = ["lagstadiet", "mellanstadiet", "hogstadiet", "gymnasiet"];

  if (a.stageId === "global") {
    const totalCompleted = stages.reduce(
      (sum, id) => sum + stageStats(student, id).total,
      0
    );
    const stagesWithProgress = stages.filter(
      (id) => stageStats(student, id).total > 0
    ).length;

    if (a.id === "global-1") return totalCompleted >= 1;
    if (a.id === "global-2") return stagesWithProgress >= 2;
    if (a.id === "global-3") return stagesWithProgress >= 4;
    if (a.id === "global-4") return student.totalPoints >= 100;
    if (a.id === "global-5") return student.totalPoints >= 300;
    return false;
  }

  const sid = a.stageId as StageId;
  const { gram, read, spell, total, points } = stageStats(student, sid);

  const prefix = sid === "lagstadiet" ? "lag"
    : sid === "mellanstadiet" ? "mel"
    : sid === "hogstadiet"    ? "hog"
    : "gym";

  if (a.id === `${prefix}-1`)  return total >= 1;
  if (a.id === `${prefix}-2`)  return gram >= 1;
  if (a.id === `${prefix}-3`)  return read >= 1;
  if (a.id === `${prefix}-4`)  return spell >= 1;
  if (a.id === `${prefix}-5`)  return total >= 3;
  if (a.id === `${prefix}-6`)  return gram >= 1 && read >= 1 && spell >= 1;
  if (a.id === `${prefix}-7`)  return points >= 30;
  if (a.id === `${prefix}-8`)  return points >= 80;
  if (a.id === `${prefix}-9`)  return total >= 5;
  if (a.id === `${prefix}-10`) return total >= 7;
  return false;
}
