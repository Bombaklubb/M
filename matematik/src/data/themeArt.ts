/**
 * Bakgrundsteman som tecknade bilder.
 *
 * Varje tema ritas som en SVG i koden och läggs in som en data-URL, så
 * teman kostar inga nätverksanrop alls och ingen bildfil behöver laddas ner.
 * Bilderna byggs först när de behövs och sparas sedan i minnet.
 *
 * Två sorters bilder finns:
 *   – scener (1600 × 1000) som täcker hela skärmen, som en målad kuliss, och
 *   – mönster (små rutor) som upprepas, som tyg eller tapet.
 * En scen kan också ha ett mönster ovanpå, till exempel snöflingor eller
 * kronblad som faller framför landskapet.
 *
 * Slumptal kommer från en fast frövärdesgenerator, så varje tema ser exakt
 * likadant ut varje gång och hos varje elev.
 */

export interface ThemeArt {
  /** CSS-bakgrund för hela sidan. */
  bg: string;
  /** CSS-bakgrund för förhandsvisningen i butiken. */
  preview: string;
}

const W = 1600;
const H = 1000;

// ─── Verktyg ──────────────────────────────────────────────────────────────────

type Rand = () => number;

function seeded(seed: number): Rand {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n1 = (v: number) => Math.round(v * 10) / 10;
const between = (r: Rand, a: number, b: number) => a + r() * (b - a);
const pick = <T,>(r: Rand, list: T[]): T => list[Math.floor(r() * list.length)];

/** Kodar en SVG för en data-URL med så få tecken som möjligt. */
function svgUrl(w: number, h: number, body: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`;
  const encoded = svg
    .replace(/"/g, "'")
    .replace(/\s+/g, " ")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    // Tecken utanför ASCII (×, π, ², å …) kodas som UTF-8, så att data-URL:en
    // tolkas likadant i alla webbläsare.
    .replace(/[^\x00-\x7F]/gu, (c) => encodeURIComponent(c));
  return `url("data:image/svg+xml,${encoded}")`;
}

interface Tile {
  body: string;
  w: number;
  h: number;
}

/** En målad kuliss, eventuellt med ett upprepat mönster framför. */
function scene(body: string, overlay?: Tile): ThemeArt {
  const u = svgUrl(W, H, body);
  const o = overlay ? svgUrl(overlay.w, overlay.h, overlay.body) : "";
  return {
    bg: (o ? `${o} 0 0 / ${overlay!.w}px ${overlay!.h}px repeat, ` : "") + `${u} center bottom / cover no-repeat`,
    preview: (o ? `${o} 0 0 / ${overlay!.w * 0.4}px ${overlay!.h * 0.4}px repeat, ` : "") + `${u} center / cover no-repeat`,
  };
}

/** Ett mönster som upprepas över hela sidan, med en bakgrund under. */
function pattern(tile: Tile, base: string, previewScale = 0.5): ThemeArt {
  const u = svgUrl(tile.w, tile.h, tile.body);
  return {
    bg: `${u} 0 0 / ${tile.w}px ${tile.h}px repeat, ${base}`,
    preview: `${u} 0 0 / ${n1(tile.w * previewScale)}px ${n1(tile.h * previewScale)}px repeat, ${base}`,
  };
}

/** Mjuk kurva genom punkterna (Catmull-Rom omräknad till Bézier). */
function smooth(p: [number, number][], closed = false): string {
  const n = p.length;
  const at = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${n1(p[0][0])} ${n1(p[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), a = at(i), b = at(i + 1), p3 = at(i + 2);
    d += ` C${n1(a[0] + (b[0] - p0[0]) / 6)} ${n1(a[1] + (b[1] - p0[1]) / 6)} ${n1(b[0] - (p3[0] - a[0]) / 6)} ${n1(b[1] - (p3[1] - a[1]) / 6)} ${n1(b[0])} ${n1(b[1])}`;
  }
  return closed ? d + "Z" : d;
}

/** Böljande kullar från vänster till höger kant, fyllda ner till botten. */
function hills(r: Rand, y: number, amp: number, count: number, fill: string, extra = ""): string {
  const pts: [number, number][] = [];
  for (let i = 0; i <= count; i++) pts.push([-120 + (i * (W + 240)) / count, y + (r() - 0.5) * 2 * amp]);
  return `<path d='${smooth(pts)} L${W + 120} ${H + 10} L-120 ${H + 10}Z' fill='${fill}' ${extra}/>`;
}

/** Taggiga berg. Med snow ritas snötäckta toppar. */
function mountains(r: Rand, base: number, lo: number, hi: number, count: number, fill: string, snow?: string): string {
  const step = (W + 200) / count;
  let d = `M-100 ${H + 10} L-100 ${base}`;
  let caps = "";
  for (let i = 0; i < count; i++) {
    const x = -100 + i * step;
    const px = x + step * between(r, 0.35, 0.65);
    const py = base - between(r, lo, hi);
    const vx = x + step;
    const vy = base - between(r, 0, lo * 0.5);
    d += ` L${n1(px)} ${n1(py)} L${n1(vx)} ${n1(vy)}`;
    if (snow) {
      const s = (base - py) * 0.22;
      const lx = px - s * 0.8, rx = px + s * 0.8;
      caps += `<path d='M${n1(px)} ${n1(py)} L${n1(rx)} ${n1(py + s)} L${n1(px + s * 0.3)} ${n1(py + s * 0.7)} L${n1(px)} ${n1(py + s * 1.05)} L${n1(px - s * 0.35)} ${n1(py + s * 0.72)} L${n1(lx)} ${n1(py + s)}Z' fill='${snow}'/>`;
    }
  }
  d += ` L${W + 100} ${H + 10}Z`;
  return `<path d='${d}' fill='${fill}'/>${caps}`;
}

/** En rund, oregelbunden fläck. */
function blob(r: Rand, cx: number, cy: number, rad: number, jitter = 0.3, points = 8): string {
  const p: [number, number][] = [];
  const turn = r() * Math.PI;
  for (let i = 0; i < points; i++) {
    const a = turn + (i / points) * Math.PI * 2;
    const rr = rad * (1 - jitter / 2 + r() * jitter);
    p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smooth(p, true);
}

/** Ritar en form på alla platser där den syns i en ruta som upprepas. */
function wrap(x: number, y: number, reach: number, w: number, h: number, draw: (x: number, y: number) => string): string {
  let out = "";
  for (const dx of [-w, 0, w]) {
    for (const dy of [-h, 0, h]) {
      const cx = x + dx, cy = y + dy;
      if (cx + reach < 0 || cx - reach > w || cy + reach < 0 || cy - reach > h) continue;
      out += draw(cx, cy);
    }
  }
  return out;
}

function cloud(x: number, y: number, s: number, fill: string, shade?: string): string {
  const puffs: [number, number, number][] = [
    [-62, 4, 30], [-28, -22, 42], [18, -34, 50], [58, -10, 38], [86, 8, 26], [0, 6, 44],
  ];
  const draw = (col: string, oy: number) =>
    `<g fill='${col}'>${puffs.map(([dx, dy, rr]) => `<circle cx='${n1(x + dx * s)}' cy='${n1(y + (dy + oy) * s)}' r='${n1(rr * s)}'/>`).join("")}<rect x='${n1(x - 62 * s)}' y='${n1(y + oy * s)}' width='${n1(148 * s)}' height='${n1(34 * s)}' rx='${n1(17 * s)}'/></g>`;
  return (shade ? draw(shade, 8) : "") + draw(fill, 0);
}

/** Fyrudding stjärna, som ett glittrande ljus. */
function sparkle(x: number, y: number, s: number, fill: string, extra = ""): string {
  return `<path d='M${n1(x)} ${n1(y - s)} Q${n1(x)} ${n1(y)} ${n1(x + s)} ${n1(y)} Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y + s)} Q${n1(x)} ${n1(y)} ${n1(x - s)} ${n1(y)} Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y - s)}Z' fill='${fill}' ${extra}/>`;
}

/** Femuddig stjärna. */
function star5(x: number, y: number, R: number, fill: string, extra = ""): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? R : R * 0.45;
    pts.push(`${n1(x + Math.cos(a) * rr)} ${n1(y + Math.sin(a) * rr)}`);
  }
  return `<path d='M${pts.join(" L")}Z' fill='${fill}' ${extra}/>`;
}

function heart(x: number, y: number, s: number, fill: string, extra = ""): string {
  return `<path d='M${n1(x)} ${n1(y + s * 0.9)} C${n1(x - s * 1.4)} ${n1(y)} ${n1(x - s * 0.9)} ${n1(y - s)} ${n1(x)} ${n1(y - s * 0.35)} C${n1(x + s * 0.9)} ${n1(y - s)} ${n1(x + s * 1.4)} ${n1(y)} ${n1(x)} ${n1(y + s * 0.9)}Z' fill='${fill}' ${extra}/>`;
}

function starField(r: Rand, count: number, x0: number, y0: number, w: number, h: number, colors: string[], rMin = 0.8, rMax = 2.2): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `<circle cx='${n1(x0 + r() * w)}' cy='${n1(y0 + r() * h)}' r='${n1(between(r, rMin, rMax))}' fill='${pick(r, colors)}' opacity='${n1(between(r, 0.45, 1))}'/>`;
  }
  return out;
}

/** Gran: tre staplade trianglar och en stam. */
function pine(x: number, base: number, h: number, fill: string, snow?: string): string {
  const w = h * 0.52;
  let out = `<rect x='${n1(x - h * 0.035)}' y='${n1(base - h * 0.14)}' width='${n1(h * 0.07)}' height='${n1(h * 0.16)}' fill='${fill}'/>`;
  for (let i = 0; i < 3; i++) {
    const top = base - h + i * h * 0.24;
    const bot = base - h * 0.12 - (2 - i) * h * 0.17;
    const ww = w * (0.55 + i * 0.22);
    out += `<path d='M${n1(x)} ${n1(top)} L${n1(x + ww / 2)} ${n1(bot)} L${n1(x - ww / 2)} ${n1(bot)}Z' fill='${fill}'/>`;
    if (snow) {
      const sh = (bot - top) * 0.3;
      out += `<path d='M${n1(x)} ${n1(top)} L${n1(x + ww * 0.17)} ${n1(top + sh)} L${n1(x + ww * 0.05)} ${n1(top + sh * 0.8)} L${n1(x - ww * 0.06)} ${n1(top + sh * 1.05)} L${n1(x - ww * 0.17)} ${n1(top + sh)}Z' fill='${snow}'/>`;
    }
  }
  return out;
}

/** Pixelbild: varje "#" i kartan blir en ruta. */
function pixels(map: string[], x: number, y: number, px: number, fill: string): string {
  let d = "";
  map.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === "#") d += `M${n1(x + i * px)} ${n1(y + j * px)}h${px}v${px}h-${px}z`;
    }
  });
  return `<path d='${d}' fill='${fill}'/>`;
}

function linGrad(id: string, stops: string[], vertical = true): string {
  const s = stops.map((c, i) => `<stop offset='${n1((i / (stops.length - 1)) * 100)}%' stop-color='${c}'/>`).join("");
  return `<linearGradient id='${id}' x1='0' y1='0' x2='${vertical ? 0 : 1}' y2='${vertical ? 1 : 0}'>${s}</linearGradient>`;
}

function glowGrad(id: string, color: string, opacity = 1): string {
  return `<radialGradient id='${id}'><stop offset='0%' stop-color='${color}' stop-opacity='${opacity}'/><stop offset='100%' stop-color='${color}' stop-opacity='0'/></radialGradient>`;
}

const sky = (id: string) => `<rect width='${W}' height='${H}' fill='url(#${id})'/>`;

// ─── Natur & rymd ─────────────────────────────────────────────────────────────

function skog(): ThemeArt {
  const r = seeded(11);
  let trees = "";
  const row = (base: number, lo: number, hi: number, gap: [number, number], fill: string) => {
    for (let x = -40; x < W + 60; x += between(r, gap[0], gap[1])) trees += pine(x, base + between(r, -10, 10), between(r, lo, hi), fill);
  };
  let body = `<defs>${linGrad("s", ["#d9f5ff", "#e9fbef", "#c8efd6"])}${glowGrad("sun", "#fff6c9", 0.95)}</defs>${sky("s")}`;
  body += `<circle cx='1220' cy='230' r='260' fill='url(#sun)'/><circle cx='1220' cy='230' r='70' fill='#fff8d8'/>`;
  body += cloud(360, 170, 1.1, "#ffffff", "#e2f3fb") + cloud(900, 120, 0.8, "#ffffff", "#e2f3fb");
  body += hills(r, 600, 40, 6, "#b3e5c6");
  row(640, 90, 150, [30, 50], "#8fd1ab");
  body += trees; trees = "";
  body += hills(r, 700, 35, 5, "#72bd92");
  row(760, 170, 250, [45, 75], "#4f9f74");
  body += trees; trees = "";
  body += hills(r, 850, 25, 5, "#3d8a60");
  row(1000, 360, 470, [110, 170], "#2b6e4a");
  body += trees;
  body += `<path d='M0 1000 L0 960 Q400 930 800 955 T1600 950 L1600 1000Z' fill='#245c3e'/>`;
  return scene(body);
}

function hav(): ThemeArt {
  const r = seeded(12);
  let body = `<defs>${linGrad("s", ["#8fd3ff", "#cdeeff", "#f1fbff"])}${linGrad("sea", ["#4cb3ea", "#1f7fc8", "#0b4f93"])}${glowGrad("sun", "#fff4c4", 0.9)}</defs>${sky("s")}`;
  body += `<circle cx='1180' cy='250' r='230' fill='url(#sun)'/><circle cx='1180' cy='250' r='72' fill='#fff7d1'/>`;
  body += cloud(300, 200, 1.2, "#ffffff", "#dcefff") + cloud(760, 130, 0.75, "#ffffff", "#dcefff") + cloud(1450, 170, 0.9, "#ffffff", "#dcefff");
  body += `<path d='M-20 580 C120 540 220 530 330 560 C400 575 440 580 480 580Z' fill='#6fb08a'/><path d='M1300 580 C1380 555 1450 548 1620 570 L1620 580Z' fill='#7fbf9a'/>`;
  body += `<rect y='578' width='${W}' height='${H - 578}' fill='url(#sea)'/>`;
  const waveColors = ["#7cc8f2", "#56b0e6", "#3a95d6", "#2a7fc1", "#1d6aab"];
  for (let i = 0; i < 5; i++) {
    const y = 610 + i * 80;
    const amp = 8 + i * 4;
    const len = 160 + i * 40;
    let d = `M-40 ${y}`;
    for (let x = -40; x < W + len; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
    body += `<path d='${d} L${W + 200} ${H + 10} L-40 ${H + 10}Z' fill='${waveColors[i]}' opacity='0.75'/>`;
  }
  for (let i = 0; i < 26; i++) {
    const x = 1180 + between(r, -160, 160) * (1 + i / 20);
    const y = 600 + i * 14;
    body += `<rect x='${n1(x)}' y='${n1(y)}' width='${n1(between(r, 20, 70))}' height='3' rx='1.5' fill='#fff8d8' opacity='${n1(0.9 - i * 0.03)}'/>`;
  }
  // Segelbåt
  body += `<g transform='translate(420 520)'><path d='M-70 40 L70 40 L50 66 L-50 66Z' fill='#b45309'/><rect x='-3' y='-110' width='6' height='150' fill='#78350f'/><path d='M6 -104 L6 30 L78 30Z' fill='#ffffff'/><path d='M-6 -90 L-6 30 L-62 30Z' fill='#f87171'/><path d='M3 -110 L30 -100 L3 -92Z' fill='#facc15'/></g>`;
  for (let i = 0; i < 4; i++) {
    const x = between(r, 150, 1500), y = between(r, 80, 320);
    body += `<path d='M${n1(x - 14)} ${n1(y)} q7 -8 14 0 q7 -8 14 0' fill='none' stroke='#4b5563' stroke-width='2.5' stroke-linecap='round'/>`;
  }
  return scene(body);
}

function snowflake(x: number, y: number, s: number, color: string, op: number): string {
  let d = "";
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3;
    const cx = Math.cos(a), cy = Math.sin(a);
    d += `M${n1(x)} ${n1(y)} L${n1(x + cx * s)} ${n1(y + cy * s)}`;
    const bx = x + cx * s * 0.55, by = y + cy * s * 0.55;
    for (const side of [-1, 1]) {
      const b = a + side * 0.75;
      d += ` M${n1(bx)} ${n1(by)} L${n1(bx + Math.cos(b) * s * 0.32)} ${n1(by + Math.sin(b) * s * 0.32)}`;
    }
  }
  return `<path d='${d}' stroke='${color}' stroke-width='${n1(Math.max(1.4, s * 0.11))}' stroke-linecap='round' fill='none' opacity='${op}'/>`;
}

function vinter(): ThemeArt {
  const r = seeded(13);
  let body = `<defs>${linGrad("s", ["#bfe3fb", "#dff1fd", "#f4faff"])}</defs>${sky("s")}`;
  body += `<circle cx='300' cy='220' r='60' fill='#fffdf2' opacity='0.9'/>`;
  body += mountains(r, 640, 120, 280, 6, "#c8dcef", "#ffffff");
  body += hills(r, 700, 30, 5, "#e8f2fb");
  let trees = "";
  for (let x = -20; x < W + 40; x += between(r, 50, 90)) trees += pine(x, 740 + between(r, -10, 10), between(r, 130, 200), "#3b7a74", "#ffffff");
  body += trees;
  body += hills(r, 800, 30, 4, "#f4f9ff") + hills(r, 900, 20, 4, "#ffffff");
  trees = "";
  for (const x of [80, 190, 1400, 1520]) trees += pine(x, 1000, between(r, 330, 420), "#2c5f5a", "#ffffff");
  body += trees;
  // Snögubbe
  body += `<g transform='translate(1180 880)'><circle cy='40' r='62' fill='#ffffff' stroke='#dbe7f3' stroke-width='3'/><circle cy='-50' r='44' fill='#ffffff' stroke='#dbe7f3' stroke-width='3'/><circle cy='-120' r='30' fill='#ffffff' stroke='#dbe7f3' stroke-width='3'/><circle cx='-10' cy='-126' r='3.5' fill='#1f2937'/><circle cx='10' cy='-126' r='3.5' fill='#1f2937'/><path d='M0 -118 L26 -112 L0 -110Z' fill='#f97316'/><path d='M-32 -146 h64 v8 h-64z M-20 -176 h40 v32 h-40z' fill='#1f2937'/><path d='M-40 -92 Q0 -78 40 -92 L44 -80 Q0 -66 -44 -80Z' fill='#ef4444'/><circle cy='-60' r='4' fill='#1f2937'/><circle cy='-40' r='4' fill='#1f2937'/></g>`;
  let flakes = "";
  const fr = seeded(113);
  for (let i = 0; i < 9; i++) {
    const x = between(fr, 0, 240), y = between(fr, 0, 240), s = between(fr, 5, 13);
    flakes += wrap(x, y, s, 240, 240, (a, b) => snowflake(a, b, s, "#ffffff", 0.95));
  }
  return scene(body, { body: flakes, w: 240, h: 240 });
}

function solnedgang(): ThemeArt {
  const r = seeded(14);
  let stripes = "";
  for (let i = 0; i < 6; i++) stripes += `<rect x='500' y='${560 + i * 12 + i * i * 1.2}' width='600' height='${3 + i * 1.6}' fill='black'/>`;
  let body = `<defs>${linGrad("s", ["#43206f", "#8a2e8c", "#e2517d", "#ff8a4c", "#ffcf6e"])}${linGrad("sun", ["#fff3b0", "#ffb347", "#ff6f61"])}${linGrad("sea", ["#6b2a6d", "#3d1a4f", "#1f1036"])}<mask id='m'><rect width='${W}' height='${H}' fill='white'/>${stripes}</mask>${glowGrad("g", "#ffd28a", 0.7)}</defs>`;
  body += `<rect width='${W}' height='640' fill='url(#s)'/>`;
  body += `<circle cx='800' cy='560' r='420' fill='url(#g)'/>`;
  body += `<circle cx='800' cy='560' r='200' fill='url(#sun)' mask='url(#m)'/>`;
  for (let i = 0; i < 5; i++) {
    const y = between(r, 150, 420), x = between(r, 0, W);
    body += `<rect x='${n1(x)}' y='${n1(y)}' width='${n1(between(r, 180, 380))}' height='${n1(between(r, 8, 16))}' rx='8' fill='#ffc2a8' opacity='0.45'/>`;
  }
  body += `<path d='M-20 640 L-20 590 C60 560 140 555 240 600 L300 640Z' fill='#2b123d'/><path d='M1620 640 L1620 575 C1540 545 1440 560 1360 610 L1320 640Z' fill='#2b123d'/>`;
  body += `<rect y='640' width='${W}' height='${H - 640}' fill='url(#sea)'/>`;
  for (let i = 0; i < 16; i++) {
    const w = 380 - i * 20 + between(r, -20, 20);
    body += `<rect x='${n1(800 - w / 2)}' y='${n1(650 + i * 20)}' width='${n1(w)}' height='${n1(4 + i * 0.4)}' rx='3' fill='#ffb070' opacity='${n1(0.85 - i * 0.045)}'/>`;
  }
  // Palmer
  const palm = (x: number, y: number, s: number) => {
    let p = `<path d='M${x} ${y} C${x + 10 * s} ${y - 120 * s} ${x - 6 * s} ${y - 220 * s} ${x + 30 * s} ${y - 300 * s}' stroke='#1c0b28' stroke-width='${14 * s}' fill='none' stroke-linecap='round'/>`;
    const tx = x + 30 * s, ty = y - 300 * s;
    for (const [dx, dy] of [[-130, 30], [-100, -40], [-20, -70], [70, -50], [130, 20], [100, 60], [-60, 70]]) {
      p += `<path d='M${tx} ${ty} Q${tx + dx * 0.5 * s} ${ty + (dy - 50) * 0.6 * s} ${tx + dx * s} ${ty + dy * s} Q${tx + dx * 0.45 * s} ${ty + (dy - 10) * 0.45 * s} ${tx} ${ty}Z' fill='#1c0b28'/>`;
    }
    return p;
  };
  body += `<path d='M-40 1000 L-40 900 C100 860 260 870 380 920 L420 1000Z' fill='#1c0b28'/><path d='M1640 1000 L1640 880 C1500 850 1340 880 1260 940 L1240 1000Z' fill='#1c0b28'/>`;
  body += palm(140, 900, 1.25) + palm(1480, 890, 1.1) + palm(260, 930, 0.75);
  for (let i = 0; i < 6; i++) {
    const x = between(r, 450, 1200), y = between(r, 200, 420), s = between(r, 0.7, 1.3);
    body += `<path d='M${n1(x - 16 * s)} ${n1(y)} q${n1(8 * s)} ${n1(-9 * s)} ${n1(16 * s)} 0 q${n1(8 * s)} ${n1(-9 * s)} ${n1(16 * s)} 0' fill='none' stroke='#2b123d' stroke-width='3' stroke-linecap='round'/>`;
  }
  return scene(body);
}

function rymd(): ThemeArt {
  const r = seeded(15);
  let body = `<defs>${linGrad("s", ["#130d3a", "#261a68", "#3a2a92"])}${linGrad("p", ["#ffd08a", "#ff8f70", "#d45d9b"])}${linGrad("b", ["#7dd3fc", "#3b82f6"])}${glowGrad("n1", "#a855f7", 0.45)}${glowGrad("n2", "#22d3ee", 0.3)}<clipPath id='pc'><circle cx='1240' cy='300' r='130'/></clipPath></defs>${sky("s")}`;
  body += `<circle cx='400' cy='300' r='420' fill='url(#n1)'/><circle cx='1300' cy='800' r='380' fill='url(#n2)'/>`;
  body += starField(r, 220, 0, 0, W, H, ["#ffffff", "#fde68a", "#c7d2fe"]);
  for (let i = 0; i < 10; i++) body += sparkle(between(r, 0, W), between(r, 0, H), between(r, 6, 13), "#ffffff", "opacity='0.9'");
  // Ringplanet
  body += `<ellipse cx='1240' cy='300' rx='250' ry='60' fill='none' stroke='#fcd9a8' stroke-width='14' opacity='0.8' transform='rotate(-14 1240 300)'/>`;
  body += `<circle cx='1240' cy='300' r='130' fill='url(#p)'/><g clip-path='url(#pc)' opacity='0.35'><rect x='1100' y='230' width='300' height='18' fill='#fff'/><rect x='1100' y='280' width='300' height='10' fill='#7c2d12'/><rect x='1100' y='330' width='300' height='22' fill='#fff'/><circle cx='1290' cy='250' r='130' fill='#000' opacity='0.35' transform='translate(40 40)'/></g>`;
  body += `<path d='M1004 334 A250 60 0 0 0 1476 266' transform='rotate(-14 1240 300)' fill='none' stroke='#fcd9a8' stroke-width='14' opacity='0.9'/>`;
  // Liten blå planet
  body += `<circle cx='300' cy='760' r='80' fill='url(#b)'/><circle cx='275' cy='740' r='14' fill='#1d4ed8' opacity='0.4'/><circle cx='325' cy='790' r='10' fill='#1d4ed8' opacity='0.4'/><circle cx='320' cy='725' r='7' fill='#1d4ed8' opacity='0.4'/>`;
  // Raket
  body += `<g transform='translate(560 330) rotate(40)'><path d='M0 -110 C40 -70 44 -10 34 50 L-34 50 C-44 -10 -40 -70 0 -110Z' fill='#f8fafc'/><path d='M0 -110 C22 -88 30 -70 32 -56 L-32 -56 C-30 -70 -22 -88 0 -110Z' fill='#ef4444'/><circle cy='-18' r='17' fill='#38bdf8' stroke='#94a3b8' stroke-width='5'/><path d='M-34 20 L-62 70 L-30 58Z M34 20 L62 70 L30 58Z' fill='#ef4444'/><path d='M-20 52 Q0 140 20 52Z' fill='#fb923c'/><path d='M-10 52 Q0 105 10 52Z' fill='#fde047'/></g>`;
  body += `<path d='M880 140 L1060 80' stroke='#ffffff' stroke-width='3' stroke-linecap='round' opacity='0.8'/><circle cx='1060' cy='80' r='4' fill='#fff'/>`;
  body += `<circle cx='980' cy='760' r='36' fill='#c4b5fd'/><circle cx='992' cy='750' r='36' fill='#261a68'/>`;
  return scene(body);
}

function lava(): ThemeArt {
  const r = seeded(16);
  let body = `<defs>${linGrad("s", ["#1a0606", "#4a0f0f", "#9a2a0c", "#e2561b"])}${linGrad("l", ["#fff3a3", "#ffb020", "#ff5a1f"])}${glowGrad("g", "#ff7a1a", 0.8)}${linGrad("rock", ["#3a1510", "#1c0907"])}</defs>${sky("s")}`;
  for (let i = 0; i < 7; i++) body += `<path d='${blob(r, 800 + between(r, -160, 160), 240 - i * 40, between(r, 60, 110))}' fill='#2a0f0c' opacity='${n1(0.55 - i * 0.05)}'/>`;
  body += `<circle cx='800' cy='330' r='260' fill='url(#g)'/>`;
  body += `<path d='M180 1000 L620 360 Q700 330 760 350 L840 350 Q900 330 980 360 L1420 1000Z' fill='url(#rock)'/>`;
  body += `<path d='M640 360 Q800 300 960 360 Q800 390 640 360Z' fill='#ffcf4a'/>`;
  const flow = (pts: [number, number][], w: number) =>
    `<path d='${smooth(pts)}' stroke='#ff6a1a' stroke-width='${w * 2.4}' fill='none' stroke-linecap='round' opacity='0.35'/><path d='${smooth(pts)}' stroke='url(#l)' stroke-width='${w}' fill='none' stroke-linecap='round'/>`;
  body += flow([[700, 370], [660, 480], [700, 580], [620, 700], [560, 840], [520, 1000]], 22);
  body += flow([[880, 370], [930, 470], [880, 560], [960, 690], [1040, 830], [1090, 1000]], 26);
  body += flow([[790, 370], [780, 520], [820, 650], [800, 800], [820, 1000]], 14);
  body += mountains(r, 1000, 90, 260, 7, "#150605");
  for (let i = 0; i < 60; i++) {
    const x = between(r, 0, W), y = between(r, 0, 900), rr = between(r, 1.5, 4.5);
    body += `<circle cx='${n1(x)}' cy='${n1(y)}' r='${n1(rr)}' fill='${pick(r, ["#ffd166", "#ff9f1c", "#ff5a1f"])}' opacity='${n1(between(r, 0.5, 1))}'/>`;
  }
  return scene(body);
}

function galax(): ThemeArt {
  const r = seeded(17);
  let body = `<defs>${linGrad("s", ["#0a0520", "#1a0d44", "#120832"])}${glowGrad("c", "#fff1c9", 1)}${glowGrad("m", "#d946ef", 0.4)}${glowGrad("t", "#22d3ee", 0.32)}${glowGrad("v", "#7c3aed", 0.5)}</defs>${sky("s")}`;
  body += `<circle cx='300' cy='250' r='420' fill='url(#m)'/><circle cx='1350' cy='750' r='460' fill='url(#t)'/><circle cx='800' cy='500' r='560' fill='url(#v)'/>`;
  body += starField(r, 320, 0, 0, W, H, ["#ffffff", "#fde68a", "#c4b5fd", "#a5f3fc"], 0.6, 2);
  let arms = "";
  for (let arm = 0; arm < 2; arm++) {
    for (let i = 0; i < 260; i++) {
      const t = i / 260;
      const a = arm * Math.PI + t * Math.PI * 3.1;
      const rad = 18 + t * 360;
      const sx = Math.cos(a) * rad + between(r, -22, 22) * (0.3 + t);
      const sy = Math.sin(a) * rad + between(r, -22, 22) * (0.3 + t);
      arms += `<circle cx='${n1(sx)}' cy='${n1(sy)}' r='${n1(between(r, 1.4, 4) * (1.3 - t * 0.6))}' fill='${pick(r, ["#ffffff", "#fbcfe8", "#c7d2fe", "#fde68a"])}' opacity='${n1(between(r, 0.5, 1))}'/>`;
    }
  }
  body += `<g transform='translate(800 470) rotate(-18) scale(1 0.5)'><circle r='380' fill='url(#v)'/>${arms}<circle r='170' fill='url(#c)' opacity='0.7'/><circle r='70' fill='url(#c)'/></g>`;
  for (let i = 0; i < 14; i++) body += sparkle(between(r, 0, W), between(r, 0, H), between(r, 7, 16), pick(r, ["#ffffff", "#fde68a", "#a5f3fc"]));
  return scene(body);
}

function regnbage(): ThemeArt {
  const r = seeded(18);
  let body = `<defs>${linGrad("s", ["#6ec3f7", "#a9dcfb", "#e3f4ff"])}${glowGrad("sun", "#fff6c2", 0.9)}</defs>${sky("s")}`;
  body += `<circle cx='220' cy='160' r='220' fill='url(#sun)'/><circle cx='220' cy='160' r='64' fill='#fff7c9'/>`;
  const cols = ["#ff6b6b", "#ffa94d", "#ffe066", "#8ce99a", "#74c0fc", "#9775fa", "#e599f7"];
  cols.forEach((c, i) => {
    const rr = 720 - i * 44;
    body += `<path d='M${800 - rr} 1000 A${rr} ${rr} 0 0 1 ${800 + rr} 1000' fill='none' stroke='${c}' stroke-width='46'/>`;
  });
  body += `<path d='M${800 - 720 - 23} 1000 A743 743 0 0 1 ${800 + 743} 1000' fill='none' stroke='#ffffff' stroke-width='4' opacity='0.5'/>`;
  body += cloud(160, 930, 2.3, "#ffffff", "#dbeafe") + cloud(1460, 930, 2.3, "#ffffff", "#dbeafe");
  body += cloud(560, 180, 0.9, "#ffffff", "#e0efff") + cloud(1200, 120, 1.1, "#ffffff", "#e0efff") + cloud(1450, 380, 0.7, "#ffffff", "#e0efff");
  for (let i = 0; i < 12; i++) body += sparkle(between(r, 300, 1300), between(r, 60, 700), between(r, 8, 16), "#ffffff", "opacity='0.9'");
  return scene(body);
}

function stjarnhimmel(): ThemeArt {
  const r = seeded(19);
  let body = `<defs>${linGrad("s", ["#04081f", "#0e1a4a", "#24397e", "#3a4f95"])}${glowGrad("mw", "#c7d2fe", 0.35)}${glowGrad("fire", "#ffb454", 0.8)}</defs>${sky("s")}`;
  body += `<g transform='rotate(-24 800 420)'><ellipse cx='800' cy='420' rx='900' ry='120' fill='url(#mw)'/>${starField(r, 260, -100, 330, 1800, 180, ["#ffffff", "#e0e7ff", "#fde68a"], 0.5, 1.6)}</g>`;
  body += starField(r, 180, 0, 0, W, 700, ["#ffffff", "#fde68a", "#bfdbfe"], 0.7, 2.2);
  for (let i = 0; i < 12; i++) body += sparkle(between(r, 0, W), between(r, 0, 600), between(r, 6, 12), "#ffffff");
  body += `<path d='M1100 120 L1320 60' stroke='#ffffff' stroke-width='3' stroke-linecap='round' opacity='0.85'/><path d='M300 90 L430 55' stroke='#ffffff' stroke-width='2' stroke-linecap='round' opacity='0.6'/>`;
  body += `<circle cx='1340' cy='200' r='60' fill='#fff8dc'/><circle cx='1366' cy='186' r='56' fill='#0e1a4a'/>`;
  body += hills(r, 780, 40, 5, "#101a3f");
  let trees = "";
  for (let x = -20; x < W + 40; x += between(r, 40, 90)) if (x < 520 || x > 1080) trees += pine(x, 830 + between(r, -20, 20), between(r, 120, 220), "#0a1230");
  body += trees;
  body += hills(r, 880, 20, 4, "#0a1230");
  // Tält och lägereld
  body += `<circle cx='860' cy='880' r='170' fill='url(#fire)'/><path d='M640 900 L740 760 L840 900Z' fill='#f59e0b'/><path d='M740 760 L700 900 L780 900Z' fill='#7c2d12'/><path d='M845 898 l30 -44 l14 22 l10 -30 l16 52Z' fill='#ffcf4a'/><rect x='840' y='895' width='70' height='8' rx='4' fill='#5b3417'/>`;
  return scene(body);
}

function bubbelhav(): ThemeArt {
  const r = seeded(20);
  let body = `<defs>${linGrad("s", ["#7fd6ff", "#2a9fd8", "#0d5c97", "#0a3c6b"])}${linGrad("ray", ["#ffffff", "#ffffff00"])}${linGrad("sand", ["#f1dcaa", "#d9bd83"])}</defs>${sky("s")}`;
  for (let i = 0; i < 7; i++) {
    const x = 120 + i * 230 + between(r, -40, 40);
    body += `<path d='M${n1(x)} -10 L${n1(x + 90)} -10 L${n1(x + 260)} 1000 L${n1(x + 140)} 1000Z' fill='url(#ray)' opacity='${n1(between(r, 0.08, 0.18))}'/>`;
  }
  body += `<path d='M0 1000 L0 890 C200 850 420 880 620 900 C860 925 1100 860 1300 870 C1440 878 1540 900 1600 890 L1600 1000Z' fill='url(#sand)'/>`;
  const weed = (x: number, h: number, c: string) => {
    let d = `M${x} 1000`;
    for (let y = 0; y < h; y += 40) d += ` q${y % 80 === 0 ? 22 : -22} -20 0 -40`;
    return `<path d='${d}' stroke='${c}' stroke-width='14' fill='none' stroke-linecap='round'/>`;
  };
  for (const [x, h, c] of [[70, 320, "#15803d"], [110, 240, "#22c55e"], [250, 180, "#16a34a"], [1350, 280, "#15803d"], [1400, 360, "#22c55e"], [1500, 220, "#16a34a"], [900, 160, "#16a34a"]] as [number, number, string][]) body += weed(x, h, c);
  for (let i = 0; i < 5; i++) {
    const x = between(r, 200, 1400), y = between(r, 200, 700), s = between(r, 0.6, 1.1);
    body += `<g transform='translate(${n1(x)} ${n1(y)}) scale(${n1(s)})' opacity='0.35'><path d='M-40 0 C-20 -24 20 -24 40 0 C20 24 -20 24 -40 0Z M36 0 L64 -20 L64 20Z' fill='#0a3c6b'/></g>`;
  }
  let bubbles = "";
  const br = seeded(120);
  for (let i = 0; i < 12; i++) {
    const x = between(br, 0, 260), y = between(br, 0, 260), rr = between(br, 4, 18);
    bubbles += wrap(x, y, rr, 260, 260, (a, b) => `<circle cx='${n1(a)}' cy='${n1(b)}' r='${n1(rr)}' fill='#ffffff' fill-opacity='0.12' stroke='#ffffff' stroke-opacity='0.7' stroke-width='1.6'/><circle cx='${n1(a - rr * 0.35)}' cy='${n1(b - rr * 0.35)}' r='${n1(rr * 0.25)}' fill='#ffffff' opacity='0.85'/>`);
  }
  return scene(body, { body: bubbles, w: 260, h: 260 });
}

// ─── Mönster ──────────────────────────────────────────────────────────────────

function prickigt(): ThemeArt {
  const dot = (x: number, y: number, c: string) => `<circle cx='${x}' cy='${y}' r='22' fill='${c}'/><circle cx='${x - 7}' cy='${y - 8}' r='5.5' fill='#ffffff' opacity='0.55'/>`;
  const body = dot(40, 40, "#f9a8d4") + dot(120, 120, "#7dd3fc");
  return pattern({ body, w: 160, h: 160 }, "#fde68a");
}

function godis(): ThemeArt {
  const r = seeded(21);
  let body = "";
  const T = 280;
  const lolly = (x: number, y: number, c1: string, c2: string) => {
    let s = `<rect x='${x - 3}' y='${y + 26}' width='6' height='54' rx='3' fill='#fff7ed' stroke='#e5d5c5' stroke-width='1'/><circle cx='${x}' cy='${y}' r='30' fill='${c1}'/>`;
    let d = `M${x} ${y}`;
    for (let a = 0; a < Math.PI * 5.5; a += 0.3) d += ` L${n1(x + Math.cos(a) * a * 1.7)} ${n1(y + Math.sin(a) * a * 1.7)}`;
    s += `<path d='${d}' stroke='${c2}' stroke-width='6' fill='none' stroke-linecap='round'/><circle cx='${x - 10}' cy='${y - 12}' r='6' fill='#fff' opacity='0.6'/>`;
    return s;
  };
  const wrapped = (x: number, y: number, c: string, rot: number) =>
    `<g transform='translate(${x} ${y}) rotate(${rot})'><path d='M-26 0 L-44 -16 L-40 0 L-44 16Z M26 0 L44 -16 L40 0 L44 16Z' fill='${c}' opacity='0.8'/><ellipse rx='28' ry='20' fill='${c}'/><path d='M-14 -18 Q-4 0 -14 18 M0 -20 Q10 0 0 20 M14 -18 Q24 0 14 18' stroke='#fff' stroke-width='4' fill='none' opacity='0.7'/></g>`;
  body += lolly(70, 60, "#f472b6", "#ffffff") + lolly(210, 190, "#60a5fa", "#fef08a");
  body += wrapped(200, 60, "#a78bfa", -20) + wrapped(70, 210, "#34d399", 25);
  for (let i = 0; i < 26; i++) {
    const x = between(r, 0, T), y = between(r, 0, T), c = pick(r, ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ffffff"]);
    const rot = between(r, 0, 180);
    body += wrap(x, y, 8, T, T, (a, b) => `<rect x='${n1(a - 7)}' y='${n1(b - 2)}' width='14' height='4.5' rx='2.2' fill='${c}' transform='rotate(${n1(rot)} ${n1(a)} ${n1(b)})'/>`);
  }
  return pattern({ body, w: T, h: T }, "repeating-linear-gradient(45deg, #ffe4ef 0 22px, #ffd3e5 22px 44px)");
}

function rutmonster(): ThemeArt {
  const body = `<rect width='30' height='60' fill='#a78bfa' opacity='0.45'/><rect width='60' height='30' fill='#a78bfa' opacity='0.45'/><path d='M0 45 H60 M45 0 V60' stroke='#ffffff' stroke-width='1.5' stroke-dasharray='4 4' opacity='0.8'/><path d='M0 15 H60 M15 0 V60' stroke='#7c3aed' stroke-width='1' stroke-dasharray='3 5' opacity='0.35'/>`;
  return pattern({ body, w: 60, h: 60 }, "#faf5ff", 0.6);
}

function kamouflage(): ThemeArt {
  const r = seeded(22);
  const T = 340;
  let body = "";
  for (const c of ["#8a9a5b", "#4d5b2c", "#2f3620", "#a1946a"]) {
    for (let i = 0; i < 5; i++) {
      const x = between(r, 0, T), y = between(r, 0, T), rr = between(r, 26, 58);
      const seed = Math.floor(r() * 1e6);
      body += wrap(x, y, rr * 1.3, T, T, (a, b) => `<path d='${blob(seeded(seed), a, b, rr, 0.55, 9)}' fill='${c}'/>`);
    }
  }
  return pattern({ body, w: T, h: T }, "#6b7a3a");
}

// ─── Djur ─────────────────────────────────────────────────────────────────────

function zebra(): ThemeArt {
  const r = seeded(23);
  const T = 320;
  let body = "";
  const n = 7;
  for (let i = 0; i < n; i++) {
    const x0 = (i * T) / n;
    const ph = r() * Math.PI * 2, ph2 = r() * Math.PI * 2, pw = r() * Math.PI * 2;
    const left: [number, number][] = [], right: [number, number][] = [];
    for (let y = -20; y <= T + 20; y += 16) {
      const t = (y / T) * Math.PI * 2;
      const cx = x0 + 16 * Math.sin(t + ph) + 7 * Math.sin(2 * t + ph2);
      const w = 13 + 7 * Math.sin(t + pw);
      left.push([cx - w / 2, y]);
      right.push([cx + w / 2, y]);
    }
    const shape = [...left, ...right.reverse()];
    for (const dx of [-T, 0, T]) body += `<path d='${smooth(shape.map(([a, b]) => [a + dx, b] as [number, number]), true)}' fill='#1f2230'/>`;
  }
  return pattern({ body, w: T, h: T }, "#f8f7f2");
}

function stripe(r: Rand, x: number, y: number, len: number, dir: number, thick: number): string {
  const pts: [number, number][] = [];
  const bottom: [number, number][] = [];
  const bend = between(r, -26, 26);
  const drop = between(r, -30, 30);
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const px = x + dir * len * t;
    const py = y + bend * Math.sin(t * Math.PI) + drop * t;
    // Tjock vid kanten, spetsig i änden, med en liten svällning på mitten.
    const th = thick * Math.pow(1 - t, 0.7) * (1 + 0.25 * Math.sin(t * Math.PI));
    pts.push([px, py - th / 2]);
    bottom.push([px, py + th / 2]);
  }
  return smooth([...pts, ...bottom.reverse()], true);
}

function tiger(): ThemeArt {
  const r = seeded(24);
  const T = 380;
  let body = "";
  for (let i = 0; i < 10; i++) {
    const y = (i + 0.5) * (T / 10) + between(r, -6, 6);
    const fromLeft = i % 2 === 0;
    const x = fromLeft ? between(r, -20, 20) : T - between(r, -20, 20);
    const len = between(r, 170, 250);
    const d = stripe(seeded(Math.floor(r() * 1e6)), x, y, len, fromLeft ? 1 : -1, between(r, 22, 32));
    for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) body += `<path d='${d}' fill='#1c140f' transform='translate(${dx} ${dy})'/>`;
  }
  return pattern({ body, w: T, h: T }, "radial-gradient(circle at 50% 40%, #fbbf24, #f59e0b 45%, #d97706)");
}

function leopard(): ThemeArt {
  const r = seeded(25);
  const T = 300;
  let body = "";
  const spots: [number, number][] = [];
  for (let gy = 0; gy < 4; gy++) for (let gx = 0; gx < 4; gx++) spots.push([(gx + 0.5 + (gy % 2) * 0.5) * (T / 4) + between(r, -10, 10), (gy + 0.5) * (T / 4) + between(r, -10, 10)]);
  for (const [x, y] of spots) {
    const seed = Math.floor(r() * 1e6);
    const pieces = 4 + Math.floor(r() * 2);
    body += wrap(x, y, 40, T, T, (a, b) => {
      const rr = seeded(seed);
      let s = `<path d='${blob(rr, a, b, 17, 0.4)}' fill='#c7802f'/>`;
      for (let k = 0; k < pieces; k++) {
        const ang = (k / pieces) * Math.PI * 2 + rr() * 0.4;
        s += `<path d='${blob(rr, a + Math.cos(ang) * 22, b + Math.sin(ang) * 22, 8.5, 0.6, 6)}' fill='#2e1d10'/>`;
      }
      return s;
    });
  }
  return pattern({ body, w: T, h: T }, "#ecc07a");
}

function giraff(): ThemeArt {
  const r = seeded(26);
  const T = 260;
  const N = 4;
  const cell = T / N;
  const pts: [number, number][][] = [];
  for (let j = 0; j <= N; j++) {
    pts[j] = [];
    for (let i = 0; i <= N; i++) {
      const jx = i === N ? pts[j][0][0] - 0 : between(r, -12, 12);
      pts[j][i] = [i * cell + (i === N ? jx : jx), j * cell + between(r, -12, 12)];
    }
  }
  // Kanterna måste passa ihop när rutan upprepas.
  for (let j = 0; j <= N; j++) pts[j][N] = [pts[j][0][0] + T, pts[j][0][1]];
  for (let i = 0; i <= N; i++) pts[N][i] = [pts[0][i][0], pts[0][i][1] + T];
  let body = "";
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const c = [pts[j][i], pts[j][i + 1], pts[j + 1][i + 1], pts[j + 1][i]];
      const cx = c.reduce((s, p) => s + p[0], 0) / 4, cy = c.reduce((s, p) => s + p[1], 0) / 4;
      // Kanterna blir mjuka kurvor genom mittpunkterna, som riktiga giraffläckar.
      const inset = c.map(([x, y]) => [cx + (x - cx) * 0.74, cy + (y - cy) * 0.74] as [number, number]);
      const round: [number, number][] = [];
      inset.forEach((p, k) => {
        const q = inset[(k + 1) % 4];
        round.push(p, [(p[0] + q[0]) / 2 + between(r, -4, 4), (p[1] + q[1]) / 2 + between(r, -4, 4)]);
      });
      const d = smooth(round, true);
      const col = pick(r, ["#b8672a", "#a85b22", "#c07032"]);
      for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) body += `<path d='${d}' fill='${col}' transform='translate(${dx} ${dy})'/>`;
    }
  }
  return pattern({ body, w: T, h: T }, "#f5e2b8");
}

const HORSE = "M40 50 C70 40 110 42 128 44 C140 30 150 14 160 6 L166 0 L169 9 C178 14 190 28 196 40 C198 46 192 51 185 49 C176 47 168 50 162 58 C156 68 152 78 150 88 L153 158 L145 158 L141 102 L136 102 L138 158 L130 158 L125 99 C110 103 82 103 66 99 L63 158 L55 158 L52 106 L47 106 L47 158 L39 158 L34 96 C26 86 25 66 33 56 C22 62 16 80 12 112 C8 92 14 64 34 50Z";

function hastar(): ThemeArt {
  const r = seeded(27);
  let body = `<defs>${linGrad("s", ["#a9dcfa", "#d4eefc", "#f2faff"])}</defs>${sky("s")}`;
  body += cloud(300, 160, 1, "#ffffff", "#e3f1fb") + cloud(1100, 110, 1.2, "#ffffff", "#e3f1fb");
  body += hills(r, 560, 50, 4, "#bfe3a5") + hills(r, 660, 40, 4, "#9fd488");
  // Lada
  body += `<g transform='translate(1260 520)'><path d='M-110 30 L0 -70 L110 30Z' fill='#991b1b'/><rect x='-100' y='20' width='200' height='150' fill='#dc2626'/><path d='M-100 20 L0 -70 L100 20' fill='none' stroke='#fff' stroke-width='8'/><rect x='-40' y='80' width='80' height='90' fill='#7f1d1d'/><path d='M-40 80 L40 170 M40 80 L-40 170' stroke='#fff' stroke-width='6'/><rect x='-40' y='80' width='80' height='90' fill='none' stroke='#fff' stroke-width='6'/><rect x='-18' y='-10' width='36' height='30' fill='#fef3c7' stroke='#fff' stroke-width='4'/></g>`;
  body += hills(r, 730, 30, 4, "#86c96d");
  body += `<path d='${HORSE}' fill='#6b3a1e' transform='translate(420 560) scale(1.1)'/><path d='${HORSE}' fill='#2a1a10' transform='translate(760 600) scale(-0.9 0.9) translate(-200 0)'/><path d='${HORSE}' fill='#e7d3b0' transform='translate(980 620) scale(0.75)'/>`;
  body += hills(r, 800, 20, 4, "#6fbf57");
  // Staket
  let fence = "";
  for (let x = 20; x < W + 40; x += 130) fence += `<rect x='${x}' y='790' width='18' height='180' rx='3' fill='#8b5a2b'/><rect x='${x + 2}' y='790' width='6' height='180' fill='#a86f3a'/>`;
  body += `<rect y='820' width='${W}' height='18' fill='#9a6532'/><rect y='880' width='${W}' height='18' fill='#9a6532'/>${fence}`;
  body += `<rect y='960' width='${W}' height='40' fill='#5daa45'/>`;
  // Höbalar
  body += `<g transform='translate(160 900)'><ellipse cx='0' cy='0' rx='70' ry='60' fill='#e9c46a'/><ellipse cx='-40' cy='0' rx='30' ry='60' fill='#f4d88c'/><path d='M-40 -40 Q-20 0 -40 40' stroke='#c9a24a' stroke-width='4' fill='none'/></g>`;
  for (let i = 0; i < 40; i++) body += `<circle cx='${n1(between(r, 0, W))}' cy='${n1(between(r, 700, 790))}' r='${n1(between(r, 3, 6))}' fill='${pick(r, ["#fef08a", "#fda4af", "#ffffff", "#c4b5fd"])}'/>`;
  return scene(body);
}

function pandaskog(): ThemeArt {
  const r = seeded(28);
  let body = `<defs>${linGrad("s", ["#e9f9e1", "#d3f2c8", "#bfe8b0"])}</defs>${sky("s")}`;
  const bamboo = (x: number, w: number, c: string, dark: string, op: number) => {
    let s = `<g opacity='${op}'><rect x='${x}' y='-20' width='${w}' height='1040' fill='${c}'/>`;
    for (let y = between(r, 20, 120); y < 1000; y += between(r, 110, 170)) {
      s += `<rect x='${x - 2}' y='${n1(y)}' width='${w + 4}' height='${n1(w * 0.28)}' rx='3' fill='${dark}'/>`;
      if (r() > 0.45) {
        const side = r() > 0.5 ? 1 : -1;
        const lx = side > 0 ? x + w : x;
        for (let k = 0; k < 3; k++) {
          const ang = side * (20 + k * 18);
          s += `<path d='M${lx} ${n1(y)} q${side * 40} -18 ${side * 90} -6 q${-side * 46} 18 ${-side * 90} 6Z' fill='${dark}' transform='rotate(${ang} ${lx} ${n1(y)})'/>`;
        }
      }
    }
    return s + `</g>`;
  };
  for (let i = 0; i < 14; i++) body += bamboo(between(r, 0, W), 16, "#a7d99a", "#8cc97e", 0.7);
  for (let i = 0; i < 9; i++) body += bamboo(between(r, 0, W), 26, "#6dbb58", "#4f9a3e", 0.95);
  for (const x of [40, 190, 1380, 1520]) body += bamboo(x, 40, "#4f9a3e", "#3a7a2d", 1);
  body += hills(r, 860, 25, 5, "#7cc46a");
  const panda = (x: number, y: number, s: number, tilt: number) =>
    `<g transform='translate(${x} ${y}) scale(${s}) rotate(${tilt})'><circle cx='-52' cy='-48' r='24' fill='#1f1f1f'/><circle cx='52' cy='-48' r='24' fill='#1f1f1f'/><ellipse cx='0' cy='0' rx='78' ry='68' fill='#ffffff' stroke='#e5e7eb' stroke-width='3'/><ellipse cx='-28' cy='-4' rx='18' ry='24' fill='#1f1f1f' transform='rotate(-25 -28 -4)'/><ellipse cx='28' cy='-4' rx='18' ry='24' fill='#1f1f1f' transform='rotate(25 28 -4)'/><circle cx='-26' cy='-8' r='6' fill='#fff'/><circle cx='26' cy='-8' r='6' fill='#fff'/><ellipse cx='0' cy='20' rx='11' ry='8' fill='#1f1f1f'/><path d='M-10 34 Q0 42 10 34' stroke='#1f1f1f' stroke-width='3' fill='none' stroke-linecap='round'/><ellipse cx='-50' cy='22' rx='11' ry='7' fill='#fbcfe8'/><ellipse cx='50' cy='22' rx='11' ry='7' fill='#fbcfe8'/></g>`;
  body += panda(330, 930, 1.3, -8) + panda(1230, 920, 1.5, 6) + panda(780, 960, 0.9, 0);
  body += hills(r, 960, 12, 5, "#5ea94c");
  return scene(body);
}

function pingviner(): ThemeArt {
  const r = seeded(29);
  let body = `<defs>${linGrad("s", ["#cfe6fb", "#e6f2fd", "#f7fbff"])}${linGrad("sea", ["#5fa8e8", "#3b82c4"])}</defs>${sky("s")}`;
  body += `<circle cx='1300' cy='180' r='70' fill='#fffbe6'/>`;
  body += cloud(420, 170, 1, "#ffffff", "#e5f0fb");
  const berg = (x: number, w: number, h: number) =>
    `<path d='M${x} 640 L${x + w * 0.2} ${640 - h * 0.7} L${x + w * 0.45} ${640 - h} L${x + w * 0.7} ${640 - h * 0.6} L${x + w} 640Z' fill='#ffffff'/><path d='M${x + w * 0.45} ${640 - h} L${x + w * 0.7} ${640 - h * 0.6} L${x + w} 640 L${x + w * 0.5} 640Z' fill='#cfe3f5'/>`;
  body += berg(80, 360, 220) + berg(560, 260, 140) + berg(1100, 420, 260);
  body += `<rect y='640' width='${W}' height='120' fill='url(#sea)'/>`;
  for (let i = 0; i < 18; i++) body += `<rect x='${n1(between(r, 0, W))}' y='${n1(between(r, 650, 750))}' width='${n1(between(r, 30, 90))}' height='3' rx='1.5' fill='#ffffff' opacity='0.5'/>`;
  body += `<path d='M-20 760 C300 730 600 750 900 740 C1200 730 1400 745 1620 735 L1620 1000 L-20 1000Z' fill='#f8fbff'/><path d='M-20 850 C400 820 800 860 1620 830 L1620 1000 L-20 1000Z' fill='#e9f3fc'/>`;
  const peng = (x: number, y: number, s: number, flip = 1) =>
    `<g transform='translate(${x} ${y}) scale(${s * flip} ${s})'><ellipse cx='-28' cy='80' rx='18' ry='9' fill='#f97316'/><ellipse cx='28' cy='80' rx='18' ry='9' fill='#f97316'/><ellipse cx='0' cy='0' rx='58' ry='84' fill='#1e293b'/><ellipse cx='0' cy='18' rx='42' ry='64' fill='#ffffff'/><ellipse cx='-54' cy='14' rx='14' ry='46' fill='#1e293b' transform='rotate(18 -54 14)'/><ellipse cx='54' cy='14' rx='14' ry='46' fill='#1e293b' transform='rotate(-18 54 14)'/><circle cx='-17' cy='-40' r='9' fill='#fff'/><circle cx='17' cy='-40' r='9' fill='#fff'/><circle cx='-15' cy='-39' r='5' fill='#0f172a'/><circle cx='19' cy='-39' r='5' fill='#0f172a'/><path d='M-12 -24 L12 -24 L0 -8Z' fill='#f59e0b'/><ellipse cx='-30' cy='-20' rx='8' ry='5' fill='#fda4af' opacity='0.8'/><ellipse cx='30' cy='-20' rx='8' ry='5' fill='#fda4af' opacity='0.8'/></g>`;
  body += peng(260, 830, 1.2) + peng(420, 880, 0.8, -1) + peng(1280, 840, 1.35, -1) + peng(1440, 900, 0.75) + peng(820, 900, 0.6);
  let flakes = "";
  const fr = seeded(129);
  for (let i = 0; i < 18; i++) {
    const x = between(fr, 0, 220), y = between(fr, 0, 220), rr = between(fr, 1.5, 4);
    flakes += wrap(x, y, rr, 220, 220, (a, b) => `<circle cx='${n1(a)}' cy='${n1(b)}' r='${n1(rr)}' fill='#ffffff' stroke='#bcd6ee' stroke-width='0.8'/>`);
  }
  return scene(body, { body: flakes, w: 220, h: 220 });
}

function tass(x: number, y: number, s: number, rot: number, c: string): string {
  return `<g transform='translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)}) scale(${s})' fill='${c}'><path d='M0 4 C-16 4 -24 18 -20 26 C-16 34 -6 30 0 30 C6 30 16 34 20 26 C24 18 16 4 0 4Z'/><ellipse cx='-19' cy='-8' rx='7' ry='9' transform='rotate(-20 -19 -8)'/><ellipse cx='-7' cy='-17' rx='7' ry='9.5'/><ellipse cx='7' cy='-17' rx='7' ry='9.5'/><ellipse cx='19' cy='-8' rx='7' ry='9' transform='rotate(20 19 -8)'/></g>`;
}

function tassar(): ThemeArt {
  const T = 320;
  let body = "";
  // Ett spår av tassar på diagonalen, vänster och höger om vartannat.
  const trail = (x0: number, y0: number, c: string) => {
    for (let i = 0; i < 4; i++) {
      const t = i * 80;
      const side = i % 2 ? 1 : -1;
      const x = x0 + t + side * 16, y = y0 + t - side * 16;
      body += wrap(x, y, 36, T, T, (a, b) => tass(a, b, 0.75, 135, c));
    }
  };
  trail(40, 40, "#d6a26f");
  trail(200, 40, "#c9a3e8");
  return pattern({ body, w: T, h: T }, "#fdf3e4");
}

function korallrev(): ThemeArt {
  const r = seeded(30);
  let body = `<defs>${linGrad("s", ["#5eead4", "#22b8cf", "#0e7490", "#155e75"])}${linGrad("ray", ["#ffffff", "#ffffff00"])}${linGrad("sand", ["#fde7b0", "#e9c98a"])}</defs>${sky("s")}`;
  for (let i = 0; i < 6; i++) {
    const x = 100 + i * 280 + between(r, -40, 40);
    body += `<path d='M${n1(x)} -10 L${n1(x + 100)} -10 L${n1(x + 300)} 1000 L${n1(x + 160)} 1000Z' fill='url(#ray)' opacity='${n1(between(r, 0.08, 0.16))}'/>`;
  }
  body += `<path d='M0 1000 L0 850 C200 820 400 860 700 850 C1000 840 1200 810 1600 850 L1600 1000Z' fill='url(#sand)'/>`;
  const branch = (x: number, y: number, len: number, ang: number, w: number, c: string, depth: number): string => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    let s = `<path d='M${n1(x)} ${n1(y)} L${n1(x2)} ${n1(y2)}' stroke='${c}' stroke-width='${n1(w)}' stroke-linecap='round'/>`;
    if (depth > 0) {
      s += branch(x2, y2, len * 0.75, ang - between(r, 0.3, 0.6), w * 0.75, c, depth - 1);
      s += branch(x2, y2, len * 0.75, ang + between(r, 0.3, 0.6), w * 0.75, c, depth - 1);
    } else s += `<circle cx='${n1(x2)}' cy='${n1(y2)}' r='${n1(w * 0.7)}' fill='${c}'/>`;
    return s;
  };
  body += branch(180, 900, 90, -Math.PI / 2, 22, "#fb7185", 4) + branch(1420, 890, 100, -Math.PI / 2, 24, "#c084fc", 4) + branch(650, 900, 60, -Math.PI / 2, 16, "#fb923c", 3) + branch(1050, 880, 70, -Math.PI / 2 - 0.2, 18, "#f472b6", 3);
  // Solfjäderkorall
  body += `<g transform='translate(420 900)'><path d='M0 0 L-120 -150 A190 190 0 0 1 120 -150Z' fill='#f59e0b' opacity='0.85'/>${Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 - 0.68 + i * 0.17; return `<path d='M0 0 L${n1(Math.cos(a) * 190)} ${n1(Math.sin(a) * 190)}' stroke='#b45309' stroke-width='3'/>`; }).join("")}</g>`;
  // Hjärnkorall
  body += `<g transform='translate(860 920)'><ellipse rx='110' ry='70' fill='#a3e635'/><path d='M-80 -20 q20 -30 40 0 t40 0 t40 0 M-90 10 q20 -30 40 0 t40 0 t40 0 t40 0 M-60 38 q20 -24 40 0 t40 0 t40 0' stroke='#65a30d' stroke-width='6' fill='none' stroke-linecap='round'/></g>`;
  const fish = (x: number, y: number, s: number, c: string, stripe: string, flip: number) =>
    `<g transform='translate(${x} ${y}) scale(${s * flip} ${s})'><path d='M-50 0 C-30 -32 30 -32 50 0 C30 32 -30 32 -50 0Z' fill='${c}'/><path d='M44 0 L80 -28 L72 0 L80 28Z' fill='${c}'/><path d='M-18 -26 Q-10 0 -18 26 M12 -28 Q20 0 12 28' stroke='${stripe}' stroke-width='9' fill='none'/><circle cx='-32' cy='-6' r='6' fill='#fff'/><circle cx='-33' cy='-6' r='3.2' fill='#111'/></g>`;
  body += fish(300, 380, 1, "#f97316", "#ffffff", 1) + fish(1250, 300, 1.2, "#facc15", "#1e3a8a", -1) + fish(780, 560, 0.8, "#3b82f6", "#fde047", 1) + fish(1450, 620, 0.7, "#f97316", "#ffffff", -1) + fish(520, 200, 0.6, "#ec4899", "#fce7f3", -1);
  for (let i = 0; i < 30; i++) {
    const x = between(r, 0, W), y = between(r, 0, 820), rr = between(r, 3, 10);
    body += `<circle cx='${n1(x)}' cy='${n1(y)}' r='${n1(rr)}' fill='none' stroke='#ffffff' stroke-width='1.6' opacity='0.6'/>`;
  }
  return scene(body);
}

const ACACIA = (x: number, y: number, s: number, c: string) =>
  `<g transform='translate(${x} ${y}) scale(${s})' fill='${c}'><path d='M-8 0 L-4 -120 L-60 -190 L-52 -196 L0 -140 L40 -200 L48 -194 L6 -120 L10 0Z'/><ellipse cx='-60' cy='-205' rx='110' ry='26'/><ellipse cx='50' cy='-212' rx='120' ry='28'/><ellipse cx='-5' cy='-226' rx='90' ry='24'/></g>`;
const GIRAFFE = "M26 14 L24 2 L28 2 L30 12 C34 14 36 20 34 26 C42 50 52 80 62 108 C80 110 100 114 112 124 C116 130 116 138 112 142 L112 236 L106 236 L102 152 L98 152 L98 236 L92 236 L88 150 C74 154 60 154 50 150 L50 236 L44 236 L42 152 L38 152 L36 236 L30 236 L30 140 C28 110 26 70 22 36 C16 38 6 36 2 32 C0 28 4 22 10 20 C16 18 22 16 26 14Z";

function savann(): ThemeArt {
  const r = seeded(31);
  let body = `<defs>${linGrad("s", ["#ffb36b", "#ffcf7a", "#ffe6a6"])}${glowGrad("g", "#fff4cf", 0.9)}</defs>${sky("s")}`;
  body += `<circle cx='1000' cy='620' r='420' fill='url(#g)'/><circle cx='1000' cy='620' r='180' fill='#fff1c1'/>`;
  body += hills(r, 700, 20, 6, "#d98b3a", "opacity='0.6'");
  body += `<path d='M-20 780 C300 750 600 770 900 760 C1200 750 1400 770 1620 755 L1620 1000 L-20 1000Z' fill='#6b3410'/>`;
  body += ACACIA(300, 790, 1.4, "#3a1c08") + ACACIA(1320, 770, 1.1, "#3a1c08") + ACACIA(820, 760, 0.6, "#4a2610");
  body += `<path d='${GIRAFFE}' fill='#3a1c08' transform='translate(1010 520) scale(1.1)'/><path d='${GIRAFFE}' fill='#3a1c08' transform='translate(1180 610) scale(-0.7 0.7) translate(-120 0)'/>`;
  // Elefant
  body += `<g transform='translate(520 700)' fill='#3a1c08'><ellipse cx='0' cy='0' rx='90' ry='60'/><rect x='-70' y='20' width='26' height='80'/><rect x='-30' y='30' width='26' height='70'/><rect x='30' y='30' width='26' height='70'/><rect x='56' y='20' width='24' height='80'/><circle cx='-100' cy='-20' r='45'/><path d='M-130 0 C-150 40 -150 80 -130 100 L-118 96 C-130 70 -128 40 -112 16Z'/><ellipse cx='-80' cy='-30' rx='30' ry='40'/></g>`;
  body += `<path d='M-20 900 C400 870 800 910 1620 880 L1620 1000 L-20 1000Z' fill='#4a2208'/>`;
  let grass = "";
  for (let x = 0; x < W; x += 9) grass += `M${x} ${n1(905 + between(r, -8, 8))} l${n1(between(r, -6, 6))} ${n1(-between(r, 14, 40))}`;
  body += `<path d='${grass}' stroke='#4a2208' stroke-width='3' stroke-linecap='round'/>`;
  for (let i = 0; i < 5; i++) {
    const x = between(r, 400, 1400), y = between(r, 150, 380);
    body += `<path d='M${n1(x - 14)} ${n1(y)} q7 -8 14 0 q7 -8 14 0' fill='none' stroke='#6b3410' stroke-width='3' stroke-linecap='round'/>`;
  }
  return scene(body);
}

function fjarilar(): ThemeArt {
  const r = seeded(32);
  const T = 300;
  let body = "";
  const bfly = (x: number, y: number, s: number, rot: number, c1: string, c2: string) =>
    `<g transform='translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)}) scale(${s})'><ellipse cx='-16' cy='-12' rx='18' ry='14' fill='${c1}' transform='rotate(-30 -16 -12)'/><ellipse cx='16' cy='-12' rx='18' ry='14' fill='${c1}' transform='rotate(30 16 -12)'/><ellipse cx='-12' cy='12' rx='11' ry='9' fill='${c2}' transform='rotate(30 -12 12)'/><ellipse cx='12' cy='12' rx='11' ry='9' fill='${c2}' transform='rotate(-30 12 12)'/><circle cx='-18' cy='-14' r='5' fill='#ffffff' opacity='0.7'/><circle cx='18' cy='-14' r='5' fill='#ffffff' opacity='0.7'/><rect x='-2.5' y='-18' width='5' height='36' rx='2.5' fill='#3f3f46'/><path d='M-1 -18 Q-6 -30 -12 -32 M1 -18 Q6 -30 12 -32' stroke='#3f3f46' stroke-width='1.6' fill='none'/></g>`;
  const flower = (x: number, y: number, s: number, c: string) => {
    let f = `<g transform='translate(${n1(x)} ${n1(y)}) scale(${s})'>`;
    for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; f += `<circle cx='${n1(Math.cos(a) * 9)}' cy='${n1(Math.sin(a) * 9)}' r='7' fill='${c}'/>`; }
    return f + `<circle r='5.5' fill='#fbbf24'/></g>`;
  };
  const colors: [string, string][] = [["#f472b6", "#fb923c"], ["#60a5fa", "#a78bfa"], ["#facc15", "#f97316"], ["#34d399", "#22d3ee"]];
  for (let i = 0; i < 4; i++) {
    const x = (i % 2) * 150 + 75 + between(r, -20, 20), y = Math.floor(i / 2) * 150 + 75 + between(r, -20, 20);
    const [c1, c2] = colors[i];
    const s = between(r, 0.9, 1.3), rot = between(r, -30, 30);
    body += wrap(x, y, 45, T, T, (a, b) => bfly(a, b, s, rot, c1, c2));
  }
  for (let i = 0; i < 8; i++) {
    const x = between(r, 0, T), y = between(r, 0, T), c = pick(r, ["#fda4af", "#ffffff", "#c4b5fd", "#fde68a"]), s = between(r, 0.6, 1);
    body += wrap(x, y, 20, T, T, (a, b) => flower(a, b, s, c));
  }
  return pattern({ body, w: T, h: T }, "linear-gradient(180deg, #e0f2fe, #ecfccb)");
}

// ─── Spel ─────────────────────────────────────────────────────────────────────

function tvspel(): ThemeArt {
  const T = 280;
  const pad = (x: number, y: number, c: string, rot: number) =>
    `<g transform='translate(${x} ${y}) rotate(${rot})'><path d='M-52 -22 H52 C74 -22 82 -2 80 18 C78 40 62 48 50 36 L34 20 H-34 L-50 36 C-62 48 -78 40 -80 18 C-82 -2 -74 -22 -52 -22Z' fill='${c}'/><path d='M-50 -6 h8 v-8 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8z' fill='#1e1b4b'/><circle cx='40' cy='-8' r='6' fill='#f43f5e'/><circle cx='54' cy='4' r='6' fill='#22c55e'/><circle cx='26' cy='4' r='6' fill='#3b82f6'/><circle cx='40' cy='16' r='6' fill='#facc15'/><rect x='-12' y='-4' width='10' height='5' rx='2.5' fill='#1e1b4b'/><rect x='4' y='-4' width='10' height='5' rx='2.5' fill='#1e1b4b'/></g>`;
  const heartPx = [".##.##.", "#######", "#######", ".#####.", "..###..", "...#..."];
  let body = pad(80, 80, "#f0abfc", -12) + pad(210, 210, "#67e8f9", 14);
  body += pixels(heartPx, 196, 44, 5, "#fb7185") + pixels(heartPx, 36, 190, 5, "#fb7185");
  body += star5(150, 150, 12, "#fde047") + star5(250, 110, 8, "#fde047") + star5(30, 260, 8, "#fde047");
  body += `<path d='M0 0 H${T}' stroke='#000' stroke-opacity='0'/>`;
  const scan = `repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0 2px, transparent 2px 6px)`;
  return pattern({ body, w: T, h: T }, `${scan}, linear-gradient(135deg, #3b1c8c, #6d28d9 55%, #2e1065)`);
}

