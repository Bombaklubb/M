import { useState } from "react";
import { grades } from "./data/grades";
import StartPage from "./components/StartPage";
import GradePage from "./components/GradePage";
import ReadingTestView from "./components/ReadingTestView";
import WritingTaskView from "./components/WritingTaskView";

type View =
  | { name: "start" }
  | { name: "grade"; gradeId: string }
  | { name: "reading"; gradeId: string; testId: string }
  | { name: "writing"; gradeId: string; taskId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: "start" });

  const grade =
    view.name !== "start" ? grades.find((g) => g.id === view.gradeId) : undefined;

  return (
    <div className="min-h-screen">
      <header className="np-pattern text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <button
            onClick={() => setView({ name: "start" })}
            className="text-left font-serif text-2xl font-bold tracking-tight"
          >
            NP-jakten
          </button>
          <span className="hidden text-sm font-medium opacity-90 sm:block">
            Träna på nationella proven i svenska
          </span>
        </div>
      </header>

      <main className="px-3 py-8 sm:px-6">
        {view.name === "start" && (
          <StartPage onSelectGrade={(gradeId) => setView({ name: "grade", gradeId })} />
        )}

        {view.name === "grade" && grade && (
          <GradePage
            grade={grade}
            onBack={() => setView({ name: "start" })}
            onOpenReading={(testId) =>
              setView({ name: "reading", gradeId: grade.id, testId })
            }
            onOpenWriting={(taskId) =>
              setView({ name: "writing", gradeId: grade.id, taskId })
            }
          />
        )}

        {view.name === "reading" && grade && (
          <ReadingTestView
            key={view.testId}
            test={grade.reading.find((t) => t.id === view.testId)!}
            onBack={() => setView({ name: "grade", gradeId: grade.id })}
          />
        )}

        {view.name === "writing" && grade && (
          <WritingTaskView
            key={view.taskId}
            task={grade.writing.find((t) => t.id === view.taskId)!}
            onBack={() => setView({ name: "grade", gradeId: grade.id })}
          />
        )}
      </main>

      <footer className="pb-10 text-center text-xs text-stone-400">
        NP-jakten – övningsuppgifter i de nationella provens format. Allt innehåll är
        nyskrivet övningsmaterial.
      </footer>
    </div>
  );
}
