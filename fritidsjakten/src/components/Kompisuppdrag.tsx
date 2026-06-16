import { useState } from 'react'
import { Shuffle, HeartHandshake } from 'lucide-react'
import { KOMPISUPPDRAG } from '../data/kompisuppdrag'

// Dagens uppdrag väljs deterministiskt utifrån dagens datum, så att alla
// barn på fritids ser samma uppdrag samma dag.
function dagensIndex(): number {
  const nu = new Date()
  const start = new Date(nu.getFullYear(), 0, 0)
  const diff = nu.getTime() - start.getTime()
  const dagNr = Math.floor(diff / 86_400_000)
  return dagNr % KOMPISUPPDRAG.length
}

const VECKODAGAR = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag']

export default function Kompisuppdrag() {
  const [index, setIndex] = useState(dagensIndex)
  const [slumpat, setSlumpat] = useState(false)

  const uppdrag = KOMPISUPPDRAG[index]
  const idag = new Date()
  const datumText = `${VECKODAGAR[idag.getDay()]} ${idag.getDate()}/${idag.getMonth() + 1}`

  function nyttSlumpat() {
    let n = index
    while (n === index && KOMPISUPPDRAG.length > 1) {
      n = Math.floor(Math.random() * KOMPISUPPDRAG.length)
    }
    setIndex(n)
    setSlumpat(true)
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

      <div className="flex justify-center">
        <button onClick={nyttSlumpat} className="btn-primary flex items-center gap-2">
          <Shuffle size={18} /> Slumpa ett nytt
        </button>
      </div>

      {slumpat && (
        <p className="text-center text-xs text-slate-400">
          Tips: dagens uppdrag är samma för alla. Slumpa fram fler om ni vill ha extra utmaningar.
        </p>
      )}

      <p className="text-center text-sm text-slate-400">
        {KOMPISUPPDRAG.length} uppdrag i banken
      </p>
    </div>
  )
}
