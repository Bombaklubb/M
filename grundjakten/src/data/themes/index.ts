import type { Theme } from '@/types';
import { getActiveThemeId, getCustomThemes } from '@/lib/storage';
import { CURATED_THEMES } from './curated';

export { CURATED_THEMES };
export { defineTheme, type ThemeInput } from './defineTheme';

/** Färdiga teman plus lärarens egna, i den ordning de visas i lärarläget. */
export function allThemes(): Theme[] {
  return [...CURATED_THEMES, ...getCustomThemes()];
}

export function themeById(id: string | null): Theme | null {
  if (!id) return null;
  return allThemes().find((t) => t.id === id) ?? null;
}

/**
 * Temat klassen jobbar med just nu.
 *
 * Är inget valt returneras null – då visar temaskärmen en tydlig uppmaning
 * till läraren i stället för en tom övning.
 */
export function activeTheme(): Theme | null {
  return themeById(getActiveThemeId());
}
