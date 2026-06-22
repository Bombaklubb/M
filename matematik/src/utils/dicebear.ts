// ─── DiceBear-avatarer (statiska) ────────────────────────────────────────────────
// Figur-avatarerna förgenereras till /public/avatars/<stil>-<seed>.svg av
// scripts/gen-dicebear.mjs. Klienten bundlar därför INTE DiceBear-biblioteket –
// den pekar bara på de färdiga SVG-filerna. Kör skriptet på nytt om du lägger
// till nya "db:"-figurer i shop.ts.

export type DicebearStyle = 'adventurer' | 'bottts' | 'funEmoji' | 'pixelArt';
const STYLES: DicebearStyle[] = ['adventurer', 'bottts', 'funEmoji', 'pixelArt'];

/** Bygg markör-strängen som sparas som "emoji". */
export function dicebearMarker(style: DicebearStyle, seed: string): string {
  return `db:${style}:${seed}`;
}

export function isDicebearMarker(s: string): boolean {
  return typeof s === 'string' && s.startsWith('db:');
}

function parseMarker(s: string): { style: DicebearStyle; seed: string } | null {
  if (!isDicebearMarker(s)) return null;
  const rest = s.slice(3);
  const idx = rest.indexOf(':');
  if (idx < 0) return null;
  const style = rest.slice(0, idx) as DicebearStyle;
  const seed = rest.slice(idx + 1);
  if (!STYLES.includes(style) || !seed) return null;
  return { style, seed };
}

/** Sökväg till förgenererad SVG, eller null om det inte är en DiceBear-markör. */
export function dicebearUriFromMarker(s: string): string | null {
  const p = parseMarker(s);
  return p ? `/avatars/${p.style}-${p.seed}.svg` : null;
}
