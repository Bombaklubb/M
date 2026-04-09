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
    <header className="fixed top-0 left-0 right-0 z-50 h-14 header-bar">
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
            className="h-12 w-auto drop-shadow-lg"
          />
          <span className="font-extrabold text-lg hidden sm:inline tracking-wide"
            style={{ color: '#ea580c' }}>
            Mattejakten
          </span>
        </button>

        {/* Användarinfo – höger (visas bara när inloggad) */}
        {currentStudent && points && (
          <div className="flex items-center gap-2">

            {/* Kistor */}
            <button
              onClick={() => setView('kistor')}
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-full hover:scale-105 transition-all cursor-pointer"
              style={{
                background: 'rgba(251, 146, 60, 0.12)',
                border: '1px solid rgba(251, 146, 60, 0.40)',
                boxShadow: '0 2px 8px rgba(251,146,60,0.15)'
              }}
              title="Mina kistor"
            >
              <span className="text-base leading-none">🏆</span>
              {unopenedChests > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5">
                  {unopenedChests}
                </span>
              )}
            </button>

            {/* Avatar + namn + poäng */}
            <button
              onClick={() => setView('my-page')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(251, 146, 60, 0.35)',
              }}
            >
              <span className="text-base leading-none">{avatarEmoji}</span>
              <span className="text-gray-800 font-bold text-sm hidden sm:inline">{currentStudent.name}</span>
              <span className="text-orange-400 text-sm">⭐</span>
              <span className="font-bold text-sm hidden sm:inline" style={{ color: '#ea580c' }}>{points.total}</span>
            </button>

            {/* Logga ut */}
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors hidden sm:block px-2 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(251,146,60,0.25)' }}
            >
              Logga ut
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
