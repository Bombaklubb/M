import { useEffect, useMemo } from 'react';
import { playFanfare } from '../utils/sound';
import { shuffle } from '../utils/shuffle';

const COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#eab308'];
const SHAPES = ['▮', '●', '★', '◆'];

interface Piece {
  left: number;      // % från vänster
  delay: number;     // s
  duration: number;  // s
  color: string;
  shape: string;
  size: number;      // px
  drift: number;     // px sidledsdrift
  spin: number;      // grader
}

/**
 * Fullskärmskonfetti + segerfanfar. Rendera vid full pott / 3 stjärnor.
 * Ren CSS-animation – städar sig själv, blockerar inga klick (pointer-events: none).
 */
export default function Celebration({ withSound = true, pieces = 60 }: { withSound?: boolean; pieces?: number }) {
  const confetti = useMemo<Piece[]>(() =>
    shuffle(Array.from({ length: pieces }, (_, i) => ({
      left: (i / pieces) * 100 + Math.random() * (100 / pieces),
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 10 + Math.random() * 10,
      drift: -60 + Math.random() * 120,
      spin: 360 + Math.random() * 720,
    }))), [pieces]);

  useEffect(() => {
    if (withSound) playFanfare();
  }, [withSound]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none" aria-hidden="true">
      {confetti.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 confetti-piece"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            color: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--confetti-drift' as string]: `${p.drift}px`,
            ['--confetti-spin' as string]: `${p.spin}deg`,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}