function dataspel(): ThemeArt {
  const r = seeded(33);
  let stripes = "";
  for (let i = 0; i < 7; i++) stripes += `<rect x='500' y='${n1(380 + i * 26 + i * i * 2)}' width='600' height='${n1(4 + i * 2.2)}' fill='black'/>`;
  let body = `<defs>${linGrad("s", ["#0a0a2a", "#2a0b52", "#7a1a7a", "#ff3d8b"])}${linGrad("sun", ["#fff27a", "#ffae3d", "#ff3d8b"])}${linGrad("fl", ["#1b0634", "#0a0220"])}<mask id='m'><rect width='${W}' height='${H}' fill='white'/>${stripes}</mask></defs>`;
  body += `<rect width='${W}' height='600' fill='url(#s)'/>` + starField(r, 120, 0, 0, W, 380, ["#ffffff", "#f9a8d4"], 0.6, 1.8);
  body += `<circle cx='800' cy='430' r='230' fill='url(#sun)' mask='url(#m)'/>`;
  body += `<path d='M-20 600 L120 470 L220 540 L380 400 L520 600Z' fill='#2b0a4a' stroke='#22d3ee' stroke-width='3'/><path d='M1080 600 L1220 440 L1330 520 L1470 420 L1620 560 L1620 600Z' fill='#2b0a4a' stroke='#22d3ee' stroke-width='3'/>`;
  body += `<rect y='600' width='${W}' height='400' fill='url(#fl)'/>`;
  let grid = "";
  for (let i = 1; i < 16; i++) {
    const y = 600 + Math.pow(i / 15, 2) * 400;
    grid += `M0 ${n1(y)} H${W} `;
  }
  for (let i = -24; i <= 24; i++) grid += `M800 600 L${800 + i * 110} 1000 `;
  body += `<path d='${grid}' stroke='#ff3dd6' stroke-width='2.5' opacity='0.85'/>`;
  body += `<rect y='596' width='${W}' height='6' fill='#22d3ee'/>`;
  return scene(body);
}

