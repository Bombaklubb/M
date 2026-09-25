import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Den svenska flaggan, samma som i systerapparnas jaktmenyer. */
function FlaggaSE() {
  return (
    <svg viewBox="0 0 16 11" width="22" height="15" className="shrink-0 rounded-sm" aria-hidden>
      <rect width="16" height="11" fill="#006AA7" />
      <rect x="5" width="2" height="11" fill="#FECC02" />
      <rect y="4" width="16" height="3" fill="#FECC02" />
    </svg>
  );
}

/** Den brittiska flaggan, för Engelskajakten. */
function FlaggaGB() {
  return (
    <svg viewBox="0 0 60 30" width="22" height="15" className="shrink-0 rounded-sm" aria-hidden>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/**
 * Systerapparna.
 *
 * Exporteras så att Om-sidan nämner exakt de appar menyn länkar till –
 * samma grepp som Engelskajaktens JAKT_APPS. Två listor skulle glida isär.
 */
export const JAKT_APPAR: { namn: string; url: string; ikon: ReactNode }[] = [
  { namn: 'Svenskajakten', url: 'https://svenskajakten.vercel.app', ikon: <FlaggaSE /> },
  { namn: 'Läsjakten', url: 'https://lasjakten.vercel.app', ikon: <span aria-hidden>📚</span> },
  { namn: 'Mattejakten', url: 'https://mattejakten.vercel.app', ikon: <span aria-hidden>🔢</span> },
  { namn: 'Engelskajakten', url: 'https://engelskajakten.vercel.app', ikon: <FlaggaGB /> },
  { namn: 'Readhunt', url: 'https://readhunt.vercel.app', ikon: <span aria-hidden>🔍</span> },
];

export const KONTAKT_EPOST = 'martin.akdogan@enkoping.se';

/**
 * Sidfoten: "Kontakta Martin" nere till vänster, "Jaktlänkar" nere till
 * höger.
 *
 * Byggd som i Svenskajakten och Engelskajakten (`engelska/src/app/layout.tsx`
 * och `components/ui/JakterMenu.tsx`, lästa med lärarens uttryckliga
 * tillåtelse): en fast rad längst ned som inte tar emot tryck, med de två
 * länkarna i hörnen.
 *
 * Skillnader mot förlagan:
 *
 *  - Mörk text på en ljus bricka i stället för vit text rakt på bakgrunden.
 *    Grundjaktens bakgrund är ljus; vit text skulle inte synas.
 *  - Tryckytan är 44 px hög. Förlagans 11 px-text med osynlig utfyllnad är
 *    svår att träffa för en elev med motoriska svårigheter.
 *
 * App.tsx ritar den inte under ett övningspass. Där sitter passets egen
 * knapprad längst ned, och en länk ut ur appen mitt i en uppgift är en väg
 * bort från den.
 */
export function Sidfot() {
  const [oppen, setOppen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Menyn stängs av ett tryck utanför den, eller med Esc.
  useEffect(() => {
    if (!oppen) return;
    const utanfor = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOppen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOppen(false);
    };
    document.addEventListener('pointerdown', utanfor);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', utanfor);
      document.removeEventListener('keydown', esc);
    };
  }, [oppen]);

  const bricka =
    'pointer-events-auto inline-flex h-11 min-h-0 items-center gap-1.5 rounded-full ' +
    'bg-white/80 px-3 text-sm font-bold text-ink-700 shadow-sm backdrop-blur-sm ' +
    'hover:bg-white dark:bg-ink-800/80 dark:text-ink-200';

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end
                 justify-between px-2 pb-2 sm:px-3"
    >
      <a href={`mailto:${KONTAKT_EPOST}`} className={bricka}>
        <span aria-hidden>✉️</span>
        Kontakta Martin
      </a>

      <div ref={ref} className="pointer-events-auto relative">
        {oppen && (
          <div
            id="jaktlankar-meny"
            className="absolute bottom-12 right-0 min-w-[13rem] overflow-hidden rounded-card
                       border border-ink-200 bg-white shadow-pop dark:border-ink-700 dark:bg-ink-800"
          >
            {JAKT_APPAR.map((app) => (
              <a
                key={app.url}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOppen(false)}
                className="flex h-12 items-center gap-3 border-t border-ink-100 px-4 text-base
                           font-bold text-ink-800 first:border-t-0 hover:bg-brand-50
                           dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-700"
              >
                <span className="grid w-6 place-items-center text-lg leading-none">{app.ikon}</span>
                {app.namn}
                <span className="ml-auto text-sm text-ink-400" aria-hidden>↗</span>
              </a>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOppen((v) => !v)}
          aria-expanded={oppen}
          aria-controls="jaktlankar-meny"
          className={bricka}
        >
          <span aria-hidden>🔗</span>
          Jaktlänkar
          <span aria-hidden className={oppen ? 'inline-block rotate-180 transition-transform' : 'inline-block transition-transform'}>
            ▴
          </span>
        </button>
      </div>
    </div>
  );
}
