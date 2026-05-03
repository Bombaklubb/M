"use client";

import { useState, useRef } from "react";
import {
  getErrorBank,
  clearError,
  recordError,
  type EngelErrorEntry,
} from "@/lib/errorBank";
import MultipleChoice from "@/components/exercises/MultipleChoice";
import { getPositiveFeedback } from "@/lib/feedback";
import FillInBlank from "@/components/exercises/FillInBlank";
import BuildSentence from "@/components/exercises/BuildSentence";
import ReadingQuestion from "@/components/exercises/ReadingQuestion";
import type { StudentData, Stage } from "@/lib/types";
import type {
  MultipleChoiceExercise,
  FillInBlankExercise,
  BuildSentenceExercise,
  ReadingQuestion as RQ,
} from "@/lib/types";

type Phase = "list" | "repair";

interface Props {
  student: StudentData;
  stageId: string;
  stage: Stage;
}

export default function ForsokaIgen({ student, stageId, stage }: Props) {
  const [phase, setPhase] = useState<Phase>("list");
  // Capture the repair list at session start so it's stable
  const [repairSession, setRepairSession] = useState<EngelErrorEntry[]>([]);
  const [repairIdx, setRepairIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0);
  const feedbackMsgRef = useRef("");

  const errors = getErrorBank(student.name, stageId);
  const currentEntry = repairSession[repairIdx];

  function startRepair() {
    const sorted = [...getErrorBank(student.name, stageId)].sort(
      (a, b) => b.count - a.count
    );
    setRepairSession(sorted);
    setRepairIdx(0);
    setAnswered(false);
    setCorrect(false);
    setExerciseKey((k) => k + 1);
    setPhase("repair");
  }

  function handleRepairAnswer(
    isCorrect: boolean,
    userAnswer: string,
    correctAnswer: string
  ) {
    if (!currentEntry) return;
    if (isCorrect) {
      clearError(student.name, stageId, currentEntry.id);
    } else {
      recordError(
        student.name,
        stageId,
        currentEntry.kind,
        currentEntry.moduleId,
        currentEntry.moduleTitle,
        currentEntry.exerciseId,
        currentEntry.question,
        correctAnswer,
        userAnswer,
        currentEntry.exerciseData
      );
    }
    if (isCorrect) feedbackMsgRef.current = getPositiveFeedback();
    setCorrect(isCorrect);
    setAnswered(true);
  }

  function nextRepair() {
    setAnswered(false);
    setCorrect(false);
    setExerciseKey((k) => k + 1);
    if (repairIdx + 1 >= repairSession.length) {
      setPhase("list");
      setRepairIdx(0);
    } else {
      setRepairIdx((r) => r + 1);
    }
  }

  // ── LIST VIEW ────────────────────────────────────────────────────────────────
  if (phase === "list") {
    return (
      <div>
        {/* Header */}
        <div className={`-mx-4 -mt-8 px-4 py-6 mb-6 ${stage.bgClass} text-white rounded-b-2xl`}>
          <h2 className="text-xl font-black">Försök igen</h2>
          <p className="text-white/75 text-sm mt-1">
            {errors.length === 0
              ? "Inga fel registrerade ännu!"
              : `${errors.length} uppgift${errors.length !== 1 ? "er" : ""} att öva på`}
          </p>
        </div>

        {errors.length === 0 ? (
          <div className="card text-center py-10">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-bold text-gray-700 dark:text-gray-200 text-lg">
              Inga fel att öva på!
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Kör vidare med fler kapitel!
            </p>
          </div>
        ) : (
          <>
            {/* Start repair button */}
            <button
              onClick={startRepair}
              className={`w-full ${stage.colorClass} text-white font-black py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition-all mb-6`}
            >
              Öva på mina {Math.min(errors.length, errors.length)} misstag!
            </button>

            {/* Error list */}
            <h3 className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">
              Dina misstag
            </h3>
            <div className="space-y-3 pb-10">
              {errors.map((entry) => (
                <div
                  key={entry.id}
                  className="card flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 dark:text-red-400 font-black text-sm">
                    {entry.count}×
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                      {entry.moduleTitle}
                    </p>
                    <p className="text-gray-800 dark:text-gray-100 text-sm font-medium leading-snug line-clamp-2">
                      {entry.question}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-xs">
                      <span className="text-red-500">
                        Ditt svar:{" "}
                        <b>{entry.wrongAnswers[entry.wrongAnswers.length - 1]}</b>
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        Rätt: <b>{entry.correctAnswer}</b>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── REPAIR DONE ──────────────────────────────────────────────────────────────
  if (!currentEntry) {
    return (
      <div className="card text-center py-10">
        <div className="text-5xl mb-3">✅</div>
        <p className="font-bold text-gray-700 dark:text-gray-200 text-lg">
          Alla uppgifter klara!
        </p>
        <button
          onClick={() => { setPhase("list"); setRepairIdx(0); }}
          className={`mt-4 ${stage.colorClass} text-white font-bold py-2 px-6 rounded-xl`}
        >
          Tillbaka
        </button>
      </div>
    );
  }

  // ── REPAIR VIEW ──────────────────────────────────────────────────────────────
  const ex = currentEntry.exerciseData;

  return (
    <div>
      {/* Progress header */}
      <div className={`-mx-4 -mt-8 px-4 py-4 mb-6 ${stage.bgClass} text-white rounded-b-2xl`}>
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => { setPhase("list"); setRepairIdx(0); }}
            className="text-white/70 hover:text-white text-sm"
          >
            ← Tillbaka
          </button>
          <span className="font-bold text-sm">
            {repairIdx + 1} / {repairSession.length}
          </span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(repairIdx / repairSession.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Context card */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-4">
        <p className="text-amber-800 dark:text-amber-300 text-sm font-bold">
          Du har svarat fel på detta {currentEntry.count} gång
          {currentEntry.count > 1 ? "er" : ""}.
        </p>
        <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">
          Ditt senaste felaktiga svar:{" "}
          <b>{currentEntry.wrongAnswers[currentEntry.wrongAnswers.length - 1]}</b>
        </p>
        <p className="text-amber-500 dark:text-amber-500 text-xs mt-0.5">
          Kapitel: {currentEntry.moduleTitle}
        </p>
      </div>

      {/* Exercise card */}
      <div className="card min-h-[220px] mb-4">
        {!answered && (
          <div key={exerciseKey}>
            {currentEntry.kind === "reading" ? (
              <ReadingQuestion
                question={ex as RQ}
                onAnswer={handleRepairAnswer}
                isLast={false}
              />
            ) : (ex as MultipleChoiceExercise).type === "multiple-choice" ? (
              <MultipleChoice
                exercise={ex as MultipleChoiceExercise}
                onAnswer={handleRepairAnswer}
                isLast={false}
              />
            ) : (ex as FillInBlankExercise).type === "fill-in-blank" ? (
              <FillInBlank
                exercise={ex as FillInBlankExercise}
                onAnswer={handleRepairAnswer}
                isLast={false}
              />
            ) : (
              <BuildSentence
                exercise={ex as BuildSentenceExercise}
                onAnswer={handleRepairAnswer}
                isLast={false}
              />
            )}
          </div>
        )}

        {answered && (
          <div
            className={`rounded-2xl p-4 animate-fade-in ${
              correct
                ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700"
            }`}
          >
            <p
              className={`font-black text-lg mb-1 ${
                correct
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {correct ? `${feedbackMsgRef.current} Misstaget är borta! ✅` : "Inte riktigt..."}
            </p>
            {!correct && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Rätt svar: <b>{currentEntry.correctAnswer}</b>
              </p>
            )}
          </div>
        )}
      </div>

      {answered && (
        <button
          onClick={nextRepair}
          className={`w-full ${stage.colorClass} text-white font-black py-4 rounded-2xl text-lg hover:opacity-90 transition-all`}
        >
          {repairIdx < repairSession.length - 1
            ? "Nästa misstag →"
            : "Klar med övningen!"}
        </button>
      )}
    </div>
  );
}