function blockvarld(): ThemeArt {
  const r = seeded(34);
  const B = 50;
  const defs = `<defs>
    <pattern id='dirt' width='50' height='50' patternUnits='userSpaceOnUse'><rect width='50' height='50' fill='#8b5a2b'/><rect x='6' y='8' width='8' height='8' fill='#6f4521'/><rect x='30' y='4' width='8' height='8' fill='#a0703d'/><rect x='20' y='28' width='8' height='8' fill='#6f4521'/><rect x='38' y='34' width='8' height='8' fill='#6f4521'/><rect x='4' y='38' width='8' height='8' fill='#a0703d'/></pattern>
    <pattern id='stone' width='50' height='50' patternUnits='userSpaceOnUse'><rect width='50' height='50' fill='#8a8f98'/><rect x='4' y='6' width='14' height='8' fill='#737882'/><rect x='28' y='20' width='16' height='8' fill='#a2a7b0'/><rect x='10' y='34' width='12' height='8' fill='#737882'/><rect x='34' y='40' width='8' height='6' fill='#737882'/></pattern>
    <pattern id='leaf' width='50' height='50' patternUnits='userSpaceOnUse'><rect width='50' height='50' fill='#3f9b3a'/><rect x='8' y='6' width='8' height='8' fill='#2f7d2b'/><rect x='30' y='14' width='8' height='8' fill='#5bb850'/><rect x='14' y='32' width='8' height='8' fill='#5bb850'/><rect x='36' y='36' width='8' height='8' fill='#2f7d2b'/></pattern>
    <pattern id='wood' width='50' height='50' patternUnits='userSpaceOnUse'><rect width='50' height='50' fill='#7a5230'/><rect x='10' width='6' height='50' fill='#664225'/><rect x='30' width='6' height='50' fill='#8e6440'/></pattern>
    ${linGrad("s", ["#6fb8ff", "#9fd2ff", "#cdeaff"])}</defs>`;
  let body = defs + sky("s");
  body += `<rect x='1260' y='90' width='120' height='120' fill='#fff27a'/><rect x='1275' y='105' width='90' height='90' fill='#ffe14d'/>`;
  const pcloud = (x: number, y: number) => `<g fill='#ffffff'><rect x='${x}' y='${y}' width='200' height='40'/><rect x='${x + 40}' y='${y - 30}' width='100' height='30'/><rect x='${x - 30}' y='${y + 10}' width='40' height='30'/></g>`;
  body += pcloud(160, 140) + pcloud(700, 90) + pcloud(1050, 240);
  const cols = Math.ceil(W / B);
  let heights: number[] = [];
  let h = 7;
  for (let i = 0; i < cols; i++) {
    if (r() < 0.35) h += r() < 0.5 ? -1 : 1;
    h = Math.max(4, Math.min(10, h));
    heights.push(h);
  }
  for (let i = 0; i < cols; i++) {
    const top = H - heights[i] * B;
    body += `<rect x='${i * B}' y='${top}' width='${B}' height='${B}' fill='url(#dirt)'/><rect x='${i * B}' y='${top}' width='${B}' height='14' fill='#5cbf3f'/><rect x='${i * B + 6}' y='${top + 14}' width='8' height='8' fill='#5cbf3f'/><rect x='${i * B + 30}' y='${top + 14}' width='8' height='6' fill='#5cbf3f'/>`;
    body += `<rect x='${i * B}' y='${top + B}' width='${B}' height='${2 * B}' fill='url(#dirt)'/>`;
    body += `<rect x='${i * B}' y='${top + 3 * B}' width='${B}' height='${H - top}' fill='url(#stone)'/>`;
    if (r() < 0.12) body += `<rect x='${i * B + 14}' y='${top + 4 * B + 12}' width='10' height='10' fill='#38bdf8'/><rect x='${i * B + 28}' y='${top + 4 * B + 26}' width='8' height='8' fill='#38bdf8'/>`;
    if (r() < 0.1) body += `<rect x='${i * B + 12}' y='${top + 3 * B + 20}' width='10' height='10' fill='#f59e0b'/><rect x='${i * B + 30}' y='${top + 3 * B + 10}' width='8' height='8' fill='#f59e0b'/>`;
  }
  const tree = (i: number) => {
    const top = H - heights[i] * B;
    let t = `<rect x='${i * B}' y='${top - 3 * B}' width='${B}' height='${3 * B}' fill='url(#wood)'/>`;
    t += `<rect x='${(i - 2) * B}' y='${top - 5 * B}' width='${5 * B}' height='${2 * B}' fill='url(#leaf)'/><rect x='${(i - 1) * B}' y='${top - 6 * B}' width='${3 * B}' height='${B}' fill='url(#leaf)'/>`;
    return t;
  };
  for (const i of [3, 11, 24, 30]) if (i < cols) body += tree(i);
  // Blomma och gräs
  for (let i = 0; i < cols; i++) if (r() < 0.25) {
    const top = H - heights[i] * B;
    body += `<rect x='${i * B + 22}' y='${top - 18}' width='6' height='18' fill='#2f7d2b'/><rect x='${i * B + 16}' y='${top - 30}' width='18' height='14' fill='${pick(r, ["#ef4444", "#facc15", "#f472b6"])}'/>`;
  }
  return scene(body);
}

