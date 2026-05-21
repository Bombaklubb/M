import React, { useState, useRef, useEffect } from 'react';

const JAKT_APPS = [
  { name: 'Svenskajakten', icon: '🇸🇪', url: 'https://svenskajakten.vercel.app' },
  { name: 'Mattejakten', icon: '🔢', url: 'https://mattejakten.vercel.app' },
  { name: 'Engelskajakten', icon: '🇬🇧', url: 'https://engelskajakten.vercel.app' },
  { name: 'Läsjakten', icon: '📖', url: 'https://lasjakten.vercel.app' },
];

export const JaktLinks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer pointer-events-auto select-none"
      >
        <span>🔗</span>
        <span>Jaktlänkar</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 min-w-[200px] z-[9999]">
          {JAKT_APPS.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">{app.icon}</span>
              <span className="text-slate-700 dark:text-slate-200 font-medium">{app.name}</span>
              <span className="text-slate-400 ml-auto">↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
