import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, BarChart2, Home, Search, Presentation } from 'lucide-react';
import { GameState } from '@/types';
import { View } from '@/types';
import { xpForNextLevel, getLevelTitle } from '@/lib/utils';

interface HeaderProps {
  gameState: GameState;
  currentView: View;
  onNavigate: (view: View) => void;
  classMode: boolean;
  onToggleClassMode: () => void;
}

export function Header({ gameState, currentView, onNavigate, classMode, onToggleClassMode }: HeaderProps) {
  const { progress } = xpForNextLevel(gameState.xp);
  const levelTitle = getLevelTitle(gameState.level);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-indigo-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Gå till startsidan"
          >
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md border-2 border-indigo-700">
              <Search className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="font-extrabold text-indigo-700 text-sm leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Källkritikjakten
              </div>
              <div className="text-indigo-400 text-xs font-semibold">AI &amp; Källkritik</div>
            </div>
          </button>

          {/* XP + Level */}
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-8 h-8 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center shadow-sm">
                <span className="text-xs font-extrabold text-indigo-700">{gameState.level}</span>
              </div>
              <div className="hidden sm:block text-xs font-bold text-indigo-500">{levelTitle}</div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-indigo-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  {gameState.xp} XP
                </span>
              </div>
              <div className="h-2 bg-indigo-100 rounded-full overflow-hidden border border-indigo-200">
                <motion.div
                  className="h-full xp-bar-fill rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                currentView === 'home'
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200 shadow-sm'
                  : 'text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 border-2 border-transparent'
              }`}
              title="Hem"
              aria-label="Hem"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('stats')}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                currentView === 'stats'
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200 shadow-sm'
                  : 'text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 border-2 border-transparent'
              }`}
              title="Statistik"
              aria-label="Statistik"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleClassMode}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                classMode
                  ? 'bg-violet-100 text-violet-700 border-2 border-violet-300 shadow-sm'
                  : 'text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 border-2 border-transparent'
              }`}
              title={classMode ? 'Klassläge på – större text för storskärm. Klicka för att stänga av.' : 'Klassläge – större text för storskärm/projektor'}
              aria-label="Växla klassläge"
              aria-pressed={classMode}
            >
              <Presentation className="w-4 h-4" />
            </button>
            {gameState.badges.length > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 border-2 border-amber-200 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-bold text-amber-700">{gameState.badges.length}</span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
