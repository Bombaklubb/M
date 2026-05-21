import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, BarChart2, Home } from 'lucide-react';
import { GameState } from '@/types';
import { View } from '@/types';
import { xpForNextLevel, getLevelTitle } from '@/lib/utils';

interface HeaderProps {
  gameState: GameState;
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Header({ gameState, currentView, onNavigate }: HeaderProps) {
  const { progress } = xpForNextLevel(gameState.xp);
  const levelTitle = getLevelTitle(gameState.level);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🔎</span>
            <div className="hidden sm:block">
              <div className="font-bold text-foreground text-sm leading-tight">Källkritikjakten</div>
              <div className="text-muted-foreground text-xs">AI & Källkritik</div>
            </div>
          </button>

          {/* XP + Level */}
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{gameState.level}</span>
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground">{levelTitle}</div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-xp" />
                  {gameState.xp} XP
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
              className={`p-2 rounded-lg transition-colors ${currentView === 'home' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              title="Hem"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('stats')}
              className={`p-2 rounded-lg transition-colors ${currentView === 'stats' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              title="Statistik"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            {gameState.badges.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-xp/10">
                <Trophy className="w-3.5 h-3.5 text-xp" />
                <span className="text-xs font-semibold text-xp">{gameState.badges.length}</span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
