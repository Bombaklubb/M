import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Trophy, ChevronDown, ChevronUp, Users, Lightbulb, GraduationCap } from 'lucide-react';
import { ModuleCard } from '@/components/ModuleCard';
import { MODULES } from '@/data/modules';
import { GameState, View } from '@/types';
import { xpForNextLevel, getLevelTitle } from '@/lib/utils';

interface HomeViewProps {
  gameState: GameState;
  onNavigate: (view: View) => void;
}

export function HomeView({ gameState, onNavigate }: HomeViewProps) {
  const [tipsExpanded, setTipsExpanded] = useState(false);

  const { current, next, progress } = xpForNextLevel(gameState.xp);
  const levelTitle = getLevelTitle(gameState.level);
  const allCompleted = gameState.completedModules.length >= MODULES.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-12">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-primary/20 px-6 py-8">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />

          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight"
            >
              Lär dig tänka källkritiskt{' '}
              <span className="inline-block">🔎</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5 max-w-xl"
            >
              I en värld där AI kan skapa texter, bilder och information – kan du skilja sant från fejk?
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { icon: '🎮', label: '6 Moduler' },
                { icon: '⚡', label: 'XP & Nivåer' },
                { icon: '🏫', label: 'Klassrumsklart' },
              ].map(pill => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 bg-background/60 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  <span>{pill.icon}</span>
                  {pill.label}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* All-completed celebration banner */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mt-4 bg-gradient-to-r from-xp/20 to-primary/20 border border-xp/40 rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              <span className="text-4xl">🏆</span>
              <div>
                <div className="font-bold text-foreground">Alla moduler klara!</div>
                <div className="text-sm text-muted-foreground">
                  Du har genomfört hela Källkritikjakten. Imponerande!
                </div>
              </div>
              <span className="text-2xl ml-auto">🎉</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {/* Streak */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-1">
          <Flame className={`w-5 h-5 ${gameState.streak > 0 ? 'text-orange-400' : 'text-muted-foreground'}`} />
          <div className="text-xl font-bold text-foreground">{gameState.streak}</div>
          <div className="text-xs text-muted-foreground">Dagsstreak</div>
        </div>

        {/* Level */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-1">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{gameState.level}</span>
          </div>
          <div className="text-sm font-bold text-foreground">{levelTitle}</div>
          <div className="text-xs text-muted-foreground">Nivå {gameState.level}</div>
        </div>

        {/* XP */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-1">
          <Zap className="w-5 h-5 text-xp" />
          <div className="text-xl font-bold text-xp">{gameState.xp}</div>
          <div className="text-xs text-muted-foreground">Total XP</div>
        </div>
      </motion.div>

      {/* XP progress towards next level */}
      {gameState.level < 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-card border border-border rounded-2xl px-5 py-4"
        >
          <div className="flex justify-between items-center mb-2 text-xs text-muted-foreground">
            <span>Nästa nivå: <span className="text-foreground font-semibold">{getLevelTitle(gameState.level + 1)}</span></span>
            <span className="text-xp font-semibold">{current} / {next} XP</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full xp-bar-fill rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}

      {/* Module grid heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-lg font-bold text-foreground">Välj en modul</h2>
        <span className="text-sm text-muted-foreground">
          {gameState.completedModules.length}/{MODULES.length} klara
        </span>
      </motion.div>

      {/* Module grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {MODULES.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            isCompleted={gameState.completedModules.includes(mod.id)}
            highScore={gameState.moduleHighScores[mod.id]}
            isLocked={false}
            onClick={() => onNavigate(`module${mod.id}` as View)}
            index={i}
          />
        ))}
      </div>

      {/* Badges showcase (if any earned) */}
      {gameState.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-xp" />
            <h3 className="font-bold text-foreground text-sm">Dina märken</h3>
            <span className="ml-auto text-xs text-muted-foreground">
              {gameState.badges.length} upplåsta
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {gameState.badges.map(badge => (
              <motion.div
                key={badge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="bg-xp/10 border border-xp/30 rounded-full px-3 py-1.5 text-xs font-semibold text-xp"
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tips för lärare — collapsed card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => setTipsExpanded(v => !v)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/50 transition-colors"
        >
          <GraduationCap className="w-5 h-5 text-accent shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-foreground text-sm">Tips för lärare</div>
            <div className="text-xs text-muted-foreground">Klassrumstips och pedagogiska idéer</div>
          </div>
          {tipsExpanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </button>

        <AnimatePresence>
          {tipsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed pt-4">
                  Källkritikjakten är designat för klassrumsbruk. Modulerna kan spelas individuellt eller som
                  gruppdiskussion. Modul 6 "Sant eller Fake?" innehåller speciella{' '}
                  <span className="text-xp font-semibold">diskussionsfrågor</span> som dyker upp efter varje svar.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: '👥', title: 'Gruppspel', desc: 'Spela en modul gemensamt på storskärm och diskutera svaren.' },
                    { icon: '🏆', title: 'Tävling', desc: 'Låt eleverna tävla om vem som får flest XP i en session.' },
                    { icon: '💬', title: 'Diskussion', desc: 'Använd diskussionsprompts i Modul 6 som startpunkt för samtal.' },
                    { icon: '📝', title: 'Hemuppgift', desc: 'Eleverna spelar en modul hemma och återberättar vad de lärde sig.' },
                  ].map(tip => (
                    <div key={tip.title} className="bg-muted rounded-xl p-3 flex gap-3">
                      <span className="text-xl">{tip.icon}</span>
                      <div>
                        <div className="font-semibold text-foreground text-xs">{tip.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tip.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-accent">
                    Inga konton behövs. Framsteg sparas lokalt i webbläsaren och kan återställas via Statistik-sidan.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
