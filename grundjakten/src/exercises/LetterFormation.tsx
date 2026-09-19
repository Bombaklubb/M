import { useCallback, useEffect, useRef, useState } from 'react';
import type { LetterFormationEx } from '@/types';
import { LETTER_BY_ID } from '@/data/letters';
import { play } from '@/lib/audio';
import { playCorrect, playPlace } from '@/lib/sfx';
import { cn } from '@/lib/utils';
import { EarButton } from '@/components/EarButton';

/**
 * Forma bokstaven.
 *
 * Två steg: först VISAR appen hur bokstaven skrivs, drag för drag. Sedan får
 * eleven rita den själv med muspekaren eller fingret.
 *
 * Bedömningen är avsiktligt generös. Målet är att eleven ska följa formen och
 * skrivriktningen, inte att träffa en linje på pixeln – en Chromebook-
 * styrplatta duger inte till det, och en elev med motoriska svårigheter ska
 * inte fastna här. Därför:
 *  - täckningen mäts mot punkter längs förlagan, inte tvärtom
 *  - tröskeln är låg (60 %) och toleransen bred (14 enheter av 100)
 *  - efter två försök godkänns det oavsett, precis som resten av appen aldrig
 *    låter ett pass gå att köra fast i
 */

/** Hur nära förlagan en punkt måste vara för att räknas, i viewBox-enheter. */
const TOLERANS = 14;
/** Andel av förlagans punkter som måste vara täckta. */
const KRAV = 0.6;
/** Efter så här många försök godkänns det oavsett. */
const MAX_FORSOK = 2;

/**
 * Hur länge ett drag ritas, och hur lång paus det är mellan dragen.
 *
 * Takten är satt efter en elev som ska HINNA FÖLJA pennan med blicken, inte
 * efter vad som ser bra ut. Den som inte kan skriva behöver se var draget
 * börjar, åt vilket håll det går och var det slutar – och det tar tid.
 *
 * Kurvan är `linear` med flit. `ease-out` rusar igång och bromsar på slutet,
 * alltså snabbast just i början av draget, som är precis den del eleven ska
 * lära sig. En hand som skriver håller jämn fart.
 */
const DRAG_SEKUNDER = 2;
const DRAG_PAUS = 2.4;

type Fas = 'visar' | 'ritar';

interface Punkt {
  x: number;
  y: number;
}

