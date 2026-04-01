import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import AppHeader from '../AppHeader';
import { getGameExercisePool, analyzeWeakTopics, GameExercise } from '../../utils/gameExercises';
import { recordGameSession, calculateGameXP, loadGameProgress } from '../../utils/gameStorage';
import { WORLDS } from '../../data/worlds';

const GAME_DURATION = 60; // seconds

type Phase = 'intro' | 'playing' | 'result';

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimeAttackGame() {
  const { currentStudent, setView, gameWorldId } = useApp();
  const grade = currentStudent?.grade ?? '5';
  const worldData = gameWorldId ? WORLDS.find(w => w.id === gameWorldId) : null;
  const worldGradeRange = worldData ? { minGrade: worldData.minGrade, maxGrade: worldData.maxGrade } : undefined;

  const gameProgress = currentStudent
    ? loadGameProgress(currentStudent.id).games['time-attack']
    : null;
  const gameLevel = gameProgress?.level ?? 1;

  const [phase, setPhase] = useState<Phase>('intro');
  const [exercises, setExercises] = useState<GameExercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEx = exercises[currentIdx];

  // ── Start ────────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    // Load a large pool, we'll cycle through as many as time allows
    const pool = getGameExercisePool(grade, gameLevel, 100, ['multiple-choice', 'fill-in', 'true-false'], worldGradeRange);
    setExercises(pool);
    setCurrentIdx(0);
    setResults([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setInput('');
    setFeedback(null);
    setTimeLeft(GAME_DURATION);
    setPhase('playing');
  }, [grade, gameLevel]);

  // ── Timer ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  // ── Focus input ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'playing') {
      setInput('');
      setFeedback(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentIdx, phase]);

  // ── Save result ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'result' && exercises.length > 0 && results.length > 0 && currentStudent) {
      const correct = results.filter(Boolean).length;
      const total = results.length;
      const xp = calculateGameXP(correct, total, bestStreak, 1, correct === total && total > 0, total > 0 ? GAME_DURATION / total : 10);
      recordGameSession(currentStudent.id, {
        gameId: 'time-attack',
        score,
        correct,
        total,
        streak: bestStreak,
        combo: 1,
        timeSpent: GAME_DURATION,
        xpEarned: xp,
        newLevel: false,
        weakTopics: analyzeWeakTopics(exercises.slice(0, results.length), results),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Check answer ──────────────────────────────────────────────────────────

  const checkAnswer = useCallback(() => {
    if (!currentEx || feedback) return;

    let isCorrect = false;
    const trimmed = input.trim().toLowerCase().replace(',', '.');

    if (currentEx.type === 'multiple-choice') {
      const correct = currentEx.options[currentEx.correctIndex].toLowerCase();
      isCorrect = trimmed === correct;
    } else if (currentEx.type === 'fill-in') {
      const correct = String(currentEx.answer).replace(',', '.').toLowerCase();
      isCorrect = trimmed === correct;
      if (!isCorrect && currentEx.acceptableAnswers) {
        isCorrect = currentEx.acceptableAnswers.some(a => String(a).replace(',', '.').toLowerCase() === trimmed);
      }
    } else if (currentEx.type === 'true-false') {
      const userTrue = trimmed === 'sant' || trimmed === 's' || trimmed === 'true' || trimmed === '1';
      const userFalse = trimmed === 'falskt' || trimmed === 'f' || trimmed === 'false' || trimmed === '0';
      if (userTrue) isCorrect = currentEx.isTrue;
      else if (userFalse) isCorrect = !currentEx.isTrue;
    }

    setResults(r => [...r, isCorrect]);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setScore(s => s + currentEx.points + Math.floor(newStreak / 3) * 5);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIdx + 1 < exercises.length) {
        setCurrentIdx(i => i + 1);
      } else {
        setPhase('result');
      }
    }, 400);
  }, [currentEx, input, feedback, streak, currentIdx, exercises.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') checkAnswer();
  };

  // ── Multiple-choice quick buttons ─────────────────────────────────────────

  const handleMCAnswer = (text: string, isCorrect: boolean) => {
    if (feedback) return;
    setResults(r => [...r, isCorrect]);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setScore(s => s + (currentEx?.points ?? 10) + Math.floor(newStreak / 3) * 5);
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (currentIdx + 1 < exercises.length) {
        setCurrentIdx(i => i + 1);
      } else {
        setPhase('result');
      }
    }, 400);
  };

  // ── Render: Intro ─────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
            <div className="text-7xl mb-4">⏱️</div>
            <h1 className="text-3xl font-black text-white mb-2">Tidsattack!</h1>
            <p className="text-cyan-300 text-sm mb-6 leading-relaxed">
              Svara på så många frågor du kan på {GAME_DURATION} sekunder.
              Skriv svaret och tryck Enter, eller klicka på svaret.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm space-y-2">
              <div className="flex justify-between text-white/80">
                <span>Tid</span><span className="font-bold text-cyan-400">{GAME_DURATION}s</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Din nivå</span><span className="font-bold text-amber-400">Level {gameLevel}</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black text-lg rounded-2xl hover:opacity-90 transition active:scale-95"
            >
              Starta!
            </button>
            <button onClick={() => setView('games' as any)} className="mt-4 text-indigo-300 text-sm hover:text-white transition">← Tillbaka</button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Render: Result ────────────────────────────────────────────────────────

  if (phase === 'result') {
    const answered = results.length;
    const correct = results.filter(Boolean).length;
    const xp = calculateGameXP(correct, answered || 1, bestStreak, 1, correct === answered && answered > 0, answered > 0 ? GAME_DURATION / answered : 10);
    const weakTopics = analyzeWeakTopics(exercises.slice(0, answered), results);

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm w-full">
            <div className="text-6xl mb-3">⏱️</div>
            <h2 className="text-2xl font-black text-white mb-1">Tiden är ute!</h2>
            <p className="text-cyan-300 text-sm mb-5">{answered} frågor besvarade</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Rätt', value: correct, emoji: '✅' },
                { label: 'Poäng', value: score, emoji: '🎯' },
                { label: 'Streak', value: bestStreak, emoji: '🔥' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-xl">{s.emoji}</div>
                  <div className="text-white font-black text-lg">{s.value}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-4 mb-5">
              <div className="text-amber-300 font-black text-2xl">+{xp} XP</div>
              <div className="text-amber-200/70 text-xs">intjänat denna omgång</div>
            </div>

            {weakTopics.length > 0 && (
              <div className="bg-rose-900/30 border border-rose-400/30 rounded-xl p-4 mb-5 text-left">
                <p className="text-rose-300 font-bold text-sm mb-1">📚 Träna mer på:</p>
                {weakTopics.map(t => (<p key={t} className="text-rose-200/80 text-xs">• {t}</p>))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={startGame} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold rounded-xl hover:opacity-90 transition active:scale-95">
                Spela igen
              </button>
              <button onClick={() => setView('games' as any)} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition active:scale-95">
                Tillbaka
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Render: Playing ───────────────────────────────────────────────────────

  if (!currentEx) return null;
  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-cyan-500';
  const isMC = currentEx.type === 'multiple-choice';
  const isTF = currentEx.type === 'true-false';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* HUD */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold text-sm">📝 {results.length}</span>
            <span className="text-amber-400 font-bold text-sm">🎯 {score}</span>
            {streak >= 3 && (
              <motion.span key={streak} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="text-orange-400 font-black text-sm">
                🔥 {streak}
              </motion.span>
            )}
          </div>
          <motion.span
            className={`text-2xl font-black ${timeLeft <= 10 ? 'text-rose-400' : 'text-white'}`}
            animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {timeLeft}s
          </motion.span>
        </div>

        {/* Timer bar */}
        <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${timerColor} transition-colors`}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-white/5 border rounded-2xl p-5 mb-4 text-center transition-colors ${
              feedback === 'correct' ? 'border-emerald-400/60 bg-emerald-900/20' :
              feedback === 'wrong' ? 'border-rose-400/60 bg-rose-900/20' :
              'border-white/10'
            }`}
          >
            <p className="text-white text-xl font-bold leading-snug">{currentEx.question}</p>
          </motion.div>
        </AnimatePresence>

        {/* Input or buttons */}
        {isMC ? (
          <div className="grid grid-cols-2 gap-2">
            {currentEx.options.slice(0, 4).map((opt, i) => {
              const isCorrect = i === currentEx.correctIndex;
              let btnClass = 'bg-white/10 border-white/20 text-white';
              if (feedback) {
                if (isCorrect) btnClass = 'bg-emerald-600/80 border-emerald-400 text-white';
                else btnClass = 'bg-white/5 border-white/10 text-white/40';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleMCAnswer(opt, isCorrect)}
                  disabled={!!feedback}
                  className={`border rounded-xl px-3 py-3 font-bold text-sm transition ${btnClass} hover:bg-white/20`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : isTF ? (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Sant', isCorrect: currentEx.isTrue },
              { label: 'Falskt', isCorrect: !currentEx.isTrue },
            ].map((opt) => {
              let btnClass = 'bg-white/10 border-white/20 text-white';
              if (feedback) {
                if (opt.isCorrect) btnClass = 'bg-emerald-600/80 border-emerald-400 text-white';
                else btnClass = 'bg-white/5 border-white/10 text-white/40';
              }
              return (
                <button
                  key={opt.label}
                  onClick={() => handleMCAnswer(opt.label, opt.isCorrect)}
                  disabled={!!feedback}
                  className={`border rounded-xl py-4 font-bold text-base transition ${btnClass} hover:bg-white/20`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!!feedback}
              placeholder="Skriv svaret..."
              className={`flex-1 bg-white/10 border rounded-xl px-4 py-3 text-white text-lg font-bold placeholder-white/30 outline-none transition-colors ${
                feedback === 'correct' ? 'border-emerald-400' :
                feedback === 'wrong' ? 'border-rose-400' :
                'border-white/20 focus:border-cyan-400'
              }`}
            />
            <button
              onClick={checkAnswer}
              disabled={!!feedback || !input.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-black px-5 rounded-xl transition active:scale-95"
            >
              OK
            </button>
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center mt-3 text-lg font-black ${feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {feedback === 'correct' ? '✓ Rätt!' : 'Tyvärr, försök igen'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
