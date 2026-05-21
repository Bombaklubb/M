import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Bot, User, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultSummary } from '@/components/ResultSummary';
import { MODULE1_ITEMS } from '@/data/module1Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'game' | 'result';
type Answer = 'ai' | 'human' | null;

export default function Module1View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const items = MODULE1_ITEMS;
  const currentItem = items[currentIndex];
  const totalQuestions = items.length;

  const correctScore = scores.filter(Boolean).length;
  const xpEarned = correctScore * 10;
  const earnedBadge = correctScore >= 6 ? { name: 'AI-Detektiven', icon: '🔎' } : null;

  function handleAnswer(choice: Answer) {
    if (revealed) return;
    setAnswer(choice);
    setRevealed(true);
    const isCorrect = (choice === 'ai') === currentItem.isAI;
    setScores(prev => [...prev, isCorrect]);
  }

  function handleNext() {
    if (currentIndex + 1 >= items.length) {
      setPhase('result');
      onComplete(correctScore, xpEarned, earnedBadge?.name);
    } else {
      setCurrentIndex(i => i + 1);
      setAnswer(null);
      setRevealed(false);
    }
  }

  function handleReplay() {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswer(null);
    setRevealed(false);
    setScores([]);
  }

  if (phase === 'result') {
    return (
      <ResultSummary
        moduleName="AI eller människa?"
        score={correctScore}
        totalQuestions={totalQuestions}
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
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-7xl mb-4"
            >
              🔎
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">AI eller människa?</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Du får se texter, rubriker, kommentarer och inlägg. Din uppgift är att avgöra
              om de är skapade av en <span className="text-primary font-semibold">AI</span> eller
              skrivna av en <span className="text-success font-semibold">människa</span>.
            </p>
            <div className="flex items-center justify-center gap-3 bg-xp/10 rounded-xl px-4 py-3 mb-6">
              <Zap className="w-5 h-5 text-xp shrink-0" />
              <p className="text-sm text-xp font-medium">10 XP per rätt svar · Max 80 XP</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-muted-foreground">
              <div className="bg-muted rounded-xl p-3">
                <div className="text-2xl mb-1">📝</div>
                <div>8 texter att bedöma</div>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <div className="text-2xl mb-1">💡</div>
                <div>Tips efter varje svar</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">
                Avsluta
              </Button>
              <Button variant="primary" onClick={() => setPhase('game')} size="lg" className="flex-1">
                Starta
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCorrect = revealed && ((answer === 'ai') === currentItem.isAI);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground font-medium">
            Fråga {currentIndex + 1} av {items.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {scores.filter(Boolean).length} rätt hittills
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
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
        >
          {/* Content card */}
          <motion.div
            animate={
              revealed
                ? isCorrect
                  ? { borderColor: 'hsl(142 72% 45%)', backgroundColor: 'hsl(142 72% 45% / 0.07)' }
                  : { borderColor: 'hsl(0 84% 60%)', backgroundColor: 'hsl(0 84% 60% / 0.07)' }
                : {}
            }
            className="bg-card border border-border rounded-2xl p-5 mb-4 transition-colors duration-500"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <Badge variant="primary">{currentItem.typeLabel}</Badge>
              {revealed && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="shrink-0"
                >
                  {isCorrect
                    ? <CheckCircle2 className="w-6 h-6 text-success" />
                    : <XCircle className="w-6 h-6 text-danger" />
                  }
                </motion.div>
              )}
            </div>

            <p className="text-foreground leading-relaxed text-[15px]">
              {currentItem.content}
            </p>
          </motion.div>

          {/* Answer buttons */}
          {!revealed && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer('ai')}
                className="flex flex-col items-center gap-2 bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/10 rounded-2xl p-5 transition-all duration-200 active:scale-95"
              >
                <Bot className="w-8 h-8 text-primary" />
                <span className="font-bold text-foreground">AI-genererat</span>
                <span className="text-xs text-muted-foreground">Skrivet av en AI</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer('human')}
                className="flex flex-col items-center gap-2 bg-card border-2 border-success/30 hover:border-success hover:bg-success/10 rounded-2xl p-5 transition-all duration-200 active:scale-95"
              >
                <User className="w-8 h-8 text-success" />
                <span className="font-bold text-foreground">Människa</span>
                <span className="text-xs text-muted-foreground">Skrivet av en person</span>
              </motion.button>
            </div>
          )}

          {/* Reveal panel */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-3 mb-4"
              >
                {/* Result banner */}
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${isCorrect ? 'bg-success/15 border border-success/40' : 'bg-danger/15 border border-danger/40'}`}>
                  <span className="text-2xl">{isCorrect ? '🎉' : '😬'}</span>
                  <div>
                    <div className={`font-bold text-sm ${isCorrect ? 'text-success' : 'text-danger'}`}>
                      {isCorrect ? 'Rätt! +10 XP' : 'Tyvärr fel!'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Det här är {currentItem.isAI ? 'AI-genererat' : 'skrivet av en människa'}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">{currentItem.explanation}</p>
                </div>

                {/* Clues */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-xp shrink-0" />
                    <span className="text-xs font-semibold text-xp uppercase tracking-wider">Ledtrådar</span>
                  </div>
                  <ul className="space-y-2">
                    {currentItem.clues.map((clue, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-xp mt-0.5 shrink-0">•</span>
                        {clue}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Next button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentIndex + 1 >= items.length ? 'Se resultat' : 'Nästa'}
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
