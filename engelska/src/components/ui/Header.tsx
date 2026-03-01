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
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors"
        >
          <span className="text-2xl">🎯</span>
          <span>Engelskajakten</span>
        </Link>

        {/* Nav */}
        {student && (
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🗺️ Världar
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/profile" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              👤 Min sida
            </Link>

            {/* Points badge */}
            <div className="ml-2 flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              <span className="text-amber-500">⭐</span>
              <span className="text-sm font-bold text-amber-700">{student.totalPoints}</span>
            </div>

            {/* Student name + logout */}
            <div className="flex items-center gap-2 ml-1">
              <span className="text-sm text-gray-600 hidden sm:block">
                Hej, <strong>{student.name}</strong>!
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
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
