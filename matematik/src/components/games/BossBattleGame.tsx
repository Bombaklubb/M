import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import AppHeader from '../AppHeader';
import { getGameExercisePool, generateWrongOptions, analyzeWeakTopics, GameExercise } from '../../utils/gameExercises';
import { recordGameSession, calculateGameXP, getGameDifficulty, loadGameProgress } from '../../utils/gameStorage';
import { WORLDS } from '../../data/worlds';

// ── Boss config ──────────────────────────────────────────────────────────────

const BOSSES = [
  { name: 'Räknetrollet', emoji: '👹', color: 'from-red-700 to-red-900', maxHp: 100 },
  { name: 'Algebrahäxan', emoji: '🧙‍♀️', color: 'from-purple-700 to-purple-900', maxHp: 120 },
  { name: 'Divisionsdrakens', emoji: '🐉', color: 'from-emerald-700 to-emerald-900', maxHp: 150 },
  { name: 'Primtalsgiganten', emoji: '💀', color: 'from-gray-700 to-gray-900', maxHp: 180 },
];

type Phase = 'intro' | 'playing' | 'victory' | 'defeat';

interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

function buildOptions(ex: GameExercise): AnswerOption[] {
  if (ex.type === 'multiple-choice') {
    const correct = ex.options[ex.correctIndex];
    const others = ex.options.filter((_, i) => i !== ex.correctIndex).slice(0, 3);
    return [{ text: correct, isCorrect: true }, ...others.map(t => ({ text: t, isCorrect: false }))]
      .sort(() => Math.random() - 0.5);
  }
  if (ex.type === 'fill-in') {
    const correct = String(ex.answer);
    const wrong = generateWrongOptions(correct, 3);
    return [{ text: correct, isCorrect: true }, ...wrong.map(t => ({ text: t, isCorrect: false }))]
      .sort(() => Math.random() - 0.5);
  }
  if (ex.type === 'true-false') {
    return [
      { text: 'Sant', isCorrect: ex.isTrue },
      { text: 'Falskt', isCorrect: !ex.isTrue },
    ].sort(() => Math.random() - 0.5);
  }
  return [{ text: '?', isCorrect: true }];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BossBattleGame() {
  const { currentStudent, setView, gameWorldId } = useApp();
  const grade = currentStudent?.grade ?? '5';
  const worldData = gameWorldId ? WORLDS.find(w => w.id === gameWorldId) : null;
  const worldGradeRange = worldData ? { minGrade: worldData.minGrade, maxGrade: worldData.maxGrade } : undefined;

  const gameProgress = currentStudent
    ? loadGameProgress(currentStudent.id).games['boss-battle']
    : null;
  const gameLevel = gameProgress?.level ?? 1;
  const { exerciseCount } = getGameDifficulty(gameLevel);

  const boss = BOSSES[Math.min(Math.floor((gameLevel - 1) / 5), BOSSES.length - 1)];

  const [phase, setPhase] = useState<Phase>('intro');
  const [exercises, setExercises] = useState<GameExercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<AnswerOption[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<'hit' | 'hurt' | null>(null);
  const [bossShake, setBossShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [timings, setTimings] = useState<number[]>([]);
  const questionStartRef = useRef(Date.now());

  const currentEx = exercises[currentIdx];
  const playerDamage = 15 + gameLevel * 2;
  const bossDamage = 10 + gameLevel;

  // ── Start ────────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const pool = getGameExercisePool(grade, gameLevel, exerciseCount, ['multiple-choice', 'fill-in', 'true-false'], worldGradeRange);
    setExercises(pool);
    setCurrentIdx(0);
    setResults([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setSelected(null);
    setPlayerHp(100);
    setBossHp(boss.maxHp);
    setTimings([]);
    setPhase('playing');
  }, [grade, gameLevel, exerciseCount, boss.maxHp]);

  // ── Load options ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'playing' && currentEx) {
      setOptions(buildOptions(currentEx));
      setSelected(null);
      setFeedback(null);
      questionStartRef.current = Date.now();
    }
  }, [currentIdx, phase, currentEx]);

  // ── Answer ────────────────────────────────────────────────────────────────

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    const timeSpent = (Date.now() - questionStartRef.current) / 1000;
    setTimings(t => [...t, timeSpent]);
    setSelected(idx);
    const isCorrect = options[idx].isCorrect;
    setResults(r => [...r, isCorrect]);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setScore(s => s + currentEx.points + newStreak * 5);
      setFeedback('hit');
      setBossShake(true);
      setBossHp(hp => {
        const newHp = Math.max(0, hp - playerDamage);
        return newHp;
      });
      setTimeout(() => setBossShake(false), 500);
    } else {
      setStreak(0);
      setFeedback('hurt');
      setPlayerShake(true);
      setPlayerHp(hp => {
        const newHp = Math.max(0, hp - bossDamage);
        return newHp;
      });
      setTimeout(() => setPlayerShake(false), 500);
    }

    setTimeout(() => advanceOrEnd(isCorrect), 1000);
  };

  const advanceOrEnd = (lastCorrect: boolean) => {
    setBossHp(bHp => {
      setPlayerHp(pHp => {
        if (bHp <= 0) { setPhase('victory'); return pHp; }
        if (pHp <= 0) { setPhase('defeat'); return pHp; }
        setCurrentIdx(i => {
          const next = i + 1;
          if (next >= exercises.length) {
            // End: victory if boss HP < player HP, else defeat
            setPhase(bHp < pHp ? 'victory' : 'defeat');
            return i;
          }
          return next;
        });
        return pHp;
      });
      return bHp;
    });
  };

  // ── Save result ───────────────────────────────────────────────────────────

  useEffect(() => {
    if ((phase === 'victory' || phase === 'defeat') && exercises.length > 0 && currentStudent) {
      const correct = results.filter(Boolean).length;
      const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : 10;
      const xp = calculateGameXP(correct, exercises.length, bestStreak, 1, phase === 'victory', avgTime);
      recordGameSession(currentStudent.id, {
        gameId: 'boss-battle',
        score,
        correct,
        total: exercises.length,
        streak: bestStreak,
        combo: 1,
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
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
            <div className="text-8xl mb-4 animate-bounce">{boss.emoji}</div>
            <h1 className="text-3xl font-black text-white mb-1">Boss Battle!</h1>
            <p className="text-purple-300 text-sm mb-2 font-bold">{boss.name} väntar...</p>
            <p className="text-indigo-300 text-sm mb-6 leading-relaxed">
              Rätt svar skadar bossen. Fel svar och du tar skada!
              Besegra bossen innan ditt HP tar slut.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm space-y-2">
              <div className="flex justify-between text-white/80">
                <span>Bossens HP</span><span className="font-bold text-red-400">{boss.maxHp}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Ditt HP</span><span className="font-bold text-emerald-400">100</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Din skada</span><span className="font-bold text-white">{playerDamage}/hit</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Bossens skada</span><span className="font-bold text-white">{bossDamage}/miss</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg rounded-2xl hover:opacity-90 transition active:scale-95"
            >
              Anfalla!
            </button>
            <button onClick={() => setView('games' as any)} className="mt-4 text-indigo-300 text-sm hover:text-white transition">← Tillbaka</button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Render: Victory / Defeat ──────────────────────────────────────────────

  if (phase === 'victory' || phase === 'defeat') {
    const correct = results.filter(Boolean).length;
    const avgTime = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : 10;
    const xp = calculateGameXP(correct, exercises.length, bestStreak, 1, phase === 'victory', avgTime);
    const weakTopics = analyzeWeakTopics(exercises, results);
    const isVictory = phase === 'victory';

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm w-full">
            <div className="text-6xl mb-3">{isVictory ? '🏆' : '💀'}</div>
            <h2 className="text-2xl font-black text-white mb-1">
              {isVictory ? `${boss.name} besegrad!` : 'Du förlorade...'}
            </h2>
            <p className="text-indigo-300 text-sm mb-5">
              {correct} av {exercises.length} rätt svar
            </p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Poäng', value: score, emoji: '⚔️' },
                { label: 'Streak', value: bestStreak, emoji: '🔥' },
                { label: 'HP kvar', value: isVictory ? `${playerHp}` : '0', emoji: '❤️' },
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
              <button onClick={startGame} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition active:scale-95">
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
  const playerHpPct = playerHp;
  const bossHpPct = (bossHp / boss.maxHp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* Boss */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span className="font-bold text-red-300">{boss.name} {boss.emoji}</span>
            <span>{bossHp}/{boss.maxHp} HP</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
              animate={{ width: `${bossHpPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Boss sprite */}
        <motion.div
          className="text-center my-3"
          animate={bossShake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className={`text-8xl ${bossShake ? 'grayscale' : ''}`}>{boss.emoji}</span>
        </motion.div>

        {/* Damage flash */}
        <AnimatePresence>
          {feedback === 'hit' && (
            <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -30 }} exit={{}} className="text-center text-red-400 font-black text-xl mb-1">
              -{playerDamage} HP 💥
            </motion.div>
          )}
          {feedback === 'hurt' && (
            <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -30 }} exit={{}} className="text-center text-emerald-400 font-black text-xl mb-1">
              Du tar -{bossDamage} HP 😣
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player HP */}
        <motion.div
          className="mb-4"
          animate={playerShake ? { x: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span className="font-bold text-emerald-300">🧑 Ditt HP</span>
            <span>{playerHp}/100</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${playerHpPct > 50 ? 'bg-emerald-500' : playerHpPct > 25 ? 'bg-amber-500' : 'bg-rose-500'}`}
              animate={{ width: `${playerHpPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 text-center"
          >
            <p className="text-xs text-purple-300/70 mb-1">Fråga {currentIdx + 1}/{exercises.length}</p>
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
      </div>
    </div>
  );
}
