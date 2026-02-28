import React from 'react';
import { useApp } from '../contexts/AppContext';

export default function AppHeader() {
  const { currentStudent, setView } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12
      bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center">
        <button
          onClick={() => currentStudent && setView('dashboard')}
          className="flex items-center gap-2 group"
          title="Till startsidan"
        >
          <span className="text-2xl">🎯</span>
          <span className="text-white font-black text-lg tracking-tight
            group-hover:text-amber-300 transition-colors">
            Mattejakten
          </span>
        </button>
      </div>
    </header>
  );
}
