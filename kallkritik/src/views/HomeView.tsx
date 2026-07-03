import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Trophy, ChevronDown, ChevronUp, Lightbulb, GraduationCap, Star, Printer, ChevronRight } from 'lucide-react';
import { ModuleCard } from '@/components/ModuleCard';
import { MODULES, TRACKS } from '@/data/modules';
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
  const moduleById = new Map(MODULES.map(m => [m.id, m]));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-14">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="relative rounded-[24px] overflow-hidden border-[3px] border-indigo-200 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 px-6 py-8 shadow-[0_8px_0_0_rgba(99,102,241,0.35)]">
          <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-8 w-36 h-36 bg-white/10 rounded-full translate-y-1/3 pointer-events-none" />
          <div className="absolute top-4 right-24 w-6 h-6 bg-yellow-300 rounded-full opacity-80" />
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-pink-300 rounded-full opacity-70" />
          <div className="absolute top-12 left-40 w-3 h-3 bg-cyan-300 rounded-full opacity-60" />

          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-sm"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Lär dig tänka källkritiskt!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-5 max-w-xl font-semibold"
            >
              I en värld där AI kan skapa texter, bilder och information – kan du skilja sant från fejk?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { icon: <Star className="w-3.5 h-3.5" />, label: `${MODULES.length} Moduler` },
                { icon: <Zap className="w-3.5 h-3.5" />, label: 'XP & Nivåer' },
                { icon: <GraduationCap className="w-3.5 h-3.5" />, label: 'Klassrumsklart' },
              ].map(pill => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 text-xs font-bold text-white"
                >
                  {pill.icon}
                  {pill.label}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* All-completed celebration */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mt-4 bg-gradient-to-r from-amber-400 to-orange-400 border-[3px] border-amber-500 rounded-[20px] px-5 py-4 shadow-[0_6px_0_0_rgba(245,158,11,0.4)]"
            >
              <div className="flex items-center gap-4 mb-3">
                <Trophy className="w-8 h-8 text-white shrink-0" />
                <div>
                  <div className="font-extrabold text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    Alla moduler klara!
                  </div>
                  <div className="text-sm text-amber-100 font-semibold">
                    Du har genomfört hela Källkritikjakten. Imponerande!
                  </div>
                </div>
                <Star className="w-6 h-6 text-white ml-auto opacity-80 shrink-0" />
              </div>
              <button
                onClick={() => onNavigate('diploma')}
                className="w-full flex items-center justify-center gap-2 bg-white/90 hover:bg-white border-2 border-amber-300 rounded-2xl px-4 py-2.5 text-sm font-extrabold text-amber-700 transition-colors cursor-pointer"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <Printer className="w-4 h-4" />
                Hämta ditt diplom
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="clay-card p-4 flex flex-col items-center text-center gap-1">
          <div className="w-9 h-9 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center mb-1">
            <Flame className={`w-5 h-5 ${gameState.streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
          </div>
          <div className="text-2xl font-extrabold text-gray-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {gameState.streak}
          </div>
          <div className="text-xs font-bold text-gray-400">Streak</div>
        </div>

        <div className="clay-card p-4 flex flex-col items-center text-center gap-1">
          <div className="w-9 h-9 rounded-2xl bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center mb-1">
            <span className="text-sm font-extrabold text-indigo-700">{gameState.level}</span>
          </div>
          <div className="text-sm font-extrabold text-gray-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {levelTitle}
          </div>
          <div className="text-xs font-bold text-gray-400">Nivå {gameState.level}</div>
        </div>

        <div className="clay-card p-4 flex flex-col items-center text-center gap-1">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center mb-1">
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {gameState.xp}
          </div>
          <div className="text-xs font-bold text-gray-400">Total XP</div>
        </div>
      </motion.div>

      {/* XP progress */}
      {gameState.level < 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 clay-card px-5 py-4"
        >
          <div className="flex justify-between items-center mb-2 text-xs font-bold">
            <span className="text-gray-500">
              Nästa nivå:{' '}
              <span className="text-indigo-700">{getLevelTitle(gameState.level + 1)}</span>
            </span>
            <span className="text-amber-600 font-extrabold">{current} / {next} XP</span>
          </div>
          <div className="h-3 bg-indigo-50 rounded-full overflow-hidden border-2 border-indigo-100">
            <motion.div
              className="h-full xp-bar-fill rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}

      {/* Källkollen – verktyg för riktiga källor */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <button
          onClick={() => onNavigate('kallkollen')}
          className="w-full clay-card p-4 flex items-center gap-4 text-left hover:border-indigo-300 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 border-2 border-emerald-200 flex items-center justify-center text-2xl shrink-0">
            🚦
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-gray-800 text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Källkollen – granska en riktig källa
            </div>
            <div className="text-xs font-semibold text-gray-400">
              Använd de fyra grundfrågorna på en sajt eller ett konto du själv valt
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
        </button>
      </motion.div>

      {/* Progress heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between mb-5"
      >
        <h2 className="text-xl font-extrabold text-gray-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          Välj en modul
        </h2>
        <span className="text-sm font-bold text-indigo-400 bg-indigo-50 border-2 border-indigo-100 rounded-full px-3 py-1">
          {gameState.completedModules.length}/{MODULES.length} klara
        </span>
      </motion.div>

      {/* Tracks */}
      {TRACKS.map((track, trackIndex) => (
        <div key={track.title} className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + trackIndex * 0.1 }}
            className="flex items-center gap-2.5 mb-3"
          >
            <span className="text-2xl">{track.icon}</span>
            <div>
              <h3 className="text-base font-extrabold text-gray-700 leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Tema {trackIndex + 1}: {track.title}
              </h3>
              <p className="text-xs font-semibold text-gray-400">{track.desc}</p>
            </div>
            <span className="ml-auto text-xs font-bold text-gray-400">
              {track.moduleIds.filter(id => gameState.completedModules.includes(id)).length}/{track.moduleIds.length}
            </span>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {track.moduleIds.map((id, i) => {
              const mod = moduleById.get(id);
              if (!mod) return null;
              return (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  isCompleted={gameState.completedModules.includes(mod.id)}
                  highScore={gameState.moduleHighScores[mod.id]}
                  isLocked={false}
                  onClick={() => onNavigate(`module${mod.id}` as View)}
                  index={i}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Badges */}
      {gameState.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="clay-card p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-gray-800 text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Dina märken
            </h3>
            <span className="ml-auto text-xs font-bold text-gray-400">
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
                className="bg-amber-100 border-2 border-amber-300 rounded-full px-3 py-1.5 text-xs font-bold text-amber-700"
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tips för lärare */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="clay-card overflow-hidden"
      >
        <button
          onClick={() => setTipsExpanded(v => !v)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-indigo-50 transition-colors rounded-t-[17px] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-100 border-2 border-cyan-200 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-gray-800 text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Tips för lärare
            </div>
            <div className="text-xs font-semibold text-gray-400">Arbetssätt, lektionsguider och klassrumstips</div>
          </div>
          {tipsExpanded
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />
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
              <div className="px-5 pb-5 space-y-4 border-t-2 border-dashed border-indigo-100">
                <p className="text-sm text-gray-500 leading-relaxed pt-4 font-medium">
                  Appen är byggd för <span className="text-indigo-600 font-bold">EPA-arbetssättet</span>:
                  eleven svarar <strong>Enskilt</strong>, diskuterar samtalsfrågan i <strong>Par</strong>,
                  och lyfter sedan till <strong>Alla</strong> i klassen. Varje modulkort har en{' '}
                  <span className="inline-flex items-center gap-1 text-cyan-600 font-bold">
                    <GraduationCap className="w-3.5 h-3.5" /> lektionsguide
                  </span>{' '}
                  med startfrågor, parläge, gruppövning och ett uppdrag utanför appen.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: '🎓', title: 'Lektionsguider', desc: 'Klicka på studentmössan på varje modulkort: före/under/efter-upplägg med samtalsfrågor.', color: 'bg-cyan-50 border-cyan-200' },
                    { icon: '📺', title: 'Klassläge', desc: 'Aktivera skärm-ikonen i menyn för större text – perfekt på projektor för gemensam röstning.', color: 'bg-violet-50 border-violet-200' },
                    { icon: '👥', title: 'Parläge', desc: 'Två elever på en enhet: turas om varannan fråga och motivera högt innan ni svarar.', color: 'bg-emerald-50 border-emerald-200' },
                    { icon: '🎒', title: 'Veckans granskning', desc: 'Efter varje modul får eleven ett uppdrag i sitt eget flöde – redovisas i smågrupp.', color: 'bg-amber-50 border-amber-200' },
                    { icon: '🚦', title: 'Källkollen', desc: 'Låt eleverna granska riktiga källor med checklistan – funkar i alla ämnen.', color: 'bg-rose-50 border-rose-200' },
                    { icon: '🧭', title: 'Rekommenderad ordning', desc: 'Börja med Tema 1 (Grunderna) – metoderna där används i alla andra moduler.', color: 'bg-sky-50 border-sky-200' },
                  ].map(tip => (
                    <div key={tip.title} className={`${tip.color} border-2 rounded-2xl p-3 flex gap-3`}>
                      <span className="text-xl">{tip.icon}</span>
                      <div>
                        <div className="font-extrabold text-gray-700 text-xs" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                          {tip.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed font-medium">{tip.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-3 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-cyan-700 font-semibold">
                    Inga konton behövs. Framsteg sparas lokalt i webbläsaren och kan återställas via Statistik-sidan.
                    När alla moduler är klara kan eleven skriva ut ett diplom.
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
