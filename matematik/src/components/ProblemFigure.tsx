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

/** Rad med tal där de som uppfyller villkoret lyfts fram och övriga kryssas. */
function NumRow({ values, keep, y = 26, x0 = 8, w = 224 }:
  { values: number[]; keep: (n: number) => boolean; y?: number; x0?: number; w?: number }) {
  const n = values.length;
  const bw = Math.min(26, (w - (n - 1) * 3) / n);
  const gap = n > 1 ? (w - n * bw) / (n - 1) : 0;
  return (
    <>
      {values.map((v, i) => {
        const x = x0 + i * (bw + gap);
        const on = keep(v);
        return (
          <g key={v}>
            <rect x={x} y={y} width={bw} height={bw} rx={4}
              fill={on ? AF : '#f3f4f6'} stroke={on ? A : '#d1d5db'} strokeWidth={on ? 2 : 1.2} />
            <text x={x + bw / 2} y={y + bw / 2 + bw * 0.16} fontSize={bw * 0.44} textAnchor="middle"
              fill={on ? '#92400e' : '#9ca3af'} fontWeight={on ? 800 : 600} fontFamily="system-ui, sans-serif">{v}</text>
            {!on && (
              <line x1={x + 4} y1={y + 4} x2={x + bw - 4} y2={y + bw - 4}
                stroke="#ef4444" strokeWidth={2.2} strokeLinecap="round" />
            )}
          </g>
        );
      })}
    </>
  );
}

function Coin({ cx, cy, r, v }: { cx: number; cy: number; r: number; v: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fcd34d" stroke="#b45309" strokeWidth={2} />
      <text x={cx} y={cy + r * 0.34} fontSize={r * 0.82} textAnchor="middle"
        fill="#78350f" fontWeight={800} fontFamily="system-ui, sans-serif">{v}</text>
    </g>
  );
}

/** Myntvalörer + ett exempel på hur en summa kan betalas. */
function Mynt({ valors, example, sum }: { valors: number[]; example: number[]; sum: number }) {
  const r = 15;
  return (
    <svg viewBox="0 0 240 118" className="w-full h-auto" role="img"
      aria-label={`Mynt värda ${valors.join(', ')} kronor`}>
      <Label x={120} y={14} size={9} fill={G} bold={false}>Du har dessa mynt</Label>
      {valors.map((v, i) => (
        <Coin key={v} cx={120 - ((valors.length - 1) * 38) / 2 + i * 38} cy={38} r={r} v={v} />
      ))}
      <line x1={20} y1={62} x2={220} y2={62} stroke="#e5e7eb" strokeWidth={1.5} />
      <Label x={120} y={76} size={9} fill={G} bold={false}>Ett sätt att betala {sum} kr</Label>
      {example.map((v, i) => (
        <Coin key={i} cx={120 - ((example.length - 1) * 30) / 2 + i * 30} cy={98} r={12} v={v} />
      ))}
    </svg>
  );
}

/** 12 föremål ordnade på två sätt – visar delbarhet med både 2 och 3. */
function DelaLika() {
  const dot = (x: number, y: number, k: string) => <circle key={k} cx={x} cy={y} r={5} fill={VF} stroke={V} strokeWidth={1.5} />;
  const left: React.ReactNode[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) left.push(dot(22 + c * 14, 34 + r * 16, `l${r}${c}`));
  const right: React.ReactNode[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) right.push(dot(150 + c * 14, 26 + r * 16, `r${r}${c}`));
  return (
    <svg viewBox="0 0 240 90" className="w-full h-auto" role="img"
      aria-label="Tolv kakor ordnade som två rader med sex och som tre rader med fyra">
      {left}
      <Label x={57} y={78}>12 = 2 × 6</Label>
      <line x1={122} y1={20} x2={122} y2={68} stroke="#e5e7eb" strokeWidth={1.5} />
      {right}
      <Label x={178} y={78}>12 = 3 × 4</Label>
      <Label x={120} y={12} size={9} fill={G} bold={false}>12 går att dela lika på både 2 och 3</Label>
    </svg>
  );
}

