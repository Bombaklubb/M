import type { OralTask } from "../types";

interface Props {
  task: OralTask;
  gradeLabel: string;
}

// Utskrivbart observationsschema för de muntliga delarna: bedömningspunkterna
// som rader och plats för fyra elever i gruppen. Endast lärarens utskrift.
export default function OralObservationSheet({ task, gradeLabel }: Props) {
  return (
    <div className="paper facit-sheet hidden print:block">
      <p className="text-right text-xs italic text-stone-500">
        Svenska och svenska som andraspråk, {gradeLabel.toLowerCase()}
        <br />
        {task.delprov} – observationsschema
      </p>

      <h1 className="mt-4 font-serif text-2xl font-bold">
        Observationsschema: {task.title}
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Endast för läraren. Anteckna under samtalet – t.ex. ✓, (✓) eller –.
      </p>

      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-stone-400 p-1 text-left">
              Det här lyssnar jag efter
            </th>
            {Array.from({ length: 4 }, (_, i) => (
              <th key={i} className="w-20 border border-stone-400 p-1">
                Elev {i + 1}
              </th>
            ))}
          </tr>
          <tr>
            <td className="border border-stone-400 p-1 text-xs italic text-stone-500">
              Namn:
            </td>
            {Array.from({ length: 4 }, (_, i) => (
              <td key={i} className="h-8 border border-stone-400" />
            ))}
          </tr>
        </thead>
        <tbody>
          {task.assessmentPoints.map((point, i) => (
            <tr key={i}>
              <td className="border border-stone-400 p-1">{point}</td>
              {Array.from({ length: 4 }, (_, c) => (
                <td key={c} className="h-8 border border-stone-400" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <p className="text-sm font-bold">Anteckningar</p>
        <div className="mt-4 space-y-6">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="border-b border-stone-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
