import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import { WORLDS } from '../../data/worlds';
import { WorldId } from '../../data/worlds';
import { recordGameSession, loadGameProgress } from '../../utils/gameStorage';
import AppHeader from '../AppHeader';

// ── Word pairs per world ──────────────────────────────────────────────────────

const WORD_PAIRS: Record<WorldId, { sv: string; en: string }[]> = {
  dino: [
    { sv: 'tal', en: 'number' },
    { sv: 'cirkel', en: 'circle' },
    { sv: 'triangel', en: 'triangle' },
    { sv: 'kvadrat', en: 'square' },
    { sv: 'hälften', en: 'half' },
    { sv: 'dubbelt', en: 'double' },
    { sv: 'klocka', en: 'clock' },
    { sv: 'mätning', en: 'measurement' },
    { sv: 'addition', en: 'addition' },
    { sv: 'subtraktion', en: 'subtraction' },
  ],
  fantasy: [
    { sv: 'procent', en: 'percent' },
    { sv: 'bråk', en: 'fraction' },
    { sv: 'ekvation', en: 'equation' },
    { sv: 'decimal', en: 'decimal' },
    { sv: 'vinkel', en: 'angle' },
    { sv: 'diagram', en: 'diagram' },
    { sv: 'koordinat', en: 'coordinate' },
    { sv: 'primtal', en: 'prime number' },
    { sv: 'multiplikation', en: 'multiplication' },
    { sv: 'geometri', en: 'geometry' },
  ],
  scifi: [
    { sv: 'algebra', en: 'algebra' },
    { sv: 'variabel', en: 'variable' },
    { sv: 'funktion', en: 'function' },
    { sv: 'exponent', en: 'exponent' },
    { sv: 'statistik', en: 'statistics' },
    { sv: 'sannolikhet', en: 'probability' },
    { sv: 'proportion', en: 'proportion' },
    { sv: 'negativa tal', en: 'negative numbers' },
    { sv: 'koordinater', en: 'coordinates' },
    { sv: 'pythagoras', en: 'pythagoras' },
  ],
  gym: [
    { sv: 'derivata', en: 'derivative' },
    { sv: 'trigonometri', en: 'trigonometry' },
    { sv: 'logaritm', en: 'logarithm' },
    { sv: 'integral', en: 'integral' },
    { sv: 'vektor', en: 'vector' },
    { sv: 'asymptot', en: 'asymptote' },
    { sv: 'polynom', en: 'polynomial' },
    { sv: 'gränsvärde', en: 'limit' },
    { sv: 'matris', en: 'matrix' },
    { sv: 'komplex tal', en: 'complex number' },
  ],
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'select' | 'playing' | 'victory';

interface MemCard {
  id: number;
  pairId: number;
  lang: 'sv' | 'en';
  word: string;
  flipped: boolean;
  matched: boolean;
}

const PAIR_COUNTS: Record<Difficulty, number> = { easy: 4, medium: 7, hard: 10 };

const DIFF_LABELS: Record<Difficulty, string> = {
  easy: 'Lätt',
  medium: 'Medel',
  hard: 'Svår',
};
const DIFF_EMOJIS: Record<Difficulty, string> = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴',
};

// ── World theme ───────────────────────────────────────────────────────────────

const WORLD_THEME: Record<WorldId, { gradientBg: string; accent: string; accentClass: string; badgeBg: string; badgeText: string; cardBack: string }> = {
  dino:    { gradientBg: 'from-[#0a1a0e] via-[#0f2d16] to-[#0a1a0e]', accent: '#10b981', accentClass: 'text-emerald-400', badgeBg: 'bg-emerald-900/50 border-emerald-500/30', badgeText: 'text-emerald-300', cardBack: 'from-emerald-900 to-teal-900' },
  fantasy: { gradientBg: 'from-[#150a2e] via-[#1e1040] to-[#150a2e]', accent: '#8b5cf6', accentClass: 'text-purple-400', badgeBg: 'bg-purple-900/50 border-purple-500/30', badgeText: 'text-purple-300', cardBack: 'from-purple-900 to-violet-900' },
  scifi:   { gradientBg: 'from-[#050d1f] via-[#0a1535] to-[#050d1f]', accent: '#3b82f6', accentClass: 'text-blue-400', badgeBg: 'bg-blue-900/50 border-blue-500/30', badgeText: 'text-blue-300', cardBack: 'from-blue-900 to-indigo-900' },
  gym:     { gradientBg: 'from-[#0a0a1f] via-[#111138] to-[#0a0a1f]', accent: '#6366f1', accentClass: 'text-indigo-400', badgeBg: 'bg-indigo-900/50 border-indigo-500/30', badgeText: 'text-indigo-300', cardBack: 'from-indigo-900 to-purple-900' },
};

