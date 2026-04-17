import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import { WORLDS, WorldId } from '../../data/worlds';
import { recordGameSession, loadGameProgress } from '../../utils/gameStorage';
import { getCorrectFeedback } from '../../utils/feedback';
import AppHeader from '../AppHeader';

// ── Word lists per world ──────────────────────────────────────────────────────

const WORDS: Record<WorldId, string[]> = {
  dino: [
    'CIRKEL', 'TRIANGEL', 'KVADRAT', 'ADDITION', 'MINUS',
    'HÄLFTEN', 'DUBBELT', 'KLOCKAN', 'METER', 'LITER',
    'KILOGRAM', 'RÄKNA', 'FORM', 'LINJE', 'NUMMER',
    'TÄRNING', 'RÄKNARE', 'TABELL', 'SUMMA', 'SKILLNAD',
  ],
  fantasy: [
    'PROCENT', 'BRÅKTAL', 'EKVATION', 'DECIMAL', 'DIAGRAM',
    'KOORDINAT', 'PRIMTAL', 'DIVISION', 'MULTIPLIKATION', 'GEOMETRI',
    'VINKEL', 'MEDIAN', 'MEDELVÄRDE', 'SANNOLIKHET', 'AREA',
    'NÄMNARE', 'TÄLJARE', 'REKTANGEL', 'PARALLELL', 'SYMMETRI',
  ],
  scifi: [
    'ALGEBRA', 'VARIABEL', 'FUNKTION', 'EXPONENT', 'STATISTIK',
    'PYTHAGORAS', 'PROPORTION', 'HYPOTENUSA', 'KOORDINATER', 'VOLYM',
    'NEGATIVA', 'STANDARD', 'FORMEL', 'RÄTVINKLIG', 'LINJÄR',
    'UTTRYCK', 'AVRUNDNING', 'ENHETSOMVANDLING', 'SANNOLIKHET', 'SPRIDNING',
  ],
  gym: [
    'DERIVATA', 'TRIGONOMETRI', 'LOGARITM', 'INTEGRAL', 'VEKTOR',
    'ASYMPTOT', 'POLYNOM', 'GRÄNSVÄRDE', 'MATRIS', 'KOMPLEX',
    'SINUS', 'COSINUS', 'TANGENS', 'KOMBINATORIK', 'PERMUTATION',
    'BINOMIAL', 'DIFFERENTIALEKVATION', 'KONTINUERLIG', 'DISKRET', 'FOURIER',
  ],
};

// ── Swedish alphabet ──────────────────────────────────────────────────────────

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'.split('');

// ── World theme ───────────────────────────────────────────────────────────────

const WORLD_THEME: Record<WorldId, {
  gradientBg: string; accent: string; accentClass: string;
  badgeBg: string; badgeText: string; mascot: string[];
}> = {
  dino:    { gradientBg: 'from-[#0a1a0e] via-[#0f2d16] to-[#0a1a0e]', accent: '#10b981', accentClass: 'text-emerald-400', badgeBg: 'bg-emerald-900/50 border-emerald-500/30', badgeText: 'text-emerald-300', mascot: ['🦖😄','🦖🙂','🦕😐','🦕😟','🦕😰','🦕😵'] },
  fantasy: { gradientBg: 'from-[#150a2e] via-[#1e1040] to-[#150a2e]', accent: '#8b5cf6', accentClass: 'text-purple-400', badgeBg: 'bg-purple-900/50 border-purple-500/30', badgeText: 'text-purple-300', mascot: ['🧙😄','🧙🙂','🧙😐','🧙😟','🧙😰','🧙😵'] },
  scifi:   { gradientBg: 'from-[#050d1f] via-[#0a1535] to-[#050d1f]', accent: '#3b82f6', accentClass: 'text-blue-400', badgeBg: 'bg-blue-900/50 border-blue-500/30', badgeText: 'text-blue-300', mascot: ['🤖😄','🤖🙂','🤖😐','🤖😟','🤖😰','🤖😵'] },
  gym:     { gradientBg: 'from-[#0a0a1f] via-[#111138] to-[#0a0a1f]', accent: '#6366f1', accentClass: 'text-indigo-400', badgeBg: 'bg-indigo-900/50 border-indigo-500/30', badgeText: 'text-indigo-300', mascot: ['👨‍🚀😄','👨‍🚀🙂','👨‍🚀😐','👨‍🚀😟','👨‍🚀😰','👨‍🚀😵'] },
};

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_LIVES = 6;

