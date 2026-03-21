import { motion } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import { loadGameProgress, GameId } from '../../utils/gameStorage';
import AppHeader from '../AppHeader';

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

export default function GamesHub() {
  const { currentStudent, setView } = useApp();
  const progress = currentStudent ? loadGameProgress(currentStudent.id) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0e2e] via-[#1a1840] to-[#0f0e2e]">
      <AppHeader />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-black text-white mb-2">
            🎮 Spel
          </h1>
          <p className="text-indigo-300 text-sm">
            Träna matte genom roliga spel – samla XP och lås upp nya nivåer!
          </p>
          {progress && (
            <div className="mt-3 inline-flex items-center gap-2 bg-indigo-900/50 px-4 py-2 rounded-full border border-indigo-500/30">
              <span className="text-yellow-400 font-bold">⭐ {progress.totalGameXP} XP</span>
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
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setView(game.view as any)}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${game.gradient} p-[2px] text-left`}
              >
                <div className="relative bg-[#0f0e2e]/90 rounded-2xl p-5 h-full backdrop-blur-sm">
                  {/* Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-10 rounded-2xl`} />

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
                    <div className="flex items-center gap-4 text-xs">
                      {gp && gp.totalPlays > 0 ? (
                        <>
                          <span className="bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-bold">
                            📈 Level {gp.level}
                          </span>
                          <span className="bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-bold">
                            🏆 Highscore: {gp.highScore}
                          </span>
                          <span className="bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-bold">
                            🎮 {gp.totalPlays}x
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
            onClick={() => setView('dashboard')}
            className="text-indigo-300 hover:text-white transition text-sm font-semibold"
          >
            ← Tillbaka till menyn
          </button>
        </div>
      </div>
    </div>
  );
}
