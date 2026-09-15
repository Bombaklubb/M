import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { valjSvenskRost, talstodFinns } from '@/utils/tal';

const LAGRINGSNYCKEL = 'lasforstaelse_las_upp_fragor';

/**
 * Knapp som läser upp frågan och de fyra svarsalternativen.
 *
 * Texten har haft uppläsning länge, men frågan och alternativen har eleven
 * behövt läsa själv. För den som har svårt med avkodningen betyder det att
 * hjälpen tar slut just där uppgiften börjar: man har hört texten, men fastnar
 * på vad som efterfrågas.
 *
 * Valet sparas mellan texter. Den som behöver stödet behöver inte trycka på
 * knappen sextio gånger under en lektion – nästa fråga läses upp av sig själv.
 *
 * Alternativen läses med bokstav före, "A. En nalle", eftersom eleven ska
 * kunna koppla det hen hör till rätt knapp på skärmen.
 */

interface Props {
  fraga: string;
  alternativ: string[];
  /** Byts när eleven går till nästa fråga, så att uppläsningen startar om. */
  nyckel: number;
}

const BOKSTAV = ['A', 'B', 'C', 'D'];

function lasUppTexten(fraga: string, alternativ: string[]): string {
  // Punkt efter bokstaven ger talsyntesen en paus, annars flyter alternativen
  // ihop till en enda mening.
  const delar = alternativ.map((a, i) => `${BOKSTAV[i]}. ${a}.`);
  return [fraga, ...delar].join(' ');
}

export const FragaUpplasning: React.FC<Props> = ({ fraga, alternativ, nyckel }) => {
  const [pa, setPa] = useState(() => {
    try {
      return localStorage.getItem(LAGRINGSNYCKEL) === 'ja';
    } catch {
      return false;
    }
  });
  const [talar, setTalar] = useState(false);
  const [stods] = useState(talstodFinns);
  const rostRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!stods) return;
    const valj = () => { rostRef.current = valjSvenskRost(); };
    valj();
    window.speechSynthesis.onvoiceschanged = valj;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [stods]);

  const stoppa = useCallback(() => {
    if (!stods) return;
    window.speechSynthesis.cancel();
    setTalar(false);
  }, [stods]);

  const tala = useCallback(() => {
    if (!stods) return;
    // Avbryter allt som redan låter, inklusive uppläsningen av själva texten.
    // Talsyntesen är delad av hela sidan, och två röster samtidigt hjälper
    // ingen.
    window.speechSynthesis.cancel();

    const yttrande = new SpeechSynthesisUtterance(lasUppTexten(fraga, alternativ));
    yttrande.lang = 'sv-SE';
    yttrande.rate = 0.95;
    if (rostRef.current) yttrande.voice = rostRef.current;

    const avsluta = () => setTalar(false);
    yttrande.onend = avsluta;
    yttrande.onerror = avsluta;

    setTalar(true);
    window.speechSynthesis.speak(yttrande);
  }, [stods, fraga, alternativ]);

  // Läs upp nästa fråga automatiskt när eleven bläddrar vidare, men bara när
  // valet är påslaget.
  useEffect(() => {
    if (!pa) return;
    tala();
    return stoppa;
    // Avsiktligt bara nyckeln och på-läget: tala() byts vid varje rendering
    // och skulle annars starta om uppläsningen i onödan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nyckel, pa]);

  // Tystna när komponenten försvinner, till exempel när eleven rättar svaren.
  useEffect(() => stoppa, [stoppa]);

  if (!stods) return null;

  const vaxla = () => {
    const nytt = !pa;
    setPa(nytt);
    try {
      localStorage.setItem(LAGRINGSNYCKEL, nytt ? 'ja' : 'nej');
    } catch {
      // Privat läge kan neka skrivning. Valet gäller då bara denna session.
    }
    // Ingen tala() här. Effekten ovan reagerar på att pa ändras och startar
    // uppläsningen, och ett anrop här skulle ge två yttranden för samma fråga.
    if (!nytt) stoppa();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={vaxla}
        aria-pressed={pa}
        title={
          pa
            ? 'Frågan läses upp automatiskt. Klicka för att stänga av.'
            : 'Läs upp frågan och svarsalternativen'
        }
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
          pa
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
        )}
      >
        {/* Hela etiketten ryms inte bredvid frågetypen på en telefon. Där
            räcker "Läs" – knappen sitter direkt ovanför frågan. */}
        🔊 Läs<span className="hidden sm:inline"> frågan</span>
      </button>

      {/* Egen knapp för att höra om, utan att behöva stänga av och på valet. */}
      {pa && (
        <button
          type="button"
          onClick={talar ? stoppa : tala}
          className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          title={talar ? 'Stoppa uppläsningen' : 'Hör frågan igen'}
          aria-label={talar ? 'Stoppa uppläsningen' : 'Hör frågan igen'}
        >
          {talar ? '⏹' : '↻'}
          <span className="hidden sm:inline">{talar ? ' Stoppa' : ' Hör igen'}</span>
        </button>
      )}
    </div>
  );
};

export default FragaUpplasning;
