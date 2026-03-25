import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useAnimate } from 'motion/react';
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
    setShake(false);
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
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
            <div className="text-7xl mb-4">🏃</div>
            <h1 className="text-3xl font-black text-white mb-2">Samla mynt!</h1>
            <p className="text-yellow-300 text-sm mb-6 leading-relaxed">
              Svara rätt och löparen springer framåt och samlar ett guldmynt.
              Svarar du fel stannar löparen och du förlorar ett liv.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm space-y-2">
              <div className="flex justify-between text-white/80">
                <span>Frågor</span><span className="font-bold text-white">{exerciseCount} st</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Liv</span><span className="font-bold text-yellow-300">🛡️🛡️🛡️</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Din nivå</span><span className="font-bold text-amber-400">Level {gameLevel}</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-lg rounded-2xl hover:opacity-90 transition active:scale-95"
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
    const correct = results.filter(Boolean).length;
    const total = results.length;
    const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : 8;
    const xp = calculateGameXP(correct, total || 1, 0, 1, lives > 0 && correct === total, avgTime);
    const weakTopics = analyzeWeakTopics(exercises.slice(0, total), results);

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm w-full">
            <div className="text-6xl mb-3">{coins === total ? '🏆' : coins >= total * 0.7 ? '🥇' : '🪙'}</div>
            <h2 className="text-2xl font-black text-white mb-1">
              {coins === total ? 'Perfekt!' : coins >= total * 0.7 ? 'Bra jobbat!' : 'Fortsätt träna!'}
            </h2>
            <p className="text-yellow-300 text-sm mb-5">{coins} mynt samlade</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Mynt', value: coins, emoji: '🪙' },
                { label: 'Poäng', value: score, emoji: '🎯' },
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
              <button onClick={startGame} className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition active:scale-95">
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

  const isLastQuestion = currentIdx + 1 >= exercises.length;
  const isGameOver = revealed && lives <= 0 && selected !== null && !options[selected]?.isCorrect;
  const correctIdx = options.findIndex(o => o.isCorrect);

  function optionStyle(idx: number): string {
    const base = 'w-full text-left px-3 py-3 rounded-xl border-2 font-semibold transition-all duration-200 text-sm flex items-center gap-2.5 ';
    if (!revealed) {
      return base + 'border-white/20 bg-white/5 text-white hover:border-yellow-400/60 hover:bg-yellow-900/20 cursor-pointer active:scale-95';
    }
    if (idx === correctIdx) {
      return base + 'border-green-400 bg-green-900/40 text-green-300';
    }
    if (idx === selected && !options[idx].isCorrect) {
      return base + 'border-red-400 bg-red-900/40 text-red-300';
    }
    return base + 'border-white/10 bg-white/5 text-white/40';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-6 space-y-4">

        {/* HUD */}
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 font-bold">🪙 {coins}</span>
          <span className="text-white/50 text-sm">{currentIdx + 1}/{exercises.length}</span>
          <div className="flex gap-1">
            {[...Array(MAX_LIVES)].map((_, i) => (
              <span key={i} className={`text-xl transition-all duration-300 ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>🛡️</span>
            ))}
          </div>
        </div>

        {/* Runner track */}
        <div className="rounded-2xl overflow-hidden border-2 border-white/10">
          <div className="relative bg-sky-300/20 backdrop-blur-sm" style={{ height: 80 }}>
            <motion.div
              ref={runnerScope}
              className="absolute bottom-0 text-3xl select-none"
              animate={{ left: `${runnerX}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ lineHeight: 1 }}
            >
              🏃
            </motion.div>
          </div>
          <div className="bg-green-600/40 h-3 relative">
            <div className="absolute inset-0 flex items-center px-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 h-0.5 bg-green-400/40 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🪙</span>
            <span className="text-sm font-bold text-amber-400">Mynt {currentIdx + 1} av {exercises.length}</span>
          </div>
          <p className="text-white text-base font-bold leading-snug mb-4">{currentEx.question}</p>

          {/* Answer buttons */}
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt, idx) => (
              <button
                key={idx}
                className={optionStyle(idx)}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
              >
                <span className={`w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  revealed && idx === correctIdx
                    ? 'bg-green-500 border-green-500 text-white'
                    : revealed && idx === selected && !options[idx].isCorrect
                    ? 'bg-red-500 border-red-500 text-white'
                    : ''
                }`}>
                  {revealed && idx === correctIdx
                    ? '✓'
                    : revealed && idx === selected && !options[idx].isCorrect
                    ? '✗'
                    : LABELS[idx] ?? String(idx + 1)}
                </span>
                <span className="leading-tight">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* Next button */}
          {revealed && (
            <div className="flex justify-end mt-3">
              <button
                onClick={handleNext}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white transition active:scale-95 ${
                  isGameOver
                    ? 'bg-gray-600 hover:bg-gray-500'
                    : options[selected ?? -1]?.isCorrect
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {isLastQuestion || isGameOver ? 'Visa resultat →' : 'Nästa mynt →'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
