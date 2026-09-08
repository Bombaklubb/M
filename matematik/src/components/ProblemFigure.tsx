import React from 'react';

// ─── Figurer till de rika problemen ─────────────────────────────────────────────
// Ritade som inline-SVG så att antal rutor, proportioner och mått blir EXAKTA –
// figurerna ska gå att räkna på, inte bara vara dekoration.

const V = '#7c3aed';   // violett kontur
const VF = '#ddd6fe';  // violett fyllning
const A = '#f59e0b';   // amber – markerar det som "sticker ut"
const AF = '#fde68a';
const T = '#4c1d95';   // textfärg
const G = '#6b7280';   // grå

type Anchor = React.SVGAttributes<SVGTextElement>['textAnchor'];

function Label({ x, y, children, size = 10, anchor = 'middle', fill = T, bold = true }:
  { x: number; y: number; children: React.ReactNode; size?: number; anchor?: Anchor; fill?: string; bold?: boolean }) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} fill={fill}
      fontWeight={bold ? 800 : 500} fontFamily="system-ui, sans-serif">{children}</text>
  );
}

/** Ruta i ett rutmönster. */
function Sq({ x, y, s = 16, fill = VF, stroke = V }:
  { x: number; y: number; s?: number; fill?: string; stroke?: string }) {
  return <rect x={x} y={y} width={s} height={s} rx={2} fill={fill} stroke={stroke} strokeWidth={1.5} />;
}

// ── Mönster: 3, 5, 7 kvadrater (2n + 1) ─────────────────────────────────────────
function MonsterKvadrater() {
  const cols = [1, 2, 3];
  const starts = [12, 78, 158];
  return (
    <svg viewBox="0 0 240 78" className="w-full h-auto" role="img"
      aria-label="Figur 1 har 3 kvadrater, figur 2 har 5 och figur 3 har 7">
      {cols.map((n, i) => {
        const x0 = starts[i];
        const parts: React.ReactNode[] = [];
        for (let c = 0; c < n; c++) {
          parts.push(<Sq key={`t${c}`} x={x0 + c * 17} y={16} />);
          parts.push(<Sq key={`b${c}`} x={x0 + c * 17} y={33} />);
        }
        // Den extra rutan – "+1" i formeln 2n + 1
        parts.push(<Sq key="x" x={x0 + n * 17} y={33} fill={AF} stroke={A} />);
        return (
          <g key={n}>
            {parts}
            <Label x={x0 + ((n + 1) * 17) / 2 - 1} y={64}>Figur {n}</Label>
            <Label x={x0 + ((n + 1) * 17) / 2 - 1} y={75} size={9} fill={G} bold={false}>
              {2 * n + 1} rutor
            </Label>
          </g>
        );
      })}
    </svg>
  );
}

// ── Mönster: stavar 4, 7, 10 (3n + 1) ───────────────────────────────────────────
function MonsterStavar() {
  const cfg = [{ n: 1, x: 14 }, { n: 2, x: 78 }, { n: 3, x: 158 }];
  const s = 22, y0 = 16;
  return (
    <svg viewBox="0 0 240 78" className="w-full h-auto" role="img"
      aria-label="Figur 1 har 4 stavar, figur 2 har 7 stavar, figur 3 har 10 stavar">
      {cfg.map(({ n, x }) => (
        <g key={n}>
          {/* vågräta stavar: 2 per kvadrat */}
          {Array.from({ length: n }, (_, i) => (
            <g key={`h${i}`}>
              <line x1={x + i * s} y1={y0} x2={x + (i + 1) * s} y2={y0} stroke={V} strokeWidth={3.5} strokeLinecap="round" />
              <line x1={x + i * s} y1={y0 + s} x2={x + (i + 1) * s} y2={y0 + s} stroke={V} strokeWidth={3.5} strokeLinecap="round" />
            </g>
          ))}
          {/* lodräta stavar: n + 1 stycken, den första är "+1" i formeln */}
          {Array.from({ length: n + 1 }, (_, i) => (
            <line key={`v${i}`} x1={x + i * s} y1={y0} x2={x + i * s} y2={y0 + s}
              stroke={i === 0 ? A : V} strokeWidth={3.5} strokeLinecap="round" />
          ))}
          <Label x={x + (n * s) / 2} y={64}>Figur {n}</Label>
          <Label x={x + (n * s) / 2} y={75} size={9} fill={G} bold={false}>{3 * n + 1} stavar</Label>
        </g>
      ))}
    </svg>
  );
}

