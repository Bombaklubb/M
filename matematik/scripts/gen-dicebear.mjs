// Förgenererar DiceBear-avatarer till statiska SVG-filer i public/avatars/.
// Körs vid behov: `node scripts/gen-dicebear.mjs` (efter att nya "db:"-figurer
// lagts till i src/data/shop.ts). Filerna checkas in så klienten slipper
// bundla DiceBear-biblioteket – appen serverar bara färdiga SVG:er.

import { createAvatar } from '@dicebear/core';
import { adventurer, bottts, funEmoji, pixelArt } from '@dicebear/collection';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const STYLES = { adventurer, bottts, funEmoji, pixelArt };
const OUT_DIR = join(root, 'public', 'avatars');

// Plocka alla "db:<stil>:<seed>" ur shop.ts
const shopSrc = readFileSync(join(root, 'src', 'data', 'shop.ts'), 'utf8');
const re = /db:(adventurer|bottts|funEmoji|pixelArt):([^':]+)/g;
const markers = new Map();
let m;
while ((m = re.exec(shopSrc)) !== null) {
  markers.set(`${m[1]}:${m[2]}`, { style: m[1], seed: m[2] });
}

mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
for (const { style, seed } of markers.values()) {
  const svg = createAvatar(STYLES[style], { seed, radius: 50 }).toString();
  writeFileSync(join(OUT_DIR, `${style}-${seed}.svg`), svg, 'utf8');
  written++;
}

const files = readdirSync(OUT_DIR).filter(f => f.endsWith('.svg'));
console.log(`Genererade ${written} DiceBear-avatarer → public/avatars/ (totalt ${files.length} svg-filer)`);
