"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StudentData } from "@/lib/types";

interface HeaderProps {
  student: StudentData | null;
  onLogout?: () => void;
}

export default function Header({ student, onLogout }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-xl text-white hover:text-sky-100 transition-colors"
        >
          <span className="text-2xl">🎯</span>
          <span>Engelskajakten</span>
        </Link>

        {/* Nav */}
        {student && (
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-white/25 text-white"
                  : "text-white/75 hover:bg-white/15 hover:text-white"
              }`}
            >
              🗺️ Världar
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/profile"
                  ? "bg-white/25 text-white"
                  : "text-white/75 hover:bg-white/15 hover:text-white"
              }`}
            >
              👤 Min sida
            </Link>

            {/* Points badge */}
            <div className="ml-2 flex items-center gap-1.5 bg-amber-400 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-amber-900 text-sm">⭐</span>
              <span className="text-sm font-black text-amber-900">
                {student.totalPoints}
              </span>
            </div>

            {/* Name + logout */}
            <div className="flex items-center gap-1 ml-1.5">
              <span className="text-sm text-white/80 hidden sm:block">
                Hej, <strong className="text-white">{student.name}</strong>!
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-xs text-white/50 hover:text-white hover:bg-white/15 transition-colors px-2 py-1 rounded ml-1"
                >
                  Byt
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
