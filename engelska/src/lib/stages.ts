import type { Stage } from "./types";

export const STAGES: Stage[] = [
  {
    id: "lagstadiet",
    name: "Ordbyn",
    subtitle: "Nivå 1-3",
    emoji: "🏡",
    grades: "Nivå 1-3",
    description: "Börja din engelska resa i byn! Lär dig grunderna.",
    colorClass:  "bg-ord-600",
    bgClass:     "bg-gradient-to-br from-ord-800 via-ord-700 to-ord-600",
    borderClass: "border-ord-400",
    textClass:   "text-ord-600",
    buttonClass: "bg-ord-600 hover:bg-ord-700 text-white",
    locked: false,
  },
  {
    id: "mellanstadiet",
    name: "Grammatikskogen",
    subtitle: "Nivå 4-6",
    emoji: "🌲",
    grades: "Nivå 4-6",
    description: "Utforska skogen och bygg upp din engelska grammatik.",
    colorClass:  "bg-gram-600",
    bgClass:     "bg-gradient-to-br from-gram-900 via-gram-800 to-gram-700",
    borderClass: "border-gram-400",
    textClass:   "text-gram-600",
    buttonClass: "bg-gram-600 hover:bg-gram-700 text-white",
    locked: false,
  },
  {
    id: "hogstadiet",
    name: "Texthavet",
    subtitle: "Nivå 7-9",
    emoji: "🌊",
    grades: "Nivå 7-9",
    description: "Dyk ner i texthavet och fördjupa din engelska.",
    colorClass:  "bg-text-600",
    bgClass:     "bg-gradient-to-br from-text-900 via-text-800 to-text-700",
    borderClass: "border-text-400",
    textClass:   "text-text-600",
    buttonClass: "bg-text-600 hover:bg-text-700 text-white",
    locked: false,
  },
  {
    id: "gymnasiet",
    name: "Engelska Akademin",
    subtitle: "Nivå 10",
    emoji: "🎓",
    grades: "Nivå 10",
    description: "Nå toppen med avancerad engelska på akademisk nivå.",
    colorClass:  "bg-acad-600",
    bgClass:     "bg-gradient-to-br from-acad-900 via-acad-800 to-acad-700",
    borderClass: "border-acad-400",
    textClass:   "text-acad-600",
    buttonClass: "bg-acad-600 hover:bg-acad-700 text-white",
    locked: false,
  },
];

export function getStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
