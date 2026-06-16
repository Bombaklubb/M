import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { RORELSEBANKEN } from '../data/rorelser'

export default function Rorelsebanken() {
  const [oppen, setOppen] = useState<string | null>(RORELSEBANKEN[0]?.namn ?? null)

  return (
    <div className="animate-slide-up space-y-3">
      <p className="text-slate-600">Rörelselekar sorterade efter situation och årstid.</p>
      {RORELSEBANKEN.map((kat) => {
        const aktiv = oppen === kat.namn
        return (
          <div key={kat.namn} className="card overflow-hidden">
            <button
              onClick={() => setOppen(aktiv ? null : kat.namn)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <span className="text-2xl">{kat.emoji}</span>
              <span className="font-extrabold text-slate-800 flex-1">{kat.namn}</span>
              <span className="text-xs text-slate-400">{kat.lekar.length} lekar</span>
              <ChevronDown size={20} className={`text-brand-500 transition-transform ${aktiv ? 'rotate-180' : ''}`} />
            </button>
            {aktiv && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in">
                {kat.lekar.map((lek) => (
                  <div key={lek.namn} className="rounded-xl bg-brand-50/60 p-3">
                    <div className="font-bold text-slate-800">{lek.namn}</div>
                    <div className="text-sm text-slate-600">{lek.beskrivning}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
