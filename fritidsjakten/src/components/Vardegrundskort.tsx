import { useState } from 'react'
import { Dices, ArrowLeft } from 'lucide-react'
import { VARDEGRUNDSKORT } from '../data/vardegrundskort'

export default function Vardegrundskort() {
  const [valdKategori, setValdKategori] = useState<number | null>(null)
  const [fraga, setFraga] = useState<string | null>(null)

  function dra(katIndex: number) {
    const lista = VARDEGRUNDSKORT[katIndex].fragor
    let ny = fraga
    while (ny === fraga && lista.length > 1) {
      ny = lista[Math.floor(Math.random() * lista.length)]
    }
    if (ny === null) ny = lista[Math.floor(Math.random() * lista.length)]
    setFraga(ny)
  }

  // Översikt – välj kategori
  if (valdKategori === null) {
    return (
      <div className="animate-slide-up">
        <p className="text-slate-600 mb-3">Diskussionsfrågor och dilemman för kompissamtal och samling. Välj ett område och dra ett kort.</p>
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          <span className="font-bold">📚 Läroplanskoppling:</span> Lgr22 fritidshem – normer och värden samt Språk och kommunikation. Värdegrunden: empati, respekt och allas lika värde.
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {VARDEGRUNDSKORT.map((k, i) => (
            <button
              key={k.kategori}
              onClick={() => { setValdKategori(i); setFraga(null) }}
              className={`rounded-2xl p-5 text-left text-white shadow-lg bg-gradient-to-br ${k.farg} hover:-translate-y-0.5 transition-all`}
            >
              <div className="text-3xl mb-1">{k.emoji}</div>
              <div className="text-lg font-black">{k.kategori}</div>
              <div className="text-sm text-white/85">{k.fragor.length} frågor</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const kat = VARDEGRUNDSKORT[valdKategori]

  return (
    <div className="animate-slide-up space-y-4">
      <button
        onClick={() => { setValdKategori(null); setFraga(null) }}
        className="btn-soft !py-1.5 !px-3 flex items-center gap-1 text-sm"
      >
        <ArrowLeft size={16} /> Alla områden
      </button>

      <div className={`rounded-3xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center text-white shadow-xl bg-gradient-to-br ${kat.farg}`}>
        <div className="text-4xl mb-2">{kat.emoji}</div>
        <div className="text-sm font-bold uppercase tracking-wide text-white/80 mb-3">{kat.kategori}</div>
        {fraga ? (
          <p key={fraga} className="text-2xl font-black leading-snug animate-pop">{fraga}</p>
        ) : (
          <p className="text-lg font-bold text-white/80">Tryck på knappen för att dra en fråga!</p>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={() => dra(valdKategori)} className="btn-primary flex items-center gap-2">
          <Dices size={18} /> {fraga ? 'Dra en ny' : 'Dra fråga'}
        </button>
      </div>
    </div>
  )
}
