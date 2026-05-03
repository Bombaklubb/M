"use client";

import { useState, useRef, useEffect } from "react";

const SwedishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 11" width="20" height="14" className="rounded-sm shrink-0">
    <rect width="16" height="11" fill="#006AA7"/>
    <rect x="5" width="2" height="11" fill="#FECC02"/>
    <rect y="4" width="16" height="3" fill="#FECC02"/>
  </svg>
);

const APPS = [
  { label: "Läsjakten",    url: "https://lasjakten.vercel.app",    icon: <span className="text-base leading-none">📚</span> },
  { label: "Mattejakten",  url: "https://mattejakten.vercel.app",  icon: <span className="text-base leading-none">🔢</span> },
  { label: "Svenskajakten",url: "https://svenskajakten.vercel.app",icon: <SwedishFlag /> },
];

export default function JakterMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative pointer-events-auto">
      {open && (
        <div className="absolute bottom-7 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden min-w-[190px]">
          {APPS.map((app) => (
            <a
              key={app.url}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
              onClick={() => setOpen(false)}
            >
              {app.icon}
              {app.label}
              <span className="ml-auto text-gray-400 text-[11px]">↗</span>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] font-bold text-white/80 dark:text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        Jaktlänkar ▴
      </button>
    </div>
  );
}
