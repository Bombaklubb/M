import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultSummary } from '@/components/ResultSummary';
import { MODULE4_IMAGES } from '@/data/module4Data';
import { FakeImageHotspot } from '@/types';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'game' | 'result';

export function Module4View({ onComplete, onExit }: ModuleViewProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedHotspots, setSelectedHotspots] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const [totalArtifacts, setTotalArtifacts] = useState(0);

  const items = MODULE4_IMAGES;
  const currentItem = items[currentIndex];

  const allArtifacts = items.flatMap(item => item.hotspots.filter(h => h.isArtifact));
  const earnedBadge =
    totalArtifacts > 0 && totalFound / totalArtifacts >= 0.75
      ? { name: 'Bilddetektiven', icon: '🖼️' }
      : null;

  function toggleHotspot(id: number) {
    if (revealed) return;
    setSelectedHotspots(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCheck() {
    setRevealed(true);
    const artifacts = currentItem.hotspots.filter(h => h.isArtifact);
    const found = artifacts.filter(h => selectedHotspots.has(h.id)).length;
    setTotalFound(f => f + found);
    setTotalArtifacts(t => t + artifacts.length);
    setTotalScore(s => s + found * 15);
  }

  function handleNext() {
    if (currentIndex + 1 >= items.length) {
      const finalXP = totalScore;
      const finalFound = totalFound;
      const finalArtifacts = totalArtifacts;
      const badge =
        finalArtifacts > 0 && finalFound / finalArtifacts >= 0.75
          ? { name: 'Bilddetektiven', icon: '🖼️' }
          : null;
      onComplete(
        Math.round((finalFound / Math.max(finalArtifacts, 1)) * 100),
        finalXP,
        badge?.name,
      );
      setPhase('result');
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedHotspots(new Set());
      setRevealed(false);
    }
  }

  function handleReplay() {
    setPhase('intro');
    setCurrentIndex(0);
    setSelectedHotspots(new Set());
    setRevealed(false);
    setTotalScore(0);
    setTotalFound(0);
    setTotalArtifacts(0);
  }

  if (phase === 'result') {
    const percent = Math.round((totalFound / Math.max(allArtifacts.length, 1)) * 100);
    return (
      <ResultSummary
        moduleName="Fakebilder & Deepfakes"
        score={totalFound}
        totalQuestions={allArtifacts.length}
        xpEarned={totalScore}
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
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-7xl mb-4"
            >
              🖼️
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Fakebilder & Deepfakes</h1>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
              AI kan skapa bilder som ser äkta ut — men ofta göms{' '}
              <span className="text-danger font-semibold">konstiga detaljer</span> i bilden.
              Felaktiga händer, falsk text, onaturliga skuggor…
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4 text-left">
              <div className="font-semibold text-primary text-sm mb-2">🎯 Hur du spelar</div>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Du ser en AI-genererad bild med numrerade hotspots</li>
                <li>• Klicka på de hotspots som du tror är AI-artifakter</li>
                <li>• Tryck "Kontrollera" för att se om du hade rätt</li>
                <li>• <span className="text-xp font-medium">+15 XP</span> per korrekt identifierad artifakt</li>
              </ul>
            </div>
            <div className="flex items-center justify-center gap-3 bg-xp/10 rounded-xl px-4 py-3 mb-6">
              <Zap className="w-5 h-5 text-xp shrink-0" />
              <p className="text-sm text-xp font-medium">4 bilder · Max 60 XP · Märke vid 75% rätt</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onExit} size="lg" className="flex-1">
                Avsluta
              </Button>
              <Button variant="primary" onClick={() => setPhase('game')} size="lg" className="flex-1">
                Starta 🔍
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const artifactsInCurrent = currentItem.hotspots.filter(h => h.isArtifact);
  const correctlyFound = artifactsInCurrent.filter(h => selectedHotspots.has(h.id)).length;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground font-medium">
            Bild {currentIndex + 1} av {items.length}
          </span>
          <span className="text-sm text-xp font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            {totalScore} XP
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full"
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
          {/* Title + context */}
          <div className="mb-3">
            <h2 className="font-bold text-foreground text-lg">{currentItem.title}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{currentItem.description}</p>
          </div>

          {/* Context quote */}
          <div className="bg-muted border-l-4 border-danger rounded-r-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-danger uppercase tracking-wider">Spriddes med texten</span>
            </div>
            <p className="text-sm text-foreground italic">"{currentItem.context}"</p>
          </div>

          {/* Image area with hotspots */}
          <div className="mb-4">
            <div
              className={`relative w-full rounded-2xl bg-gradient-to-br ${currentItem.bgGradient} overflow-hidden border border-border`}
              style={{ height: 300 }}
            >
              {/* Central emoji */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-8xl select-none pointer-events-none"
                >
                  {currentItem.emoji}
                </motion.div>
              </div>

              {/* AI image label */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1">
                <span className="text-xs text-white/80 font-medium">🤖 AI-genererad bild</span>
              </div>

              {/* Hotspot buttons */}
              {currentItem.hotspots.map((hotspot, idx) => {
                const isSelected = selectedHotspots.has(hotspot.id);
                let colorClass = 'border-white/70 bg-black/50 text-white hover:border-white hover:bg-white/20';
                if (revealed) {
                  if (hotspot.isArtifact && isSelected) colorClass = 'border-success bg-success/80 text-white';
                  else if (hotspot.isArtifact && !isSelected) colorClass = 'border-danger bg-danger/80 text-white animate-pulse';
                  else if (!hotspot.isArtifact && isSelected) colorClass = 'border-xp bg-xp/80 text-black';
                  else colorClass = 'border-white/40 bg-black/30 text-white/60';
                } else if (isSelected) {
                  colorClass = 'border-primary bg-primary/70 text-white scale-110';
                }

                return (
                  <motion.button
                    key={hotspot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.07, type: 'spring', stiffness: 400 }}
                    onClick={() => toggleHotspot(hotspot.id)}
                    disabled={revealed}
                    style={{
                      position: 'absolute',
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`w-9 h-9 rounded-full border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center shadow-lg ${colorClass}`}
                  >
                    {hotspot.id}
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            {!revealed && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Klicka på hotspots du tror är AI-artifakter</span>
                <span className="text-primary font-medium">
                  {selectedHotspots.size} valda
                </span>
              </div>
            )}
          </div>

          {/* Check / reveal button */}
          {!revealed && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCheck}
              className="gap-2 mb-4"
            >
              <Eye className="w-5 h-5" />
              Kontrollera mina val
            </Button>
          )}

          {/* Revealed: hotspot explanations */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                {/* Score banner */}
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${correctlyFound === artifactsInCurrent.length ? 'bg-success/15 border border-success/40' : 'bg-primary/10 border border-primary/30'}`}>
                  <span className="text-2xl">{correctlyFound === artifactsInCurrent.length ? '🎉' : '🔍'}</span>
                  <div>
                    <div className={`font-bold text-sm ${correctlyFound === artifactsInCurrent.length ? 'text-success' : 'text-primary'}`}>
                      Du hittade {correctlyFound} av {artifactsInCurrent.length} artifakter!
                    </div>
                    <div className="text-xs text-muted-foreground">+{correctlyFound * 15} XP intjänat</div>
                  </div>
                </div>

                {/* Hotspot list */}
                <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                  {currentItem.hotspots.map((hotspot, idx) => {
                    const isSelected = selectedHotspots.has(hotspot.id);
                    const isCorrectPick = hotspot.isArtifact && isSelected;
                    const isMissed = hotspot.isArtifact && !isSelected;
                    const isFalseAlarm = !hotspot.isArtifact && isSelected;

                    return (
                      <motion.div
                        key={hotspot.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="flex items-start gap-3 p-3"
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isCorrectPick ? 'bg-success/20 text-success' :
                          isMissed ? 'bg-danger/20 text-danger' :
                          isFalseAlarm ? 'bg-xp/20 text-xp' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {hotspot.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm text-foreground">{hotspot.label}</span>
                            {hotspot.isArtifact && (
                              <Badge variant={isSelected ? 'success' : 'danger'} className="text-[10px] py-0">
                                {isSelected ? '✓ Korrekt' : '✗ Missad'}
                              </Badge>
                            )}
                            {!hotspot.isArtifact && isSelected && (
                              <Badge variant="warning" className="text-[10px] py-0">⚠ Inte artifakt</Badge>
                            )}
                            {!hotspot.isArtifact && !isSelected && (
                              <Badge variant="muted" className="text-[10px] py-0">Normal</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{hotspot.description}</p>
                        </div>
                        <div className="shrink-0">
                          {isCorrectPick && <CheckCircle2 className="w-4 h-4 text-success" />}
                          {isMissed && <XCircle className="w-4 h-4 text-danger" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentIndex + 1 >= items.length ? 'Se resultat 🏆' : 'Nästa bild'}
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
