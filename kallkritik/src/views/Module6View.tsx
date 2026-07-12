import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Users, MessageSquare, BarChart2, Quote, Camera, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultSummary } from '@/components/ResultSummary';
import { MODULE6_ITEMS } from '@/data/module6Data';
import { SantEllerFakeItem } from '@/types';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'game' | 'result';
type UserVote = 'sant' | 'osaker' | 'fake' | null;

function getTypeIcon(type: SantEllerFakeItem['type']) {
  switch (type) {
    case 'headline': return <Newspaper className="w-4 h-4" />;
    case 'post': return <MessageSquare className="w-4 h-4" />;
    case 'statistic': return <BarChart2 className="w-4 h-4" />;
    case 'quote': return <Quote className="w-4 h-4" />;
    case 'screenshot': return <Camera className="w-4 h-4" />;
  }
}

function getTypeStyling(type: SantEllerFakeItem['type']) {
  switch (type) {
    case 'headline':
      return {
        containerClass: 'bg-white border-gray-200',
        headerClass: 'bg-gray-100 border-b-2 border-gray-200',
        headerLabel: '📰 NYHETER',
        contentClass: 'text-lg font-bold text-gray-800 leading-snug',
      };
    case 'post':
      return {
        containerClass: 'bg-sky-50 border-sky-200',
        headerClass: 'bg-sky-100 border-b-2 border-sky-200',
        headerLabel: '📱 Sociala medier',
        contentClass: 'text-base text-gray-700 font-medium leading-relaxed',
      };
    case 'statistic':
      return {
        containerClass: 'bg-indigo-50 border-indigo-200',
        headerClass: 'bg-indigo-100 border-b-2 border-indigo-200',
        headerLabel: '📊 Statistik / Fakta',
        contentClass: 'text-base font-bold text-gray-800 leading-relaxed text-center',
      };
    case 'quote':
      return {
        containerClass: 'bg-purple-50 border-purple-200',
        headerClass: 'bg-purple-100 border-b-2 border-purple-200',
        headerLabel: '💬 Citat',
        contentClass: 'text-base italic font-medium text-gray-700 leading-relaxed text-center',
      };
    case 'screenshot':
      return {
        containerClass: 'bg-gray-50 border-gray-200',
        headerClass: 'bg-gray-100 border-b-2 border-gray-200',
        headerLabel: '📸 Skärmdump',
        contentClass: 'text-sm font-mono text-gray-700 leading-relaxed',
      };
  }
}