function arkad(): ThemeArt {
  const T = 300;
  const inv1 = ["..#.....#..", "...#...#...", "..#######..", ".##.###.##.", "###########", "#.#######.#", "#.#.....#.#", "...##.##..."];
  const inv2 = ["....####....", ".##########.", "############", "###..##..###", "############", "...##..##...", "..##.##.##..", "##........##"];
  const ghost = [".####.", "######", "#.##.#", "######", "######", "#.##.#"];
  const coin = [".###.", "#####", "##.##", "#####", ".###."];
  let body = pixels(inv1, 30, 30, 6, "#4ade80") + pixels(inv2, 170, 150, 6, "#f472b6") + pixels(ghost, 190, 30, 7, "#38bdf8") + pixels(coin, 60, 200, 6, "#facc15") + pixels(inv1, 230, 240, 4, "#fb923c");
  body += `<circle cx='140' cy='110' r='2' fill='#fff'/><circle cx='20' cy='150' r='1.5' fill='#fff'/><circle cx='280' cy='130' r='2' fill='#fff'/><circle cx='120' cy='280' r='1.5' fill='#fff'/>`;
  return pattern({ body, w: T, h: T }, "radial-gradient(circle at 50% 30%, #2a1a5e, #110a2e 70%)");
}

function plattform(): ThemeArt {
  const r = seeded(35);
  let body = `<defs>${linGrad("s", ["#5cb8ff", "#8ed0ff", "#bfe6ff"])}<pattern id='brick' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='#c2622d'/><path d='M0 0.5 H40 M0 20.5 H40 M20 0 V20 M0 20 V40 M40 20 V40' stroke='#7c3514' stroke-width='3'/></pattern><pattern id='gr' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='#d9893f'/><path d='M0 0 H40 V40 H0Z' fill='none' stroke='#8a4a17' stroke-width='3'/></pattern></defs>${sky("s")}`;
  const bgHill = (x: number, w: number, h: number, c: string) => `<path d='M${x} 900 L${x} ${900 - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${900 - h + w / 2} L${x + w} 900Z' fill='${c}' stroke='#1f5c1f' stroke-width='4'/><circle cx='${x + w * 0.35}' cy='${900 - h + w * 0.45}' r='6' fill='#1f5c1f'/><circle cx='${x + w * 0.62}' cy='${900 - h + w * 0.45}' r='6' fill='#1f5c1f'/>`;
  body += bgHill(80, 260, 300, "#7bd06a") + bgHill(1180, 320, 260, "#7bd06a") + bgHill(620, 200, 180, "#95dc80");
  body += cloud(300, 180, 1, "#ffffff") + cloud(900, 130, 1.2, "#ffffff") + cloud(1400, 220, 0.8, "#ffffff");
  const plat = (x: number, y: number, n: number, star: number[]) => {
    let s = `<rect x='${x}' y='${y}' width='${n * 40}' height='40' fill='url(#brick)' stroke='#7c3514' stroke-width='3'/>`;
    for (const k of star) s += `<rect x='${x + k * 40}' y='${y}' width='40' height='40' rx='4' fill='#fbbf24' stroke='#92400e' stroke-width='3'/>` + star5(x + k * 40 + 20, y + 21, 12, "#fff7cc");
    return s;
  };
  body += plat(240, 520, 5, [2]) + plat(900, 420, 4, [0, 3]) + plat(1250, 600, 3, []) + plat(560, 660, 3, [1]);
  const coin = (x: number, y: number) => `<ellipse cx='${x}' cy='${y}' rx='14' ry='20' fill='#facc15' stroke='#a16207' stroke-width='3'/><rect x='${x - 2.5}' y='${y - 10}' width='5' height='20' rx='2' fill='#fef08a'/>`;
  for (const [x, y] of [[300, 470], [340, 470], [380, 470], [940, 370], [980, 370], [1290, 550], [1330, 550], [600, 610]]) body += coin(x, y);
  const pipe = (x: number, h: number) => `<rect x='${x}' y='${900 - h}' width='90' height='${h}' fill='#22c55e' stroke='#14532d' stroke-width='4'/><rect x='${x - 10}' y='${900 - h - 40}' width='110' height='44' rx='4' fill='#22c55e' stroke='#14532d' stroke-width='4'/><rect x='${x + 12}' y='${900 - h}' width='12' height='${h}' fill='#86efac'/><rect x='${x + 2}' y='${900 - h - 34}' width='12' height='32' fill='#86efac'/>`;
  body += pipe(1060, 120) + pipe(160, 80);
  body += `<rect y='900' width='${W}' height='100' fill='url(#gr)'/>`;
  const bush = (x: number) => `<g fill='#4ade80' stroke='#166534' stroke-width='4'><circle cx='${x}' cy='900' r='40'/><circle cx='${x + 50}' cy='890' r='50'/><circle cx='${x + 100}' cy='900' r='40'/></g><rect x='${x - 44}' y='900' width='190' height='10' fill='#4ade80'/>`;
  body += bush(420) + bush(1400);
  body += `<rect y='898' width='${W}' height='4' fill='#8a4a17'/>`;
  void r;
  return scene(body);
}

// ─── Fantasy ──────────────────────────────────────────────────────────────────

const DRAGON = "M20 110 C60 100 90 120 120 110 C150 100 170 95 190 90 C210 84 225 70 240 62 L246 50 L252 58 L262 50 L262 58 L284 60 L268 66 L278 74 L256 72 C244 80 232 92 214 102 C200 110 184 116 164 118 L156 136 L146 134 L150 120 C136 124 120 124 104 124 L96 140 L86 138 L90 122 C66 120 42 116 20 110Z M168 94 L150 16 C160 36 168 44 176 54 L190 4 C194 30 196 44 200 58 L232 26 C224 56 214 74 204 88Z";

