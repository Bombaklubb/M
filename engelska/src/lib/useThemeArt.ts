"use client";

import { useEffect, useState } from "react";
import { THEME_MAP } from "@/lib/shop";
import type { ThemeArt } from "@/lib/themeArt";

/**
 * Bilden för ett tema-id, eller undefined om inget tema är valt.
 *
 * Ritkoden laddas först när ett tema faktiskt används, så elever som har kvar
 * standardbakgrunden aldrig hämtar den. Elever som valt minskad rörelse i
 * datorns inställningar får en stillastående bild.
 */
export function useThemeArt(themeId: string | null | undefined): ThemeArt | undefined {
  const [art, setArt] = useState<ThemeArt | undefined>(undefined);

  useEffect(() => {
    const theme = themeId ? THEME_MAP[themeId] : undefined;
    if (!theme) {
      setArt(undefined);
      return;
    }
    const still =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let live = true;
    import("@/lib/themeArt").then(({ getThemeArt }) => {
      if (live) setArt(getThemeArt(theme.art, still));
    });
    return () => {
      live = false;
    };
  }, [themeId]);

  return art;
}
