import { useState } from 'react';
import { shuffle } from '../../utils/shuffle';

export default function FlashcardsTab({ concepts, inkHex, progressHex, accentHex }: {
  concepts: { term: string; definition: string }[];
  inkHex: string;
  progressHex: string;
  accentHex: string;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(concepts);

  if (concepts.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-8">Inga begrepp finns för det här kapitlet.</p>;
  }

  const card = shuffled[idx];
  const total = shuffled.length;

  function go(dir: 1 | -1) {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i + dir + total) % total), 150);
  }

  function handleShuffle() {
    setShuffled(shuffle(shuffled));
    setIdx(0);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress */}
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-black text-gray-400">
          Kort {idx + 1} av {total}
        </span>
        <button
          onClick={handleShuffle}
          className="text-xs font-black flex items-center gap-1 cursor-pointer"
          style={{ color: progressHex }}
        >
          🔀 Blanda
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-gray-100 mb-6 overflow-hidden w-full">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((idx + 1) / total) * 100}%`, background: progressHex }}
        />
      </div>

      {/* Flip card */}
      <div
        className="flashcard-scene w-full cursor-pointer"
        style={{ maxWidth: '420px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flashcard-inner w-full${flipped ? ' is-flipped' : ''}`} style={{ height: '220px' }}>
          {/* Front — term */}
          <div
            className="flashcard-face absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(145deg, white, ${accentHex}10)`,
              border: `2.5px solid ${accentHex}40`,
              boxShadow: `0 6px 24px ${accentHex}22`,
            }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-50" style={{ color: inkHex }}>
              Begrepp
            </p>
            <p className="font-heading font-bold text-2xl leading-snug" style={{ color: inkHex }}>
              {card.term}
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-4">Tryck för att se förklaring</p>
          </div>

          {/* Back — definition */}
          <div
            className="flashcard-face flashcard-face-back absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(145deg, ${accentHex}18, ${accentHex}08)`,
              border: `2.5px solid ${accentHex}60`,
              boxShadow: `0 6px 24px ${accentHex}30`,
            }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-50" style={{ color: inkHex }}>
              Förklaring
            </p>
            <p className="text-sm font-semibold leading-relaxed text-gray-700">
              {card.definition}
            </p>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => go(-1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-all active:scale-95 cursor-pointer"
          style={{ background: `${progressHex}15`, border: `2px solid ${progressHex}30`, color: progressHex }}
        >
          ←
        </button>
        <button
          onClick={() => setFlipped(f => !f)}
          className="px-6 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all active:scale-95 cursor-pointer"
          style={{ background: progressHex, color: 'white' }}
        >
          {flipped ? 'Dölj svar' : 'Visa svar'}
        </button>
        <button
          onClick={() => go(1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-all active:scale-95 cursor-pointer"
          style={{ background: `${progressHex}15`, border: `2px solid ${progressHex}30`, color: progressHex }}
        >
          →
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-4 flex-wrap justify-center" style={{ maxWidth: '280px' }}>
        {shuffled.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); setFlipped(false); }}
            className="w-2 h-2 rounded-full transition-all cursor-pointer"
            style={{ background: i === idx ? progressHex : `${progressHex}30` }}
          />
        ))}
      </div>
    </div>
  );
}
