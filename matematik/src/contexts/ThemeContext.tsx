import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSize = 'sm' | 'md' | 'lg';

interface ThemeContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme-dark') === 'true'
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    () => (localStorage.getItem('theme-size') as FontSize) || 'md'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
    localStorage.setItem('theme-size', fontSize);
  }, [fontSize]);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);
  const setFontSize = useCallback((size: FontSize) => setFontSizeState(size), []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
