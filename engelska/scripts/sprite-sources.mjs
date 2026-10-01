// Vilka bilder som ska ligga i sprite-filen. Läses direkt ur koden, så att en
// ny avatar eller kista i avatars.ts eller gamification.ts automatiskt räknas
// med – och check-sprites.mjs larmar om den saknas i den byggda filen.

import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Rutans storlek i px. Största visningen är 80 px, så 160 räcker för skarpa skärmar (2×). */
export const CELL = 160;
export const COLS = 8;

const FILES = [
  // Avatarbilderna: image: "/avatars/ninja.svg"
  { file: "src/lib/avatars.ts", re: /\bimage:\s*"([^"]+)"/g },
  // Kistorna: image: "/content/bronskista.png", openImage: "..."
  { file: "src/lib/gamification.ts", re: /\b(?:image|openImage):\s*"([^"]+\.(?:png|svg|webp))"/g },
];

export function spriteSources(root) {
  const out = [];
  for (const { file, re } of FILES) {
    const text = readFileSync(join(root, file), "utf8");
    for (const m of text.matchAll(re)) if (!out.includes(m[1])) out.push(m[1]);
  }
  return out;
}
