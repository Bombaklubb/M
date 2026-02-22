import React, { useRef, useState } from 'react';

interface Props {
  hour: number;       // 1–12
  minute: number;     // 0, 5, 10, …, 55
  onChange: (hour: number, minute: number) => void;
  readOnly?: boolean;
  size?: number;
}

/**
 * Interactive SVG analog clock.
 * - Drag/click outer zone  (>40 % radius) → sets minute hand (snaps to 5 min)
 * - Drag/click inner zone  (≤40 % radius) → sets hour hand  (snaps to 1 h)
 */
export default function InteractiveClock({
  hour,
  minute,
  onChange,
  readOnly = false,
  size = 220,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const faceR = size / 2 - 10;

  // Convert clock angle (0 = 12 o'clock, clockwise) → SVG radians
  function toRad(angleDeg: number) {
    return ((angleDeg - 90) * Math.PI) / 180;
  }

  // Current hand angles
  const minuteDeg = (minute / 60) * 360;
  const hourDeg = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

  const minHandLen = faceR * 0.70;
  const hrHandLen  = faceR * 0.50;

  function handEnd(deg: number, len: number) {
    const r = toRad(deg);
    return { x: cx + Math.cos(r) * len, y: cy + Math.sin(r) * len };
  }

  const minEnd = handEnd(minuteDeg, minHandLen);
  const hrEnd  = handEnd(hourDeg,  hrHandLen);

  // ── Pointer helpers ────────────────────────────────────────────────────────

  function getClientXY(e: React.PointerEvent): { x: number; y: number } {
    return { x: e.clientX, y: e.clientY };
  }

  function getSVGPoint(clientX: number, clientY: number) {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  }

  function getAngle(clientX: number, clientY: number): number {
    const p = getSVGPoint(clientX, clientY);
    const dx = p.x - cx;
    const dy = p.y - cy;
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    if (deg >= 360) deg -= 360;
    return deg;
  }

  function getDist(clientX: number, clientY: number): number {
    const p = getSVGPoint(clientX, clientY);
    return Math.hypot(p.x - cx, p.y - cy);
  }

  function applyAngle(mode: 'hour' | 'minute', angle: number) {
    if (mode === 'minute') {
      const raw    = (angle / 360) * 60;
      const snapped = Math.round(raw / 5) * 5;
      const m = snapped >= 60 ? 0 : snapped;
      onChange(hour, m);
    } else {
      const raw = (angle / 360) * 12;
      const h   = Math.round(raw);
      onChange(h === 0 ? 12 : h > 12 ? h - 12 : h, minute);
    }
  }

  // ── Event handlers ─────────────────────────────────────────────────────────

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (readOnly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getClientXY(e);
    const dist = getDist(x, y);
    const mode: 'hour' | 'minute' = dist <= faceR * 0.42 ? 'hour' : 'minute';
    setDragging(mode);
    applyAngle(mode, getAngle(x, y));
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging || readOnly) return;
    const { x, y } = getClientXY(e);
    applyAngle(dragging, getAngle(x, y));
  };

  const handlePointerUp = () => setDragging(null);

  // ── Static elements ────────────────────────────────────────────────────────

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isHour = i % 5 === 0;
    const deg    = (i / 60) * 360;
    const r      = toRad(deg);
    const outerR = faceR;
    const innerR = isHour ? faceR * 0.83 : faceR * 0.91;
    return {
      x1: cx + Math.cos(r) * innerR, y1: cy + Math.sin(r) * innerR,
      x2: cx + Math.cos(r) * outerR, y2: cy + Math.sin(r) * outerR,
      isHour,
    };
  });

  const hourNums = Array.from({ length: 12 }, (_, i) => {
    const h   = i === 0 ? 12 : i;
    const deg = (i / 12) * 360;
    const r   = toRad(deg);
    const nr  = faceR * 0.72;
    return { h, x: cx + Math.cos(r) * nr, y: cy + Math.sin(r) * nr };
  });

  const fontSize = Math.max(10, Math.round(size * 0.08));

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        touchAction: 'none',
        cursor: readOnly ? 'default' : 'crosshair',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Drop shadow */}
      <circle cx={cx + 2} cy={cy + 2} r={faceR} fill="rgba(0,0,0,0.10)" />

      {/* Clock face */}
      <circle cx={cx} cy={cy} r={faceR} fill="white" stroke="#e5e7eb" strokeWidth={2.5} />

      {/* Zone hint ring (interactive only) */}
      {!readOnly && (
        <circle
          cx={cx} cy={cy} r={faceR * 0.42}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          opacity={0.35}
        />
      )}

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.isHour ? '#374151' : '#d1d5db'}
          strokeWidth={t.isHour ? 2.5 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* Hour numbers */}
      {hourNums.map(n => (
        <text
          key={n.h}
          x={n.x} y={n.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="700"
          fill="#111827"
        >
          {n.h}
        </text>
      ))}

      {/* Hour hand (dark, shorter, thicker) */}
      <line
        x1={cx} y1={cy}
        x2={hrEnd.x} y2={hrEnd.y}
        stroke="#1e293b"
        strokeWidth={Math.max(4, size * 0.044)}
        strokeLinecap="round"
      />

      {/* Minute hand (blue, longer, thinner) */}
      <line
        x1={cx} y1={cy}
        x2={minEnd.x} y2={minEnd.y}
        stroke="#3b82f6"
        strokeWidth={Math.max(3, size * 0.027)}
        strokeLinecap="round"
      />

      {/* Center dots */}
      <circle cx={cx} cy={cy} r={size * 0.042} fill="#1e293b" />
      <circle cx={cx} cy={cy} r={size * 0.020} fill="#3b82f6" />

      {/* Drag handle circles (interactive only) */}
      {!readOnly && (
        <>
          <circle
            cx={hrEnd.x} cy={hrEnd.y}
            r={size * 0.065}
            fill="#1e293b" fillOpacity={0.18}
          />
          <circle
            cx={minEnd.x} cy={minEnd.y}
            r={size * 0.055}
            fill="#3b82f6" fillOpacity={0.22}
          />
        </>
      )}
    </svg>
  );
}
