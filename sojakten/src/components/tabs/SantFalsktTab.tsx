import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Celebration from '../Celebration';

export default function SantFalsktTab({ items, progressHex, accentHex }: {
  items: { statement: string; isTrue: boolean; explanation: string }[];
  progressHex: string;
  accentHex: string;
}) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (items.length === 0) return <p className="text-sm text-gray-500 text-center py-8">Inga sant/falskt-påståenden finns för det här kapitlet.</p>;

  const current = items[idx];
  const total = items.length;

  function answer(choice: boolean) {
    if (answered !== null) return;
    setAnswered(choice);
    if (choice === current.isTrue) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= total) { setDone(true); }
      else { setIdx(i => i + 1); setAnswered(null); }
    }, 1100);
  }

  function reset() { setIdx(0); setAnswered(null); setScore(0); setDone(false); }

  if (done) return (
    <div className="clay-card p-6 text-center">
      {score === total && <Celebration />}
      <p className="text-5xl mb-3">{score === total ? '🏆' : score >= total / 2 ? '👍' : '💪'}</p>
      <p className="font-heading font-bold text-xl text-gray-800 mb-1">{score} / {total} rätt</p>
      <p className="text-sm text-gray-500 mb-5">{score === total ? 'Perfekt! Du kan allt!' : score >= total / 2 ? 'Bra jobbat!' : 'Öva lite till!'}</p>
      <button onClick={reset} className="btn-clay flex items-center gap-2 mx-auto px-5 py-3 text-sm font-heading bg-white border-gray-200 text-gray-700">
        <RotateCcw size={15} /> Försök igen
      </button>
    </div>
  );

  const isCorrect = answered !== null && answered === current.isTrue;
  const isWrong   = answered !== null && answered !== current.isTrue;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black text-gray-400">Påstående {idx + 1} av {total}</span>
        <span className="text-xs font-black" style={{ color: progressHex }}>{score} rätt</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 mb-5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(idx / total) * 100}%`, background: progressHex }} />
      </div>

      <div className="clay-card p-5 mb-4 text-center min-h-[100px] flex items-center justify-center"
        style={isCorrect ? { borderColor: '#86efac', background: '#f0fdf4' } : isWrong ? { borderColor: '#fca5a5', background: '#fef2f2' } : {}}>
        <p className="font-semibold text-gray-800 text-base leading-relaxed">{current.statement}</p>
      </div>

      {answered !== null && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm font-semibold leading-relaxed"
          style={isCorrect ? { background: '#dcfce7', color: '#15803d' } : { background: '#fee2e2', color: '#dc2626' }}>
          {isCorrect ? '✅ Rätt! ' : '❌ Fel! '}{current.explanation}
        </div>
      )}

      {answered === null && (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => answer(true)} className="py-4 rounded-2xl text-base font-black transition-all active:scale-95 cursor-pointer" style={{ background: '#dcfce7', border: '2px solid #86efac', color: '#15803d' }}>
            ✅ Sant
          </button>
          <button onClick={() => answer(false)} className="py-4 rounded-2xl text-base font-black transition-all active:scale-95 cursor-pointer" style={{ background: '#fee2e2', border: '2px solid #fca5a5', color: '#dc2626' }}>
            ❌ Falskt
          </button>
        </div>
      )}
    </div>
  );
}
