import React from 'react';
import { User } from '../types';
import { BookLogo } from './BookLogo';
import { useDarkMode } from '../contexts/DarkModeContext';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onHomeClick: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onHomeClick, onProfileClick }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onHomeClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <BookLogo size={36} />
          <span className="text-xl font-extrabold text-purple-700 dark:text-purple-400">Läsjakten</span>
        </button>

        {/* User info */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title={darkMode ? 'Ljust läge' : 'Mörkt läge'}
          >
            <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
          </button>

          {/* Points */}
          <div className="flex items-center space-x-1 md:space-x-2 bg-yellow-50 dark:bg-yellow-900/30 px-3 md:px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-700">
            <span className="text-lg md:text-xl">⭐</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base">{user.totalPoints}</span>
          </div>

          {/* Badges count / streak */}
          <div className="flex items-center space-x-1 md:space-x-2 bg-orange-50 dark:bg-orange-900/30 px-3 md:px-4 py-2 rounded-full border border-orange-200 dark:border-orange-700">
            <span className="text-lg md:text-xl">🔥</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base">{user.badges.length}</span>
          </div>

          {/* Profile button */}
          <button
            onClick={onProfileClick}
            className="flex items-center space-x-1 md:space-x-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 md:px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <span className="text-lg md:text-xl">{user.avatar || '👤'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base hidden sm:inline">{user.name}</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-3 md:px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors font-medium text-sm md:text-base"
          >
            Logga ut
          </button>
        </div>
      </div>
    </header>
  );
};
