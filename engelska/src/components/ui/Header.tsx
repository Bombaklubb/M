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
    <header
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-3 border-indigo-100 dark:border-gray-700 sticky top-0 z-50"
      style={{
        boxShadow: "0 4px 0 0 rgba(99, 102, 241, 0.08), 0 6px 12px -4px rgba(99, 102, 241, 0.1)"
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:scale-105 transition-transform min-w-0 flex-shrink-0 rounded-xl overflow-hidden"
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
          <nav className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Hero button – left of points */}
            <Link
              href="/hero"
              title="Min hjälte"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-900/40 dark:to-sky-800/20 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500 hover:scale-110 transition-all overflow-hidden touch-manipulation cursor-pointer"
              style={{
                boxShadow: "0 3px 0 0 rgba(14, 165, 233, 0.2), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
              }}
            >
              <img
                src={heroDbUrl(
                  student.hero?.heroId ?? "explorer",
                  student.hero?.skinTone ?? "light",
                  student.hero?.gender ?? "boy"
                )}
                alt="Min hjälte"
                className="w-10 h-10 object-cover"
              />
            </Link>

            {/* Points badge – hidden on xs */}
            <div
              className="hidden xs:flex items-center gap-1.5 bg-gradient-to-b from-amber-50 to-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-xl cursor-default"
              style={{
                boxShadow: "0 3px 0 0 rgba(245, 158, 11, 0.25), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
              }}
            >
              <span className="text-amber-500 text-base">⭐</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{student.totalPoints}</span>
            </div>

            {/* Student avatar + name – links to Min sida */}
            {(() => {
              const av = getAvatar(student.avatar ?? "ninja");
              return (
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all cursor-pointer border-2 border-transparent hover:border-indigo-200"
                >
                  <div
                    className="w-9 h-9 rounded-xl overflow-hidden bg-indigo-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border-2 border-indigo-200 dark:border-gray-600"
                    style={{ boxShadow: "0 2px 0 0 rgba(99, 102, 241, 0.15)" }}
                  >
                    <AvatarImg av={av} />
                  </div>
                  <span className="text-sm font-bold text-indigo-700 dark:text-gray-200">{student.name}</span>
                </Link>
              );
            })()}

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-indigo-400 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 transition-all touch-manipulation cursor-pointer border-2 border-transparent hover:border-indigo-200"
              aria-label={dark ? "Ljust läge" : "Mörkt läge"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Logga ut */}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 rounded-xl text-sm font-bold text-indigo-400 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all touch-manipulation cursor-pointer border-2 border-transparent hover:border-red-200"
            >
              Logga ut
            </button>
          </nav>
        )}

        {/* Dark toggle when logged out */}
        {!student && (
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-indigo-400 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            aria-label={dark ? "Ljust läge" : "Mörkt läge"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        )}
      </div>
    </header>
  );
}
