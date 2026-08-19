import { useCallback, useEffect, useState } from "react";
import type { Grade, Subject } from "./types";
import { gradesFor, loadGrade, subjectMeta } from "./data/grades";
import type { GradeId } from "./data/grades";
import StartPage from "./components/StartPage";
import GradeChooser from "./components/GradeChooser";
import GradePage from "./components/GradePage";
import ReadingTestView from "./components/ReadingTestView";
import WritingTaskView from "./components/WritingTaskView";
import OralTaskView from "./components/OralTaskView";
import PresentationTaskView from "./components/PresentationTaskView";
import ReadingSettings from "./components/ReadingSettings";

type View =
  | { name: "start" }
  | { name: "subject"; subject: Subject }
  | { name: "grade"; subject: Subject; gradeId: GradeId }
  | { name: "reading"; subject: Subject; gradeId: GradeId; testId: string }
  | { name: "listening"; subject: Subject; gradeId: GradeId; testId: string }
  | { name: "writing"; subject: Subject; gradeId: GradeId; taskId: string }
  | { name: "oral"; subject: Subject; gradeId: GradeId; taskId: string };

// Lärarläge aktiveras med ?larare i adressen. Då visas facit och
// bedömningsmallar, som annars inte ska vara nåbara för eleven.
const teacherMode =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("larare");

const START: View = { name: "start" };

export default function App() {
  const [view, setView] = useState<View>(START);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(false);

  // Navigering som också lägger vyn i webbläsarhistoriken, så att
  // bakåtknappen går tillbaka i appen i stället för att lämna den.
  const navigate = useCallback((next: View) => {
    setView(next);
    window.history.pushState(next, "");
  }, []);

  useEffect(() => {
    window.history.replaceState(START, "");
    const onPop = (e: PopStateEvent) => setView((e.state as View) ?? START);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Ladda aktuellt ämne och årskurs vid behov (en i taget)
  const subject = view.name === "start" ? null : view.subject;
  const gradeId =
    view.name === "start" || view.name === "subject" ? null : view.gradeId;
  useEffect(() => {
    if (!gradeId || !subject) {
      setGrade(null);
      return;
    }
    if (grade?.id === gradeId && grade.subject === subject) return;
    let cancelled = false;
    setLoading(true);
    loadGrade(subject, gradeId)
      .then((g) => {
        if (!cancelled) setGrade(g);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subject, gradeId, grade?.id, grade?.subject]);

  const backToGrade = () =>
    gradeId && subject ? navigate({ name: "grade", subject, gradeId }) : navigate(START);

  // Slår upp ett prov/en uppgift och går tillbaka till årskursvyn om id:t
  // inte finns, i stället för att krascha.
  const find = <T extends { id: string }>(list: T[] | undefined, id: string) => {
    const hit = list?.find((x) => x.id === id);
    if (!hit) {
      queueMicrotask(backToGrade);
      return null;
    }
    return hit;
  };

  const readyGrade =
    grade && grade.id === gradeId && grade.subject === subject ? grade : null;

  return (
    <div className="min-h-screen">
      <header className="np-pattern text-white no-print">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-4">
          <button
            type="button"
            onClick={() => navigate(START)}
            className="text-left font-serif text-2xl font-bold tracking-tight"
          >
            NP-jakten
          </button>
          <ReadingSettings />
        </div>
      </header>

      <main className="px-3 py-8 sm:px-6">
        {view.name === "start" && (
          <StartPage
            subjects={subjectMeta}
            onSelectSubject={(s) => navigate({ name: "subject", subject: s })}
          />
        )}

        {view.name === "subject" && (
          <GradeChooser
            subject={subjectMeta.find((s) => s.id === view.subject)!}
            grades={gradesFor(view.subject)}
            onBack={() => navigate(START)}
            onSelectGrade={(id) =>
              navigate({ name: "grade", subject: view.subject, gradeId: id })
            }
          />
        )}

        {view.name !== "start" && view.name !== "subject" && !readyGrade && (
          <p className="text-center text-sm text-stone-500">
            {loading ? "Laddar övningar …" : ""}
          </p>
        )}

        {view.name === "grade" && readyGrade && (
          <GradePage
            grade={readyGrade}
            onBack={() => navigate({ name: "subject", subject: readyGrade.subject })}
            onOpenReading={(testId) =>
              navigate({ name: "reading", subject: readyGrade.subject, gradeId: readyGrade.id, testId })
            }
            onOpenListening={(testId) =>
              navigate({ name: "listening", subject: readyGrade.subject, gradeId: readyGrade.id, testId })
            }
            onOpenWriting={(taskId) =>
              navigate({ name: "writing", subject: readyGrade.subject, gradeId: readyGrade.id, taskId })
            }
            onOpenOral={(taskId) =>
              navigate({ name: "oral", subject: readyGrade.subject, gradeId: readyGrade.id, taskId })
            }
          />
        )}

        {(view.name === "reading" || view.name === "listening") &&
          readyGrade &&
          (() => {
            const test =
              view.name === "listening"
                ? find(readyGrade.listening, view.testId)
                : find(readyGrade.reading, view.testId);
            if (!test) return null;
            return (
              <ReadingTestView
                key={view.testId}
                test={test}
                subject={readyGrade.subject}
                gradeId={readyGrade.id}
                gradeLabel={readyGrade.label}
                teacherMode={teacherMode}
                onBack={backToGrade}
              />
            );
          })()}

        {view.name === "writing" &&
          readyGrade &&
          (() => {
            const task = find(readyGrade.writing, view.taskId);
            if (!task) return null;
            return (
              <WritingTaskView
                key={view.taskId}
                task={task}
                gradeLabel={readyGrade.label}
                teacherMode={teacherMode}
                onBack={backToGrade}
              />
            );
          })()}

        {view.name === "oral" &&
          readyGrade &&
          (() => {
            const task = find(readyGrade.oral, view.taskId);
            if (!task) return null;
            const Viewer =
              task.kind === "presentation" ? PresentationTaskView : OralTaskView;
            return (
              <Viewer
                key={view.taskId}
                task={task}
                gradeLabel={readyGrade.label}
                teacherMode={teacherMode}
                onBack={backToGrade}
              />
            );
          })()}
      </main>

      <footer className="no-print pb-10 text-center text-xs text-stone-500">
        NP-jakten – övningsuppgifter i de nationella provens format. Allt innehåll är
        nyskrivet övningsmaterial.
      </footer>

      {/* Kontaktruta längst ner till vänster */}
      <div className="no-print fixed bottom-3 left-3 z-30 rounded-md bg-white/90 px-3 py-1.5 text-xs text-stone-600 shadow-page backdrop-blur">
        Kontakt:{" "}
        <a
          href="mailto:martin.akdogan@enkoping.se"
          className="font-semibold text-np hover:underline"
        >
          martin.akdogan@enkoping.se
        </a>
      </div>
    </div>
  );
}
