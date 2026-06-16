import { useState } from 'react'
import { Dices, ArrowLeft } from 'lucide-react'
import { UPPDRAGSKORT } from '../data/uppdragskort'

export default function Uppdragskort() {
  const [valdKategori, setValdKategori] = useState<number | null>(null)
  const [uppdrag, setUppdrag] = useState<string | null>(null)

  function dra(katIndex: number) {
    const lista = UPPDRAGSKORT[katIndex].uppdrag
    let nytt = uppdrag
    while ((nytt === uppdrag || nytt === null) && lista.length > 1) {
      nytt = lista[Math.floor(Math.random() * lista.length)]
      if (uppdrag === null) break
    }
    if (nytt === null) nytt = lista[Math.floor(Math.random() * lista.length)]
    setUppdrag(nytt)
  }

  // Översikt – välj kategori
  if (valdKategori === null) {
    return (
      <div className="animate-slide-up">
        <p className="text-slate-600 mb-4">Välj en kategori och dra ett uppdrag!</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {UPPDRAGSKORT.map((k, i) => (
            <button
              key={k.kategori}
              onClick={() => { setValdKategori(i); setUppdrag(null) }}
              className={`rounded-2xl p-5 text-left text-white shadow-lg bg-gradient-to-br ${k.farg} hover:-translate-y-0.5 transition-all`}
            >
              <div className="text-3xl mb-1">{k.emoji}</div>
              <div className="text-lg font-black">{k.kategori}</div>
              <div className="text-sm text-white/85">{k.uppdrag.length} uppdrag</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const kat = UPPDRAGSKORT[valdKategori]

  return (
    <div className="animate-slide-up space-y-4">
      <button
        onClick={() => { setValdKategori(null); setUppdrag(null) }}
        className="btn-soft !py-1.5 !px-3 flex items-center gap-1 text-sm"
      >
        <ArrowLeft size={16} /> Alla kategorier
      </button>

      <div className={`rounded-3xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center text-white shadow-xl bg-gradient-to-br ${kat.farg}`}>
        <div className="text-4xl mb-2">{kat.emoji}</div>
        <div className="text-sm font-bold uppercase tracking-wide text-white/80 mb-3">{kat.kategori}</div>
        {uppdrag ? (
          <p key={uppdrag} className="text-2xl font-black leading-snug animate-pop">{uppdrag}</p>
        ) : (
          <p className="text-lg font-bold text-white/80">Tryck på knappen för att dra ett uppdrag!</p>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={() => dra(valdKategori)} className="btn-primary flex items-center gap-2">
          <Dices size={18} /> {uppdrag ? 'Dra ett nytt' : 'Dra uppdrag'}
        </button>
      </div>
    </div>
  )
}
