"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/lib/useDarkMode";
import { clearStudent, loadGamification } from "@/lib/storage";
import { getAvatar, type Avatar } from "@/lib/avatars";

function AvatarImg({ av }: { av: Avatar }) {
  const [error, setError] = useState(false);
  if (!av.image || error) return <span className="text-lg leading-none">{av.emoji}</span>;
  return <img src={av.image} alt={av.name} className="w-full h-full object-contain" onError={() => setError(true)} />;
}

import type { StudentData } from "@/lib/types";

interface HeaderProps {
  student: StudentData | null;
  onLogout?: () => void;
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
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity min-w-0 flex-shrink-0 rounded-xl overflow-hidden bg-white dark:bg-gray-900"
        >
          <img
            src="/engelskajakten-logo.png"
            alt="Engelskajakten"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </Link>

        {/* Nav */}
        {student && (
          <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Hemliga kistor – left of points */}
            <Link
              href="/kistor"
              title="Hemliga kistor"
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 border-2 border-amber-400 dark:border-amber-600 hover:border-amber-500 dark:hover:border-amber-400 transition-all touch-manipulation shadow-sm"
            >
              <span className="text-lg leading-none select-none">🏆</span>
              {unopenedChests > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unopenedChests > 9 ? "9+" : unopenedChests}
                </span>
              )}
            </Link>

            {/* Points badge – hidden on xs */}
            <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="text-amber-500 text-sm">⭐</span>
              <span className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">{student.totalPoints}</span>
            </div>

            {/* Student avatar + name – links to Min sida */}
            {(() => {
              const av = getAvatar(student.avatar ?? "ninja");
              return (
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-600">
                    <AvatarImg av={av} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{student.name}</span>
                </Link>
              );
            })()}

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
              aria-label={dark ? "Ljust läge" : "Mörkt läge"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Logga ut */}
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors touch-manipulation"
            >
              Logga ut
            </button>
          </nav>
        )}

        {/* Dark toggle when logged out */}
        {!student && (
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={dark ? "Ljust läge" : "Mörkt läge"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        )}
      </div>
    </header>
  );
}
