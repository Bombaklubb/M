import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useAnimate, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import AppHeader from '../AppHeader';
import { getGameExercisePool, generateWrongOptions, analyzeWeakTopics, GameExercise } from '../../utils/gameExercises';
import { recordGameSession, calculateGameXP, getGameDifficulty, loadGameProgress } from '../../utils/gameStorage';
import { WORLDS } from '../../data/worlds';

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'playing' | 'result';

interface Option {
  text: string;
  isCorrect: boolean;
}

const LABELS = ['A', 'B', 'C', 'D'];
const MAX_LIVES = 3;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildOptions(ex: GameExercise): Option[] {
  if (ex.type === 'multiple-choice') {
    return ex.options.map((o, i) => ({ text: o, isCorrect: i === ex.correctIndex }));
  } else if (ex.type === 'fill-in') {
    const correct = String(ex.answer);
    const wrongs = generateWrongOptions(correct, 3);
    const opts: Option[] = [
      { text: correct, isCorrect: true },
      ...wrongs.map(w => ({ text: w, isCorrect: false })),
    ];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  } else {
    // true-false
    const isSant = (ex as any).isTrue;
    return [
      { text: 'Sant', isCorrect: isSant },
      { text: 'Falskt', isCorrect: !isSant },
    ];
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CollectCoinsGame() {
  const { currentStudent, setView, gameWorldId } = useApp();
  const grade = currentStudent?.grade ?? '5';
  const worldData = gameWorldId ? WORLDS.find(w => w.id === gameWorldId) : null;
  const worldGradeRange = worldData ? { minGrade: worldData.minGrade, maxGrade: worldData.maxGrade } : undefined;

  const gameProgress = currentStudent
    ? loadGameProgress(currentStudent.id).games['collect-coins']
    : null;
  const gameLevel = gameProgress?.level ?? 1;
  const { exerciseCount } = getGameDifficulty(gameLevel);

  const [phase, setPhase] = useState<Phase>('intro');
  const [exercises, setExercises] = useState<GameExercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [runnerX, setRunnerX] = useState(0);
  const [timings, setTimings] = useState<number[]>([]);
  const questionStartRef = useRef(Date.now());
  const [runnerScope, runnerAnimate] = useAnimate();

  const currentEx = exercises[currentIdx];

  // ── Start ─────────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const pool = getGameExercisePool(grade, gameLevel, exerciseCount, ['multiple-choice', 'fill-in', 'true-false'], worldGradeRange);
    setExercises(pool);
    setCurrentIdx(0);
    setResults([]);
    setScore(0);
    setCoins(0);
    setLives(MAX_LIVES);
    setSelected(null);
    setRevealed(false);
    setRunnerX(0);
    setTimings([]);
    questionStartRef.current = Date.now();
    setPhase('playing');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, gameLevel, exerciseCount, worldGradeRange]);

  // ── Build options when question changes ────────────────────────────────────

  useEffect(() => {
    if (phase === 'playing' && currentEx) {
      setOptions(buildOptions(currentEx));
      setSelected(null);
      setRevealed(false);
      questionStartRef.current = Date.now();
    }
  }, [currentIdx, phase, currentEx]);

  // ── Answer handling ───────────────────────────────────────────────────────

  const handleSelect = (idx: number) => {
    if (revealed) return;
    const correct = options[idx].isCorrect;
    setSelected(idx);
    setRevealed(true);
    const timeSpent = (Date.now() - questionStartRef.current) / 1000;
    setTimings(t => [...t, timeSpent]);
    setResults(r => [...r, correct]);

    if (correct) {
      const newCoins = coins + 1;
      setCoins(newCoins);
      setScore(s => s + (currentEx?.points ?? 10));
      setRunnerX((newCoins / exercises.length) * 82);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      runnerAnimate(runnerScope.current, { x: [-6, 6, -5, 5, 0] }, { duration: 0.4 });
      if (newLives <= 0) {
        setTimeout(() => setPhase('result'), 800);
      }
    }
  };

  const handleNext = () => {
    if (lives <= 0) {
      setPhase('result');
      return;
    }
    const next = currentIdx + 1;
    if (next >= exercises.length) {
      setPhase('result');
    } else {
      setCurrentIdx(next);
    }
  };

  // ── Save result ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'result' && exercises.length > 0 && results.length > 0 && currentStudent) {
      const correct = results.filter(Boolean).length;
      const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : 8;
      const xp = calculateGameXP(correct, results.length, 0, 1, lives > 0 && correct === results.length, avgTime);
      recordGameSession(currentStudent.id, {
        gameId: 'collect-coins',
        score,
        correct,
        total: results.length,
        streak: 0,
        combo: 1,
        timeSpent: timings.reduce((a, b) => a + b, 0),
        xpEarned: xp,
        newLevel: false,
        weakTopics: analyzeWeakTopics(exercises.slice(0, results.length), results),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Render: Intro ─────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0920] via-[#13113a] to-[#0a0920]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center w-full max-w-sm"
          >
            {/* Hero icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-8xl mb-4 select-none"
            >
              🏃
            </motion.div>

            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Samla mynt!</h1>
            <p className="text-indigo-200 text-sm mb-7 leading-relaxed max-w-xs mx-auto">
              Svara rätt och löparen springer framåt och samlar ett guldmynt.
              Svarar du fel stannar löparen och du förlorar ett liv.
            </p>

            {/* Stats card */}
            <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4 mb-6 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 flex items-center gap-2">
                  <span className="text-base">❓</span> Frågor
                </span>
                <span className="font-bold text-white bg-indigo-500/30 px-2.5 py-0.5 rounded-full text-xs">
                  {exerciseCount} st
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 flex items-center gap-2">
                  <span className="text-base">🛡️</span> Liv
                </span>
                <div className="flex gap-1">
                  {[...Array(MAX_LIVES)].map((_, i) => (
                    <span key={i} className="text-lg">🛡️</span>
                  ))}
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 flex items-center gap-2">
                  <span className="text-base">⭐</span> Din nivå
                </span>
                <span className="font-bold text-amber-400 text-sm">Level {gameLevel}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xl rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Starta! 🚀
            </button>
            <button
              onClick={() => setView('games' as any)}
              className="mt-4 text-indigo-300/70 text-sm hover:text-indigo-200 transition-colors duration-200 cursor-pointer"
            >
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
    const total = results.length;
    const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : 8;
    const xp = calculateGameXP(correct, total || 1, 0, 1, lives > 0 && correct === total, avgTime);
    const weakTopics = analyzeWeakTopics(exercises.slice(0, total), results);
    const isPerfect = coins === total;
    const isGood = coins >= total * 0.7;
    const trophy = isPerfect ? '🏆' : isGood ? '🥇' : '🪙';
    const headline = isPerfect ? 'Perfekt!' : isGood ? 'Bra jobbat!' : 'Fortsätt träna!';

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0920] via-[#13113a] to-[#0a0920]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-center w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
              className="text-7xl mb-3 select-none"
            >
              {trophy}
            </motion.div>

            <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{headline}</h2>
            <p className="text-amber-400 text-sm mb-6">{coins} av {total} mynt samlade</p>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Mynt', value: coins, icon: '🪙', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30' },
                { label: 'Poäng', value: score, icon: '🎯', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30' },
              ].map(s => (
                <div key={s.label} className={`bg-gradient-to-b ${s.color} border rounded-2xl p-4 text-center`}>
                  <div className="text-2xl mb-1 select-none">{s.icon}</div>
                  <div className="text-white font-black text-2xl">{s.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* XP banner */}
            <div className="bg-gradient-to-r from-amber-500/25 to-orange-500/15 border border-amber-400/30 rounded-2xl px-4 py-4 mb-4 shadow-inner">
              <div className="text-amber-300 font-black text-3xl">+{xp} XP</div>
              <div className="text-amber-200/60 text-xs mt-0.5">intjänat denna omgång</div>
            </div>

            {weakTopics.length > 0 && (
              <div className="bg-rose-900/20 border border-rose-500/25 rounded-2xl p-4 mb-4 text-left">
                <p className="text-rose-300 font-bold text-sm mb-2">📚 Träna mer på:</p>
                {weakTopics.map(t => (
                  <p key={t} className="text-rose-200/70 text-xs leading-relaxed">• {t}</p>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Spela igen
              </button>
              <button
                onClick={() => setView('games' as any)}
                className="flex-1 py-3.5 bg-white/[0.07] border border-white/10 text-white/80 font-bold rounded-xl hover:bg-white/[0.12] transition-all duration-200 active:scale-95 cursor-pointer"
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

  const isLastQuestion = currentIdx + 1 >= exercises.length;
  const isGameOver = revealed && lives <= 0 && selected !== null && !options[selected]?.isCorrect;
  const correctIdx = options.findIndex(o => o.isCorrect);

  function optionStyle(idx: number): string {
    const base = 'w-full text-left px-3.5 py-3.5 rounded-xl border-2 font-semibold transition-all duration-200 text-sm flex items-center gap-3 min-h-[52px] ';
    if (!revealed) {
      return base + 'border-white/15 bg-white/[0.06] text-white hover:border-indigo-400/60 hover:bg-indigo-900/30 cursor-pointer active:scale-[0.98]';
    }
    if (idx === correctIdx) {
      return base + 'border-emerald-400/70 bg-emerald-900/35 text-emerald-200';
    }
    if (idx === selected && !options[idx].isCorrect) {
      return base + 'border-rose-400/70 bg-rose-900/35 text-rose-200';
    }
    return base + 'border-white/5 bg-white/[0.03] text-white/30 cursor-not-allowed';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0920] via-[#13113a] to-[#0a0920]">
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-6 space-y-3">

        {/* ── Coin progress dots ── */}
        <div className="flex gap-1.5 flex-wrap justify-center">
          {exercises.map((_, i) => {
            const status = results[i];
            return (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 flex-1 min-w-[14px] max-w-[32px] ${
                  status === true
                    ? 'bg-amber-400'
                    : status === false
                    ? 'bg-rose-400'
                    : i === currentIdx
                    ? 'bg-indigo-400'
                    : 'bg-white/15'
                }`}
              />
            );
          })}
        </div>

        {/* ── HUD ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/20 rounded-full px-3 py-1">
            <span className="text-base select-none">🪙</span>
            <span className="text-amber-300 font-bold text-sm">{coins}</span>
          </div>
          <span className="text-white/40 text-xs font-medium">{currentIdx + 1} / {exercises.length}</span>
          <div className="flex gap-1.5">
            {[...Array(MAX_LIVES)].map((_, i) => (
              <motion.span
                key={i}
                animate={i === lives && revealed && !options[selected ?? -1]?.isCorrect ? { scale: [1, 1.4, 0.8, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={`text-xl select-none transition-all duration-300 ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}
              >
                🛡️
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Runner track ── */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
          {/* Sky */}
          <div
            className="relative overflow-hidden"
            style={{
              height: 88,
              background: 'linear-gradient(to bottom, #1e1b6e 0%, #2d3a8c 50%, #3b5fc4 100%)',
            }}
          >
            {/* Stars (static decoration) */}
            {[14, 28, 42, 60, 72, 85].map((left, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{ left: `${left}%`, top: `${[20, 35, 15, 40, 25, 30][i]}%` }}
              />
            ))}
            {/* Runner */}
            <motion.div
              ref={runnerScope}
              className="absolute select-none"
              animate={{ left: `${runnerX}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ bottom: 4, lineHeight: 1, fontSize: 32, scaleX: -1 }}
            >
              🏃
            </motion.div>
          </div>
          {/* Ground */}
          <div
            className="relative h-4"
            style={{ background: 'linear-gradient(to bottom, #16a34a, #15803d)' }}
          >
            <div className="absolute inset-0 flex items-center px-3 gap-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="flex-1 h-0.5 bg-green-300/30 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* ── Question card ── */}
        <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base select-none">🪙</span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
              Mynt {currentIdx + 1} av {exercises.length}
            </span>
          </div>

          <p className="text-white text-[15px] font-bold leading-snug mb-4 min-h-[2.5rem]">
            {currentEx.question}
          </p>

          {/* ── Answer buttons ── */}
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt, idx) => (
              <button
                key={idx}
                className={optionStyle(idx)}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
              >
                <span
                  className={`w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-[11px] font-black flex-shrink-0 transition-colors duration-200 ${
                    revealed && idx === correctIdx
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : revealed && idx === selected && !options[idx].isCorrect
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : ''
                  }`}
                >
                  {revealed && idx === correctIdx
                    ? '✓'
                    : revealed && idx === selected && !options[idx].isCorrect
                    ? '✗'
                    : LABELS[idx] ?? String(idx + 1)}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* ── Feedback & Next ── */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between mt-4 pt-3 border-t border-white/8"
              >
                <span className={`text-sm font-bold ${options[selected ?? -1]?.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {options[selected ?? -1]?.isCorrect ? '✓ Rätt svar!' : '✗ Fel svar'}
                </span>
                <button
                  onClick={handleNext}
                  className={`px-5 py-2 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-md ${
                    isGameOver
                      ? 'bg-gray-600 hover:bg-gray-500 shadow-gray-900/30'
                      : options[selected ?? -1]?.isCorrect
                      ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-900/30'
                      : 'bg-orange-500 hover:bg-orange-400 shadow-orange-900/30'
                  }`}
                >
                  {isLastQuestion || isGameOver ? 'Visa resultat →' : 'Nästa mynt →'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
