import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, RefreshCw, Printer } from 'lucide-react'
import { AKTIVITETER } from '../data/aktiviteter'
import { TEMAN } from '../data/teman'
import { laddaEgnaTeman, lasLS } from '../lib/egnaTeman'
import type { Aktivitet, Kategori } from '../types'

// Sparade val (valda teman + antal elever) mellan besök.
const VAL_KEY = 'fritids_vecka_val'

interface SparadeVal {
  temaIds: string[]
  elever: number
}

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
  // Alla teman som finns i Temabanken (inbyggda + pedagogens egna).
  // Läses vid mount så nyskapade egna teman syns direkt.
  const allaTeman = useMemo(() => [...TEMAN, ...laddaEgnaTeman()], [])

  const sparat = useMemo(() => lasLS<SparadeVal | null>(VAL_KEY, null), [])
  const [temaIds, setTemaIds] = useState<string[]>(() => {
    const giltiga = (sparat?.temaIds ?? []).filter((id) => allaTeman.some((t) => t.id === id))
    return giltiga.length ? giltiga : [allaTeman[0].id]
  })
  const [elever, setElever] = useState(() => sparat?.elever ?? 20)
  const [frö, setFrö] = useState(0)
  const [genererad, setGenererad] = useState(false)

  useEffect(() => {
    localStorage.setItem(VAL_KEY, JSON.stringify({ temaIds, elever } satisfies SparadeVal))
  }, [temaIds, elever])

  const valdaTeman = useMemo(
    () => allaTeman.filter((t) => temaIds.includes(t.id)),
    [allaTeman, temaIds],
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

  function toggleTema(id: string) {
    setTemaIds((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]))
  }

  const kanGenerera = temaIds.length > 0

  return (
    <div className="animate-slide-up space-y-5">
      <div className="card p-4 space-y-4 no-print">
        <div>
          <div className="text-sm font-bold text-slate-600 mb-2">Tema <span className="font-normal text-slate-400">(välj en eller flera)</span></div>
          <div className="flex gap-2 flex-wrap">
            {allaTeman.map((t) => (
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
          <p className="text-xs text-slate-400 text-center">Välj minst ett tema.</p>
        )}
      </div>

      {genererad && schema.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-slate-600">
              <div className="font-bold">{elever} elever</div>
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
