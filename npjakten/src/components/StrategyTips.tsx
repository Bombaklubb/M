import { useState } from "react";

const HIDE_KEY = "npjakten-tips-dold-v1";

// Lässtrategier grundade i vanliga poängtapp i de nationella provens
// bedömningsmallar. Går att dölja permanent – valet sparas i webbläsaren.
export default function StrategyTips() {
  const [visible, setVisible] = useState(
    () => localStorage.getItem(HIDE_KEY) !== "1"
  );

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(HIDE_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="no-print mb-4 rounded-md border-l-4 border-np bg-np-light p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-np">
          Innan du börjar – 5 lässtrategier
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 text-xs font-semibold text-stone-500 hover:text-np"
          title="Visa inte tipsen igen"
        >
          Göm tipsen ✕
        </button>
      </div>
      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-stone-700">
        <li className="flex gap-2">
          <span className="text-np">1.</span> Läs frågorna först – då vet du vad du ska
          leta efter i texten.
        </li>
        <li className="flex gap-2">
          <span className="text-np">2.</span> Står det ”skriv av” eller ”citera”? Skriv
          då av meningen ordagrant ur texten.
        </li>
        <li className="flex gap-2">
          <span className="text-np">3.</span> Har frågan två delar (t.ex. ”Hur … och
          varför …?”)? Svara på båda – annars tappar du poäng.
        </li>
        <li className="flex gap-2">
          <span className="text-np">4.</span> Leta stöd i texten i stället för att gissa.
          Svar utan stöd i texten ger 0 poäng.
        </li>
        <li className="flex gap-2">
          <span className="text-np">5.</span> Läs hela frågan och alla svarsalternativ
          innan du kryssar.
        </li>
      </ul>
    </div>
  );
}
