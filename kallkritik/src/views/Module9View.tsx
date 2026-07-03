import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, CheckCircle2, XCircle, Lightbulb, Brain } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ResultSummary } from '@/components/ResultSummary';
import { DiscussionPrompt } from '@/components/DiscussionPrompt';
import { MODULE9_QUESTIONS, CATEGORY_CONFIG, AI_FACTS } from '@/data/module9Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'game' | 'result';

export function Module9View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const questions = MODULE9_QUESTIONS;
  const current = questions[currentIndex];
  const correctCount = scores.filter(Boolean).length;
  const xpEarned = correctCount * 15;
  const earnedBadge = correctCount >= 5 ? { name: 'AI-Eleven', icon: '🤖' } : null;

  function handleAnswer(optId: string) {
    if (revealed) return;
    setSelected(optId);
    setRevealed(true);
    setScores(prev => [...prev, optId === current.correctId]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setPhase('result');
      onComplete(correctCount, xpEarned, earnedBadge?.name);
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
        moduleName="AI som källa – i skolan"
        moduleId={9}
        score={correctCount}
        totalQuestions={questions.length}
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
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="w-full max-w-md"
        >
          <div className="clay-card p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ delay: 0.4, duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-4"
            >
              🤖
            </motion.div>
            <h1 className="text-2xl font-extrabold text-gray-800 mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              AI som källa – i skolan
            </h1>
            <p className="text-gray-500 font-semibold mb-5 leading-relaxed text-sm">
              Alla pratar om AI. Men vet du hur man använder det <em>rätt</em> i skolan?
              Det finns smarta sätt att använda AI – och sätt som är direkt fusk.
            </p>

            {/* AI facts */}
            <div className="text-left space-y-2 mb-5">
              {AI_FACTS.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2 bg-teal-50 border-2 border-teal-100 rounded-2xl px-3 py-2"
                >
                  <span className="text-base shrink-0">{fact.icon}</span>
                  <p className="text-xs text-teal-700 font-semibold leading-relaxed">{fact.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-3 mb-6">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-700 font-bold">7 scenarion · 15 XP per rätt · Märke vid 5/7</p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">Avsluta</Button>
              <Button variant="primary" onClick={() => setPhase('game')} size="lg" className="flex-1">
                Starta <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCorrect = revealed && selected === current.correctId;
  const catCfg = CATEGORY_CONFIG[current.category];

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-500">Scenario {currentIndex + 1} av {questions.length}</span>
          <span className="text-sm font-extrabold text-amber-600 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />{xpEarned} XP
          </span>
        </div>
        <div className="h-3 bg-teal-50 rounded-full overflow-hidden border-2 border-teal-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #14b8a6, #06b6d4)' }}
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
          {/* Category tag */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-bold ${catCfg.color}`}>
            <span>{catCfg.icon}</span>
            <span>{catCfg.label}</span>
          </div>

          {/* Situation card */}
          <div className="clay-card overflow-hidden p-0">
            <div className="bg-teal-50 border-b-2 border-teal-100 px-4 py-2.5 flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-teal-700">Situation</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600 font-medium leading-relaxed">{current.situation}</p>
              <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-3">
                <div className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wide mb-1">Eleven gör så här:</div>
                <p className="text-sm text-indigo-800 font-semibold leading-relaxed">{current.studentAction}</p>
              </div>
            </div>
          </div>

          {/* Question */}
          <h3 className="font-extrabold text-gray-800 text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {current.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {current.options.map((opt, i) => {
              let cls = 'w-full text-left clay-card p-4 text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-200';
              if (!revealed) {
                cls += ' hover:border-teal-300 hover:shadow-[0_8px_0_0_rgba(20,184,166,0.25)] hover:-translate-y-0.5 active:translate-y-1';
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

          {/* Reveal */}
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
                      {isCorrect ? 'Rätt! +15 XP' : 'Inte riktigt!'}
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
                  {currentIndex + 1 >= questions.length ? 'Se resultat' : 'Nästa scenario'}
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
