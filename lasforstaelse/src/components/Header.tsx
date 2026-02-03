import React from 'react';
import { User } from '../types';
import { BookLogo } from './BookLogo';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onHomeClick: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onHomeClick, onProfileClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onHomeClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <BookLogo size={36} />
          <span className="text-xl font-extrabold text-purple-700">Läsförståelse</span>
        </button>

        {/* User info */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Points */}
          <div className="flex items-center space-x-1 md:space-x-2 bg-yellow-50 px-3 md:px-4 py-2 rounded-full border border-yellow-200">
            <span className="text-lg md:text-xl">⭐</span>
            <span className="font-bold text-slate-700 text-sm md:text-base">{user.totalPoints}</span>
          </div>

          {/* Badges count / streak */}
          <div className="flex items-center space-x-1 md:space-x-2 bg-orange-50 px-3 md:px-4 py-2 rounded-full border border-orange-200">
            <span className="text-lg md:text-xl">🔥</span>
            <span className="font-bold text-slate-700 text-sm md:text-base">{user.badges.length}</span>
          </div>

          {/* Profile button */}
          <button
            onClick={onProfileClick}
            className="flex items-center space-x-1 md:space-x-2 bg-indigo-50 px-3 md:px-4 py-2 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <span className="text-lg md:text-xl">👤</span>
            <span className="font-bold text-slate-700 text-sm md:text-base hidden sm:inline">{user.name}</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-3 md:px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors font-medium text-sm md:text-base"
          >
            Logga ut
          </button>
        </div>
      </div>
    </header>
  );
};
