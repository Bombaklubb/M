// Gemensamma typer för Fritidsjakten

// Modul 1 – Temabanken
export interface TemaAktivitet {
  titel: string
  beskrivning: string
}

export interface Tema {
  id: string
  namn: string
  emoji: string
  aktiviteter: TemaAktivitet[]
  // Valfri koppling till Lgr22 (fritidshemmets centrala innehåll och/eller kursplaner).
  laroplan?: string
}

// Modul 2 – Aktivitetsgeneratorn / Veckoplaneraren
export type Plats = 'inne' | 'ute'
export type Kategori =
  | 'rörelse'
  | 'samarbete'
  | 'skapande'
  | 'lugn'
  | 'quiz'
  | 'natur'

export interface Aktivitet {
  id: string
  namn: string
  beskrivning: string
  platser: Plats[]
  minElever: number
  maxElever: number
  minMinuter: number
  maxMinuter: number
  material: string[] // tomt = inget material behövs
  kategori: Kategori
}

// Modul 3 – Dagens kompisuppdrag
export interface Kompisuppdrag {
  id: number
  text: string
}

// Modul 4 – Uppdragskort
export interface Uppdragskort {
  kategori: string
  emoji: string
  farg: string // tailwind gradient-klasser
  uppdrag: string[]
}

// Modul 6 – Rörelsebanken
export interface Rorelselek {
  namn: string
  beskrivning: string
}

export interface RorelseKategori {
  namn: string
  emoji: string
  lekar: Rorelselek[]
}

// Modul 7 – Temadagar (färdiga veckoupplägg för högtider/temadagar)
export interface TemadagDag {
  dag: string
  titel: string
  beskrivning: string
}

export interface Temadag {
  id: string
  namn: string
  emoji: string
  beskrivning: string
  laroplan?: string
  dagar: TemadagDag[]
}

// Modul 8 – Värdegrundskort (diskussionsfrågor och dilemman)
export interface VardegrundKategori {
  kategori: string
  emoji: string
  farg: string
  fragor: string[]
}