/** Tallinje med hopp av samma storlek – visar rest-mönstret. */
function Hoppserie({ from, to, start, step, unitLabel }:
  { from: number; to: number; start: number; step: number; unitLabel: string }) {
  const x0 = 16, x1 = 224, y = 62;
  const px = (v: number) => x0 + ((v - from) / (to - from)) * (x1 - x0);
  const marks: number[] = [];
  for (let v = start; v <= to; v += step) marks.push(v);
  return (
    <svg viewBox="0 0 240 92" className="w-full h-auto" role="img"
      aria-label={`Tallinje där talen ligger ${step} steg isär`}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={G} strokeWidth={1.5} />
      {marks.map((v, i) => (
        <g key={v}>
          {i > 0 && (
            <path d={`M${px(marks[i - 1])},${y - 5} Q${(px(marks[i - 1]) + px(v)) / 2},${y - 26} ${px(v)},${y - 5}`}
              fill="none" stroke={A} strokeWidth={1.8} />
          )}
          <circle cx={px(v)} cy={y} r={4} fill={A} stroke="#b45309" strokeWidth={1.4} />
          <text x={px(v)} y={y + 16} fontSize={9} textAnchor="middle" fill={T} fontWeight={800}
            fontFamily="system-ui, sans-serif">{v}</text>
        </g>
      ))}
      <Label x={120} y={16} size={10} fill={A}>+{step} varje gång</Label>
      <Label x={120} y={86} size={9} fill={G} bold={false}>{unitLabel}</Label>
    </svg>
  );
}

/** Fyra staplar som tillsammans blir 200 kr, med minsta tillåtna belopp markerat. */
function PengarStaplar() {
  const vals = [20, 40, 60, 80];
  const base = 82, scale = 0.62, bw = 26;
  return (
    <svg viewBox="0 0 240 108" className="w-full h-auto" role="img"
      aria-label="Fyra staplar med 20, 40, 60 och 80 kronor som tillsammans blir 200">
      <line x1={20} y1={base - 20 * scale} x2={220} y2={base - 20 * scale}
        stroke={A} strokeWidth={1.4} strokeDasharray="4 3" />
      <Label x={222} y={base - 20 * scale - 3} size={8} anchor="end" fill={A} bold={false}>minst 20 kr</Label>
      {vals.map((v, i) => {
        const x = 44 + i * 42;
        return (
          <g key={v}>
            <rect x={x} y={base - v * scale} width={bw} height={v * scale} rx={3}
              fill={VF} stroke={V} strokeWidth={1.6} />
            <text x={x + bw / 2} y={base - v * scale - 4} fontSize={9} textAnchor="middle"
              fill={T} fontWeight={800} fontFamily="system-ui, sans-serif">{v}</text>
          </g>
        );
      })}
      <line x1={20} y1={base} x2={220} y2={base} stroke={G} strokeWidth={1.5} />
      <Label x={120} y={100}>20 + 40 + 60 + 80 = 200 kr</Label>
    </svg>
  );
}

/** Två prisalternativ som liggande staplar. */
function BioJamfor() {
  const rows = [
    { label: 'Vanligt pris', kr: 2160, color: V, fill: VF },
    { label: 'Grupppris', kr: 1830, color: A, fill: AF },
  ];
  const x0 = 78, maxW = 108, maxKr = 2160;
  return (
    <svg viewBox="0 0 240 88" className="w-full h-auto" role="img"
      aria-label="Vanligt pris 2160 kronor jämfört med grupppris 1830 kronor">
      {rows.map((r, i) => {
        const y = 22 + i * 30;
        const w = (r.kr / maxKr) * maxW;
        return (
          <g key={r.label}>
            <text x={x0 - 6} y={y + 13} fontSize={9} textAnchor="end" fill={T} fontWeight={700}
              fontFamily="system-ui, sans-serif">{r.label}</text>
            <rect x={x0} y={y} width={w} height={18} rx={4} fill={r.fill} stroke={r.color} strokeWidth={1.8} />
            <text x={x0 + w + 5} y={y + 13} fontSize={10} fill={r.color} fontWeight={800}
              fontFamily="system-ui, sans-serif">{r.kr} kr</text>
          </g>
        );
      })}
      <Label x={120} y={82} size={9} fill={G} bold={false}>Grupppriset sparar 330 kr</Label>
    </svg>
  );
}

