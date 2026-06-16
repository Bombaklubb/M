import { useMemo, useState } from 'react'
import { Users, Clock, MapPin, Package, RefreshCw } from 'lucide-react'
import { AKTIVITETER } from '../data/aktiviteter'
import type { Plats } from '../types'

// Alla material som förekommer i banken (utöver "inget material").
const ALLT_MATERIAL = Array.from(
  new Set(AKTIVITETER.flatMap((a) => a.material)),
).sort((a, b) => a.localeCompare(b, 'sv'))

export default function Aktivitetsgeneratorn() {
  const [plats, setPlats] = useState<Plats | 'alla'>('alla')
  const [elever, setElever] = useState(25)
  const [minuter, setMinuter] = useState(20)
  const [valtMaterial, setValtMaterial] = useState<string[]>([])
  const [endastUtanMaterial, setEndastUtanMaterial] = useState(false)

  const traffar = useMemo(() => {
    return AKTIVITETER.filter((a) => {
      if (plats !== 'alla' && !a.platser.includes(plats)) return false
      if (elever < a.minElever || elever > a.maxElever) return false
      if (minuter < a.minMinuter) return false
      if (endastUtanMaterial && a.material.length > 0) return false
      // Om material valts: aktivitetens material måste rymmas inom det valda.
      if (valtMaterial.length > 0 && a.material.length > 0) {
        const okej = a.material.every((m) => valtMaterial.includes(m))
        if (!okej) return false
      }
      return true
    })
  }, [plats, elever, minuter, valtMaterial, endastUtanMaterial])

  function toggleMaterial(m: string) {
    setValtMaterial((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]))
  }

  function aterstall() {
    setPlats('alla'); setElever(25); setMinuter(20); setValtMaterial([]); setEndastUtanMaterial(false)
  }

  return (
    <div className="animate-slide-up space-y-5">
      <div className="card p-4 space-y-4">
        {/* Plats */}
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 mb-2">
            <MapPin size={15} /> Plats
          </div>
          <div className="flex gap-2">
            {(['alla', 'inne', 'ute'] as const).map((p) => (
              <button key={p} onClick={() => setPlats(p)} className={`chip ${plats === p ? 'chip-on' : 'chip-off'}`}>
                {p === 'alla' ? 'Alla' : p === 'inne' ? 'Inne' : 'Ute'}
              </button>
            ))}
          </div>
        </div>

        {/* Antal elever */}
        <div>
          <div className="flex items-center justify-between text-sm font-bold text-slate-600 mb-1">
            <span className="flex items-center gap-1.5"><Users size={15} /> Antal elever</span>
            <span className="text-brand-600">{elever} st</span>
          </div>
          <input type="range" min={2} max={40} value={elever} onChange={(e) => setElever(+e.target.value)} className="w-full accent-brand-500" />
        </div>

        {/* Tid */}
        <div>
          <div className="flex items-center justify-between text-sm font-bold text-slate-600 mb-1">
            <span className="flex items-center gap-1.5"><Clock size={15} /> Tid att lägga</span>
            <span className="text-brand-600">{minuter} min</span>
          </div>
          <input type="range" min={5} max={45} step={5} value={minuter} onChange={(e) => setMinuter(+e.target.value)} className="w-full accent-brand-500" />
        </div>

        {/* Material */}
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 mb-2">
            <Package size={15} /> Material som finns
          </div>
          <label className="flex items-center gap-2 text-sm mb-2 select-none cursor-pointer">
            <input type="checkbox" checked={endastUtanMaterial} onChange={(e) => setEndastUtanMaterial(e.target.checked)} className="accent-brand-500" />
            Visa bara lekar utan material
          </label>
          {!endastUtanMaterial && (
            <div className="flex gap-2 flex-wrap">
              {ALLT_MATERIAL.map((m) => (
                <button key={m} onClick={() => toggleMaterial(m)} className={`chip ${valtMaterial.includes(m) ? 'chip-on' : 'chip-off'}`}>
                  {m}
                </button>
              ))}
            </div>
          )}
          {valtMaterial.length > 0 && !endastUtanMaterial && (
            <p className="text-xs text-slate-400 mt-2">Visar lekar utan material + lekar som klarar sig med det du valt.</p>
          )}
        </div>

        <button onClick={aterstall} className="btn-soft flex items-center gap-1.5 text-sm">
          <RefreshCw size={15} /> Återställ filter
        </button>
      </div>

      <div>
        <div className="text-sm font-bold text-slate-600 mb-2">
          {traffar.length} förslag
        </div>
        {traffar.length === 0 ? (
          <div className="card p-6 text-center text-slate-500">
            Inga lekar matchar just nu. Prova att höja tiden eller ändra antal elever. 🙂
          </div>
        ) : (
          <div className="space-y-3">
            {traffar.map((a) => (
              <div key={a.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-extrabold text-slate-800">{a.namn}</h3>
                  <span className="shrink-0 text-xs font-bold text-brand-600 bg-brand-50 rounded-full px-2.5 py-1 capitalize">
                    {a.kategori}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{a.beskrivning}</p>
                <div className="flex gap-3 flex-wrap text-xs text-slate-500 mt-2.5">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {a.platser.join(' / ')}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {a.minElever}–{a.maxElever}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {a.minMinuter}–{a.maxMinuter} min</span>
                  <span className="flex items-center gap-1"><Package size={12} /> {a.material.length ? a.material.join(', ') : 'inget'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
