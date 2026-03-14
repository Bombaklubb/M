import React from 'react';
import { useApp } from '../contexts/AppContext';
import { getPoints, initPoints } from '../utils/storage';
import { loadGamification } from '../utils/chestStorage';
import { ALL_AVATARS } from '../data/avatars';

export default function AppHeader() {
  const { currentStudent, setView, logout } = useApp();

  const points = currentStudent
    ? (getPoints(currentStudent.id) ?? initPoints(currentStudent.id))
    : null;

  const avatarEmoji = currentStudent
    ? (ALL_AVATARS[currentStudent.avatar] ?? ALL_AVATARS[0])
    : null;

  const unopenedChests = currentStudent
    ? loadGamification(currentStudent.id).chests.filter(c => !c.opened).length
    : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14
      bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">

        {/* Logo – vänster */}
        <button
          onClick={() => currentStudent && setView('dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          title="Till startsidan"
        >
          <img
            src="/mattejakten.png"
            alt="Mattejakten"
            className="h-12 w-auto"
          />
          <span className="text-white font-extrabold text-lg hidden sm:inline tracking-wide">
            Mattejakten
          </span>
        </button>

        {/* Användarinfo – höger (visas bara när inloggad) */}
        {currentStudent && points && (
          <div className="flex items-center gap-2">

            {/* Kistor */}
            <button
              onClick={() => setView('kistor')}
              className="relative flex items-center gap-1 bg-amber-700/30 border border-amber-600/40 px-3 py-1.5 rounded-full hover:bg-amber-700/50 transition-colors cursor-pointer"
              title="Mina kistor"
            >
              <span className="text-base leading-none">🏆</span>
              {unopenedChests > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5">
                  {unopenedChests}
                </span>
              )}
            </button>

            {/* Poäng */}
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 rounded-full">
              <span className="text-base leading-none">⭐</span>
              <span className="text-amber-300 font-bold text-sm">{points.total}</span>
            </div>

            {/* Avatar + namn */}
            <button
              onClick={() => setView('my-page')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <span className="text-base leading-none">{avatarEmoji}</span>
              <span className="text-white font-bold text-sm hidden sm:inline">{currentStudent.name}</span>
            </button>

            {/* Logga ut */}
            <button
              onClick={logout}
              className="text-white/50 hover:text-white/80 font-medium text-sm transition-colors hidden sm:block"
            >
              Logga ut
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
