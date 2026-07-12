import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, CheckCircle2, XCircle, Lightbulb, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ResultSummary } from '@/components/ResultSummary';
import { DiscussionPrompt } from '@/components/DiscussionPrompt';

/**
 * Generisk lär + quiz-modul (samma flöde som Modul 10):
 * intro → lär-steg → scenarioquiz med samtalsfrågor → resultat med uppdrag.
 */

export interface LearnStep {
  key: string;
  icon: string;
  title: string;
  question: string;
  desc: string;
  checks: string[];
}

export interface QuizQuestion {
  id: string;
  imageEmoji: string;
  imageBg: string;
  scenario: string;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  tip: string;
  discussionPrompt: string;
}

export interface ModuleTheme {
  barBg: string;          // t.ex. 'bg-lime-50'
  barBorder: string;      // t.ex. 'border-lime-100'
  barGradient: string;    // CSS-gradient för progressbaren
  hoverClasses: string;   // hover-klasser för svarsalternativ
  dotActive: string;      // aktiv lär-prick
  dotDone: string;        // passerad lär-prick
  skipText: string;       // "hoppa till frågorna"-länkfärg
  scenarioBorder: string; // vänsterkant på scenariorutan
  eyeColor: string;       // checklist-ikonens färg
}

interface LearnQuizModuleProps {
  moduleId: number;
  moduleName: string;
  icon: string;
  introText: React.ReactNode;
  learnCta: string;
  steps: LearnStep[];
  stepColors: Record<string, { bg: string; text: string }>;
  questions: QuizQuestion[];
  badgeName: string;
  badgeIcon: string;
  badgeThreshold: number;
  xpPerCorrect: number;
  theme: ModuleTheme;
  introAnimation?: 'rotate' | 'pulse' | 'bounce';
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'learn' | 'game' | 'result';

export function LearnQuizModule({
  moduleId,
  moduleName,
  icon,
  introText,
  learnCta,
  steps,
  stepColors,
  questions,
  badgeName,
  badgeIcon,
  badgeThreshold,
  xpPerCorrect,
  theme,
  introAnimation = 'pulse',
  onComplete,
  onExit,
}: LearnQuizModuleProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [learnStep, setLearnStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const current = questions[currentIndex];
  const correctCount = scores.filter(Boolean).length;
  const xpEarned = correctCount * xpPerCorrect;
  const earnedBadge = correctCount >= badgeThreshold ? { name: badgeName, icon: badgeIcon } : null;

  const introAnim =
    introAnimation === 'rotate'
      ? { animate: { rotate: [0, 12, -12, 0] }, transition: { delay: 0.5, duration: 1.2, repeat: Infinity, repeatDelay: 3 } }
      : introAnimation === 'bounce'
      ? { animate: { y: [0, -8, 0] }, transition: { delay: 0.4, duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const } }
      : { animate: { scale: [1, 1.08, 1] }, transition: { delay: 0.4, duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const } };

  function handleAnswer(optId: string) {
    if (revealed) return;
    setSelected(optId);
    setRevealed(true);
    setScores(prev => [...prev, optId === current.correctId]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setPhase('result');
      onComplete(Math.round((correctCount / questions.length) * 100), xpEarned, earnedBadge?.name);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  function handleReplay() {
    setPhase('intro');
    setLearnStep(0);
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setScores([]);
  }

  if (phase === 'result') {
    return (
      <ResultSummary
        moduleName={moduleName}
        moduleId={moduleId}
        score={correctCount}
        totalQuestions={questions.length}
        xpEarned={xpEarned}
        newBadge={earnedBadge}
        onReplay={handleReplay}
        onHome={onExit}
      />
    );
  }

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="w-full max-w-md"
        >
          <div className="clay-card p-8 text-center">
            <motion.div {...introAnim} className="text-7xl mb-4">
              {icon}
            </motion.div>
            <h1 className="text-2xl font-extrabold text-gray-800 mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              {moduleName}
            </h1>
            <p className="text-gray-500 font-semibold mb-5 leading-relaxed text-sm">{introText}</p>

            <div className="grid grid-cols-1 gap-2 mb-5 text-left">
              {steps.map((step, i) => {
                const c = stepColors[step.key];
                return (
                  <div key={step.key} className={`${c.bg} border-2 rounded-2xl p-2.5 flex items-center gap-2.5`}>
                    <span className="text-xl">{step.icon}</span>
                    <div className="flex-1">
                      <span className={`font-extrabold text-xs ${c.text}`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                        Steg {i + 1}: {step.title}
                      </span>
                      <span className="text-xs text-gray-500 font-medium"> – {step.question}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-3 mb-6">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-700 font-bold">
                {questions.length} frågor · {xpPerCorrect} XP per rätt · Märke vid {badgeThreshold}/{questions.length}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">Avsluta</Button>
              <Button variant="primary" onClick={() => setPhase('learn')} size="lg" className="flex-1">
                {learnCta} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <button
              onClick={() => setPhase('game')}
              className={`mt-3 w-full text-xs font-bold transition-colors cursor-pointer ${theme.skipText}`}
            >
              Hoppa direkt till frågorna →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── LEARN ── */
  if (phase === 'learn') {
    const step = steps[learnStep];
    const c = stepColors[step.key];
    const isLast = learnStep === steps.length - 1;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === learnStep ? `w-8 ${theme.dotActive}` : i < learnStep ? `w-2 ${theme.dotDone}` : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={learnStep}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className="clay-card p-7 text-center">
                <div className="text-6xl mb-3">{step.icon}</div>
                <div className="text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">
                  Steg {learnStep + 1} av {steps.length}
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {step.title}
                </h2>
                <div className={`inline-block text-sm font-bold px-3 py-1 rounded-full border-2 mb-5 ${c.bg} ${c.text}`}>
                  {step.question}
                </div>
                <p className="text-gray-500 font-semibold text-sm leading-relaxed mb-5">{step.desc}</p>

                <div className="text-left bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 mb-6 space-y-2.5">
                  <div className="text-xs font-extrabold text-gray-400 uppercase tracking-wide mb-1">Så här gör du:</div>
                  {step.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Eye className={`w-4 h-4 mt-0.5 shrink-0 ${theme.eyeColor}`} />
                      <span className="text-gray-600 font-medium leading-relaxed">{check}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    if (isLast) setPhase('game');
                    else setLearnStep(s => s + 1);
                  }}
                  className="gap-2"
                >
                  {isLast ? (
                    <>Starta quiz <Zap className="w-4 h-4" /></>
                  ) : (
                    <>Nästa: {steps[learnStep + 1].title} <ChevronRight className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ── GAME ── */
  const isCorrect = revealed && selected === current.correctId;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-500">Fråga {currentIndex + 1} av {questions.length}</span>
          <span className="text-sm font-extrabold text-amber-600 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />{xpEarned} XP
          </span>
        </div>
        <div className={`h-3 rounded-full overflow-hidden border-2 ${theme.barBg} ${theme.barBorder}`}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: theme.barGradient }}
            animate={{ width: `${(currentIndex / questions.length) * 100}%` }}
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
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className={`relative w-full rounded-[20px] border-[3px] border-gray-100 bg-gradient-to-br ${current.imageBg} overflow-hidden shadow-[0_6px_0_0_rgba(0,0,0,0.06)]`} style={{ height: 160 }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="text-[5rem] select-none pointer-events-none drop-shadow-lg leading-none"
              >
                {current.imageEmoji}
              </motion.div>
            </div>
          </div>

          <div className={`bg-gray-50 border-l-4 rounded-r-xl px-4 py-3 ${theme.scenarioBorder}`}>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{current.scenario}</p>
          </div>

          <h3 className="font-extrabold text-gray-800 text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {current.question}
          </h3>

          <div className="space-y-2">
            {current.options.map((opt, i) => {
              let cls = 'w-full text-left clay-card p-4 text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-200';
              if (!revealed) {
                cls += ` ${theme.hoverClasses} hover:-translate-y-0.5 active:translate-y-1`;
              } else if (opt.id === current.correctId) {
                cls = 'w-full text-left rounded-[20px] border-[3px] border-emerald-400 bg-emerald-50 shadow-[0_4px_0_0_rgba(16,185,129,0.3)] p-4 text-sm font-bold text-emerald-700';
              } else if (opt.id === selected && opt.id !== current.correctId) {
                cls = 'w-full text-left rounded-[20px] border-[3px] border-rose-400 bg-rose-50 shadow-[0_4px_0_0_rgba(244,63,94,0.3)] p-4 text-sm font-bold text-rose-700';
              } else {
                cls = 'w-full text-left rounded-[20px] border-[3px] border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-400';
              }
              return (
                <motion.button
                  key={opt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={revealed}
                  className={cls}
                  style={{ fontFamily: 'inherit' }}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                      revealed && opt.id === current.correctId ? 'border-emerald-500 bg-emerald-500 text-white' :
                      revealed && opt.id === selected ? 'border-rose-500 bg-rose-500 text-white' :
                      'border-gray-300 text-gray-500'
                    }`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="flex-1 leading-snug">{opt.text}</span>
                    {revealed && opt.id === current.correctId && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    {revealed && opt.id === selected && opt.id !== current.correctId && <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className={`clay-card p-4 flex items-start gap-3 ${isCorrect ? 'border-emerald-300 bg-emerald-50 shadow-[0_5px_0_0_rgba(16,185,129,0.25)]' : 'border-rose-300 bg-rose-50 shadow-[0_5px_0_0_rgba(244,63,94,0.25)]'}`}>
                  <span className="text-2xl shrink-0">{isCorrect ? '🎉' : '🤔'}</span>
                  <div>
                    <div className={`font-extrabold text-sm ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {isCorrect ? `Rätt svar! +${xpPerCorrect} XP` : 'Inte riktigt!'}
                    </div>
                    <p className="text-xs mt-1 leading-relaxed font-medium text-gray-600">{current.explanation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-bold leading-relaxed">{current.tip}</p>
                </div>
                <DiscussionPrompt text={current.discussionPrompt} />
                <Button variant="primary" size="lg" fullWidth onClick={handleNext} className="gap-2">
                  {currentIndex + 1 >= questions.length ? 'Se resultat' : 'Nästa fråga'}
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
