import React, { useState } from 'react';
import { Trophy, Home, Search } from 'lucide-react';
import { GameState } from '@/types';
import { View } from '@/types';
import { UserMenuModal } from './UserMenuModal';

interface HeaderProps {
  gameState: GameState;
  currentView: View;
  onNavigate: (view: View) => void;
  userName: string;
  onLogout: () => void;
}

export function Header({ gameState, currentView, onNavigate, userName, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Nav */}
          <nav className="flex items-center gap-1 ml-auto">
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
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-xl border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
              title="Ditt konto och din statistik"
              aria-label="Öppna kontomeny"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-extrabold text-indigo-700">{gameState.level}</span>
              </div>
              <span className="hidden sm:block text-xs font-bold text-indigo-600 max-w-[90px] truncate">
                {userName}
              </span>
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

      <UserMenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        gameState={gameState}
        userName={userName}
        onNavigateStats={() => {
          onNavigate('stats');
          setMenuOpen(false);
        }}
        onLogout={() => {
          onLogout();
          setMenuOpen(false);
        }}
      />
    </header>
  );
}
