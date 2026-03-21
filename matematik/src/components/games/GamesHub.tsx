import { motion } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import { loadGameProgress, GameId } from '../../utils/gameStorage';
import AppHeader from '../AppHeader';
import { WORLDS } from '../../data/worlds';

// ── World theming ─────────────────────────────────────────────────────────────

const WORLD_CONFIG = {
  dino: {
    label: 'Dinosaurie Världen',
    subtitle: 'Grunderna – Åk 1–3',
    tagline: 'Träna addition, subtraktion och taluppfattning med roliga spel!',
    emoji: '🦖',
    gradientBg: 'from-[#0a1a0e] via-[#0f2d16] to-[#0a1a0e]',
    accent: '#10b981',
    accentClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-900/50 border-emerald-500/30',
    badgeText: 'text-emerald-300',
  },
  fantasy: {
    label: 'Fantasy Världen',
    subtitle: 'Mellanstadiet – Åk 4–6',
    tagline: 'Kämpa med multiplikation, bråk och procent i magiska spel!',
    emoji: '🏰',
    gradientBg: 'from-[#150a2e] via-[#1e1040] to-[#150a2e]',
    accent: '#8b5cf6',
    accentClass: 'text-purple-400',
    badgeBg: 'bg-purple-900/50 border-purple-500/30',
    badgeText: 'text-purple-300',
  },
  scifi: {
    label: 'Sci-Fi Världen',
    subtitle: 'Högstadiet – Åk 7–9',
    tagline: 'Erövra algebra, geometri och statistik med rymdäventyr!',
    emoji: '🚀',
    gradientBg: 'from-[#050d1f] via-[#0a1535] to-[#050d1f]',
    accent: '#3b82f6',
    accentClass: 'text-blue-400',
    badgeBg: 'bg-blue-900/50 border-blue-500/30',
    badgeText: 'text-blue-300',
  },
  gym: {
    label: 'Rymd Akademin',
    subtitle: 'Gymnasiet – Gym 1–3',
    tagline: 'Behärska trigonometri, derivata och avancerad matematik!',
    emoji: '🌌',
    gradientBg: 'from-[#0a0a1f] via-[#111138] to-[#0a0a1f]',
    accent: '#6366f1',
    accentClass: 'text-indigo-400',
    badgeBg: 'bg-indigo-900/50 border-indigo-500/30',
    badgeText: 'text-indigo-300',
  },
} as const;

const FALLBACK_WORLD_CONFIG = WORLD_CONFIG.dino;

// ── Game definitions ──────────────────────────────────────────────────────────

const GAMES: {
  id: GameId;
  view: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  border: string;
}[] = [
  {
    id: 'quick-answer',
    view: 'game-quick-answer',
    emoji: '🎯',
    title: 'Rätt svar snabbt',
    subtitle: '4 svar – välj rätt!',
    description: 'Combo-system, streak = mer poäng. Alla nivåer!',
    gradient: 'from-rose-500 via-orange-500 to-amber-500',
    border: 'border-rose-400',
  },
  {
    id: 'boss-battle',
    view: 'game-boss-battle',
    emoji: '🧠',
    title: 'Boss Battle',
    subtitle: 'Slåss mot bossen med matte!',
    description: 'Rätt svar = skada, fel = du tar skada. Ekvationer & problemlösning.',
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    border: 'border-purple-400',
  },
  {
    id: 'time-attack',
    view: 'game-time-attack',
    emoji: '⏱️',
    title: 'Tidsattack',
    subtitle: '60 sekunder – hur många hinner du?',
    description: 'Tabeller & huvudräkning. Snabb som blixten!',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    border: 'border-cyan-400',
  },
  {
    id: 'collect-coins',
    view: 'game-collect-coins',
    emoji: '🪙',
    title: 'Samla mynt',
    subtitle: 'Rätt svar = samla, fel = hinder!',
    description: 'Spring och samla mynt genom att svara rätt.',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    border: 'border-yellow-400',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function GamesHub() {
  const { currentStudent, setView, gameWorldId } = useApp();
  const progress = currentStudent ? loadGameProgress(currentStudent.id) : null;

  const worldCfg = gameWorldId ? WORLD_CONFIG[gameWorldId] : FALLBACK_WORLD_CONFIG;
  const world = gameWorldId ? WORLDS.find(w => w.id === gameWorldId) : null;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${worldCfg.gradientBg}`}>
      <AppHeader />
      <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
        {/* World badge */}
        {world && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <button
              onClick={() => setView(`world-${gameWorldId}` as any)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${worldCfg.badgeBg} ${worldCfg.badgeText} hover:opacity-80 transition`}
            >
              <span>{worldCfg.emoji}</span>
              <span>← {worldCfg.label}</span>
            </button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-6"
        >
          <div className="text-5xl mb-2">🎮</div>
          <h1 className="text-3xl font-black text-white mb-1">Spel</h1>
          {world && (
            <p className="text-sm font-semibold mb-1" style={{ color: worldCfg.accent }}>
              {worldCfg.subtitle}
            </p>
          )}
          <p className="text-white/50 text-sm max-w-xs mx-auto leading-snug">
            {worldCfg.tagline}
          </p>
          {progress && (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border ${worldCfg.badgeBg}`}>
              <span className={`font-bold ${worldCfg.badgeText}`}>⭐ {progress.totalGameXP} XP intjänat totalt</span>
            </div>
          )}
        </motion.div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GAMES.map((game, idx) => {
            const gp = progress?.games[game.id];
            return (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 + 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setView(game.view as any)}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${game.gradient} p-[2px] text-left cursor-pointer`}
              >
                <div className="relative bg-[#080818]/92 rounded-2xl p-5 h-full backdrop-blur-sm">
                  {/* Subtle glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-8 rounded-2xl`} />

                  <div className="relative z-10">
                    {/* Emoji + Title row */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-4xl">{game.emoji}</span>
                      <div>
                        <h3 className="text-lg font-black text-white leading-tight">{game.title}</h3>
                        <p className="text-xs font-semibold text-white/60">{game.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-sm text-white/70 mb-4 leading-snug">{game.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      {gp && gp.totalPlays > 0 ? (
                        <>
                          <span className="bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-bold">
                            📈 Level {gp.level}
                          </span>
                          <span className="bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-bold">
                            🏆 {gp.highScore}
                          </span>
                          <span className="bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-bold">
                            🎮 {gp.totalPlays}x spelat
                          </span>
                        </>
                      ) : (
                        <span className="bg-white/10 px-2.5 py-1 rounded-full text-emerald-300 font-bold animate-pulse">
                          🔓 Nytt! Prova nu
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <button
            onClick={() => gameWorldId ? setView(`world-${gameWorldId}` as any) : setView('dashboard')}
            className={`${worldCfg.accentClass} hover:text-white transition text-sm font-semibold`}
          >
            ← {gameWorldId ? `Tillbaka till ${worldCfg.label}` : 'Tillbaka till menyn'}
          </button>
        </div>
      </div>
    </div>
  );
}
