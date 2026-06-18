import { useState } from 'react'
import {
  Sparkles, Library, Wand2, HeartHandshake, Layers, CalendarDays, Activity,
  ArrowLeft, Printer, PartyPopper, MessagesSquare,
} from 'lucide-react'
import Temabanken from './components/Temabanken'
import Aktivitetsgeneratorn from './components/Aktivitetsgeneratorn'
import Kompisuppdrag from './components/Kompisuppdrag'
import Uppdragskort from './components/Uppdragskort'
import Veckoplaneraren from './components/Veckoplaneraren'
import Rorelsebanken from './components/Rorelsebanken'
import Temadagar from './components/Temadagar'
import Vardegrundskort from './components/Vardegrundskort'

type ModulId =
  | 'hem'
  | 'temabanken'
  | 'aktivitetsgeneratorn'
  | 'kompisuppdrag'
  | 'uppdragskort'
  | 'veckoplaneraren'
  | 'rorelsebanken'
  | 'temadagar'
  | 'vardegrundskort'

interface ModulInfo {
  id: ModulId
  nr: number
  namn: string
  beskrivning: string
  icon: typeof Library
  farg: string
}

const MODULER: ModulInfo[] = [
  { id: 'temabanken', nr: 1, namn: 'Temabanken', beskrivning: 'Välj tema och åldersgrupp – få färdiga aktiviteter.', icon: Library, farg: 'from-emerald-400 to-green-600' },
  { id: 'aktivitetsgeneratorn', nr: 2, namn: 'Aktivitetsgeneratorn', beskrivning: 'Filtrera på plats, antal, tid och material.', icon: Wand2, farg: 'from-sky-400 to-blue-600' },
  { id: 'kompisuppdrag', nr: 3, namn: 'Dagens kompisuppdrag', beskrivning: 'Ett nytt snällt uppdrag varje dag.', icon: HeartHandshake, farg: 'from-rose-400 to-pink-600' },
  { id: 'uppdragskort', nr: 4, namn: 'Uppdragskort', beskrivning: 'Eleverna drar ett eget uppdrag.', icon: Layers, farg: 'from-violet-400 to-fuchsia-600' },
  { id: 'veckoplaneraren', nr: 5, namn: 'Veckoplaneraren', beskrivning: 'Få ett färdigt veckoschema.', icon: CalendarDays, farg: 'from-amber-400 to-orange-600' },
  { id: 'rorelsebanken', nr: 6, namn: 'Rörelsebanken', beskrivning: 'Lekar för alla ytor och årstider.', icon: Activity, farg: 'from-cyan-400 to-teal-600' },
  { id: 'temadagar', nr: 7, namn: 'Temadagar', beskrivning: 'Färdiga veckoupplägg för högtider.', icon: PartyPopper, farg: 'from-fuchsia-400 to-purple-600' },
  { id: 'vardegrundskort', nr: 8, namn: 'Värdegrundskort', beskrivning: 'Frågor och dilemman för kompissamtal.', icon: MessagesSquare, farg: 'from-rose-400 to-orange-500' },
]

export default function App() {
  const [aktiv, setAktiv] = useState<ModulId>('hem')

  const aktuell = MODULER.find((m) => m.id === aktiv)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-brand-100 no-print">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {aktiv !== 'hem' ? (
            <button
              onClick={() => setAktiv('hem')}
              className="btn-soft !py-2 !px-3 flex items-center gap-1"
              aria-label="Tillbaka till start"
            >
              <ArrowLeft size={18} /> Hem
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white shadow">
              <Sparkles size={20} />
            </div>
          )}
          <div className="leading-tight flex-1">
            <h1 className="text-lg font-black text-brand-800">
              {aktiv === 'hem' ? 'Fritidsjakten' : aktuell?.namn}
            </h1>
            <p className="text-xs text-slate-500">
              {aktiv === 'hem' ? 'Aktiviteter för fritids' : `Modul ${aktuell?.nr}`}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="btn-soft !py-2 !px-3 flex items-center gap-1.5 shrink-0"
            aria-label="Skriv ut"
          >
            <Printer size={18} /> <span className="hidden sm:inline">Skriv ut</span>
          </button>
        </div>
      </header>

      {/* Synlig rubrik vid utskrift (headern döljs i print) */}
      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-black text-brand-800">Fritidsjakten</h1>
        <p className="text-sm text-slate-500">
          {aktiv === 'hem' ? 'Aktiviteter för fritids' : aktuell?.namn}
        </p>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {aktiv === 'hem' && (
          <div className="animate-fade-in">
            <p className="text-slate-600 mb-5">
              Välj en modul för att komma igång. Allt fungerar utan inloggning – perfekt att
              ha framme på fritids.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {MODULER.map((m) => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    onClick={() => setAktiv(m.id)}
                    className="card p-4 text-left hover:shadow-xl hover:-translate-y-0.5 transition-all flex gap-3 items-start"
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${m.farg} flex items-center justify-center text-white shadow`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-800">{m.namn}</div>
                      <div className="text-sm text-slate-500">{m.beskrivning}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-8 text-left text-xs text-slate-400">
              Kontakt –{' '}
              <a href="mailto:martin.akdogan@enkoping.se" className="text-brand-600 font-bold hover:underline">
                martin.akdogan@enkoping.se
              </a>
            </div>
          </div>
        )}

        {aktiv === 'temabanken' && <Temabanken />}
        {aktiv === 'aktivitetsgeneratorn' && <Aktivitetsgeneratorn />}
        {aktiv === 'kompisuppdrag' && <Kompisuppdrag />}
        {aktiv === 'uppdragskort' && <Uppdragskort />}
        {aktiv === 'veckoplaneraren' && <Veckoplaneraren />}
        {aktiv === 'rorelsebanken' && <Rorelsebanken />}
        {aktiv === 'temadagar' && <Temadagar />}
        {aktiv === 'vardegrundskort' && <Vardegrundskort />}
      </main>
    </div>
  )
}
