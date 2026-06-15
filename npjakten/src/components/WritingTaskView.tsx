import { useEffect, useMemo, useState } from "react";
import type { WritingTask } from "../types";
import ExamTimer from "./ExamTimer";
import IllustrationImg from "./IllustrationImg";

interface Props {
  task: WritingTask;
  gradeLabel: string;
  onBack: () => void;
}

export default function WritingTaskView({ task, gradeLabel, onBack }: Props) {
  const storageKey = `npjakten-skriva-${task.id}`;
  const [text, setText] = useState<string>(
    () => localStorage.getItem(storageKey) ?? ""
  );
  const [checked, setChecked] = useState<boolean[]>(() =>
    task.checklist.map(() => false)
  );
  const [showChecklist, setShowChecklist] = useState(false);
  const [openExample, setOpenExample] = useState<number | null>(null);
  const [ownHeading, setOwnHeading] = useState<string>(
    () => localStorage.getItem(storageKey + "-rubrik") ?? ""
  );
  const [copied, setCopied] = useState(false);

  // Spara utkastet löpande så att eleven inte tappar sin text
  useEffect(() => {
    const timer = setTimeout(() => localStorage.setItem(storageKey, text), 400);
    return () => clearTimeout(timer);
  }, [text, storageKey]);

  // Spara även elevens egen rubrik
  useEffect(() => {
    localStorage.setItem(storageKey + "-rubrik", ownHeading);
  }, [ownHeading, storageKey]);

  const wordCount = useMemo(
    () => (text.trim() === "" ? 0 : text.trim().split(/\s+/).length),
    [text]
  );

  // Hela texten med rubrik, för kopiering och nedladdning
  const fullText = useMemo(() => {
    const heading = task.fixedHeading ?? ownHeading.trim();
    return (heading ? heading + "\n\n" : "") + text;
  }, [task.fixedHeading, ownHeading, text]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Äldre webbläsare utan clipboard-API – markera texten manuellt
      window.alert("Kunde inte kopiera automatiskt. Markera texten och kopiera själv.");
    }
  };

  const downloadText = () => {
    const heading = task.fixedHeading ?? ownHeading.trim();
    const filename =
      (heading || task.title).replace(/[^a-zA-Z0-9åäöÅÄÖ ]/g, "").trim().replace(/\s+/g, "-") +
      ".txt";
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-4 text-sm font-medium text-np hover:underline">
        ← Tillbaka till delproven
      </button>

      {/* Uppgiftshäftet */}
      <div className="paper">
        <p className="text-right text-xs italic text-stone-500">
          Svenska och svenska som andraspråk, {gradeLabel.toLowerCase()}
          <br />
          {task.delprov}
        </p>

        <h1 className="mt-6 font-serif text-3xl font-bold">{task.title}</h1>

        {task.image && (
          <IllustrationImg
            image={task.image}
            className="mt-5 aspect-video w-full rounded-md object-cover"
          />
        )}

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
            {task.supportWords && (
              <div className="rounded-md border-2 border-np bg-white p-4">
                <p className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-np">
                  Stödord
                </p>
                <ul className="mx-auto grid max-w-md grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
                  {task.supportWords.map((word, i) => (
                    <li key={i} className="font-serif text-lg">
                      {word}
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

      <div className="mt-4">
        <ExamTimer presets={[40, 60, 80]} />
      </div>

      {/* Skrivytan */}
      <div className="paper mt-4">
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
            value={ownHeading}
            onChange={(e) => setOwnHeading(e.target.value)}
            placeholder="Skriv din rubrik här ..."
            className="mt-5 w-full border-b-2 border-stone-300 pb-1 font-serif text-xl font-bold focus:border-np focus:outline-none"
          />
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={18}
          placeholder="Planera först: hur ska din text börja, vad ska hända och hur ska den sluta? Börja sedan skriva ..."
          className="mt-3 w-full resize-y rounded border-2 border-stone-200 bg-white p-3 font-serif leading-relaxed focus:border-np focus:outline-none"
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

            {/* Spara texten utanför appen */}
            <div className="mt-5 border-t border-np/20 pt-4">
              <p className="mb-2 text-sm font-semibold text-stone-600">
                Spara eller lämna in din text:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyText}
                  className="rounded-md border-2 border-np bg-white px-5 py-2 font-bold text-np transition hover:bg-np hover:text-white"
                >
                  {copied ? "✓ Kopierad!" : "📋 Kopiera texten"}
                </button>
                <button
                  onClick={downloadText}
                  className="rounded-md border-2 border-np bg-white px-5 py-2 font-bold text-np transition hover:bg-np hover:text-white"
                >
                  ⬇️ Ladda ner texten
                </button>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Kopiera och klistra in i ett dokument, eller ladda ner som textfil till din
                enhet.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Exempelsvar – visas först när eleven sagt sig vara klar,
          så att de inte läses i förväg och styr elevens egen text */}
      {showChecklist && task.examples && task.examples.length > 0 && (
        <div className="paper mt-8">
          <h2 className="border-b-2 border-np pb-3 font-serif text-2xl font-bold">
            Exempelsvar
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            Så här kan texter på olika nivåer se ut. Läs dem och jämför med din egen –
            vad gör den starkare texten som du också skulle kunna göra?
          </p>
          <div className="mt-5 space-y-4">
            {task.examples.map((example, i) => (
              <div key={i} className="overflow-hidden rounded-md border-2 border-stone-300">
                <button
                  onClick={() => setOpenExample(openExample === i ? null : i)}
                  className="flex w-full items-center justify-between bg-stone-50 px-5 py-3 text-left transition hover:bg-np-light"
                >
                  <span>
                    <span className="rounded bg-np px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                      {example.level}
                    </span>
                    <span className="ml-3 font-serif text-lg font-bold">
                      {example.heading}
                    </span>
                  </span>
                  <span className="text-np">{openExample === i ? "▲" : "▼"}</span>
                </button>
                {openExample === i && (
                  <div className="px-5 py-4">
                    <div className="space-y-3">
                      {example.paragraphs.map((p, pi) => (
                        <p key={pi} className="font-serif leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                    <div className="mt-5 rounded-md border-l-4 border-np bg-np-light p-4">
                      <p className="text-sm font-bold uppercase tracking-wide text-np">
                        Varför bedöms texten så här?
                      </p>
                      <ul className="mt-2 space-y-1">
                        {example.comments.map((comment, ci) => (
                          <li key={ci} className="flex gap-2 text-sm leading-relaxed">
                            <span className="text-np">•</span> {comment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
