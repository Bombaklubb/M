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
      className="backdrop-blur-md sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.94)",
        borderBottom: "3px solid rgba(220,38,38,0.75)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)"
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
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
          <nav className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Hemliga kistor button */}
            <Link
              href="/kistor"
              title="Hemliga kistor"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:scale-110 transition-all touch-manipulation cursor-pointer"
              style={{
                background: "rgba(10,36,99,0.06)",
                border: "1px solid rgba(10,36,99,0.1)",
              }}
            >
              <span className="text-lg leading-none select-none">🏆</span>
              {unopenedChests > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unopenedChests > 9 ? "9+" : unopenedChests}
                </span>
              )}
            </Link>

            {/* Points badge */}
            <div
              className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-default transition-all hover:scale-105"
              style={{
                background: "rgba(10,36,99,0.06)",
                border: "1px solid rgba(10,36,99,0.1)",
              }}
            >
              <span className="text-amber-500 text-base">⭐</span>
              <NumberTicker
                value={student.totalPoints}
                className="text-sm font-bold text-amber-600"
                duration={600}
              />
            </div>

            {/* Student avatar + name – links to profile */}
            {(() => {
              const av = getAvatar(student.avatar ?? "ninja");
              return (
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer"
                  style={{ borderRadius: "12px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(10,36,99,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div
                    className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(10,36,99,0.06)", border: "1px solid rgba(10,36,99,0.12)" }}
                  >
                    <AvatarImg av={av} />
                  </div>
                  <span className="text-sm font-bold text-blue-900/80">{student.name}</span>
                </Link>
              );
            })()}

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-blue-900/40 hover:text-blue-900/70 hover:bg-blue-900/05 transition-all touch-manipulation cursor-pointer"
              aria-label={dark ? "Ljust läge" : "Mörkt läge"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Logga ut */}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 rounded-xl text-sm font-bold text-blue-900/40 hover:text-red-600 hover:bg-red-500/10 transition-all touch-manipulation cursor-pointer"
            >
              Logga ut
            </button>
          </nav>
        )}

        {/* Dark toggle when logged out */}
        {!student && (
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-blue-900/40 hover:text-blue-900/70 transition-all cursor-pointer"
            aria-label={dark ? "Ljust läge" : "Mörkt läge"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        )}
      </div>
    </header>
  );
}
