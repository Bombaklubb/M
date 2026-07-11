import { useMemo, useState } from 'react'
import { Zap, HeartHandshake, Clock, MapPin, Package, Users } from 'lucide-react'
import { AKTIVITETER } from '../data/aktiviteter'
import { KOMPISUPPDRAG } from '../data/kompisuppdrag'
import { lasLS } from '../lib/egnaTeman'
import type { Aktivitet, Kompisuppdrag, Plats } from '../types'

// Samma filterform som Aktivitetsgeneratorn sparar (fritids_generator_filter).
interface SparadeFilter {
  plats: Plats | 'alla'
  elever: number
  minuter: number
  valtMaterial: string[]
  endastUtanMaterial: boolean
}

// Dagnummer på året – används för att dagens innehåll ska vara samma hela dagen.
function dagensDagNr(): number {
  const nu = new Date()
  const start = new Date(nu.getFullYear(), 0, 0)
  return Math.floor((nu.getTime() - start.getTime()) / 86_400_000)
}

// Aktiviteter som matchar de sparade filtren (samma logik som generatorn).
function matchande(filter: Partial<SparadeFilter>): Aktivitet[] {
  const plats = filter.plats ?? 'alla'
  const elever = filter.elever ?? 25
  const minuter = filter.minuter ?? 20
  const traffar = AKTIVITETER.filter((a) => {
    if (plats !== 'alla' && !a.platser.includes(plats)) return false
    if (elever < a.minElever || elever > a.maxElever) return false
    if (minuter < a.minMinuter) return false
    if (filter.endastUtanMaterial && a.material.length > 0) return false
    return true
  })
  return traffar.length ? traffar : AKTIVITETER
}

function AktivitetsRad({ a }: { a: Aktivitet }) {
  return (
    <div className="rounded-xl bg-white/70 p-3">
      <div className="font-bold text-slate-800">{a.namn}</div>
      <p className="text-sm text-slate-600">{a.beskrivning}</p>
      <div className="flex gap-3 flex-wrap text-xs text-slate-500 mt-1.5">
        <span className="flex items-center gap-1"><MapPin size={12} /> {a.platser.join(' / ')}</span>
        <span className="flex items-center gap-1"><Users size={12} /> {a.minElever}–{a.maxElever}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {a.minMinuter}–{a.maxMinuter} min</span>
        <span className="flex items-center gap-1"><Package size={12} /> {a.material.length ? a.material.join(', ') : 'inget'}</span>
      </div>
    </div>
  )
}

export default function IdagPanel({ onOppnaKompisuppdrag }: { onOppnaKompisuppdrag: () => void }) {
  const dagNr = dagensDagNr()

  // Dagens kompisuppdrag – samma uträkning som i Kompisuppdrag-modulen.
  const dagensUppdrag = useMemo(() => {
    const egna = lasLS<Kompisuppdrag[]>('fritids_egna_uppdrag', [])
    const alla = [...KOMPISUPPDRAG, ...egna]
    return alla[(dagNr % KOMPISUPPDRAG.length) % alla.length]
  }, [dagNr])

  // Tre dagsförslag utifrån sparade filter – stabila under dagen.
  const filter = useMemo(() => lasLS<Partial<SparadeFilter>>('fritids_generator_filter', {}), [])
  const kandidater = useMemo(() => matchande(filter), [filter])
  const forslag = useMemo(
    () => [0, 1, 2].map((i) => kandidater[(dagNr * 3 + i) % kandidater.length]),
    [kandidater, dagNr],
  )

  // "Ge mig en lek NU" – slumpa direkt, utan att lämna startsidan.
  const [nu, setNu] = useState<Aktivitet | null>(null)

  function slumpaNu() {
    let val = nu
    while ((val === nu || val === null) && kandidater.length > 1) {
      val = kandidater[Math.floor(Math.random() * kandidater.length)]
      if (nu === null) break
    }
    setNu(val ?? kandidater[0])
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Ge mig en lek NU */}
      <button
        onClick={slumpaNu}
        className="w-full rounded-2xl p-5 text-white font-black text-xl shadow-lg transition-all active:scale-[0.98] hover:shadow-xl flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 60%, #ef4444 100%)' }}
      >
        <Zap size={26} /> {nu ? 'Ge mig en annan lek!' : 'Ge mig en lek NU'}
      </button>

      {nu && (
        <div className="card p-4 animate-pop border-2 !border-orange-300">
          <div className="text-xs font-bold uppercase tracking-wide text-orange-500 mb-1">Kör den här!</div>
          <AktivitetsRad a={nu} />
        </div>
      )}

      {/* Dagens kompisuppdrag */}
      <button
        onClick={onOppnaKompisuppdrag}
        className="card p-4 w-full text-left flex items-center gap-3 hover:shadow-lg transition-all bg-gradient-to-br from-rose-50 to-pink-50"
      >
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white">
          <HeartHandshake size={20} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-rose-500">Dagens kompisuppdrag</div>
          <div className="font-extrabold text-slate-800">{dagensUppdrag.text}</div>
        </div>
      </button>

      {/* Tre dagsförslag */}
      <div className="card p-4">
        <div className="text-xs font-bold uppercase tracking-wide text-brand-500 mb-2">Dagens tre förslag</div>
        <div className="space-y-2">
          {forslag.map((a, i) => <AktivitetsRad key={`${a.id}-${i}`} a={a} />)}
        </div>
      </div>
    </div>
  )
}
