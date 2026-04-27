import { useState, useRef, useEffect } from 'react';

function FlagSE() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 13" className="w-7 h-[18px] rounded-sm">
      <rect width="20" height="13" fill="#006AA7" />
      <rect x="5.5" width="2.5" height="13" fill="#FECC02" />
      <rect y="4.75" width="20" height="3.5" fill="#FECC02" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-7 h-[18px] rounded-sm">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const APPS = [
  {
    name: 'Läsjakten',
    url: 'https://lasjakten.vercel.app',
    icon: <span className="text-3xl leading-none">📚</span>,
  },
  {
    name: 'Engelskajakten',
    url: 'https://engelskajakten.vercel.app',
    icon: <FlagGB />,
  },
  {
    name: 'Svenskajakten',
    url: 'https://svenskajakten.vercel.app',
    icon: <FlagSE />,
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
        <div
          className="absolute bottom-8 right-0 mb-1 bg-white rounded-2xl shadow-2xl overflow-hidden w-56"
          style={{ border: '1px solid rgba(0,0,0,0.08)' }}
        >
          {APPS.map((app, i) => (
            <a
              key={app.url}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}
              onClick={() => setOpen(false)}
            >
              <span className="flex-shrink-0 flex items-center">{app.icon}</span>
              <span className="flex-1 text-[15px] font-bold text-gray-800">{app.name}</span>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        Jaktlänkar
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
