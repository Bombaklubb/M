import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import AppHeader from '../AppHeader';
import { getGameExercisePool, generateWrongOptions, analyzeWeakTopics, GameExercise } from '../../utils/gameExercises';
import { recordGameSession, calculateGameXP, getGameDifficulty, loadGameProgress } from '../../utils/gameStorage';
import { WORLDS } from '../../data/worlds';

// ── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TIMER = 15; // seconds per question
const FALL_INTERVAL_MS = 80; // ms between fall updates
const FALL_STEP = 0.5; // % per interval — items reach 78% in ~12.5s (comfortable within 15s timer)

// ── Types ────────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'playing' | 'result';

interface AnswerOption {
  text: string;
  isCorrect: boolean;
  lane: number; // 0 = left, 1 = right
}

interface FloatingItem {
  id: number;
  text: string;
  isCoin: boolean;
  lane: number;
  y: number; // 0 (top) to 100 (bottom)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildOptions(ex: GameExercise): AnswerOption[] {
  let correct = '';
  let wrong = '';

  if (ex.type === 'multiple-choice') {
    correct = ex.options[ex.correctIndex];
    const others = ex.options.filter((_, i) => i !== ex.correctIndex);
    wrong = others[Math.floor(Math.random() * others.length)] ?? '?';
  } else if (ex.type === 'fill-in') {
    correct = String(ex.answer);
    const wrongOpts = generateWrongOptions(correct, 1);
    wrong = wrongOpts[0] ?? '?';
  } else if (ex.type === 'true-false') {
    correct = ex.isTrue ? 'Sant' : 'Falskt';
    wrong = ex.isTrue ? 'Falskt' : 'Sant';
  } else {
    correct = '?';
    wrong = '??';
  }

  const opts: AnswerOption[] = [
    { text: correct, isCorrect: true, lane: 0 },
    { text: wrong, isCorrect: false, lane: 1 },
  ];
  if (Math.random() < 0.5) {
    opts[0].lane = 1;
    opts[1].lane = 0;
  }
  return opts;
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
  const [options, setOptions] = useState<AnswerOption[]>([]);
  const [playerLane, setPlayerLane] = useState(0); // 0 = left, 1 = right
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<'coin' | 'hit' | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(QUESTION_TIMER);
  const [timings, setTimings] = useState<number[]>([]);
  const questionStartRef = useRef(Date.now());
  const idCounter = useRef(0);
  const fallIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEx = exercises[currentIdx];

