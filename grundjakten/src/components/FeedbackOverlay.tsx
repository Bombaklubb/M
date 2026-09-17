import { Check, RotateCcw } from 'lucide-react';

export type FeedbackState = 'none' | 'correct' | 'miss';

/**
 * Rätt/fel signaleras med ljud + färg + ikon – aldrig med text, och aldrig
 * med bara färg (en färgblind elev måste se skillnaden på ikonen).
 *
 * Fel ger en gul pil-runt-symbol, inte ett rött kryss. Det betyder "försök
 * igen", inte "du hade fel".
 */
export function FeedbackOverlay({ state }: { state: FeedbackState }) {
  if (state === 'none') return null;

  const ok = state === 'correct';
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 grid place-items-center animate-flash-ok ${
        ok ? 'bg-lime-400/70' : 'bg-amberx-300/60'
      }`}
      aria-hidden
    >
      <div className="animate-pop-in rounded-full bg-white/90 p-8 shadow-pop">
        {ok ? (
          <Check className="h-24 w-24 text-lime-600" strokeWidth={4} />
        ) : (
          <RotateCcw className="h-24 w-24 text-amberx-600" strokeWidth={4} />
        )}
      </div>
    </div>
  );
}
