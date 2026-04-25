import { useState, useRef, useEffect } from 'react';

const APPS = [
  {
    name: 'Läsjakten',
    url: 'https://lasjakten.vercel.app',
    icon: 'https://lasjakten.vercel.app/lasjakten-logo.png',
  },
  {
    name: 'Engelskajakten',
    url: 'https://engelskajakten.vercel.app',
    icon: 'https://engelskajakten.vercel.app/engelskajakten-logo.png',
  },
  {
    name: 'Svenskajakten',
    url: 'https://svenskajakten.vercel.app',
    icon: 'https://svenskajakten.vercel.app/svenskajakten-logo.png',
  },
];

export default function JaktlankarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const shadowStyle = { textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)' };

  return (
    <div ref={ref} className="fixed bottom-2 right-3 z-40">
      {open && (
        <div className="absolute bottom-8 right-0 mb-1 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-w-[190px]">
          {APPS.map(app => (
            <a
              key={app.url}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              <img src={app.icon} alt={app.name} className="w-6 h-6 rounded object-contain" />
              <span className="flex-1">{app.name}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-white/90 text-xs font-semibold cursor-pointer"
        style={shadowStyle}
      >
        🗺️ Jaktlänkar
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
