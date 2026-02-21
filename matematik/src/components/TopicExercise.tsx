import React, { useState, useEffect, useRef } from 'react';
import { Topic, Exercise, MultipleChoiceExercise, FillInExercise, TrueFalseExercise, ColumnArithmeticExercise } from '../types';
import { useApp } from '../contexts/AppContext';
import { updateAdaptive } from '../utils/adaptive';
import { recordError } from '../utils/errorBank';
import AppHeader from './AppHeader';
import ColumnArithmetic from './ColumnArithmetic';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
        <div className="bg-white rounded-3xl shadow-md p-6 mb-4">
          {/* Points badge */}
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              exercise.type === 'multiple-choice'  ? 'bg-blue-100 text-blue-700' :
              exercise.type === 'fill-in'          ? 'bg-purple-100 text-purple-700' :
              exercise.type === 'column-arithmetic'? 'bg-amber-100 text-amber-700' :
                                                     'bg-green-100 text-green-700'
            }`}>
              {exercise.type === 'multiple-choice'   ? '🔘 Flerval' :
               exercise.type === 'fill-in'           ? '✏️ Fritext' :
               exercise.type === 'column-arithmetic' ? '📐 Uppställning' :
                                                       '✅ Sant/Falskt'}
            </span>
            <span className="text-sm font-bold text-amber-600">+{exercise.points}p</span>
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-gray-800 mb-6 leading-snug">
            {exercise.question}
          </h2>

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
          {exercise.type === 'column-arithmetic' && !state.answered && (
            <ColumnArithmetic
              exercise={exercise as ColumnArithmeticExercise}
              onDone={(correct) => commitAnswer('uppställning', correct)}
              isTeacher={isTeacher}
            />
          )}

          {/* Explanation */}
          {showExplanation && exercise.explanation && (
            <div className={`mt-4 rounded-2xl p-4 animate-fade-in ${
              state.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-bold mb-1 ${state.correct ? 'text-green-700' : 'text-red-700'}`}>
                {state.correct ? '🎉 Rätt!' : '❌ Inte riktigt...'}
              </p>
              <p className={`text-sm ${state.correct ? 'text-green-600' : 'text-red-600'}`}>
                {exercise.explanation}
              </p>
            </div>
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
                  ? states[i].correct ? 'bg-green-400 text-white' : 'bg-red-400 text-white'
                  : i === currentIdx
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                  : 'bg-gray-200 text-gray-400'
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
        let cls = 'border-2 border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-50';
        if (state.answered) {
          if (i === exercise.correctIndex) cls = 'border-2 border-green-400 bg-green-50 text-green-800';
          else if (state.userAnswer === String(i)) cls = 'border-2 border-red-400 bg-red-50 text-red-700';
          else cls = 'border-2 border-gray-200 bg-gray-50 text-gray-400 opacity-60';
        }
        return (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={state.answered}
            className={`w-full text-left px-5 py-3 rounded-2xl font-semibold text-base transition-all ${cls} ${!state.answered ? 'cursor-pointer active:scale-98' : 'cursor-default'}`}
          >
            <span className="font-bold text-gray-400 mr-2">
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
        let cls = 'border-2 border-gray-200 bg-gray-50 text-gray-700 hover:border-green-400 hover:bg-green-50';
        if (state.answered) {
          if (state.correct && state.userAnswer === String(val)) cls = 'border-2 border-green-400 bg-green-50 text-green-800';
          else if (!state.correct && state.userAnswer === String(val)) cls = 'border-2 border-red-400 bg-red-50 text-red-700';
          else if (state.correct && state.userAnswer !== String(val)) cls = 'border-2 border-gray-200 bg-gray-50 text-gray-400';
          else cls = 'border-2 border-green-400 bg-green-50 text-green-800'; // Show correct
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
        <p className="text-sm text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
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
              ? state.correct ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-600'
              : 'border-gray-200 focus:border-blue-500'
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
