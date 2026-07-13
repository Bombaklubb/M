import React, { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { shuffle } from '../../utils/shuffle';

export default function MatchaTab({ concepts, progressHex, accentHex }: {
  concepts: { term: string; definition: string }[];
  progressHex: string;
  accentHex: string;
}) {
  const shuffledDefs = useMemo(() => shuffle(concepts), [concepts.map(c => c.term).join()]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<{ term: string; def: string; ok: boolean } | null>(null);

  if (concepts.length === 0) return <p className="text-sm text-gray-500 text-center py-8">Inga begrepp finns att matcha.</p>;

  const allDone = matched.size === concepts.length;

  function pickTerm(term: string) {
    if (matched.has(term)) return;
    setSelectedTerm(t => t === term ? null : term);
  }

  function pickDef(def: string, correctTerm: string) {
    if (!selectedTerm || matched.has(correctTerm)) return;
    const isOk = selectedTerm === correctTerm;
    setFlash({ term: selectedTerm, def, ok: isOk });
    if (isOk) {
      setMatched(prev => new Set([...prev, correctTerm]));
      setSelectedTerm(null);
    } else {
      setTimeout(() => { setFlash(null); setSelectedTerm(null); }, 700);
    }
  }

  function reset() { setMatched(new Set()); setSelectedTerm(null); setFlash(null); }

  return (
    <div>
      <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-4">
        Välj ett begrepp, välj sedan rätt förklaring
      </p>

      {allDone ? (
        <div className="clay-card p-6 text-center mb-4">
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-heading font-bold text-lg text-gray-800 mb-1">Alla matchade!</p>
          <p className="text-sm text-gray-500 mb-4">Du kopplade ihop alla begrepp rätt.</p>
          <button onClick={reset} className="btn-clay flex items-center gap-2 mx-auto px-5 py-2.5 text-sm font-heading bg-white border-gray-200 text-gray-700">
            <RotateCcw size={14} /> Börja om
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Terms */}
          <div className="space-y-2">
            <p className="text-xs font-black text-center text-gray-400 mb-2 uppercase tracking-wide">Begrepp</p>
            {concepts.map(c => {
              const isMatched = matched.has(c.term);
              const isSelected = selectedTerm === c.term;
              const isFlashing = flash?.term === c.term;
              let style: React.CSSProperties = { background: 'white', borderColor: '#e5e7eb', color: '#374151' };
              if (isMatched) style = { background: `${progressHex}18`, borderColor: progressHex, color: progressHex };
              else if (isSelected) style = { background: `${accentHex}18`, borderColor: accentHex, color: '#1f2937' };
              else if (isFlashing && flash && !flash.ok) style = { background: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' };
              return (
                <button key={c.term} onClick={() => pickTerm(c.term)} disabled={isMatched}
                  className="w-full p-2.5 rounded-xl border-2 text-xs font-black text-center transition-all active:scale-95 cursor-pointer disabled:cursor-default leading-snug"
                  style={style}>
                  {isMatched ? '✓ ' : ''}{c.term}
                </button>
              );
            })}
          </div>
          {/* Definitions */}
          <div className="space-y-2">
            <p className="text-xs font-black text-center text-gray-400 mb-2 uppercase tracking-wide">Förklaring</p>
            {shuffledDefs.map(c => {
              const isMatched = matched.has(c.term);
              const isFlashing = flash?.def === c.definition;
              let style: React.CSSProperties = { background: 'white', borderColor: '#e5e7eb', color: '#374151' };
              if (isMatched) style = { background: `${progressHex}18`, borderColor: progressHex, color: progressHex };
              else if (isFlashing && flash && !flash.ok) style = { background: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' };
              else if (selectedTerm) style = { background: '#eff6ff', borderColor: '#93c5fd', color: '#1e40af' };
              return (
                <button key={c.term} onClick={() => pickDef(c.definition, c.term)} disabled={isMatched || !selectedTerm}
                  className="w-full p-2.5 rounded-xl border-2 text-xs font-semibold text-left transition-all active:scale-95 cursor-pointer disabled:cursor-default leading-snug"
                  style={style}>
                  {c.definition}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
