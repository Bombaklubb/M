import type { ReadingTest } from "../types";

interface Props {
  test: ReadingTest;
  gradeLabel: string;
}

const LETTERS = ["A", "B", "C", "D"];

// Utskriftsvänligt facit i bedömningsmallens stil. Renderas bara i
// facit-utskriftsläget och är dold på skärmen.
export default function FacitSheet({ test, gradeLabel }: Props) {
  return (
    <div className="paper facit-sheet hidden print:block">
      <p className="text-right text-xs italic text-stone-500">
        Svenska och svenska som andraspråk, {gradeLabel.toLowerCase()}
        <br />
        {test.delprov} – facit och bedömningsmall
      </p>

      <h1 className="mt-4 font-serif text-2xl font-bold">
        Facit: {test.title}
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Endast för läraren. Maxpoäng:{" "}
        {test.questions.reduce((sum, q) => sum + q.maxPoints, 0)}
      </p>

      <div className="mt-5 space-y-6">
        {test.questions.map((q) => (
          <div key={q.id} className="border-t border-stone-300 pt-3">
            <p className="font-bold">
              Uppgift {q.id} ({q.maxPoints} p)
            </p>
            {(q.kind === "multiple-choice" || q.kind === "open") && q.aspect && (
              <p className="text-xs text-stone-500">Uppgiftstyp: {q.aspect}</p>
            )}
            {q.kind === "multiple-choice" && q.category && (
              <p className="text-xs text-stone-500">
                {q.category === "L"
                  ? "L – lokalisering av information"
                  : "TI – tolkning och integrering"}
              </p>
            )}
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
              {q.prompt}
            </p>

            {q.kind === "multiple-choice" && (
              <p className="mt-2 text-sm">
                <span className="font-bold">Rätt svar:</span>{" "}
                {LETTERS[q.correctIndex]}. {q.options[q.correctIndex]}
              </p>
            )}

            {q.kind === "ordering" && (
              <ul className="mt-2 space-y-1 text-sm">
                {q.items.map((item, i) => (
                  <li key={i}>
                    <span className="font-bold">{q.correctOrder[i]}.</span>{" "}
                    ({LETTERS[i]}) {item}
                  </li>
                ))}
              </ul>
            )}

            {q.kind === "open" && (
              <div className="mt-2">
                <p className="text-sm leading-relaxed">
                  <span className="font-bold">Bedömningsanvisning:</span>{" "}
                  {q.guidance}
                </p>
                {q.scoreExamples && q.scoreExamples.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {q.scoreExamples.map((ex, i) => (
                      <div key={i} className="flex gap-3 border border-stone-300 p-2">
                        <span className="shrink-0 text-sm font-bold">
                          {ex.points} p
                        </span>
                        <p className="font-serif text-sm leading-relaxed">
                          {ex.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
