import type { GradeId, GradeMeta, SubjectMeta } from "../data/grades";

interface Props {
  subject: SubjectMeta;
  grades: GradeMeta[];
  onBack: () => void;
  onSelectGrade: (gradeId: GradeId) => void;
}

// Väljer årskurs inom valt ämne.
export default function GradeChooser({
  subject,
  grades,
  onBack,
  onSelectGrade,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-medium text-np hover:underline"
      >
        ← Tillbaka till ämnen
      </button>

      <div className="paper">
        <p className="text-sm font-semibold uppercase tracking-widest text-np">
          {subject.label}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold">Välj årskurs</h1>
        <p className="mt-3 text-stone-600">{subject.description}</p>

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
                {grade.available ? "Öppna delproven" : "Kommer snart"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
