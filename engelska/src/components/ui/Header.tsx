"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/lib/useDarkMode";
import { clearStudent, loadGamification } from "@/lib/storage";
import { getAvatar, type Avatar } from "@/lib/avatars";
import type { StudentData } from "@/lib/types";
import { NumberTicker } from "@/components/magicui/number-ticker";

function AvatarImg({ av }: { av: Avatar }) {
  const [error, setError] = useState(false);
  if (!av.image || error) return <span className="text-lg leading-none">{av.emoji}</span>;
  return <img src={av.image} alt={av.name} className="w-full h-full object-contain" onError={() => setError(true)} />;
}

interface HeaderProps {
  student: StudentData | null;
  onLogout?: () => void;
}

// Inline SVG icons — no emojis
function IconTrophy({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path d="M12 17c-4 0-7-3-7-7V5h14v5c0 4-3 7-7 7z" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconSun({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconLogOut({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Header({ student, onLogout }: HeaderProps) {
  const router = useRouter();
  const { dark, toggle } = useDarkMode();
  const [unopenedChests, setUnopenedChests] = useState(0);

  useEffect(() => {
    if (!student) return;
    const gam = loadGamification();
    setUnopenedChests(gam.chests.filter((c) => !c.opened).length);
  }, [student]);

  function handleLogout() {
    if (onLogout) {
      onLogout();
    } else {
      clearStudent();
      router.push("/");
    }
  }

  return (
    <header
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-en-100 dark:border-gray-700 sticky top-0 z-50"
      style={{
        boxShadow: "0 4px 0 0 rgba(37, 99, 235, 0.06), 0 6px 16px -4px rgba(37, 99, 235, 0.1)"
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:scale-105 transition-transform min-w-0 flex-shrink-0"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1e40af)",
              boxShadow: "0 3px 0 0 rgba(30,64,175,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
            }}
          >
            <img src="/engelskajakten-logo.png" alt="Engelskajakten" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-xl text-en-800 dark:text-white hidden sm:block tracking-tight">
            Engelskajakten
          </span>
        </Link>

        {/* Nav */}
        {student && (
          <nav className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">

            {/* Kistor */}
            <Link
              href="/kistor"
              title="Hemliga kistor"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-600 hover:border-amber-400 hover:scale-110 transition-all touch-manipulation cursor-pointer text-amber-600 dark:text-amber-400"
              style={{ boxShadow: "0 3px 0 0 rgba(245, 158, 11, 0.2), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)" }}
            >
              <IconTrophy className="w-5 h-5" />
              {unopenedChests > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unopenedChests > 9 ? "9+" : unopenedChests}
                </span>
              )}
            </Link>

            {/* Points */}
            <div
              className="hidden xs:flex items-center gap-1.5 bg-gradient-to-b from-amber-50 to-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-xl cursor-default"
              style={{ boxShadow: "0 3px 0 0 rgba(245, 158, 11, 0.25), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)" }}
            >
              <IconStar className="w-4 h-4 text-amber-500" />
              <NumberTicker value={student.totalPoints} className="text-sm font-black text-amber-700 dark:text-amber-400" duration={800} />
            </div>

            {/* Avatar + name */}
            {(() => {
              const av = getAvatar(student.avatar ?? "ninja");
              return (
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-en-50 dark:hover:bg-gray-800 transition-all cursor-pointer border-2 border-transparent hover:border-en-200"
                >
                  <div
                    className="w-8 h-8 rounded-xl overflow-hidden bg-en-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border-2 border-en-200 dark:border-gray-600"
                    style={{ boxShadow: "0 2px 0 0 rgba(37, 99, 235, 0.12)" }}
                  >
                    <AvatarImg av={av} />
                  </div>
                  <span className="text-sm font-bold text-en-700 dark:text-gray-200">{student.name}</span>
                </Link>
              );
            })()}

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-en-400 dark:text-gray-400 hover:bg-en-50 dark:hover:bg-gray-800 hover:text-en-600 dark:hover:text-gray-200 transition-all touch-manipulation cursor-pointer border-2 border-transparent hover:border-en-200"
              aria-label={dark ? "Ljust läge" : "Mörkt läge"}
            >
              {dark ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-en-400 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all touch-manipulation cursor-pointer border-2 border-transparent hover:border-red-200"
            >
              <IconLogOut className="w-4 h-4" />
              <span>Logga ut</span>
            </button>

            {/* Mobile logout (icon only) */}
            <button
              onClick={handleLogout}
              className="sm:hidden p-2.5 rounded-xl text-en-400 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all touch-manipulation cursor-pointer border-2 border-transparent hover:border-red-200"
              aria-label="Logga ut"
            >
              <IconLogOut className="w-5 h-5" />
            </button>
          </nav>
        )}

        {!student && (
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-en-400 dark:text-gray-400 hover:bg-en-50 dark:hover:bg-gray-800 hover:text-en-600 transition-all cursor-pointer"
            aria-label={dark ? "Ljust läge" : "Mörkt läge"}
          >
            {dark ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
}
