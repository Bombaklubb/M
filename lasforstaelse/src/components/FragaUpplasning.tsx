import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { valjSvenskRost, talstodFinns } from '@/utils/tal';

/**
 * Två knappar som läser upp frågan respektive svarsalternativen.
 *
 * Texten har haft uppläsning länge, men frågan och alternativen har eleven
 * behövt läsa själv. För den som kämpar med avkodningen tar hjälpen slut just
 * där uppgiften börjar: man har hört texten men fastnar på vad som efterfrågas.
 *
 * Frågan och svaren är skilda åt med flit. En elev som förstått frågan men
 * behöver höra alternativen igen ska slippa lyssna på hela frågan en gång till,
 * och tvärtom. Det är också färre ord att hålla i huvudet per knapptryck.
 *
 * Ett tryck på en knapp som redan läser stoppar uppläsningen.
 */

interface Props {
  fraga: string;
  alternativ: string[];
  /** Byts när eleven går till nästa fråga, så att uppläsningen tystnar. */
  nyckel: number;
}

const BOKSTAV = ['A', 'B', 'C', 'D'];

type Vad = 'fraga' | 'svar';

export const FragaUpplasning: React.FC<Props> = ({ fraga, alternativ, nyckel }) => {
  const [talar, setTalar] = useState<Vad | null>(null);
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
    setTalar(null);
  }, [stods]);

  const tala = useCallback(
    (vad: Vad) => {
      if (!stods) return;

      // Ett tryck på den knapp som redan läser stänger av.
      if (talar === vad) {
        stoppa();
        return;
      }

      // Avbryter allt som redan låter, inklusive uppläsningen av själva
      // texten. Talsyntesen är delad av hela sidan, och två röster samtidigt
      // hjälper ingen.
      window.speechSynthesis.cancel();

      // Punkt efter bokstaven ger talsyntesen en paus. Utan den flyter
      // alternativen ihop till en enda mening, och eleven kan inte koppla det
      // hen hör till rätt knapp på skärmen.
      const text =
        vad === 'fraga'
          ? fraga
          : alternativ.map((a, i) => `${BOKSTAV[i]}. ${a}.`).join(' ');

      const yttrande = new SpeechSynthesisUtterance(text);
      yttrande.lang = 'sv-SE';
      yttrande.rate = 0.95;
      if (rostRef.current) yttrande.voice = rostRef.current;

      const avsluta = () => setTalar(null);
      yttrande.onend = avsluta;
      yttrande.onerror = avsluta;

      setTalar(vad);
      window.speechSynthesis.speak(yttrande);
    },
    [stods, talar, stoppa, fraga, alternativ]
  );

  // Tystna när eleven bläddrar vidare, och när vyn försvinner vid rättning.
  useEffect(() => stoppa, [nyckel, stoppa]);

  if (!stods) return null;

  const knapp = (vad: Vad, etikett: string, kort: string) => {
    const aktiv = talar === vad;
    return (
      <button
        type="button"
        onClick={() => tala(vad)}
        aria-label={aktiv ? 'Stoppa uppläsningen' : `Lyssna på ${etikett.toLowerCase()}`}
        title={aktiv ? 'Stoppa uppläsningen' : `Lyssna på ${etikett.toLowerCase()}`}
        className={cn(
          'px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap',
          aktiv
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
        )}
      >
        {aktiv ? '⏹' : '🔊'}{' '}
        {/* Hela etiketten ryms inte på en telefon, där räcker ordet. */}
        <span className="hidden sm:inline">
          {aktiv ? 'Stoppa' : `Lyssna på ${etikett.toLowerCase()}`}
        </span>
        <span className="sm:hidden">{aktiv ? 'Stoppa' : kort}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {knapp('fraga', 'Frågan', 'Frågan')}
      {knapp('svar', 'Svaren', 'Svaren')}
    </div>
  );
};

export default FragaUpplasning;
