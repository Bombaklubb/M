import { useEffect, useState } from "react";
import type { OralTask } from "../types";
import IllustrationImg from "./IllustrationImg";

interface Props {
  task: OralTask;
  gradeLabel: string;
  onBack: () => void;
}

// Muntligt delprov A: gruppsamtal. Appen ger struktur, samtalskort och
// självskattning – själva samtalet sker i klassrummet.
export default function OralTaskView({ task, gradeLabel, onBack }: Props) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    task.assessmentPoints.map(() => false)
  );
  // Kort-utskrift: döljer allt utom kort-arket (samma mönster som facit)
  const [cardsMode, setCardsMode] = useState(false);

  useEffect(() => {
    if (!cardsMode) return;
    const off = () => setCardsMode(false);
    window.addEventListener("afterprint", off);
    window.print();
    // afterprint är opålitligt i vissa mobila webbläsare
    const timer = setTimeout(off, 1000);
    return () => {
      window.removeEventListener("afterprint", off);
      clearTimeout(timer);
    };
  }, [cardsMode]);

  return (
    <div className={"mx-auto max-w-3xl" + (cardsMode ? " print-cards" : "")}>
      <button
        onClick={onBack}
        className="no-print mb-4 text-sm font-medium text-np hover:underline"
      >
        ← Tillbaka till delproven
      </button>

      <div className="paper">
        <p className="text-right text-xs italic text-stone-500">
          Svenska och svenska som andraspråk, {gradeLabel.toLowerCase()}
          <br />
          {task.delprov}
        </p>

        <div className="mt-6 flex items-start justify-between gap-4">
          <h1 className="font-serif text-3xl font-bold">{task.title}</h1>
          <span className="no-print mt-1 flex shrink-0 flex-col items-end gap-1">
            <button
              onClick={() => window.print()}
              title="Skriv ut hela materialet"
              className="text-sm font-medium text-stone-400 transition hover:text-np hover:underline"
            >
              🖨 Skriv ut
            </button>
            <button
              onClick={() => setCardsMode(true)}
              title="Skriv ut bara samtalskorten, att klippa isär"
              className="text-xs font-medium text-stone-300 transition hover:text-np hover:underline"
            >
              Skriv ut samtalskorten
            </button>
          </span>
        </div>

        {task.image && (
          <IllustrationImg
            image={task.image}
            className="mt-5 aspect-video w-full rounded-md object-cover"
          />
        )}

        <div className="mt-4 space-y-3">
          {task.intro.map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Samtalsstruktur */}
        <div className="mt-6 overflow-hidden rounded-md border-2 border-np-red">
          <p className="bg-np-red px-4 py-2 font-bold text-white">Så här gör ni</p>
          <ol className="space-y-2 p-4">
            {task.steps.map((step, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-np-red text-sm font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Samtalskorten – eget ark så att de kan skrivas ut separat */}
      <div className="paper cards-sheet mt-4">
        <h2 className="border-b-2 border-np pb-3 font-serif text-2xl font-bold">
          Samtalskort
        </h2>
        <p className="no-print mt-2 text-sm text-stone-500">
          Skriv ut och klipp isär korten, eller turas om att välja ett kort på
          skärmen. Dra ett kort i taget och samtala tills ämnet känns färdigt.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(task.cards ?? []).map((card, i) => (
            <div
              key={i}
              className="card flex min-h-32 flex-col items-center justify-center rounded border border-dashed border-stone-400 p-6 text-center"
            >
              <span className="mb-2 text-xs font-bold uppercase tracking-wide text-np">
                Kort {i + 1}
              </span>
              <p className="font-serif text-lg leading-relaxed">{card}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Självskattning efter samtalet */}
      <div className="paper mt-4">
        <h2 className="font-serif text-xl font-bold">
          Efter samtalet – lyssnade ni efter det här?
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Det här är sådant läraren lyssnar efter på det riktiga provet. Bocka av
          det ni tycker att gruppen klarade – och prata om det som saknades.
        </p>
        <ul className="mt-4 space-y-2">
          {task.assessmentPoints.map((item, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() =>
                    setChecked((prev) => prev.map((c, ci) => (ci === i ? !c : c)))
                  }
                  className="mt-1 h-5 w-5 accent-np"
                />
                <span className={checked[i] ? "text-stone-500 line-through" : ""}>
                  {item}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {checked.every(Boolean) && (
          <p className="mt-4 rounded bg-np-light p-3 text-center font-bold text-np">
            Snyggt jobbat! Ni fick med allt som ett bra samtal behöver. 🎉
          </p>
        )}
      </div>
    </div>
  );
}
