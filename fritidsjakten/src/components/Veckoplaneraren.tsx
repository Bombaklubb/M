import { useMemo, useState } from 'react'
import { CalendarDays, RefreshCw, Printer } from 'lucide-react'
import { AKTIVITETER } from '../data/aktiviteter'
import { TEMAN } from '../data/teman'
import type { Aktivitet, Kategori } from '../types'

const ARSKURSER = ['F', '1', '2', '3', '4', '5', '6']

// Varje dag har ett fokus (kategori). Veckoplaneraren plockar en passande
// aktivitet per dag utifrån antal elever – ingen AI behövs.
const DAGAR: { dag: string; rubrik: string; kategori: Kategori }[] = [
  { dag: 'Måndag', rubrik: 'Naturbingo & utforskande', kategori: 'natur' },
  { dag: 'Tisdag', rubrik: 'Samarbetslek', kategori: 'samarbete' },
  { dag: 'Onsdag', rubrik: 'Skapande aktivitet', kategori: 'skapande' },
  { dag: 'Torsdag', rubrik: 'Rörelseutmaning', kategori: 'rörelse' },
  { dag: 'Fredag', rubrik: 'Avslutande quiz', kategori: 'quiz' },
]

function valjAktivitet(kategori: Kategori, elever: number, frö: number): Aktivitet {
  const passande = AKTIVITETER.filter(
    (a) => a.kategori === kategori && elever >= a.minElever && elever <= a.maxElever,
  )
  const lista = passande.length ? passande : AKTIVITETER.filter((a) => a.kategori === kategori)
  const fallback = lista.length ? lista : AKTIVITETER
  return fallback[frö % fallback.length]
}

export default function Veckoplaneraren() {
  const [arskurs, setArskurs] = useState('3')
  const [temaId, setTemaId] = useState(TEMAN[0].id)
  const [elever, setElever] = useState(20)
  const [frö, setFrö] = useState(0)
  const [genererad, setGenererad] = useState(false)

  const tema = TEMAN.find((t) => t.id === temaId)!

  const schema = useMemo(() => {
    return DAGAR.map((d, i) => {
      const akt = valjAktivitet(d.kategori, elever, frö + i)
      // Koppla in temats egna aktivitet om någon passar dagens fokus.
      const temaAkt = tema.aktiviteter[(frö + i) % tema.aktiviteter.length]
      return { ...d, akt, temaTips: temaAkt }
    })
  }, [elever, frö, tema])

  return (
    <div className="animate-slide-up space-y-5">
      <div className="card p-4 space-y-4">
        <div>
          <div className="text-sm font-bold text-slate-600 mb-2">Årskurs</div>
          <div className="flex gap-2 flex-wrap">
            {ARSKURSER.map((a) => (
              <button key={a} onClick={() => setArskurs(a)} className={`chip ${arskurs === a ? 'chip-on' : 'chip-off'}`}>
                {a === 'F' ? 'Förskoleklass' : `Åk ${a}`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-600 mb-2">Tema</div>
          <select
            value={temaId}
            onChange={(e) => setTemaId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-bold bg-white"
          >
            {TEMAN.map((t) => (
              <option key={t.id} value={t.id}>{t.emoji} {t.namn}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm font-bold text-slate-600 mb-1">
            <span>Antal elever</span>
            <span className="text-brand-600">{elever} st</span>
          </div>
          <input type="range" min={2} max={40} value={elever} onChange={(e) => setElever(+e.target.value)} className="w-full accent-brand-500" />
        </div>

        <button
          onClick={() => { setGenererad(true); setFrö((f) => f + 1) }}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {genererad ? <RefreshCw size={18} /> : <CalendarDays size={18} />}
          {genererad ? 'Generera ny vecka' : 'Generera veckoschema'}
        </button>
      </div>

      {genererad && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <span className="font-bold">{tema.emoji} {tema.namn}</span> · {arskurs === 'F' ? 'Förskoleklass' : `Åk ${arskurs}`} · {elever} elever
            </div>
            <button onClick={() => window.print()} className="btn-soft !py-1.5 !px-3 flex items-center gap-1 text-sm">
              <Printer size={15} /> Skriv ut
            </button>
          </div>

          {schema.map((s) => (
            <div key={s.dag} className="card p-4 flex gap-3">
              <div className="shrink-0 w-20 text-center">
                <div className="text-xs font-bold text-brand-500 uppercase">{s.dag}</div>
              </div>
              <div className="flex-1 border-l border-brand-100 pl-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.rubrik}</div>
                <div className="font-extrabold text-slate-800">{s.akt.namn}</div>
                <p className="text-sm text-slate-600">{s.akt.beskrivning}</p>
                <div className="text-xs text-slate-500 mt-1.5">
                  ⏱ {s.akt.minMinuter}–{s.akt.maxMinuter} min · {s.akt.material.length ? s.akt.material.join(', ') : 'inget material'}
                </div>
                <div className="text-xs text-brand-600 mt-1.5 bg-brand-50 rounded-lg px-2 py-1 inline-block">
                  💡 Temakoppling: {s.temaTips.titel}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
