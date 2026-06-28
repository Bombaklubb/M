// Theme visuals: emoji + gradient used for image fallback banners and accents.
// Keys match the `theme` field in library.json (English, lowercase).
// (Banners audited 2026-06: art/psychology/everyday-life added; mismatches fixed.)

export interface ThemeVisual {
  emoji: string;
  gradient: string; // tailwind gradient stops
  label: string;
}

const THEME_VISUALS: Record<string, ThemeVisual> = {
  animals: { emoji: '🐾', gradient: 'from-amber-400 to-orange-500', label: 'Animals' },
  art: { emoji: '🖼️', gradient: 'from-rose-400 to-fuchsia-500', label: 'Art' },
  community: { emoji: '🤝', gradient: 'from-sky-400 to-blue-500', label: 'Community' },
  culture: { emoji: '🎨', gradient: 'from-fuchsia-400 to-pink-500', label: 'Culture' },
  environment: { emoji: '🌿', gradient: 'from-emerald-400 to-teal-500', label: 'Environment' },
  'everyday life': { emoji: '🌟', gradient: 'from-amber-400 to-yellow-500', label: 'Everyday life' },
  family: { emoji: '👨‍👩‍👧', gradient: 'from-rose-400 to-pink-500', label: 'Family' },
  'food-science': { emoji: '🍫', gradient: 'from-amber-500 to-yellow-600', label: 'Food science' },
  friendship: { emoji: '😊', gradient: 'from-orange-400 to-rose-500', label: 'Friendship' },
  health: { emoji: '💪', gradient: 'from-lime-400 to-emerald-500', label: 'Health' },
  history: { emoji: '🏛️', gradient: 'from-stone-400 to-amber-600', label: 'History' },
  literature: { emoji: '📚', gradient: 'from-indigo-400 to-violet-500', label: 'Literature' },
  music: { emoji: '🎵', gradient: 'from-violet-400 to-purple-500', label: 'Music' },
  nature: { emoji: '🏕️', gradient: 'from-green-400 to-emerald-500', label: 'Nature' },
  psychology: { emoji: '🧠', gradient: 'from-purple-400 to-indigo-500', label: 'Psychology' },
  science: { emoji: '🔬', gradient: 'from-cyan-400 to-blue-500', label: 'Science' },
  society: { emoji: '🏙️', gradient: 'from-slate-400 to-slate-600', label: 'Society' },
  sports: { emoji: '⚽', gradient: 'from-blue-400 to-indigo-500', label: 'Sports' },
  technology: { emoji: '🤖', gradient: 'from-cyan-400 to-indigo-500', label: 'Technology' },
};

const DEFAULT_VISUAL: ThemeVisual = {
  emoji: '📖',
  gradient: 'from-indigo-400 to-violet-500',
  label: 'Reading',
};

export function getThemeVisual(theme?: string, genre?: string): ThemeVisual {
  if (theme && THEME_VISUALS[theme]) return THEME_VISUALS[theme];
  if (genre === 'non-fiction') return { emoji: '📰', gradient: 'from-sky-400 to-blue-500', label: 'Non-fiction' };
  return DEFAULT_VISUAL;
}