/** Sifferbrickor och ett uttryck som blir 100. */
function Siffror100() {
  return (
    <svg viewBox="0 0 240 96" className="w-full h-auto" role="img"
      aria-label="Sifferbrickorna 1 till 6 och uttrycket 2 plus 3 gånger 4 gånger 5 lika med 100">
      {[1, 2, 3, 4, 5, 6].map((d, i) => (
        <g key={d}>
          <rect x={30 + i * 30} y={20} width={24} height={26} rx={4} fill={VF} stroke={V} strokeWidth={1.8} />
          <text x={42 + i * 30} y={38} fontSize={14} textAnchor="middle" fill={T} fontWeight={800}
            fontFamily="system-ui, sans-serif">{d}</text>
        </g>
      ))}
      <Label x={120} y={14} size={9} fill={G} bold={false}>Varje siffra får användas högst en gång</Label>
      <Label x={120} y={70} size={13}>(2 + 3) × 4 × 5 = 100</Label>
      <Label x={120} y={88} size={9} fill={G} bold={false}>ett av flera möjliga uttryck</Label>
    </svg>
  );
}

/** Extremvärdets effekt: medelvärdet dras iväg men medianen står still. */
function MedelMedian() {
  const x0 = 18, x1 = 214, y = 54;
  const px = (v: number) => x0 + (v / 100) * (x1 - x0);
  return (
    <svg viewBox="0 0 240 104" className="w-full h-auto" role="img"
      aria-label="Värdena 2, 4, 6, 8 och 100 på en tallinje med median 6 och medelvärde 24">
      <Label x={120} y={13} size={9} fill={G} bold={false}>Värdena 2, 4, 6, 8 och 100</Label>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={G} strokeWidth={1.5} />
      {[2, 4, 6, 8, 100].map(v => (
        <circle key={v} cx={px(v)} cy={y} r={4.5} fill={V} stroke="#4c1d95" strokeWidth={1.2} />
      ))}
      {/* median */}
      <line x1={px(6)} y1={y - 16} x2={px(6)} y2={y + 4} stroke="#10b981" strokeWidth={2.5} />
      <Label x={px(6)} y={y - 20} size={9} fill="#059669">median 6</Label>
      {/* medelvärde */}
      <line x1={px(24)} y1={y - 4} x2={px(24)} y2={y + 18} stroke="#ef4444" strokeWidth={2.5} />
      <Label x={px(24) + 30} y={y + 28} size={9} fill="#dc2626">medelvärde 24</Label>
      <Label x={px(100)} y={y + 16} size={9} fill={G} bold={false}>100</Label>
      <Label x={120} y={98} size={9} fill={G} bold={false}>Ett extremvärde drar medelvärdet – inte medianen</Label>
    </svg>
  );
}

