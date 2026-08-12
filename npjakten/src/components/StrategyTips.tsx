import { useState } from "react";
import { safeGet, safeSet } from "../lib/storage";

type Variant = "lasa" | "skriva" | "muntligt";

interface Props {
  variant?: Variant;
}

// Strategier grundade i vanliga poängtapp i de nationella provens
// bedömningsmallar. Går att dölja permanent – valet sparas per del.
const TIPS: Record<Variant, { heading: string; items: string[] }> = {
  lasa: {
    heading: "Innan du börjar – 5 lässtrategier",
    items: [
      "Läs frågorna först – då vet du vad du ska leta efter i texten.",
      "Står det ”skriv av” eller ”citera”? Skriv då av meningen ordagrant ur texten.",
      "Har frågan två delar (t.ex. ”Hur … och varför …?”)? Svara på båda – annars tappar du poäng.",
      "Leta stöd i texten i stället för att gissa. Svar utan stöd i texten ger 0 poäng.",
      "Läs hela frågan och alla svarsalternativ innan du kryssar.",
    ],
  },
  skriva: {
    heading: "Innan du börjar – 5 skrivstrategier",
    items: [
      "Planera först: vad ska hända i början, i mitten och i slutet?",
      "Skriv en inledning som får läsaren att vilja läsa vidare.",
      "Dela in texten i stycken – nytt stycke när du byter tanke eller händelse.",
      "Håll dig till texttypen som uppgiften ber om, och till rubriken om du fått en.",
      "Spara tid till slutet: läs igenom, rätta stavning och kolla stor bokstav och punkt.",
    ],
  },
  muntligt: {
    heading: "Innan ni börjar – 5 samtalsstrategier",
    items: [
      "Tala lugnt och tydligt, så att alla hör.",
      "Titta på dem du talar till i stället för att läsa innantill.",
      "Använd stödord som minnesstöd – skriv inte hela meningar.",
      "Motivera det du tycker: säg ”… därför att …”.",
      "Lyssna klart på andra och bygg vidare: ”Jag håller med om …, och dessutom …”.",
    ],
  },
};

export default function StrategyTips({ variant = "lasa" }: Props) {
  // Läsa behåller sin ursprungliga nyckel så att den som redan gömt
  // tipsen slipper se dem igen.
  const hideKey =
    variant === "lasa"
      ? "npjakten-tips-dold-v1"
      : `npjakten-tips-dold-${variant}-v1`;

  const [visible, setVisible] = useState(() => safeGet(hideKey) !== "1");

  if (!visible) return null;

  const dismiss = () => {
    safeSet(hideKey, "1");
    setVisible(false);
  };

  const { heading, items } = TIPS[variant];

  return (
    <div className="no-print mb-4 rounded-md border-l-4 border-np bg-np-light p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-np">{heading}</p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-xs font-semibold text-stone-500 hover:text-np"
          title="Visa inte tipsen igen"
        >
          Göm tipsen ✕
        </button>
      </div>
      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-stone-700">
        {items.map((tip, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-np">{i + 1}.</span> {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
