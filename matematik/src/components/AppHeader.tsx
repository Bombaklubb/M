import React from 'react';
import { useTheme, FontSize } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';

const FONT_LABELS: Record<FontSize, string> = {
  sm: 'a',
  md: 'A',
  lg: 'A',
};

const FONT_SIZES: Record<FontSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function AppHeader() {
  const { darkMode, toggleDarkMode, fontSize, setFontSize } = useTheme();
  const { currentStudent, setView } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12
      bg-black/50 dark:bg-black/70 backdrop-blur-md
      border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => currentStudent && setView('dashboard')}
          className="flex items-center gap-2 group"
          title="Till startsidan"
        >
          <span className="text-2xl">🧮</span>
          <span className="text-white font-black text-lg tracking-tight
            group-hover:text-amber-300 transition-colors">
            Mattejakten
          </span>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Font size */}
          <div className="flex bg-white/10 rounded-lg overflow-hidden border border-white/20"
            title="Teckenstorlek">
            {(['sm', 'md', 'lg'] as FontSize[]).map(s => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`px-2.5 py-1.5 font-bold transition-colors leading-none ${FONT_SIZES[s]} ${
                  fontSize === s
                    ? 'bg-amber-400 text-gray-900'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {FONT_LABELS[s]}
              </button>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="bg-white/10 hover:bg-white/25 border border-white/20
              text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            title={darkMode ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
