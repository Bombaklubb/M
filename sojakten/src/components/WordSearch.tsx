import { useState, useRef, useMemo } from 'react';

interface Cell { r: number; c: number; }
interface PlacedWord { clean: string; original: string; cells: Cell[]; }

const SIZE = 10;
const DIRS = [{ dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';

function clean(word: string) {
  return word.toUpperCase().replace(/[^A-ZÅÄÖ]/g, '');
}

function buildGrid(rawWords: string[]): { grid: string[][]; placed: PlacedWord[] } {
  const seen = new Set<string>();
  const words = rawWords
    .map(w => ({ original: w, clean: clean(w) }))
    .filter(w => {
      if (w.clean.length < 3 || w.clean.length > SIZE) return false;
      if (seen.has(w.clean)) return false;
      seen.add(w.clean);
      return true;
    });

  const grid: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  const placed: PlacedWord[] = [];

  for (const { original, clean: word } of words) {
    let ok = false;
    for (let t = 0; t < 300 && !ok; t++) {
      const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
      const maxR = SIZE - word.length * dir.dr;
      const maxC = SIZE - word.length * dir.dc;
      if (maxR < 0 || maxC < 0) continue;
      const r = Math.floor(Math.random() * (maxR + 1));
      const c = Math.floor(Math.random() * (maxC + 1));
      const cells: Cell[] = [];
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + i * dir.dr;
        const nc = c + i * dir.dc;
        if (grid[nr][nc] && grid[nr][nc] !== word[i]) { fits = false; break; }
        cells.push({ r: nr, c: nc });
      }
      if (fits) {
        cells.forEach((cell, i) => { grid[cell.r][cell.c] = word[i]; });
        placed.push({ clean: word, original, cells });
        ok = true;
      }
    }
  }

  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c]) grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];

  return { grid, placed };
}

function snapLine(start: Cell, end: Cell): Cell[] {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  if (dr === 0 && dc === 0) return [start];

  const angle = Math.atan2(dr, dc) * 180 / Math.PI;
  let snapDr: number, snapDc: number;
  if (angle > -22.5 && angle <= 22.5) { snapDr = 0; snapDc = 1; }
  else if (angle > 22.5 && angle <= 67.5) { snapDr = 1; snapDc = 1; }
  else { snapDr = 1; snapDc = 0; }

  const dist = Math.round(Math.max(Math.abs(dr), Math.abs(dc)));
  const cells: Cell[] = [];
  for (let i = 0; i <= dist; i++) {
    const nr = start.r + i * snapDr;
    const nc = start.c + i * snapDc;
    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) cells.push({ r: nr, c: nc });
  }
  return cells;
}

export default function WordSearch({ words, accentColor }: { words: string[]; accentColor: string }) {
  const { grid, placed } = useMemo(() => buildGrid(words), [words.join('|')]);
  const [found, setFound] = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<Map<string, string>>(new Map());
  const [selecting, setSelecting] = useState<Cell[]>([]);
  const [flash, setFlash] = useState<'none' | 'wrong' | 'right'>('none');

  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startCell = useRef<Cell | null>(null);

  const key = (r: number, c: number) => `${r},${c}`;

  function cellFromPoint(x: number, y: number): Cell | null {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const c = Math.floor(((x - rect.left) / rect.width) * SIZE);
    const r = Math.floor(((y - rect.top) / rect.height) * SIZE);
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return null;
    return { r, c };
  }

  function onDown(e: React.PointerEvent) {
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    isDown.current = true;
    startCell.current = cell;
    setSelecting([cell]);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onMove(e: React.PointerEvent) {
    if (!isDown.current || !startCell.current) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell) setSelecting(snapLine(startCell.current, cell));
  }

  function onUp() {
    if (!isDown.current || selecting.length === 0) { isDown.current = false; return; }
    isDown.current = false;

    const selectedStr = selecting.map(c => grid[c.r][c.c]).join('');
    const match = placed.find(p => p.clean === selectedStr && !found.includes(p.clean));

    if (match) {
      setFound(prev => [...prev, match.clean]);
      setFoundCells(prev => {
        const next = new Map(prev);
        match.cells.forEach(c => next.set(key(c.r, c.c), match.clean));
        return next;
      });
      setFlash('right');
      setTimeout(() => setFlash('none'), 500);
    } else if (selecting.length > 1) {
      setFlash('wrong');
      setTimeout(() => setFlash('none'), 400);
    }

    setSelecting([]);
    startCell.current = null;
  }

  const allFound = found.length === placed.length && placed.length > 0;

  return (
    <div>
      {/* Word list ABOVE grid */}
      <div className="flex flex-wrap gap-2 mb-3">
        {placed.map(({ clean: w, original }) => (
          <span
            key={w}
            className="text-xs font-black px-2.5 py-1 rounded-full border-2 transition-all"
            style={found.includes(w) ? {
              textDecoration: 'line-through',
              background: accentColor + '18',
              borderColor: accentColor + '50',
              color: accentColor,
            } : {
              background: 'white',
              borderColor: '#e5e7eb',
              color: '#6b7280',
            }}
          >
            {original}
          </span>
        ))}
      </div>

      {allFound ? (
        <div className="clay-card p-5 text-center">
          <p className="text-4xl mb-1">🎉</p>
          <p className="font-heading font-bold text-lg text-gray-800">Alla ord hittade!</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2">
            Dra över bokstäverna för att markera ett ord
          </p>

          {/* Grid — capped height so it fits without scrolling */}
          <div
            ref={containerRef}
            className="rounded-2xl overflow-hidden touch-none select-none shadow-md mx-auto"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
              aspectRatio: '1 / 1',
              maxWidth: 'min(100%, 340px)',
              cursor: 'crosshair',
              userSelect: 'none',
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {grid.flat().map((letter, idx) => {
              const r = Math.floor(idx / SIZE);
              const c = idx % SIZE;
              const isFoundCell = foundCells.has(key(r, c));
              const isSel = selecting.some(s => s.r === r && s.c === c);

              let bg = 'white';
              let color = '#374151';
              let borderColor = '#f3f4f6';

              if (isFoundCell) {
                bg = accentColor + '28';
                color = accentColor;
                borderColor = accentColor + '50';
              } else if (isSel) {
                if (flash === 'wrong') { bg = '#fee2e2'; color = '#dc2626'; borderColor = '#fca5a5'; }
                else if (flash === 'right') { bg = '#dcfce7'; color = '#16a34a'; borderColor = '#86efac'; }
                else { bg = '#dbeafe'; color = '#1d4ed8'; borderColor = '#93c5fd'; }
              }

              return (
                <div
                  key={idx}
                  className="flex items-center justify-center font-black text-sm transition-colors"
                  style={{ background: bg, color, border: `1px solid ${borderColor}` }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
