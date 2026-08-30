import type { Subject, WritingTask } from "../types";

interface Props {
  task: WritingTask;
  gradeLabel: string;
  // true = visa på skärmen också (annars bara vid utskrift)
  onScreen?: boolean;
  subject?: Subject;
}

// Utskrivbart bedömningsstöd för skrivuppgifter: kraven som matris och de
// kommenterade elevexemplen. Renderas bara i lärarens utskriftsläge.
export default function WritingFacitSheet({ task, gradeLabel, onScreen, subject }: Props) {
  const groups = task.checklistGroups ?? [
    { level: "Krav på texten", items: task.checklist ?? [] },
  ];

  return (
    <div className={
        "paper facit-sheet print:block" + (onScreen ? "" : " hidden")
      }>
      <p className="text-right text-xs italic text-stone-500">
        {subject === "engelska" ? "Engelska" : "Svenska och svenska som andraspråk"},{" "}
        {gradeLabel.toLowerCase()}
        <br />
        {task.delprov} – bedömningsstöd
      </p>

      <h1 className="mt-4 font-serif text-2xl font-bold">
        Bedömningsstöd: {task.title}
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Endast för läraren. Elevens namn: ______________________________
      </p>

      {/* Kraven som ifyllbar matris */}
      <div className="mt-5 space-y-4">
        {groups.map((group, gi) => (
          <div key={gi}>
            <p className="text-sm font-bold uppercase tracking-wide">{group.level}</p>
            <table className="mt-1 w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-stone-400 p-1 text-left">Krav</th>
                  <th className="w-16 border border-stone-400 p-1">Ja</th>
                  <th className="w-16 border border-stone-400 p-1">Delvis</th>
                  <th className="w-16 border border-stone-400 p-1">Nej</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item, i) => (
                  <tr key={i}>
                    <td className="border border-stone-400 p-1">{item}</td>
                    <td className="border border-stone-400" />
                    <td className="border border-stone-400" />
                    <td className="border border-stone-400" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Kommenterade elevexempel per nivå */}
      {task.examples && task.examples.length > 0 && (
        <div className="mt-6">
          <h2 className="font-serif text-xl font-bold">Bedömda elevexempel</h2>
          <div className="mt-2 space-y-4">
            {task.examples.map((ex, i) => (
              <div key={i} className="border-t border-stone-300 pt-2">
                <p className="text-sm font-bold">
                  {ex.level} – ”{ex.heading}”
                </p>
                <ul className="mt-1 space-y-1">
                  {ex.comments.map((c, ci) => (
                    <li key={ci} className="flex gap-2 text-sm leading-relaxed">
                      <span>•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-stone-400 pt-2">
        <p className="text-sm font-bold">Sammanfattande kommentar</p>
        <div className="mt-4 space-y-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="border-b border-stone-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
