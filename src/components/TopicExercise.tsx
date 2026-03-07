import React, { useState, useEffect, useRef } from 'react';
import { Topic, Exercise, MultipleChoiceExercise, FillInExercise, TrueFalseExercise, ClockSetExercise } from '../types';
import { useApp } from '../contexts/AppContext';
import { updateAdaptive } from '../utils/adaptive';
import { recordError } from '../utils/errorBank';
import AppHeader from './AppHeader';
import InteractiveClock from './InteractiveClock';

interface ExerciseState {
  answered: boolean;
  correct: boolean;
  userAnswer: string;
}

export default function TopicExercise({ topic }: { topic: Topic }) {
  const { setView, submitTopicResult, currentStudent, isTeacher } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [states, setStates] = useState<ExerciseState[]>(
    topic.exercises.map(() => ({ answered: false, correct: false, userAnswer: '' }))
  );
  const [input, setInput] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());
  const exerciseStartRef = useRef(Date.now());
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [pointsGained, setPointsGained] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const exercise = topic.exercises[currentIdx];
  const state = states[currentIdx];
  const progress = ((currentIdx) / topic.exercises.length) * 100;

  // Focus input on new question
  useEffect(() => {
    if (!state.answered && exercise.type === 'fill-in') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    setInput('');
    setShowExplanation(false);
    setShowHint(false);
    exerciseStartRef.current = Date.now();
  }, [currentIdx]);

  function answerMultipleChoice(idx: number) {
    if (state.answered) return;
    const ex = exercise as MultipleChoiceExercise;
    const correct = idx === ex.correctIndex;
    commitAnswer(String(idx), correct);
  }

  function answerTrueFalse(answer: boolean) {
    if (state.answered) return;
    const ex = exercise as TrueFalseExercise;
    const correct = answer === ex.isTrue;
    commitAnswer(String(answer), correct);
  }

  function answerClockSet(correct: boolean) {
    if (state.answered) return;
    commitAnswer(correct ? 'korrekt' : 'fel', correct);
  }

  function answerFillIn() {
    if (state.answered) return;
    const ex = exercise as FillInExercise;
    const trimmed = input.trim().replace(',', '.');
    const correctStr = String(ex.answer).replace(',', '.');
    const acceptable = (ex.acceptableAnswers ?? []).map(a => String(a).replace(',', '.').toLowerCase());
    const correct =
      trimmed.toLowerCase() === correctStr.toLowerCase() ||
      acceptable.includes(trimmed.toLowerCase());
    commitAnswer(input, correct);
  }

  function commitAnswer(userAnswer: string, correct: boolean) {
    const elapsed = Date.now() - exerciseStartRef.current;
    // Adaptive difficulty + error bank tracking
    if (currentStudent) {
      updateAdaptive(currentStudent.id, topic.id, correct, elapsed);
      if (!correct) {
        const ex = exercise;
        const correctAns = ex.type === 'multiple-choice'
          ? (ex as any).options[(ex as any).correctIndex]
          : ex.type === 'true-false' ? String((ex as any).isTrue)
          : ex.type === 'clock-set'
            ? `${String((ex as any).targetHour).padStart(2,'0')}:${String((ex as any).targetMinute).padStart(2,'0')}`
          : String((ex as any).answer);
        recordError(currentStudent.id, topic.id, topic.title, ex.id, ex.question, correctAns, userAnswer);
      }
    }
    setShowExplanation(true);
    const newStates = [...states];
    newStates[currentIdx] = { answered: true, correct, userAnswer };
    setStates(newStates);

    if (correct) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 800);
    }
  }

  function handleNext() {
    if (currentIdx < topic.exercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Done!
      const correct = states.filter(s => s.correct).length + (states[currentIdx].correct ? 0 : 0);
      const totalCorrect = states.filter((s, i) =>
        i === currentIdx ? s.correct : s.correct
      ).length;
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const result = submitTopicResult(topic.id, totalCorrect, topic.exercises.length, timeSpent);
      setNewAchievements(result.newAchievements);
      setPointsGained(result.pointsGained);
      setView('topic-result');
    }
  }

  const isLastExercise = currentIdx === topic.exercises.length - 1;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}>
      <AppHeader />
      {/* Top bar */}
      <div className={`bg-gradient-to-r ${topic.color} text-white px-4 pt-16 pb-3`}>
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setView('topic-instruction')}
              className="text-white/80 hover:text-white text-sm"
            >
              ← Instruktion
            </button>
            <span className="font-bold text-sm">
              {currentIdx + 1} / {topic.exercises.length}
            </span>
            <span className="text-sm font-bold">
              {states.filter(s => s.correct).length} ✓
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-8xl animate-bounce-in">⭐</div>
        </div>
      )}

      {/* Exercise area */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl p-6 mb-4">
          {/* Points badge */}
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              exercise.type === 'multiple-choice'  ? 'bg-blue-500/30 text-blue-300' :
              exercise.type === 'fill-in'          ? 'bg-purple-500/30 text-purple-300' :
                                                     'bg-emerald-500/30 text-emerald-300'
            }`}>
              {exercise.type === 'multiple-choice'   ? '🔘 Flerval' :
               exercise.type === 'fill-in'           ? '✏️ Fritext' :
                                                       '✅ Sant/Falskt'}
            </span>
            <span className="text-sm font-bold text-amber-400">+{exercise.points}p</span>
          </div>

          {/* Static clock display – shown when exercise.clockDisplay is set */}
          {exercise.clockDisplay && (
            <div className="flex flex-col items-center mb-5">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wide mb-2">
                🕐 Se klockan
              </p>
              <div className="bg-white/10 rounded-2xl border border-white/20 p-3 inline-block">
                <InteractiveClock
                  hour={exercise.clockDisplay.hour}
                  minute={exercise.clockDisplay.minute}
                  onChange={() => {}}
                  readOnly
                  size={180}
                />
              </div>
            </div>
          )}

          {/* Question */}
          <h2 className="text-xl font-bold text-white mb-4 leading-snug">
            {exercise.question}
          </h2>

          {/* Tänk så här – hint button (only before answering) */}
          {!state.answered && (
            <div className="mb-5">
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-2 text-sm font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-4 py-2 rounded-xl transition-colors w-full"
              >
                <span>🤔</span>
                <span>{showHint ? 'Dölj tips' : 'Tänk så här'}</span>
                <span className="ml-auto text-xs opacity-60">{showHint ? '▲' : '▼'}</span>
              </button>
              {showHint && <HintPanel exercise={exercise} />}
            </div>
          )}

          {/* Answer area */}
          {exercise.type === 'multiple-choice' && (
            <MultipleChoiceAnswers
              exercise={exercise as MultipleChoiceExercise}
              state={state}
              onAnswer={answerMultipleChoice}
            />
          )}
          {exercise.type === 'true-false' && (
            <TrueFalseAnswers
              state={state}
              onAnswer={answerTrueFalse}
            />
          )}
          {exercise.type === 'fill-in' && (
            <FillInAnswer
              exercise={exercise as FillInExercise}
              state={state}
              input={input}
              inputRef={inputRef}
              onChange={setInput}
              onSubmit={answerFillIn}
            />
          )}
          {exercise.type === 'clock-set' && (
            <ClockSetAnswers
              exercise={exercise as ClockSetExercise}
              state={state}
              onAnswer={answerClockSet}
            />
          )}
          {/* Rätt svar – kort bekräftelse */}
          {showExplanation && state.correct && (
            <div className="mt-4 rounded-2xl px-4 py-3 bg-emerald-500/20 border border-emerald-400/40 animate-fade-in">
              <p className="text-emerald-300 font-black">🎉 Rätt! Bra jobbat!</p>
            </div>
          )}
          {/* Fel svar – rik förklaring med bildstöd */}
          {showExplanation && !state.correct && (
            <WrongAnswerExplanation exercise={exercise} />
          )}
        </div>

        {/* Next button */}
        {state.answered && (
          <button
            onClick={handleNext}
            className={`w-full font-black text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-slide-up ${
              isLastExercise
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            }`}
          >
            {isLastExercise ? '🏁 Se resultat!' : 'Nästa →'}
          </button>
        )}

        {/* Score tracker */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {topic.exercises.map((_, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentIdx
                  ? states[i].correct ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  : i === currentIdx
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300/50'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {i < currentIdx
                ? states[i].correct ? '✓' : '✗'
                : i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MultipleChoiceAnswers({
  exercise, state, onAnswer
}: {
  exercise: MultipleChoiceExercise;
  state: ExerciseState;
  onAnswer: (idx: number) => void;
}) {
  return (
    <div className="grid gap-3">
      {exercise.options.map((opt, i) => {
        let cls = 'border-2 border-white/15 bg-white/5 text-white hover:border-blue-400 hover:bg-blue-500/20';
        if (state.answered) {
          if (i === exercise.correctIndex) cls = 'border-2 border-emerald-400 bg-emerald-500/20 text-emerald-200';
          else if (state.userAnswer === String(i)) cls = 'border-2 border-rose-400 bg-rose-500/20 text-rose-200';
          else cls = 'border-2 border-white/10 bg-white/5 text-white/30 opacity-60';
        }
        return (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={state.answered}
            className={`w-full text-left px-5 py-3 rounded-2xl font-semibold text-base transition-all ${cls} ${!state.answered ? 'cursor-pointer active:scale-98' : 'cursor-default'}`}
          >
            <span className="font-bold text-white/40 mr-2">
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
            {state.answered && i === exercise.correctIndex && <span className="float-right">✓</span>}
            {state.answered && state.userAnswer === String(i) && i !== exercise.correctIndex && <span className="float-right">✗</span>}
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseAnswers({ state, onAnswer }: {
  state: ExerciseState;
  onAnswer: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[true, false].map(val => {
        let cls = 'border-2 border-white/15 bg-white/5 text-white hover:border-emerald-400 hover:bg-emerald-500/20';
        if (state.answered) {
          if (state.correct && state.userAnswer === String(val)) cls = 'border-2 border-emerald-400 bg-emerald-500/20 text-emerald-200';
          else if (!state.correct && state.userAnswer === String(val)) cls = 'border-2 border-rose-400 bg-rose-500/20 text-rose-200';
          else if (state.correct && state.userAnswer !== String(val)) cls = 'border-2 border-white/10 bg-white/5 text-white/30';
          else cls = 'border-2 border-emerald-400 bg-emerald-500/20 text-emerald-200'; // Show correct
        }
        return (
          <button
            key={String(val)}
            onClick={() => onAnswer(val)}
            disabled={state.answered}
            className={`py-5 rounded-2xl font-black text-2xl transition-all ${cls} ${!state.answered ? 'cursor-pointer hover:scale-105' : ''}`}
          >
            {val ? '👍 Sant' : '👎 Falskt'}
          </button>
        );
      })}
    </div>
  );
}

function FillInAnswer({ exercise, state, input, inputRef, onChange, onSubmit }: {
  exercise: FillInExercise;
  state: ExerciseState;
  input: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-3">
      {exercise.hint && !state.answered && (
        <p className="text-sm text-amber-300 bg-amber-500/20 border border-amber-400/30 rounded-xl px-3 py-2">
          💡 Tips: {exercise.hint}
        </p>
      )}
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={state.answered ? state.userAnswer : input}
          onChange={e => !state.answered && onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !state.answered && onSubmit()}
          disabled={state.answered}
          placeholder="Skriv ditt svar..."
          className={`flex-1 border-2 rounded-2xl px-4 py-3 text-lg font-bold focus:outline-none transition-colors ${
            state.answered
              ? state.correct
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                : 'border-rose-400 bg-rose-500/20 text-rose-300'
              : 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-blue-400'
          }`}
        />
        {!state.answered && (
          <button
            onClick={onSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 rounded-2xl transition-colors"
          >
            ✓
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Clock-set exercise ───────────────────────────────────────────────────────

function ClockSetAnswers({
  exercise,
  state,
  onAnswer,
}: {
  exercise: ClockSetExercise;
  state: ExerciseState;
  onAnswer: (correct: boolean) => void;
}) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  function handleTimeChange(h: number, m: number) {
    setHour(h);
    setMinute(m);
  }

  function handleSubmit() {
    if (state.answered) return;
    const correct = hour === exercise.targetHour && minute === exercise.targetMinute;
    onAnswer(correct);
  }

  function fmt(h: number, m: number) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  return (
    <div className="space-y-3">
      {/* Clock */}
      <div className="flex justify-center">
        <InteractiveClock
          hour={hour}
          minute={minute}
          onChange={handleTimeChange}
          readOnly={state.answered}
          size={210}
        />
      </div>

      {/* Digital display */}
      <p className="text-center text-3xl font-black text-white tabular-nums">
        {fmt(hour, minute)}
      </p>

      {!state.answered && (
        <>
          {/* Step controls */}
          <div className="grid grid-cols-2 gap-3">
            {/* Hour */}
            <div className="bg-white/8 border border-white/15 rounded-2xl p-2 text-center">
              <p className="text-xs font-bold text-white/50 mb-1">⏱ Timme</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setHour(h => (h === 1 ? 12 : h - 1))}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-colors"
                >‹</button>
                <span className="w-6 text-center font-black text-xl text-white">{hour}</span>
                <button
                  onClick={() => setHour(h => (h === 12 ? 1 : h + 1))}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-colors"
                >›</button>
              </div>
            </div>
            {/* Minute */}
            <div className="bg-white/8 border border-white/15 rounded-2xl p-2 text-center">
              <p className="text-xs font-bold text-white/50 mb-1">⏰ Minut</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setMinute(m => (m === 0 ? 55 : m - 5))}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-colors"
                >‹</button>
                <span className="w-8 text-center font-black text-xl text-white">{String(minute).padStart(2, '0')}</span>
                <button
                  onClick={() => setMinute(m => (m === 55 ? 0 : m + 5))}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-colors"
                >›</button>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-white/40">
            Dra på klockan eller använd knapparna · Inre cirkel = timme · Yttre = minut
          </p>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded-2xl text-lg transition-colors"
          >
            ✓ Klar!
          </button>
        </>
      )}
    </div>
  );
}

// ─── Visual explanation (only on wrong answer) ───────────────────────────────

function WrongAnswerExplanation({ exercise }: { exercise: Exercise }) {
  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-rose-400/40 animate-fade-in">
      <div className="bg-rose-500/30 px-4 py-2.5">
        <p className="text-rose-200 font-black">❌ Inte riktigt — så här tänker man:</p>
      </div>
      <div className="bg-rose-500/10 px-4 py-3 space-y-2">
        {exercise.explanation && (
          <p className="text-sm text-rose-300 leading-relaxed">{exercise.explanation}</p>
        )}
        <ExerciseVisual exercise={exercise} />
      </div>
    </div>
  );
}

/** Auto-generates a visual aid based on exercise type and question content. */
function ExerciseVisual({ exercise }: { exercise: Exercise }) {
  const q = exercise.question;

  // ── Addition: "X + Y" ────────────────────────────────────────────────────
  const addMatch = q.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch && exercise.type === 'fill-in') {
    const a = parseInt(addMatch[1]), b = parseInt(addMatch[2]);
    const sum = a + b;
    if (sum <= 20) return <NumberLineAdd a={a} b={b} />;
    return <StepCalc title="Räkna så här:" lines={[`${a} + ${b} = ?`, `${a} + ${b} = ${sum}`]} answer={String(sum)} />;
  }

  // ── Subtraction: "X − Y" or "X - Y" ────────────────────────────────────
  const subMatch = q.match(/(\d+)\s*[−-]\s*(\d+)/);
  if (subMatch && exercise.type === 'fill-in') {
    const a = parseInt(subMatch[1]), b = parseInt(subMatch[2]);
    const diff = a - b;
    if (a <= 20) return <NumberLineSub a={a} b={b} />;
    return <StepCalc title="Räkna så här:" lines={[`${a} − ${b} = ?`, `${a} − ${b} = ${diff}`]} answer={String(diff)} />;
  }

  // ── Multiplication: "X × Y" or "X x Y" ──────────────────────────────────
  const multMatch = q.match(/(\d+)\s*[×xX*]\s*(\d+)/);
  if (multMatch && exercise.type === 'fill-in') {
    const a = parseInt(multMatch[1]), b = parseInt(multMatch[2]);
    const prod = a * b;
    if (a <= 10 && b <= 10 && prod <= 50) return <DotGrid rows={b} cols={a} />;
    // Show as repeated addition table
    const rows: string[] = [];
    const limit = Math.min(b, 5);
    for (let i = 1; i <= limit; i++) rows.push(`${a} × ${i} = ${a * i}`);
    if (b > 5) rows.push('...');
    rows.push(`${a} × ${b} = ${prod}`);
    return <StepCalc title={`${a} × ${b} räknas som:`} lines={rows} answer={String(prod)} />;
  }

  // ── Division: "X ÷ Y" ───────────────────────────────────────────────────
  const divMatch = q.match(/(\d+)\s*÷\s*(\d+)/);
  if (divMatch && exercise.type === 'fill-in') {
    const a = parseInt(divMatch[1]), b = parseInt(divMatch[2]);
    const q2 = Math.floor(a / b);
    const rows: string[] = [];
    for (let i = 1; i <= q2; i++) rows.push(`${b} × ${i} = ${b * i}`);
    rows.push(`Svar: ${a} ÷ ${b} = ${q2}`);
    return <StepCalc title={`Hitta hur många gånger ${b} går i ${a}:`} lines={rows} answer={String(q2)} />;
  }

  // ── Clock-set: show correct time on a static clock ──────────────────────
  if (exercise.type === 'clock-set') {
    const ex = exercise as ClockSetExercise;
    const fmtH = String(ex.targetHour).padStart(2, '0');
    const fmtM = String(ex.targetMinute).padStart(2, '0');
    return (
      <div className="mt-3 flex items-center gap-4">
        <InteractiveClock
          hour={ex.targetHour}
          minute={ex.targetMinute}
          onChange={() => {}}
          readOnly
          size={150}
        />
        <div>
          <p className="text-xs font-bold text-white/50 mb-1">Rätt tid:</p>
          <p className="text-3xl font-black text-emerald-400 tabular-nums">{fmtH}:{fmtM}</p>
          <p className="text-xs text-white/40 mt-2">
            Kort visare (mörk) → {ex.targetHour}<br />
            Lång visare (blå) → {ex.targetMinute} min
          </p>
        </div>
      </div>
    );
  }

  // ── Multiple-choice: highlight correct answer ────────────────────────────
  if (exercise.type === 'multiple-choice') {
    const ex = exercise as MultipleChoiceExercise;
    return (
      <div className="mt-1 bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-4 py-2.5">
        <p className="text-sm font-black text-emerald-300">✓ Rätt svar: {ex.options[ex.correctIndex]}</p>
      </div>
    );
  }

  // ── True/false: show correct answer ─────────────────────────────────────
  if (exercise.type === 'true-false') {
    const ex = exercise as TrueFalseExercise;
    return (
      <div className="mt-1 bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-4 py-2.5">
        <p className="text-sm font-black text-emerald-300">
          ✓ Rätt svar: {ex.isTrue ? '👍 Sant' : '👎 Falskt'}
        </p>
      </div>
    );
  }

  return null;
}

/** Number line for addition: highlights start, jump, and result. */
function NumberLineAdd({ a, b }: { a: number; b: number }) {
  const sum = a + b;
  const cells = Array.from({ length: sum + 1 }, (_, i) => i);
  const cellW = Math.max(22, Math.min(32, Math.floor(300 / (sum + 1))));
  return (
    <div className="mt-2">
      <p className="text-xs font-bold text-white/50 mb-1">📏 Tallinjen — räkna {b} steg från {a}:</p>
      <div className="overflow-x-auto pb-1">
        <div className="flex items-end" style={{ gap: 2 }}>
          {cells.map(n => (
            <div key={n} className="flex flex-col items-center flex-shrink-0" style={{ width: cellW }}>
              <div className={`rounded-full font-bold flex items-center justify-center text-[11px] leading-none ${
                n === sum ? 'bg-green-500 text-white ring-2 ring-green-300' :
                n === a   ? 'bg-blue-500 text-white' :
                n > a     ? 'bg-blue-200 text-blue-700' :
                            'bg-gray-100 text-gray-500'
              }`} style={{ width: cellW - 2, height: cellW - 2 }}>
                {n}
              </div>
              <div className="bg-gray-300 mt-0.5" style={{ height: 2, width: cellW - 2 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-1 text-[11px]">
        <span className="flex items-center gap-1 text-blue-700"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Start ({a})</span>
        <span className="flex items-center gap-1 text-green-700"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Svar ({sum})</span>
      </div>
    </div>
  );
}

/** Number line for subtraction: shows stepping left. */
function NumberLineSub({ a, b }: { a: number; b: number }) {
  const diff = a - b;
  const cells = Array.from({ length: a + 1 }, (_, i) => i);
  const cellW = Math.max(22, Math.min(32, Math.floor(300 / (a + 1))));
  return (
    <div className="mt-2">
      <p className="text-xs font-bold text-white/50 mb-1">📏 Tallinjen — räkna {b} steg tillbaka från {a}:</p>
      <div className="overflow-x-auto pb-1">
        <div className="flex items-end" style={{ gap: 2 }}>
          {cells.map(n => (
            <div key={n} className="flex flex-col items-center flex-shrink-0" style={{ width: cellW }}>
              <div className={`rounded-full font-bold flex items-center justify-center text-[11px] leading-none ${
                n === diff ? 'bg-green-500 text-white ring-2 ring-green-300' :
                n === a    ? 'bg-blue-500 text-white' :
                n > diff && n < a ? 'bg-red-200 text-red-700' :
                                    'bg-gray-100 text-gray-500'
              }`} style={{ width: cellW - 2, height: cellW - 2 }}>
                {n}
              </div>
              <div className="bg-gray-300 mt-0.5" style={{ height: 2, width: cellW - 2 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-1 text-[11px]">
        <span className="flex items-center gap-1 text-blue-700"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Start ({a})</span>
        <span className="flex items-center gap-1 text-green-700"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Svar ({diff})</span>
      </div>
    </div>
  );
}

/** Dot grid for multiplication: rows × cols array of dots. */
function DotGrid({ rows, cols }: { rows: number; cols: number }) {
  const product = rows * cols;
  return (
    <div className="mt-2">
      <p className="text-xs font-bold text-white/50 mb-1.5">🔵 Prickar — {cols} kolumner × {rows} rader:</p>
      <div className="overflow-x-auto">
        <div className="flex flex-col gap-1.5 inline-flex">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="flex gap-1.5">
              {Array.from({ length: cols }, (_, c) => (
                <div key={c} className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ background: `hsl(${(r * 30) % 360},65%,55%)` }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm font-black text-white/80 mt-1.5">{rows} rader × {cols} = <span className="text-emerald-400">{product}</span></p>
    </div>
  );
}

// ─── "Tänk så här" hint system ───────────────────────────────────────────────

function HintPanel({ exercise }: { exercise: Exercise }) {
  const hint = generateHint(exercise);
  return (
    <div className="mt-2 bg-amber-500/15 border border-amber-400/30 rounded-2xl px-4 py-3 animate-fade-in">
      <p className="text-xs font-black text-amber-300 uppercase tracking-wide mb-2">💡 Strategi – tänk så här:</p>
      <p className="text-sm text-amber-200 leading-relaxed whitespace-pre-line">{hint}</p>
    </div>
  );
}

function generateHint(exercise: Exercise): string {
  // Use existing hint field if available
  if ('hint' in exercise && (exercise as FillInExercise).hint) {
    return (exercise as FillInExercise).hint!;
  }

  const q = exercise.question;

  // Parentheses / order of operations
  if (/parentes|PEMDAS|ordning/i.test(q) || (q.match(/[+\-]/g) && q.match(/[×÷]/g))) {
    return 'Räkna i rätt ordning:\n1. Parenteser ( ) räknas ALLTID först\n2. Potenser (t.ex. 3²)\n3. × och ÷ — vänster till höger\n4. + och − — vänster till höger';
  }

  // Negative numbers
  if (q.includes('−') && /−\d/.test(q.replace(/\s/g, ''))) {
    return 'Negativa tal – kom ihåg:\n• − och − = + (t.ex. 5 − (−3) = 5 + 3)\n• − × − = + (t.ex. (−4) × (−2) = 8)\n• − × + = − (t.ex. −3 × 5 = −15)\nTips: Använd tallinjen och räkna steg åt höger/vänster!';
  }

  // Standard form / powers of 10
  if (/standardform|10\^|10⁻|×\s*10/i.test(q)) {
    return 'Standardform (a × 10ⁿ):\n• Flytta kommat tills siffran framför är 1–9\n• Räkna antalet steg = n\n• Stor tal (flytta vänster) → positivt n\n• Litet tal (flytta höger) → negativt n\nExempel: 0,0072 → flytta 3 steg → 7,2 × 10⁻³';
  }

  // Powers and roots
  if (/[²³⁴⁵]|√|roten ur|\^/.test(q)) {
    return 'Potenser och rötter:\n• aⁿ = a multiplicerat med sig självt n gånger\n• √x = det positiva tal som multiplicerat med sig självt ger x\n• Regler: aᵐ × aⁿ = aᵐ⁺ⁿ\n• a⁰ = 1 (alltid!)\nTips: Börja med att räkna ut potensen eller roten innan du gör resten.';
  }

  // Fractions — division
  if (/÷|dela/.test(q) && /\d\/\d|bråk/i.test(q)) {
    return 'Division av bråk – vänd och multiplicera:\n1. Vänd det bråk du dividerar med (byt täljare och nämnare)\n2. Multiplicera istället för att dividera\nExempel: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6';
  }

  // Fractions — addition/subtraction
  if (/\d\/\d|nämnare|bråk/i.test(q)) {
    if (/[+−\-]/.test(q)) {
      return 'Addition/subtraktion av bråk:\n1. Hitta Minsta Gemensamma Nämnaren (MGN)\n2. Bygg om båda bråken med den nya nämnaren\n3. Addera eller subtrahera bara täljarna\nExempel: 1/3 + 1/4 → MGN=12 → 4/12 + 3/12 = 7/12';
    }
    return 'Multiplikation av bråk:\n1. Täljare × täljare\n2. Nämnare × nämnare\n3. Förenkla om möjligt\nExempel: 2/3 × 3/5 = 6/15 = 2/5';
  }

  // Percent / proportional change
  if (/procent|%|rabatt|ökning|minskning|förändring/i.test(q)) {
    return 'Procent – förändringsfaktorn:\n• Ökning med p%: multiplicera med (1 + p/100)\n  Exempel: +20% → × 1,20\n• Minskning med p%: multiplicera med (1 − p/100)\n  Exempel: 15% rabatt → × 0,85\n• Procentuell förändring: (nytt − gammalt) ÷ gammalt × 100%';
  }

  // Equations / algebra
  if (/x\s*=|=\s*x|\bx\b|\by\b|ekvation|variabel/i.test(q)) {
    return 'Lös ekvationen steg för steg:\n1. Flytta alla x-termer till ena sidan\n2. Flytta alla tal till andra sidan\n3. Dividera båda sidor med koefficienten\nTips: Vad du gör på ena sidan måste du göra på den andra!';
  }

  // Proportions / scale / ratios
  if (/skala|karta|proportion|förhållande|:/.test(q)) {
    return 'Proportioner – trestegsregeln:\n1. Hitta värdet för EN enhet\n2. Multiplicera med det antal du söker\nEller korsvis multiplikation: a/b = c/d → a × d = b × c\nSkala: verklig sträcka = kartmått × skalans nämnare';
  }

  // Pythagoras
  if (/a²|b²|c²|hypoten|rätvinkl|pythagoras/i.test(q)) {
    return 'Pythagoras sats: a² + b² = c²\n• c = hypotenusan (sidan MOT räta vinkeln – alltid längst!)\n• Hitta c: c = √(a² + b²)\n• Hitta ett ben: a = √(c² − b²)\nSteg: Kvadrera → addera/subtrahera → ta kvadratroten';
  }

  // Angles
  if (/vinkel|°|triangel.*vinkel|vinkel.*triangel/i.test(q)) {
    return 'Vinkelsummor:\n• Triangel: alla vinklar = 180°\n• Rät linje: 180°, Hel varv: 360°\n• Fyrhörning: 360°\n• Vertikalvinklar (motstående): alltid lika\nTips: Skriv upp det du vet och räkna ut resten med subtraktion!';
  }

  // Coordinate system / line
  if (/koordinat|mittpunkt|\([\d-]+,|lutning|y = k|räta linjen/i.test(q)) {
    return 'Koordinater och räta linjen:\n• Punkt (x, y): x=horisontell, y=vertikal\n• Lutning k = (y₂ − y₁) / (x₂ − x₁)\n• y = kx + m: k=lutning, m=y-skärningspunkt\nTips: Sätt x = 0 för att hitta var linjen skär y-axeln!';
  }

  // Volume / area / geometry
  if (/volym|area|omkrets|cylinder|prisma|rätblock|cirkel/i.test(q)) {
    return 'Välj rätt formel:\n• Rektangel/rätblock: A = l × b, V = l × b × h\n• Triangel: A = (bas × höjd) / 2\n• Cirkel: A = πr², O = 2πr\n• Cylinder: V = πr²h\nTips: Identifiera figuren → plocka formeln → räkna!';
  }

  // Statistics
  if (/medelvärde|median|typvärde|variationsbredd|kvartil|IQR/i.test(q)) {
    return 'Statistik – välj rätt mått:\n• Medelvärde: (summan av alla värden) ÷ antal\n• Median: sortera talen → ta det mittersta\n• Typvärde: det värde som förekommer flest gånger\n• Variationsbredd: största − minsta\nTips: Sortera alltid listan innan du räknar ut median!';
  }

  // Rounding / estimation
  if (/avrunda|avrundn|överslag|uppskatt/i.test(q)) {
    return 'Avrundning – tumregel:\n• Titta på siffran TILL HÖGER om avrundningspositionen\n• 0–4 → behåll (avrunda nedåt)\n• 5–9 → öka med 1 (avrunda uppåt)\nÖverslag: avrunda talen INNAN du räknar för att få en snabb uppskattning!';
  }

  // Generic fallback
  return 'Strategi för att lösa uppgiften:\n1. Läs frågan noga – vad söker du exakt?\n2. Identifiera vilken metod som passar (formel, ekvation, proportion...)\n3. Räkna ett steg i taget\n4. Kontrollera svaret – är det rimligt?';
}

/** Step-by-step calculation display. */
function StepCalc({ title, lines, answer }: { title: string; lines: string[]; answer: string }) {
  return (
    <div className="mt-2 bg-white/8 rounded-xl border border-white/15 overflow-hidden">
      <div className="bg-white/5 px-3 py-1.5 border-b border-white/10">
        <p className="text-xs font-bold text-white/50">{title}</p>
      </div>
      <div className="px-3 py-2 space-y-0.5">
        {lines.map((line, i) => (
          <p key={i} className={`font-mono ${
            i === lines.length - 1
              ? 'font-black text-emerald-400 text-base border-t border-white/10 pt-1 mt-1'
              : 'text-sm text-white/70'
          }`}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
