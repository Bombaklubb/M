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

/**
 * Hur länge berömmet står kvar, i millisekunder.
 *
 * Måste hållas i synk med `animation.berom` i tailwind.config.js – blir den
 * här kortare klipps bilden bort mitt i, blir den längre står en osynlig
 * bild kvar och blockerar ingenting men lever i onödan.
 *
 * 1800 ms och inte 700: den gröna blixten var förut både signal OCH bärare
 * av emojin, och tonade bort direkt. Emojin var i praktiken tydlig i
 * ett par tiondelar. Läraren rapporterade att eleverna inte hann uppfatta
 * den, vilket stämmer – en elev i den här gruppen behöver längre tid på sig
 * att flytta blicken och tolka en bild än en läsande jämnårig.
 */
export const BEROM_MS = 1800;

/** Den gröna/gula blixten. Kort med flit – den är signal, inte innehåll. */
export const BLIXT_MS = 700;

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
    /* Blixten och bilden ligger i SKILDA element med var sin animation.
       Låg de i samma – som förut – tvingades emojin tona bort i samma takt
       som den gröna bakgrunden, och kunde inte stå kvar längre än den.
       Nu hinner skärmen bli ren igen medan berömmet fortfarande syns. */
    <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center" aria-hidden>
      <div
        className={`absolute inset-0 animate-flash-ok ${
          ok ? 'bg-lime-400/70' : 'bg-amberx-300/60'
        }`}
      />
      <div
        className={`relative rounded-full bg-white/90 p-8 shadow-pop ${
          ok ? 'animate-berom' : 'animate-flash-ok'
        }`}
      >
        {ok ? (
          <span className="block text-[6rem] leading-none">{emoji}</span>
        ) : (
          <RotateCcw className="h-24 w-24 text-amberx-600" strokeWidth={4} />
        )}
      </div>
    </div>
  );
}
