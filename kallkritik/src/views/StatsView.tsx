import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Flame, RotateCcw, CheckCircle, Clock, AlertTriangle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MODULES } from '@/data/modules';
import { GameState, View } from '@/types';
import { xpForNextLevel, getLevelTitle } from '@/lib/utils';

interface StatsViewProps {
  gameState: GameState;
  onNavigate: (view: View) => void;
  onReset: () => void;
}

export function StatsView({ gameState, onNavigate, onReset }: StatsViewProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const { current, next, progress } = xpForNextLevel(gameState.xp);
  const levelTitle = getLevelTitle(gameState.level);

  const BADGE_MAP: Record<string, { icon: string; description: string }> = {
    'AI-Detektiven': { icon: '🔎', description: 'Modul 1 – AI eller människa?' },
    'Faktakollaren': { icon: '🔍', description: 'Modul 2 – Hitta felet' },
    'Källmästaren': { icon: '⚖️', description: 'Modul 3 – Är källan trovärdig?' },
    'Bilddetektiven': { icon: '🖼️', description: 'Modul 4 – Fakebilder & Deepfakes' },
    'Sanningssökaren': { icon: '💬', description: 'Modul 5 – AI-hallucinationer' },
    'Snabbdomaren': { icon: '⚡', description: 'Modul 6 – Sant eller Fake?' },
  };

  function handleResetConfirmed() {
    onReset();
    setConfirmReset(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-12">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-5"
      >
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Tillbaka till start
        </button>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground mb-6"
      >
        Din statistik 📊
      </motion.h1>

      {/* Level + XP card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-6 mb-4"
      >
        <div className="flex items-start gap-5 mb-5">
          {/* Level badge */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-3xl font-bold text-white">{gameState.level}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-xp rounded-full px-1.5 py-0.5">
              <span className="text-[10px] font-bold text-black">LVL</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Din titel</div>
            <div className="text-xl font-bold text-foreground mb-1">{levelTitle}</div>
            <div className="flex items-center gap-1.5 text-xp">
              <Zap className="w-4 h-4" />
              <span className="font-bold text-lg">{gameState.xp} XP</span>
            </div>
          </div>
        </div>

        {/* XP progress bar */}
        {gameState.level < 10 ? (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Framsteg till nästa nivå</span>
              <span className="text-xp font-semibold">{current} / {next} XP</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full xp-bar-fill rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">
              Nästa nivå: <span className="text-foreground font-semibold">{getLevelTitle(gameState.level + 1)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-xp/15 border border-xp/40 rounded-xl px-4 py-2.5 text-center">
            <span className="text-sm font-bold text-xp">🏆 Maxnivå uppnådd – du är en Källkritikguru!</span>
          </div>
        )}
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4"
      >
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Flame className={`w-6 h-6 mx-auto mb-1.5 ${gameState.streak > 0 ? 'text-orange-400' : 'text-muted-foreground'}`} />
          <div className="text-2xl font-bold text-foreground">{gameState.streak}</div>
          <div className="text-xs text-muted-foreground">Dagsstreak</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-1.5 text-success" />
          <div className="text-2xl font-bold text-foreground">{gameState.completedModules.length}</div>
          <div className="text-xs text-muted-foreground">Moduler klara</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
          <Trophy className="w-6 h-6 mx-auto mb-1.5 text-xp" />
          <div className="text-2xl font-bold text-foreground">{gameState.badges.length}</div>
          <div className="text-xs text-muted-foreground">Märken</div>
        </div>
      </motion.div>

      {/* Module progress list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-5 mb-4"
      >
        <h2 className="font-bold text-foreground mb-4">Moduler</h2>
        <div className="space-y-3">
          {MODULES.map((mod, i) => {
            const isCompleted = gameState.completedModules.includes(mod.id);
            const highScore = gameState.moduleHighScores[mod.id];
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className={`flex items-center gap-4 rounded-xl p-3 border transition-all ${
                  isCompleted
                    ? 'bg-success/8 border-success/25'
                    : 'bg-muted/50 border-border'
                }`}
              >
                {/* Module icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center text-lg shrink-0 shadow`}>
                  {mod.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground truncate">{mod.title}</span>
                    {isCompleted && (
                      <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Modul {mod.id}</div>
                </div>

                {/* Score or status */}
                <div className="text-right shrink-0">
                  {isCompleted && highScore !== undefined ? (
                    <>
                      <div className="text-sm font-bold text-success">{highScore}%</div>
                      <div className="text-xs text-muted-foreground">Bästa</div>
                    </>
                  ) : isCompleted ? (
                    <div className="text-xs text-success font-semibold">Klar ✓</div>
                  ) : (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Ej klar
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Badges grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5 mb-4"
      >
        <h2 className="font-bold text-foreground mb-4">
          Märken{' '}
          <span className="text-muted-foreground font-normal text-sm">
            ({gameState.badges.length}/{MODULES.length})
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MODULES.map(mod => {
            const isEarned = gameState.badges.includes(mod.badgeName);
            const badgeInfo = BADGE_MAP[mod.badgeName];
            return (
              <motion.div
                key={mod.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + mod.id * 0.04, type: 'spring', stiffness: 300 }}
                className={`rounded-2xl border p-4 text-center transition-all ${
                  isEarned
                    ? 'bg-xp/10 border-xp/40 shadow-lg shadow-xp/5'
                    : 'bg-muted border-border opacity-50'
                }`}
              >
                <div className={`text-3xl mb-2 ${isEarned ? '' : 'grayscale opacity-40'}`}>
                  {badgeInfo?.icon ?? mod.icon}
                </div>
                <div className={`font-semibold text-xs ${isEarned ? 'text-xp' : 'text-muted-foreground'}`}>
                  {mod.badgeName}
                </div>
                {isEarned && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">Upplåst!</div>
                )}
                {!isEarned && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">Inte upplåst</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Streak info */}
      {gameState.lastPlayedDate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl px-5 py-4 mb-6 flex items-center gap-4"
        >
          <Flame className={`w-8 h-8 shrink-0 ${gameState.streak > 0 ? 'text-orange-400' : 'text-muted-foreground'}`} />
          <div>
            <div className="font-bold text-foreground">
              {gameState.streak > 0
                ? `${gameState.streak} dag${gameState.streak === 1 ? '' : 'ars'} streak! 🔥`
                : 'Ingen aktiv streak'}
            </div>
            <div className="text-xs text-muted-foreground">
              Senast spelat: {gameState.lastPlayedDate || 'Aldrig'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-semibold text-foreground mb-1 text-sm">Återställ framsteg</h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Raderar all XP, märken och modulframsteg. Det går inte att ångra!
        </p>

        <AnimatePresence mode="wait">
          {!confirmReset ? (
            <motion.div
              key="reset-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmReset(true)}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Återställ allt
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="reset-confirm"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-danger/10 border border-danger/30 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                <p className="text-sm text-danger font-medium">
                  Är du säker? All data raderas permanent!
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1"
                >
                  Avbryt
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleResetConfirmed}
                  className="flex-1 gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ja, återställ
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
