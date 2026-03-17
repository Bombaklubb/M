"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/lib/useDarkMode";
import { clearStudent, loadGamification } from "@/lib/storage";
import { getAvatar, type Avatar } from "@/lib/avatars";
import type { StudentData } from "@/lib/types";

function AvatarImg({ av }: { av: Avatar }) {
  const [error, setError] = useState(false);
  if (!av.image || error) return <span className="text-lg leading-none">{av.emoji}</span>;
  return <img src={av.image} alt={av.name} className="w-full h-full object-contain" onError={() => setError(true)} />;
}

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
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-en-100 dark:border-gray-700 sticky top-0 z-50"
      style={{
        boxShadow: "0 4px 0 0 rgba(37, 99, 235, 0.06), 0 6px 12px -4px rgba(37, 99, 235, 0.08)"
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:scale-105 transition-transform min-w-0 flex-shrink-0"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1e40af)",
              boxShadow: "0 3px 0 0 rgba(30,64,175,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
            }}
          >
            🇬🇧
          </div>
          <span className="font-black text-xl text-en-800 dark:text-white hidden sm:block tracking-tight">
            Engelskajakten
          </span>
        </Link>

        {/* Nav */}
        {student && (
          <nav className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Kistor */}
            <Link
              href="/kistor"
              title="Hemliga kistor"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-600 hover:border-amber-400 hover:scale-110 transition-all touch-manipulation cursor-pointer"
              style={{ boxShadow: "0 3px 0 0 rgba(245, 158, 11, 0.2), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)" }}
            >
              <span className="text-lg leading-none select-none">🏆</span>
              {unopenedChests > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unopenedChests > 9 ? "9+" : unopenedChests}
                </span>
              )}
            </Link>

            {/* Points */}
            <div
              className="hidden xs:flex items-center gap-1.5 bg-gradient-to-b from-amber-50 to-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-xl cursor-default"
              style={{ boxShadow: "0 3px 0 0 rgba(245, 158, 11, 0.25), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)" }}
            >
              <span className="text-amber-500 text-base">⭐</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{student.totalPoints}</span>
            </div>

            {/* Avatar */}
            {(() => {
              const av = getAvatar(student.avatar ?? "ninja");
              return (
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-en-50 dark:hover:bg-gray-800 transition-all cursor-pointer border-2 border-transparent hover:border-en-200"
                >
                  <div
                    className="w-9 h-9 rounded-xl overflow-hidden bg-en-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border-2 border-en-200 dark:border-gray-600"
                    style={{ boxShadow: "0 2px 0 0 rgba(37, 99, 235, 0.12)" }}
                  >
                    <AvatarImg av={av} />
                  </div>
                  <span className="text-sm font-bold text-en-700 dark:text-gray-200">{student.name}</span>
                </Link>
              );
            })()}

            {/* Dark mode */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-en-400 dark:text-gray-400 hover:bg-en-50 dark:hover:bg-gray-800 hover:text-en-600 transition-all touch-manipulation cursor-pointer border-2 border-transparent hover:border-en-200"
              aria-label={dark ? "Ljust läge" : "Mörkt läge"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 rounded-xl text-sm font-bold text-en-400 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all touch-manipulation cursor-pointer border-2 border-transparent hover:border-red-200"
            >
              Logga ut
            </button>
          </nav>
        )}

        {!student && (
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-en-400 dark:text-gray-400 hover:bg-en-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            aria-label={dark ? "Ljust läge" : "Mörkt läge"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        )}
      </div>
    </header>
  );
}
