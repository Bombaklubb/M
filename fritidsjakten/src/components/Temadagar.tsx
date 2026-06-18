import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { TEMADAGAR } from '../data/temadagar'

export default function Temadagar() {
  const [valtId, setValtId] = useState<string | null>(null)
  const valt = TEMADAGAR.find((t) => t.id === valtId) ?? null

  // Översikt – välj en temadag
  if (!valt) {
    return (
      <div className="animate-slide-up">
        <p className="text-slate-600 mb-4">Färdiga veckoupplägg för högtider och temadagar. Välj en för att se hela veckan.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {TEMADAGAR.map((t) => (
            <button
              key={t.id}
              onClick={() => setValtId(t.id)}
              className="card p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all flex gap-3 items-start"
            >
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <span>
                <span className="block font-extrabold text-slate-800">{t.namn}</span>
                <span className="block text-sm text-slate-500">{t.beskrivning}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-slide-up space-y-4">
      <button
        onClick={() => setValtId(null)}
        className="btn-soft !py-1.5 !px-3 flex items-center gap-1 text-sm no-print"
      >
        <ArrowLeft size={16} /> Alla temadagar
      </button>

      <div className="flex items-center gap-2">
        <span className="text-2xl">{valt.emoji}</span>
        <div>
          <h2 className="text-lg font-black text-brand-800">{valt.namn}</h2>
          <p className="text-sm text-slate-500">{valt.beskrivning}</p>
        </div>
      </div>

      {valt.laroplan && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          <span className="font-bold">📚 Läroplanskoppling:</span> {valt.laroplan}
        </div>
      )}

      <div className="space-y-3">
        {valt.dagar.map((d) => (
          <div key={d.dag} className="card p-4 flex gap-3">
            <div className="shrink-0 w-20 text-center">
              <div className="text-xs font-bold text-brand-500 uppercase">{d.dag}</div>
            </div>
            <div className="flex-1 border-l border-brand-100 pl-3">
              <div className="font-extrabold text-slate-800">{d.titel}</div>
              <p className="text-sm text-slate-600">{d.beskrivning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