function enhorning(): ThemeArt {
  const r = seeded(36);
  let body = `<defs>${linGrad("s", ["#f9c8e4", "#e2d4fb", "#c9e2fd", "#e8f7ff"])}${linGrad("c", ["#f5e9ff", "#e3d0ff"])}</defs>${sky("s")}`;
  const cols = ["#ffb3c7", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#bdb2ff"];
  cols.forEach((c, i) => {
    const rr = 620 - i * 34;
    body += `<path d='M${800 - rr} 820 A${rr} ${rr} 0 0 1 ${800 + rr} 820' fill='none' stroke='${c}' stroke-width='36' opacity='0.9'/>`;
  });
  // Sagoslott
  const tower = (x: number, w: number, h: number, roof: string) =>
    `<rect x='${x - w / 2}' y='${820 - h}' width='${w}' height='${h}' fill='url(#c)'/><path d='M${x - w / 2 - 8} ${820 - h} L${x} ${820 - h - w * 1.6} L${x + w / 2 + 8} ${820 - h}Z' fill='${roof}'/><path d='M${x} ${820 - h - w * 1.6} v-30' stroke='#a78bfa' stroke-width='3'/><path d='M${x} ${820 - h - w * 1.6 - 30} l24 8 l-24 8Z' fill='#f472b6'/><path d='M${x - 7} ${820 - h + 30} a7 7 0 0 1 14 0 v18 h-14z' fill='#fbcfe8'/>`;
  body += tower(640, 60, 260, "#f9a8d4") + tower(960, 60, 260, "#f9a8d4") + tower(720, 70, 340, "#c4b5fd") + tower(880, 70, 340, "#c4b5fd") + tower(800, 90, 420, "#f0abfc");
  body += `<rect x='640' y='640' width='320' height='180' fill='url(#c)'/><path d='M770 820 v-70 a30 30 0 0 1 60 0 v70z' fill='#d8b4fe'/>`;
  body += cloud(160, 860, 2.4, "#ffffff", "#f5d0fe") + cloud(1440, 860, 2.4, "#ffffff", "#f5d0fe") + cloud(800, 900, 2.8, "#ffffff", "#f5d0fe");
  body += cloud(300, 250, 1, "#ffffff", "#fbe4ff") + cloud(1300, 180, 1.2, "#ffffff", "#fbe4ff");
  for (let i = 0; i < 20; i++) body += sparkle(between(r, 0, W), between(r, 0, 700), between(r, 6, 14), pick(r, ["#ffffff", "#fde68a", "#f9a8d4"]));
  for (let i = 0; i < 8; i++) body += heart(between(r, 100, 1500), between(r, 80, 600), between(r, 8, 14), "#f9a8d4", "opacity='0.8'");
  let glitter = "";
  const hr = seeded(136);
  for (let i = 0; i < 7; i++) {
    const x = between(hr, 0, 280), y = between(hr, 0, 280), sz = between(hr, 3, 7), c = pick(hr, ["#ffffff", "#fde68a", "#f9a8d4"]);
    glitter += wrap(x, y, sz, 280, 280, (a2, b2) => sparkle(a2, b2, sz, c, "opacity='0.85'"));
  }
  for (let i = 0; i < 2; i++) {
    const x = between(hr, 0, 280), y = between(hr, 0, 280);
    glitter += wrap(x, y, 8, 280, 280, (a2, b2) => heart(a2, b2, 6, "#f9a8d4", "opacity='0.7'"));
  }
  return scene(body, { body: glitter, w: 280, h: 280 });
}

function drakberget(): ThemeArt {
  const r = seeded(37);
  let body = `<defs>${linGrad("s", ["#150f3a", "#43206a", "#a2345a", "#f0703a"])}${glowGrad("m", "#ffe7a8", 0.7)}</defs>${sky("s")}`;
  body += starField(r, 90, 0, 0, W, 350, ["#ffffff", "#fde68a"], 0.6, 1.8);
  body += `<circle cx='1080' cy='330' r='330' fill='url(#m)'/><circle cx='1080' cy='330' r='160' fill='#ffe9b0'/><circle cx='1040' cy='300' r='26' fill='#f5d68a' opacity='0.6'/><circle cx='1120' cy='370' r='18' fill='#f5d68a' opacity='0.6'/>`;
  body += `<path d='${DRAGON}' fill='#1a0b24' transform='translate(900 200) scale(1.3)'/><path d='${DRAGON}' fill='#2a1538' transform='translate(360 180) scale(-0.55 0.55) translate(-300 0)'/><path d='${DRAGON}' fill='#2a1538' transform='translate(520 330) scale(0.35)'/>`;
  body += mountains(r, 720, 160, 340, 5, "#5a2448");
  // Borg på toppen
  body += `<g fill='#2a0f2e'><rect x='250' y='330' width='60' height='130'/><rect x='320' y='300' width='50' height='160'/><rect x='240' y='320' width='14' height='14'/><rect x='270' y='320' width='14' height='14'/><rect x='296' y='320' width='14' height='14'/><path d='M320 300 L345 250 L370 300Z'/></g><rect x='338' y='330' width='12' height='16' fill='#ffb454'/>`;
  body += mountains(r, 850, 120, 280, 6, "#3a1433");
  body += mountains(r, 1000, 80, 220, 7, "#1f0a1e");
  for (let i = 0; i < 40; i++) body += `<circle cx='${n1(between(r, 0, W))}' cy='${n1(between(r, 500, 1000))}' r='${n1(between(r, 1.5, 3.5))}' fill='#ffb454' opacity='${n1(between(r, 0.4, 0.9))}'/>`;
  return scene(body);
}

function trollskog(): ThemeArt {
  const r = seeded(38);
  let body = `<defs>${linGrad("s", ["#07201f", "#0e3a38", "#155a52"])}${glowGrad("fly", "#fff27a", 0.9)}${glowGrad("cy", "#5eead4", 0.7)}${glowGrad("mist", "#99f6e4", 0.25)}</defs>${sky("s")}`;
  body += `<circle cx='1200' cy='160' r='70' fill='#e6fffb' opacity='0.8'/>`;
  const trunk = (x: number, w: number, c: string) => {
    let s = `<path d='M${x - w / 2} -20 C${x - w / 2 + 10} 400 ${x - w / 2 - 10} 700 ${x - w} 1000 L${x + w} 1000 C${x + w / 2 + 10} 700 ${x + w / 2 - 10} 400 ${x + w / 2} -20Z' fill='${c}'/>`;
    s += `<path d='M${x - w} 1000 Q${x - w * 1.8} 960 ${x - w * 2.4} 1000Z M${x + w} 1000 Q${x + w * 1.8} 960 ${x + w * 2.4} 1000Z' fill='${c}'/>`;
    return s;
  };
  for (let i = 0; i < 9; i++) body += trunk(between(r, 0, W), between(r, 20, 40), "#0c2e2c");
  body += `<ellipse cx='800' cy='760' rx='900' ry='90' fill='url(#mist)'/>`;
  for (let i = 0; i < 6; i++) body += trunk(between(r, 0, W), between(r, 40, 70), "#061a19");
  body += hills(r, 880, 25, 6, "#0a2a26");
  const shroom = (x: number, y: number, s: number, cap: string, dots: boolean) =>
    `<g transform='translate(${x} ${y}) scale(${s})'><circle cy='-40' r='70' fill='url(#cy)'/><path d='M-10 0 C-12 -30 -8 -40 -6 -44 L6 -44 C8 -40 12 -30 10 0Z' fill='#f5f0e1'/><path d='M-40 -40 C-40 -80 40 -80 40 -40Z' fill='${cap}'/>${dots ? "<circle cx='-18' cy='-56' r='5' fill='#fff'/><circle cx='8' cy='-64' r='6' fill='#fff'/><circle cx='22' cy='-50' r='4' fill='#fff'/>" : ""}</g>`;
  body += shroom(260, 920, 1.5, "#ef4444", true) + shroom(330, 930, 0.9, "#f97316", true) + shroom(1300, 910, 1.7, "#ef4444", true) + shroom(1210, 930, 1, "#2dd4bf", false) + shroom(1380, 935, 0.8, "#2dd4bf", false) + shroom(760, 930, 1.1, "#a78bfa", false);
  for (let i = 0; i < 34; i++) {
    const x = between(r, 0, W), y = between(r, 150, 900), s = between(r, 10, 22);
    body += `<circle cx='${n1(x)}' cy='${n1(y)}' r='${n1(s)}' fill='url(#fly)'/><circle cx='${n1(x)}' cy='${n1(y)}' r='2.4' fill='#fffbe0'/>`;
  }
  body += hills(r, 960, 12, 6, "#06201d");
  return scene(body);
}

function trollkarl(): ThemeArt {
  const r = seeded(39);
  let body = `<defs>${linGrad("s", ["#120b3a", "#2e1766", "#5b2aa0", "#7c3aed"])}${glowGrad("w", "#fde68a", 0.9)}<pattern id='st' width='40' height='30' patternUnits='userSpaceOnUse'><rect width='40' height='30' fill='#4b4a6b'/><path d='M0 0.5 H40 M0 15.5 H40 M20 0 V15 M0 15 V30' stroke='#35344f' stroke-width='2'/></pattern>${glowGrad("mg", "#67e8f9", 0.5)}</defs>${sky("s")}`;
  body += starField(r, 160, 0, 0, W, 700, ["#ffffff", "#fde68a", "#c4b5fd"], 0.6, 2);
  for (let i = 0; i < 12; i++) body += sparkle(between(r, 0, W), between(r, 0, 600), between(r, 6, 14), "#ffffff");
  body += `<circle cx='320' cy='210' r='90' fill='#fff4c7'/><circle cx='360' cy='185' r='84' fill='#2e1766'/>`;
  body += hills(r, 800, 40, 4, "#1d1142");
  body += `<path d='M1060 820 C1060 700 1080 600 1180 560 C1280 600 1300 700 1300 820Z' fill='#140c32'/>`;
  // Tornet
  body += `<path d='M1110 820 L1130 360 L1230 360 L1250 820Z' fill='url(#st)'/><path d='M1100 370 L1180 120 L1260 370Z' fill='#4c1d95'/><path d='M1180 120 L1260 370 L1220 370Z' fill='#3b0f80'/>` + star5(1160, 280, 10, "#fde68a") + star5(1200, 220, 7, "#fde68a") + star5(1215, 320, 8, "#fde68a");
  body += `<path d='M1180 120 v-40' stroke='#a78bfa' stroke-width='4'/><path d='M1180 80 l40 12 l-40 12Z' fill='#f0abfc'/>`;
  for (const [x, y] of [[1165, 440], [1195, 560], [1170, 680]]) body += `<circle cx='${x + 8}' cy='${y + 14}' r='50' fill='url(#w)'/><path d='M${x} ${y + 30} v-20 a8 8 0 0 1 16 0 v20z' fill='#fde68a'/>`;
  body += `<path d='M1170 820 v-50 a14 14 0 0 1 28 0 v50z' fill='#2a1a10'/>`;
  // Magisk virvel
  let spiral = "";
  for (let a = 0; a < Math.PI * 4; a += 0.12) spiral += `${a === 0 ? "M" : "L"}${n1(1180 + Math.cos(a) * (110 + a * 8))} ${n1(640 + Math.sin(a) * (26 + a * 2) - a * 26)} `;
  body += `<circle cx='1180' cy='420' r='260' fill='url(#mg)'/><path d='${spiral}' stroke='#67e8f9' stroke-width='3' fill='none' opacity='0.55' stroke-linecap='round'/>`;
  body += hills(r, 900, 25, 4, "#120a2e");
  return scene(body);
}

function kristallgrotta(): ThemeArt {
  const r = seeded(40);
  let body = `<defs>${linGrad("s", ["#0d0820", "#1d1045", "#2c1760"])}${glowGrad("gp", "#c084fc", 0.55)}${glowGrad("gc", "#22d3ee", 0.5)}${glowGrad("gk", "#f472b6", 0.5)}</defs>${sky("s")}`;
  let top = `M-20 -20 L-20 120`;
  for (let x = 0; x <= W + 20; x += 40) top += ` L${x} ${n1(r() < 0.3 ? between(r, 180, 330) : between(r, 60, 140))}`;
  body += `<path d='${top} L${W + 20} -20Z' fill='#080514'/>`;
  const crystal = (x: number, y: number, h: number, w: number, rot: number, light: string, dark: string) =>
    `<g transform='translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})'><path d='M${-w / 2} 0 L${-w / 2} ${-h} L0 ${-h - w * 0.8} L0 0Z' fill='${light}'/><path d='M${w / 2} 0 L${w / 2} ${-h} L0 ${-h - w * 0.8} L0 0Z' fill='${dark}'/><path d='M${-w / 4} ${-h * 0.2} L${-w / 4} ${-h * 0.8}' stroke='#ffffff' stroke-width='3' opacity='0.5' stroke-linecap='round'/></g>`;
  const cluster = (x: number, y: number, s: number, light: string, dark: string, g: string) => {
    let c = `<circle cx='${x}' cy='${y - 120 * s}' r='${260 * s}' fill='url(#${g})'/>`;
    const parts = [[-70, 140, 40, -28], [-35, 220, 52, -12], [0, 300, 64, 0], [40, 200, 50, 14], [80, 130, 38, 30], [110, 80, 30, 44]];
    for (const [dx, h, w, rot] of parts) c += crystal(x + dx * s, y, h * s, w * s, rot, light, dark);
    return c;
  };
  body += `<path d='M-20 1000 L-20 840 C200 800 400 860 700 830 C1000 800 1200 850 1620 820 L1620 1000Z' fill='#0a0618'/>`;
  body += cluster(260, 900, 1.3, "#e9d5ff", "#a855f7", "gp") + cluster(1340, 890, 1.4, "#a5f3fc", "#0891b2", "gc") + cluster(800, 940, 0.9, "#fbcfe8", "#db2777", "gk") + cluster(1050, 960, 0.6, "#e9d5ff", "#9333ea", "gp") + cluster(540, 950, 0.55, "#a5f3fc", "#0e7490", "gc");
  for (let i = 0; i < 25; i++) body += sparkle(between(r, 0, W), between(r, 200, 950), between(r, 4, 10), pick(r, ["#ffffff", "#a5f3fc", "#f5d0fe"]));
  return scene(body);
}

// ─── Riddare ──────────────────────────────────────────────────────────────────

function crenel(x: number, y: number, w: number, m: number, fill: string): string {
  let d = "";
  for (let i = 0; i * m * 2 < w; i++) d += `<rect x='${x + i * m * 2}' y='${y - m}' width='${Math.min(m, w - i * m * 2)}' height='${m}' fill='${fill}'/>`;
  return d;
}

function riddarborg(): ThemeArt {
  const r = seeded(41);
  let body = `<defs>${linGrad("s", ["#7ec4f7", "#b7defb", "#e8f5ff"])}<pattern id='sten' width='36' height='24' patternUnits='userSpaceOnUse'><rect width='36' height='24' fill='#b8bcc6'/><path d='M0 0.5 H36 M0 12.5 H36 M18 0 V12 M0 12 V24' stroke='#9097a3' stroke-width='2'/></pattern></defs>${sky("s")}`;
  body += cloud(250, 170, 1.2, "#ffffff", "#e0effb") + cloud(1300, 130, 1, "#ffffff", "#e0effb") + cloud(820, 90, 0.7, "#ffffff", "#e0effb");
  body += hills(r, 700, 40, 4, "#a6d98c");
  body += `<path d='M300 1000 C400 740 560 700 800 700 C1040 700 1200 740 1300 1000Z' fill='#7cc26a'/>`;
  const tower = (x: number, w: number, h: number, roof: string, flag: string) =>
    `<rect x='${x - w / 2}' y='${720 - h}' width='${w}' height='${h}' fill='url(#sten)'/>` + crenel(x - w / 2, 720 - h, w, w / 7, "#b8bcc6") +
    `<path d='M${x - w / 2 - 6} ${720 - h - w / 7} L${x} ${720 - h - w / 7 - w * 1.1} L${x + w / 2 + 6} ${720 - h - w / 7}Z' fill='${roof}'/><path d='M${x} ${720 - h - w / 7 - w * 1.1} v-40' stroke='#475569' stroke-width='4'/><path d='M${x} ${720 - h - w / 7 - w * 1.1 - 40} q20 -10 40 0 t40 0 l0 22 q-20 -10 -40 0 t-40 0Z' fill='${flag}'/><path d='M${x - 8} ${720 - h + 40} a8 8 0 0 1 16 0 v26 h-16z' fill='#1e293b'/>`;
  body += `<rect x='560' y='520' width='480' height='200' fill='url(#sten)'/>` + crenel(560, 520, 480, 24, "#b8bcc6");
  body += tower(560, 110, 330, "#dc2626", "#fbbf24") + tower(1040, 110, 330, "#dc2626", "#fbbf24") + tower(800, 150, 440, "#2563eb", "#ef4444");
  body += `<path d='M740 720 v-110 a60 60 0 0 1 120 0 v110z' fill='#3f2a1a'/><path d='M740 610 a60 60 0 0 1 120 0' fill='none' stroke='#94a3b8' stroke-width='10'/><path d='M760 620 v100 M780 612 v108 M800 610 v110 M820 612 v108 M840 620 v100 M745 650 h110 M745 690 h110' stroke='#1f2937' stroke-width='4' opacity='0.7'/>`;
  // Banderoller
  for (const x of [650, 950]) body += `<path d='M${x - 24} 560 h48 v90 l-24 -18 l-24 18z' fill='#1d4ed8'/>` + star5(x, 595, 13, "#fbbf24");
  body += `<path d='M740 720 L700 1000 L900 1000 L860 720Z' fill='#c9a36a'/>`;
  body += hills(r, 900, 20, 4, "#5fae4f");
  let trees = "";
  for (const x of [100, 180, 260, 1340, 1420, 1500]) trees += `<circle cx='${x}' cy='${n1(850 + between(r, -20, 20))}' r='${n1(between(r, 45, 60))}' fill='#3f8f3a'/><rect x='${x - 8}' y='880' width='16' height='60' fill='#6b4423'/>`;
  body += trees;
  return scene(body);
}

function vapenskold(): ThemeArt {
  const T = 280;
  const shieldPath = (s: number) => `M${-s} ${-s * 1.1} L${s} ${-s * 1.1} L${s} 0 C${s} ${s * 0.8} ${s * 0.3} ${s * 1.2} 0 ${s * 1.35} C${-s * 0.3} ${s * 1.2} ${-s} ${s * 0.8} ${-s} 0Z`;
  const shield = (id: string, x: number, y: number, s: number, fill: string) =>
    `<g transform='translate(${x} ${y})'><clipPath id='${id}'><path d='${shieldPath(s)}'/></clipPath><g clip-path='url(#${id})'>${fill}</g><path d='${shieldPath(s)}' fill='none' stroke='#fbbf24' stroke-width='6'/></g>`;
  const swords = (x: number, y: number) => `<g transform='translate(${x} ${y})' stroke-linecap='round'><path d='M-50 -50 L50 50 M50 -50 L-50 50' stroke='#e5e7eb' stroke-width='8'/><path d='M-32 -18 L-18 -32 M32 -18 L18 -32' stroke='#fbbf24' stroke-width='8'/><circle cx='-50' cy='-50' r='0.1' stroke='#fbbf24' stroke-width='14'/><circle cx='50' cy='-50' r='0.1' stroke='#fbbf24' stroke-width='14'/></g>`;
  const crown = (x: number, y: number, s: number) => `<path d='M${x - 14 * s} ${y + 8 * s} L${x - 16 * s} ${y - 8 * s} L${x - 7 * s} ${y} L${x} ${y - 12 * s} L${x + 7 * s} ${y} L${x + 16 * s} ${y - 8 * s} L${x + 14 * s} ${y + 8 * s}Z' fill='#fbbf24'/>`;
  let body = swords(70, 80) + shield("a", 70, 80, 42, `<rect x='-50' y='-60' width='100' height='120' fill='#dc2626'/><rect x='0' y='-60' width='50' height='120' fill='#fbbf24'/>`);
  body += shield("b", 210, 220, 42, `<rect x='-50' y='-60' width='100' height='120' fill='#1e40af'/><path d='M-50 30 L0 -20 L50 30 L50 50 L0 0 L-50 50Z' fill='#f8fafc'/>`);
  body += shield("c", 210, 80, 30, `<rect x='-50' y='-60' width='100' height='120' fill='#15803d'/><rect x='-6' y='-60' width='12' height='120' fill='#fbbf24'/><rect x='-50' y='-10' width='100' height='12' fill='#fbbf24'/>`);
  body += shield("d", 70, 220, 30, `<rect x='-50' y='-60' width='50' height='60' fill='#7c3aed'/><rect x='0' y='-60' width='50' height='60' fill='#f8fafc'/><rect x='-50' y='0' width='50' height='60' fill='#f8fafc'/><rect x='0' y='0' width='50' height='60' fill='#7c3aed'/>`);
  body += crown(140, 150, 1) + crown(0, 150, 0.8) + crown(280, 150, 0.8) + crown(140, 10, 0.7) + crown(140, 290, 0.7);
  return pattern({ body, w: T, h: T }, "radial-gradient(circle at 50% 40%, #1e3a8a, #172554 75%)");
}

function tornerspel(): ThemeArt {
  const r = seeded(42);
  let body = `<defs>${linGrad("s", ["#8fd0fb", "#c4e7fd", "#eef8ff"])}${linGrad("g", ["#8ee07a", "#58b94a"])}</defs>${sky("s")}`;
  body += cloud(320, 230, 1, "#ffffff", "#e0f0fc") + cloud(1250, 260, 1.2, "#ffffff", "#e0f0fc");
  body += `<rect y='640' width='${W}' height='360' fill='url(#g)'/>`;
  body += hills(r, 650, 20, 5, "#a3e08f");
  const tent = (id: string, x: number, w: number, h: number, c1: string, c2: string, pennant: string) => {
    const base = 760, top = base - h;
    let stripes = "";
    for (let i = 0; i < 10; i++) stripes += `<rect x='${x - w / 2 + (i * w) / 10}' y='${top - w}' width='${w / 20}' height='${h + w}' fill='${c2}'/>`;
    return `<clipPath id='${id}'><path d='M${x - w / 2} ${base} L${x - w / 2 + 12} ${top} L${x + w / 2 - 12} ${top} L${x + w / 2} ${base}Z M${x - w / 2 - 16} ${top + 2} L${x} ${top - w * 0.55} L${x + w / 2 + 16} ${top + 2}Z'/></clipPath><rect x='${x - w / 2 - 20}' y='${top - w}' width='${w + 40}' height='${h + w}' fill='${c1}' clip-path='url(#${id})'/><g clip-path='url(#${id})'>${stripes}</g><path d='M${x - w / 2 - 16} ${top + 2} L${x + w / 2 + 16} ${top + 2}' stroke='${c2}' stroke-width='6'/><path d='M${x - w / 2 - 16} ${top + 2} q${w / 8} 22 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4 + 32} 0' fill='${c1}' stroke='${c2}' stroke-width='3'/><path d='M${x - 22} ${base} L${x} ${base - 70} L${x + 22} ${base}Z' fill='#3f2a1a' opacity='0.8'/><path d='M${x} ${top - w * 0.55} v-50' stroke='#475569' stroke-width='4'/><path d='M${x} ${top - w * 0.55 - 50} l50 12 l-50 12Z' fill='${pennant}'/>`;
  };
  body += tent("t1", 250, 200, 170, "#ffffff", "#dc2626", "#2563eb") + tent("t2", 620, 240, 200, "#fde047", "#2563eb", "#dc2626") + tent("t3", 1000, 220, 180, "#ffffff", "#16a34a", "#f59e0b") + tent("t4", 1360, 200, 170, "#fbcfe8", "#7c3aed", "#16a34a");
  // Vimplar
  const bunting = (y: number) => {
    let s = `<path d='M-20 ${y} Q400 ${y + 70} 800 ${y} T1620 ${y}' stroke='#78350f' stroke-width='3' fill='none'/>`;
    const cols = ["#ef4444", "#facc15", "#3b82f6", "#22c55e", "#a855f7", "#f97316"];
    for (let i = 0; i < 26; i++) {
      const x = i * 64 + 10;
      const t = (x % 800) / 800;
      const yy = y + 4 * 35 * t * (1 - t);
      s += `<path d='M${x} ${n1(yy)} L${x + 40} ${n1(yy)} L${x + 20} ${n1(yy + 46)}Z' fill='${cols[i % cols.length]}'/>`;
    }
    return s;
  };
  body += bunting(30);
  // Tornerbana
  body += `<rect x='-20' y='860' width='${W + 40}' height='26' fill='#f8fafc'/>`;
  for (let x = 0; x < W; x += 80) body += `<rect x='${x}' y='860' width='40' height='26' fill='#dc2626'/>`;
  for (let x = 20; x < W; x += 160) body += `<rect x='${x}' y='860' width='14' height='100' fill='#78350f'/>`;
  return scene(body);
}

function kungasal(): ThemeArt {
  const r = seeded(43);
  let body = `<defs><pattern id='mur' width='80' height='40' patternUnits='userSpaceOnUse'><rect width='80' height='40' fill='#5b4a44'/><rect x='2' y='2' width='36' height='16' rx='2' fill='#6b5850'/><rect x='42' y='2' width='36' height='16' rx='2' fill='#63514a'/><rect x='-18' y='22' width='36' height='16' rx='2' fill='#63514a'/><rect x='22' y='22' width='36' height='16' rx='2' fill='#6b5850'/><rect x='62' y='22' width='36' height='16' rx='2' fill='#6b5850'/></pattern>${glowGrad("t", "#ffb347", 0.75)}${linGrad("golv", ["#3a2a22", "#1c140f"])}${linGrad("win", ["#fff3c4", "#fbbf24"])}</defs>`;
  body += `<rect width='${W}' height='${H}' fill='url(#mur)'/><rect width='${W}' height='${H}' fill='#000' opacity='0.18'/>`;
  // Fönster
  for (const x of [400, 1200]) body += `<path d='M${x - 50} 420 v-170 a50 50 0 0 1 100 0 v170z' fill='url(#win)' opacity='0.85'/><path d='M${x} 200 v220 M${x - 50} 320 h100' stroke='#3a2a22' stroke-width='6'/>`;
  // Banér
  const banner = (x: number, c: string) => `<rect x='${x - 70}' y='40' width='140' height='16' rx='8' fill='#78350f'/><path d='M${x - 60} 56 h120 v330 l-60 -50 l-60 50z' fill='${c}'/><path d='M${x - 60} 56 h120 v330 l-60 -50 l-60 50z' fill='none' stroke='#fbbf24' stroke-width='6'/><path d='M${x - 34} 200 L${x - 38} 160 L${x - 16} 178 L${x} 146 L${x + 16} 178 L${x + 38} 160 L${x + 34} 200Z' fill='#fbbf24'/><circle cx='${x}' cy='240' r='8' fill='#fbbf24'/>`;
  body += banner(160, "#b91c1c") + banner(620, "#1d4ed8") + banner(980, "#1d4ed8") + banner(1440, "#b91c1c");
  // Facklor
  const torch = (x: number, y: number) => `<circle cx='${x}' cy='${y - 30}' r='130' fill='url(#t)'/><rect x='${x - 7}' y='${y}' width='14' height='60' fill='#3a2a22'/><path d='M${x - 18} ${y} h36 l-6 16 h-24z' fill='#57534e'/><path d='M${x} ${y - 60} C${x + 22} ${y - 30} ${x + 18} ${y} ${x} ${y} C${x - 18} ${y} ${x - 22} ${y - 30} ${x} ${y - 60}Z' fill='#f97316'/><path d='M${x} ${y - 38} C${x + 10} ${y - 20} ${x + 8} ${y} ${x} ${y} C${x - 8} ${y} ${x - 10} ${y - 20} ${x} ${y - 38}Z' fill='#fde047'/>`;
  body += torch(390, 560) + torch(1210, 560) + torch(800, 520);
  // Golv och matta
  body += `<rect y='700' width='${W}' height='300' fill='url(#golv)'/><path d='M700 700 L900 700 L1100 1000 L500 1000Z' fill='#b91c1c'/><path d='M700 700 L500 1000 M900 700 L1100 1000' stroke='#fbbf24' stroke-width='8'/>`;
  // Tron
  body += `<g transform='translate(800 700)'><path d='M-70 0 L-70 -200 Q0 -260 70 -200 L70 0Z' fill='#7c2d12'/><path d='M-50 -20 L-50 -180 Q0 -225 50 -180 L50 -20Z' fill='#b91c1c'/><rect x='-90' y='-60' width='180' height='60' rx='10' fill='#92400e'/><path d='M-24 -230 L-28 -262 L-12 -248 L0 -272 L12 -248 L28 -262 L24 -230Z' fill='#fbbf24'/></g>`;
  for (let i = 0; i < 12; i++) body += sparkle(between(r, 0, W), between(r, 60, 700), between(r, 3, 6), "#fde68a", "opacity='0.7'");
  return scene(body);
}

// ─── Anime & manga ────────────────────────────────────────────────────────────

function sakura(): ThemeArt {
  const r = seeded(44);
  let body = `<defs>${linGrad("s", ["#ffd9ea", "#ffe7f1", "#fff3f8", "#fdf2ff"])}${linGrad("fuji", ["#8ea3d8", "#6b7fc0"])}</defs>${sky("s")}`;
  body += `<circle cx='800' cy='330' r='110' fill='#ff8fb1' opacity='0.8'/>`;
  body += `<path d='M280 760 L700 360 Q800 330 900 360 L1320 760Z' fill='url(#fuji)'/><path d='M700 360 Q800 330 900 360 L975 432 L940 420 L905 450 L870 420 L830 452 L790 420 L750 452 L715 422 L680 440 L625 432Z' fill='#ffffff'/>`;
  body += hills(r, 720, 25, 5, "#e9b8d8") + hills(r, 790, 25, 5, "#d998c4");
  // Torii
  body += `<g transform='translate(1180 830)' fill='#e11d48'><rect x='-90' y='-230' width='22' height='230'/><rect x='68' y='-230' width='22' height='230'/><path d='M-150 -250 Q0 -275 150 -250 L140 -228 Q0 -250 -140 -228Z' fill='#1f2937'/><rect x='-130' y='-236' width='260' height='16'/><rect x='-110' y='-190' width='220' height='14'/><rect x='-8' y='-222' width='16' height='34'/></g>`;
  body += hills(r, 880, 15, 5, "#c47fb0");
  const branch = (pts: [number, number][], w: number) => `<path d='${smooth(pts)}' stroke='#5b3a3a' stroke-width='${w}' fill='none' stroke-linecap='round'/>`;
  const blossoms = (cx: number, cy: number, spread: number, n: number) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const x = cx + between(r, -spread, spread), y = cy + between(r, -spread * 0.6, spread * 0.6), sz = between(r, 9, 17);
      const c = pick(r, ["#ffb7cf", "#ffc9da", "#ff9fbf", "#ffffff"]);
      s += `<g transform='translate(${n1(x)} ${n1(y)}) rotate(${n1(between(r, 0, 72))})'>`;
      for (let k = 0; k < 5; k++) s += `<ellipse cx='0' cy='${n1(-sz * 0.55)}' rx='${n1(sz * 0.42)}' ry='${n1(sz * 0.55)}' fill='${c}' transform='rotate(${k * 72})'/>`;
      s += `<circle r='${n1(sz * 0.22)}' fill='#e11d74'/></g>`;
    }
    return s;
  };
  body += branch([[-20, 60], [120, 110], [260, 120], [380, 180], [470, 170]], 16) + branch([[140, 110], [200, 200], [230, 280]], 9);
  body += blossoms(200, 120, 110, 40) + blossoms(400, 170, 80, 22) + blossoms(220, 250, 50, 12);
  body += branch([[1620, 40], [1480, 100], [1360, 110], [1250, 160]], 16) + branch([[1470, 100], [1430, 190]], 9);
  body += blossoms(1450, 100, 120, 40) + blossoms(1280, 150, 70, 20) + blossoms(1430, 200, 40, 10);
  let petals = "";
  const pr = seeded(144);
  for (let i = 0; i < 10; i++) {
    const x = between(pr, 0, 260), y = between(pr, 0, 260), rot = between(pr, 0, 360), c = pick(pr, ["#ffb7cf", "#ff9fbf", "#ffd1df"]);
    petals += wrap(x, y, 10, 260, 260, (a, b) => `<path d='M0 -7 C6 -7 8 2 0 8 C-8 2 -6 -7 0 -7Z' fill='${c}' transform='translate(${n1(a)} ${n1(b)}) rotate(${n1(rot)})'/>`);
  }
  return scene(body, { body: petals, w: 260, h: 260 });
}

