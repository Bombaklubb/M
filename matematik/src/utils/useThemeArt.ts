import { useEffect, useState } from 'react';
import { BACKGROUND_MAP } from '../data/shop';
import type { ThemeArt } from '../data/themeArt';

/** Sant om eleven valt minskad rörelse i datorns inställningar. */
export function prefersStill(): boolean {
  return typeof window !== 'undefined'
    && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Bilden för ett tema-id, eller undefined om inget tema är valt.
 *
 * Ritkoden (themeArt.ts) laddas som en egen fil först när ett tema faktiskt
 * visas, så elever som har kvar standardbakgrunden aldrig hämtar den. Elever
 * som valt minskad rörelse får en stillastående bild.
 */
export function useThemeArt(themeId: string | null | undefined): ThemeArt | undefined {
  const [art, setArt] = useState<ThemeArt | undefined>(undefined);

  useEffect(() => {
    const theme = themeId ? BACKGROUND_MAP[themeId] : undefined;
    if (!theme) {
      setArt(undefined);
      return;
    }
    let live = true;
    import('../data/themeArt').then(({ getThemeArt }) => {
      if (live) setArt(getThemeArt(theme.art, prefersStill()));
    });
    return () => { live = false; };
  }, [themeId]);

  return art;
}