export function Module6View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userVote, setUserVote] = useState<UserVote>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const items = MODULE6_ITEMS;
  const currentItem = items[currentIndex];
  const correctScore = scores.filter(Boolean).length;
  const xpEarned = correctScore * 10;
  const earnedBadge = correctScore >= 8 ? { name: 'Snabbdomaren', icon: '⚡' } : null;

  function handleVote(vote: UserVote) {
    if (revealed || !vote) return;
    const isCorrect = vote === currentItem.verdict;
    setUserVote(vote);
    setRevealed(true);
    setScores(prev => [...prev, isCorrect]);
  }

  function handleNext() {
    if (currentIndex + 1 >= items.length) {
      onComplete(Math.round((correctScore / items.length) * 100), xpEarned, earnedBadge?.name);
      setPhase('result');
    } else {
      setCurrentIndex(i => i + 1);
      setUserVote(null);
      setRevealed(false);
    }
  }

  function handleReplay() {
    setPhase('intro');
    setCurrentIndex(0);
    setUserVote(null);
    setRevealed(false);
    setScores([]);
  }

  if (phase === 'result') {
    return (
      <ResultSummary
        moduleName="Sant eller Fake?"
        moduleId={6}
        score={correctScore}
        totalQuestions={items.length}
        xpEarned={xpEarned}
        newBadge={earnedBadge}
        onReplay={handleReplay}
        onHome={onExit}
      />
    );
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-3xl p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="text-7xl mb-4"
            >
              ⚡
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Sant eller Fake?</h1>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
              Rubriker, inlägg, statistik och citat – kan du skilja{' '}
              <span className="text-success font-semibold">sant</span> från{' '}
              <span className="text-danger font-semibold">fejk</span>?
              Perfekt för klassrumsdiskussioner!
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4 text-left">
              <div className="font-semibold text-primary text-sm mb-2">🎯 Tre alternativ</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-success/15 border border-success/30 rounded-lg p-2 text-center">
                  <div className="text-lg mb-0.5">✅</div>
                  <div className="text-success font-semibold">Sant</div>
                </div>
                <div className="bg-xp/15 border border-xp/30 rounded-lg p-2 text-center">
                  <div className="text-lg mb-0.5">❓</div>
                  <div className="text-xp font-semibold">Osäker</div>
                </div>
                <div className="bg-danger/15 border border-danger/30 rounded-lg p-2 text-center">
                  <div className="text-lg mb-0.5">❌</div>
                  <div className="text-danger font-semibold">Fake</div>
                </div>
              </div>
            </div>
            <div className="bg-xp/10 border border-xp/30 rounded-xl p-3 mb-4 flex items-start gap-2 text-left">
              <Users className="w-4 h-4 text-xp shrink-0 mt-0.5" />
              <p className="text-xs text-xp font-medium">
                Klassrumsklart! Diskussionsfrågor visas efter varje svar.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 bg-xp/10 rounded-xl px-4 py-3 mb-6">
              <Zap className="w-5 h-5 text-xp shrink-0" />
              <p className="text-sm text-xp font-medium">10 påståenden · Max 100 XP · Märke vid 8/10</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">
                Avsluta
              </Button>
              <Button variant="primary" onClick={() => setPhase('game')} size="lg" className="flex-1">
                Starta ⚡
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const styling = getTypeStyling(currentItem.type);
  const isCorrect = revealed && userVote === currentItem.verdict;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground font-medium">
            Påstående {currentIndex + 1} av {items.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {correctScore} rätt hittills
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
            animate={{ width: `${(currentIndex / items.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Content card — styled by type */}
          <motion.div
            animate={
              revealed
                ? currentItem.verdict === 'sant'
                  ? { borderColor: 'hsl(142 72% 45%)', boxShadow: '0 0 20px hsl(142 72% 45% / 0.15)' }
                  : { borderColor: 'hsl(0 84% 60%)', boxShadow: '0 0 20px hsl(0 84% 60% / 0.15)' }
                : {}
            }
            className={`rounded-2xl border-2 shadow-sm overflow-hidden transition-all duration-500 ${styling.containerClass}`}
          >
            {/* Card header */}
            <div className={`flex items-center gap-2 px-4 py-2.5 ${styling.headerClass}`}>
              <span className="text-muted-foreground">{getTypeIcon(currentItem.type)}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {currentItem.typeLabel}
              </span>
              {revealed && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="ml-auto"
                >
                  <Badge variant={currentItem.verdict === 'sant' ? 'success' : 'danger'}>
                    {currentItem.verdict === 'sant' ? '✓ SANT' : '✗ FAKE'}
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="px-5 py-4">
              {currentItem.type === 'quote' && (
                <div className="text-4xl text-muted-foreground/30 mb-1 leading-none select-none">"</div>
              )}
              {currentItem.type === 'statistic' && (
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              )}
              <p className={styling.contentClass}>{currentItem.content}</p>
              {currentItem.source && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <span className="opacity-60">Källa:</span>
                  <span className="italic">{currentItem.source}</span>
                </p>
              )}
            </div>
          </motion.div>

          {/* Vote buttons — BIG and colorful */}
          {!revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('sant')}
                className="flex flex-col items-center gap-2 bg-success/15 border-2 border-success/40 hover:border-success hover:bg-success/25 rounded-2xl py-5 px-3 transition-all duration-200 active:scale-95"
              >
                <span className="text-3xl">✅</span>
                <span className="font-bold text-success text-base">Sant</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('osaker')}
                className="flex flex-col items-center gap-2 bg-xp/15 border-2 border-xp/40 hover:border-xp hover:bg-xp/25 rounded-2xl py-5 px-3 transition-all duration-200 active:scale-95"
              >
                <span className="text-3xl">❓</span>
                <span className="font-bold text-xp text-base">Osäker</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('fake')}
                className="flex flex-col items-center gap-2 bg-danger/15 border-2 border-danger/40 hover:border-danger hover:bg-danger/25 rounded-2xl py-5 px-3 transition-all duration-200 active:scale-95"
              >
                <span className="text-3xl">❌</span>
                <span className="font-bold text-danger text-base">Fake</span>
              </motion.button>
            </motion.div>
          )}

          {/* Reveal panel */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                {/* Result banner */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                    isCorrect
                      ? 'bg-success/15 border border-success/40'
                      : userVote === 'osaker'
                      ? 'bg-xp/15 border border-xp/40'
                      : 'bg-danger/15 border border-danger/40'
                  }`}
                >
                  <span className="text-2xl">
                    {isCorrect ? '🎉' : userVote === 'osaker' ? '🤔' : '😬'}
                  </span>
                  <div>
                    <div className={`font-bold text-sm ${
                      isCorrect ? 'text-success' : userVote === 'osaker' ? 'text-xp' : 'text-danger'
                    }`}>
                      {isCorrect
                        ? 'Rätt! +10 XP'
                        : userVote === 'osaker'
                        ? 'Osäker – det var ' + (currentItem.verdict === 'sant' ? 'sant!' : 'fake!')
                        : 'Fel! Det var ' + (currentItem.verdict === 'sant' ? 'sant!' : 'fake!')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Du röstade:{' '}
                      <span className="font-medium text-foreground">
                        {userVote === 'sant' ? '✅ Sant' : userVote === 'fake' ? '❌ Fake' : '❓ Osäker'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Explanation */}
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">{currentItem.explanation}</p>
                </div>

                {/* Discussion prompt — PROMINENT classroom box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden rounded-2xl border-2 border-xp/60 bg-gradient-to-br from-xp/15 to-xp/5"
                >
                  {/* Decorative top bar */}
                  <div className="bg-xp/30 px-4 py-2 flex items-center gap-2 border-b border-xp/30">
                    <Users className="w-4 h-4 text-xp shrink-0" />
                    <span className="text-xs font-bold text-xp uppercase tracking-wider">
                      Diskutera i klassen
                    </span>
                    <span className="ml-auto text-lg">🏫</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      {currentItem.discussionPrompt}
                    </p>
                  </div>
                </motion.div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentIndex + 1 >= items.length ? 'Se resultat 🏆' : 'Nästa'}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
