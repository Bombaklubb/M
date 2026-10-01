// Test: larmar om en avatar- eller kistbild saknas i sprite-filen, om en
// källbild ändrats utan att sprite-filen byggts om, eller om filen saknas.
// Körs före varje bygge (prebuild) och med `npm test`.
//
// Åtgärd vid larm: kör `npm run sprites` och checka in resultatet.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spriteSources, CELL, COLS } from "./sprite-sources.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const fail = [];

const indexFile = join(root, "src", "lib", "generated", "sprites.json");
if (!existsSync(indexFile)) {
  console.error("✗ src/lib/generated/sprites.json saknas. Kör: npm run sprites");
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexFile, "utf8"));

// 1. Sprite-filen finns och namnets hash stämmer med innehållet.
const spritePath = join(pub, index.url);
if (!existsSync(spritePath)) {
  fail.push(`sprite-filen ${index.url} saknas`);
} else {
  const hash = createHash("sha256").update(readFileSync(spritePath)).digest("hex").slice(0, 12);
  if (hash !== index.hash || !index.url.includes(hash)) fail.push(`sprite-filens innehåll stämmer inte med hashen i namnet (${index.url})`);
}
if (index.cell !== CELL || index.cols !== COLS) fail.push("rutstorleken har ändrats sedan sprite-filen byggdes");

// 2. Varje avatar/kista i koden finns i sprite-filen, och källbilden är oförändrad.
const sources = spriteSources(root);
if (sources.length < 25) fail.push(`hittade bara ${sources.length} bilder i koden – har avatars.ts ändrat format?`);
for (const src of sources) {
  const e = index.entries[src];
  if (!e) { fail.push(`${src} saknas i sprite-filen`); continue; }
  if (e.col < 0 || e.col >= index.cols || e.row < 0 || e.row >= index.rows) fail.push(`${src} ligger utanför sprite-filen`);
  const file = join(pub, src);
  if (!existsSync(file)) { fail.push(`källbilden ${src} saknas`); continue; }
  const h = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 16);
  if (h !== e.source) fail.push(`${src} har ändrats sedan sprite-filen byggdes`);
}

// 3. Inga två bilder i samma ruta.
const seen = new Map();
for (const [src, e] of Object.entries(index.entries)) {
  const k = `${e.col},${e.row}`;
  if (seen.has(k)) fail.push(`${src} och ${seen.get(k)} delar ruta ${k}`);
  seen.set(k, src);
}

if (fail.length) {
  console.error("✗ Sprite-kontrollen misslyckades:\n  - " + fail.join("\n  - ") + "\n  Kör: npm run sprites");
  process.exit(1);
}
console.log(`✓ sprite-filen innehåller alla ${sources.length} avatar- och kistbilder`);
