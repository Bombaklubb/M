import type { GradeId, GradeMeta } from "../data/grades";

interface Props {
  grades: GradeMeta[];
  onSelectGrade: (gradeId: GradeId) => void;
}

export default function StartPage({ grades, onSelectGrade }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="paper">
        <p className="text-sm font-semibold uppercase tracking-widest text-np">
          Ämnesprov · Svenska och svenska som andraspråk
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">
          Träna inför nationella proven
        </h1>
        <p className="mt-4 max-w-xl text-stone-600">
          Här övar du på uppgifter som liknar de nationella proven i svenska: läsförståelse
          med berättande texter och sakprosa, och skrivuppgifter där du tränar på olika
          texttyper. Välj din årskurs för att börja.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {grades.map((grade) => (
            <button
              key={grade.id}
              type="button"
              disabled={!grade.available}
              onClick={() => onSelectGrade(grade.id)}
              className={
                grade.available
                  ? "group rounded-md border-2 border-np bg-white p-5 text-left transition hover:bg-np-light"
                  : "rounded-md border-2 border-stone-200 bg-stone-50 p-5 text-left opacity-60"
              }
            >
              <span
                className={
                  "inline-flex h-12 w-12 items-center justify-center rounded font-serif text-3xl font-bold text-white " +
                  (grade.available ? "bg-np" : "bg-stone-300")
                }
              >
                {grade.label.replace("Årskurs ", "")}
              </span>
              <p className="mt-3 font-semibold">{grade.label}</p>
              <p className="mt-1 text-sm text-stone-500">
                {grade.available ? "Läsa · Skriva · Muntligt" : "Kommer snart"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