/** Rektanglar med samma omkrets men olika area. */
function Rektanglar({ pairs, scale, unit }: { pairs: [number, number][]; scale: number; unit: string }) {
  // Varje rektangel får en egen kolumn som är minst lika bred som texten under,
  // annars krockar etiketterna när rektanglarna är smala.
  const COL = 72, GAP = 6;
  let x = 6;
  const items = pairs.map(([w, h]) => {
    const px = w * scale, py = h * scale;
    const item = { w, h, px, py, cx: x + COL / 2 };
    x += COL + GAP;
    return item;
  });
  const width = x;
  const baseY = 74;
  return (
    <svg viewBox={`0 0 ${width} 104`} className="w-full h-auto" role="img"
      aria-label={`Rektanglar med samma omkrets: ${pairs.map(p => `${p[0]} gånger ${p[1]}`).join(', ')}`}>
      {items.map(it => (
        <g key={`${it.w}x${it.h}`}>
          <rect x={it.cx - it.px / 2} y={baseY - it.py} width={it.px} height={it.py} rx={2}
            fill={it.w === it.h ? AF : VF} stroke={it.w === it.h ? A : V} strokeWidth={1.8} />
          <Label x={it.cx} y={88}>{it.w} × {it.h}</Label>
          <Label x={it.cx} y={99} size={9} fill={it.w === it.h ? A : G} bold={it.w === it.h}>
            area {it.w * it.h} {unit}²
          </Label>
        </g>
      ))}
    </svg>
  );
}

// ── Hage mot vägg (gymnasieoptimering) ──────────────────────────────────────────
function HageMotVagg() {
  const L = 34, R = 208, TOPY = 30, BOT = 92;
  return (
    <svg viewBox="0 0 240 122" className="w-full h-auto" role="img"
      aria-label="Rektangulär hage där ena långsidan är en vägg och tre sidor är staket">
      <Label x={121} y={14} size={10} fill={G}>Vägg – behöver inget staket</Label>
      {/* vägg med skraffering */}
      <line x1={L - 8} y1={TOPY} x2={R + 8} y2={TOPY} stroke={G} strokeWidth={5} strokeLinecap="round" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={L - 4 + i * 15} y1={TOPY - 3} x2={L - 10 + i * 15} y2={TOPY - 10}
          stroke={G} strokeWidth={1.5} strokeLinecap="round" />
      ))}
      {/* hagen */}
      <rect x={L} y={TOPY} width={R - L} height={BOT - TOPY} fill={VF} opacity={0.55} />
      {/* staketsidorna */}
      <line x1={L} y1={TOPY} x2={L} y2={BOT} stroke={A} strokeWidth={4} strokeLinecap="round" />
      <line x1={R} y1={TOPY} x2={R} y2={BOT} stroke={A} strokeWidth={4} strokeLinecap="round" />
      <line x1={L} y1={BOT} x2={R} y2={BOT} stroke={A} strokeWidth={4} strokeLinecap="round" />
      <Label x={L - 12} y={64} size={12}>x</Label>
      <Label x={R + 12} y={64} size={12}>x</Label>
      <Label x={121} y={108} size={12}>100 − 2x</Label>
    </svg>
  );
}

