import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onHomeClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <span className="text-3xl">📚</span>
          <span className="text-xl font-bold text-indigo-900 hidden sm:inline">
            Läsförståelse
          </span>
        </button>

        <div className="flex items-center gap-4">
          {/* Poäng */}
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-yellow-700">{user.totalPoints}</span>
          </div>

          {/* Badges count */}
          <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
            <span className="text-xl">🏅</span>
            <span className="font-bold text-purple-700">{user.badges.length}</span>
          </div>

          {/* Användarnamn och logout */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700 hidden sm:inline">
              {user.name}
            </span>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-slate-600 transition"
              title="Logga ut"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
