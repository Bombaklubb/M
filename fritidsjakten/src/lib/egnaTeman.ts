import type { Tema } from '../types'

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
