import { useState } from "react";
import type { Grade } from "../types";
import { clearResults, loadResults } from "../lib/results";

interface Props {
  grade: Grade;
  onOpenReading: (testId: string) => void;
}

interface Bucket {
  label: string;
  points: number;
  maxPoints: number;
}

const CATEGORY_LABELS: Record<"L" | "TI", string> = {
  L: "Lokalisera information",
  TI: "Tolka och integrera",
};

// Styrke-/svaghetsanalys utifrån elevens senast sparade resultat per prov.
// Åk 9 grupperas per uppgiftstyp (aspect), åk 3 per L/TI-kategori och
// årskurser utan någon av dessa får en samlad stapel.
export default function StatsPanel({ grade, onOpenReading }: Props) {
  const [results, setResults] = useState(() => loadResults(grade.id));

  if (results.length === 0) return null;

  const allQuestions = results.flatMap((r) => r.perQuestion);
  const scored = allQuestions.filter((q) => q.scored);
  const unscoredCount = allQuestions.length - scored.length;
  if (scored.length === 0) return null;

  // Välj gruppering: uppgiftstyp > kategori > samlat
  const dimension = scored.some((q) => q.aspect)
    ? "aspect"
    : scored.some((q) => q.category)
      ? "category"
      : "overall";

  const buckets = new Map<string, Bucket>();
  for (const q of scored) {
    const label =
      dimension === "aspect"
        ? q.aspect ?? "Övriga uppgifter"
        : dimension === "category"
          ? q.category
            ? CATEGORY_LABELS[q.category]
            : "Övriga uppgifter"
          : "Alla uppgifter";
    const b = buckets.get(label) ?? { label, points: 0, maxPoints: 0 };
    b.points += q.points;
    b.maxPoints += q.maxPoints;
    buckets.set(label, b);
  }

  // Prov som tränar en viss uppgiftstyp/kategori, för "Träna mer"-länkarna
  const testsFor = (label: string) =>
    grade.reading.filter((t) =>
      t.questions.some((q) => {
        if (q.kind === "ordering") return false;
        if (dimension === "aspect") return q.aspect === label;
        if (dimension === "category")
          return (
            q.kind === "multiple-choice" &&
            q.category &&
            CATEGORY_LABELS[q.category] === label
          );
        return false;
      })
    );

  const reset = () => {
    if (window.confirm("Vill du nollställa din statistik för den här årskursen?")) {
      clearResults(grade.id);
      setResults([]);
    }
  };

  return (
    <div className="no-print mt-6 rounded-md border-2 border-np bg-np-light p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-bold">Dina styrkor och svagheter</h2>
        <span className="text-xs text-stone-500">
          Baserat på {results.length} rättade prov
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {[...buckets.values()].map((b) => {
          const pct = Math.round((b.points / b.maxPoints) * 100);
          const weak = pct < 60;
          const trainTests = weak ? testsFor(b.label) : [];
          return (
            <div key={b.label}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-stone-700">{b.label}</p>
                <p
                  className={
                    "text-sm font-bold " + (weak ? "text-amber-700" : "text-np")
                  }
                >
                  {pct} % ({b.points}/{b.maxPoints} p)
                </p>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-stone-200">
                <div
                  className={"h-full " + (weak ? "bg-amber-500" : "bg-np")}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {weak && trainTests.length > 0 && (
                <p className="mt-1 text-xs text-stone-600">
                  Träna mer:{" "}
                  {trainTests.map((t, i) => (
                    <span key={t.id}>
                      {i > 0 && " · "}
                      <button
                        onClick={() => onOpenReading(t.id)}
                        className="font-semibold text-np hover:underline"
                      >
                        {t.title}
                      </button>
                    </span>
                  ))}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-np/20 pt-3">
        {unscoredCount > 0 ? (
          <p className="text-xs text-stone-500">
            {unscoredCount} öppna uppgifter är inte självrättade och räknas inte med.
          </p>
        ) : (
          <span />
        )}
        <button
          onClick={reset}
          className="text-xs font-semibold text-stone-500 hover:text-np hover:underline"
        >
          Nollställ min statistik
        </button>
      </div>
    </div>
  );
}
