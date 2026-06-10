import { useEffect, useMemo, useState } from "react";
import type { WritingTask } from "../types";

interface Props {
  task: WritingTask;
  onBack: () => void;
}

export default function WritingTaskView({ task, onBack }: Props) {
  const storageKey = `npjakten-skriva-${task.id}`;
  const [text, setText] = useState<string>(
    () => localStorage.getItem(storageKey) ?? ""
  );
  const [checked, setChecked] = useState<boolean[]>(() =>
    task.checklist.map(() => false)
  );
  const [showChecklist, setShowChecklist] = useState(false);

  // Spara utkastet löpande så att eleven inte tappar sin text
  useEffect(() => {
    const timer = setTimeout(() => localStorage.setItem(storageKey, text), 400);
    return () => clearTimeout(timer);
  }, [text, storageKey]);

  const wordCount = useMemo(
    () => (text.trim() === "" ? 0 : text.trim().split(/\s+/).length),
    [text]
  );

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-4 text-sm font-medium text-np hover:underline">
        ← Tillbaka till delproven
      </button>

      {/* Uppgiftshäftet */}
      <div className="paper">
        <p className="text-right text-xs italic text-stone-500">
          Svenska och svenska som andraspråk, årskurs 6
          <br />
          {task.delprov}
        </p>

        <h1 className="mt-6 font-serif text-3xl font-bold">{task.title}</h1>

        <div className="mt-4 space-y-3 rounded-md bg-stone-50 p-5">
          {task.intro.map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Gör det här! */}
        <div className="mt-6 overflow-hidden rounded-md border-2 border-np-red">
          <p className="bg-np-red px-4 py-2 font-bold text-white">Gör det här!</p>
          <div className="space-y-3 p-4">
            {task.doThis.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
            {task.fixedHeading && (
              <p className="leading-relaxed">
                Din text ska ha den här rubriken:{" "}
                <span className="font-bold italic">{task.fixedHeading}</span>
              </p>
            )}
            {task.topicExamples && (
              <div>
                <p className="mb-2 italic">
                  Här följer några exempel på vad du kan skriva om, men du kan också hitta
                  på ett eget ämne:
                </p>
                <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                  {task.topicExamples.map((topic, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-np-red">*</span> {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Kom ihåg! */}
        <div className="mt-6 overflow-hidden rounded-md border-2 border-np-red">
          <p className="bg-np-red px-4 py-2 font-bold text-white">Kom ihåg!</p>
          <ul className="space-y-2 p-4">
            {task.remember.map((item, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-np-red" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skrivytan */}
      <div className="paper mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-np pb-3">
          <h2 className="font-serif text-2xl font-bold">Skriv din text här</h2>
          <span className="rounded bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600">
            {wordCount} ord
          </span>
        </div>

        {task.fixedHeading ? (
          <p className="mt-5 font-serif text-xl font-bold">{task.fixedHeading}</p>
        ) : (
          <input
            type="text"
            placeholder="Skriv din rubrik här ..."
            className="mt-5 w-full border-b-2 border-stone-300 pb-1 font-serif text-xl font-bold focus:border-np focus:outline-none"
          />
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={18}
          placeholder="Planera först: hur ska din text börja, vad ska hända och hur ska den sluta? Börja sedan skriva ..."
          className="mt-3 w-full resize-y rounded border-2 border-stone-200 bg-[repeating-linear-gradient(transparent,transparent_27px,#e7e5e4_27px,#e7e5e4_28px)] p-3 font-serif leading-7 focus:border-np focus:outline-none"
        />
        <p className="mt-1 text-xs text-stone-400">
          Din text sparas automatiskt i webbläsaren på den här enheten.
        </p>

        {!showChecklist ? (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowChecklist(true)}
              className="rounded-md bg-np px-8 py-3 font-bold text-white transition hover:bg-np-dark"
            >
              Jag är klar – kontrollera min text
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-md border-2 border-np bg-np-light p-5">
            <h3 className="font-serif text-xl font-bold">Kontrollera din text</h3>
            <p className="mt-1 text-sm text-stone-600">
              Läs igenom din text och bocka av varje punkt som stämmer. Saknas något? Gå
              tillbaka och förbättra texten – det gör man även på riktiga provet.
            </p>
            <ul className="mt-4 space-y-2">
              {task.checklist.map((item, i) => (
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
              <p className="mt-4 rounded bg-white p-3 text-center font-bold text-np">
                Snyggt jobbat! Din text uppfyller alla punkter på checklistan. 🎉
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