/** Linjär tillväxt jämförd med exponentiell. */
function LinjartExp() {
  const ox = 26, oy = 96, w = 196, h = 78;
  const T_MAX = 7, Y_MAX = 1300;
  const px = (t: number) => ox + (t / T_MAX) * w;
  const py = (v: number) => oy - (v / Y_MAX) * h;
  const a = Array.from({ length: T_MAX + 1 }, (_, t) => `${px(t)},${py(100 + 50 * t)}`).join(' ');
  const bpts = Array.from({ length: T_MAX + 1 }, (_, t) => `${px(t)},${py(10 * 2 ** t)}`).join(' ');
  return (
    <svg viewBox="0 0 240 118" className="w-full h-auto" role="img"
      aria-label="Linjär tillväxt jämförd med exponentiell tillväxt som går om efter sex dagar">
      <line x1={ox} y1={oy} x2={ox + w} y2={oy} stroke={G} strokeWidth={1.5} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - h} stroke={G} strokeWidth={1.5} />
      <polyline points={a} fill="none" stroke={A} strokeWidth={2.5} />
      <polyline points={bpts} fill="none" stroke={V} strokeWidth={2.5} />
      <circle cx={px(6)} cy={py(640)} r={4} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
      <Label x={px(6) - 6} y={py(640) - 8} size={9} anchor="end" fill="#059669">dag 6</Label>
      <Label x={px(7) + 3} y={py(450) + 4} size={9} anchor="start" fill={A}>A</Label>
      <Label x={px(6.3)} y={py(1280) + 2} size={9} anchor="start" fill={V}>B</Label>
      <Label x={120} y={14} size={9} fill={G} bold={false}>A växer lika mycket varje dag, B fördubblas</Label>
      <Label x={ox + w / 2} y={114} size={9} fill={G} bold={false}>B går om A efter 6 dagar</Label>
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

  // Tal som uppfyller ett villkor lyfts fram, övriga kryssas över.
  'jamna-over-10': (
    <svg viewBox="0 0 240 66" className="w-full h-auto" role="img"
      aria-label="Talen 11 till 20 där de jämna talen över 10 är markerade">
      <Label x={120} y={14} size={9} fill={G} bold={false}>Jämna tal mellan 11 och 20</Label>
      <NumRow values={[11, 12, 13, 14, 15, 16, 17, 18, 19, 20]} keep={n => n % 2 === 0} y={22} />
      <Label x={120} y={62} size={9} fill={A}>5 tal passar</Label>
    </svg>
  ),
  'multiplar-3-inte-6': (
    <svg viewBox="0 0 240 66" className="w-full h-auto" role="img"
      aria-label="Multiplerna av tre där de som också är delbara med sex är överkryssade">
      <Label x={120} y={14} size={9} fill={G} bold={false}>3:ans tabell – de delbara med 6 faller bort</Label>
      <NumRow values={[3, 6, 9, 12, 15, 18, 21, 24, 27, 30]} keep={n => n % 6 !== 0} y={22} />
      <Label x={120} y={62} size={9} fill={A}>varannan blir kvar – de udda</Label>
    </svg>
  ),
  'fyror-inte-attor': (
    <svg viewBox="0 0 240 66" className="w-full h-auto" role="img"
      aria-label="Multiplerna av fyra där de som också är delbara med åtta är överkryssade">
      <Label x={120} y={14} size={9} fill={G} bold={false}>4:ans tabell – de delbara med 8 faller bort</Label>
      <NumRow values={[24, 28, 32, 36, 40, 44, 48, 52, 56, 60]} keep={n => n % 8 !== 0} y={22} />
      <Label x={120} y={62} size={9} fill={A}>de kvarvarande ligger 8 steg isär</Label>
    </svg>
  ),
  'mynt-1-2-5': <Mynt valors={[1, 2, 5]} example={[5, 2, 2, 1]} sum={10} />,
  'mynt-1-2-5-10': <Mynt valors={[1, 2, 5, 10]} example={[10, 5, 2, 2, 1]} sum={20} />,
  'dela-lika-12': <DelaLika />,
  'godis-hopp': <Hoppserie from={46} to={74} start={50} step={4} unitLabel="… och så vidare upp till 98" />,
  'pengar-staplar': <PengarStaplar />,
  'bio-jamfor': <BioJamfor />,
  'siffror-100': <Siffror100 />,
  'medel-median': <MedelMedian />,
  'linjart-exp': <LinjartExp />,
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
