import { useEffect, useState } from 'react';
import type { LetterFormationEx } from '@/types';
import { LETTER_BY_ID } from '@/data/letters';
import { play } from '@/lib/audio';

/**
 * Forma bokstaven.
 *
 * Animationen visar skrivriktningen drag för drag. Att spåra själv är
 * FRIVILLIGT och bedöms aldrig – styrplattespårning på en Chromebook är för
 * dålig för att någon ska bli stoppad av den. Eleven går vidare genom att
 * titta klart, inte genom att träffa rätt.
 */
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
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    setReplayKey((k) => k + 1);
  }, [exercise.id]);

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        key={replayKey}
        viewBox="0 0 100 100"
        className="h-64 w-64 rounded-card border-2 border-ink-200 bg-white dark:bg-ink-800"
        role="img"
        aria-label={`Så här skriver man ${letter.upper}`}
      >
        {/* Blek förlaga så eleven ser hela formen hela tiden. */}
        {letter.formation.strokes.map((d, i) => (
          <path key={`ghost-${i}`} d={d} fill="none" stroke="#e2e8f0" strokeWidth="9"
                strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {/* Animerade drag ovanpå. */}
        {letter.formation.strokes.map((d, i) => (
          <path
            key={`ink-${i}`}
            d={d}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100}
            style={{
              animation: `draw-stroke 1s ease-out ${i * 1.1}s forwards`,
            }}
          />
        ))}
      </svg>

      <style>{`@keyframes draw-stroke { to { stroke-dashoffset: 0; } }`}</style>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Visa igen"
          onClick={() => setReplayKey((k) => k + 1)}
          className="btn-pop rounded-tile border-brand-700 bg-brand-500 px-6 py-3 text-lg font-bold text-white"
        >
          <span aria-hidden>🔁</span>
        </button>
        <button
          type="button"
          aria-label={`Klart. ${letter.keyword.phrase.text}`}
          disabled={locked}
          onClick={() => {
            void play(letter.keyword.phrase);
            onAnswer(true);
          }}
          className="btn-pop rounded-tile border-lime-700 bg-lime-500 px-8 py-3 text-2xl font-bold text-white"
        >
          <span aria-hidden>✓</span>
        </button>
      </div>

      <p className="text-3xl" aria-hidden>
        {letter.keyword.emoji}
      </p>
    </div>
  );
}
