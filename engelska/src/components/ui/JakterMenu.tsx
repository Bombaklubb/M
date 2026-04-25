"use client";

import { useState, useRef, useEffect } from "react";

const APPS = [
  {
    label: "Läsjakten",
    url: "https://lasjakten.vercel.app",
    favicon: "https://lasjakten.vercel.app/favicon.svg",
  },
  {
    label: "Mattejakten",
    url: "https://mattejakten.vercel.app",
    favicon: "https://mattejakten.vercel.app/favicon.svg",
  },
  {
    label: "Svenskajakten",
    url: "https://svenskajakten.vercel.app",
    favicon: "https://svenskajakten.vercel.app/favicon.svg",
  },
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
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2.5 pb-1">
            Martins appar
          </p>
          {APPS.map((app) => (
            <a
              key={app.url}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
              onClick={() => setOpen(false)}
            >
              <img
                src={app.favicon}
                alt=""
                width={18}
                height={18}
                className="rounded-sm shrink-0"
              />
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
