import { useMemo, useState } from "react";
import type { Question, ReadingTest } from "../types";

interface Props {
  test: ReadingTest;
  gradeLabel: string;
  onBack: () => void;
}

const LETTERS = ["A", "B", "C", "D"];

export default function ReadingTestView({ test, gradeLabel, onBack }: Props) {
  const [mcAnswers, setMcAnswers] = useState<Record<number, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<number, string>>({});
  // ordningsuppgift: valt nummer (1–4) per mening, per uppgift
  const [orderAnswers, setOrderAnswers] = useState<Record<number, Record<number, number>>>({});
  const [selfPoints, setSelfPoints] = useState<Record<number, number>>({});
  const [reviewing, setReviewing] = useState(false);

  const maxPoints = useMemo(
    () => test.questions.reduce((sum, q) => sum + q.maxPoints, 0),
    [test]
  );

  const answeredCount = test.questions.filter((q) => {
    if (q.kind === "multiple-choice") return mcAnswers[q.id] !== undefined;
    if (q.kind === "ordering")
      return q.items.every((_, i) => orderAnswers[q.id]?.[i] !== undefined);
    return (openAnswers[q.id] ?? "").trim().length > 0;
  }).length;

  const score = useMemo(() => {
    if (!reviewing) return 0;
    return test.questions.reduce((sum, q) => {
      if (q.kind === "multiple-choice") {
        return sum + (mcAnswers[q.id] === q.correctIndex ? q.maxPoints : 0);
      }
      if (q.kind === "ordering") {
        const allRight = q.items.every(
          (_, i) => orderAnswers[q.id]?.[i] === q.correctOrder[i]
        );
        return sum + (allRight ? q.maxPoints : 0);
      }
      return sum + (selfPoints[q.id] ?? 0);
    }, 0);
  }, [reviewing, test, mcAnswers, orderAnswers, selfPoints]);

  const allOpenScored = test.questions
    .filter((q) => q.kind === "open")
    .every((q) => selfPoints[q.id] !== undefined);

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-4 text-sm font-medium text-np hover:underline">
        ← Tillbaka till delproven
      </button>

      {/* Texthäftet */}
      <div className="paper">
        <p className="text-right text-xs italic text-stone-500">
          Svenska och svenska som andraspråk, {gradeLabel.toLowerCase()}
          <br />
          {test.delprov}
        </p>

        <h1 className="mt-6 font-serif text-3xl font-bold">{test.title}</h1>

        {test.ingress && (
          <p className="mt-4 font-serif text-lg font-semibold leading-relaxed text-stone-700">
            {test.ingress}
          </p>
        )}

        <div className="mt-4 space-y-6">
          {test.sections.map((section, si) => (
            <div key={si}>
              {section.heading && (
                <h2 className="mb-2 font-serif text-xl font-bold">{section.heading}</h2>
              )}
              <div className="space-y-3">
                {section.paragraphs.map((p, pi) => (
                  <p key={pi} className="font-serif leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {test.footnote && (
          <p className="mt-6 border-t border-stone-300 pt-3 text-sm text-stone-600">
            {test.footnote}
          </p>
        )}

        <div className="mt-8 text-sm italic text-stone-500">
          {test.byline.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Frågehäftet */}
      <div className="paper mt-8">
        <div className="flex items-center justify-between border-b-2 border-np pb-3">
          <h2 className="font-serif text-2xl font-bold">
            {test.title}{" "}
            <span className="text-base font-normal text-stone-500">– uppgifter</span>
          </h2>
          <span className="rounded bg-np px-3 py-1 text-sm font-bold text-white">
            Maxpoäng: {maxPoints}
          </span>
        </div>

        <div className="mt-6 space-y-10">
          {test.questions.map((q) => (
            <QuestionView
              key={q.id}
              question={q}
              reviewing={reviewing}
              mcAnswer={mcAnswers[q.id]}
              openAnswer={openAnswers[q.id] ?? ""}
              orderAnswer={orderAnswers[q.id] ?? {}}
              selfPoint={selfPoints[q.id]}
              onSelectMc={(index) =>
                !reviewing && setMcAnswers((prev) => ({ ...prev, [q.id]: index }))
              }
              onChangeOpen={(text) =>
                !reviewing && setOpenAnswers((prev) => ({ ...prev, [q.id]: text }))
              }
              onSelectOrder={(itemIndex, position) =>
                !reviewing &&
                setOrderAnswers((prev) => ({
                  ...prev,
                  [q.id]: { ...prev[q.id], [itemIndex]: position },
                }))
              }
              onSelfScore={(points) =>
                setSelfPoints((prev) => ({ ...prev, [q.id]: points }))
              }
            />
          ))}
        </div>

        {!reviewing ? (
          <div className="mt-10 border-t border-stone-200 pt-6 text-center">
            <p className="mb-3 text-sm text-stone-500">
              Du har besvarat {answeredCount} av {test.questions.length} uppgifter.
            </p>
            <button
              onClick={() => setReviewing(true)}
              className="rounded-md bg-np px-8 py-3 font-bold text-white transition hover:bg-np-dark"
            >
              Rätta provet
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-md border-2 border-np bg-np-light p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-np">
              Ditt resultat
            </p>
            <p className="mt-1 font-serif text-4xl font-bold text-np-dark">
              {score} / {maxPoints} poäng
            </p>
            {!allOpenScored && (
              <p className="mt-2 text-sm text-stone-600">
                Glöm inte att sätta poäng på dina öppna svar här ovanför – jämför med
                bedömningsanvisningen, precis som en lärare gör.
              </p>
            )}
            <button
              onClick={() => {
                setMcAnswers({});
                setOpenAnswers({});
                setOrderAnswers({});
                setSelfPoints({});
                setReviewing(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-4 rounded-md border-2 border-np px-6 py-2 font-bold text-np transition hover:bg-white"
            >
              Gör om provet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuestionViewProps {
  question: Question;
  reviewing: boolean;
  mcAnswer?: number;
  openAnswer: string;
  orderAnswer: Record<number, number>;
  selfPoint?: number;
  onSelectMc: (index: number) => void;
  onChangeOpen: (text: string) => void;
  onSelectOrder: (itemIndex: number, position: number) => void;
  onSelfScore: (points: number) => void;
}

function QuestionView({
  question: q,
  reviewing,
  mcAnswer,
  openAnswer,
  orderAnswer,
  selfPoint,
  onSelectMc,
  onChangeOpen,
  onSelectOrder,
  onSelfScore,
}: QuestionViewProps) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded border border-stone-300 px-2 py-1 text-center text-xs text-stone-500">
          <p className="font-semibold">Uppgift {q.id}</p>
          <p>
            Maxpoäng: <span className="font-bold text-stone-700">{q.maxPoints}</span>
          </p>
        </div>
        <p className="pt-1 font-medium leading-relaxed">
          <span className="font-bold">{q.id}.</span> {q.prompt}
          {reviewing && q.kind === "multiple-choice" && q.category && (
            <span
              className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-xs font-semibold text-stone-500"
              title={
                q.category === "L"
                  ? "Lokalisering – svaret kan hittas direkt i texten"
                  : "Tolkning och integrering – svaret måste tolkas ur sammanhanget"
              }
            >
              {q.category}-fråga
            </span>
          )}
        </p>
      </div>

      {q.kind === "multiple-choice" ? (
        <div className="mt-4 space-y-2 pl-2 sm:pl-20">
          {q.options.map((option, index) => {
            const selected = mcAnswer === index;
            const isCorrect = index === q.correctIndex;
            let style = "border-stone-300 hover:bg-stone-50";
            if (reviewing) {
              if (isCorrect) style = "border-green-600 bg-green-50";
              else if (selected) style = "border-red-500 bg-red-50";
              else style = "border-stone-200 opacity-70";
            } else if (selected) {
              style = "border-np bg-np-light";
            }
            return (
              <button
                key={index}
                onClick={() => onSelectMc(index)}
                disabled={reviewing}
                className={`flex w-full items-center gap-3 rounded border-2 p-3 text-left transition ${style}`}
              >
                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center border-2 text-sm font-bold " +
                    (selected && !reviewing
                      ? "border-np bg-np text-white"
                      : reviewing && isCorrect
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-stone-400 text-stone-600")
                  }
                >
                  {LETTERS[index]}
                </span>
                <span className="text-sm sm:text-base">{option}</span>
                {reviewing && isCorrect && (
                  <span className="ml-auto text-sm font-bold text-green-700">Rätt svar</span>
                )}
                {reviewing && selected && !isCorrect && (
                  <span className="ml-auto text-sm font-bold text-red-600">Ditt svar</span>
                )}
              </button>
            );
          })}
        </div>
      ) : q.kind === "open" ? (
        <div className="mt-4 pl-2 sm:pl-20">
          {q.note && <p className="mb-2 text-sm font-semibold italic">{q.note}</p>}
          <textarea
            value={openAnswer}
            onChange={(e) => onChangeOpen(e.target.value)}
            disabled={reviewing}
            rows={q.lines}
            placeholder="Skriv ditt svar här ..."
            className="w-full resize-y rounded border-2 border-stone-300 bg-[repeating-linear-gradient(transparent,transparent_27px,#d6d3d1_27px,#d6d3d1_28px)] p-3 font-serif leading-7 focus:border-np focus:outline-none disabled:bg-stone-50"
          />
          {reviewing && (
            <div className="mt-3 rounded-md border-l-4 border-np bg-np-light p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-np">
                Bedömningsanvisning
              </p>
              <p className="mt-1 text-sm leading-relaxed text-stone-700">{q.guidance}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">Sätt poäng på ditt svar:</span>
                {Array.from({ length: q.maxPoints + 1 }, (_, p) => (
                  <button
                    key={p}
                    onClick={() => onSelfScore(p)}
                    className={
                      "h-9 w-9 rounded-full border-2 text-sm font-bold transition " +
                      (selfPoint === p
                        ? "border-np bg-np text-white"
                        : "border-stone-400 bg-white text-stone-600 hover:border-np")
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-2 pl-2 sm:pl-20">
          <p className="mb-1 text-sm italic text-stone-500">
            Välj vilket nummer (1–{q.items.length}) varje mening ska ha.
          </p>
          {q.items.map((item, itemIndex) => {
            const chosen = orderAnswer[itemIndex];
            const correct = q.correctOrder[itemIndex];
            return (
              <div
                key={itemIndex}
                className={
                  "flex flex-wrap items-center gap-3 rounded border-2 p-3 " +
                  (reviewing
                    ? chosen === correct
                      ? "border-green-600 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-stone-300")
                }
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-stone-400 text-sm font-bold text-stone-600">
                  {LETTERS[itemIndex]}
                </span>
                <span className="flex-1 text-sm sm:text-base">{item}</span>
                <span className="flex gap-1">
                  {q.items.map((_, pos) => (
                    <button
                      key={pos}
                      onClick={() => onSelectOrder(itemIndex, pos + 1)}
                      disabled={reviewing}
                      className={
                        "h-8 w-8 rounded border-2 text-sm font-bold transition " +
                        (chosen === pos + 1
                          ? "border-np bg-np text-white"
                          : "border-stone-300 bg-white text-stone-500 hover:border-np")
                      }
                    >
                      {pos + 1}
                    </button>
                  ))}
                </span>
                {reviewing && chosen !== correct && (
                  <span className="text-sm font-bold text-red-600">Rätt: {correct}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
