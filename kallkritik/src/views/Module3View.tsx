import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Calendar,
  User,
  Phone,
  BookOpen,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultSummary } from '@/components/ResultSummary';
import { DiscussionPrompt } from '@/components/DiscussionPrompt';
import { MODULE3_SOURCES } from '@/data/module3Data';
import { TrustLevel } from '@/types';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'game' | 'result';

const TRUST_OPTIONS: { value: TrustLevel; label: string; emoji: string; colorClass: string; borderClass: string; bgClass: string }[] = [
  {
    value: 'green',
    label: 'Trovärdig',
    emoji: '🟢',
    colorClass: 'text-success',
    borderClass: 'border-success/40 hover:border-success',
    bgClass: 'hover:bg-success/10',
  },
  {
    value: 'yellow',
    label: 'Osäker',
    emoji: '🟡',
    colorClass: 'text-xp',
    borderClass: 'border-xp/40 hover:border-xp',
    bgClass: 'hover:bg-xp/10',
  },
  {
    value: 'red',
    label: 'Opålitlig',
    emoji: '🔴',
    colorClass: 'text-danger',
    borderClass: 'border-danger/40 hover:border-danger',
    bgClass: 'hover:bg-danger/10',
  },
];

function trustColor(level: TrustLevel) {
  if (level === 'green') return 'text-success';
  if (level === 'yellow') return 'text-xp';
  return 'text-danger';
}

function trustBg(level: TrustLevel) {
  if (level === 'green') return 'bg-success/15 border-success/40';
  if (level === 'yellow') return 'bg-xp/15 border-xp/40';
  return 'bg-danger/15 border-danger/40';
}

function trustLabel(level: TrustLevel) {
  if (level === 'green') return 'Trovärdig 🟢';
  if (level === 'yellow') return 'Osäker 🟡';
  return 'Opålitlig 🔴';
}

