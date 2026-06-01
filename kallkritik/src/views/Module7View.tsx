import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, CheckCircle2, XCircle, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ResultSummary } from '@/components/ResultSummary';
import { MODULE7_QUESTIONS, FOUR_QUESTIONS } from '@/data/module7Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'learn' | 'game' | 'result';

const criterionConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  äkthet:    { icon: '🪪', label: 'Äkthet',     color: 'text-violet-700', bg: 'bg-violet-100 border-violet-300' },
  aktualitet:{ icon: '🗓️', label: 'Aktualitet', color: 'text-sky-700',    bg: 'bg-sky-100 border-sky-300' },
  oberoende: { icon: '🔗', label: 'Oberoende',  color: 'text-emerald-700',bg: 'bg-emerald-100 border-emerald-300' },
  tendens:   { icon: '🎯', label: 'Tendens',    color: 'text-amber-700',  bg: 'bg-amber-100 border-amber-300' },
};

export function Module7View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [learnStep, setLearnStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const questions = MODULE7_QUESTIONS;
  const current = questions[currentIndex];
  const correctCount = scores.filter(Boolean).length;
  const xpEarned = correctCount * 15;
  const earnedBadge = correctCount >= 5 ? { name: 'Källkritikern', icon: '📚' } : null;

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
    setLearnStep(0);
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setScores([]);
  }

  if (phase === 'result') {
    return (
      <ResultSummary
        moduleName="Källkritik – Grunderna"
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
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ delay: 0.4, duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-4"
            >
              📚
            </motion.div>
            <h1 className="text-2xl font-extrabold text-gray-800 mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Källkritik – Grunderna
            </h1>
            <p className="text-gray-500 font-semibold mb-5 leading-relaxed text-sm">
              I en tid av AI, deepfakes och desinformation är källkritik en superviktig färdighet.
              Lär dig de <span className="text-indigo-600 font-bold">4 grundfrågorna</span> och öva med riktiga scenarion.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-5 text-left">
              {FOUR_QUESTIONS.map(q => (
                <div key={q.key} className={`${q.color} border-2 rounded-2xl p-3 flex items-start gap-2`}>
                  <span className="text-lg">{q.icon}</span>
                  <div>
                    <div className="font-extrabold text-xs" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{q.title}</div>
                    <div className="text-xs opacity-80 font-medium mt-0.5">{q.question}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-3 mb-6">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-700 font-bold">6 frågor · 15 XP per rätt · Märke vid 5/6</p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">Avsluta</Button>
              <Button variant="primary" onClick={() => setPhase('learn')} size="lg" className="flex-1">
                Lär dig mer
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <button
              onClick={() => setPhase('game')}
              className="mt-3 w-full text-xs font-bold text-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
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
    const step = FOUR_QUESTIONS[learnStep];
    const isLast = learnStep === FOUR_QUESTIONS.length - 1;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {FOUR_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === learnStep ? 'w-8 bg-indigo-500' : i < learnStep ? 'w-2 bg-indigo-300' : 'w-2 bg-gray-200'
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
                <div className="text-5xl mb-3">{step.icon}</div>
                <div className="inline-block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">
                  Grundfråga {learnStep + 1} av 4
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {step.title}
                </h2>
                <div className={`inline-block text-sm font-bold px-3 py-1 rounded-full border-2 mb-5 ${step.color}`}>
                  {step.question}
                </div>
                <p className="text-gray-500 font-semibold text-sm leading-relaxed mb-6">{step.desc}</p>

                {/* Concrete examples */}
                <div className="text-left bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 mb-6 space-y-2">
                  {learnStep === 0 && <>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Känd journalist på SVT med namn och kontakt</span></div>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Myndighet med organisationsnummer och ansvarig utgivare</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Anonym blogg utan "om oss"-sida</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Sociala medie-konto utan profil eller historik</span></div>
                  </>}
                  {learnStep === 1 && <>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Artikel publicerad förra veckan om en pågående händelse</span></div>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Studie från 2024 om ett medicinskt ämne</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Artikel från 2008 om smartphones (teknologi förändras snabbt)</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Statistik utan angivet publiceringsår</span></div>
                  </>}
                  {learnStep === 2 && <>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Tre olika nyhetsredaktioner rapporterar samma sak</span></div>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Forskning publicerad i granskad vetenskaplig tidskrift</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Läkemedelsföretag skriver om sin egna produkt</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">En artikel som refererar till en annan artikel på samma sajt</span></div>
                  </>}
                  {learnStep === 3 && <>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Nyhetsartikel som redovisar både för- och nackdelar</span></div>
                    <div className="flex items-start gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Vetenskaplig rapport med tydlig metodbeskrivning</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Rubrik som väcker starka känslor ("AVSLÖJAT!", "CHOCK!")</span></div>
                    <div className="flex items-start gap-2 text-xs"><XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /><span className="text-gray-600 font-medium">Reklam som presenteras som objektiv information</span></div>
                  </>}
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
                    <>Nästa: {FOUR_QUESTIONS[learnStep + 1].title} <ChevronRight className="w-4 h-4" /></>
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
  const crit = criterionConfig[current.criterion];

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-500">
            Fråga {currentIndex + 1} av {questions.length}
          </span>
          <span className="text-sm font-extrabold text-amber-600 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />{xpEarned} XP
          </span>
        </div>
        <div className="h-3 bg-indigo-50 rounded-full overflow-hidden border-2 border-indigo-100">
          <motion.div
            className="h-full xp-bar-fill rounded-full"
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
          {/* Criterion tag */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-bold ${crit.bg} ${crit.color}`}>
            <span>{crit.icon}</span>
            <span>{crit.label}</span>
          </div>

          {/* Source card */}
          <div className="clay-card overflow-hidden p-0">
            <div className="bg-gray-50 border-b-2 border-gray-100 px-4 py-2.5 flex items-center gap-2">
              <span className="text-lg">{current.sourceIcon}</span>
              <div>
                <div className="text-xs font-bold text-gray-700">{current.source}</div>
                <div className="text-[10px] text-gray-400 font-semibold">{current.sourceType}</div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{current.scenario}</p>
            </div>
          </div>

          {/* Question */}
          <h3 className="font-extrabold text-gray-800 text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {current.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {current.options.map((opt, i) => {
              let className = 'w-full text-left clay-card p-4 text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-200';
              if (!revealed) {
                className += ' hover:border-indigo-300 hover:shadow-[0_8px_0_0_rgba(99,102,241,0.3)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(99,102,241,0.2)]';
              } else if (opt.id === current.correctId) {
                className = 'w-full text-left rounded-[20px] border-[3px] border-emerald-400 bg-emerald-50 shadow-[0_4px_0_0_rgba(16,185,129,0.3)] p-4 text-sm font-bold text-emerald-700';
              } else if (opt.id === selected && opt.id !== current.correctId) {
                className = 'w-full text-left rounded-[20px] border-[3px] border-rose-400 bg-rose-50 shadow-[0_4px_0_0_rgba(244,63,94,0.3)] p-4 text-sm font-bold text-rose-700';
              } else {
                className = 'w-full text-left rounded-[20px] border-[3px] border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-400';
              }

              return (
                <motion.button
                  key={opt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={revealed}
                  className={className}
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

          {/* Reveal panel */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Result banner */}
                <div className={`clay-card p-4 flex items-start gap-3 ${isCorrect ? 'border-emerald-300 bg-emerald-50 shadow-[0_5px_0_0_rgba(16,185,129,0.25)]' : 'border-rose-300 bg-rose-50 shadow-[0_5px_0_0_rgba(244,63,94,0.25)]'}`}>
                  <span className="text-2xl shrink-0">{isCorrect ? '🎉' : '🤔'}</span>
                  <div>
                    <div className={`font-extrabold text-sm ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {isCorrect ? `Rätt svar! +15 XP` : 'Inte riktigt!'}
                    </div>
                    <p className="text-xs mt-1 leading-relaxed font-medium text-gray-600">{current.explanation}</p>
                  </div>
                </div>

                {/* Tip */}
                <div className="flex items-start gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-bold leading-relaxed">{current.tip}</p>
                </div>

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
