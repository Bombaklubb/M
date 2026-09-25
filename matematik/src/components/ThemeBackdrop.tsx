import type { ThemeArt } from '../data/themeArt';

/**
 * Elevens valda tema som ett fast lager bakom sidan. Eftersom lagret ligger
 * fast står en ritad scen hel på skärmen hur lång sidan än är, i stället för
 * att sträckas ut med innehållet. Föräldern behöver klassen `isolate` så att
 * lagret hamnar bakom innehållet men framför sidans egen bakgrundsfärg.
 */
export default function ThemeBackdrop({ art, veil = 'bg-black/10' }: { art: ThemeArt; veil?: string }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: art.bg }} />
      {/* En lätt slöja så att kort och text syns bra även på brokiga teman */}
      <div className={`absolute inset-0 ${veil}`} />
    </div>
  );
}
