import React from 'react';
import { User } from '../types';
import { useDarkMode } from '../contexts/DarkModeContext';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onHomeClick: () => void;
  onProfileClick?: () => void;
  onKistorClick?: () => void;
  unopenedChests?: number;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onHomeClick, onProfileClick, onKistorClick, unopenedChests = 0 }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      {/* Subtle gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer"
        >
          <img src="/readhunt.png" alt="Readhunt" className="w-12 h-12 object-contain" />
        </button>

        {/* Right side */}
        <div className="flex items-center gap-1.5 md:gap-2">

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-lg border border-slate-200/80 dark:border-slate-700/80"
            title={darkMode ? 'Light mode' : 'Dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Chests */}
          {onKistorClick && (
            <button
              onClick={onKistorClick}
              className="relative w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center justify-center border border-amber-200/80 dark:border-amber-700/60"
              title="Chests"
              aria-label="View chests"
            >
              <img src="/content/guldkista.png" alt="Chests" className="w-5 h-5 object-contain" />
              {unopenedChests > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] flex items-center justify-center px-0.5 text-[9px] font-bold bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-full shadow-sm">
                  {unopenedChests}
                </span>
              )}
            </button>
          )}

          {/* Points */}
          <div className="flex items-center gap-1.5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 px-3 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-700/50">
            <span className="text-base">⭐</span>
            <span className="font-bold text-amber-700 dark:text-amber-300 text-sm tabular-nums">{user.totalPoints}</span>
          </div>

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-1.5 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 px-3 py-1.5 rounded-xl border border-indigo-200/80 dark:border-indigo-700/50 hover:from-indigo-100 hover:to-violet-100 dark:hover:from-indigo-900/40 dark:hover:to-violet-900/40 transition-all"
            aria-label={`Profile for ${user.name}`}
          >
            <span className="text-base">{user.avatar || '👤'}</span>
            <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm hidden sm:inline">{user.name}</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm font-medium border border-transparent hover:border-rose-200/60 dark:hover:border-rose-700/40"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};
