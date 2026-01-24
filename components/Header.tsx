import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onProfileClick?: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onProfileClick, onLogoClick }) => {
  if (!user) return null;

  return (
    <header className="bg-white shadow-md border-b-4 border-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="text-3xl">📚</span>
          <span className="text-xl font-extrabold text-indigo-900">Läs och lär</span>
        </button>

        {/* User info */}
        <div className="flex items-center space-x-4">
          {/* Points */}
          <div className="hidden md:flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full border-2 border-yellow-200">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-slate-700">{user.totalPoints}</span>
          </div>

          {/* Streak */}
          {user.streak > 0 && (
            <div className="hidden md:flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full border-2 border-orange-200">
              <span className="text-xl">🔥</span>
              <span className="font-bold text-slate-700">{user.streak}</span>
            </div>
          )}

          {/* Profile button */}
          {onProfileClick && (
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full border-2 border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <span className="text-xl">👤</span>
              <span className="font-bold text-slate-700">{user.username}</span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors font-medium"
          >
            Logga ut
          </button>
        </div>
      </div>
    </header>
  );
};