// ── Helpers ───────────────────────────────────────────────────────────────────

function pickWord(worldId: WorldId): string {
  const list = WORDS[worldId] ?? WORDS.dino;
  return list[Math.floor(Math.random() * list.length)];
}

// ── Main Component ────────────────────────────────────────────────────────────

type Phase = 'playing' | 'won' | 'lost';

export default function HangmanGame() {
  const { currentStudent, setView, gameWorldId } = useApp();
  const worldId: WorldId = gameWorldId ?? 'dino';
  const world = WORLDS.find(w => w.id === worldId);
  const theme = WORLD_THEME[worldId];

  const [word, setWord] = useState(() => pickWord(worldId));
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>('playing');
  const [gamesWon, setGamesWon] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);

  const wrongGuesses = [...guessed].filter(l => !word.includes(l));
  const livesLeft = MAX_LIVES - wrongGuesses.length;
  const isWon = word.split('').every(l => guessed.has(l));
  const isLost = livesLeft <= 0;

  const mascotIndex = Math.min(MAX_LIVES - livesLeft, theme.mascot.length - 1);

  // Trigger win/loss transitions
  const currentPhase = isWon ? 'won' : isLost ? 'lost' : 'playing';
  const winMsgRef = useRef('');
  useEffect(() => {
    if (isWon) winMsgRef.current = getCorrectFeedback();
  }, [isWon]);

  const handleGuess = useCallback((letter: string) => {
    if (guessed.has(letter) || currentPhase !== 'playing') return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);

    const newWrong = [...newGuessed].filter(l => !word.includes(l));
    const newLivesLeft = MAX_LIVES - newWrong.length;
    const won = word.split('').every(l => newGuessed.has(l));
    const lost = newLivesLeft <= 0;

    if (won || lost) {
      setTotalPlayed(n => n + 1);
      if (won) setGamesWon(n => n + 1);
      if (currentStudent) {
        recordGameSession(currentStudent.id, {
          gameId: 'hangman',
          score: won ? Math.max(10, 100 + newLivesLeft * 15) : 5,
          correct: won ? 1 : 0,
          total: 1,
          streak: won ? 1 : 0,
          combo: 0,
          timeSpent: 0,
          xpEarned: won ? 30 + newLivesLeft * 10 : 5,
          newLevel: false,
          weakTopics: [],
        });
      }
    }
  }, [guessed, word, currentPhase, currentStudent]);

  const nextWord = useCallback(() => {
    setWord(pickWord(worldId));
    setGuessed(new Set());
    setPhase('playing');
  }, [worldId]);

  const progress = currentStudent ? loadGameProgress(currentStudent.id) : null;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.gradientBg}`}>
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 py-4 pt-20">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setView('games' as any)} className={`${theme.accentClass} text-sm font-semibold hover:text-white transition`}>
            ← Spel
          </button>
          <div className="text-center">
            <h1 className="text-lg font-black text-white">Hänga gubben</h1>
            <p className="text-white/40 text-xs">{world?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs font-bold">Vunna: {gamesWon}/{totalPlayed}</p>
            {progress?.games['hangman']?.totalPlays > 0 && (
              <p className="text-white/30 text-xs">Totalt: {progress.games['hangman'].totalPlays}</p>
            )}
          </div>
        </div>

        {/* Hearts + Mascot */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-4">
          {/* Hearts */}
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <motion.span
                key={i}
                animate={i >= livesLeft ? { scale: [1, 1.3, 0.8, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="text-xl"
              >
                {i < livesLeft ? '❤️' : '🖤'}
              </motion.span>
            ))}
          </div>
          {/* Mascot */}
          <motion.div
            key={mascotIndex}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-2xl"
          >
            {theme.mascot[mascotIndex]}
          </motion.div>
        </div>

        {/* Word display */}
        <div className="bg-white/5 border border-white/10 rounded-2xl py-5 px-3 mb-4 text-center">
          <div className="flex gap-1.5 justify-center flex-wrap">
            {word.split('').map((letter, i) => (
              <div key={i} className="flex flex-col items-center">
                <motion.span
                  key={guessed.has(letter) ? 'revealed' : 'hidden'}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-xl font-black min-w-[1.5rem] text-center ${
                    guessed.has(letter)
                      ? currentPhase === 'lost' && !guessed.has(letter)
                        ? 'text-red-400'
                        : 'text-white'
                      : 'text-transparent'
                  }`}
                >
                  {guessed.has(letter) ? letter : '_'}
                </motion.span>
                <div className="h-0.5 w-5 rounded-full bg-white/30 mt-0.5" />
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-3">{word.length} bokstäver</p>
        </div>

        {/* Win / Lose overlay */}
        <AnimatePresence>
          {(currentPhase === 'won' || currentPhase === 'lost') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-2xl p-4 mb-4 text-center border ${
                currentPhase === 'won'
                  ? 'bg-emerald-900/60 border-emerald-500/40'
                  : 'bg-red-900/60 border-red-500/40'
              }`}
            >
              <p className="text-3xl mb-1">{currentPhase === 'won' ? '🎉' : '😵'}</p>
              <p className="font-black text-white text-lg mb-1">
                {currentPhase === 'won' ? winMsgRef.current : 'Rätt svar var:'}
              </p>
              {currentPhase === 'lost' && (
                <p className="text-2xl font-black text-red-300 mb-1">{word}</p>
              )}
              {currentPhase === 'won' && (
                <p className="text-emerald-300 text-sm">+{30 + livesLeft * 10} XP</p>
              )}
              <button
                onClick={nextWord}
                className={`mt-3 px-6 py-2 rounded-xl font-black text-white transition ${
                  currentPhase === 'won' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-700 hover:bg-red-600'
                }`}
              >
                Nästa ord →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wrong letters shown */}
        {wrongGuesses.length > 0 && currentPhase === 'playing' && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            <span className="text-white/40 text-xs font-bold self-center">Fel:</span>
            {wrongGuesses.map(l => (
              <span key={l} className="text-red-400 text-sm font-black bg-red-900/30 border border-red-700/40 rounded-lg px-2 py-0.5">{l}</span>
            ))}
          </div>
        )}

        {/* Alphabet keyboard */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {ALPHABET.map(letter => {
            const isGuessed = guessed.has(letter);
            const isCorrect = isGuessed && word.includes(letter);
            const isWrong = isGuessed && !word.includes(letter);
            return (
              <motion.button
                key={letter}
                whileHover={!isGuessed && currentPhase === 'playing' ? { scale: 1.1 } : {}}
                whileTap={!isGuessed && currentPhase === 'playing' ? { scale: 0.9 } : {}}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || currentPhase !== 'playing'}
                className={`w-9 h-9 rounded-xl font-black text-sm transition-all ${
                  isCorrect
                    ? 'bg-emerald-700/70 text-emerald-200 border border-emerald-500/50 cursor-default opacity-70'
                    : isWrong
                      ? 'bg-red-900/40 text-red-400/50 border border-red-700/30 cursor-default opacity-50'
                      : currentPhase !== 'playing'
                        ? 'bg-white/5 text-white/20 border border-white/10 cursor-default'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer'
                }`}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <button onClick={() => setView('games' as any)} className={`${theme.accentClass} text-sm font-semibold hover:text-white transition`}>
            ← Tillbaka till Spel
          </button>
        </div>
      </div>
    </div>
  );
}
