import { useEffect, useState } from "react";
import type { OralTask } from "../types";
import IllustrationImg from "./IllustrationImg";

interface Props {
  task: OralTask;
  gradeLabel: string;
  onBack: () => void;
}

// Elevens förberedelsedokument: stödord för anförandet
interface SupportNotes {
  topic?: string; // valt ämne ur listan
  ownTopic?: string; // eget ämne
  opening?: string;
  point1?: string;
  point2?: string;
  point3?: string;
  closing?: string;
  question?: string; // avslutande fråga till gruppen (åk 9)
}

function loadNotes(key: string): SupportNotes {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Ett fält på stödkortet. Vid utskrift med tomt innehåll visas skrivlinjer
// så att mallen även går att fylla i för hand.
function SupportField({
  label,
  hint,
  rows,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  rows: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-np">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={hint}
        className="no-print mt-1 w-full resize-y rounded border-2 border-stone-200 bg-white p-2 font-serif leading-relaxed focus:border-np focus:outline-none"
      />
      {/* Utskriftsversion: ifyllda stödord eller skrivlinjer */}
      <div className="hidden print:block">
        {value.trim() ? (
          <p className="mt-1 whitespace-pre-line font-serif leading-relaxed">{value}</p>
        ) : (
          <div className="mt-1 space-y-5 pt-4">
            {Array.from({ length: rows }, (_, i) => (
              <div key={i} className="border-b border-stone-400" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Individuell muntlig presentation: eleven väljer ämne, förbereder ett
// stödkort med stödord och håller anförandet för en mindre grupp.
export default function PresentationTaskView({ task, gradeLabel, onBack }: Props) {
  const storageKey = `npjakten-presentation-${task.id}`;
  const [notes, setNotes] = useState<SupportNotes>(() => loadNotes(storageKey));
  const [checked, setChecked] = useState<boolean[]>(() =>
    task.assessmentPoints.map(() => false)
  );
  // Stödkorts-utskrift: döljer allt utom stödkortet (samma mönster som facit)
  const [supportMode, setSupportMode] = useState(false);

  // Autospara förberedelserna så att inget försvinner
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(notes));
      } catch {
        // localStorage kan vara avstängt – övningen fungerar ändå
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [notes, storageKey]);

  useEffect(() => {
    if (!supportMode) return;
    const off = () => setSupportMode(false);
    window.addEventListener("afterprint", off);
    window.print();
    // afterprint är opålitligt i vissa mobila webbläsare
    const timer = setTimeout(off, 1000);
    return () => {
      window.removeEventListener("afterprint", off);
      clearTimeout(timer);
    };
  }, [supportMode]);

  const set = (field: keyof SupportNotes) => (value: string) =>
    setNotes((prev) => ({ ...prev, [field]: value }));

  const chosenTopic = notes.ownTopic?.trim() || notes.topic || "";
  // Åk 9-anföranden avslutas med en fråga till gruppen; fältet visas när
  // uppgiften nämner en fråga i sina steg.
  const hasQuestionStep = task.steps.some((s) => s.toLowerCase().includes("fråga"));

  return (
    <div className={"mx-auto max-w-3xl" + (supportMode ? " print-support" : "")}>
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
              onClick={() => setSupportMode(true)}
              title="Skriv ut bara stödkortet, att hålla i handen"
              className="text-xs font-medium text-stone-300 transition hover:text-np hover:underline"
            >
              Skriv ut stödkortet
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

        {/* Arbetsgång */}
        <div className="mt-6 overflow-hidden rounded-md border-2 border-np-red">
          <p className="bg-np-red px-4 py-2 font-bold text-white">Så här gör du</p>
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

        {/* Ämnesval */}
        {task.topics && (
          <div className="mt-6">
            <h2 className="font-serif text-xl font-bold">Välj ditt ämne</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {task.topics.map((topic) => {
                const selected = notes.topic === topic && !notes.ownTopic?.trim();
                return (
                  <button
                    key={topic}
                    onClick={() =>
                      setNotes((prev) => ({ ...prev, topic, ownTopic: "" }))
                    }
                    className={
                      "rounded-md border-2 p-3 text-left font-serif transition " +
                      (selected
                        ? "border-np bg-np-light font-bold"
                        : "border-stone-300 hover:border-np hover:bg-stone-50")
                    }
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={notes.ownTopic ?? ""}
              onChange={(e) => set("ownTopic")(e.target.value)}
              placeholder="… eller skriv ett eget ämne här"
              className="mt-3 w-full rounded border-2 border-stone-200 p-2 font-serif focus:border-np focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Förberedelsedokumentet / stödkortet */}
      <div className="paper support-sheet mt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-np pb-3">
          <h2 className="font-serif text-2xl font-bold">Mitt stödkort</h2>
          {chosenTopic && (
            <span className="font-serif text-lg">
              Ämne: <span className="font-bold">{chosenTopic}</span>
            </span>
          )}
        </div>
        <p className="no-print mt-2 text-sm text-stone-600">
          Skriv stödord, inte hela meningar – du ska tala fritt, inte läsa innantill.
          Kortet sparas automatiskt och kan skrivas ut att hålla i handen.
        </p>

        <div className="mt-4 space-y-4">
          <SupportField
            label="Inledning – så börjar jag"
            hint="T.ex. en fråga, något överraskande eller varför du valt ämnet …"
            rows={1}
            value={notes.opening ?? ""}
            onChange={set("opening")}
          />
          <SupportField
            label="Huvudpunkt 1"
            hint="Stödord för din första del …"
            rows={2}
            value={notes.point1 ?? ""}
            onChange={set("point1")}
          />
          <SupportField
            label="Huvudpunkt 2"
            hint="Stödord för din andra del …"
            rows={2}
            value={notes.point2 ?? ""}
            onChange={set("point2")}
          />
          <SupportField
            label="Huvudpunkt 3"
            hint="Stödord för din tredje del …"
            rows={2}
            value={notes.point3 ?? ""}
            onChange={set("point3")}
          />
          <SupportField
            label="Avslutning – så slutar jag"
            hint="Knyt ihop säcken – vad vill du att lyssnarna ska minnas?"
            rows={1}
            value={notes.closing ?? ""}
            onChange={set("closing")}
          />
          {hasQuestionStep && (
            <SupportField
              label="Min fråga till gruppen"
              hint="Frågan som gruppen ska diskutera efter ditt anförande …"
              rows={1}
              value={notes.question ?? ""}
              onChange={set("question")}
            />
          )}
        </div>
      </div>

      {/* Lyssnarnas uppgift */}
      {task.listenerTasks && task.listenerTasks.length > 0 && (
        <div className="paper mt-4">
          <h2 className="font-serif text-xl font-bold">Till er som lyssnar</h2>
          <ul className="mt-3 space-y-2">
            {task.listenerTasks.map((item, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-np" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Självskattning efter presentationen */}
      <div className="paper mt-4">
        <h2 className="font-serif text-xl font-bold">
          Efter presentationen – klarade du det här?
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Det här är sådant läraren lyssnar efter på det riktiga provet. Bocka av
          det du tycker att du klarade – och tänk på vad du vill träna mer på.
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
            Snyggt jobbat! Du fick med allt som en bra presentation behöver. 🎉
          </p>
        )}
      </div>
    </div>
  );
}
