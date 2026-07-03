import type { Tema } from '../types'

// Generell hjälpare: läs JSON från localStorage med fallback vid fel/saknat värde.
export function lasLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

// Delad lagring/laddning av pedagogens egna teman (Temabanken + Veckoplaneraren).
export const EGNA_TEMAN_KEY = 'fritids_egna_teman'

export function laddaEgnaTeman(): Tema[] {
  try {
    const raw = localStorage.getItem(EGNA_TEMAN_KEY)
    if (!raw) return []
    // Tål gamla sparade teman som hade fältet "aldersgrupper".
    return (JSON.parse(raw) as Tema[]).map((t) => ({
      id: t.id,
      namn: t.namn,
      emoji: t.emoji,
      aktiviteter: t.aktiviteter ?? [],
      laroplan: t.laroplan,
    }))
  } catch {
    return []
  }
}
