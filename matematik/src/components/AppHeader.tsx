import React from 'react';
import { useTheme, FontSize } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';

const FONT_SIZES: Record<FontSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const FONT_LABELS: Record<FontSize, string> = {
  sm: 'a',
  md: 'A',
  lg: 'A',
};

export default function AppHeader() {
  const { fontSize, setFontSize } = useTheme();
  const { currentStudent, setView } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12
      bg-black/50 backdrop-blur-md border-b border-white/10">
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

        {/* Font size picker */}
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
      </div>
    </header>
  );
}
