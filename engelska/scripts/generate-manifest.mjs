// Genererar public/content/manifest.json med modulantal per stadie.
// Körs automatiskt före build (prebuild) så startsidan slipper ladda
// alla fyra content.json (~916 kB) bara för att rita progressringarna.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const STAGES = ["lagstadiet", "mellanstadiet", "hogstadiet", "gymnasiet"];

const manifest = {};
for (const stage of STAGES) {
  const file = join(root, "public", "content", `${stage}`, "content.json");
  const data = JSON.parse(readFileSync(file, "utf8"));
  // OBS: reading räknas medvetet INTE med – läsförståelse hör till Läsjakten
  // och visas inte i Engelskajakten.
  manifest[stage] = {
    grammar: data.grammar?.length ?? 0,
    spelling: data.spelling?.length ?? 0,
    wordsearch: data.wordsearch?.length ?? 0,
    spel: data.spel?.length ?? 0,
  };
}

const out = join(root, "public", "content", "manifest.json");
writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
console.log(`✓ manifest.json genererad (${STAGES.length} stadier)`);
