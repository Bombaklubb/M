import { useState } from "react";
import type { Grade, WritingTask } from "../types";
import IllustrationImg from "./IllustrationImg";
import StatsPanel from "./StatsPanel";

const WRITING_LABELS: Record<WritingTask["textType"], string> = {
  berättelse: "Skriv en berättelse",
  argumenterande: "Skriv en argumenterande text",
  krönika: "Skriv en krönika",
  förklarande: "Skriv en förklarande text",
  instruerande: "Skriv en instruerande text",
  beskrivande: "Skriv en beskrivande text",
  utredande: "Skriv en utredande text",
  resonerande: "Skriv en resonerande text",
};

interface Props {
  grade: Grade;
  onBack: () => void;
  onOpenReading: (testId: string) => void;
  onOpenWriting: (taskId: string) => void;
  onOpenOral: (taskId: string) => void;
}

export default function GradePage({
  grade,
  onBack,
  onOpenReading,
  onOpenWriting,
  onOpenOral,
}: Props) {
  const [tab, setTab] = useState<"delprov" | "statistik">("delprov");
  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-4 text-sm font-medium text-np hover:underline">
        ← Tillbaka till årskurser
      </button>

      <div className="paper">
        <p className="text-sm font-semibold uppercase tracking-widest text-np">
          {grade.label}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold">Välj delprov</h1>

        {/* Flikar: delprovslistan eller elevens statistik */}
        <div className="mt-4 inline-flex gap-1 rounded-md bg-stone-200 p-1">
          <button
            onClick={() => setTab("delprov")}
            className={
              "rounded px-4 py-1.5 text-sm font-bold transition " +
              (tab === "delprov" ? "bg-np text-white" : "text-stone-600")
            }
          >
            Delprov
          </button>
          <button
            onClick={() => setTab("statistik")}
            className={
              "rounded px-4 py-1.5 text-sm font-bold transition " +
              (tab === "statistik" ? "bg-np text-white" : "text-stone-600")
            }
          >
            Min statistik
          </button>
        </div>

        {tab === "statistik" && (
          <StatsPanel
            grade={grade}
            onOpenReading={(id) => {
              setTab("delprov");
              onOpenReading(id);
            }}
          />
        )}

        {tab === "delprov" && (
          <>
        <h2 className="mt-8 border-b-2 border-np pb-1 font-serif text-xl font-bold">
          Läsa – läsförståelse
        </h2>
        <div className="mt-4 grid gap-3">
          {grade.reading.map((test) => (
            <button
              key={test.id}
              onClick={() => onOpenReading(test.id)}
              className="flex items-center gap-4 rounded-md border border-stone-300 p-3 text-left transition hover:border-np hover:bg-np-light"
            >
              {test.image && (
                <IllustrationImg
                  image={test.image}
                  decorative
                  className="hidden h-20 w-32 shrink-0 rounded object-cover sm:block"
                />
              )}
              <span>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {test.delprov}
                </p>
                <p className="mt-1 font-serif text-lg font-bold">{test.title}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {test.questions.length} uppgifter ·{" "}
                  {test.questions.reduce((sum, q) => sum + q.maxPoints, 0)} poäng
                </p>
              </span>
            </button>
          ))}
        </div>

        {grade.writing.length > 0 && (
          <>
        <h2 className="mt-10 border-b-2 border-np pb-1 font-serif text-xl font-bold">
          Skriva – olika texttyper
        </h2>
        <div className="mt-4 grid gap-3">
          {grade.writing.map((task) => (
            <button
              key={task.id}
              onClick={() => onOpenWriting(task.id)}
              className="flex items-center gap-4 rounded-md border border-stone-300 p-3 text-left transition hover:border-np hover:bg-np-light"
            >
              {task.image && (
                <IllustrationImg
                  image={task.image}
                  decorative
                  className="hidden h-20 w-32 shrink-0 rounded object-cover sm:block"
                />
              )}
              <span>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {task.delprov}
                </p>
                <p className="mt-1 font-serif text-lg font-bold">{task.title}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {WRITING_LABELS[task.textType]}
                </p>
              </span>
            </button>
          ))}
        </div>
          </>
        )}

        {(grade.oral?.length ?? 0) > 0 && (
          <>
            <h2 className="mt-10 border-b-2 border-np pb-1 font-serif text-xl font-bold">
              Muntligt – samtala tillsammans
            </h2>
            <div className="mt-4 grid gap-3">
              {grade.oral!.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onOpenOral(task.id)}
                  className="flex items-center gap-4 rounded-md border border-stone-300 p-3 text-left transition hover:border-np hover:bg-np-light"
                >
                  {task.image && (
                    <IllustrationImg
                      image={task.image}
                      decorative
                      className="hidden h-20 w-32 shrink-0 rounded object-cover sm:block"
                    />
                  )}
                  <span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {task.delprov}
                    </p>
                    <p className="mt-1 font-serif text-lg font-bold">{task.title}</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {task.cards.length} samtalskort · gruppövning
                    </p>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
          </>
        )}
      </div>
    </div>
  );
}
