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

function arskursLabel(a: string): string {
  return a === 'F' ? 'F-klass' : `Åk ${a}`
}

export default function Veckoplaneraren() {
  const [arskurser, setArskurser] = useState<string[]>(['2', '3'])
  const [temaIds, setTemaIds] = useState<string[]>([TEMAN[0].id])
  const [elever, setElever] = useState(20)
  const [frö, setFrö] = useState(0)
  const [genererad, setGenererad] = useState(false)

  const valdaTeman = useMemo(
    () => TEMAN.filter((t) => temaIds.includes(t.id)),
    [temaIds],
  )

  const schema = useMemo(() => {
    if (valdaTeman.length === 0) return []
    return DAGAR.map((d, i) => {
      const akt = valjAktivitet(d.kategori, elever, frö + i)
      // Rotera mellan valda teman så att alla kommer med under veckan.
      const tema = valdaTeman[i % valdaTeman.length]
      const temaAkt = tema.aktiviteter[(frö + i) % tema.aktiviteter.length]
      return { ...d, akt, tema, temaTips: temaAkt }
    })
  }, [elever, frö, valdaTeman])

  function toggleArskurs(a: string) {
    setArskurser((arr) => (arr.includes(a) ? arr.filter((x) => x !== a) : [...arr, a]))
  }

  function toggleTema(id: string) {
    setTemaIds((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]))
  }

  const kanGenerera = arskurser.length > 0 && temaIds.length > 0
  const valdaArskurserSorterade = ARSKURSER.filter((a) => arskurser.includes(a))

  return (
    <div className="animate-slide-up space-y-5">
      <div className="card p-4 space-y-4 no-print">
        <div>
          <div className="text-sm font-bold text-slate-600 mb-2">Årskurs <span className="font-normal text-slate-400">(välj en eller flera)</span></div>
          <div className="flex gap-2 flex-wrap">
            {ARSKURSER.map((a) => (
              <button key={a} onClick={() => toggleArskurs(a)} className={`chip ${arskurser.includes(a) ? 'chip-on' : 'chip-off'}`}>
                {arskursLabel(a)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-600 mb-2">Tema <span className="font-normal text-slate-400">(välj en eller flera)</span></div>
          <div className="flex gap-2 flex-wrap">
            {TEMAN.map((t) => (
              <button key={t.id} onClick={() => toggleTema(t.id)} className={`chip ${temaIds.includes(t.id) ? 'chip-on' : 'chip-off'}`}>
                {t.emoji} {t.namn}
              </button>
            ))}
          </div>
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
          disabled={!kanGenerera}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {genererad ? <RefreshCw size={18} /> : <CalendarDays size={18} />}
          {genererad ? 'Generera ny vecka' : 'Generera veckoschema'}
        </button>
        {!kanGenerera && (
          <p className="text-xs text-slate-400 text-center">Välj minst en årskurs och ett tema.</p>
        )}
      </div>

      {genererad && schema.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-slate-600">
              <div className="font-bold">
                {valdaArskurserSorterade.map(arskursLabel).join(', ')} · {elever} elever
              </div>
              <div className="text-slate-500">
                {valdaTeman.map((t) => `${t.emoji} ${t.namn}`).join(' · ')}
              </div>
            </div>
            <button onClick={() => window.print()} className="btn-soft !py-1.5 !px-3 flex items-center gap-1 text-sm shrink-0 no-print">
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
                  {s.tema.emoji} {s.tema.namn}: {s.temaTips.titel}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
