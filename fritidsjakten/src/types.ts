// Gemensamma typer för Fritidsjakten

export type Aldersgrupp = 'F' | '1-3' | '4-6'

// Modul 1 – Temabanken
export interface TemaAktivitet {
  titel: string
  beskrivning: string
}

export interface Tema {
  id: string
  namn: string
  emoji: string
  aldersgrupper: Aldersgrupp[]
  aktiviteter: TemaAktivitet[]
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
