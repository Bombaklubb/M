import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Exercise, MultipleChoiceExercise, FillInExercise,
  TrueFalseExercise, ClockSetExercise, Topic,
} from '../types';
import { useApp } from '../contexts/AppContext';
import { WORLDS, World } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { recordError } from '../utils/errorBank';
import { updateAdaptive } from '../utils/adaptive';
import AppHeader from './AppHeader';
import InteractiveClock from './InteractiveClock';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SluttestQuestion {
  exercise: Exercise;
  topic: Topic;
}

interface QuestionState {
  answered: boolean;
  correct: boolean;
  userAnswer: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(topicIds: string[], easierPool = false): SluttestQuestion[] {
  const topics = topicIds
    .map(id => TOPICS.find(t => t.id === id))
    .filter(Boolean) as Topic[];
  if (topics.length === 0) return [];

  // Scale questions per topic so total is at least 25
  const qPerTopic = topics.length <= 6 ? 4 : topics.length <= 12 ? 3 : topics.length <= 20 ? 2 : 1;

  const all: SluttestQuestion[] = [];
  for (const topic of topics) {
    // For lågstadiet: only pick from the easier first 60% of each topic's exercises
    const pool = easierPool
      ? topic.exercises.slice(0, Math.max(3, Math.ceil(topic.exercises.length * 0.6)))
      : topic.exercises;
    for (const ex of shuffle(pool).slice(0, qPerTopic)) {
      all.push({ exercise: ex, topic });
    }
  }

  // Target 25–30 questions
  const target = Math.min(Math.max(25, all.length), 30);
  return shuffle(all).slice(0, target);
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function SluttestView() {
  const { currentStudent, sluttestWorldId, setView } = useApp();
  const [phase, setPhase] = useState<'intro' | 'test' | 'result'>('intro');
  const [finalStates, setFinalStates] = useState<QuestionState[]>([]);

  const world = WORLDS.find(w => w.id === sluttestWorldId);
  const questions = useMemo(
    () => (world ? buildQuestions(world.topicIds, world.maxGrade <= 3) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sluttestWorldId]
  );

  if (!currentStudent || !world) return null;

  if (phase === 'intro') {
    return (
      <Intro
        world={world}
        questionCount={questions.length}
        onStart={() => setPhase('test')}
        onBack={() => setView(`world-${world.id}` as any)}
      />
    );
  }

  if (phase === 'test') {
    return (
      <Test
        questions={questions}
        world={world}
        studentId={currentStudent.id}
        onDone={states => { setFinalStates(states); setPhase('result'); }}
        onBack={() => setPhase('intro')}
      />
    );
  }

  return (
    <Result
      questions={questions}
      states={finalStates}
      world={world}
      onRetry={() => { setPhase('intro'); }}
      onHome={() => setView(`world-${world.id}` as any)}
    />
  );
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function Intro({
  world, questionCount, onStart, onBack,
}: {
  world: World;
  questionCount: number;
  onStart: () => void;
  onBack: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)' }}
    >
      <AppHeader />
      <div
        className={`flex-1 flex flex-col items-center justify-center px-4 py-8 transition-all duration-500 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="w-full max-w-md">
          {/* Hero */}
          <div className={`bg-gradient-to-br ${world.bg} rounded-3xl p-8 text-center mb-5 shadow-2xl relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20 rounded-3xl" />
            <div className="relative z-10">
              <div className="text-7xl mb-4 animate-bounce-in">{world.emoji}</div>
              <div className="inline-block bg-white/20 border border-white/30 rounded-full px-4 py-1 text-white font-black text-sm mb-3 uppercase tracking-wider">
                🏆 Sluttest
              </div>
              <h1 className="text-3xl font-black text-white mb-1">{world.name}</h1>
              <p className="text-white/60 text-sm italic mt-1">Testa alla dina kunskaper!</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <p className="text-4xl font-black text-white mb-0.5">{questionCount}</p>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wide">Frågor</p>
            </div>
            <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <p className="text-4xl font-black text-white mb-0.5">{world.topicIds.length}</p>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wide">Kapitel</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 mb-5 flex gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">🧠</span>
            <p className="text-white/65 text-sm leading-relaxed">
              Sluttestet blandar frågor från <strong className="text-white">alla kapitel</strong>.
              Efteråt ser du vilka områden du bör träna mer på!
            </p>
          </div>

          <button
            onClick={onStart}
            className={`w-full bg-gradient-to-r ${world.bg} text-white font-black text-xl py-5 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transition-all mb-3`}
          >
            🚀 Starta Sluttestet!
          </button>
          <button
            onClick={onBack}
            className="w-full bg-white/8 border border-white/15 text-white/50 font-bold py-3 rounded-2xl hover:bg-white/15 transition-colors text-sm"
          >
            ← Tillbaka till världen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Test ─────────────────────────────────────────────────────────────────────

function Test({
  questions, world, studentId, onDone, onBack,
}: {
  questions: SluttestQuestion[];
  world: World;
  studentId: string;
  onDone: (states: QuestionState[]) => void;
  onBack: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [states, setStates] = useState<QuestionState[]>(
    questions.map(() => ({ answered: false, correct: false, userAnswer: '' }))
  );
  const [input, setInput] = useState('');
  const [showExpl, setShowExpl] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const startRef = useRef(Date.now());

  const { exercise, topic } = questions[idx];
  const state = states[idx];
  const correctSoFar = states.filter(s => s.correct).length;
  const progress = (idx / questions.length) * 100;

  useEffect(() => {
    if (!state.answered && exercise.type === 'fill-in') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    setInput('');
    setShowExpl(false);
    startRef.current = Date.now();
  }, [idx]);

  function commit(userAnswer: string, correct: boolean) {
    const elapsed = Date.now() - startRef.current;
    updateAdaptive(studentId, topic.id, correct, elapsed);
    if (!correct) {
      const ex = exercise;
      const ca =
        ex.type === 'multiple-choice' ? (ex as MultipleChoiceExercise).options[(ex as MultipleChoiceExercise).correctIndex]
        : ex.type === 'true-false'    ? String((ex as TrueFalseExercise).isTrue)
        : ex.type === 'clock-set'
          ? `${String((ex as ClockSetExercise).targetHour).padStart(2,'0')}:${String((ex as ClockSetExercise).targetMinute).padStart(2,'0')}`
        : String((ex as FillInExercise).answer);
      recordError(studentId, topic.id, topic.title, ex.id, ex.question, ca, userAnswer);
    }
    const next = [...states];
    next[idx] = { answered: true, correct, userAnswer };
    setStates(next);
    setShowExpl(true);
    if (correct) { setCelebration(true); setTimeout(() => setCelebration(false), 700); }
  }

  function handleNext() {
    if (idx < questions.length - 1) {
      setIdx(i => i + 1);
    } else {
      // compute final states (current idx is not yet in `states` array if we just committed)
      onDone(states);
    }
  }

  const isLast = idx === questions.length - 1;
  const isRimlighet = topic.tags?.includes('rimlighet') ?? false;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)' }}
    >
      <AppHeader />

      {/* Header bar */}
      <div className={`bg-gradient-to-r ${world.bg} text-white px-4 pt-16 pb-3`}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="text-white/70 hover:text-white text-sm font-semibold">
              ✕ Avbryt
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black">{world.emoji} Sluttest</span>
            </div>
            <span className="text-sm font-bold">
              {idx + 1}/{questions.length}
            </span>
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-white/60">
            <span>{correctSoFar} rätt hittills</span>
            <span>{questions.length - idx - 1} kvar</span>
          </div>
        </div>
      </div>

      {/* Celebration */}
      {celebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-9xl animate-bounce-in">⭐</div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {/* Topic pill */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r ${topic.color} shadow-md`}>
            <span className="text-sm">{topic.icon}</span>
            <span className="text-white text-xs font-black">{topic.title}</span>
          </div>
          <span className="text-white/25 text-xs">från {world.name}</span>
        </div>

        {/* Card */}
        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              exercise.type === 'multiple-choice' ? 'bg-blue-500/30 text-blue-300' :
              exercise.type === 'fill-in'         ? 'bg-purple-500/30 text-purple-300' :
              isRimlighet                         ? 'bg-amber-500/30 text-amber-300' :
                                                    'bg-emerald-500/30 text-emerald-300'
            }`}>
              {exercise.type === 'multiple-choice' ? '🔘 Flerval' :
               exercise.type === 'fill-in'         ? '✏️ Fritext' :
               isRimlighet                         ? '⚖️ Rimlighet' : '✅ Sant/Falskt'}
            </span>
            <span className="text-sm font-bold text-amber-400">+{exercise.points}p</span>
          </div>

          {exercise.clockDisplay && (
            <div className="flex flex-col items-center mb-5">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wide mb-2">🕐 Se klockan</p>
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

          <h2 className="text-xl font-bold text-white mb-5 leading-snug">{exercise.question}</h2>

          {exercise.type === 'multiple-choice' && (
            <MultipleChoiceAnswers
              exercise={exercise as MultipleChoiceExercise}
              state={state}
              onAnswer={i => commit(String(i), i === (exercise as MultipleChoiceExercise).correctIndex)}
            />
          )}
          {exercise.type === 'true-false' && (
            <TrueFalseAnswers
              state={state}
              isRimlighet={isRimlighet}
              onAnswer={v => commit(String(v), v === (exercise as TrueFalseExercise).isTrue)}
            />
          )}
          {exercise.type === 'fill-in' && (
            <FillInAnswer
              exercise={exercise as FillInExercise}
              state={state}
              input={input}
              inputRef={inputRef}
              onChange={setInput}
              onSubmit={() => {
                const ex = exercise as FillInExercise;
                const t = input.trim().replace(',', '.');
                const ca = String(ex.answer).replace(',', '.');
                const acc = (ex.acceptableAnswers ?? []).map(a => String(a).replace(',', '.').toLowerCase());
                commit(input, t.toLowerCase() === ca.toLowerCase() || acc.includes(t.toLowerCase()));
              }}
            />
          )}
          {exercise.type === 'clock-set' && (
            <ClockSetAnswers
              exercise={exercise as ClockSetExercise}
              state={state}
              onAnswer={c => commit(c ? 'korrekt' : 'fel', c)}
            />
          )}

          {showExpl && state.correct && (
            <div className="mt-4 rounded-2xl px-4 py-3 bg-emerald-500/20 border border-emerald-400/40 animate-fade-in">
              <p className="text-emerald-300 font-black">🎉 Rätt! Bra jobbat!</p>
            </div>
          )}
          {showExpl && !state.correct && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-rose-400/40 animate-fade-in">
              <div className="bg-rose-500/30 px-4 py-2.5">
                <p className="text-rose-200 font-black">❌ Inte riktigt!</p>
              </div>
              {exercise.explanation && (
                <div className="bg-rose-500/10 px-4 py-3">
                  <p className="text-sm text-rose-300 leading-relaxed">{exercise.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {state.answered && (
          <button
            onClick={handleNext}
            className={`w-full font-black text-xl py-4 rounded-2xl shadow-lg hover:scale-105 transition-all animate-slide-up ${
              isLast
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            }`}
          >
            {isLast ? '🏁 Se ditt resultat!' : 'Nästa →'}
          </button>
        )}

        {/* Dot progress */}
        <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                i < idx
                  ? states[i].correct ? 'bg-emerald-500' : 'bg-rose-500'
                  : i === idx
                  ? 'bg-blue-400 ring-2 ring-blue-300/50 scale-110'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Result ───────────────────────────────────────────────────────────────────

function Result({
  questions, states, world, onRetry, onHome,
}: {
  questions: SluttestQuestion[];
  states: QuestionState[];
  world: World;
  onRetry: () => void;
  onHome: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const totalCorrect = states.filter(s => s.correct).length;
  const totalQ = questions.length;
  const score = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;

  // Per-topic breakdown
  const topicMap = new Map<string, { title: string; icon: string; color: string; correct: number; total: number }>();
  questions.forEach((q, i) => {
    const tid = q.topic.id;
    if (!topicMap.has(tid)) {
      topicMap.set(tid, { title: q.topic.title, icon: q.topic.icon, color: q.topic.color, correct: 0, total: 0 });
    }
    const entry = topicMap.get(tid)!;
    entry.total++;
    if (states[i]?.correct) entry.correct++;
  });
  const topicResults = Array.from(topicMap.entries()).map(([id, v]) => ({ id, ...v }));
  const weakTopics = topicResults.filter(t => t.total > 0 && (t.correct / t.total) < 0.7);
  const strongTopics = topicResults.filter(t => t.total > 0 && (t.correct / t.total) >= 0.7);

  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  const grade =
    score >= 90 ? 'Fantastiskt! 🌟' :
    score >= 70 ? 'Bra jobbat! 👍' :
    score >= 50 ? 'Godkänt! ✅' :
    'Fortsätt träna! 💪';

  return (
    <div
      className="min-h-screen pb-10"
      style={{ background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)' }}
    >
      <AppHeader />
      <div className={`max-w-md mx-auto px-4 pt-20 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Trophy banner */}
        <div className={`bg-gradient-to-br ${world.bg} rounded-3xl p-6 text-center mb-5 shadow-2xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/15 rounded-3xl" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-2">Sluttest klart!</p>
            <div className={`text-7xl font-black ${scoreColor} mb-1 drop-shadow-lg`}>{score}%</div>
            <p className="text-xl font-bold text-white/90 mb-1">{grade}</p>
            <p className="text-white/60 text-sm">{totalCorrect} av {totalQ} rätt</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-4 mb-5">
          {[0,1,2].map(i => (
            <span
              key={i}
              className={`text-5xl transition-all duration-300 ${i < stars ? 'animate-star-pop' : 'opacity-15'}`}
              style={{ animationDelay: `${i * 200}ms` }}
            >⭐</span>
          ))}
        </div>

        {/* ── Träna mer på ── */}
        {weakTopics.length > 0 && (
          <div className="bg-rose-500/15 border border-rose-400/30 rounded-3xl p-5 mb-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎯</span>
              <h2 className="font-black text-rose-300 text-base">Träna mer på dessa områden</h2>
            </div>
            <div className="space-y-2.5">
              {weakTopics.map(t => {
                const pct = Math.round((t.correct / t.total) * 100);
                return (
                  <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{t.icon}</span>
                        <span className="text-white/80 text-sm font-bold">{t.title}</span>
                      </div>
                      <span className="text-rose-300 font-black text-sm">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-white/35 text-xs mt-1.5">{t.correct} av {t.total} rätt · Öva på detta kapitel igen!</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Bra på ── */}
        {strongTopics.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-3xl p-5 mb-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✅</span>
              <h2 className="font-black text-emerald-300 text-base">Du är bra på dessa!</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {strongTopics.map(t => {
                const pct = Math.round((t.correct / t.total) * 100);
                return (
                  <div key={t.id} className="bg-white/5 border border-emerald-400/15 rounded-xl p-2.5 flex items-center gap-2">
                    <span className="text-lg flex-shrink-0">{t.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white/70 text-xs font-bold truncate">{t.title}</p>
                      <p className="text-emerald-400 text-xs font-black">{pct}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── All topics summary ── */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-5">
          <h2 className="font-black text-white/60 text-sm uppercase tracking-wider mb-3">Alla kapitel</h2>
          <div className="space-y-2">
            {topicResults.map(t => {
              const pct = Math.round((t.correct / t.total) * 100);
              const isWeak = pct < 70;
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center flex-shrink-0">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-white/60 text-xs font-semibold truncate">{t.title}</span>
                      <span className={`text-xs font-black ml-2 flex-shrink-0 ${isWeak ? 'text-rose-300' : 'text-emerald-300'}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isWeak ? 'bg-rose-400' : 'bg-emerald-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={onRetry}
            className="bg-white/8 border border-white/15 text-white font-bold py-4 rounded-2xl hover:bg-white/15 transition-colors"
          >
            🔄 Gör om testet
          </button>
          <button
            onClick={onHome}
            className={`bg-gradient-to-r ${world.bg} text-white font-bold py-4 rounded-2xl hover:scale-105 hover:shadow-lg transition-all`}
          >
            {world.emoji} Tillbaka
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function MultipleChoiceAnswers({
  exercise, state, onAnswer,
}: {
  exercise: MultipleChoiceExercise;
  state: QuestionState;
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
            className={`w-full text-left px-5 py-3 rounded-2xl font-semibold text-base transition-all ${cls} ${!state.answered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
          >
            <span className="font-bold text-white/40 mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
            {state.answered && i === exercise.correctIndex && <span className="float-right">✓</span>}
            {state.answered && state.userAnswer === String(i) && i !== exercise.correctIndex && <span className="float-right">✗</span>}
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseAnswers({
  state, onAnswer, isRimlighet,
}: {
  state: QuestionState;
  onAnswer: (v: boolean) => void;
  isRimlighet: boolean;
}) {
  const buttons = isRimlighet
    ? [
        { val: true,  label: 'Rimligt',  icon: '✅', hover: 'hover:border-emerald-400 hover:bg-emerald-500/20' },
        { val: false, label: 'Orimligt', icon: '❌', hover: 'hover:border-rose-400 hover:bg-rose-500/20' },
      ]
    : [
        { val: true,  label: 'Sant',   icon: '👍', hover: 'hover:border-emerald-400 hover:bg-emerald-500/20' },
        { val: false, label: 'Falskt', icon: '👎', hover: 'hover:border-rose-400 hover:bg-rose-500/20' },
      ];

  return (
    <>
      {isRimlighet && !state.answered && (
        <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30">
          <span className="text-xl">⚖️</span>
          <p className="text-sm font-bold text-amber-300">Är påståendet rimligt eller orimligt?</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {buttons.map(({ val, label, icon, hover }) => {
          let cls = `border-2 border-white/15 bg-white/5 text-white ${hover} hover:shadow-lg`;
          if (state.answered) {
            const chosen = state.userAnswer === String(val);
            if (chosen && state.correct)  cls = 'border-2 border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-lg shadow-emerald-500/20';
            else if (chosen && !state.correct) cls = 'border-2 border-rose-400 bg-rose-500/20 text-rose-200 shadow-lg shadow-rose-500/20';
            else if (!chosen && !state.correct) cls = 'border-2 border-emerald-400/60 bg-emerald-500/10 text-emerald-300/70';
            else cls = 'border-2 border-white/10 bg-white/5 text-white/30';
          }
          return (
            <button
              key={String(val)}
              onClick={() => onAnswer(val)}
              disabled={state.answered}
              className={`py-5 rounded-2xl font-black text-xl transition-all duration-200 flex flex-col items-center gap-1 ${cls} ${!state.answered ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
            >
              <span className="text-3xl">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function FillInAnswer({
  exercise, state, input, inputRef, onChange, onSubmit,
}: {
  exercise: FillInExercise;
  state: QuestionState;
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

function ClockSetAnswers({
  exercise, state, onAnswer,
}: {
  exercise: ClockSetExercise;
  state: QuestionState;
  onAnswer: (correct: boolean) => void;
}) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  function handleSubmit() {
    if (state.answered) return;
    onAnswer(hour === exercise.targetHour && minute === exercise.targetMinute);
  }

  const fmt = (h: number, m: number) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <InteractiveClock
          hour={hour}
          minute={minute}
          onChange={(h, m) => { setHour(h); setMinute(m); }}
          readOnly={state.answered}
          size={210}
        />
      </div>
      <p className="text-center text-3xl font-black text-white tabular-nums">{fmt(hour, minute)}</p>
      {!state.answered && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/8 border border-white/15 rounded-2xl p-2 text-center">
              <p className="text-xs font-bold text-white/50 mb-1">⏱ Timme</p>
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setHour(h => h === 1 ? 12 : h - 1)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20">‹</button>
                <span className="w-6 text-center font-black text-xl text-white">{hour}</span>
                <button onClick={() => setHour(h => h === 12 ? 1 : h + 1)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20">›</button>
              </div>
            </div>
            <div className="bg-white/8 border border-white/15 rounded-2xl p-2 text-center">
              <p className="text-xs font-bold text-white/50 mb-1">⏰ Minut</p>
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setMinute(m => m === 0 ? 55 : m - 5)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20">‹</button>
                <span className="w-8 text-center font-black text-xl text-white">{String(minute).padStart(2,'0')}</span>
                <button onClick={() => setMinute(m => m === 55 ? 0 : m + 5)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20">›</button>
              </div>
            </div>
          </div>
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
