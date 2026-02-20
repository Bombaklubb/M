import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSize = 'sm' | 'md' | 'lg';

interface ThemeContextValue {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(
    () => (localStorage.getItem('theme-size') as FontSize) || 'md'
  );

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
    localStorage.setItem('theme-size', fontSize);
  }, [fontSize]);

  const setFontSize = useCallback((size: FontSize) => setFontSizeState(size), []);

  return (
    <ThemeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