// ── 10 ägg i två bon ────────────────────────────────────────────────────────────
function AggTvaBon() {
  const nest = (cx: number, count: number, label: string) => {
    const eggs = Array.from({ length: count }, (_, i) => {
      const perRow = 4;
      const row = Math.floor(i / perRow);
      const inRow = i % perRow;
      const n = Math.min(perRow, count - row * perRow);
      return { x: cx - ((n - 1) * 13) / 2 + inRow * 13, y: 50 - row * 14 };
    });
    return (
      <g key={label}>
        <ellipse cx={cx} cy={62} rx={44} ry={14} fill="#d6bfa4" stroke="#8b5e34" strokeWidth={2} />
        {eggs.map((e, i) => (
          <ellipse key={i} cx={e.x} cy={e.y} rx={5} ry={6.5} fill="#fffbeb" stroke="#a16207" strokeWidth={1.3} />
        ))}
        <Label x={cx} y={88}>{label}</Label>
        <Label x={cx} y={99} size={9} fill={G} bold={false}>{count} ägg</Label>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 240 104" className="w-full h-auto" role="img"
      aria-label="Tio ägg delade i två bon: tre ägg i stora boet och sju i lilla boet">
      {nest(60, 3, 'Stora boet')}
      {nest(180, 7, 'Lilla boet')}
      <Label x={120} y={20} size={10} fill={G} bold={false}>Ett sätt: 3 + 7 = 10</Label>
    </svg>
  );
}

// ── Pizza delad i 8 bitar ───────────────────────────────────────────────────────
function Pizza() {
  const cx = 62, cy = 58, r = 42;
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const sector = (a1: number, a2: number) => {
    const [x1, y1] = pt(a1), [x2, y2] = pt(a2);
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z`;
  };
  return (
    <svg viewBox="0 0 240 112" className="w-full h-auto" role="img"
      aria-label="En pizza delad i åtta bitar där två bitar är markerade">
      <circle cx={cx} cy={cy} r={r} fill="#fde68a" stroke="#b45309" strokeWidth={2.5} />
      <path d={sector(0, 45)} fill="#fb923c" stroke="#b45309" strokeWidth={1.5} />
      <path d={sector(45, 90)} fill="#fb923c" stroke="#b45309" strokeWidth={1.5} />
      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = pt(i * 45);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#b45309" strokeWidth={1.5} />;
      })}
      <Label x={cx} y={108} size={9} fill={G} bold={false}>8 bitar</Label>
      <Label x={172} y={44} size={11}>2 av 8 bitar</Label>
      <Label x={172} y={60} size={11} fill="#b45309">2/8 = 1/4</Label>
      <Label x={172} y={78} size={9} fill={G} bold={false}>av pizzan</Label>
    </svg>
  );
}

// ── Pythagoras 3–4–5 ────────────────────────────────────────────────────────────
function Pythagoras() {
  const Ax = 34, Ay = 100, Bx = 114, By = 100, Cx = 34, Cy = 40;
  return (
    <svg viewBox="0 0 210 122" className="w-full h-auto" role="img"
      aria-label="Rätvinklig triangel med kateterna 3 och 4 och hypotenusan 5">
      <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill={VF} stroke={V} strokeWidth={2} />
      {/* rätvinkelmarkering */}
      <path d={`M${Ax},${Ay - 12} L${Ax + 12},${Ay - 12} L${Ax + 12},${Ay}`} fill="none" stroke={V} strokeWidth={1.5} />
      <Label x={(Ax + Bx) / 2} y={116} size={12}>4</Label>
      <Label x={Ax - 12} y={72} size={12}>3</Label>
      <Label x={82} y={64} size={12} fill={A}>5</Label>
      <Label x={168} y={60} size={10} fill={G} bold={false}>3² + 4²</Label>
      <Label x={168} y={74} size={10} fill={G} bold={false}>= 9 + 16 = 25</Label>
      <Label x={168} y={88} size={10} fill={T}>√25 = 5</Label>
    </svg>
  );
}

// ── Handskakningar: 4 personer → 6, 5 personer → 10 ─────────────────────────────
function Handskakningar() {
  const ring = (cx: number, n: number, start: number) => {
    const r = 33;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = ((start + (i * 360) / n) * Math.PI) / 180;
      return [cx + r * Math.cos(a), 52 + r * Math.sin(a)] as [number, number];
    });
    const lines: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        lines.push(<line key={`${i}-${j}`} x1={pts[i][0]} y1={pts[i][1]} x2={pts[j][0]} y2={pts[j][1]}
          stroke={V} strokeWidth={1.4} opacity={0.75} />);
      }
    }
    return (
      <g>
        {lines}
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5.5} fill={A} stroke="#b45309" strokeWidth={1.5} />)}
        <Label x={cx} y={100}>{n} personer</Label>
        <Label x={cx} y={112} size={9} fill={G} bold={false}>{(n * (n - 1)) / 2} handskakningar</Label>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 240 118" className="w-full h-auto" role="img"
      aria-label="Fyra personer ger sex handskakningar, fem personer ger tio">
      {ring(62, 4, -90)}
      {ring(178, 5, -90)}
    </svg>
  );
}

// ── Udda tal bygger kvadrattal: 1 + 3 + 5 + 7 = 16 ──────────────────────────────
function UddaKvadrat() {
  const s = 24, x0 = 62, y0 = 12;
  const colors = ['#c4b5fd', '#a78bfa', '#8b5cf6', '#6d28d9'];
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const layer = Math.max(r, c); // L-format lager
      cells.push(
        <rect key={`${r}-${c}`} x={x0 + c * s} y={y0 + r * s} width={s} height={s}
          fill={colors[layer]} stroke="#fff" strokeWidth={1.5} />
      );
    }
  }
  return (
    <svg viewBox="0 0 240 138" className="w-full h-auto" role="img"
      aria-label="En fyra gånger fyra kvadrat byggd av L-formade lager med 1, 3, 5 och 7 rutor">
      {cells}
      {[1, 3, 5, 7].map((n, i) => (
        <g key={n}>
          <rect x={14} y={16 + i * 20} width={11} height={11} rx={2} fill={colors[i]} />
          <Label x={31} y={25 + i * 20} size={10} anchor="start" fill={G} bold={false}>+{n}</Label>
        </g>
      ))}
      <Label x={120} y={128} size={11}>1 + 3 + 5 + 7 = 16 = 4²</Label>
    </svg>
  );
}

// ── Två abonnemang som räta linjer ──────────────────────────────────────────────
function Abonnemang() {
  const ox = 38, oy = 108, w = 176, h = 92;
  const sx = w / 40;        // 0–40 GB
  const sy = h / 1100;      // 0–1100 kr
  const px = (gb: number) => ox + gb * sx;
  const py = (kr: number) => oy - kr * sy;
  return (
    <svg viewBox="0 0 240 132" className="w-full h-auto" role="img"
      aria-label="Två räta linjer som korsar varandra vid 20 gigabyte och 600 kronor">
      {/* axlar */}
      <line x1={ox} y1={oy} x2={ox + w} y2={oy} stroke={G} strokeWidth={1.5} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - h} stroke={G} strokeWidth={1.5} />
      <Label x={ox + w} y={oy + 14} size={9} fill={G} bold={false} anchor="end">GB</Label>
      <Label x={ox - 6} y={oy - h + 4} size={9} fill={G} bold={false} anchor="end">kr</Label>
      {/* linjer */}
      <line x1={px(0)} y1={py(200)} x2={px(40)} y2={py(1000)} stroke={V} strokeWidth={2.5} />
      <line x1={px(0)} y1={py(500)} x2={px(40)} y2={py(700)} stroke={A} strokeWidth={2.5} />
      {/* skärningspunkt */}
      <line x1={px(20)} y1={py(600)} x2={px(20)} y2={oy} stroke={G} strokeWidth={1} strokeDasharray="3 3" />
      <circle cx={px(20)} cy={py(600)} r={4} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
      <Label x={px(20)} y={oy + 13} size={9} fill="#059669">20 GB</Label>
      <Label x={px(40) + 2} y={py(1000) + 4} size={10} anchor="start" fill={V}>A</Label>
      <Label x={px(40) + 2} y={py(700) + 4} size={10} anchor="start" fill={A}>B</Label>
      <Label x={ox + 4} y={py(200) - 5} size={8} anchor="start" fill={G} bold={false}>200</Label>
      <Label x={ox + 4} y={py(500) - 5} size={8} anchor="start" fill={G} bold={false}>500</Label>
    </svg>
  );
}

// ── Skala: längdskala 3 ger areaskala 9 ─────────────────────────────────────────
function Skala() {
  const s = 22;
  return (
    <svg viewBox="0 0 252 112" className="w-full h-auto" role="img"
      aria-label="En kvadrat förstorad tre gånger får nio gånger så stor area">
      <rect x={26} y={44} width={s} height={s} fill={AF} stroke={A} strokeWidth={2} />
      <Label x={26 + s / 2} y={82}>1 ruta</Label>
      <Label x={26 + s / 2} y={94} size={9} fill={G} bold={false}>sida 1</Label>
      <Label x={82} y={58} size={16} fill={G}>→</Label>
      <Label x={82} y={76} size={9} fill={G} bold={false}>×3</Label>
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => (
          <rect key={`${r}-${c}`} x={118 + c * s} y={22 + r * s} width={s} height={s}
            fill={VF} stroke={V} strokeWidth={1.5} />
        ))
      )}
      <Label x={118 + (3 * s) / 2} y={106}>9 rutor</Label>
      <Label x={118 + (3 * s) / 2} y={12} size={9} fill={G} bold={false}>sida 3</Label>
      <Label x={210} y={54} size={10} anchor="start" fill={T}>area</Label>
      <Label x={210} y={68} size={10} anchor="start" fill={A}>×9</Label>
    </svg>
  );
}

// ── Register ────────────────────────────────────────────────────────────────────
const FIGURES: Record<string, React.ReactNode> = {
  'monster-kvadrater': <MonsterKvadrater />,
  'monster-stavar': <MonsterStavar />,
  'rektangler-24': <Rektanglar pairs={[[1, 11], [4, 8], [6, 6]]} scale={5} unit="cm" />,
  'rektangler-20m': <Rektanglar pairs={[[1, 9], [3, 7], [5, 5]]} scale={5.5} unit="m" />,
  'rektangler-12m': <Rektanglar pairs={[[1, 5], [2, 4], [3, 3]]} scale={9} unit="m" />,
  'hage-mot-vagg': <HageMotVagg />,
  'agg-tva-bon': <AggTvaBon />,
  'pizza-8': <Pizza />,
  'pythagoras-345': <Pythagoras />,
  'handskakningar': <Handskakningar />,
  'udda-kvadrat': <UddaKvadrat />,
  'abonnemang': <Abonnemang />,
  'skala-area': <Skala />,
};

/**
 * `mini` ritar samma figur i mindre format – används bredvid varje delfråga så
 * att eleven slipper skrolla upp till problemtexten för att se figuren.
 * Eftersom figurerna är SVG blir de lika skarpa i litet format.
 */
export default function ProblemFigure({ name, variant = 'full' }:
  { name?: string; variant?: 'full' | 'mini' }) {
  if (!name) return null;
  const fig = FIGURES[name];
  if (!fig) return null;
  const mini = variant === 'mini';
  return (
    <div className={mini ? 'rounded-xl px-2 py-1.5' : 'rounded-2xl px-3 py-3 mt-3'}
      style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.20)' }}>
      {fig}
    </div>
  );
}
