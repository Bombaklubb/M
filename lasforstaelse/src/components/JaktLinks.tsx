import React, { useState, useRef, useEffect } from 'react';

const SwedishFlag = () => (
  <svg viewBox="0 0 16 10" className="w-6 h-4 rounded-sm">
    <rect width="16" height="10" fill="#006AA7"/>
    <rect x="5" width="2" height="10" fill="#FECC00"/>
    <rect y="4" width="16" height="2" fill="#FECC00"/>
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 60 30" className="w-6 h-4 rounded-sm">
    <rect width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const MathIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" className="stroke-purple-500"/>
    <path d="M8 12h8M12 8v8" className="stroke-purple-500"/>
    <circle cx="7" cy="7" r="1" className="fill-purple-500 stroke-none"/>
    <circle cx="17" cy="17" r="1" className="fill-purple-500 stroke-none"/>
  </svg>
);

const ReadhuntIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#10b981" strokeWidth="2"/>
    <path d="M8 7h8M8 11h6" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const JAKT_APPS = [
  { name: 'Svenskajakten', icon: <SwedishFlag />, url: 'https://svenskajakten.vercel.app' },
  { name: 'Mattejakten', icon: <MathIcon />, url: 'https://mattejakten.vercel.app' },
  { name: 'Engelskajakten', icon: <UKFlag />, url: 'https://engelskajakten.vercel.app' },
  { name: 'Readhunt', icon: <ReadhuntIcon />, url: 'https://readhunt.vercel.app' },
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
        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer pointer-events-auto select-none"
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
              <span className="flex items-center justify-center w-6 h-6">{app.icon}</span>
              <span className="text-slate-700 dark:text-slate-200 font-medium">{app.name}</span>
              <span className="text-slate-400 ml-auto">↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