function animehimmel(): ThemeArt {
  const r = seeded(45);
  let body = `<defs>${linGrad("s", ["#1d4fd8", "#3b82f6", "#7cb8f7", "#d6ecff"])}${glowGrad("sun", "#ffffff", 0.95)}${glowGrad("fl", "#fde68a", 0.5)}</defs>${sky("s")}`;
  // Ett högt stackmoln: breda rader puffar nertill, smalare uppåt.
  const bigCloud = (cx: number, cy: number, s: number, rows: number[]) => {
    const puffs: [number, number, number][] = [];
    rows.forEach((count, row) => {
      const width = 260 * s * (1 - row * 0.2);
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        puffs.push([cx - width / 2 + t * width + between(r, -14, 14) * s, cy - row * 70 * s + between(r, -12, 12) * s, between(r, 58, 80) * s * (1 - row * 0.08)]);
      }
    });
    let out = `<g fill='#a9c3ea'>${puffs.map(([x, y, rr]) => `<circle cx='${n1(x + rr * 0.12)}' cy='${n1(y + rr * 0.22)}' r='${n1(rr)}'/>`).join("")}</g>`;
    out += `<g fill='#ffffff'>${puffs.map(([x, y, rr]) => `<circle cx='${n1(x - rr * 0.06)}' cy='${n1(y - rr * 0.06)}' r='${n1(rr * 0.93)}'/>`).join("")}</g>`;
    return out;
  };
  body += bigCloud(330, 760, 1.2, [6, 5, 4, 2]) + bigCloud(1230, 700, 1.4, [6, 5, 4, 3, 1]) + bigCloud(800, 900, 1, [7, 5, 3]);
  body += cloud(700, 220, 0.8, "#ffffff", "#c7dcf5") + cloud(260, 180, 0.6, "#ffffff", "#c7dcf5");
  body += `<circle cx='1340' cy='130' r='260' fill='url(#sun)'/><circle cx='1340' cy='130' r='50' fill='#ffffff'/>`;
  for (const [t, rr, c] of [[0.3, 30, "#fde68a"], [0.5, 16, "#a5f3fc"], [0.7, 44, "#fbcfe8"], [0.9, 12, "#ffffff"]] as [number, number, string][]) {
    body += `<circle cx='${n1(1340 - 700 * t)}' cy='${n1(130 + 500 * t)}' r='${rr}' fill='${c}' opacity='0.35'/>`;
  }
  // Elstolpar och ledningar
  body += `<g fill='#1e293b'><rect x='120' y='520' width='16' height='480'/><rect x='70' y='560' width='116' height='10'/><rect x='84' y='600' width='88' height='8'/><rect x='1500' y='600' width='14' height='400'/><rect x='1456' y='632' width='102' height='9'/></g>`;
  body += `<path d='M75 565 Q800 760 1460 636 M180 565 Q800 800 1552 636 M90 603 Q800 820 1500 700' stroke='#1e293b' stroke-width='2.5' fill='none'/>`;
  for (let i = 0; i < 5; i++) {
    const x = between(r, 400, 1200), y = between(r, 280, 420);
    body += `<path d='M${n1(x - 14)} ${n1(y)} q7 -8 14 0 q7 -8 14 0' fill='none' stroke='#1e293b' stroke-width='2.5' stroke-linecap='round'/>`;
  }
  return scene(body);
}

function neonstad(): ThemeArt {
  const r = seeded(46);
  let body = `<defs>${linGrad("s", ["#0b0a26", "#231a5a", "#4a1f6b", "#7a2a70"])}${glowGrad("pk", "#ff4fd8", 0.6)}${glowGrad("cy", "#22e5ff", 0.55)}</defs>${sky("s")}`;
  body += starField(r, 70, 0, 0, W, 300, ["#ffffff"], 0.6, 1.4);
  body += `<circle cx='1260' cy='170' r='80' fill='#ffe7f6'/><circle cx='1260' cy='170' r='150' fill='url(#pk)' opacity='0.5'/>`;
  const layer = (base: number, lo: number, hi: number, wmin: number, wmax: number, fill: string, lit: number, winCols: string[]) => {
    let s = "";
    for (let x = -20; x < W; ) {
      const w = between(r, wmin, wmax), h = between(r, lo, hi);
      s += `<rect x='${n1(x)}' y='${n1(base - h)}' width='${n1(w)}' height='${n1(h + 10)}' fill='${fill}'/>`;
      if (r() < 0.3) s += `<rect x='${n1(x + w / 2 - 2)}' y='${n1(base - h - 40)}' width='4' height='40' fill='${fill}'/><circle cx='${n1(x + w / 2)}' cy='${n1(base - h - 42)}' r='3' fill='#ff4f6d'/>`;
      let d = "";
      for (let wy = base - h + 14; wy < base - 10; wy += 22) for (let wx = x + 10; wx < x + w - 14; wx += 18) if (r() < lit) d += `M${n1(wx)} ${n1(wy)}h8v10h-8z`;
      if (d) s += `<path d='${d}' fill='${pick(r, winCols)}' opacity='0.9'/>`;
      x += w + between(r, 0, 12);
    }
    return s;
  };
  body += layer(800, 180, 420, 60, 140, "#2a1f5c", 0.12, ["#8b7fd6"]);
  body += layer(870, 120, 330, 80, 170, "#1a1340", 0.25, ["#ffd36e", "#7ce7ff", "#ff9bd9"]);
  const sign = (x: number, y: number, w: number, h: number, c: string, g: string) => `<rect x='${x - 30}' y='${y - 30}' width='${w + 60}' height='${h + 60}' fill='url(#${g})'/><rect x='${x}' y='${y}' width='${w}' height='${h}' rx='10' fill='none' stroke='${c}' stroke-width='6'/><rect x='${x + 14}' y='${y + h / 2 - 3}' width='${w - 28}' height='6' rx='3' fill='${c}'/>`;
  body += sign(200, 520, 120, 60, "#ff4fd8", "pk") + sign(1100, 480, 70, 170, "#22e5ff", "cy") + sign(620, 600, 150, 50, "#22e5ff", "cy") + sign(1380, 560, 110, 60, "#ffe14d", "pk");
  body += layer(1000, 60, 200, 100, 200, "#0d0a24", 0.3, ["#ffd36e", "#ff9bd9"]);
  body += `<rect y='940' width='${W}' height='60' fill='#07051a'/>`;
  for (let i = 0; i < 20; i++) body += `<rect x='${n1(between(r, 0, W))}' y='${n1(between(r, 945, 995))}' width='${n1(between(r, 30, 120))}' height='3' rx='1.5' fill='${pick(r, ["#ff4fd8", "#22e5ff", "#ffe14d"])}' opacity='0.6'/>`;
  let rain = "";
  const rr2 = seeded(146);
  for (let i = 0; i < 24; i++) {
    const x = between(rr2, 0, 200), y = between(rr2, 0, 200), l = between(rr2, 10, 22);
    rain += wrap(x, y, l, 200, 200, (a, b) => `<path d='M${n1(a)} ${n1(b)} l-3 ${n1(l)}' stroke='#a5b4fc' stroke-width='1.3' opacity='0.45' stroke-linecap='round'/>`);
  }
  return scene(body, { body: rain, w: 200, h: 200 });
}

function actionlinjer(): ThemeArt {
  const r = seeded(47);
  let body = `<defs><radialGradient id='bg' cx='50%' cy='50%' r='70%'><stop offset='0%' stop-color='#fff7c2'/><stop offset='35%' stop-color='#ffd23f'/><stop offset='75%' stop-color='#ff8a1f'/><stop offset='100%' stop-color='#e8491d'/></radialGradient></defs><rect width='${W}' height='${H}' fill='url(#bg)'/>`;
  let d = "";
  const cx = 800, cy = 500, R = 1200;
  for (let i = 0; i < 110; i++) {
    const a = (i / 110) * Math.PI * 2 + between(r, -0.01, 0.01);
    const wdt = between(r, 0.004, 0.018);
    const inner = between(r, 170, 320);
    d += `M${n1(cx + Math.cos(a) * inner)} ${n1(cy + Math.sin(a) * inner)} L${n1(cx + Math.cos(a - wdt) * R)} ${n1(cy + Math.sin(a - wdt) * R)} L${n1(cx + Math.cos(a + wdt) * R)} ${n1(cy + Math.sin(a + wdt) * R)}Z`;
  }
  body += `<path d='${d}' fill='#ffffff' opacity='0.75'/>`;
  let burst = "";
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const rr = i % 2 === 0 ? 170 : 110;
    burst += `${i === 0 ? "M" : "L"}${n1(cx + Math.cos(a) * rr)} ${n1(cy + Math.sin(a) * rr * 0.8)} `;
  }
  body += `<path d='${burst}Z' fill='#ffffff' opacity='0.9'/>`;
  return scene(body);
}

function mangaraster(): ThemeArt {
  let body = `<defs><pattern id='dot' width='14' height='14' patternUnits='userSpaceOnUse'><circle cx='7' cy='7' r='3.2' fill='#1f2937'/></pattern><pattern id='dot2' width='10' height='10' patternUnits='userSpaceOnUse'><circle cx='5' cy='5' r='2' fill='#1f2937'/></pattern><pattern id='hatch' width='10' height='10' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><rect width='3' height='10' fill='#1f2937'/></pattern>${linGrad("fade", ["#ffffff", "#000000"])}${linGrad("fade2", ["#000000", "#ffffff"], false)}<mask id='m1'><rect width='${W}' height='${H}' fill='url(#fade)'/></mask><mask id='m2'><rect width='${W}' height='${H}' fill='url(#fade2)'/></mask></defs>`;
  body += `<rect width='${W}' height='${H}' fill='#fbfaf7'/>`;
  const panels: string[] = ["M20 20 L720 20 L660 420 L20 420Z", "M750 20 L1580 20 L1580 330 L700 330Z", "M690 360 L1580 360 L1580 620 L650 620Z", "M20 450 L655 450 L610 980 L20 980Z", "M640 650 L1100 650 L1080 980 L610 980Z", "M1130 650 L1580 650 L1580 980 L1110 980Z"];
  const fills = [
    `<rect width='${W}' height='${H}' fill='url(#dot)' mask='url(#m1)'/>`,
    `<rect width='${W}' height='${H}' fill='url(#hatch)' opacity='0.35'/>`,
    "",
    `<rect width='${W}' height='${H}' fill='url(#dot2)' mask='url(#m2)'/>`,
    `<rect width='${W}' height='${H}' fill='url(#dot)' opacity='0.5'/>`,
    "",
  ];
  panels.forEach((p, i) => {
    body += `<clipPath id='p${i}'><path d='${p}'/></clipPath><g clip-path='url(#p${i})'>${fills[i]}</g>`;
  });
  // Fartlinjer i panel 3
  let lines = "";
  const r = seeded(48);
  for (let i = 0; i < 40; i++) {
    const y = between(r, 370, 610);
    lines += `M${n1(between(r, 1050, 1300))} ${n1(y)} L1590 ${n1(y + between(r, -4, 4))} `;
  }
  body += `<g clip-path='url(#p2)'><path d='${lines}' stroke='#1f2937' stroke-width='2.5'/></g>`;
  // Glitter i sista panelen
  let spark = "";
  for (let i = 0; i < 14; i++) spark += sparkle(between(r, 1150, 1560), between(r, 670, 960), between(r, 8, 22), "#1f2937");
  body += `<g clip-path='url(#p5)'>${spark}${heart(1360, 820, 40, "none", "stroke='#1f2937' stroke-width='5'")}</g>`;
  body += panels.map((p) => `<path d='${p}' fill='none' stroke='#111827' stroke-width='8' stroke-linejoin='round'/>`).join("");
  // Pratbubbla
  body += `<g transform='translate(330 230)'><ellipse rx='150' ry='80' fill='#ffffff' stroke='#111827' stroke-width='6'/><path d='M60 70 L120 140 L20 78' fill='#ffffff' stroke='#111827' stroke-width='6' stroke-linejoin='round'/><rect x='-100' y='-20' width='200' height='12' rx='6' fill='#d1d5db'/><rect x='-80' y='10' width='150' height='12' rx='6' fill='#d1d5db'/></g>`;
  return scene(body);
}

function serierutor(): ThemeArt {
  let body = `<defs><pattern id='rd' width='16' height='16' patternUnits='userSpaceOnUse'><circle cx='8' cy='8' r='4' fill='#ef4444' opacity='0.55'/></pattern><pattern id='bd' width='16' height='16' patternUnits='userSpaceOnUse'><circle cx='8' cy='8' r='4' fill='#1d4ed8' opacity='0.45'/></pattern></defs><rect width='${W}' height='${H}' fill='#ffffff'/>`;
  const panel = (x: number, y: number, w: number, h: number, bg: string, dots: string) => `<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='${bg}'/><rect x='${x}' y='${y}' width='${w}' height='${h}' fill='url(#${dots})'/><rect x='${x}' y='${y}' width='${w}' height='${h}' fill='none' stroke='#111827' stroke-width='8'/>`;
  body += panel(20, 20, 560, 460, "#fde047", "rd") + panel(600, 20, 980, 300, "#7dd3fc", "bd") + panel(600, 340, 470, 300, "#f9a8d4", "rd") + panel(1090, 340, 490, 300, "#86efac", "bd") + panel(20, 500, 560, 480, "#c4b5fd", "bd") + panel(600, 660, 980, 320, "#fdba74", "rd");
  const burst = (x: number, y: number, R: number, c: string, text: string, size: number, rot: number) => {
    let p = "";
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const rr = i % 2 === 0 ? R : R * 0.68;
      p += `${i === 0 ? "M" : "L"}${n1(x + Math.cos(a) * rr)} ${n1(y + Math.sin(a) * rr * 0.75)} `;
    }
    return `<path d='${p}Z' fill='${c}' stroke='#111827' stroke-width='6' stroke-linejoin='round'/><text x='${x}' y='${y + size * 0.35}' text-anchor='middle' font-family='Arial Black, Impact, sans-serif' font-weight='900' font-size='${size}' fill='#ffffff' stroke='#111827' stroke-width='5' paint-order='stroke' transform='rotate(${rot} ${x} ${y})'>${text}</text>`;
  };
  body += burst(300, 250, 200, "#ef4444", "POW!", 90, -8) + burst(1300, 170, 160, "#facc15", "BAM!", 70, 6) + burst(1330, 490, 120, "#3b82f6", "ZAP!", 52, -6) + burst(300, 740, 170, "#f97316", "WOW!", 76, 5);
  body += `<g transform='translate(830 470)'><ellipse rx='150' ry='80' fill='#ffffff' stroke='#111827' stroke-width='6'/><path d='M-40 72 L-90 140 L10 78' fill='#ffffff' stroke='#111827' stroke-width='6' stroke-linejoin='round'/><rect x='-100' y='-20' width='200' height='12' rx='6' fill='#d1d5db'/><rect x='-80' y='10' width='150' height='12' rx='6' fill='#d1d5db'/></g>`;
  body += `<g transform='translate(1080 820)'><ellipse rx='210' ry='90' fill='#ffffff' stroke='#111827' stroke-width='6'/><circle cx='-150' cy='110' r='18' fill='#ffffff' stroke='#111827' stroke-width='5'/><circle cx='-190' cy='140' r='10' fill='#ffffff' stroke='#111827' stroke-width='4'/><rect x='-140' y='-20' width='280' height='12' rx='6' fill='#d1d5db'/><rect x='-110' y='10' width='220' height='12' rx='6' fill='#d1d5db'/></g>`;
  return scene(body);
}

function kawaii(): ThemeArt {
  const T = 300;
  const face = (x: number, y: number, s: number) => `<circle cx='${n1(x - 9 * s)}' cy='${n1(y)}' r='${n1(3 * s)}' fill='#3f3f46'/><circle cx='${n1(x + 9 * s)}' cy='${n1(y)}' r='${n1(3 * s)}' fill='#3f3f46'/><path d='M${n1(x - 5 * s)} ${n1(y + 6 * s)} Q${n1(x)} ${n1(y + 11 * s)} ${n1(x + 5 * s)} ${n1(y + 6 * s)}' stroke='#3f3f46' stroke-width='${n1(2 * s)}' fill='none' stroke-linecap='round'/><ellipse cx='${n1(x - 17 * s)}' cy='${n1(y + 6 * s)}' rx='${n1(5 * s)}' ry='${n1(3 * s)}' fill='#fb7185' opacity='0.6'/><ellipse cx='${n1(x + 17 * s)}' cy='${n1(y + 6 * s)}' rx='${n1(5 * s)}' ry='${n1(3 * s)}' fill='#fb7185' opacity='0.6'/>`;
  let body = cloud(80, 80, 0.55, "#ffffff", "#e9d5ff") + face(84, 72, 1.1);
  body += star5(220, 90, 42, "#fde68a", "stroke='#f59e0b' stroke-width='3' stroke-linejoin='round'") + face(220, 96, 0.8);
  body += heart(90, 220, 40, "#f9a8d4", "stroke='#ec4899' stroke-width='3'") + face(90, 214, 0.8);
  // Onigiri
  body += `<g transform='translate(225 225)'><path d='M0 -44 C14 -44 50 18 44 30 C38 42 -38 42 -44 30 C-50 18 -14 -44 0 -44Z' fill='#ffffff' stroke='#d4d4d8' stroke-width='3'/><rect x='-22' y='12' width='44' height='30' rx='4' fill='#1f2937'/></g>` + face(225, 0 + 208, 0.8);
  body += sparkle(150, 150, 10, "#ffffff") + sparkle(270, 160, 7, "#c4b5fd") + sparkle(20, 150, 7, "#fbcfe8") + sparkle(160, 20, 7, "#a5f3fc") + sparkle(160, 280, 8, "#fde68a");
  return pattern({ body, w: T, h: T }, "linear-gradient(135deg, #fce7f3, #ede9fe 50%, #e0f2fe)");
}

// ─── Fest & sport ─────────────────────────────────────────────────────────────

function disco(): ThemeArt {
  const r = seeded(49);
  let body = `<defs>${linGrad("s", ["#1a0833", "#2d0b52", "#12051f"])}<clipPath id='ball'><circle cx='800' cy='150' r='100'/></clipPath>${glowGrad("g", "#ffffff", 0.6)}</defs>${sky("s")}`;
  const beams = [["#ff4fd8", -0.55], ["#22e5ff", -0.25], ["#ffe14d", 0.1], ["#7cff6b", 0.35], ["#ff7a3d", 0.6], ["#a78bfa", -0.8], ["#22e5ff", 0.85]] as [string, number][];
  for (const [c, a] of beams) {
    const x2 = 800 + Math.tan(a) * 900;
    body += `<path d='M800 150 L${n1(x2 - 150)} 1000 L${n1(x2 + 150)} 1000Z' fill='${c}' opacity='0.18'/>`;
  }
  body += `<rect x='796' y='0' width='8' height='60' fill='#9ca3af'/><circle cx='800' cy='150' r='100' fill='#9ca3af'/><g clip-path='url(#ball)'>`;
  for (let y = 50; y < 260; y += 20) for (let x = 700; x < 900; x += 20) body += `<rect x='${x + 1}' y='${y + 1}' width='18' height='18' fill='${pick(r, ["#e5e7eb", "#cbd5e1", "#94a3b8", "#f8fafc", "#a5f3fc", "#f5d0fe"])}'/>`;
  body += `</g><circle cx='760' cy='110' r='40' fill='url(#g)'/>`;
  // Dansgolv
  const cols = ["#ff4fd8", "#22e5ff", "#ffe14d", "#7cff6b", "#a78bfa", "#ff7a3d"];
  for (let row = 0; row < 5; row++) {
    const y0 = 760 + row * 48, y1 = y0 + 48;
    const scale0 = 0.6 + row * 0.1, scale1 = 0.7 + row * 0.1;
    for (let c = -8; c < 8; c++) {
      const x0a = 800 + c * 110 * scale0, x0b = 800 + (c + 1) * 110 * scale0, x1a = 800 + c * 110 * scale1, x1b = 800 + (c + 1) * 110 * scale1;
      body += `<path d='M${n1(x0a)} ${y0} L${n1(x0b)} ${y0} L${n1(x1b)} ${y1} L${n1(x1a)} ${y1}Z' fill='${pick(r, cols)}' opacity='${n1(between(r, 0.35, 0.8))}' stroke='#12051f' stroke-width='3'/>`;
    }
  }
  for (let i = 0; i < 30; i++) body += sparkle(between(r, 0, W), between(r, 0, 740), between(r, 5, 12), pick(r, ["#ffffff", "#fde68a", "#f5d0fe", "#a5f3fc"]));
  return scene(body);
}

function dans(): ThemeArt {
  const r = seeded(50);
  let body = `<defs>${linGrad("s", ["#2a0a4a", "#5b1470", "#8a1a6e"])}${linGrad("cur", ["#b91c1c", "#7f1d1d", "#b91c1c", "#7f1d1d", "#b91c1c"], false)}${linGrad("golv", ["#3b1a2a", "#1a0a12"])}</defs>${sky("s")}`;
  body += `<path d='M200 -10 L0 1000 L500 1000Z' fill='#ffe9a8' opacity='0.18'/><path d='M1400 -10 L1100 1000 L1600 1000Z' fill='#a5f3fc' opacity='0.16'/><path d='M800 -10 L550 1000 L1050 1000Z' fill='#fbcfe8' opacity='0.14'/>`;
  body += `<rect y='820' width='${W}' height='180' fill='url(#golv)'/><ellipse cx='250' cy='900' rx='240' ry='50' fill='#ffe9a8' opacity='0.25'/><ellipse cx='1350' cy='900' rx='240' ry='50' fill='#a5f3fc' opacity='0.22'/><ellipse cx='800' cy='910' rx='260' ry='50' fill='#fbcfe8' opacity='0.22'/>`;
  body += `<rect x='-10' y='0' width='190' height='1000' fill='url(#cur)'/><rect x='1420' y='0' width='190' height='1000' fill='url(#cur)'/><path d='M-10 0 H1610 V70 Q1440 110 1280 70 Q1120 110 960 70 Q800 110 640 70 Q480 110 320 70 Q160 110 -10 70Z' fill='#991b1b'/><path d='M-10 70 Q160 110 320 70 Q480 110 640 70 Q800 110 960 70 Q1120 110 1280 70 Q1440 110 1610 70' fill='none' stroke='#fbbf24' stroke-width='6'/>`;
  for (let i = 0; i < 22; i++) body += sparkle(between(r, 200, 1400), between(r, 120, 780), between(r, 5, 11), pick(r, ["#ffffff", "#fde68a", "#f5d0fe"]));
  let notes = "";
  const nr = seeded(150);
  for (let i = 0; i < 5; i++) {
    const x = between(nr, 0, 260), y = between(nr, 0, 260), c = pick(nr, ["#fde68a", "#f9a8d4", "#a5f3fc", "#c4b5fd"]), rot = between(nr, -20, 20), dbl = nr() > 0.5;
    notes += wrap(x, y, 30, 260, 260, (a, b) => `<g transform='translate(${n1(a)} ${n1(b)}) rotate(${n1(rot)})' fill='${c}' opacity='0.8'>${dbl ? "<ellipse cx='-12' cy='14' rx='9' ry='7' transform='rotate(-20 -12 14)'/><ellipse cx='16' cy='8' rx='9' ry='7' transform='rotate(-20 16 8)'/><rect x='-5' y='-22' width='3.5' height='36'/><rect x='23' y='-28' width='3.5' height='36'/><path d='M-5 -22 L26.5 -28 L26.5 -20 L-5 -14Z'/>" : "<ellipse cx='0' cy='14' rx='10' ry='7.5' transform='rotate(-20 0 14)'/><rect x='7' y='-22' width='3.5' height='36'/><path d='M10.5 -22 Q24 -12 18 2 Q20 -10 10.5 -12Z'/>"}</g>`);
  }
  return scene(body, { body: notes, w: 260, h: 260 });
}