  // ── Start ────────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const pool = getGameExercisePool(grade, gameLevel, exerciseCount, ['multiple-choice', 'fill-in', 'true-false'], worldGradeRange);
    setExercises(pool);
    setCurrentIdx(0);
    setResults([]);
    setScore(0);
    setCoins(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setItems([]);
    setFeedback(null);
    setAnswered(false);
    setPlayerLane(0);
    setTimings([]);
    setQuestionTimer(QUESTION_TIMER);
    idCounter.current = 0;
    setPhase('playing');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, gameLevel, exerciseCount, worldGradeRange]);

  // ── Load options when question changes ────────────────────────────────────

  useEffect(() => {
    if (phase === 'playing' && currentEx) {
      const opts = buildOptions(currentEx);
      setOptions(opts);
      setAnswered(false);
      setFeedback(null);
      setQuestionTimer(QUESTION_TIMER);
      questionStartRef.current = Date.now();

      // Add floating items
      const newItems: FloatingItem[] = opts.map(opt => ({
        id: idCounter.current++,
        text: opt.text,
        isCoin: opt.isCorrect,
        lane: opt.lane,
        y: 0,
      }));
      setItems(newItems);
    }
  }, [currentIdx, phase, currentEx]);

  // ── Fall animation ────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing' || answered) {
      clearInterval(fallIntervalRef.current!);
      return;
    }
    fallIntervalRef.current = setInterval(() => {
      setItems(prev => prev.map(item => ({ ...item, y: item.y + FALL_STEP })));
    }, FALL_INTERVAL_MS);
    return () => clearInterval(fallIntervalRef.current!);
  }, [phase, answered, currentIdx]);

  // ── Question countdown timer ──────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing' || answered) {
      clearInterval(questionTimerRef.current!);
      return;
    }
    questionTimerRef.current = setInterval(() => {
      setQuestionTimer(t => {
        if (t <= 1) {
          clearInterval(questionTimerRef.current!);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(questionTimerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, answered, currentIdx]);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    const timeSpent = QUESTION_TIMER;
    setTimings(t => [...t, timeSpent]);
    setResults(r => [...r, false]);
    setStreak(0);
    const newLives = lives - 1;
    setLives(newLives);
    setFeedback('hit');
    if (newLives <= 0) {
      setTimeout(() => setPhase('result'), 700);
      return;
    }
    setTimeout(() => {
      setItems([]);
      setCurrentIdx(i => {
        const next = i + 1;
        if (next >= exercises.length) { setPhase('result'); return i; }
        return next;
      });
    }, 700);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, lives, exercises.length]);

  // ── Collision detection when items reach player zone ──────────────────────

  useEffect(() => {
    if (answered) return;
    const nearItems = items.filter(item => item.y >= 76 && item.y <= 90);
    for (const item of nearItems) {
      if (item.lane === playerLane) {
        handleCollect(item);
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, playerLane, answered]);

  const handleCollect = (item: FloatingItem) => {
    if (answered) return;
    clearInterval(questionTimerRef.current!);
    setAnswered(true);
    const timeSpent = (Date.now() - questionStartRef.current) / 1000;
    setTimings(t => [...t, timeSpent]);
    setResults(r => [...r, item.isCoin]);

    if (item.isCoin) {
      setCoins(c => c + 1);
      setScore(s => s + (currentEx?.points ?? 10) + streak * 3);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setFeedback('coin');
    } else {
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback('hit');
      if (newLives <= 0) {
        setTimeout(() => setPhase('result'), 700);
        return;
      }
    }

    setTimeout(() => {
      setItems([]);
      setCurrentIdx(i => {
        const next = i + 1;
        if (next >= exercises.length) { setPhase('result'); return i; }
        return next;
      });
    }, 600);
  };

  // ── Lane switch ───────────────────────────────────────────────────────────

  const switchLane = (lane: number) => {
    if (answered) return;
    setPlayerLane(lane);
  };

  // ── Save result ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'result' && exercises.length > 0 && results.length > 0 && currentStudent) {
      const correct = results.filter(Boolean).length;
      const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : 8;
      const xp = calculateGameXP(correct, results.length, bestStreak, 1, lives > 0 && correct === results.length, avgTime);
      recordGameSession(currentStudent.id, {
        gameId: 'collect-coins',
        score,
        correct,
        total: results.length,
        streak: bestStreak,
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
            <div className="text-7xl mb-4">🪙</div>
            <h1 className="text-3xl font-black text-white mb-2">Samla mynt!</h1>
            <p className="text-yellow-300 text-sm mb-6 leading-relaxed">
              Rätt svar faller ner som guldmynt. Fel svar är hinder.
              Rör dig till rätt bana och samla mynten!
            </p>
            <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm space-y-2">
              <div className="flex justify-between text-white/80">
                <span>Tid per fråga</span><span className="font-bold text-cyan-400">{QUESTION_TIMER}s</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Frågor</span><span className="font-bold text-white">{exerciseCount} st</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Liv</span><span className="font-bold text-red-400">❤️❤️❤️</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Din nivå</span><span className="font-bold text-amber-400">Level {gameLevel}</span>
              </div>
            </div>
            <div className="text-xs text-white/50 mb-6">
              💡 Klicka på vänster eller höger bana för att byta! Du har 15 sekunder per fråga.
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
    const xp = calculateGameXP(correct, total || 1, bestStreak, 1, lives > 0 && correct === total, avgTime);
    const weakTopics = analyzeWeakTopics(exercises.slice(0, total), results);

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm w-full">
            <div className="text-6xl mb-3">{lives > 0 ? '🏆' : '💔'}</div>
            <h2 className="text-2xl font-black text-white mb-1">
              {lives > 0 ? 'Bra springning!' : 'Du kraschade!'}
            </h2>
            <p className="text-yellow-300 text-sm mb-5">{coins} mynt samlade</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Mynt', value: coins, emoji: '🪙' },
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
  const timerPct = (questionTimer / QUESTION_TIMER) * 100;
  const timerColor = questionTimer <= 5 ? 'bg-rose-500' : questionTimer <= 9 ? 'bg-amber-500' : 'bg-cyan-500';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-4 flex flex-col" style={{ height: '100vh' }}>
        {/* HUD */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold">🪙 {coins}</span>
            <span className="text-amber-400 font-bold text-sm">🎯 {score}</span>
            {streak >= 3 && (
              <motion.span key={streak} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="text-orange-400 font-black text-sm">🔥 {streak}</motion.span>
            )}
          </div>
          <motion.span
            className={`text-xl font-black ${questionTimer <= 5 ? 'text-rose-400' : 'text-white'}`}
            animate={questionTimer <= 5 ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.9 }}
          >
            {questionTimer}s
          </motion.span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-base ${i < lives ? 'text-red-400' : 'text-white/20'}`}>❤️</span>
            ))}
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${timerColor} transition-colors`}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="text-white/40 text-xs text-right mb-1">{currentIdx + 1}/{exercises.length}</div>

        {/* Question */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3 text-center">
          <p className="text-white text-base font-bold leading-snug">{currentEx.question}</p>
        </div>

        {/* Game area - two lanes */}
        <div className="flex-1 flex gap-3 min-h-0" style={{ minHeight: 200 }}>
          {[0, 1].map(lane => {
            const laneItems = items.filter(item => item.lane === lane);
            const isPlayerLane = playerLane === lane;
            return (
              <button
                key={lane}
                onClick={() => switchLane(lane)}
                className={`flex-1 relative rounded-2xl overflow-hidden transition-all cursor-pointer ${
                  isPlayerLane
                    ? 'border-2 border-yellow-400/60 bg-yellow-900/20'
                    : 'border border-white/10 bg-white/5'
                }`}
              >
                {/* Lane label */}
                <div className="absolute top-2 left-0 right-0 text-center text-white/30 text-xs pointer-events-none">
                  {lane === 0 ? 'Vänster' : 'Höger'}
                </div>

                {/* Falling items */}
                {laneItems.map(item => (
                  <div
                    key={item.id}
                    className="absolute left-0 right-0 flex justify-center pointer-events-none"
                    style={{ top: `${item.y}%` }}
                  >
                    <div className={`px-4 py-2 rounded-full font-black text-sm shadow-lg ${
                      item.isCoin
                        ? 'bg-yellow-500 text-yellow-900 shadow-yellow-500/40'
                        : 'bg-red-700 text-red-100 shadow-red-700/40'
                    }`}>
                      {item.isCoin ? '🪙' : '💣'} {item.text}
                    </div>
                  </div>
                ))}

                {/* Player – race car SVG */}
                {isPlayerLane && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                    <motion.div
                      animate={
                        feedback === 'coin'
                          ? { scale: [1, 1.25, 1], filter: ['drop-shadow(0 0 0px #facc15)', 'drop-shadow(0 0 12px #facc15)', 'drop-shadow(0 0 0px #facc15)'] }
                          : feedback === 'hit'
                          ? { x: [-6, 6, -5, 5, 0], filter: ['drop-shadow(0 0 0px #ef4444)', 'drop-shadow(0 0 10px #ef4444)', 'drop-shadow(0 0 0px #ef4444)'] }
                          : {}
                      }
                      transition={{ duration: 0.35 }}
                    >
                      <span
                        className="text-4xl select-none block"
                        style={{ filter: feedback === 'coin' ? 'drop-shadow(0 0 6px #fbbf24)' : undefined }}
                        aria-hidden="true"
                      >
                        🏃
                      </span>
                    </motion.div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Feedback overlay */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 1.5, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className={`absolute top-1/3 left-1/2 -translate-x-1/2 text-2xl font-black pointer-events-none ${
                  feedback === 'coin' ? 'text-yellow-400' : 'text-rose-400'
                }`}
              >
                {feedback === 'coin' ? `+${currentEx.points} 🪙` : '💥 Aj!'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instruction */}
        <p className="text-center text-white/25 text-xs mt-2">
          Klicka på rätt bana för att samla myntet — du har {QUESTION_TIMER}s!
        </p>
      </div>
    </div>
  );
}
