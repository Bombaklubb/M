import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Zap, Trophy, BarChart2, LogOut } from 'lucide-react';
import { GameState } from '@/types';
import { xpForNextLevel, getLevelTitle } from '@/lib/utils';

interface UserMenuModalProps {
  open: boolean;
  onClose: () => void;
  gameState: GameState;
  userName: string;
  onNavigateStats: () => void;
  onLogout: () => void;
}

export function UserMenuModal({ open, onClose, gameState, userName, onNavigateStats, onLogout }: UserMenuModalProps) {
  const { current, next, progress } = xpForNextLevel(gameState.xp);
  const levelTitle = getLevelTitle(gameState.level);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center sm:justify-end bg-indigo-950/40 backdrop-blur-sm p-4 sm:pt-20 sm:pr-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm mt-16 sm:mt-0 bg-white border-[3px] border-indigo-200 rounded-[24px] shadow-[0_8px_0_0_rgba(99,102,241,0.25)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-50 border-b-2 border-indigo-100 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 border-2 border-indigo-700 flex items-center justify-center shrink-0">
                <span className="text-sm font-extrabold text-white">{gameState.level}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-gray-800 text-sm truncate" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {userName}
                </div>
                <div className="text-xs font-semibold text-indigo-500">{levelTitle}</div>
              </div>
              <button
                onClick={onClose}
                aria-label="Stäng"
                className="w-8 h-8 rounded-xl bg-white hover:bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 text-indigo-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* XP progress */}
              {gameState.level < 10 ? (
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> {gameState.xp} XP
                    </span>
                    <span className="text-amber-600">{current} / {next} XP</span>
                  </div>
                  <div className="h-2.5 bg-indigo-50 rounded-full overflow-hidden border-2 border-indigo-100">
                    <motion.div
                      className="h-full xp-bar-fill rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-400 font-semibold mt-1.5">
                    Nästa nivå: {getLevelTitle(gameState.level + 1)}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2.5 text-center text-xs font-bold text-amber-700">
                  🏆 Maxnivå uppnådd – du är en Källkritikguru!
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-3 text-center">
                  <Flame className={`w-5 h-5 mx-auto mb-1 ${gameState.streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
                  <div className="text-lg font-extrabold text-gray-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {gameState.streak}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400">Streak</div>
                </div>
                <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-3 text-center">
                  <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                  <div className="text-lg font-extrabold text-gray-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {gameState.badges.length}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400">Märken</div>
                </div>
              </div>

              <button
                onClick={onNavigateStats}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-700 rounded-2xl px-4 py-2.5 text-sm font-extrabold text-white transition-colors cursor-pointer"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <BarChart2 className="w-4 h-4" /> Se all statistik
              </button>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 rounded-2xl px-4 py-2.5 text-sm font-extrabold text-rose-600 transition-colors cursor-pointer"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <LogOut className="w-4 h-4" /> Byt användare
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
