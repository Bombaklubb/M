import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Zap, Bot, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultSummary } from '@/components/ResultSummary';
import { MODULE5_ITEMS } from '@/data/module5Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'game' | 'result';

export function Module5View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userChoice, setUserChoice] = useState<'correct' | 'hallucination' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const items = MODULE5_ITEMS;
  const currentItem = items[currentIndex];
  const correctScore = scores.filter(Boolean).length;
  const xpEarned = correctScore * 15;
  const earnedBadge = correctScore >= 4 ? { name: 'Sanningssökaren', icon: '💬' } : null;

  // Trigger typing animation when entering game or moving to next item
  useEffect(() => {
    if (phase === 'game') {
      setShowTyping(true);
      setShowAnswer(false);
      const timer = setTimeout(() => {
        setShowTyping(false);
        setShowAnswer(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex]);

  function handleChoice(choice: 'correct' | 'hallucination') {
    if (revealed) return;
    const isCorrect =
      choice === 'hallucination'
        ? currentItem.isHallucination
        : !currentItem.isHallucination;
    setUserChoice(choice);
    setRevealed(true);
    setScores(prev => [...prev, isCorrect]);
  }

  function handleNext() {
    if (currentIndex + 1 >= items.length) {
      onComplete(correctScore, xpEarned, earnedBadge?.name);
      setPhase('result');
    } else {
      setCurrentIndex(i => i + 1);
      setUserChoice(null);
      setRevealed(false);
    }
  }

  function handleReplay() {
    setPhase('intro');
    setCurrentIndex(0);
    setUserChoice(null);
    setRevealed(false);
    setScores([]);
  }

  if (phase === 'result') {
    return (
      <ResultSummary
        moduleName="AI-hallucinationer"
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
              animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-7xl mb-4"
            >
              💬
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">AI-hallucinationer</h1>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
              AI kan <span className="text-danger font-semibold">hitta på fakta</span> som låter helt trovärdiga –
              det kallas hallucination. En AI-assistent svarar på frågor, men ibland ljuger den utan att veta om det!
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4 text-left">
              <div className="font-semibold text-primary text-sm mb-2">🎯 Din uppgift</div>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Läs AI:ets svar på varje fråga</li>
                <li>• Bedöm om svaret verkar korrekt eller är en hallucination</li>
                <li>• Förklaring visas efter ditt svar</li>
                <li>• <span className="text-xp font-medium">+15 XP</span> per rätt bedömning</li>
              </ul>
            </div>
            <div className="bg-muted rounded-xl p-3 mb-6 flex items-start gap-3 text-left">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                AI kan vara säker och detaljerad – och ändå ha fel. Rätt ton är inte detsamma som rätt fakta!
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 bg-xp/10 rounded-xl px-4 py-3 mb-6">
              <Zap className="w-5 h-5 text-xp shrink-0" />
              <p className="text-sm text-xp font-medium">6 frågor · Max 90 XP · Märke vid 4/6 rätt</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">
                Avsluta
              </Button>
              <Button variant="primary" onClick={() => setPhase('game')} size="lg" className="flex-1">
                Starta 🤖
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCorrect =
    revealed &&
    (userChoice === 'hallucination'
      ? currentItem.isHallucination
      : !currentItem.isHallucination);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground font-medium">
            Fråga {currentIndex + 1} av {items.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {correctScore} rätt hittills
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
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
          className="space-y-3"
        >
          {/* Chat container */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm shadow">
                🤖
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">AI-Assistent</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Aktiv</span>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-4 space-y-3 min-h-[200px]">
              {/* User question bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end"
              >
                <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-foreground">{currentItem.question}</p>
                </div>
              </motion.div>

              {/* AI typing dots */}
              <AnimatePresence>
                {showTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs shrink-0">
                      🤖
                    </div>
                    <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay: i * 0.15,
                              ease: 'easeInOut',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI answer bubble */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs shrink-0">
                      🤖
                    </div>
                    <div className={`bg-muted border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] ${
                      revealed
                        ? currentItem.isHallucination
                          ? 'border-danger/40'
                          : 'border-success/40'
                        : 'border-border'
                    }`}>
                      <p className="text-sm text-foreground leading-relaxed">{currentItem.aiAnswer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Judgment buttons */}
          <AnimatePresence>
            {showAnswer && !revealed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-muted-foreground text-center mb-2 font-medium">
                  Vad tror du om AI:ets svar?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChoice('correct')}
                    className="flex flex-col items-center gap-2 bg-card border-2 border-success/30 hover:border-success hover:bg-success/10 rounded-2xl p-4 transition-all duration-200 active:scale-95"
                  >
                    <CheckCircle2 className="w-8 h-8 text-success" />
                    <span className="font-bold text-foreground text-sm">✅ Verkar korrekt</span>
                    <span className="text-xs text-muted-foreground">Svaret stämmer</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChoice('hallucination')}
                    className="flex flex-col items-center gap-2 bg-card border-2 border-danger/30 hover:border-danger hover:bg-danger/10 rounded-2xl p-4 transition-all duration-200 active:scale-95"
                  >
                    <AlertTriangle className="w-8 h-8 text-danger" />
                    <span className="font-bold text-foreground text-sm">⚠️ Hallucination!</span>
                    <span className="text-xs text-muted-foreground">AI hittar på</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                  isCorrect
                    ? 'bg-success/15 border border-success/40'
                    : 'bg-danger/15 border border-danger/40'
                }`}>
                  <span className="text-2xl">{isCorrect ? '🎉' : '😬'}</span>
                  <div>
                    <div className={`font-bold text-sm ${isCorrect ? 'text-success' : 'text-danger'}`}>
                      {isCorrect ? 'Rätt bedömning! +15 XP' : 'Fel bedömning!'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Det här är{' '}
                      <span className={currentItem.isHallucination ? 'text-danger font-semibold' : 'text-success font-semibold'}>
                        {currentItem.isHallucination ? 'en AI-hallucination' : 'ett korrekt svar'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Förklaring</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{currentItem.explanation}</p>
                </div>

                {/* Correct answer if hallucination */}
                {currentItem.isHallucination && currentItem.correctAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2 }}
                    className="bg-success/10 border border-success/30 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span className="text-xs font-semibold text-success uppercase tracking-wider">Rätt svar</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{currentItem.correctAnswer}</p>
                  </motion.div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentIndex + 1 >= items.length ? 'Se resultat 🏆' : 'Nästa fråga'}
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
