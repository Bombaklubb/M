import React, { useState, useRef, useCallback } from 'react';
import { ColumnArithmeticExercise } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toDigits(n: number): number[] {
  if (n === 0) return [0];
  const d: number[] = [];
  while (n > 0) { d.unshift(n % 10); n = Math.floor(n / 10); }
  return d;
}

function padLeft(arr: number[], len: number): number[] {
  const r = [...arr];
  while (r.length < len) r.unshift(0);
  return r;
}

// ─────────────────────────────────────────────────────────────────────────────
// Solution engines
// ─────────────────────────────────────────────────────────────────────────────

interface AddSol {
  cols: number;
  topD: number[];
  botD: number[];
  carryIn: number[];   // carryIn[c] = carry INTO display-column c (0=MSB). Input if >0
  answerD: number[];
}

function solveAdd(top: number, bottom: number): AddSol {
  const td = toDigits(top), bd = toDigits(bottom);
  const base = Math.max(td.length, bd.length);
  const topR = [...td].reverse(), botR = [...bd].reverse();
  const carryR: number[] = [0]; // carryR[i] = carry INTO position i (from right)
  const ansR: number[] = [];
  for (let i = 0; i < base; i++) {
    const s = (topR[i] ?? 0) + (botR[i] ?? 0) + carryR[i];
    ansR.push(s % 10);
    carryR.push(Math.floor(s / 10));
  }
  if (carryR[base] > 0) ansR.push(carryR[base]);
  const cols = ansR.length;
  // carryIn for display col c (0=MSB) = carry that flows INTO that column from its right neighbour
  // = carryR[cols-1-c+1] = carryR[cols-c]
  const carryIn: number[] = [];
  for (let c = 0; c < cols; c++) {
    const rtlPos = cols - 1 - c; // position from right
    carryIn.push(rtlPos + 1 < carryR.length ? carryR[rtlPos + 1] : 0);
  }
  return {
    cols,
    topD: padLeft(td, cols),
    botD: padLeft(bd, cols),
    carryIn,
    answerD: [...ansR].reverse(),
  };
}

interface SubSol {
  cols: number;
  topD: number[];
  botD: number[];
  borrows: number[];       // borrows[c]=1 means display col c borrows from col c-1
  topReduced: number[];    // top digit in col (c-1) AFTER giving a borrow to col c
  answerD: number[];
}

function solveSub(top: number, bottom: number): SubSol {
  const td = toDigits(top), bd = toDigits(bottom);
  const cols = Math.max(td.length, bd.length);
  const topD = padLeft(td, cols), botD = padLeft(bd, cols);
  const topR = [...topD].reverse(), botR = [...botD].reverse();
  const ansR: number[] = [];
  const borrowsR = new Array(cols).fill(0);
  const topWork = [...topR];
  let borrow = 0;
  for (let i = 0; i < cols; i++) {
    topWork[i] = topR[i] - borrow;
    if (topWork[i] < botR[i]) {
      topWork[i] += 10;
      borrowsR[i] = 1;
      borrow = 1;
    } else {
      borrow = 0;
    }
    ansR.push(topWork[i] - botR[i]);
  }
  const borrows = new Array(cols).fill(0);
  const topReduced = [...topD];
  borrowsR.forEach((v, j) => {
    if (v) borrows[cols - 1 - j] = 1;
  });
  // topReduced[c] = what col c shows after it gave away a borrow
  // col c (display) gives to col c+1 when borrowsR[cols-1-(c+1)] = 1
  for (let c = 0; c < cols - 1; c++) {
    const rtl = cols - 1 - c;
    if (borrowsR[rtl - 1]) topReduced[c] = topD[c] - 1;
  }
  return { cols, topD, botD, borrows, topReduced, answerD: [...ansR].reverse() };
}

interface PartialProd {
  padded: number[];      // digits padded to `cols`, trailing zeros from shift
  rawDigits: number[];   // actual multiplied digits (no trailing zeros)
  carryRow: number[];    // carry OUT per display col within this partial (0=MSB)
  shift: number;
}

interface MultSol {
  cols: number;
  topD: number[];
  botD: number[];
  partials: PartialProd[];
  answerD: number[];
}