function fotboll(): ThemeArt {
  let body = "";
  for (let i = 0; i < 16; i++) body += `<rect x='${i * 100}' y='0' width='100' height='${H}' fill='${i % 2 ? "#3fa34d" : "#4cb35a"}'/>`;
  const L = `stroke='#ffffff' stroke-width='6' fill='none' opacity='0.9'`;
  body += `<rect x='40' y='40' width='1520' height='920' ${L}/><path d='M800 40 V960' ${L}/><circle cx='800' cy='500' r='140' ${L}/><circle cx='800' cy='500' r='8' fill='#ffffff'/>`;
  body += `<rect x='40' y='250' width='230' height='500' ${L}/><rect x='40' y='380' width='80' height='240' ${L}/><path d='M270 400 A120 120 0 0 1 270 600' ${L}/><circle cx='190' cy='500' r='6' fill='#ffffff'/>`;
  body += `<rect x='1330' y='250' width='230' height='500' ${L}/><rect x='1480' y='380' width='80' height='240' ${L}/><path d='M1330 400 A120 120 0 0 0 1330 600' ${L}/><circle cx='1410' cy='500' r='6' fill='#ffffff'/>`;
  body += `<path d='M40 70 A30 30 0 0 0 70 40 M1530 40 A30 30 0 0 0 1560 70 M40 930 A30 30 0 0 1 70 960 M1530 960 A30 30 0 0 1 1560 930' ${L}/>`;
  body += `<rect x='10' y='440' width='30' height='120' fill='none' stroke='#ffffff' stroke-width='5'/><rect x='1560' y='440' width='30' height='120' fill='none' stroke='#ffffff' stroke-width='5'/>`;
  // Boll
  body += `<g transform='translate(960 620)'><ellipse cx='8' cy='40' rx='40' ry='10' fill='#000' opacity='0.2'/><circle r='40' fill='#ffffff' stroke='#1f2937' stroke-width='3'/><path d='M0 -14 L13 -5 L8 11 L-8 11 L-13 -5Z' fill='#1f2937'/><path d='M0 -14 L0 -38 M13 -5 L36 -12 M8 11 L22 32 M-8 11 L-22 32 M-13 -5 L-36 -12' stroke='#1f2937' stroke-width='3'/></g>`;
  return scene(body);
}

// ─── Engelskajaktens egna ─────────────────────────────────────────────────────
// Tre teman som Engelskajakten hade men Svenskajakten saknar. De två
// legendariska rörde sig redan förut, så de får en lugn rörelse i själva
// bilden. `still` stänger av den för elever som valt minskad rörelse.

function ko(): ThemeArt {
  const r = seeded(71);
  // En stor ruta med oregelbundet utspridda fläckar av olika storlek, så att
  // upprepningen inte syns som rader.
  const T = 560;
  let body = "";
  const spots: [number, number, number][] = [];
  for (let gy = 0; gy < 4; gy++) {
    for (let gx = 0; gx < 3; gx++) {
      spots.push([
        (gx + 0.5 + (gy % 2) * 0.33) * (T / 3) + between(r, -40, 40),
        (gy + 0.5) * (T / 4) + between(r, -30, 30),
        between(r, 18, 58),
      ]);
    }
  }
  for (const [x, y, rad] of spots) {
    const seed = Math.floor(r() * 1e6);
    body += wrap(x, y, rad * 1.5, T, T, (a, b) => {
      const rr = seeded(seed);
      return `<path d='${blob(rr, a, b, rad, 0.55, 10)}' fill='#1d1d24'/>`;
    });
  }
  return pattern({ body, w: T, h: T }, "linear-gradient(160deg, #fbfaf5, #efece2)");
}

function norrsken(still = false): ThemeArt {
  const r = seeded(72);
  let body = `<defs>${linGrad("s", ["#020617", "#07183a", "#0b3a4a", "#12514f"])}`;
  body += `<linearGradient id='a1' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#4ade80' stop-opacity='0.95'/><stop offset='0.55' stop-color='#2dd4bf' stop-opacity='0.45'/><stop offset='1' stop-color='#818cf8' stop-opacity='0'/></linearGradient>`;
  body += `<linearGradient id='a2' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#a3e635' stop-opacity='0.7'/><stop offset='0.6' stop-color='#c084fc' stop-opacity='0.35'/><stop offset='1' stop-color='#c084fc' stop-opacity='0'/></linearGradient>`;
  body += `<filter id='b' x='-10%' y='-30%' width='120%' height='160%'><feGaussianBlur stdDeviation='14'/></filter></defs>${sky("s")}`;
  body += starField(r, 220, 0, 0, W, 620, ["#ffffff", "#e0f2fe", "#fef9c3"], 0.6, 1.9);
  // Ridåer: en vågig underkant, och ljuset rinner uppåt från den.
  const curtain = (y: number, amp: number, h: number, fill: string, dx: number, dur: number) => {
    const pts: [number, number][] = [];
    for (let x = -200; x <= W + 200; x += 100) pts.push([x, y + amp * Math.sin(x / 190 + r() * 0.6)]);
    const top = pts.map(([x, yy]) => [x + 60, yy - h] as [number, number]).reverse();
    const d = smooth([...pts, ...top], true);
    const move = still ? "" : `<animateTransform attributeName='transform' type='translate' values='0 0;${dx} -12;0 0' dur='${dur}s' repeatCount='indefinite'/>`;
    const glow = still ? "" : `<animate attributeName='opacity' values='0.75;1;0.75' dur='${dur * 0.7}s' repeatCount='indefinite'/>`;
    return `<g filter='url(#b)'><path d='${d}' fill='${fill}'>${glow}</path>${move}</g>`;
  };
  body += curtain(470, 70, 380, "url(#a1)", 60, 18);
  body += curtain(380, 55, 300, "url(#a2)", -50, 23);
  body += curtain(540, 40, 260, "url(#a1)", 35, 15);
  body += hills(r, 800, 50, 5, "#0f172a");
  let trees = "";
  for (let x = -20; x < W + 40; x += between(r, 38, 80)) trees += pine(x, 870 + between(r, -18, 18), between(r, 110, 200), "#0b1220", "#e2e8f0");
  body += trees;
  body += hills(r, 900, 18, 4, "#e2e8f0") + hills(r, 930, 12, 5, "#cbd5e1");
  return scene(body);
}

function regnbagsvirvel(still = false): ThemeArt {
  const r = seeded(73);
  const cols = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#e879f9"];
  let body = `<defs><radialGradient id='bg' cx='50%' cy='50%' r='75%'><stop offset='0' stop-color='#3b0764'/><stop offset='0.55' stop-color='#1e1b4b'/><stop offset='1' stop-color='#0b0820'/></radialGradient>${glowGrad("c", "#fdf4ff", 0.9)}</defs>`;
  body += `<rect width='${W}' height='${H}' fill='url(#bg)'/>`;
  // Spiralarmar: varje arm är en böjd kil från mitten och ut förbi kanten.
  let arms = "";
  const N = cols.length * 2;
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2;
    const pts: [number, number][] = [];
    const back: [number, number][] = [];
    for (let k = 0; k <= 12; k++) {
      const t = k / 12;
      const rad = 20 + t * 1150;
      const a = a0 + t * 2.2;
      const w = 0.03 + t * 0.19;
      pts.push([800 + Math.cos(a - w) * rad, 500 + Math.sin(a - w) * rad]);
      back.push([800 + Math.cos(a + w) * rad, 500 + Math.sin(a + w) * rad]);
    }
    arms += `<path d='${smooth([...pts, ...back.reverse()], true)}' fill='${cols[i % cols.length]}' opacity='0.8'/>`;
  }
  const spin = still ? "" : `<animateTransform attributeName='transform' type='rotate' from='0 800 500' to='360 800 500' dur='120s' repeatCount='indefinite'/>`;
  body += `<g>${arms}${spin}</g>`;
  body += `<rect width='${W}' height='${H}' fill='url(#bg)' opacity='0.35'/>`;
  body += `<circle cx='800' cy='500' r='230' fill='url(#c)'/>`;
  for (let i = 0; i < 26; i++) body += sparkle(between(r, 0, W), between(r, 0, H), between(r, 6, 15), "#ffffff", `opacity='${n1(between(r, 0.5, 1))}'`);
  return scene(body);
}

// ─── Mattejaktens egna ────────────────────────────────────────────────────────
// Ritade i samma stil som resten, men finns bara i Mattejakten.

function guldskimmer(still = false): ThemeArt {
  const r = seeded(81);
  let body = `<defs><radialGradient id='bg' cx='50%' cy='62%' r='75%'><stop offset='0' stop-color='#8a5414'/><stop offset='0.5' stop-color='#3d2208'/><stop offset='1' stop-color='#140a02'/></radialGradient>`;
  body += `${glowGrad("g", "#ffd66b", 0.8)}${linGrad("coin", ["#fff6c2", "#fbbf24", "#b7791f"])}${linGrad("heap", ["#fde68a", "#f59e0b", "#a16207"])}${linGrad("wood", ["#9a5424", "#5a2e10"])}</defs>`;
  body += `<rect width='${W}' height='${H}' fill='url(#bg)'/>`;
  // Ljusstrimmor från en öppning i grottaket
  for (const [x, w] of [[640, 90], [760, 60], [880, 110]] as const) {
    body += `<path d='M${x} -10 L${x + w} -10 L${x + w * 2.6} 1000 L${x - w * 1.2} 1000Z' fill='#ffe9a8' opacity='0.07'/>`;
  }
  body += `<path d='M-20 -20 L-20 440 C90 380 130 250 250 210 C370 170 390 60 530 -20Z' fill='#1a0d03'/><path d='M1620 -20 L1620 470 C1510 410 1470 290 1350 250 C1230 210 1210 80 1070 -20Z' fill='#1a0d03'/>`;
  body += `<circle cx='800' cy='660' r='600' fill='url(#g)'/>`;
  // Myntberget
  const pts: [number, number][] = [];
  for (let x = -120; x <= W + 120; x += 80) {
    const d = (x - 800) / 640;
    pts.push([x, 1000 - 330 * Math.exp(-d * d * 1.5) - 70 + between(r, -10, 10)]);
  }
  body += `<path d='${smooth(pts)} L${W + 120} ${H + 10} L-120 ${H + 10}Z' fill='url(#heap)'/>`;
  const coin = (x: number, y: number, s: number) =>
    `<ellipse cx='${n1(x)}' cy='${n1(y + 4 * s)}' rx='${n1(24 * s)}' ry='${n1(9 * s)}' fill='#92400e'/><ellipse cx='${n1(x)}' cy='${n1(y)}' rx='${n1(24 * s)}' ry='${n1(9 * s)}' fill='url(#coin)'/><ellipse cx='${n1(x)}' cy='${n1(y)}' rx='${n1(15 * s)}' ry='${n1(5 * s)}' fill='none' stroke='#b7791f' stroke-width='${n1(1.8 * s)}'/>`;
  const coins: [number, number, number][] = [];
  for (let i = 0; i < 170; i++) {
    const x = between(r, -40, W + 40);
    const d = (x - 800) / 640;
    const top = 1000 - 330 * Math.exp(-d * d * 1.5) - 70;
    coins.push([x, between(r, top - 4, Math.min(1010, top + 260)), between(r, 0.8, 1.35)]);
  }
  coins.sort((a, b) => a[1] - b[1]);
  for (const [x, y, s] of coins) body += coin(x, y, s);
  // Skattkista på toppen
  body += `<g transform='translate(800 560)'><circle cy='-20' r='230' fill='url(#g)'/>`;
  body += `<path d='M-150 0 L-138 -120 Q0 -165 138 -120 L150 0Z' fill='url(#wood)' stroke='#3b1d08' stroke-width='6'/><path d='M-126 -10 L-117 -106 Q0 -142 117 -106 L126 -10Z' fill='#3b1d08'/>`;
  body += `<path d='M-150 6 Q-90 -64 -10 -44 Q70 -80 150 6Z' fill='url(#coin)'/>`;
  for (const [gx, gy, c] of [[-70, -30, "#ef4444"], [10, -52, "#38bdf8"], [80, -26, "#22c55e"], [-20, -20, "#a855f7"]] as const) {
    body += `<path d='M${gx} ${gy - 16} L${gx + 13} ${gy} L${gx} ${gy + 16} L${gx - 13} ${gy}Z' fill='${c}' stroke='#ffffff' stroke-width='2' stroke-opacity='0.6'/>`;
  }
  body += `<rect x='-150' y='0' width='300' height='150' rx='12' fill='url(#wood)' stroke='#3b1d08' stroke-width='6'/>`;
  body += `<rect x='-150' y='22' width='300' height='18' fill='#e0a82e'/><rect x='-150' y='108' width='300' height='18' fill='#e0a82e'/>`;
  body += `<rect x='-20' y='40' width='40' height='48' rx='7' fill='#fbbf24' stroke='#92400e' stroke-width='4'/><circle cy='58' r='6' fill='#78350f'/><rect x='-3' y='60' width='6' height='16' fill='#78350f'/></g>`;
  // Glitter som tänds och släcks
  for (let i = 0; i < 26; i++) {
    const x = between(r, 60, W - 60), y = between(r, 150, 950), s = between(r, 8, 20);
    const dur = n1(between(r, 1.8, 3.6)), begin = n1(between(r, 0, 3));
    const blink = still ? "" : `<animate attributeName='opacity' values='0.15;1;0.15' dur='${dur}s' begin='${begin}s' repeatCount='indefinite'/>`;
    body += `<g opacity='0.9'>${sparkle(x, y, s, pick(r, ["#fffbe6", "#fde68a", "#ffffff"]))}${blink}</g>`;
  }
  return scene(body);
}

function rymdskjutare(): ThemeArt {
  const r = seeded(82);
  let body = `<defs>${linGrad("s", ["#05030f", "#0d0a2a", "#1b1250"])}${linGrad("pl", ["#fda4af", "#e879f9", "#7c3aed"])}${glowGrad("n", "#7c3aed", 0.35)}</defs>${sky("s")}`;
  body += `<circle cx='300' cy='700' r='420' fill='url(#n)'/>`;
  body += starField(r, 200, 0, 0, W, H, ["#ffffff", "#c7d2fe", "#fde68a"], 0.7, 2.2);
  // Planet med ring
  body += `<circle cx='1400' cy='520' r='80' fill='url(#pl)'/><ellipse cx='1400' cy='520' rx='145' ry='29' fill='none' stroke='#fbcfe8' stroke-width='9' opacity='0.8' transform='rotate(-16 1400 520)'/>`;
  const crab = ["..#.....#..", "...#...#...", "..#######..", ".##.###.##.", "###########", "#.#######.#", "#.#.....#.#", "...##.##..."];
  const octo = ["....####....", ".##########.", "############", "###..##..###", "############", "...##..##...", "..##.##.##..", "##........##"];
  const squid = ["...##...", "..####..", ".######.", "##.##.##", "########", "..#..#..", ".#.##.#.", "#.#..#.#"];
  const rows: [string[], string, number][] = [[squid, "#f472b6", 150], [crab, "#38bdf8", 250], [octo, "#4ade80", 350]];
  for (const [map, col, y] of rows) {
    for (let i = 0; i < 7; i++) {
      const w = map[0].length * 8;
      body += pixels(map, 380 + i * 140 - w / 2, y, 8, col);
    }
  }
  // Skyddsbunkrar
  const bunker = ["..########..", ".##########.", "############", "############", "####....####", "###......###"];
  for (const x of [260, 600, 940, 1280]) body += pixels(bunker, x, 700, 8, "#22c55e");
  // Spelarens skepp och skott
  const ship = [".....#.....", "....###....", "....###....", ".#########.", "###########", "###########"];
  body += pixels(ship, 800 - 50, 830, 9, "#22d3ee");
  body += `<rect x='797' y='560' width='6' height='36' fill='#fef08a'/><rect x='797' y='470' width='6' height='36' fill='#fef08a' opacity='0.7'/>`;
  body += `<path d='M520 430 l8 10 l-8 10 l8 10 l-8 10' stroke='#fb7185' stroke-width='5' fill='none'/><path d='M1100 520 l8 10 l-8 10 l8 10 l-8 10' stroke='#fb7185' stroke-width='5' fill='none'/>`;
  // Explosion där ett skott träffat
  const boom = ["#...#...#", ".#..#..#.", "..#...#..", "##.....##", "..#...#..", ".#..#..#.", "#...#...#"];
  body += pixels(boom, 1040, 330, 8, "#fde047");
  body += `<rect y='912' width='${W}' height='6' fill='#22c55e'/>`;
  body += `<text x='60' y='80' font-family='Courier New,monospace' font-weight='bold' font-size='40' fill='#ffffff'>SCORE 004200</text><text x='1540' y='80' text-anchor='end' font-family='Courier New,monospace' font-weight='bold' font-size='40' fill='#ffffff'>HI 009999</text>`;
  for (let i = 0; i < 3; i++) body += pixels(ship, 60 + i * 110, 950, 5, "#22d3ee");
  return scene(body);
}

function klossregn(): ThemeArt {
  const T = 360, B = 30;
  const block = (x: number, y: number, c: string) =>
    `<rect x='${x}' y='${y}' width='${B}' height='${B}' fill='${c}'/><path d='M${x} ${y} h${B} l-6 6 h-${B - 12} v${B - 12} l-6 6Z' fill='#ffffff' opacity='0.4'/><path d='M${x + B} ${y + B} h-${B} l6 -6 h${B - 12} v-${B - 12} l6 -6Z' fill='#000000' opacity='0.28'/><rect x='${x + 0.5}' y='${y + 0.5}' width='${B - 1}' height='${B - 1}' fill='none' stroke='#0b1026' stroke-width='1'/>`;
  const pieces: [number[][], string][] = [
    [[[1, 1], [2, 1], [3, 1], [4, 1]], "#22d3ee"],
    [[[8, 0], [9, 0], [8, 1], [9, 1]], "#facc15"],
    [[[5, 4], [6, 4], [7, 4], [6, 5]], "#a855f7"],
    [[[2, 7], [3, 7], [1, 8], [2, 8]], "#4ade80"],
    [[[8, 8], [9, 8], [9, 9], [10, 9]], "#f87171"],
    [[[10, 3], [10, 4], [10, 5], [11, 5]], "#fb923c"],
    [[[5, 9], [5, 10], [5, 11], [4, 11]], "#60a5fa"],
  ];
  let body = "";
  for (let i = 0; i <= T; i += B) body += `<path d='M${i} 0 V${T} M0 ${i} H${T}' stroke='#ffffff' stroke-width='1' opacity='0.06'/>`;
  for (const [cells, c] of pieces) for (const [cx, cy] of cells) body += block(cx * B, cy * B, c);
  return pattern({ body, w: T, h: T }, "linear-gradient(180deg, #111a44, #0a0f2c)", 0.45);
}

function kattansikte(x: number, y: number, s: number, fur: string, eye = "#1f2937", line = "#1f2937", extra = ""): string {
  return `<g transform='translate(${n1(x)} ${n1(y)}) scale(${s})'>`
    + `<path d='M-40 -16 L-46 -62 L-8 -34Z M40 -16 L46 -62 L8 -34Z' fill='${fur}'/>`
    + `<path d='M-35 -26 L-39 -51 L-17 -34Z M35 -26 L39 -51 L17 -34Z' fill='#fda4af'/>`
    + `<ellipse rx='50' ry='40' fill='${fur}'/>${extra}`
    + `<ellipse cx='-18' cy='-4' rx='7' ry='9' fill='${eye}'/><ellipse cx='18' cy='-4' rx='7' ry='9' fill='${eye}'/>`
    + `<circle cx='-16' cy='-7' r='2.6' fill='#ffffff'/><circle cx='20' cy='-7' r='2.6' fill='#ffffff'/>`
    + `<path d='M-6 8 L6 8 L0 14Z' fill='#f472b6'/>`
    + `<path d='M0 14 q-6 8 -12 2 M0 14 q6 8 12 2 M-24 10 L-52 4 M-24 15 L-50 18 M24 10 L52 4 M24 15 L50 18' stroke='${line}' stroke-width='2.4' fill='none' stroke-linecap='round'/>`
    + `<ellipse cx='-30' cy='12' rx='8' ry='5' fill='#fb7185' opacity='0.45'/><ellipse cx='30' cy='12' rx='8' ry='5' fill='#fb7185' opacity='0.45'/></g>`;
}

function katter(): ThemeArt {
  const T = 320;
  let body = "";
  const tabby = `<path d='M-8 -38 L-4 -24 M8 -38 L4 -24 M0 -40 L0 -26' stroke='#c2410c' stroke-width='5' stroke-linecap='round'/>`;
  const patch = `<path d='M4 -39 C30 -40 48 -24 49 -6 C34 -8 18 -20 4 -39Z' fill='#f97316'/>`;
  const cats: [number, number, string, string, string, string][] = [
    [70, 70, "#fb923c", "#1f2937", "#1f2937", tabby],
    [240, 110, "#9ca3af", "#1f2937", "#1f2937", ""],
    [140, 230, "#374151", "#facc15", "#e5e7eb", ""],
    [290, 280, "#f8fafc", "#1f2937", "#94a3b8", patch],
  ];
  for (const [x, y, fur, eye, line, extra] of cats) body += wrap(x, y, 70, T, T, (a, b) => kattansikte(a, b, 0.72, fur, eye, line, extra));
  // Garnnystan och tassar mellan katterna
  const yarn = (x: number, y: number, c: string, d: string) =>
    `<circle cx='${x}' cy='${y}' r='20' fill='${c}'/><path d='M${x - 16} ${y - 8} Q${x} ${y + 4} ${x + 14} ${y - 12} M${x - 18} ${y + 4} Q${x} ${y + 16} ${x + 18} ${y + 2} M${x - 6} ${y - 19} Q${x + 8} ${y} ${x - 2} ${y + 19}' stroke='${d}' stroke-width='3' fill='none'/><path d='M${x + 18} ${y + 8} q20 14 6 26 q-12 10 4 22' stroke='${c}' stroke-width='3' fill='none' stroke-linecap='round'/>`;
  body += wrap(190, 30, 60, T, T, (a, b) => yarn(a, b, "#f472b6", "#be185d"));
  body += wrap(40, 170, 60, T, T, (a, b) => yarn(a, b, "#60a5fa", "#1d4ed8"));
  body += wrap(260, 200, 30, T, T, (a, b) => tass(a, b, 0.5, 30, "#c4b5fd"));
  body += wrap(40, 280, 30, T, T, (a, b) => tass(a, b, 0.45, -20, "#c4b5fd"));
  body += wrap(170, 150, 14, T, T, (a, b) => heart(a, b, 9, "#f9a8d4"));
  return pattern({ body, w: T, h: T }, "linear-gradient(160deg, #fdf2ff, #efe4ff)", 0.45);
}

