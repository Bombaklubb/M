import { useEffect, useState } from 'react';
import type { EffektRorelse, Vara } from '@/data/affar';

const ANIMATION: Record<EffektRorelse, string> = {
  fall: 'effekt-fall',
  stig: 'effekt-stig',
  glittra: 'effekt-glittra',
};

/** Följer systeminställningen "minska rörelse" och uppdateras om den ändras. */
function useMinskaRorelse(): boolean {
  const [minska, setMinska] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const vidAndring = (e: MediaQueryListEvent) => setMinska(e.matches);
    mq.addEventListener('change', vidAndring);
    return () => mq.removeEventListener('change', vidAndring);
  }, []);
  return minska;
}

/**
 * En effekt ur affären: partiklar som faller, stiger eller glittrar över
 * sin förälder.
 *
 * Portad från Engelskajaktens EffectOverlay – samma spridning, samma tider,
 * samma tre rörelser – så att effekterna ser likadana ut i alla apparna.
 * Placeringen räknas ur index och inte ur slumpen: samma effekt ser
 * likadan ut varje gång, och ingenting hoppar när sidan ritas om.
 *
 * Partiklarna tar aldrig emot tryck (pointer-events: none) och läses inte
 * upp (aria-hidden). Med "minska rörelse" påslaget ritas ingenting alls.
 */
export function EffektLager({ effekt }: { effekt: Vara | null }) {
  const minska = useMinskaRorelse();
  if (!effekt || effekt.typ !== 'effekt' || !effekt.rorelse || minska) return null;

  const animation = ANIMATION[effekt.rorelse];
  const glittrar = effekt.rorelse === 'glittra';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: effekt.antal ?? 14 }).map((_, i) => {
        const vanster = (i * 61) % 100;          // sprid i sidled
        const uppifran = (i * 37) % 100;         // bara glitter står still på höjden
        const tid = 6 + (i % 5) * 1.4;           // 6–11,6 s
        const fordrojning = (i * 0.83) % tid;    // jämnt utspritt i tiden (se nedan)
        const storlek = 14 + (i % 4) * 6;        // 14–32 px
        return (
          <span
            key={i}
            className="absolute select-none"
            style={{
              left: `${vanster}%`,
              top: glittrar ? `${uppifran}%` : undefined,
              fontSize: `${storlek}px`,
              lineHeight: 1,
              // NEGATIV fördröjning: partikeln startar mitt i sin bana i
              // stället för att vänta osynlig. Med positiv fördröjning (som i
              // förlagan) är rutan nästan tom de första sekunderna – och en
              // elev som bläddrar i affären hinner aldrig se effekten.
              animation: `${animation} ${tid}s ${glittrar ? 'ease-in-out' : 'linear'} -${fordrojning}s infinite`,
            }}
          >
            {effekt.ikon}
          </span>
        );
      })}
    </div>
  );
}