function solveMult(top: number, bottom: number): MultSol {
  const td = toDigits(top), bd = toDigits(bottom);
  const product = top * bottom;
  const pd = toDigits(product);
  const partials: PartialProd[] = [];
  const bdR = [...bd].reverse();
  for (let shift = 0; shift < bdR.length; shift++) {
    const digit = bdR[shift];
    const tdR = [...td].reverse();
    const rawR: number[] = [], carryR: number[] = [];
    let c = 0;
    for (let j = 0; j < tdR.length; j++) {
      const p = tdR[j] * digit + c;
      rawR.push(p % 10);
      c = Math.floor(p / 10);
      carryR.push(c);
    }
    if (c > 0) rawR.push(c);
    const rawDigits = [...rawR].reverse();
    const fullLen = rawDigits.length + shift;
    const fullPad = new Array(fullLen).fill(0);
    rawDigits.forEach((v, j) => { fullPad[j] = v; });
    partials.push({ padded: fullPad, rawDigits, carryRow: carryR.reverse(), shift });
  }
  const cols = Math.max(pd.length, ...partials.map(p => p.padded.length));
  return {
    cols,
    topD: padLeft(td, cols),
    botD: bd,
    partials: partials.map(p => ({ ...p, padded: padLeft(p.padded, cols) })),
    answerD: padLeft(pd, cols),
  };
}

interface DivStep { working: number; quotDigit: number; subtracted: number; remainder: number; }
interface DivSol {
  dividendD: number[];
  divisor: number;
  quotientD: number[];
  remainder: number;
  steps: DivStep[];
}