function nattuggla(): ThemeArt {
  const r = seeded(84);
  let body = `<defs>${linGrad("s", ["#0a0f2e", "#17215c", "#2c3b88"])}${glowGrad("m", "#fff7cc", 0.55)}</defs>${sky("s")}`;
  body += starField(r, 160, 0, 0, W, 700, ["#ffffff", "#fde68a", "#c7d2fe"], 0.6, 2);
  for (let i = 0; i < 10; i++) body += sparkle(between(r, 0, W), between(r, 0, 520), between(r, 5, 11), "#ffffff", "opacity='0.85'");
  body += `<circle cx='1120' cy='330' r='420' fill='url(#m)'/><circle cx='1120' cy='330' r='190' fill='#fdf6d0'/><circle cx='1060' cy='280' r='34' fill='#efe3a6' opacity='0.7'/><circle cx='1180' cy='390' r='24' fill='#efe3a6' opacity='0.7'/><circle cx='1170' cy='250' r='15' fill='#efe3a6' opacity='0.7'/>`;
  body += hills(r, 800, 40, 5, "#141c47");
  let trees = "";
  for (let x = -30; x < W + 40; x += between(r, 40, 80)) trees += pine(x, 880 + between(r, -15, 15), between(r, 140, 260), "#0b1030");
  body += trees + hills(r, 950, 20, 4, "#080c24");
  // Gren tvärs över bilden
  body += `<path d='M-30 600 C300 580 600 640 900 620 C1020 612 1120 596 1210 570 L1216 588 C1120 616 1010 640 900 652 C600 676 300 646 -30 660Z' fill='#3b2414'/>`;
  body += `<path d='M420 610 C460 560 480 540 520 520 M1000 612 C1040 650 1070 670 1110 684' stroke='#3b2414' stroke-width='10' fill='none' stroke-linecap='round'/>`;
  for (const [lx, ly, rot] of [[510, 518, -30], [535, 530, 20], [1110, 686, 40], [1090, 700, -20], [200, 610, -40], [240, 598, 30]] as const) {
    body += `<ellipse cx='${lx}' cy='${ly}' rx='22' ry='9' fill='#2f5d3a' transform='rotate(${rot} ${lx} ${ly})'/>`;
  }
  // Ugglan
  body += `<g transform='translate(330 612) scale(1.5)'>`;
  body += `<path d='M-70 -170 L-86 -226 L-40 -186Z M70 -170 L86 -226 L40 -186Z' fill='#8b5a2b'/>`;
  body += `<path d='M0 -192 C72 -192 92 -130 90 -70 C88 -20 60 0 0 0 C-60 0 -88 -20 -90 -70 C-92 -130 -72 -192 0 -192Z' fill='#8b5a2b'/>`;
  body += `<path d='M-88 -112 C-114 -62 -98 -20 -58 -6 C-70 -40 -72 -80 -88 -112Z M88 -112 C114 -62 98 -20 58 -6 C70 -40 72 -80 88 -112Z' fill='#6b4220'/>`;
  body += `<ellipse cx='0' cy='-60' rx='52' ry='56' fill='#ecd0a4'/>`;
  for (const [vx, vy] of [[-22, -84], [4, -90], [28, -80], [-30, -56], [-6, -60], [20, -52], [-16, -30], [10, -28]]) {
    body += `<path d='M${vx - 6} ${vy} l6 7 l6 -7' stroke='#b0804e' stroke-width='3' fill='none' stroke-linecap='round'/>`;
  }
  body += `<ellipse cx='-33' cy='-136' rx='37' ry='35' fill='#f5e4c6'/><ellipse cx='33' cy='-136' rx='37' ry='35' fill='#f5e4c6'/>`;
  body += `<circle cx='-33' cy='-136' r='24' fill='#fbbf24'/><circle cx='33' cy='-136' r='24' fill='#fbbf24'/><circle cx='-31' cy='-134' r='13' fill='#111827'/><circle cx='31' cy='-134' r='13' fill='#111827'/><circle cx='-27' cy='-140' r='5' fill='#ffffff'/><circle cx='35' cy='-140' r='5' fill='#ffffff'/>`;
  body += `<path d='M-68 -162 Q-34 -182 -4 -152 M68 -162 Q34 -182 4 -152' stroke='#5a3717' stroke-width='6' fill='none' stroke-linecap='round'/>`;
  body += `<path d='M-10 -116 L10 -116 L0 -94Z' fill='#f59e0b'/>`;
  body += `<path d='M-30 -4 l-9 10 M-30 -4 l0 12 M-30 -4 l9 10 M30 -4 l-9 10 M30 -4 l0 12 M30 -4 l9 10' stroke='#f59e0b' stroke-width='5' stroke-linecap='round'/></g>`;
  // Eldflugor
  for (let i = 0; i < 16; i++) {
    const x = between(r, 0, W), y = between(r, 650, 950);
    body += `<circle cx='${n1(x)}' cy='${n1(y)}' r='12' fill='#fef08a' opacity='0.18'/><circle cx='${n1(x)}' cy='${n1(y)}' r='3.5' fill='#fef9c3'/>`;
  }
  return scene(body);
}

function dinodal(): ThemeArt {
  const r = seeded(85);
  let body = `<defs>${linGrad("s", ["#ffd9a0", "#ffc08a", "#f79b7e", "#f6c2a0"])}${glowGrad("sun", "#fff3c4", 0.9)}${linGrad("v", ["#7c4a3a", "#4a2a22"])}</defs>${sky("s")}`;
  body += `<circle cx='360' cy='260' r='280' fill='url(#sun)'/><circle cx='360' cy='260' r='90' fill='#fff1c2'/>`;
  // Vulkan med rök
  for (let i = 0; i < 6; i++) body += `<path d='${blob(r, 1180 + between(r, -60, 60) + i * 14, 250 - i * 45, between(r, 50, 85))}' fill='#9a8a8a' opacity='${n1(0.55 - i * 0.06)}'/>`;
  body += `<path d='M860 640 L1100 300 Q1180 280 1260 300 L1500 640Z' fill='url(#v)'/><path d='M1100 300 Q1180 280 1260 300 L1240 330 Q1180 318 1120 330Z' fill='#ff7a2a'/>`;
  body += `<path d='M1150 318 C1140 380 1170 420 1150 480' stroke='#ff8a3a' stroke-width='12' fill='none' stroke-linecap='round' opacity='0.85'/>`;
  body += hills(r, 620, 40, 5, "#b9a0c9") + hills(r, 690, 35, 5, "#8fbf6a");
  // Flygödlor
  for (const [px, py, s] of [[700, 200, 1], [860, 150, 0.7], [560, 330, 0.55]] as const) {
    body += `<path d='M${px} ${py} q${-40 * s} ${-30 * s} ${-90 * s} ${-10 * s} q${40 * s} ${4 * s} ${70 * s} ${24 * s} q${10 * s} ${-2 * s} ${20 * s} 0 q${30 * s} ${-20 * s} ${70 * s} ${-26 * s} q${-50 * s} ${-18 * s} ${-80 * s} ${12 * s}Z' fill='#6d3b5c'/>`;
  }
  // Långhalsad dinosaurie
  body += `<g transform='translate(1020 800) scale(1.25)'>`;
  body += `<path d='M130 -130 C230 -122 300 -82 370 -16 C290 -60 220 -78 126 -82Z' fill='#4f8a3a'/>`;
  body += `<rect x='-112' y='-80' width='44' height='82' rx='14' fill='#467d33'/><rect x='80' y='-80' width='44' height='82' rx='14' fill='#467d33'/>`;
  body += `<path d='M-92 -150 C-150 -232 -176 -330 -158 -420 L-112 -424 C-120 -332 -100 -242 -26 -172Z' fill='#5b9a42'/>`;
  body += `<ellipse cx='0' cy='-124' rx='152' ry='82' fill='#5b9a42'/><ellipse cx='0' cy='-96' rx='120' ry='40' fill='#86c063'/>`;
  body += `<rect x='-60' y='-78' width='44' height='82' rx='14' fill='#5b9a42'/><rect x='24' y='-78' width='44' height='82' rx='14' fill='#5b9a42'/>`;
  body += `<ellipse cx='-150' cy='-432' rx='52' ry='28' fill='#5b9a42'/><circle cx='-166' cy='-442' r='6' fill='#1f2937'/><circle cx='-164' cy='-444' r='2' fill='#ffffff'/><path d='M-196 -420 q14 8 30 2' stroke='#1f2937' stroke-width='3' fill='none' stroke-linecap='round'/>`;
  for (const [sx, sy, sr] of [[-40, -170, 14], [10, -186, 11], [60, -168, 13], [100, -140, 9], [-90, -140, 10]]) body += `<circle cx='${sx}' cy='${sy}' r='${sr}' fill='#3f7a2c' opacity='0.7'/>`;
  body += `</g>`;
  // En liten dinosaurie bredvid
  body += `<g transform='translate(640 850) scale(-0.55 0.55)'><path d='M130 -130 C230 -122 300 -82 370 -16 C290 -60 220 -78 126 -82Z' fill='#3d8a8a'/><path d='M-92 -150 C-150 -232 -176 -330 -158 -420 L-112 -424 C-120 -332 -100 -242 -26 -172Z' fill='#4aa3a3'/><ellipse cx='0' cy='-124' rx='152' ry='82' fill='#4aa3a3'/><rect x='-100' y='-80' width='44' height='82' rx='14' fill='#4aa3a3'/><rect x='60' y='-80' width='44' height='82' rx='14' fill='#4aa3a3'/><ellipse cx='-150' cy='-432' rx='52' ry='28' fill='#4aa3a3'/><circle cx='-166' cy='-442' r='7' fill='#1f2937'/></g>`;
  body += hills(r, 860, 20, 5, "#6aa84f");
  // Ormbunkar i förgrunden
  const fern = (x: number, y: number, s: number, c: string) => {
    let f = "";
    for (let k = -3; k <= 3; k++) {
      const a = (k * 20 - 90) * Math.PI / 180;
      const ex = x + Math.cos(a) * 170 * s, ey = y + Math.sin(a) * 170 * s;
      f += `<path d='M${x} ${y} Q${n1((x + ex) / 2 + k * 14 * s)} ${n1((y + ey) / 2 - 30 * s)} ${n1(ex)} ${n1(ey)}' stroke='${c}' stroke-width='${n1(22 * s)}' fill='none' stroke-linecap='round'/>`;
    }
    return f;
  };
  body += fern(90, 1000, 1.3, "#2f6b2a") + fern(260, 1010, 0.9, "#3b7d33") + fern(1500, 1000, 1.4, "#2f6b2a") + fern(1340, 1010, 0.8, "#3b7d33");
  // Bo med ägg
  body += `<ellipse cx='420' cy='960' rx='110' ry='34' fill='#8b5a2b'/><ellipse cx='390' cy='930' rx='24' ry='32' fill='#fef3c7'/><ellipse cx='440' cy='926' rx='24' ry='34' fill='#fde68a'/><ellipse cx='416' cy='944' rx='22' ry='28' fill='#fef9e7'/><circle cx='436' cy='916' r='5' fill='#65a30d' opacity='0.6'/><circle cx='386' cy='924' r='4' fill='#65a30d' opacity='0.6'/><path d='M310 962 Q420 1000 530 962' stroke='#6b4220' stroke-width='10' fill='none'/>`;
  return scene(body);
}

function svavandeoar(still = false): ThemeArt {
  const r = seeded(86);
  let body = `<defs>${linGrad("s", ["#8ec9ff", "#bfe0ff", "#e8f2ff", "#fff0f6"])}${glowGrad("sun", "#fffbe6", 0.9)}${linGrad("rock", ["#b08968", "#7f5539", "#5a3a26"])}<linearGradient id='fall' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#e0f2fe' stop-opacity='0.95'/><stop offset='1' stop-color='#e0f2fe' stop-opacity='0'/></linearGradient></defs>${sky("s")}`;
  body += `<circle cx='1250' cy='180' r='260' fill='url(#sun)'/><circle cx='1250' cy='180' r='70' fill='#fffdf0'/>`;
  const drift = (dx: number, dur: number) => still ? "" : `<animateTransform attributeName='transform' type='translate' values='0 0;${dx} 0;0 0' dur='${dur}s' repeatCount='indefinite'/>`;
  body += `<g>${cloud(250, 150, 1, "#ffffff", "#e0ecff")}${cloud(900, 110, 0.8, "#ffffff", "#e0ecff")}${drift(60, 40)}</g>`;
  body += `<g>${cloud(620, 860, 2.2, "#ffffff", "#e8e0ff")}${cloud(120, 900, 2, "#ffffff", "#e8e0ff")}${cloud(1450, 880, 2.4, "#ffffff", "#e8e0ff")}${drift(-50, 36)}</g>`;
  const island = (x: number, y: number, w: number, h: number, falls: boolean, bob: number, dur: number, house = false) => {
    let s = "";
    if (falls) s += `<rect x='${n1(x + w * 0.18)}' y='${y}' width='18' height='${n1(h + 320)}' fill='url(#fall)'/>`;
    s += `<path d='M${x - w / 2} ${y} C${x - w / 2} ${n1(y + h * 0.4)} ${n1(x - w * 0.2)} ${n1(y + h * 0.7)} ${x} ${y + h} C${n1(x + w * 0.2)} ${n1(y + h * 0.7)} ${x + w / 2} ${n1(y + h * 0.4)} ${x + w / 2} ${y}Z' fill='url(#rock)'/>`;
    s += `<path d='M${n1(x - w * 0.3)} ${n1(y + h * 0.2)} l${n1(w * 0.1)} ${n1(h * 0.25)} M${n1(x + w * 0.1)} ${n1(y + h * 0.3)} l${n1(-w * 0.05)} ${n1(h * 0.3)}' stroke='#4a2f1f' stroke-width='4' opacity='0.5' fill='none'/>`;
    s += `<ellipse cx='${x}' cy='${y}' rx='${n1(w / 2 + 8)}' ry='22' fill='#3fae5c'/><ellipse cx='${x}' cy='${y - 6}' rx='${n1(w / 2)}' ry='16' fill='#6ee18a'/>`;
    const n = Math.max(1, Math.round(w / 110));
    for (let i = 0; i < n; i++) {
      const tx = x - w / 2 + (i + 0.5) * (w / n) + between(r, -12, 12), th = between(r, 40, 70) * (w / 300 + 0.4);
      s += `<rect x='${n1(tx - 5)}' y='${n1(y - th * 0.6)}' width='10' height='${n1(th * 0.6)}' fill='#7c4a2a'/><circle cx='${n1(tx)}' cy='${n1(y - th * 0.8)}' r='${n1(th * 0.42)}' fill='#2f9e55'/><circle cx='${n1(tx - th * 0.12)}' cy='${n1(y - th * 0.9)}' r='${n1(th * 0.2)}' fill='#5fd07d'/>`;
    }
    if (house) s += `<g transform='translate(${x + 40} ${y - 8})'><rect x='-40' y='-60' width='80' height='60' fill='#fef3c7'/><path d='M-52 -58 L0 -104 L52 -58Z' fill='#ef4444'/><rect x='-12' y='-34' width='24' height='34' fill='#92400e'/><rect x='18' y='-50' width='14' height='14' fill='#7dd3fc'/></g>`;
    const move = still ? "" : `<animateTransform attributeName='transform' type='translate' values='0 0;0 ${-bob};0 0' dur='${dur}s' repeatCount='indefinite'/>`;
    return `<g>${s}${move}</g>`;
  };
  body += island(300, 340, 250, 170, true, 12, 7) + island(1330, 330, 290, 200, true, 16, 9);
  body += island(1060, 700, 130, 90, false, 10, 6) + island(520, 760, 110, 70, false, 8, 5.5);
  body += island(800, 520, 470, 300, true, 14, 8, true);
  for (let i = 0; i < 5; i++) {
    const x = between(r, 150, 1450), y = between(r, 80, 300);
    body += `<path d='M${n1(x - 14)} ${n1(y)} q7 -8 14 0 q7 -8 14 0' fill='none' stroke='#475569' stroke-width='2.5' stroke-linecap='round'/>`;
  }
  return scene(body);
}

function kvallsvagen(): ThemeArt {
  const r = seeded(87);
  let body = `<defs>${linGrad("s", ["#2b2d7a", "#6b4fb3", "#d77fb0", "#ffb38a", "#ffe0a3"])}${glowGrad("sun", "#fff0b8", 0.85)}${linGrad("rd", ["#5a4a6e", "#2d2440"])}</defs>${sky("s")}`;
  body += starField(r, 40, 0, 0, W, 220, ["#ffffff", "#fde68a"], 0.6, 1.6);
  body += `<circle cx='1000' cy='640' r='420' fill='url(#sun)'/><circle cx='1000' cy='640' r='80' fill='#fff4cc'/>`;
  // Höga, solbelysta moln
  const lit = (x: number, y: number, s: number) => cloud(x, y, s, "#ffd3c4", "#b77ca8");
  body += lit(320, 330, 2.2) + lit(760, 250, 1.4) + lit(1320, 360, 2.6) + lit(1000, 440, 1.1);
  body += mountains(r, 680, 60, 150, 6, "#7a5a9e");
  body += hills(r, 700, 25, 5, "#4f3b73");
  // Fält och väg mot horisonten
  body += `<rect y='700' width='${W}' height='300' fill='#3b2b58'/>`;
  body += `<path d='M920 700 L1080 700 L1600 1000 L400 1000Z' fill='url(#rd)'/><path d='M1000 700 L1000 1000' stroke='#ffe3a3' stroke-width='6' stroke-dasharray='30 30' opacity='0.8'/>`;
  body += `<path d='M-20 1000 L-20 760 C200 740 500 740 900 720 L560 1000Z' fill='#2a1f40'/><path d='M1620 1000 L1620 750 C1400 740 1200 730 1100 720 L1500 1000Z' fill='#2a1f40'/>`;
  // Elstolpar och ledningar – typiskt för animefilmer
  const poles: [number, number, number][] = [[140, 1000, 1], [560, 790, 0.55], [800, 735, 0.3]];
  let wires = "";
  for (const [px, py, s] of poles) {
    const top = py - 620 * s;
    body += `<rect x='${n1(px - 8 * s)}' y='${n1(top)}' width='${n1(16 * s)}' height='${n1(620 * s)}' fill='#1a1230'/><rect x='${n1(px - 90 * s)}' y='${n1(top + 40 * s)}' width='${n1(180 * s)}' height='${n1(12 * s)}' fill='#1a1230'/><rect x='${n1(px - 70 * s)}' y='${n1(top + 100 * s)}' width='${n1(140 * s)}' height='${n1(10 * s)}' fill='#1a1230'/>`;
  }
  for (const off of [-80, -40, 40, 80]) {
    const a = poles.map(([px, py, s]) => [px + off * s * 1.05, py - 620 * s + (Math.abs(off) > 60 ? 46 : 104) * s] as [number, number]);
    wires += `<path d='M-20 ${n1(a[0][1] - 20)} Q${n1((a[0][0] - 20) / 2)} ${n1(a[0][1] + 40)} ${n1(a[0][0])} ${n1(a[0][1])} Q${n1((a[0][0] + a[1][0]) / 2)} ${n1(Math.max(a[0][1], a[1][1]) + 50)} ${n1(a[1][0])} ${n1(a[1][1])} Q${n1((a[1][0] + a[2][0]) / 2)} ${n1(Math.max(a[1][1], a[2][1]) + 18)} ${n1(a[2][0])} ${n1(a[2][1])}' stroke='#1a1230' stroke-width='3' fill='none'/>`;
  }
  body += wires;
  // Järnvägsövergång vid vägkanten
  body += `<g transform='translate(1260 860)'><rect x='-6' y='-230' width='12' height='230' fill='#1a1230'/><path d='M-70 -210 L70 -170 M-70 -170 L70 -210' stroke='#f8fafc' stroke-width='16'/><path d='M-70 -210 L70 -170 M-70 -170 L70 -210' stroke='#1a1230' stroke-width='16' stroke-dasharray='20 20'/><rect x='-40' y='-140' width='80' height='40' rx='20' fill='#1a1230'/><circle cx='-20' cy='-120' r='13' fill='#ff4d4d'/><circle cx='20' cy='-120' r='13' fill='#4a1f1f'/><circle cx='-20' cy='-120' r='30' fill='#ff4d4d' opacity='0.25'/></g>`;
  for (let i = 0; i < 14; i++) {
    const x = between(r, 0, W), y = between(r, 760, 980);
    body += `<circle cx='${n1(x)}' cy='${n1(y)}' r='10' fill='#fef08a' opacity='0.18'/><circle cx='${n1(x)}' cy='${n1(y)}' r='3' fill='#fef9c3'/>`;
  }
  return scene(body);
}

function mattetavla(): ThemeArt {
  const T = 420;
  const chalk = "font-family='Comic Sans MS,Chalkboard SE,Segoe Print,Comic Neue,sans-serif' font-weight='bold'";
  const txt = (x: number, y: number, s: number, c: string, t: string, rot = 0) =>
    `<text x='${x}' y='${y}' font-size='${s}' fill='${c}' ${chalk} transform='rotate(${rot} ${x} ${y})'>${t}</text>`;
  let body = "";
  body += txt(20, 60, 34, "#f8fafc", "2 + 3 = 5", -4);
  body += txt(240, 90, 30, "#fde68a", "7 × 8 = 56", 3);
  body += txt(40, 200, 44, "#f9a8d4", "π", 0);
  body += txt(120, 180, 28, "#f8fafc", "√9 = 3", -2);
  body += txt(250, 230, 28, "#a5f3fc", "½ + ½ = 1", 2);
  body += txt(30, 330, 30, "#f8fafc", "a² + b² = c²", -3);
  body += txt(280, 380, 34, "#fde68a", "100 %", 4);
  body += txt(300, 160, 26, "#bbf7d0", "x = 4", 0);
  // Former ritade med krita
  body += `<g fill='none' stroke-linecap='round' stroke-linejoin='round'>`;
  body += `<path d='M180 400 L260 400 L180 290Z' stroke='#f8fafc' stroke-width='3.5' opacity='0.85'/><path d='M180 380 h20 v20' stroke='#f8fafc' stroke-width='2.5' opacity='0.85'/>`;
  body += `<circle cx='370' cy='290' r='34' stroke='#f9a8d4' stroke-width='3.5' opacity='0.85'/><path d='M370 290 L404 290' stroke='#f9a8d4' stroke-width='2.5' opacity='0.85'/><circle cx='370' cy='290' r='3' fill='#f9a8d4' stroke='none'/>`;
  body += `<path d='M20 250 h120' stroke='#a5f3fc' stroke-width='3' opacity='0.8'/>`;
  for (let i = 0; i <= 6; i++) body += `<path d='M${20 + i * 20} 244 v12' stroke='#a5f3fc' stroke-width='2.5' opacity='0.8'/>`;
  body += `</g>`;
  // Kritdamm
  const r = seeded(88);
  for (let i = 0; i < 40; i++) body += `<circle cx='${n1(r() * T)}' cy='${n1(r() * T)}' r='${n1(between(r, 0.8, 2.2))}' fill='#ffffff' opacity='${n1(between(r, 0.05, 0.2))}'/>`;
  return pattern({ body, w: T, h: T }, "radial-gradient(ellipse at 50% 40%, #2f6b52, #1d4636 70%, #16372a)", 0.45);
}

// ─── Register ─────────────────────────────────────────────────────────────────

const BUILDERS: Record<string, (still?: boolean) => ThemeArt> = {
  ko, norrsken, regnbagsvirvel,
  skog, hav, vinter, solnedgang, rymd, lava, galax, regnbage, stjarnhimmel, bubbelhav,
  prickigt, godis, rutmonster, kamouflage,
  zebra, tiger, leopard, giraff, hastar, pandaskog, pingviner, tassar, korallrev, savann, fjarilar,
  tvspel, dataspel, blockvarld, arkad, plattform,
  enhorning, drakberget, trollskog, trollkarl, kristallgrotta,
  riddarborg, vapenskold, tornerspel, kungasal,
  sakura, animehimmel, neonstad, actionlinjer, mangaraster, serierutor, kawaii,
  disco, dans, fotboll,
  guldskimmer, rymdskjutare, klossregn, katter, nattuggla, dinodal, svavandeoar, kvallsvagen, mattetavla,
};

const cache = new Map<string, ThemeArt>();

/**
 * Bilden för ett tema. `art` är namnet på ritfunktionen (se SHOP_THEMES i
 * shop.ts). `still` ger en bild utan rörelse, för elever som valt minskad
 * rörelse; bara de legendariska rör sig över huvud taget.
 */
export function getThemeArt(art: string | undefined, still = false): ThemeArt | undefined {
  if (!art) return undefined;
  const key = still ? `${art}:still` : art;
  const hit = cache.get(key);
  if (hit) return hit;
  const build = BUILDERS[art];
  if (!build) return undefined;
  const result = build(still);
  cache.set(key, result);
  return result;
}

export const THEME_ART_IDS = Object.keys(BUILDERS);