export default function Module3View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<TrustLevel | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const sources = MODULE3_SOURCES;
  const currentSource = sources[currentIndex];
  const totalQuestions = sources.length;

  const correctScore = scores.filter(Boolean).length;
  const xpEarned = correctScore * 20;
  const earnedBadge = correctScore >= 4 ? { name: 'Källmästaren', icon: '⚖️' } : null;

  function handleAnswer(choice: TrustLevel) {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    const isCorrect = choice === currentSource.correctTrust;
    setScores(prev => [...prev, isCorrect]);
  }

  function handleNext() {
    if (currentIndex + 1 >= sources.length) {
      setPhase('result');
      onComplete(correctScore, xpEarned, earnedBadge?.name);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  function handleReplay() {
    setPhase('intro');
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setScores([]);
  }

  if (phase === 'result') {
    return (
      <ResultSummary
        moduleName="Är källan trovärdig?"
        moduleId={3}
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
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-7xl mb-4"
            >
              ⚖️
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Är källan trovärdig?</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Du bedömer 6 olika källor och avgör om de är{' '}
              <span className="text-success font-semibold">trovärdig</span>,{' '}
              <span className="text-xp font-semibold">osäker</span> eller{' '}
              <span className="text-danger font-semibold">opålitlig</span>.
            </p>

            <div className="flex items-center justify-center gap-3 bg-xp/10 rounded-xl px-4 py-3 mb-5">
              <Zap className="w-5 h-5 text-xp shrink-0" />
              <p className="text-sm text-xp font-medium">20 XP per rätt bedömning · 6 källor</p>
            </div>

            {/* Traffic light legend */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
              <div className="bg-success/10 border border-success/30 rounded-xl p-3">
                <div className="text-lg mb-1">🟢</div>
                <div className="font-semibold text-success">Trovärdig</div>
                <div className="text-muted-foreground mt-0.5">Känd avsändare, källor, datum</div>
              </div>
              <div className="bg-xp/10 border border-xp/30 rounded-xl p-3">
                <div className="text-lg mb-1">🟡</div>
                <div className="font-semibold text-xp">Osäker</div>
                <div className="text-muted-foreground mt-0.5">Vissa brister, kolla mer</div>
              </div>
              <div className="bg-danger/10 border border-danger/30 rounded-xl p-3">
                <div className="text-lg mb-1">🔴</div>
                <div className="font-semibold text-danger">Opålitlig</div>
                <div className="text-muted-foreground mt-0.5">Anonym, vinklad, inga källor</div>
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

  const isCorrect = revealed && selected === currentSource.correctTrust;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground font-medium">
            Källa {currentIndex + 1} av {sources.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {correctScore} rätt hittills
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            animate={{ width: `${(currentIndex / sources.length) * 100}%` }}
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
          {/* Source preview card */}
          <motion.div
            animate={
              revealed
                ? isCorrect
                  ? { borderColor: 'hsl(142 72% 45%)', backgroundColor: 'hsl(142 72% 45% / 0.06)' }
                  : { borderColor: 'hsl(0 84% 60%)', backgroundColor: 'hsl(0 84% 60% / 0.06)' }
                : {}
            }
            className="bg-card border border-border rounded-2xl overflow-hidden mb-4 transition-colors duration-500"
          >
            {/* Platform header bar */}
            <div className="bg-muted/60 border-b border-border px-4 py-2.5 flex items-center gap-2">
              <span className="text-xl">{currentSource.platformIcon}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {currentSource.platform}
              </span>
              {revealed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="ml-auto"
                >
                  {isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-success" />
                    : <XCircle className="w-5 h-5 text-danger" />
                  }
                </motion.div>
              )}
            </div>

            {/* Source body */}
            <div className="p-4">
              <h2 className="font-bold text-foreground text-base leading-snug mb-3">
                {currentSource.title}
              </h2>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{currentSource.author}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{currentSource.date ?? 'Inget datum'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone className={`w-3.5 h-3.5 shrink-0 ${currentSource.hasContactInfo ? 'text-success' : 'text-danger'}`} />
                  <span className={currentSource.hasContactInfo ? 'text-success' : 'text-danger'}>
                    {currentSource.hasContactInfo ? 'Kontaktuppgifter finns' : 'Inga kontaktuppgifter'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BookOpen className={`w-3.5 h-3.5 shrink-0 ${currentSource.hasSources ? 'text-success' : 'text-danger'}`} />
                  <span className={currentSource.hasSources ? 'text-success' : 'text-danger'}>
                    {currentSource.hasSources ? 'Källhänvisningar' : 'Inga källor'}
                  </span>
                </div>
              </div>

              {/* Purpose */}
              <div className="flex items-start gap-2 bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground">
                <Target className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><span className="font-medium text-foreground">Syfte:</span> {currentSource.purpose}</span>
              </div>

              {/* Bias indicator */}
              {currentSource.hasBias && (
                <div className="flex items-start gap-2 bg-xp/10 rounded-lg px-3 py-2 mt-2 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-xp shrink-0 mt-0.5" />
                  <span className="text-xp">{currentSource.biasDescription}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Answer buttons */}
          {!revealed && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {TRUST_OPTIONS.map(opt => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAnswer(opt.value)}
                  className={`flex flex-col items-center gap-1.5 bg-card border-2 ${opt.borderClass} ${opt.bgClass} rounded-2xl py-4 px-2 transition-all duration-200 active:scale-95`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className={`font-bold text-sm ${opt.colorClass}`}>{opt.label}</span>
                </motion.button>
              ))}
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
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${trustBg(currentSource.correctTrust)}`}>
                  <span className="text-2xl">{isCorrect ? '🎉' : '🤔'}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${isCorrect ? 'text-success' : 'text-danger'}`}>
                      {isCorrect ? `Rätt! +20 XP` : 'Inte riktigt!'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rätt svar: <span className={`font-semibold ${trustColor(currentSource.correctTrust)}`}>
                        {trustLabel(currentSource.correctTrust)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">{currentSource.explanation}</p>
                </div>

                {/* Criteria checklist */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Kriteriechecklista</span>
                  </div>
                  <ul className="space-y-2">
                    {currentSource.criteria.map((criterion, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`flex items-start gap-3 rounded-lg p-2.5 ${
                          criterion.met
                            ? 'bg-success/8 border border-success/20'
                            : 'bg-danger/8 border border-danger/20'
                        }`}
                      >
                        {criterion.met
                          ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          : <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                        }
                        <div className="min-w-0">
                          <div className={`text-xs font-semibold ${criterion.met ? 'text-success' : 'text-danger'}`}>
                            {criterion.label}
                          </div>
                          <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                            {criterion.description}
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <DiscussionPrompt text={currentSource.discussionPrompt} />

                {/* Next button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentIndex + 1 >= sources.length ? 'Se resultat' : 'Nästa källa'}
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
