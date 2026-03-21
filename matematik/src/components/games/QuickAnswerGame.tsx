import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import AppHeader from '../AppHeader';
import { getGameExercisePool, generateWrongOptions, analyzeWeakTopics, GameExercise } from '../../utils/gameExercises';
import { recordGameSession, calculateGameXP, getGameDifficulty, loadGameProgress } from '../../utils/gameStorage';

// ── Types ────────────────────────────────────────────────────────────────────

interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

type Phase = 'intro' | 'playing' | 'result';

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildOptions(ex: GameExercise): AnswerOption[] {
  let correctText = '';
  if (ex.type === 'multiple-choice') {
    correctText = ex.options[ex.correctIndex];
    const others = ex.options.filter((_, i) => i !== ex.correctIndex);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [{ text: correctText, isCorrect: true }, ...shuffled.map(t => ({ text: t, isCorrect: false }))];
    return all.sort(() => Math.random() - 0.5);
  }
  if (ex.type === 'fill-in') {
    correctText = String(ex.answer);
    const wrong = generateWrongOptions(correctText, 3);
    const all = [{ text: correctText, isCorrect: true }, ...wrong.map(t => ({ text: t, isCorrect: false }))];
    return all.sort(() => Math.random() - 0.5);
  }
  if (ex.type === 'true-false') {
    return [
      { text: 'Sant', isCorrect: ex.isTrue },
      { text: 'Falskt', isCorrect: !ex.isTrue },
    ].sort(() => Math.random() - 0.5);
  }
  return [{ text: '?', isCorrect: true }];
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function QuickAnswerGame() {
  const { currentStudent, setView } = useApp();
  const grade = currentStudent?.grade ?? '5';

  const gameProgress = currentStudent
    ? loadGameProgress(currentStudent.id).games['quick-answer']
    : null;
  const gameLevel = gameProgress?.level ?? 1;
  const { timerSeconds, exerciseCount } = getGameDifficulty(gameLevel);

  const [phase, setPhase] = useState<Phase>('intro');
  const [exercises, setExercises] = useState<GameExercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<AnswerOption[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [bestCombo, setBestCombo] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timings, setTimings] = useState<number[]>([]);
  const questionStartRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEx = exercises[currentIdx];

  // ── Start Game ───────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const pool = getGameExercisePool(grade, gameLevel, exerciseCount, ['multiple-choice', 'fill-in', 'true-false']);
    setExercises(pool);
    setCurrentIdx(0);
    setResults([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCombo(1);
    setBestCombo(1);
    setTimings([]);
    setFeedback(null);
    setSelected(null);
    setTimeLeft(timerSeconds);
    setPhase('playing');
  }, [grade, gameLevel, exerciseCount, timerSeconds]);

  // ── Load options when question changes ───────────────────────────────────

  useEffect(() => {
    if (phase === 'playing' && currentEx) {
      setOptions(buildOptions(currentEx));
      setSelected(null);
      setFeedback(null);
      setTimeLeft(timerSeconds);
      questionStartRef.current = Date.now();
    }
  }, [currentIdx, phase, currentEx, timerSeconds]);

  // ── Timer ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing' || selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, phase, selected]);

  const handleTimeOut = useCallback(() => {
    setFeedback('wrong');
    setResults(r => [...r, false]);
    setStreak(0);
    setCombo(1);
    setTimings(t => [...t, timerSeconds]);
    setTimeout(() => advanceQuestion(), 900);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, exercises.length, timerSeconds]);

  // ── Answer ───────────────────────────────────────────────────────────────

  const handleAnswer = (idx: number) => {
    if (selected !== null || feedback !== null) return;
    clearInterval(timerRef.current!);
    const timeSpent = (Date.now() - questionStartRef.current) / 1000;
    setTimings(t => [...t, timeSpent]);
    setSelected(idx);

    const isCorrect = options[idx].isCorrect;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setResults(r => [...r, isCorrect]);

    if (isCorrect) {
      const newStreak = streak + 1;
      const newCombo = Math.min(4, 1 + Math.floor(newStreak / 3));
      const pts = Math.round(currentEx.points * newCombo * (timeLeft / timerSeconds + 0.5));
      setScore(s => s + pts);
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setCombo(newCombo);
      setBestCombo(b => Math.max(b, newCombo));
    } else {
      setStreak(0);
      setCombo(1);
    }

    setTimeout(() => advanceQuestion(), 900);
  };

  const advanceQuestion = () => {
    setCurrentIdx(i => {
      const next = i + 1;
      if (next >= exercises.length) {
        setPhase('result');
        return i;
      }
      return next;
    });
  };

  // ── Save result ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'result' && exercises.length > 0 && currentStudent) {
      const correct = results.filter(Boolean).length;
      const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : timerSeconds;
      const xp = calculateGameXP(correct, exercises.length, bestStreak, bestCombo, correct === exercises.length, avgTime);
      recordGameSession(currentStudent.id, {
        gameId: 'quick-answer',
        score,
        correct,
        total: exercises.length,
        streak: bestStreak,
        combo: bestCombo,
        timeSpent: timings.reduce((a, b) => a + b, 0),
        xpEarned: xp,
        newLevel: false,
        weakTopics: analyzeWeakTopics(exercises, results),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Render: Intro ─────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-sm"
          >
            <div className="text-7xl mb-4">🎯</div>
            <h1 className="text-3xl font-black text-white mb-2">Rätt svar snabbt!</h1>
            <p className="text-indigo-300 mb-6 text-sm leading-relaxed">
              Välj rätt svar bland 4 alternativ innan tiden tar slut.
              Bygg streak för att öka din kombo-multiplikator!
            </p>
            <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm text-left space-y-2">
              <div className="flex justify-between text-white/80">
                <span>Frågor</span><span className="font-bold text-white">{exerciseCount} st</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Tid per fråga</span><span className="font-bold text-white">{timerSeconds}s</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Din nivå</span><span className="font-bold text-amber-400">Level {gameLevel}</span>
              </div>
            </div>
            <div className="text-xs text-white/50 mb-6">
              💡 Combo: 3 rätt i rad = 2×, 6 = 3×, 9 = 4×
            </div>
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-lg rounded-2xl hover:opacity-90 transition active:scale-95"
            >
              Starta spelet!
            </button>
            <button onClick={() => setView('games')} className="mt-4 text-indigo-300 text-sm hover:text-white transition">
              ← Tillbaka
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Render: Result ────────────────────────────────────────────────────────

  if (phase === 'result') {
    const correct = results.filter(Boolean).length;
    const pct = Math.round((correct / exercises.length) * 100);
    const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : timerSeconds;
    const xp = calculateGameXP(correct, exercises.length, bestStreak, bestCombo, correct === exercises.length, avgTime);
    const weakTopics = analyzeWeakTopics(exercises, results);

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-sm w-full"
          >
            <div className="text-6xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
            <h2 className="text-2xl font-black text-white mb-1">
              {pct >= 80 ? 'Fantastiskt!' : pct >= 50 ? 'Bra jobbat!' : 'Fortsätt träna!'}
            </h2>
            <p className="text-indigo-300 text-sm mb-5">{correct} av {exercises.length} rätt</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Poäng', value: score, emoji: '🎯' },
                { label: 'Streak', value: bestStreak, emoji: '🔥' },
                { label: 'Kombo', value: `${bestCombo}×`, emoji: '⚡' },
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
                {weakTopics.map(t => (
                  <p key={t} className="text-rose-200/80 text-xs">• {t}</p>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-xl hover:opacity-90 transition active:scale-95"
              >
                Spela igen
              </button>
              <button
                onClick={() => setView('games')}
                className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition active:scale-95"
              >
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
  const timerPct = (timeLeft / timerSeconds) * 100;
  const timerColor = timeLeft <= 3 ? 'bg-rose-500' : timeLeft <= 6 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* HUD */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">🎯 {score}</span>
            {streak >= 3 && (
              <motion.span
                key={streak}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-orange-400 font-black text-sm"
              >
                🔥 {streak}
              </motion.span>
            )}
          </div>
          <span className="text-white/50 text-sm">{currentIdx + 1}/{exercises.length}</span>
          {combo > 1 && (
            <motion.div
              key={combo}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="text-yellow-300 font-black text-sm"
            >
              ⚡ {combo}× Kombo!
            </motion.div>
          )}
        </div>

        {/* Timer bar */}
        <div className="h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
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
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5 text-center"
          >
            <p className="text-white text-xl font-bold leading-snug">{currentEx.question}</p>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            let btnClass = 'bg-white/10 border-white/20 text-white hover:bg-white/20';
            if (selected !== null) {
              if (opt.isCorrect) btnClass = 'bg-emerald-600/80 border-emerald-400 text-white';
              else if (i === selected && !opt.isCorrect) btnClass = 'bg-rose-600/80 border-rose-400 text-white';
              else btnClass = 'bg-white/5 border-white/10 text-white/40';
            }
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`border rounded-xl p-4 font-bold text-base transition-all ${btnClass}`}
              >
                {opt.text}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback flash */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center mt-4 text-lg font-black ${feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {feedback === 'correct' ? `+${Math.round(currentEx.points * combo)} ✓` : '✗ Fel!'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
