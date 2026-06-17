import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { TEMAN } from '../data/teman'
import type { Tema } from '../types'

const LS_KEY = 'fritids_egna_teman'

function laddaEgna(): Tema[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    // Tål gamla sparade teman som hade fältet "aldersgrupper".
    return (JSON.parse(raw) as Tema[]).map((t) => ({
      id: t.id,
      namn: t.namn,
      emoji: t.emoji,
      aktiviteter: t.aktiviteter ?? [],
    }))
  } catch {
    return []
  }
}

export default function Temabanken() {
  const [egna, setEgna] = useState<Tema[]>(laddaEgna)
  const [valtId, setValtId] = useState<string | null>(null)
  const [visaForm, setVisaForm] = useState(false)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(egna))
  }, [egna])

  const allaTeman = useMemo(() => [...TEMAN, ...egna], [egna])
  const valt = allaTeman.find((t) => t.id === valtId) ?? null

  function laggTill(namn: string, emoji: string, aktTexter: string[]) {
    const nytt: Tema = {
      id: `eget-${Date.now()}`,
      namn,
      emoji: emoji || '⭐',
      aktiviteter: aktTexter
        .filter((t) => t.trim())
        .map((t) => ({ titel: t.trim(), beskrivning: '' })),
    }
    setEgna((e) => [...e, nytt])
    setVisaForm(false)
    setValtId(nytt.id)
  }

  function taBort(id: string) {
    setEgna((e) => e.filter((t) => t.id !== id))
    if (valtId === id) setValtId(null)
  }

  return (
    <div className="animate-slide-up space-y-5">
      <div className="no-print">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-slate-600">Välj tema</div>
          <button onClick={() => setVisaForm(true)} className="btn-soft !py-1.5 !px-3 flex items-center gap-1 text-sm">
            <Plus size={16} /> Eget tema
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {allaTeman.map((t) => {
            const eget = t.id.startsWith('eget-')
            return (
              <button
                key={t.id}
                onClick={() => setValtId(t.id)}
                className={`card p-3 text-left flex items-center gap-3 transition-all hover:shadow-lg ${
                  valtId === t.id ? 'ring-2 ring-brand-400' : ''
                }`}
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="font-bold text-slate-800 flex-1">{t.namn}</span>
                {eget && (
                  <span
                    onClick={(e) => { e.stopPropagation(); taBort(t.id) }}
                    className="text-slate-300 hover:text-rose-500 p-1"
                    aria-label="Ta bort tema"
                  >
                    <Trash2 size={16} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {valt && (
        <div className="card p-4 animate-pop">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{valt.emoji}</span>
            <h2 className="text-lg font-black text-brand-800">{valt.namn}</h2>
          </div>
          <ul className="space-y-2">
            {valt.aktiviteter.map((a, i) => (
              <li key={i} className="rounded-xl bg-brand-50/60 p-3">
                <div className="font-bold text-slate-800">{a.titel}</div>
                {a.beskrivning && <div className="text-sm text-slate-600">{a.beskrivning}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {visaForm && <EgetTemaForm onClose={() => setVisaForm(false)} onSpara={laggTill} />}
    </div>
  )
}

function EgetTemaForm({
  onClose, onSpara,
}: {
  onClose: () => void
  onSpara: (namn: string, emoji: string, akt: string[]) => void
}) {
  const [namn, setNamn] = useState('')
  const [emoji, setEmoji] = useState('')
  const [rader, setRader] = useState<string[]>(['', '', ''])

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="card p-5 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-brand-800">Nytt tema</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🌟"
              maxLength={2}
              className="w-16 text-center text-2xl rounded-xl border border-slate-200 px-2 py-2"
            />
            <input
              value={namn}
              onChange={(e) => setNamn(e.target.value)}
              placeholder="Temats namn"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 font-bold"
            />
          </div>
          <div className="text-sm font-bold text-slate-600">Aktiviteter</div>
          {rader.map((r, i) => (
            <input
              key={i}
              value={r}
              onChange={(e) => setRader((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={`Aktivitet ${i + 1}`}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          ))}
          <button onClick={() => setRader((a) => [...a, ''])} className="text-sm font-bold text-brand-600 flex items-center gap-1">
            <Plus size={14} /> Lägg till rad
          </button>
          <button
            disabled={!namn.trim()}
            onClick={() => onSpara(namn, emoji, rader)}
            className="btn-primary w-full"
          >
            Spara tema
          </button>
        </div>
      </div>
    </div>
  )
}
