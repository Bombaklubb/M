import { loadStudent, saveStudent } from "./storage";

// ─── Dagens uppdrag ───────────────────────────────────────────────────────────
// Tre dagliga utmaningar (poäng, övningar, spel) som väljs deterministiskt per
// datum, så alla elever ser samma uppdrag samma dag. Belöningen läggs på
// student.totalPoints (= både livstidspoäng och plånbok).

export type QuestMetric = "points" | "modules" | "games";

export interface Quest {
  id: string;
  icon: string;
  title: string;
  metric: QuestMetric;
  target: number;
  reward: number;
}

const POINT_QUESTS: Quest[] = [
  { id: "p100", icon: "⭐", title: "Tjäna 100 poäng idag",  metric: "points", target: 100, reward: 30 },
  { id: "p150", icon: "⭐", title: "Tjäna 150 poäng idag",  metric: "points", target: 150, reward: 40 },
  { id: "p200", icon: "⭐", title: "Tjäna 200 poäng idag",  metric: "points", target: 200, reward: 60 },
];

const MODULE_QUESTS: Quest[] = [
  { id: "m1", icon: "📚", title: "Klara 1 övning idag",    metric: "modules", target: 1, reward: 25 },
  { id: "m2", icon: "📚", title: "Klara 2 övningar idag",  metric: "modules", target: 2, reward: 50 },
  { id: "m3", icon: "📚", title: "Klara 3 övningar idag",  metric: "modules", target: 3, reward: 80 },
];

const GAME_QUESTS: Quest[] = [
  { id: "g1", icon: "🎮", title: "Spela 1 spelrunda idag",   metric: "games", target: 1, reward: 20 },
  { id: "g2", icon: "🎮", title: "Spela 2 spelrundor idag",  metric: "games", target: 2, reward: 40 },
  { id: "g3", icon: "🎮", title: "Spela 3 spelrundor idag",  metric: "games", target: 3, reward: 60 },
];

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Enkel deterministisk hash av datumsträngen. */
function dateHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Dagens tre uppdrag – ett per kategori, samma för alla hela dagen. */
export function getDailyQuests(): Quest[] {
  const h = dateHash(todayStr());
  return [
    POINT_QUESTS[h % POINT_QUESTS.length],
    MODULE_QUESTS[(h >> 3) % MODULE_QUESTS.length],
    GAME_QUESTS[(h >> 6) % GAME_QUESTS.length],
  ];
}

// ─── Dagens framsteg (per elev) ───────────────────────────────────────────────

export interface QuestState {
  date: string;
  points: number;
  modules: number;
  games: number;
  claimed: string[];
}

function questKey(name: string) {
  return `engelskajakten_quests_${name.toLowerCase().trim()}`;
}

function emptyState(): QuestState {
  return { date: todayStr(), points: 0, modules: 0, games: 0, claimed: [] };
}

export function loadQuestState(studentName: string): QuestState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(questKey(studentName));
    if (!raw) return emptyState();
    const state = JSON.parse(raw) as QuestState;
    // Nytt datum ⇒ nollställ dagens räknare
    if (state.date !== todayStr()) return emptyState();
    return { ...emptyState(), ...state };
  } catch {
    return emptyState();
  }
}

function saveQuestState(studentName: string, state: QuestState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(questKey(studentName), JSON.stringify(state));
}

/** Registrera framsteg (anropas när poäng tjänas, övningar klaras, spel spelas). */
export function recordQuestProgress(
  studentName: string,
  delta: { points?: number; modules?: number; games?: number }
): void {
  if (typeof window === "undefined") return;
  const state = loadQuestState(studentName);
  state.points += delta.points ?? 0;
  state.modules += delta.modules ?? 0;
  state.games += delta.games ?? 0;
  saveQuestState(studentName, state);
}

export function questProgress(state: QuestState, quest: Quest): number {
  return state[quest.metric];
}

/**
 * Hämta belöningen för ett klarat uppdrag.
 * Returnerar belöningens storlek, eller 0 om uppdraget inte är klart/redan hämtat.
 */
export function claimQuest(studentName: string, quest: Quest): number {
  if (typeof window === "undefined") return 0;
  const state = loadQuestState(studentName);
  if (state.claimed.includes(quest.id)) return 0;
  if (questProgress(state, quest) < quest.target) return 0;

  const student = loadStudent();
  if (!student) return 0;

  state.claimed.push(quest.id);
  saveQuestState(studentName, state);
  student.totalPoints += quest.reward;
  saveStudent(student);
  return quest.reward;
}