// ── Shuffle ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(worldId: WorldId, difficulty: Difficulty): MemCard[] {
  const count = PAIR_COUNTS[difficulty];
  const pairs = shuffle(WORD_PAIRS[worldId] ?? WORD_PAIRS.dino).slice(0, count);
  const cards: MemCard[] = [];
  pairs.forEach((pair, pairId) => {
    cards.push({ id: pairId * 2,     pairId, lang: 'sv', word: pair.sv, flipped: false, matched: false });
    cards.push({ id: pairId * 2 + 1, pairId, lang: 'en', word: pair.en, flipped: false, matched: false });
  });
  return shuffle(cards);
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MemoryGame() {
  const { currentStudent, setView, gameWorldId } = useApp();
  const worldId: WorldId = gameWorldId ?? 'dino';
  const world = WORLDS.find(w => w.id === worldId);
  const theme = WORLD_THEME[worldId];

  const [phase, setPhase] = useState<Phase>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<MemCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const totalPairs = PAIR_COUNTS[difficulty];

  // Timer
  useEffect(() => {
    if (phase === 'playing') {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setCards(buildCards(worldId, diff));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setLocked(false);
    setPhase('playing');
  }, [worldId]);

  const handleCardClick = useCallback((cardId: number) => {
    if (locked) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.includes(cardId)) return;

    const newFlipped = [...flippedIds, cardId];
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1)!;
      const c2 = { ...card };

      setTimeout(() => {
        const isMatch = c1.pairId === c2.pairId && c1.lang !== c2.lang;
        if (isMatch) {
          setCards(prev => prev.map(c =>
            c.id === id1 || c.id === cardId ? { ...c, matched: true, flipped: true } : c
          ));
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches >= totalPairs) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => {
              // Record result
              if (currentStudent) {
                recordGameSession(currentStudent.id, {
                  gameId: 'memory',
                  score: Math.max(10, 200 - moves * 3 - Math.floor(seconds / 5)),
                  correct: newMatches,
                  total: totalPairs,
                  streak: newMatches,
                  combo: newMatches,
                  timeSpent: seconds,
                  xpEarned: Math.max(20, totalPairs * 10 - moves),
                  newLevel: false,
                  weakTopics: [],
                });
              }
              setPhase('victory');
            }, 600);
          }
        } else {
          setCards(prev => prev.map(c =>
            c.id === id1 || c.id === cardId ? { ...c, flipped: false } : c
          ));
        }
        setFlippedIds([]);
        setLocked(false);
      }, 900);
    }
  }, [locked, cards, flippedIds, matches, totalPairs, moves, seconds, currentStudent]);

  const gridCols = difficulty === 'hard' ? 'grid-cols-5' : 'grid-cols-4';
  const cardSize = difficulty === 'hard' ? 'min-h-[60px] text-[10px]' : difficulty === 'medium' ? 'min-h-[68px] text-xs' : 'min-h-[76px] text-sm';
  const progress = currentStudent ? loadGameProgress(currentStudent.id) : null;

  // ── Phase: select ──────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${theme.gradientBg}`}>
        <AppHeader />
        <div className="max-w-md mx-auto px-4 py-6 pt-20">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-4">
            <button onClick={() => setView('games' as any)} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${theme.badgeBg} ${theme.badgeText} hover:opacity-80 transition`}>
              ← Tillbaka till Spel
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-center mb-8">
            <div className="text-6xl mb-3">🃏</div>
            <h1 className="text-3xl font-black text-white mb-2">Memory</h1>
            <p className="text-white/50 text-sm">Para ihop svenska ord med engelska!</p>
            <p className="text-white/40 text-xs mt-1">{world?.name}</p>
            {progress?.games['memory']?.totalPlays > 0 && (
              <div className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${theme.badgeBg} ${theme.badgeText}`}>
                🏆 Bästa: {progress.games['memory'].highScore} poäng • {progress.games['memory'].totalPlays}x spelat
              </div>
            )}
          </motion.div>

          <div className="space-y-3">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff, i) => (
              <motion.button
                key={diff}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => startGame(diff)}
                className="w-full bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-left hover:bg-white/12 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{DIFF_EMOJIS[diff]}</span>
                    <div>
                      <p className="font-black text-white text-base">{DIFF_LABELS[diff]}</p>
                      <p className="text-white/50 text-xs">{PAIR_COUNTS[diff] * 2} kort – {PAIR_COUNTS[diff]} par att hitta</p>
                    </div>
                  </div>
                  <span className="text-white/30 text-xl">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: victory ─────────────────────────────────────────────────────────
  if (phase === 'victory') {
    const score = Math.max(10, 200 - moves * 3 - Math.floor(seconds / 5));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return (
      <div className={`min-h-screen bg-gradient-to-b ${theme.gradientBg} flex items-center justify-center p-4`}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5, delay: 0.1 }} className="text-7xl mb-4">🎉</motion.div>
          <h1 className="text-3xl font-black text-white mb-1">Grattis!</h1>
          <p className="text-white/60 mb-6">Du hittade alla {totalPairs} par!</p>

          <div className="bg-white/8 border border-white/15 rounded-2xl p-5 mb-6 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-black" style={{ color: theme.accent }}>{score}</p>
              <p className="text-white/50 text-xs">Poäng</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{moves}</p>
              <p className="text-white/50 text-xs">Försök</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{mins > 0 ? `${mins}:${secs.toString().padStart(2,'0')}` : `${secs}s`}</p>
              <p className="text-white/50 text-xs">Tid</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => startGame(difficulty)}
              className="w-full py-3 rounded-2xl font-black text-white text-lg"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}99)` }}>
              Spela igen – {DIFF_LABELS[difficulty]}
            </motion.button>
            <button onClick={() => setPhase('select')} className="w-full py-3 rounded-2xl font-bold text-white/70 bg-white/8 border border-white/15 hover:bg-white/12 transition">
              Välj svårighetsgrad
            </button>
            <button onClick={() => setView('games' as any)} className={`${theme.accentClass} text-sm font-semibold hover:text-white transition`}>
              ← Tillbaka till Spel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Phase: playing ─────────────────────────────────────────────────────────
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.gradientBg}`}>
      <AppHeader />
      <div className="max-w-lg mx-auto px-3 py-4 pt-20">
        {/* HUD */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setPhase('select')} className={`${theme.accentClass} text-sm font-semibold hover:text-white transition`}>
            ← Avsluta
          </button>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="text-white/70">⏱ {mins > 0 ? `${mins}:${secs.toString().padStart(2,'0')}` : `${secs}s`}</span>
            <span className="text-white/70">🔄 {moves}</span>
            <span style={{ color: theme.accent }}>✓ {matches}/{totalPairs}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: theme.accent }}
            animate={{ width: `${(matches / totalPairs) * 100}%` }} transition={{ type: 'spring', bounce: 0.2 }} />
        </div>

        {/* Legend */}
        <div className="flex gap-3 mb-3 justify-center text-xs text-white/40 font-semibold">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-600/60 inline-block"/>🇸🇪 Svenska</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-rose-600/60 inline-block"/>🇬🇧 Engelska</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-600/60 inline-block"/>✓ Match!</span>
        </div>

        {/* Card grid */}
        <div className={`grid ${gridCols} gap-2`}>
          <AnimatePresence>
            {cards.map(card => (
              <motion.button
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
                whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
                onClick={() => handleCardClick(card.id)}
                className={`relative ${cardSize} rounded-xl flex flex-col items-center justify-center p-1.5 font-bold transition-all select-none cursor-pointer overflow-hidden
                  ${card.matched
                    ? 'bg-emerald-800/60 border-2 border-emerald-500/60 cursor-default'
                    : card.flipped
                      ? card.lang === 'sv'
                        ? 'bg-blue-800/60 border-2 border-blue-500/60'
                        : 'bg-rose-800/60 border-2 border-rose-500/60'
                      : `bg-gradient-to-br ${theme.cardBack} border border-white/10 hover:border-white/25`
                  }`}
              >
                {card.matched ? (
                  <>
                    <span className="text-base mb-0.5">{card.lang === 'sv' ? '🇸🇪' : '🇬🇧'}</span>
                    <span className="text-emerald-300 text-center leading-tight" style={{ fontSize: '10px' }}>{card.word}</span>
                    <span className="text-emerald-400 text-xs font-black absolute top-0.5 right-1">✓</span>
                  </>
                ) : card.flipped ? (
                  <>
                    <span className="text-base mb-0.5">{card.lang === 'sv' ? '🇸🇪' : '🇬🇧'}</span>
                    <span className={`text-center leading-tight font-black ${card.lang === 'sv' ? 'text-blue-200' : 'text-rose-200'}`}
                      style={{ fontSize: difficulty === 'hard' ? '9px' : '11px' }}>
                      {card.word}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xl opacity-40">{world?.emoji ?? '🎴'}</span>
                    <span className="text-white/20 text-xs font-black">?</span>
                  </>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
