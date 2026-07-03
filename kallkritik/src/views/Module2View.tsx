import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, ChevronRight, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultSummary } from '@/components/ResultSummary';
import { DiscussionPrompt } from '@/components/DiscussionPrompt';
import { MODULE2_TEXTS } from '@/data/module2Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'game' | 'result';

interface SegmentState {
  selected: boolean;
}

export default function Module2View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [textIndex, setTextIndex] = useState(0);
  const [segmentStates, setSegmentStates] = useState<SegmentState[]>([]);
  const [checked, setChecked] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  const [hintShown, setHintShown] = useState(false);

  const texts = MODULE2_TEXTS;
  const currentText = texts[textIndex];

  const allErrors = texts.reduce((acc, t) => acc + t.segments.filter(s => s.isError).length, 0);

  function initSegments() {
    return currentText.segments.map(() => ({ selected: false }));
  }

  function handleStart() {
    setSegmentStates(initSegments());
    setPhase('game');
  }

  function toggleSegment(idx: number) {
    if (checked) return;
    if (!currentText.segments[idx].isError) return;
    setSegmentStates(prev =>
      prev.map((s, i) => (i === idx ? { selected: !s.selected } : s))
    );
  }

  function handleCheck() {
    let foundCount = 0;
    currentText.segments.forEach((seg, i) => {
      if (seg.isError && segmentStates[i]?.selected) foundCount++;
    });
    setTotalFound(prev => prev + foundCount);
    setChecked(true);
  }

  function handleNext() {
    if (textIndex + 1 >= texts.length) {
      const finalXP = totalFound * 15;
      const badge = allErrors > 0 && totalFound / allErrors >= 0.8
        ? { name: 'Faktakollaren', icon: '🔍' }
        : null;
      onComplete(totalFound, finalXP, badge?.name);
      setPhase('result');
    } else {
      setTextIndex(i => i + 1);
      setChecked(false);
      setHintShown(false);
      setSegmentStates(texts[textIndex + 1].segments.map(() => ({ selected: false })));
    }
  }

  function handleReplay() {
    setPhase('intro');
    setTextIndex(0);
    setChecked(false);
    setHintShown(false);
    setSegmentStates([]);
    setTotalFound(0);
  }

  if (phase === 'result') {
    const badge = allErrors > 0 && totalFound / allErrors >= 0.8
      ? { name: 'Faktakollaren', icon: '🔍' }
      : null;
    return (
      <ResultSummary
        moduleName="Hitta felet"
        moduleId={2}
        score={totalFound}
        totalQuestions={allErrors}
        xpEarned={totalFound * 15}
        newBadge={badge}
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
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="text-7xl mb-4"
            >
              🔍
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Hitta felet</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              AI-genererade texter kan innehålla{' '}
              <span className="text-danger font-semibold">faktafel</span>.
              Tryck på de ord eller fraser du tror är felaktiga, och vi kollar om du har rätt!
            </p>
            <div className="flex items-center justify-center gap-3 bg-xp/10 rounded-xl px-4 py-3 mb-6">
              <Zap className="w-5 h-5 text-xp shrink-0" />
              <p className="text-sm text-xp font-medium">15 XP per hittat fel · 3 texter</p>
            </div>
            <div className="bg-muted rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm font-semibold text-accent">Så här spelar du</span>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-xp mt-0.5 shrink-0">1.</span>
                  Läs texten noga
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xp mt-0.5 shrink-0">2.</span>
                  Tryck på markerade ord som du tror är fel
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xp mt-0.5 shrink-0">3.</span>
                  Tryck "Kontrollera" när du är klar
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">
                Avsluta
              </Button>
              <Button variant="primary" onClick={handleStart} size="lg" className="flex-1">
                Starta
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const errorSegments = currentText.segments.filter(s => s.isError);
  const foundInCurrent = currentText.segments.reduce((acc, seg, i) => {
    if (seg.isError && segmentStates[i]?.selected) return acc + 1;
    return acc;
  }, 0);

  const revealedErrors = currentText.segments
    .map((seg, i) => ({ seg, i }))
    .filter(({ seg }) => seg.isError);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground font-medium">
            Text {textIndex + 1} av {texts.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {totalFound} fel hittade totalt
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(textIndex / texts.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={textIndex}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Text card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="warning">{currentText.topic}</Badge>
              <h2 className="font-semibold text-foreground text-sm flex-1 truncate">
                {currentText.title}
              </h2>
            </div>

            {/* Instruction hint */}
            {!checked && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 font-semibold">
                  Tryck på{' '}
                  <span className="underline decoration-amber-500 decoration-2">markerade ord</span>{' '}
                  du tror är fel
                </p>
              </div>
            )}

            {/* Hint button + panel */}
            {!checked && (
              <div className="mb-3">
                {!hintShown ? (
                  <button
                    onClick={() => setHintShown(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-700 cursor-pointer transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Visa ledtråd
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-50 border-2 border-indigo-100 rounded-xl px-3 py-2 text-xs text-indigo-700 font-semibold"
                  >
                    <span className="font-extrabold">Ledtråd:</span>{' '}
                    {currentText.hint ?? `Det finns ${currentText.segments.filter(s => s.isError).length} fel i texten. Leta efter felaktiga fakta om ${currentText.topic.toLowerCase()}.`}
                  </motion.div>
                )}
              </div>
            )}

            {/* Rendered text with interactive error spans */}
            <p className="text-foreground leading-loose text-[15px]">
              {currentText.segments.map((seg, i) => {
                if (!seg.isError) {
                  return <span key={i}>{seg.text}</span>;
                }

                const isSelected = segmentStates[i]?.selected ?? false;

                let className = 'error-highlight';
                if (checked) {
                  className += ' revealed-correct';
                  if (isSelected) className += ' selected';
                } else if (isSelected) {
                  className += ' selected';
                }

                return (
                  <span
                    key={i}
                    className={className}
                    onClick={() => toggleSegment(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') toggleSegment(i);
                    }}
                  >
                    {seg.text}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Selected count before check */}
          {!checked && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Du har markerat{' '}
                <span className="text-primary font-semibold">
                  {segmentStates.filter((s, i) => s.selected && currentText.segments[i]?.isError).length}
                </span>{' '}
                fel
              </span>
              <Button variant="primary" size="md" onClick={handleCheck}>
                Kontrollera mina svar
              </Button>
            </div>
          )}

          {/* Reveal panel after check */}
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-3 mb-4"
              >
                {/* Score for this text */}
                <div
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                    foundInCurrent === errorSegments.length
                      ? 'bg-success/15 border border-success/40'
                      : foundInCurrent > 0
                      ? 'bg-xp/15 border border-xp/40'
                      : 'bg-danger/15 border border-danger/40'
                  }`}
                >
                  <span className="text-2xl">
                    {foundInCurrent === errorSegments.length ? '🎉' : foundInCurrent > 0 ? '🤔' : '😬'}
                  </span>
                  <div>
                    <div
                      className={`font-bold text-sm ${
                        foundInCurrent === errorSegments.length
                          ? 'text-success'
                          : foundInCurrent > 0
                          ? 'text-xp'
                          : 'text-danger'
                      }`}
                    >
                      Du hittade {foundInCurrent} av {errorSegments.length} fel
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +{foundInCurrent * 15} XP tjänat
                    </div>
                  </div>
                </div>

                {/* Error explanations */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <span className="text-sm font-semibold text-foreground">Förklaringar</span>
                  {revealedErrors.map(({ seg, i }, idx) => {
                    const wasFound = segmentStates[i]?.selected;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-start gap-3 rounded-lg p-3 ${
                          wasFound
                            ? 'bg-success/10 border border-success/30'
                            : 'bg-danger/10 border border-danger/30'
                        }`}
                      >
                        {wasFound
                          ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          : <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                        }
                        <div>
                          <div
                            className={`text-xs font-semibold mb-0.5 ${wasFound ? 'text-success' : 'text-danger'}`}
                          >
                            "{seg.text}"
                          </div>
                          <div className="text-xs text-muted-foreground">{seg.errorExplanation}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <DiscussionPrompt text={currentText.discussionPrompt} />

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                  className="gap-2"
                >
                  {textIndex + 1 >= texts.length ? 'Se resultat' : 'Nästa text'}
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
