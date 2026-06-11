import type { Grade, WritingTask } from "../types";

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
}

export default function GradePage({ grade, onBack, onOpenReading, onOpenWriting }: Props) {
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

        <h2 className="mt-8 border-b-2 border-np pb-1 font-serif text-xl font-bold">
          Läsa – läsförståelse
        </h2>
        <div className="mt-4 grid gap-3">
          {grade.reading.map((test) => (
            <button
              key={test.id}
              onClick={() => onOpenReading(test.id)}
              className="rounded-md border border-stone-300 p-4 text-left transition hover:border-np hover:bg-np-light"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                {test.delprov}
              </p>
              <p className="mt-1 font-serif text-lg font-bold">{test.title}</p>
              <p className="mt-1 text-sm text-stone-500">
                {test.questions.length} uppgifter ·{" "}
                {test.questions.reduce((sum, q) => sum + q.maxPoints, 0)} poäng
              </p>
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
              className="rounded-md border border-stone-300 p-4 text-left transition hover:border-np hover:bg-np-light"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                {task.delprov}
              </p>
              <p className="mt-1 font-serif text-lg font-bold">{task.title}</p>
              <p className="mt-1 text-sm text-stone-500">
                {WRITING_LABELS[task.textType]}
              </p>
            </button>
          ))}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
