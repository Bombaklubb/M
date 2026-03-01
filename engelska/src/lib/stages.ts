import type { Stage } from "./types";

export const STAGES: Stage[] = [
  {
    id: "lagstadiet",
    name: "The Jungle Camp",
    subtitle: "Lågstadiet",
    emoji: "🌿",
    grades: "Åk 1–3",
    description: "Börja din engelska resa i djungeln! Lär dig grunderna.",
    colorClass: "bg-jungle-500",
    bgClass: "bg-gradient-to-br from-jungle-800 via-jungle-700 to-jungle-600",
    borderClass: "border-jungle-400",
    textClass: "text-jungle-600",
    buttonClass: "bg-jungle-500 hover:bg-jungle-600 text-white",
    locked: false,
  },
  {
    id: "mellanstadiet",
    name: "The City District",
    subtitle: "Mellanstadiet",
    emoji: "🏙️",
    grades: "Åk 4–6",
    description: "Utforska en pulserade stad och bygg upp ditt engelska.",
    colorClass: "bg-city-500",
    bgClass: "bg-gradient-to-br from-city-900 via-city-800 to-city-700",
    borderClass: "border-city-400",
    textClass: "text-city-600",
    buttonClass: "bg-city-500 hover:bg-city-600 text-white",
    locked: false,
  },
  {
    id: "hogstadiet",
    name: "The Global Hub",
    subtitle: "Högstadiet",
    emoji: "🌐",
    grades: "Åk 7–9",
    description: "Koppla upp dig mot världen och fördjupa din engelska.",
    colorClass: "bg-global-500",
    bgClass: "bg-gradient-to-br from-global-900 via-global-800 to-global-700",
    borderClass: "border-global-400",
    textClass: "text-global-600",
    buttonClass: "bg-global-500 hover:bg-global-600 text-white",
    locked: false,
  },
  {
    id: "gymnasiet",
    name: "The Academic Summit",
    subtitle: "Gymnasiet",
    emoji: "🏔️",
    grades: "Gymnasiet",
    description: "Nå toppen med avancerad engelska på akademisk nivå.",
    colorClass: "bg-summit-600",
    bgClass: "bg-gradient-to-br from-summit-900 via-summit-800 to-summit-700",
    borderClass: "border-summit-400",
    textClass: "text-summit-600",
    buttonClass: "bg-summit-700 hover:bg-summit-800 text-white",
    locked: false,
  },
];

export function getStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
