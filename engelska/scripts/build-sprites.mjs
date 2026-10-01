// Bygger EN sprite-fil med alla avatarbilder och kistbilder, så att webbläsaren
// hämtar en enda fil i stället för en fil per bild. Inloggningsskärmen visade
// förut 25 avatarer = 25 anrop per ny elev, och Om-sidan och Kistor-sidan
// hämtade kistbilderna en och en.
//
//   npm run sprites
//
// Skapar:
//   public/sprites/icons-<hash>.webp     – bilden (hash av innehållet i namnet,
//                                           så den kan cachas för alltid)
//   src/lib/generated/sprites.json       – indexfil: källsökväg → ruta i bilden
//
// Komponenterna fortsätter att använda samma sökvägar som förut (t.ex.
// "/avatars/ninja.svg") och slår upp rutan i indexfilen. Källbilderna ligger
// kvar i public/ som indata till skriptet.
//
// Kör skriptet igen när en avatar- eller kistbild läggs till eller ändras.
// scripts/check-sprites.mjs (körs före varje bygge) larmar annars.
//
// Kräver sharp (följer med Next.js). Körs lokalt, inte på Vercel: resultatet
// checkas in.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { spriteSources, CELL, COLS } from "./sprite-sources.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const sources = spriteSources(root);

const rows = Math.ceil(sources.length / COLS);
const width = COLS * CELL;
const height = rows * CELL;

const composites = [];
const entries = {};
for (let i = 0; i < sources.length; i++) {
  const src = sources[i];
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const file = join(pub, src);
  const buf = readFileSync(file);
  // SVG ritas i hög upplösning innan den skalas ned, annars blir den suddig.
  const input = src.endsWith(".svg") ? sharp(buf, { density: 300 }) : sharp(buf);
  const cell = await input
    .resize(CELL, CELL, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  composites.push({ input: cell, left: col * CELL, top: row * CELL });
  entries[src] = { col, row, source: createHash("sha256").update(buf).digest("hex").slice(0, 16) };
}

const image = await sharp({
  create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite(composites)
  .webp({ quality: 82, alphaQuality: 90, effort: 6 })
  .toBuffer();

const hash = createHash("sha256").update(image).digest("hex").slice(0, 12);
const outDir = join(pub, "sprites");
mkdirSync(outDir, { recursive: true });
// Gamla sprite-filer tas bort så att bara den aktuella följer med.
for (const f of readdirSync(outDir)) if (/^icons-[0-9a-f]+\.webp$/.test(f)) unlinkSync(join(outDir, f));
const fileName = `icons-${hash}.webp`;
writeFileSync(join(outDir, fileName), image);

const index = {
  "//": "Genererad av scripts/build-sprites.mjs – ändra inte för hand.",
  url: `/sprites/${fileName}`,
  hash,
  cols: COLS,
  rows,
  cell: CELL,
  entries,
};
const genDir = join(root, "src", "lib", "generated");
mkdirSync(genDir, { recursive: true });
writeFileSync(join(genDir, "sprites.json"), JSON.stringify(index, null, 2) + "\n");

console.log(`✓ ${fileName}: ${sources.length} bilder, ${width}×${height} px, ${(image.length / 1024).toFixed(0)} kB`);
