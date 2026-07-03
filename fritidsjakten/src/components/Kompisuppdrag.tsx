import { useEffect, useMemo, useState } from 'react'
import { Shuffle, HeartHandshake, Plus, Trash2, X } from 'lucide-react'
import { KOMPISUPPDRAG } from '../data/kompisuppdrag'
import { lasLS } from '../lib/egnaTeman'
import type { Kompisuppdrag as Uppdrag } from '../types'

const EGNA_KEY = 'fritids_egna_uppdrag'

// Dagens uppdrag väljs deterministiskt utifrån dagens datum, så att alla
// barn på fritids ser samma uppdrag samma dag.
function dagensIndex(antal: number): number {
  const nu = new Date()
  const start = new Date(nu.getFullYear(), 0, 0)
  const diff = nu.getTime() - start.getTime()
  const dagNr = Math.floor(diff / 86_400_000)
  return dagNr % antal
}

const VECKODAGAR = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag']

export default function Kompisuppdrag() {
  const [egna, setEgna] = useState<Uppdrag[]>(() => lasLS<Uppdrag[]>(EGNA_KEY, []))
  const [visaForm, setVisaForm] = useState(false)
  const [visaEgna, setVisaEgna] = useState(false)

  useEffect(() => {
    localStorage.setItem(EGNA_KEY, JSON.stringify(egna))
  }, [egna])

  // Egna uppdrag ingår i dagens rotation och slumpningen.
  const alla = useMemo(() => [...KOMPISUPPDRAG, ...egna], [egna])

  const [index, setIndex] = useState(() => dagensIndex(KOMPISUPPDRAG.length))
  const [slumpat, setSlumpat] = useState(false)

  const uppdrag = alla[index % alla.length]
  const idag = new Date()
  const datumText = `${VECKODAGAR[idag.getDay()]} ${idag.getDate()}/${idag.getMonth() + 1}`

  function nyttSlumpat() {
    let n = index
    while (n === index && alla.length > 1) {
      n = Math.floor(Math.random() * alla.length)
    }
    setIndex(n)
    setSlumpat(true)
  }

  function laggTill(text: string) {
    const rensad = text.trim()
    if (!rensad) return
    const nyttId = Math.max(1000, ...egna.map((u) => u.id)) + 1
    setEgna((e) => [...e, { id: nyttId, text: rensad }])
    setVisaForm(false)
  }

  function taBort(id: number) {
    setEgna((e) => e.filter((u) => u.id !== id))
    setIndex((i) => i % Math.max(1, alla.length - 1))
  }

  return (
    <div className="animate-slide-up space-y-4">
      <div className="card p-8 text-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-lg mb-4">
          <HeartHandshake size={32} />
        </div>
        <div className="text-xs font-bold uppercase tracking-wide text-rose-500 mb-1">
          {slumpat ? 'Extra uppdrag' : `Dagens uppdrag · ${datumText}`}
        </div>
        <p className="text-2xl font-black text-slate-800 leading-snug animate-pop" key={uppdrag.id}>
          {uppdrag.text}
        </p>
      </div>

      <div className="flex justify-center gap-2 flex-wrap no-print">
        <button onClick={nyttSlumpat} className="btn-primary flex items-center gap-2">
          <Shuffle size={18} /> Slumpa ett nytt
        </button>
        <button onClick={() => setVisaForm(true)} className="btn-soft flex items-center gap-1.5">
          <Plus size={16} /> Eget uppdrag
        </button>
      </div>

      {slumpat && (
        <p className="text-center text-xs text-slate-400">
          Tips: dagens uppdrag är samma för alla. Slumpa fram fler om ni vill ha extra utmaningar.
        </p>
      )}

      <p className="text-center text-sm text-slate-400">
        {alla.length} uppdrag i banken
        {egna.length > 0 && (
          <>
            {' '}(varav {egna.length} egna ·{' '}
            <button onClick={() => setVisaEgna((v) => !v)} className="text-brand-600 font-bold hover:underline">
              {visaEgna ? 'dölj' : 'visa'}
            </button>)
          </>
        )}
      </p>

      {visaEgna && egna.length > 0 && (
        <div className="card p-4 space-y-2 no-print">
          <div className="text-sm font-bold text-slate-600">Egna uppdrag</div>
          {egna.map((u) => (
            <div key={u.id} className="flex items-center gap-2 rounded-xl bg-rose-50/60 p-2.5">
              <span className="flex-1 text-sm text-slate-700">{u.text}</span>
              <button
                onClick={() => taBort(u.id)}
                className="text-slate-300 hover:text-rose-500 p-1"
                aria-label="Ta bort uppdrag"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {visaForm && <EgetUppdragForm onClose={() => setVisaForm(false)} onSpara={laggTill} />}
    </div>
  )
}

function EgetUppdragForm({
  onClose, onSpara,
}: {
  onClose: () => void
  onSpara: (text: string) => void
}) {
  const [text, setText] = useState('')

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="card p-5 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-brand-800">Nytt kompisuppdrag</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSpara(text) }}
            placeholder="T.ex. Lär någon en ny lek idag."
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            autoFocus
          />
          <button disabled={!text.trim()} onClick={() => onSpara(text)} className="btn-primary w-full">
            Spara uppdrag
          </button>
        </div>
      </div>
    </div>
  )
}
