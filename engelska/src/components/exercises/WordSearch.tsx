"use client";

import { useState, useMemo, useCallback } from "react";
import type { WordSearchWord } from "@/lib/types";

interface Props {
  words: WordSearchWord[];
  onComplete: (foundAll: boolean) => void;
}

type Cell = [number, number];
type Placement = { word: string; cells: Cell[] };

const GRID_SIZE = 12;
const DIRECTIONS: Cell[] = [
  [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function buildGrid(wordList: string[]): { grid: string[][]; placements: Placement[] } {
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  const placements: Placement[] = [];

  for (const word of wordList.map((w) => w.toUpperCase())) {
    let placed = false;
    for (let attempt = 0; attempt < 400 && !placed; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const rowMin = dr > 0 ? 0 : dr < 0 ? word.length - 1 : 0;
      const rowMax = dr > 0 ? GRID_SIZE - word.length : dr < 0 ? GRID_SIZE - 1 : GRID_SIZE - 1;
      const colMin = dc > 0 ? 0 : dc < 0 ? word.length - 1 : 0;
      const colMax = dc > 0 ? GRID_SIZE - word.length : dc < 0 ? GRID_SIZE - 1 : GRID_SIZE - 1;
      if (rowMin > rowMax || colMin > colMax) continue;
      const row = rowMin + Math.floor(Math.random() * (rowMax - rowMin + 1));
      const col = colMin + Math.floor(Math.random() * (colMax - colMin + 1));
      const cells: Cell[] = [];
      let valid = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + i * dr, c = col + i * dc;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) { valid = false; break; }
        if (grid[r][c] && grid[r][c] !== word[i]) { valid = false; break; }
        cells.push([r, c]);
      }
      if (valid) {
        cells.forEach(([r, c], i) => { grid[r][c] = word[i]; });
        placements.push({ word, cells });
        placed = true;
      }
    }
  }

  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (!grid[r][c]) grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];

  return { grid, placements };
}

function cellKey(r: number, c: number) { return `${r},${c}`; }

function getLineCells(start: Cell, end: Cell): Cell[] | null {
  const [r1, c1] = start, [r2, c2] = end;
  const dr = r2 - r1, dc = c2 - c1;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return [[r1, c1]];
  if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const sr = dr === 0 ? 0 : dr / Math.abs(dr);
  const sc = dc === 0 ? 0 : dc / Math.abs(dc);
  return Array.from({ length: len + 1 }, (_, i) => [r1 + i * sr, c1 + i * sc] as Cell);
}

export default function WordSearch({ words, onComplete }: Props) {
  const { grid, placements } = useMemo(() => buildGrid(words.map((w) => w.word)), [words]);

  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState<Cell | null>(null);
  const [hoverCell, setHoverCell] = useState<Cell | null>(null);
  const [flash, setFlash] = useState<{ cells: Cell[]; correct: boolean } | null>(null);

  const selectionCells = useMemo(() => {
    if (!selecting || !hoverCell) return selecting ? [selecting] : [];
    return getLineCells(selecting, hoverCell) ?? [selecting];
  }, [selecting, hoverCell]);

  const selectionKeys = useMemo(() => new Set(selectionCells.map(([r, c]) => cellKey(r, c))), [selectionCells]);

  const foundCells = useMemo(() => {
    const set = new Set<string>();
    placements.filter((p) => foundWords.has(p.word)).forEach((p) => p.cells.forEach(([r, c]) => set.add(cellKey(r, c))));
    return set;
  }, [placements, foundWords]);

  const flashKeys = useMemo(() => flash ? new Set(flash.cells.map(([r, c]) => cellKey(r, c))) : new Set<string>(), [flash]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (flash) return;
    if (!selecting) {
      setSelecting([r, c]);
      setHoverCell([r, c]);
      return;
    }

    // Finalise selection
    const cells = getLineCells(selecting, [r, c]);
    if (!cells) { setSelecting(null); setHoverCell(null); return; }

    const selectedWord = cells.map(([cr, cc]) => grid[cr][cc]).join("");
    const selectedWordRev = selectedWord.split("").reverse().join("");

    const match = placements.find(
      (p) => !foundWords.has(p.word) && (p.word === selectedWord || p.word === selectedWordRev)
    );

    if (match) {
      const newFound = new Set(foundWords);
      newFound.add(match.word);
      setFoundWords(newFound);
      setFlash({ cells: match.cells, correct: true });
      setTimeout(() => {
        setFlash(null);
        setSelecting(null);
        setHoverCell(null);
        if (newFound.size === words.length) onComplete(true);
      }, 600);
    } else {
      setFlash({ cells, correct: false });
      setTimeout(() => {
        setFlash(null);
        setSelecting(null);
        setHoverCell(null);
      }, 400);
    }
  }, [selecting, grid, placements, foundWords, words.length, onComplete]);

  function getCellClass(r: number, c: number): string {
    const key = cellKey(r, c);
    const isFound = foundCells.has(key);
    const isSelecting = selectionKeys.has(key);
    const isFlash = flashKeys.has(key);

    if (isFlash) return flash?.correct
      ? "bg-green-400 dark:bg-green-500 text-white scale-110"
      : "bg-red-400 dark:bg-red-500 text-white";
    if (isFound) return "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 font-bold";
    if (isSelecting) return "bg-blue-300 dark:bg-blue-600 text-white scale-105";
    if (selecting) return "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer";
    return "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer";
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2 text-sm text-blue-700 dark:text-blue-300">
        Klicka på ett start-bokstav, sedan på ett slut-bokstav för att markera ett ord.
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grid */}
        <div
          className="overflow-x-auto select-none"
          onMouseLeave={() => { if (selecting) setHoverCell(selecting); }}
        >
          <div
            className="inline-grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => (
                <button
                  key={cellKey(r, c)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-xs sm:text-sm font-bold transition-all duration-100 ${getCellClass(r, c)}`}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => { if (selecting) setHoverCell([r, c]); }}
                >
                  {letter}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Word list */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-3">
            Hittade ord: {foundWords.size}/{words.length}
          </h3>
          <div className="space-y-2">
            {words.map(({ word, clue }) => {
              const found = foundWords.has(word.toUpperCase());
              return (
                <div
                  key={word}
                  className={`flex items-start gap-2 text-sm transition-all ${found ? "opacity-50" : ""}`}
                >
                  <span className={`font-mono font-bold flex-shrink-0 ${found ? "line-through text-gray-400 dark:text-gray-500" : "text-blue-700 dark:text-blue-300"}`}>
                    {found ? "✓" : "○"} {word.toUpperCase()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">{clue}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
