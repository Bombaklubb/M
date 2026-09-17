import { useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'

const EPOST = 'martin.akdogan@enkoping.se'

// Kort presentation av appen – nås via länken i headern.
export default function Om({ onClose }: { onClose: () => void }) {
  // Escape stänger rutan, som i vilken dialog som helst.
  useEffect(() => {
    const vidTangent = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', vidTangent)
    return () => window.removeEventListener('keydown', vidTangent)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="om-rubrik"
        className="card p-5 w-full max-w-md max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white shadow shrink-0">
              <Sparkles size={18} />
            </div>
            <h2 id="om-rubrik" className="text-lg font-black text-brand-800">Om Fritidsjakten</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 shrink-0" aria-label="Stäng">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p>
            Ett planeringsstöd för fritidshemmet med färdiga aktiviteter, teman och
            veckoscheman. Tanken är att det ska gå snabbt att hitta något som passar
            gruppen, oavsett hur många barn som dök upp eller hur lång stund ni har.
          </p>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { tal: '8', text: 'verktyg' },
              { tal: '50', text: 'aktiviteter' },
              { tal: '26', text: 'teman' },
              { tal: '12', text: 'temadagar' },
            ].map((n) => (
              <div key={n.text} className="rounded-xl bg-brand-50/70 py-2">
                <div className="font-black text-brand-700 text-lg leading-none">{n.tal}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{n.text}</div>
              </div>
            ))}
          </div>

          <p>
            Alla teman och temadagar har en utskriven koppling till Lgr22, så den går
            att hänvisa till direkt i planeringen. Allt innehåll går att skriva ut, och
            appen kan läggas till på hemskärmen som en vanlig app.
          </p>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900">
            <span className="font-bold">🔒 Inga personuppgifter.</span> Appen har ingen
            inloggning, ingen databas och ingen spårning. Egna teman och uppdrag sparas
            bara i den här webbläsaren och lämnar aldrig datorn.
          </div>

          <p className="text-slate-600">
            Frågor, idéer eller något som strular?{' '}
            <a href={`mailto:${EPOST}`} className="text-brand-600 font-bold hover:underline">
              Hör av dig till Martin
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
