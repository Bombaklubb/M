import type { Stage } from "./types";

export const STAGES: Stage[] = [
  {
    id: "lagstadiet",
    name: "Ordängen",
    subtitle: "Lågstadiet",
    emoji: "🌾",
    grades: "Åk 1–3",
    description: "Börja din svenska resa på ängen! Lär dig grunderna.",
    colorClass: "bg-sang-500",
    bgClass: "bg-gradient-to-br from-sang-800 via-sang-700 to-sang-600",
    borderClass: "border-sang-400",
    textClass: "text-sang-600",
    buttonClass: "bg-sang-500 hover:bg-sang-600 text-white",
    locked: false,
  },
  {
    id: "mellanstadiet",
    name: "Berättelseskogen",
    subtitle: "Mellanstadiet",
    emoji: "🌲",
    grades: "Åk 4–6",
    description: "Utforska den djupa skogen och bygg upp ditt svenska.",
    colorClass: "bg-skog-500",
    bgClass: "bg-gradient-to-br from-skog-900 via-skog-800 to-skog-700",
    borderClass: "border-skog-400",
    textClass: "text-skog-600",
    buttonClass: "bg-skog-500 hover:bg-skog-600 text-white",
    locked: false,
  },
  {
    id: "hogstadiet",
    name: "Texthavet",
    subtitle: "Högstadiet",
    emoji: "🌊",
    grades: "Åk 7–9",
    description: "Dyk ner i texthavet och fördjupa ditt svenska.",
    colorClass: "bg-hav-500",
    bgClass: "bg-gradient-to-br from-hav-900 via-hav-800 to-hav-700",
    borderClass: "border-hav-400",
    textClass: "text-hav-600",
    buttonClass: "bg-hav-500 hover:bg-hav-600 text-white",
    locked: false,
  },
  {
    id: "gymnasiet",
    name: "Skrivakademin",
    subtitle: "Gymnasiet",
    emoji: "🏰",
    grades: "Gymnasiet",
    description: "Nå toppen med avancerat svenska på akademisk nivå.",
    colorClass: "bg-torn-600",
    bgClass: "bg-gradient-to-br from-torn-900 via-torn-800 to-torn-700",
    borderClass: "border-torn-400",
    textClass: "text-torn-600",
    buttonClass: "bg-torn-700 hover:bg-torn-800 text-white",
    locked: false,
  },
];

export function getStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
