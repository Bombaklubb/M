"use client";

import { useState, useMemo, useCallback } from "react";
import type { WordSearchWord } from "@/lib/types";

interface Props {
  words: WordSearchWord[];
  onComplete: (foundAll: boolean) => void;
}

type Cell = [number, number];
type Placement = { word: string; cells: Cell[] };

const MIN_GRID_SIZE = 12;
const DIRECTIONS: Cell[] = [
  [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Ett försök att placera alla ord i ett rutnät av given storlek.
 * Returnerar null om något ord inte fick plats.
 */
function tryBuildGrid(
  words: string[],
  gridSize: number
): { grid: string[][]; placements: Placement[] } | null {
  const grid: string[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
  const placements: Placement[] = [];

  // Placera längsta orden först – de är svårast och bör få välja plats fritt.
  const ordered = [...words].sort((a, b) => b.length - a.length);

  for (const word of ordered) {
    let placed = false;
    for (let attempt = 0; attempt < 400 && !placed; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const rowMin = dr > 0 ? 0 : dr < 0 ? word.length - 1 : 0;
      const rowMax = dr > 0 ? gridSize - word.length : dr < 0 ? gridSize - 1 : gridSize - 1;
      const colMin = dc > 0 ? 0 : dc < 0 ? word.length - 1 : 0;
      const colMax = dc > 0 ? gridSize - word.length : dc < 0 ? gridSize - 1 : gridSize - 1;
      if (rowMin > rowMax || colMin > colMax) continue;
      const row = rowMin + Math.floor(Math.random() * (rowMax - rowMin + 1));
      const col = colMin + Math.floor(Math.random() * (colMax - colMin + 1));
      const cells: Cell[] = [];
      let valid = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + i * dr, c = col + i * dc;
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) { valid = false; break; }
        if (grid[r][c] && grid[r][c] !== word[i]) { valid = false; break; }
        cells.push([r, c]);
      }
      if (valid) {
        cells.forEach(([r, c], i) => { grid[r][c] = word[i]; });
        placements.push({ word, cells });
        placed = true;
      }
    }
    if (!placed) return null; // ordet fick inte plats – försök med större rutnät
  }

  return { grid, placements };
}

/**
 * Bygger ett rutnät där ALLA ord garanterat finns.
 *
 * Tidigare hoppades ord som inte fick plats tyst över, men de stod kvar i
 * listan eleven skulle hitta – då gick modulen aldrig att slutföra. Nu görs
 * flera försök med gradvis större rutnät, och det bästa försöket används som
 * sista utväg (WordSearch räknar då mot placements, inte mot ordlistan).
 */
function buildGrid(wordList: string[]): { grid: string[][]; placements: Placement[]; gridSize: number } {
  const words = wordList.map((w) => w.toUpperCase());
  const longestWord = Math.max(...words.map((w) => w.length));
  const baseSize = Math.max(MIN_GRID_SIZE, longestWord + 2);

  let best: { grid: string[][]; placements: Placement[]; gridSize: number } | null = null;

  for (let extra = 0; extra <= 6; extra++) {
    const gridSize = baseSize + extra;
    // Flera omgångar per storlek – placeringen är slumpad.
    for (let round = 0; round < 3; round++) {
      const result = tryBuildGrid(words, gridSize);
      if (result) {
        best = { ...result, gridSize };
        break;
      }
    }
    if (best) break;
  }

  // Nödfall (bör aldrig inträffa): ta med så många ord som möjligt.
  if (!best) {
    const grid: string[][] = Array.from({ length: baseSize + 6 }, () => Array(baseSize + 6).fill(""));
    best = { grid, placements: [], gridSize: baseSize + 6 };
  }

  // Fyll tomma rutor med slumpbokstäver
  for (let r = 0; r < best.gridSize; r++)
    for (let c = 0; c < best.gridSize; c++)
      if (!best.grid[r][c]) best.grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];

  return best;
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
  const { grid, placements, gridSize } = useMemo(() => buildGrid(words.map((w) => w.word)), [words]);

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
        // Räkna mot orden som faktiskt placerats i rutnätet, så en elev
        // aldrig kan fastna om ett ord mot förmodan saknas.
        if (newFound.size === placements.length) onComplete(true);
      }, 600);
    } else {
      setFlash({ cells, correct: false });
      setTimeout(() => {
        setFlash(null);
        setSelecting(null);
        setHoverCell(null);
      }, 400);
    }
  }, [selecting, grid, placements, foundWords, onComplete]);

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
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
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
            Hittade ord: {foundWords.size}/{placements.length}
          </h3>
          <div className="space-y-2">
            {words.map(({ word, clue }) => {
              const found = foundWords.has(word.toUpperCase());
              return (
                <div
                  key={word}
                  className={`flex items-start gap-2 text-sm transition-all ${found ? "opacity-50" : ""}`}
                >
                  <span className={`font-mono font-bold flex-shrink-0 ${found ? "line-through text-gray-400 dark:text-gray-400" : "text-blue-700 dark:text-blue-300"}`}>
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