function solveDiv(dividend: number, divisor: number): DivSol {
  const dividendD = toDigits(dividend);
  const quotientD = toDigits(Math.floor(dividend / divisor));
  const remainder = dividend % divisor;
  const steps: DivStep[] = [];
  let working = 0;
  for (let i = 0; i < dividendD.length; i++) {
    working = working * 10 + dividendD[i];
    if (working < divisor && i < dividendD.length - 1) continue;
    const qd = Math.floor(working / divisor);
    const sub = qd * divisor;
    steps.push({ working, quotDigit: qd, subtracted: sub, remainder: working - sub });
    working = working - sub;
  }
  return { dividendD, divisor, quotientD, remainder, steps };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const CW = 44;  // cell width px
const SW = 26;  // small (carry/borrow) cell width px

interface InputCellMeta { id: string; correct: string }

interface Props {
  exercise: ColumnArithmeticExercise;
  onDone: (correct: boolean) => void;
  isTeacher?: boolean;
}

export default function ColumnArithmetic({ exercise, onDone, isTeacher }: Props) {
  const { operation, top, bottom } = exercise;

  const addSol = operation === 'addition'       ? solveAdd(top, bottom)  : null;
  const subSol = operation === 'subtraction'    ? solveSub(top, bottom)  : null;
  const multSol = operation === 'multiplication' ? solveMult(top, bottom) : null;
  const divSol  = operation === 'division'       ? solveDiv(top, bottom)  : null;

  // Collect all expected inputs
  const allInputs: InputCellMeta[] = [];

  if (addSol) {
    addSol.carryIn.forEach((v, c) => { if (v > 0) allInputs.push({ id: `c-${c}`, correct: String(v) }); });
    addSol.answerD.forEach((v, c) => allInputs.push({ id: `a-${c}`, correct: String(v) }));
  }
  if (subSol) {
    const ansStart = subSol.answerD.findIndex(d => d !== 0);
    // Växling: reduced digit for each column that lends (its right neighbour borrows)
    subSol.borrows.forEach((v, c) => {
      if (v && c > 0) allInputs.push({ id: `reduced-${c - 1}`, correct: String(subSol.topReduced[c - 1]) });
    });
    // Answer digits – skip leading zeros
    subSol.answerD.forEach((v, c) => {
      if (c >= (ansStart < 0 ? subSol.cols : ansStart)) allInputs.push({ id: `a-${c}`, correct: String(v) });
    });
  }
  if (multSol) {
    multSol.partials.forEach((pp, pi) => {
      // carry inputs for this partial product
      pp.carryRow.forEach((v, ci) => {
        if (v > 0) allInputs.push({ id: `mc-${pi}-${ci}`, correct: String(v) });
      });
      // partial product digit inputs
      for (let c = 0; c < multSol.cols; c++) {
        const inRawZone = c >= multSol.cols - pp.rawDigits.length - pp.shift && c < multSol.cols - pp.shift;
        if (inRawZone) allInputs.push({ id: `pp-${pi}-${c}`, correct: String(pp.padded[c]) });
      }
    });
    if (multSol.botD.length > 1) {
      multSol.answerD.forEach((v, c) => allInputs.push({ id: `fa-${c}`, correct: String(v) }));
    }
  }
  if (divSol) {
    divSol.quotientD.forEach((v, i) => allInputs.push({ id: `q-${i}`, correct: String(v) }));
    divSol.steps.forEach((step, si) => {
      toDigits(step.subtracted).forEach((d, di) => allInputs.push({ id: `dp-${si}-${di}`, correct: String(d) }));
      allInputs.push({ id: `dr-${si}`, correct: String(step.remainder) });
    });
  }

  const [vals, setVals] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [cellOk, setCellOk] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const focusNext = useCallback((id: string) => {
    const idx = allInputs.findIndex(x => x.id === id);
    if (idx < allInputs.length - 1) {
      setTimeout(() => inputRefs.current[allInputs[idx + 1].id]?.focus(), 40);
    }
  }, [allInputs]);

  function handleInput(id: string, raw: string) {
    if (checked) return;
    const digit = raw.replace(/\D/g, '').slice(-1);
    setVals(prev => ({ ...prev, [id]: digit }));
    if (digit) focusNext(id);
  }

  function handleCheck() {
    const res: Record<string, boolean> = {};
    allInputs.forEach(({ id, correct }) => { res[id] = (vals[id] ?? '') === correct; });
    setCellOk(res);
    setChecked(true);
    const ok = allInputs.every(({ id, correct }) => (vals[id] ?? '') === correct);
    // Delay onDone so student sees colored cells before advancing
    setTimeout(() => onDone(ok), 600);
  }

  function handleReveal() {
    const auto: Record<string, string> = {};
    allInputs.forEach(({ id, correct }) => { auto[id] = correct; });
    setVals(auto);
    const res = Object.fromEntries(allInputs.map(({ id }) => [id, true]));
    setCellOk(res);
    setChecked(true);
    setTimeout(() => onDone(true), 600);
  }

  const allFilled = allInputs.every(({ id }) => (vals[id] ?? '') !== '');
  const allCorrect = checked && allInputs.every(({ id }) => cellOk[id]);

  // ── Sub-components ──────────────────────────────────────────────────────────

  function InputCell({ id, small }: { id: string; small?: boolean }) {
    const meta = allInputs.find(x => x.id === id);
    const val = vals[id] ?? '';
    const ok = checked ? cellOk[id] : undefined;
    const sz = small ? SW : CW;
    return (
      <div style={{ width: sz, height: sz }} className="relative flex items-center justify-center flex-shrink-0">
        {isTeacher && !checked && meta && (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-400 pointer-events-none">
            {meta.correct}
          </span>
        )}
        <input
          ref={el => { inputRefs.current[id] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={e => handleInput(id, e.target.value)}
          disabled={checked}
          className={`
            w-full h-full text-center font-black rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
            ${small ? 'text-sm' : 'text-lg'}
            ${ok === true  ? 'bg-green-100 border-green-500 text-green-700' :
              ok === false ? 'bg-red-100 border-red-400 text-red-700' :
                             'bg-white border-gray-300 text-gray-800 hover:border-blue-400'}
          `}
        />
      </div>
    );
  }

  function Digit({ v, dim, small }: { v: string | number; dim?: boolean; small?: boolean }) {
    const sz = small ? SW : CW;
    return (
      <div style={{ width: sz, height: sz }} className={`flex items-center justify-center font-black flex-shrink-0 ${small ? 'text-sm' : 'text-lg'} ${dim ? 'text-gray-300' : 'text-gray-700'}`}>
        {v}
      </div>
    );
  }

  function Op({ v }: { v: string }) {
    return <div style={{ width: CW, height: CW }} className="flex items-center justify-center text-xl font-black text-gray-500 flex-shrink-0">{v}</div>;
  }

  function Gap({ small }: { small?: boolean }) {
    const sz = small ? SW : CW;
    return <div style={{ width: sz, height: sz }} className="flex-shrink-0" />;
  }

  function HRule({ colCount }: { colCount: number }) {
    return (
      <div className="flex" style={{ paddingLeft: CW }}>
        <div className="border-t-4 border-gray-700 rounded" style={{ width: colCount * CW + 4 }} />
      </div>
    );
  }

  // ── Addition render ─────────────────────────────────────────────────────────
  function AdditionGrid() {
    if (!addSol) return null;
    const { cols, topD, botD, carryIn, answerD } = addSol;
    // Determine where top/bot leading zeros should be hidden
    const topStart = topD.findIndex(d => d !== 0);
    const botStart = botD.findIndex(d => d !== 0);
    return (
      <div className="flex flex-col gap-1">
        {/* Carry row */}
        <div className="flex items-end" style={{ height: SW + 4 }}>
          <Gap />
          {carryIn.map((v, c) =>
            v > 0 ? <InputCell key={c} id={`c-${c}`} small /> : <Gap key={c} small />
          )}
        </div>
        {/* Top number */}
        <div className="flex items-center">
          <Gap />
          {topD.map((d, c) =>
            c < topStart ? <Gap key={c} /> : <Digit key={c} v={d} />
          )}
        </div>
        {/* Bottom number + operator */}
        <div className="flex items-center">
          <Op v="+" />
          {botD.map((d, c) =>
            c < botStart ? <Gap key={c} /> : <Digit key={c} v={d} />
          )}
        </div>
        <HRule colCount={cols} />
        {/* Answer */}
        <div className="flex items-center">
          <Gap />
          {answerD.map((_, c) => <InputCell key={c} id={`a-${c}`} />)}
        </div>
      </div>
    );
  }

  // ── Subtraction render ──────────────────────────────────────────────────────
  // Swedish school format ("uppställning med växling"):
  //
  // Exempel 345 − 267:
  //   [2] [3]          ← växlingsrad: eleven skriver reducerade siffror
  //    3̶  ¹4̶  ¹5       ← originalsiffror: överstrukna om de gav bort,
  //  − 2   6   7           ¹ framför siffror som fick +10
  //  ──────────
  //        7   8       ← svar (ledande nolla hoppas över)

  function SubtractionGrid() {
    if (!subSol) return null;
    const { cols, topD, botD, borrows, answerD } = subSol;
    const hasBorrow = borrows.some(v => v > 0);
    const ansStart = answerD.findIndex(d => d !== 0);
    const safeAnsStart = ansStart < 0 ? cols : ansStart;
    const botStart = botD.findIndex(x => x !== 0);

    // Per column: does it lend (give away 1 to its right) or receive (+10 from its left)?
    const lends   = topD.map((_, c) => c < cols - 1 && borrows[c + 1] === 1);
    const receives = topD.map((_, c) => borrows[c] === 1);

    return (
      <div className="flex flex-col gap-1">
        {/* Växlingsrad: reduced digit above each column that lent */}
        {hasBorrow && (
          <div className="flex items-end" style={{ height: SW + 4 }}>
            <Gap />
            {topD.map((_, c) => {
              if (!lends[c]) return <Gap key={c} small />;
              // If this column also receives (+10), show tiny "¹" inside the small input
              return (
                <div key={c} className="relative flex-shrink-0" style={{ width: SW, height: SW }}>
                  {receives[c] && (
                    <span className="absolute -left-1.5 top-0 text-[9px] font-black text-red-500 leading-none select-none">1</span>
                  )}
                  <InputCell id={`reduced-${c}`} small />
                </div>
              );
            })}
          </div>
        )}
        {/* Top number */}
        <div className="flex items-center">
          <Gap />
          {topD.map((d, c) => (
            <div key={c} style={{ width: CW, height: CW }} className="relative flex items-center justify-center font-black text-lg flex-shrink-0">
              {/* Tiny "¹" on original digit only if it receives AND does NOT lend
                  (if it also lends, the "¹" is on the reduced cell above instead) */}
              {receives[c] && !lends[c] && (
                <span className="absolute -left-1 -top-0.5 text-[10px] font-black text-red-500 leading-none select-none">1</span>
              )}
              <span className={lends[c]
                ? 'line-through decoration-red-400 decoration-2 text-gray-400'
                : 'text-gray-700'}>
                {d}
              </span>
            </div>
          ))}
        </div>
        {/* Bottom + operator */}
        <div className="flex items-center">
          <Op v="−" />
          {botD.map((d, c) =>
            c < botStart ? <Gap key={c} /> : <Digit key={c} v={d} />
          )}
        </div>
        <HRule colCount={cols} />
        {/* Answer – leading zeros shown as gaps */}
        <div className="flex items-center">
          <Gap />
          {answerD.map((_, c) =>
            c < safeAnsStart ? <Gap key={c} /> : <InputCell key={c} id={`a-${c}`} />
          )}
        </div>
      </div>
    );
  }

  // ── Multiplication render ───────────────────────────────────────────────────
  function MultiplicationGrid() {
    if (!multSol) return null;
    const { cols, topD, botD, partials, answerD } = multSol;
    const twoRow = botD.length > 1;
    const botStart = cols - botD.length;
    return (
      <div className="flex flex-col gap-1">
        {/* Carry row for first partial */}
        {(() => {
          const pp = partials[0];
          const hasCarry = pp.carryRow.some(v => v > 0);
          if (!hasCarry) return null;
          return (
            <div className="flex items-end" style={{ height: SW + 4 }}>
              <Gap />
              {Array.from({ length: cols }, (_, c) => {
                // carryRow is indexed right-to-left in raw digits
                const rawOffset = cols - pp.rawDigits.length - pp.shift;
                const rawIdx = c - rawOffset;
                const carry = rawIdx >= 0 && rawIdx < pp.carryRow.length ? pp.carryRow[rawIdx] : 0;
                return carry > 0
                  ? <InputCell key={c} id={`mc-0-${c}`} small />
                  : <Gap key={c} small />;
              })}
            </div>
          );
        })()}
        {/* Top number */}
        <div className="flex items-center">
          <Gap />
          {topD.map((d, c) => <Digit key={c} v={d} />)}
        </div>
        {/* Bottom + operator */}
        <div className="flex items-center">
          <Op v="×" />
          {Array.from({ length: cols }, (_, c) =>
            c < botStart ? <Gap key={c} /> : <Digit key={c} v={botD[c - botStart]} />
          )}
        </div>
        <HRule colCount={cols} />
        {/* Partial product rows */}
        {partials.map((pp, pi) => (
          <React.Fragment key={pi}>
            {pi > 0 && (
              <div className="flex items-end" style={{ height: SW + 4 }}>
                <Gap />
                {Array.from({ length: cols }, (_, c) => {
                  const rawOffset = cols - pp.rawDigits.length - pp.shift;
                  const rawIdx = c - rawOffset;
                  const carry = rawIdx >= 0 && rawIdx < pp.carryRow.length ? pp.carryRow[rawIdx] : 0;
                  return carry > 0
                    ? <InputCell key={c} id={`mc-${pi}-${c}`} small />
                    : <Gap key={c} small />;
                })}
              </div>
            )}
            <div className="flex items-center">
              <Gap />
              {Array.from({ length: cols }, (_, c) => {
                const inRaw = c >= cols - pp.rawDigits.length - pp.shift && c < cols - pp.shift;
                const isTrail = pp.shift > 0 && c >= cols - pp.shift;
                if (inRaw) return <InputCell key={c} id={`pp-${pi}-${c}`} />;
                if (isTrail) return <Digit key={c} v={0} dim />;
                return <Gap key={c} />;
              })}
            </div>
          </React.Fragment>
        ))}
        {twoRow && (
          <>
            <HRule colCount={cols} />
            <div className="flex items-center">
              <Gap />
              {answerD.map((_, c) => <InputCell key={c} id={`fa-${c}`} />)}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Division render ─────────────────────────────────────────────────────────
  function DivisionGrid() {
    if (!divSol) return null;
    const { dividendD, divisor, quotientD, remainder, steps } = divSol;
    // Align quotient digits with dividend digits
    // The quotient has length steps.length (one digit per step)
    const divWidth = dividendD.length * CW;
    const divisorStr = String(divisor);
    return (
      <div className="flex flex-col" style={{ fontFamily: 'monospace' }}>
        {/* Header row: divisor ) dividend, quotient above */}
        <div className="flex">
          {/* Divisor + bracket */}
          <div className="flex items-end pb-1 pr-1 flex-shrink-0">
            <span className="text-xl font-black text-gray-700">{divisorStr}</span>
            <span className="text-2xl text-gray-400 ml-0.5" style={{ lineHeight: 1 }}>)</span>
          </div>
          <div className="flex flex-col">
            {/* Quotient input row */}
            <div className="flex">
              {quotientD.map((_, i) => <InputCell key={i} id={`q-${i}`} />)}
              {steps.length < dividendD.length &&
                Array.from({ length: dividendD.length - steps.length }, (_, i) => <Gap key={i} />)
              }
            </div>
            {/* Line under quotient */}
            <div className="border-t-4 border-gray-700" style={{ width: divWidth }} />
            {/* Dividend */}
            <div className="flex">
              {dividendD.map((d, i) => <Digit key={i} v={d} />)}
            </div>
          </div>
        </div>
        {/* Steps */}
        {steps.map((step, si) => {
          const subDigits = toDigits(step.subtracted);
          const indent = (si) * CW;
          return (
            <div key={si} style={{ paddingLeft: (divisorStr.length + 1) * 10 + indent }} className="flex flex-col">
              {/* Subtracted row */}
              <div className="flex items-center">
                <div style={{ width: CW }} className="flex items-center justify-center text-gray-400 font-bold text-lg">−</div>
                <div className="flex">
                  {subDigits.map((d, di) => <InputCell key={di} id={`dp-${si}-${di}`} />)}
                </div>
              </div>
              {/* Line */}
              <div style={{ marginLeft: CW }} className="border-t-2 border-gray-500" />
              {/* Remainder */}
              <div className="flex">
                <Gap />
                <InputCell id={`dr-${si}`} />
              </div>
            </div>
          );
        })}
        {remainder > 0 && (
          <p className="text-sm text-gray-500 mt-2 pl-1">Rest: {remainder}</p>
        )}
      </div>
    );
  }

  // ── Layout ──────────────────────────────────────────────────────────────────
  const opLabel: Record<string, string> = {
    addition: 'Addition med uppställning',
    subtraction: 'Subtraktion med uppställning',
    multiplication: 'Multiplikation med uppställning',
    division: 'Division med uppställning',
  };
  const opColor: Record<string, string> = {
    addition:       'bg-green-100 text-green-700',
    subtraction:    'bg-orange-100 text-orange-700',
    multiplication: 'bg-purple-100 text-purple-700',
    division:       'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${opColor[operation]}`}>
        🔢 {opLabel[operation]}
      </span>

      <div className="bg-white rounded-2xl shadow-inner border border-gray-100 p-5 overflow-x-auto max-w-full">
        {operation === 'addition'       && <AdditionGrid />}
        {operation === 'subtraction'    && <SubtractionGrid />}
        {operation === 'multiplication' && <MultiplicationGrid />}
        {operation === 'division'       && <DivisionGrid />}
      </div>

      {!checked && (
        <p className="text-xs text-gray-400 text-center">
          {operation === 'subtraction'
            ? 'Räkna från höger till vänster. Visa växling genom att fylla i den nya siffran.'
            : 'Fyll i alla rutor — ental under ental, tiotal under tiotal'}
        </p>
      )}

      {checked && (
        <div className={`w-full rounded-2xl p-4 text-center font-bold text-base ${
          allCorrect
            ? 'bg-green-50 border border-green-300 text-green-700'
            : 'bg-amber-50 border border-amber-300 text-amber-700'
        }`}>
          {allCorrect
            ? '🎉 Perfekt! Alla siffror är rätt!'
            : '🔍 Kontrollera de röda rutorna och försök igen nästa gång!'}
        </div>
      )}

      {!checked && (
        <div className="flex gap-3 w-full">
          <button
            onClick={handleCheck}
            disabled={!allFilled}
            className={`flex-1 py-3 rounded-2xl font-black text-lg shadow transition-all
              ${allFilled
                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Kontrollera ✓
          </button>
          {isTeacher && (
            <button
              onClick={handleReveal}
              className="px-4 py-3 rounded-2xl font-bold text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            >
              Visa svar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
