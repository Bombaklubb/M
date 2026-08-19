import type { Subject } from "../types";
import type { SubjectMeta } from "../data/grades";

interface Props {
  subjects: SubjectMeta[];
  onSelectSubject: (subject: Subject) => void;
}

// Startsidan: välj ämne. Årskursen väljs i nästa steg.
export default function StartPage({ subjects, onSelectSubject }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="paper">
        <p className="text-sm font-semibold uppercase tracking-widest text-np">
          Ämnesprov · Grundskolan
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">
          Träna inför nationella proven
        </h1>
        <p className="mt-4 max-w-xl text-stone-600">
          Här övar du på uppgifter som liknar de nationella proven: läsförståelse,
          skrivuppgifter och muntliga övningar i provens format. Välj ämne för att
          börja.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject.id)}
              className="group rounded-md border-2 border-np bg-white p-6 text-left transition hover:bg-np-light"
            >
              <span className="inline-flex h-12 items-center justify-center rounded bg-np px-4 font-serif text-2xl font-bold text-white">
                {subject.label}
              </span>
              <p className="mt-3 text-sm text-stone-600">{subject.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
