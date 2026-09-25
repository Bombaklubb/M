import { useEffect, useState } from 'react';
import { SHOP_THEMES, THEME_MAP, type ShopTheme } from '../data/shop';
import type { ThemeArt } from './themeArt';

/**
 * Bilder för butikens teman.
 *
 * Ritkoden i themeArt.ts är stor, och de flesta elever har kvar
 * standardbakgrunden. Den laddas därför med import() först när ett tema
 * faktiskt används, så att den hamnar i en egen fil som bara hämtas då.
 *
 * Elever som bett datorn om mindre rörelse får stillastående bilder. Bara de
 * legendariska temana rör sig över huvud taget.
 */

function minskadRorelse(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

function aldreBild(tema: ShopTheme): ThemeArt | undefined {
  return tema.background ? { bg: tema.background, preview: tema.background } : undefined;
}

/** Bilden för ett tema-id, eller undefined om inget tema är valt. */
export function useTemaBild(themeId: string | null | undefined): ThemeArt | undefined {
  const [bild, setBild] = useState<ThemeArt | undefined>(undefined);

  useEffect(() => {
    const tema = themeId ? THEME_MAP[themeId] : undefined;
    if (!tema) {
      setBild(undefined);
      return;
    }
    if (!tema.art) {
      setBild(aldreBild(tema));
      return;
    }
    let levande = true;
    const stilla = minskadRorelse();
    import('./themeArt').then(({ getThemeArt }) => {
      if (levande) setBild(getThemeArt(tema.art, stilla));
    });
    return () => {
      levande = false;
    };
  }, [themeId]);

  return bild;
}

/**
 * Förhandsvisningar för alla teman, till butikens rutnät. Tomt tills
 * ritkoden laddats; korten visar då en neutral platta så att rutnätet inte
 * hoppar.
 */
export function useAllaTemabilder(): Record<string, string> {
  const [bilder, setBilder] = useState<Record<string, string>>({});

  useEffect(() => {
    let levande = true;
    import('./themeArt').then(({ getThemeArt }) => {
      if (!levande) return;
      const ut: Record<string, string> = {};
      for (const tema of SHOP_THEMES) {
        const b = tema.art ? getThemeArt(tema.art, true) : aldreBild(tema);
        if (b) ut[tema.id] = b.preview;
      }
      setBilder(ut);
    });
    return () => {
      levande = false;
    };
  }, []);

  return bilder;
}