export function LetterFormation({
  exercise,
  onAnswer,
  locked,
}: {
  exercise: LetterFormationEx;
  onAnswer: (correct: boolean) => void;
  locked: boolean;
}) {
  const letter = LETTER_BY_ID[exercise.letterId];
  const svgRef = useRef<SVGSVGElement | null>(null);
  const forlagaRefs = useRef<(SVGPathElement | null)[]>([]);

  const [fas, setFas] = useState<Fas>('visar');
  const [visningsNyckel, setVisningsNyckel] = useState(0);
  const [drag, setDrag] = useState<Punkt[][]>([]);
  const [ritar, setRitar] = useState(false);
  const [forsok, setForsok] = useState(0);
  const [nastan, setNastan] = useState(false);

  useEffect(() => {
    setFas('visar');
    setVisningsNyckel((k) => k + 1);
    setDrag([]);
    setForsok(0);
    setNastan(false);
  }, [exercise.id]);

  /** Skärmkoordinat → viewBox-koordinat (0–100). */
  const tillViewBox = useCallback((e: React.PointerEvent): Punkt | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  }, []);

  const startaDrag = (e: React.PointerEvent) => {
    if (locked || fas !== 'ritar') return;
    const p = tillViewBox(e);
    if (!p) return;
    // Pekaren fångas, annars tappas spåret om fingret glider utanför rutan.
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setRitar(true);
    setNastan(false);
    setDrag((d) => [...d, [p]]);
  };

  const fortsattDrag = (e: React.PointerEvent) => {
    if (!ritar || locked) return;
    const p = tillViewBox(e);
    if (!p) return;
    setDrag((d) => {
      if (d.length === 0) return d;
      const sista = d[d.length - 1];
      // Hoppa över nästan identiska punkter – annars växer listan i onödan.
      const f = sista[sista.length - 1];
      if (Math.hypot(p.x - f.x, p.y - f.y) < 1) return d;
      return [...d.slice(0, -1), [...sista, p]];
    });
  };

  const slutaDrag = () => setRitar(false);

  /**
   * Hur stor del av förlagan som eleven ritat över.
   *
   * Mäts genom att gå längs varje förlagedrag och kolla om någon ritad punkt
   * ligger inom toleransen. Åt det hållet, inte tvärtom: ett extra kladd
   * utanför bokstaven ska inte sänka resultatet, men en bokstav där halva
   * formen saknas ska inte godkännas.
   */
  const tackning = (): number => {
    const ritade = drag.flat();
    if (ritade.length === 0) return 0;

    let total = 0;
    let traffar = 0;

    for (const path of forlagaRefs.current) {
      if (!path) continue;
      const langd = path.getTotalLength();
      if (!langd) continue;
      const steg = Math.max(6, Math.round(langd / 4));
      for (let i = 0; i <= steg; i++) {
        const mal = path.getPointAtLength((i / steg) * langd);
        total += 1;
        if (ritade.some((p) => Math.hypot(p.x - mal.x, p.y - mal.y) <= TOLERANS)) {
          traffar += 1;
        }
      }
    }
    return total === 0 ? 0 : traffar / total;
  };

  const klar = () => {
    if (locked) return;
    const t = tackning();
    const nyttForsok = forsok + 1;
    setForsok(nyttForsok);

    if (t >= KRAV || nyttForsok >= MAX_FORSOK) {
      playCorrect();
      void play(letter.keyword.phrase);
      onAnswer(true);
      return;
    }

    // För lite av formen täckt: visa förlagan igen och låt eleven prova om.
    // Inget avdrag, ingen röd markering.
    playPlace();
    setNastan(true);
    setDrag([]);
    setVisningsNyckel((k) => k + 1);
  };

  const harRitat = drag.some((d) => d.length > 1);

  return (
    <div className="flex flex-col items-center gap-3 [@media(min-height:760px)]:gap-5">
      <div className="flex items-center gap-3">
        <span className="reading text-4xl font-extrabold text-brand-600 dark:text-brand-300">
          {letter.upper}{letter.lower}
        </span>
        <EarButton token={letter.keyword.phrase} label={letter.keyword.phrase.text} />
        <span className="text-4xl" aria-hidden>{letter.keyword.emoji}</span>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className={cn(
          'h-56 w-56 touch-none rounded-card border-4 bg-white dark:bg-ink-800',
          '[@media(min-height:700px)]:h-64 [@media(min-height:700px)]:w-64',
          '[@media(min-height:800px)]:h-72 [@media(min-height:800px)]:w-72',
          fas === 'ritar' ? 'cursor-crosshair border-lime-400' : 'border-ink-200',
          nastan && 'animate-nudge'
        )}
        role="img"
        aria-label={
          fas === 'visar'
            ? `Så här skriver man ${letter.upper}`
            : `Rita ${letter.upper} själv i rutan`
        }
        onPointerDown={startaDrag}
        onPointerMove={fortsattDrag}
        onPointerUp={slutaDrag}
        onPointerLeave={slutaDrag}
        onPointerCancel={slutaDrag}
      >
        {/* Blek förlaga – syns hela tiden, även medan eleven ritar. */}
        {letter.formation.strokes.map((d, i) => (
          <path
            key={`ghost-${i}`}
            ref={(el) => { forlagaRefs.current[i] = el; }}
            d={d}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Animerad visning av skrivriktningen. */}
        {fas === 'visar' &&
          letter.formation.strokes.map((d, i) => (
            <path
              key={`ink-${visningsNyckel}-${i}`}
              d={d}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100}
              className="stroke-demo"
              style={{
                animation: `draw-stroke ${DRAG_SEKUNDER}s linear ${i * DRAG_PAUS}s forwards`,
              }}
            />
          ))}

        {/* Elevens egna drag. */}
        {drag.map((linje, i) => (
          <polyline
            key={`mine-${i}`}
            points={linje.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#84cc16"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      <style>{`@keyframes draw-stroke { to { stroke-dashoffset: 0; } }`}</style>

      {fas === 'visar' && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Visa igen"
            onClick={() => setVisningsNyckel((k) => k + 1)}
            className="btn-pop grid h-12 w-20 min-h-0 place-items-center rounded-tile border-brand-700
                       bg-brand-500 text-2xl text-white
                       [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:text-3xl"
          >
            <span aria-hidden>🔁</span>
          </button>
          <button
            type="button"
            aria-label="Nu ritar jag själv"
            onClick={() => {
              setFas('ritar');
              setDrag([]);
              void play({ id: 'din-tur', text: 'Nu ritar du själv.', lang: 'sv-SE' });
            }}
            className="btn-pop flex h-12 min-h-0 items-center gap-3 rounded-tile border-lime-700
                       bg-lime-500 px-6 text-xl font-extrabold text-white
                       [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:px-7
                       [@media(min-height:760px)]:text-2xl"
          >
            <span aria-hidden>✏️</span> Min tur
          </button>
        </div>
      )}

      {fas === 'ritar' && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Sudda och börja om"
            onClick={() => { setDrag([]); setNastan(false); }}
            className="btn-pop grid h-12 w-20 min-h-0 place-items-center rounded-tile border-ink-300
                       bg-ink-100 text-xl dark:border-ink-600 dark:bg-ink-800
                       [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:text-2xl"
          >
            <span aria-hidden>🧽</span>
          </button>
          <button
            type="button"
            aria-label="Visa hur man gör igen"
            onClick={() => { setFas('visar'); setVisningsNyckel((k) => k + 1); }}
            className="btn-pop grid h-12 w-20 min-h-0 place-items-center rounded-tile border-brand-700
                       bg-brand-500 text-2xl text-white
                       [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:text-3xl"
          >
            <span aria-hidden>🔁</span>
          </button>
          <button
            type="button"
            aria-label="Klar"
            disabled={locked || !harRitat}
            onClick={klar}
            className="btn-pop grid h-12 w-28 min-h-0 place-items-center rounded-tile border-lime-700
                       bg-lime-500 text-2xl text-white disabled:opacity-40
                       [@media(min-height:760px)]:h-16 [@media(min-height:760px)]:w-32
                       [@media(min-height:760px)]:text-3xl"
          >
            <span aria-hidden>✓</span>
          </button>
        </div>
      )}
    </div>
  );
}
