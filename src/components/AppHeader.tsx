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
          <img
            src="/mattejakten.png"
            alt="Mattejakten"
            className="h-10 w-auto"
            style={{ mixBlendMode: 'multiply' }}
          />
        </button>
      </div>
    </header>
  );
}
