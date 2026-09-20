import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

export type FeedbackState = 'none' | 'correct' | 'miss';

/**
 * Rätt/fel signaleras med ljud + färg + ikon – aldrig med text, och aldrig
 * med bara färg (en färgblind elev måste se skillnaden på ikonen).
 *
 * Fel ger en gul pil-runt-symbol, inte ett rött kryss. Det betyder "försök
 * igen", inte "du hade fel".
 */

/**
 * Beröm som bild.
 *
 * Slumpas fram vid varje rätt svar i stället för att vara samma varje gång.
 * En elev gör åtta uppgifter i rad; samma bock åtta gånger slutar synas,
 * medan en ny glad bild varje gång fortsätter betyda något. Alla är entydigt
 * positiva och läsbara utan text.
 */
const BEROM = ['👍', '🎉', '⭐', '🌟', '💪', '🙌', '😄', '🏆', '✨', '🥳', '👏', '🚀'];

export function FeedbackOverlay({ state }: { state: FeedbackState }) {
  const [emoji, setEmoji] = useState(BEROM[0]);

  // Ny bild varje gång berömmet tänds, inte vid varje omrendering – annars
  // skulle den hoppa mitt under animationen.
  useEffect(() => {
    if (state === 'correct') {
      setEmoji(BEROM[Math.floor(Math.random() * BEROM.length)]);
    }
  }, [state]);

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
          <span className="block text-[6rem] leading-none">{emoji}</span>
        ) : (
          <RotateCcw className="h-24 w-24 text-amberx-600" strokeWidth={4} />
        )}
      </div>
    </div>
  );
}
