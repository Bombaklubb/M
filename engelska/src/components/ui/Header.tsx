"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDarkMode } from "@/lib/useDarkMode";
import { clearStudent } from "@/lib/storage";
import type { StudentData } from "@/lib/types";

interface HeaderProps {
  student: StudentData | null;
  onLogout?: () => void;
}

export default function Header({ student, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { dark, toggle } = useDarkMode();

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
          className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🔭</span>
          <span>Engelskajakten</span>
        </Link>

        {/* Nav */}
        {student && (
          <nav className="flex items-center gap-2">
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/profile"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              👤 Min sida
            </Link>

            {/* Points badge */}
            <div className="ml-1 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-3 py-1.5 rounded-full">
              <span className="text-amber-500">⭐</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{student.totalPoints}</span>
            </div>

            {/* Student name */}
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block ml-1">
              Hej, <strong>{student.name}</strong>!
            </span>

            {/* Logga ut */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Logga ut
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={dark ? "Ljust läge" : "Mörkt läge"}
            >
              {dark ? "☀️" : "🌙"}
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
