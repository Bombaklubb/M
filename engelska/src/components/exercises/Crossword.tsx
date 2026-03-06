"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { CrosswordClue } from "@/lib/types";

interface Props {
  clues: CrosswordClue[];
  onComplete: () => void;
}

interface GridCell {
  letter: string;       // correct letter
  number?: number;      // clue number (if start of word)
  acrossClue?: number;
  downClue?: number;
}

function buildCrosswordGrid(clues: CrosswordClue[]): { grid: (GridCell | null)[][]; rows: number; cols: number } {
  // Determine grid size from clue placements
  let maxRow = 0, maxCol = 0;
  for (const c of clues) {
    const endRow = c.direction === "down" ? c.row + c.answer.length - 1 : c.row;
    const endCol = c.direction === "across" ? c.col + c.answer.length - 1 : c.col;
    maxRow = Math.max(maxRow, endRow);
    maxCol = Math.max(maxCol, endCol);
  }

  const rows = maxRow + 1, cols = maxCol + 1;
  const grid: (GridCell | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

  for (const c of clues) {
    const dr = c.direction === "down" ? 1 : 0;
    const dc = c.direction === "across" ? 1 : 0;
    for (let i = 0; i < c.answer.length; i++) {
      const r = c.row + i * dr, col = c.col + i * dc;
      if (!grid[r][col]) grid[r][col] = { letter: c.answer[i].toUpperCase() };
      if (i === 0) {
        grid[r][col]!.number = c.number;
      }
      if (c.direction === "across") grid[r][col]!.acrossClue = c.number;
      else grid[r][col]!.downClue = c.number;
    }
  }

  return { grid, rows, cols };
}

function cellKey(r: number, c: number) { return `${r},${c}`; }

export default function Crossword({ clues, onComplete }: Props) {
  const { grid, rows, cols } = useMemo(() => buildCrosswordGrid(clues), [clues]);

  const [userInput, setUserInput] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [activeDirection, setActiveDirection] = useState<"across" | "down">("across");
  const [checked, setChecked] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isComplete = useMemo(() => {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c] && (userInput[cellKey(r, c)] ?? "") === "") return false;
    return true;
  }, [grid, rows, cols, userInput]);

  const isCorrect = useMemo(() => {
    if (!isComplete) return false;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c] && (userInput[cellKey(r, c)] ?? "").toUpperCase() !== grid[r][c]!.letter) return false;
    return true;
  }, [grid, rows, cols, userInput, isComplete]);

  function moveToNext(r: number, c: number, dir: "across" | "down") {
    const nr = dir === "down" ? r + 1 : r;
    const nc = dir === "across" ? c + 1 : c;
    if (nr < rows && nc < cols && grid[nr][nc]) {
      setActiveCell([nr, nc]);
      setTimeout(() => inputRefs.current[cellKey(nr, nc)]?.focus(), 0);
    }
  }

  function moveToPrev(r: number, c: number, dir: "across" | "down") {
    const nr = dir === "down" ? r - 1 : r;
    const nc = dir === "across" ? c - 1 : c;
    if (nr >= 0 && nc >= 0 && grid[nr][nc]) {
      setActiveCell([nr, nc]);
      setTimeout(() => inputRefs.current[cellKey(nr, nc)]?.focus(), 0);
    }
  }

  const handleCellClick = useCallback((r: number, c: number) => {
    const key = cellKey(r, c);
    if (activeCell && activeCell[0] === r && activeCell[1] === c) {
      // Toggle direction
      const cell = grid[r][c];
      if (cell?.acrossClue && cell?.downClue) {
        setActiveDirection((d) => d === "across" ? "down" : "across");
      }
    } else {
      setActiveCell([r, c]);
      const cell = grid[r][c];
      if (cell?.acrossClue && !cell?.downClue) setActiveDirection("across");
      else if (cell?.downClue && !cell?.acrossClue) setActiveDirection("down");
    }
    setTimeout(() => inputRefs.current[key]?.focus(), 0);
  }, [activeCell, grid]);

  function handleKeyDown(e: React.KeyboardEvent, r: number, c: number) {
    if (e.key === "Backspace") {
      const key = cellKey(r, c);
      if (!userInput[key]) {
        moveToPrev(r, c, activeDirection);
      }
    } else if (e.key === "ArrowRight") { setActiveDirection("across"); moveToNext(r, c, "across"); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { setActiveDirection("across"); moveToPrev(r, c, "across"); e.preventDefault(); }
    else if (e.key === "ArrowDown") { setActiveDirection("down"); moveToNext(r, c, "down"); e.preventDefault(); }
    else if (e.key === "ArrowUp") { setActiveDirection("down"); moveToPrev(r, c, "down"); e.preventDefault(); }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>, r: number, c: number) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    const key = cellKey(r, c);
    const last = val.slice(-1);
    setUserInput((prev) => ({ ...prev, [key]: last }));
    if (last) moveToNext(r, c, activeDirection);
  }

  function handleCheck() {
    setChecked(true);
    if (isCorrect) onComplete();
  }

  const activeKey = activeCell ? cellKey(activeCell[0], activeCell[1]) : null;

  // Highlight active word cells
  const activeWordKeys = useMemo(() => {
    if (!activeCell) return new Set<string>();
    const [r, c] = activeCell;
    const cell = grid[r]?.[c];
    if (!cell) return new Set<string>();
    const clueNum = activeDirection === "across" ? cell.acrossClue : cell.downClue;
    if (!clueNum) return new Set<string>();
    const clue = clues.find((cl) => cl.number === clueNum && cl.direction === activeDirection);
    if (!clue) return new Set<string>();
    const keys = new Set<string>();
    const dr = clue.direction === "down" ? 1 : 0, dc = clue.direction === "across" ? 1 : 0;
    for (let i = 0; i < clue.answer.length; i++) keys.add(cellKey(clue.row + i * dr, clue.col + i * dc));
    return keys;
  }, [activeCell, activeDirection, clues, grid]);

  function getCellClass(r: number, c: number): string {
    const key = cellKey(r, c);
    const isActive = activeKey === key;
    const isWordHighlight = activeWordKeys.has(key);
    const userVal = (userInput[key] ?? "").toUpperCase();
    const correct = userVal === grid[r][c]?.letter;

    if (checked && userVal) {
      if (correct) return "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600";
      return "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600";
    }
    if (isActive) return "bg-yellow-200 dark:bg-yellow-700/60 border-yellow-500";
    if (isWordHighlight) return "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600";
    return "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600";
  }

  const acrossClues = clues.filter((c) => c.direction === "across").sort((a, b) => a.number - b.number);
  const downClues = clues.filter((c) => c.direction === "down").sort((a, b) => a.number - b.number);

  const CELL_SIZE = 36;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2 text-sm text-blue-700 dark:text-blue-300">
        Klicka på en ruta och skriv. Klicka igen för att byta riktning (→ / ↓).
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Grid */}
        <div className="overflow-x-auto">
          <div
            className="inline-block border border-gray-300 dark:border-gray-600"
            style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`, gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)` }}
          >
            {Array.from({ length: rows }, (_, r) =>
              Array.from({ length: cols }, (_, c) => {
                const cell = grid[r][c];
                if (!cell) {
                  return (
                    <div
                      key={cellKey(r, c)}
                      className="bg-gray-800 dark:bg-gray-950"
                      style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    />
                  );
                }
                return (
                  <div
                    key={cellKey(r, c)}
                    className={`relative border cursor-pointer ${getCellClass(r, c)}`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    onClick={() => handleCellClick(r, c)}
                  >
                    {cell.number && (
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-gray-600 dark:text-gray-300 leading-none">
                        {cell.number}
                      </span>
                    )}
                    <input
                      ref={(el) => { inputRefs.current[cellKey(r, c)] = el; }}
                      type="text"
                      maxLength={1}
                      value={userInput[cellKey(r, c)] ?? ""}
                      onChange={(e) => handleInput(e, r, c)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      onFocus={() => setActiveCell([r, c])}
                      className="absolute inset-0 w-full h-full bg-transparent text-center text-sm font-bold uppercase outline-none text-gray-900 dark:text-gray-100 pt-2"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues */}
        <div className="flex gap-6 flex-wrap xl:flex-col xl:flex-nowrap">
          <div className="min-w-[160px]">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-2">Vågrätt →</h3>
            <ul className="space-y-1.5">
              {acrossClues.map((c) => (
                <li
                  key={c.number}
                  className="text-xs cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => {
                    setActiveCell([c.row, c.col]);
                    setActiveDirection("across");
                    setTimeout(() => inputRefs.current[cellKey(c.row, c.col)]?.focus(), 0);
                  }}
                >
                  <span className="font-bold text-gray-500 dark:text-gray-400">{c.number}.</span>{" "}
                  <span className="text-gray-700 dark:text-gray-300">{c.clue}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-[160px]">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-2">Lodrätt ↓</h3>
            <ul className="space-y-1.5">
              {downClues.map((c) => (
                <li
                  key={c.number}
                  className="text-xs cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => {
                    setActiveCell([c.row, c.col]);
                    setActiveDirection("down");
                    setTimeout(() => inputRefs.current[cellKey(c.row, c.col)]?.focus(), 0);
                  }}
                >
                  <span className="font-bold text-gray-500 dark:text-gray-400">{c.number}.</span>{" "}
                  <span className="text-gray-700 dark:text-gray-300">{c.clue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleCheck}
          disabled={!isComplete}
          className="btn-primary bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Kontrollera ✓
        </button>
        <button
          onClick={() => { setUserInput({}); setChecked(false); setActiveCell(null); }}
          className="btn-secondary border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          🔄 Börja om
        </button>
      </div>

      {checked && (
        <div className={`rounded-xl p-4 border animate-slide-up ${isCorrect
          ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300"
          : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300"
        }`}>
          {isCorrect ? "✓ Allt rätt! Bra jobbat!" : "Inte helt rätt — röda rutor visar fel. Försök igen!"}
        </div>
      )}
    </div>
  );
}
