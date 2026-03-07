"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { CrosswordClue } from "@/lib/types";

interface Props {
  clues: CrosswordClue[];
  onComplete: () => void;
}

interface GridCell {
  letter: string;
  number?: number;
  acrossClue?: number;
  downClue?: number;
}

function buildCrosswordGrid(clues: CrosswordClue[]): { grid: (GridCell | null)[][]; rows: number; cols: number } {
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
      if (i === 0) grid[r][col]!.number = c.number;
      if (c.direction === "across") grid[r][col]!.acrossClue = c.number;
      else grid[r][col]!.downClue = c.number;
    }
  }
  return { grid, rows, cols };
}

function cellKey(r: number, c: number) { return `${r},${c}`; }

// Colorful number badges per clue
const CLUE_COLORS = [
  "bg-rose-500","bg-orange-500","bg-amber-500","bg-lime-500","bg-emerald-500",
  "bg-teal-500","bg-cyan-500","bg-sky-500","bg-blue-500","bg-violet-500",
  "bg-purple-500","bg-fuchsia-500","bg-pink-500","bg-red-500","bg-green-500",
];
function clueColor(num: number) { return CLUE_COLORS[(num - 1) % CLUE_COLORS.length]; }

export default function Crossword({ clues, onComplete }: Props) {
  const { grid, rows, cols } = useMemo(() => buildCrosswordGrid(clues), [clues]);

  const [userInput, setUserInput] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [activeDirection, setActiveDirection] = useState<"across" | "down">("across");
  const [checked, setChecked] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());
  const [hintClue, setHintClue] = useState<CrosswordClue | null>(null);
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
      const cell = grid[r][c];
      if (cell?.acrossClue && cell?.downClue)
        setActiveDirection((d) => d === "across" ? "down" : "across");
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
      if (!userInput[cellKey(r, c)]) moveToPrev(r, c, activeDirection);
    } else if (e.key === "ArrowRight") { setActiveDirection("across"); moveToNext(r, c, "across"); e.preventDefault(); }
    else if (e.key === "ArrowLeft")  { setActiveDirection("across"); moveToPrev(r, c, "across"); e.preventDefault(); }
    else if (e.key === "ArrowDown")  { setActiveDirection("down");   moveToNext(r, c, "down");   e.preventDefault(); }
    else if (e.key === "ArrowUp")    { setActiveDirection("down");   moveToPrev(r, c, "down");   e.preventDefault(); }
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

  // Hint: reveal first letter of active word
  function handleHint() {
    if (!activeCell) return;
    const [r, c] = activeCell;
    const cell = grid[r]?.[c];
    if (!cell) return;
    const clueNum = activeDirection === "across" ? cell.acrossClue : cell.downClue;
    if (!clueNum) return;
    const clue = clues.find((cl) => cl.number === clueNum && cl.direction === activeDirection);
    if (!clue) return;
    setHintClue(clue);
    // Reveal first letter
    const key = cellKey(clue.row, clue.col);
    const firstLetter = clue.answer[0].toUpperCase();
    setUserInput((prev) => ({ ...prev, [key]: firstLetter }));
    setRevealedLetters((prev) => new Set(prev).add(key));
  }

  const activeKey = activeCell ? cellKey(activeCell[0], activeCell[1]) : null;

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

  // Active clue info
  const activeClueInfo = useMemo(() => {
    if (!activeCell) return null;
    const [r, c] = activeCell;
    const cell = grid[r]?.[c];
    if (!cell) return null;
    const clueNum = activeDirection === "across" ? cell.acrossClue : cell.downClue;
    if (!clueNum) return null;
    return clues.find((cl) => cl.number === clueNum && cl.direction === activeDirection) ?? null;
  }, [activeCell, activeDirection, clues, grid]);

  function getCellClass(r: number, c: number): string {
    const key = cellKey(r, c);
    const isActive = activeKey === key;
    const isWordHighlight = activeWordKeys.has(key);
    const isRevealed = revealedLetters.has(key);
    const userVal = (userInput[key] ?? "").toUpperCase();
    const correct = userVal === grid[r][c]?.letter;

    if (checked && userVal) {
      if (correct) return "bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-500";
      if (isRevealed) return "bg-purple-100 dark:bg-purple-900/40 border-purple-400";
      return "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-500";
    }
    if (isRevealed && userVal) return "bg-purple-100 dark:bg-purple-900/30 border-purple-400";
    if (isActive) return "bg-yellow-200 dark:bg-yellow-600/50 border-yellow-500 dark:border-yellow-400";
    if (isWordHighlight) return "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-500";
    return "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500";
  }

  const acrossClues = clues.filter((c) => c.direction === "across").sort((a, b) => a.number - b.number);
  const downClues   = clues.filter((c) => c.direction === "down").sort((a, b) => a.number - b.number);

  const CELL = 42;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Instruction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-2.5 text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
        <span>🖊️</span>
        <span>Klicka på en ruta och skriv. Klicka igen för att byta riktning (→ / ↓). Piltangenter navigerar.</span>
      </div>

      {/* Active clue banner */}
      {activeClueInfo && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <span className={`text-white text-xs font-black px-2 py-1 rounded-lg ${clueColor(activeClueInfo.number)}`}>
            {activeClueInfo.number}{activeClueInfo.direction === "across" ? "→" : "↓"}
          </span>
          <span className="text-sm font-semibold text-amber-900 dark:text-amber-200 flex-1">
            {activeClueInfo.clue}
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400">
            {activeClueInfo.answer.length} bokstäver
          </span>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Grid + hint button */}
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto">
            <div
              className="inline-grid border-2 border-gray-700 dark:border-gray-400 rounded-lg overflow-hidden shadow-lg"
              style={{
                gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
                gridTemplateRows: `repeat(${rows}, ${CELL}px)`,
              }}
            >
              {Array.from({ length: rows }, (_, r) =>
                Array.from({ length: cols }, (_, c) => {
                  const cell = grid[r][c];
                  if (!cell) {
                    return (
                      <div
                        key={cellKey(r, c)}
                        className="bg-gray-800 dark:bg-gray-950"
                        style={{ width: CELL, height: CELL }}
                      />
                    );
                  }
                  return (
                    <div
                      key={cellKey(r, c)}
                      className={`relative border cursor-pointer select-none transition-colors ${getCellClass(r, c)}`}
                      style={{ width: CELL, height: CELL }}
                      onClick={() => handleCellClick(r, c)}
                    >
                      {cell.number && (
                        <span className={`absolute top-0.5 left-0.5 text-[9px] font-black text-white leading-none px-0.5 py-0.5 rounded ${clueColor(cell.number)}`}>
                          {cell.number}
                        </span>
                      )}
                      <input
                        ref={(el) => { inputRefs.current[cellKey(r, c)] = el; }}
                        type="text"
                        maxLength={2}
                        value={userInput[cellKey(r, c)] ?? ""}
                        onChange={(e) => handleInput(e, r, c)}
                        onKeyDown={(e) => handleKeyDown(e, r, c)}
                        onFocus={() => { setActiveCell([r, c]); }}
                        className="absolute inset-0 w-full h-full bg-transparent text-center text-base font-black uppercase outline-none text-gray-900 dark:text-gray-100 pt-3 cursor-pointer"
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

          {/* Hint button */}
          <button
            onClick={handleHint}
            disabled={!activeClueInfo}
            className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>💡</span>
            <span>Tips – visa första bokstaven</span>
          </button>

          {/* Hint result box */}
          {hintClue && (
            <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-xl px-4 py-3 text-sm text-purple-800 dark:text-purple-200 animate-slide-up">
              <p className="font-semibold mb-1">
                Tips för <span className={`text-white text-xs px-1.5 py-0.5 rounded ${clueColor(hintClue.number)}`}>{hintClue.number}{hintClue.direction === "across" ? "→" : "↓"}</span>:
              </p>
              <p>Ordet har <strong>{hintClue.answer.length}</strong> bokstäver och börjar med <strong className="text-purple-600 dark:text-purple-300 text-base">{hintClue.answer[0]}</strong>.</p>
            </div>
          )}
        </div>

        {/* Clue lists */}
        <div className="flex gap-6 flex-wrap xl:flex-col xl:flex-nowrap flex-1">
          {/* Across */}
          <div className="min-w-[180px] flex-1">
            <h3 className="font-black text-gray-700 dark:text-gray-200 text-sm mb-3 flex items-center gap-1.5">
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-lg">→</span>
              Vågrätt
            </h3>
            <ul className="space-y-2">
              {acrossClues.map((cl) => {
                const isActive = activeClueInfo?.number === cl.number && activeClueInfo?.direction === "across";
                return (
                  <li
                    key={cl.number}
                    className={`flex items-start gap-2 text-xs cursor-pointer rounded-lg px-2 py-1.5 transition-colors ${
                      isActive
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => {
                      setActiveCell([cl.row, cl.col]);
                      setActiveDirection("across");
                      setTimeout(() => inputRefs.current[cellKey(cl.row, cl.col)]?.focus(), 0);
                    }}
                  >
                    <span className={`text-white text-[10px] font-black px-1.5 py-0.5 rounded flex-shrink-0 ${clueColor(cl.number)}`}>
                      {cl.number}
                    </span>
                    <span className="leading-snug">{cl.clue}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Down */}
          <div className="min-w-[180px] flex-1">
            <h3 className="font-black text-gray-700 dark:text-gray-200 text-sm mb-3 flex items-center gap-1.5">
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-lg">↓</span>
              Lodrätt
            </h3>
            <ul className="space-y-2">
              {downClues.map((cl) => {
                const isActive = activeClueInfo?.number === cl.number && activeClueInfo?.direction === "down";
                return (
                  <li
                    key={cl.number}
                    className={`flex items-start gap-2 text-xs cursor-pointer rounded-lg px-2 py-1.5 transition-colors ${
                      isActive
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => {
                      setActiveCell([cl.row, cl.col]);
                      setActiveDirection("down");
                      setTimeout(() => inputRefs.current[cellKey(cl.row, cl.col)]?.focus(), 0);
                    }}
                  >
                    <span className={`text-white text-[10px] font-black px-1.5 py-0.5 rounded flex-shrink-0 ${clueColor(cl.number)}`}>
                      {cl.number}
                    </span>
                    <span className="leading-snug">{cl.clue}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap pt-2">
        <button
          onClick={handleCheck}
          disabled={!isComplete}
          className="btn-primary bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Kontrollera ✓
        </button>
        <button
          onClick={() => { setUserInput({}); setChecked(false); setActiveCell(null); setRevealedLetters(new Set()); setHintClue(null); }}
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
          {isCorrect
            ? "✓ Allt rätt! Suveränt jobbat! 🎉"
            : "Inte helt rätt — röda rutor visar fel. Klicka 💡 Tips för hjälp!"}
        </div>
      )}
    </div>
  );
}
