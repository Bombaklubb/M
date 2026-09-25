import { useEffect } from 'react';
import type { Vara } from '@/data/affar';
import { EffektLager } from '@/components/EffektLager';

/**
 * Elevens tema och effekt, bakom hela sidan.
 *
 * Samma grepp som Engelskajaktens ThemedBackdrop: ett fast lager längst bak
 * (-z-10) som allt annat ritas ovanpå. Kort och knappar har egen bakgrund
 * och täcker det; i mellanrummen syns temat och partiklarna.
 *
 * App.tsx ritar det INTE under ett övningspass. I Engelskajakten täcker
 * övningssidornas egen bakgrund temat; här görs samma sak genom att lagret
 * helt enkelt inte finns där. Under en uppgift ska ingenting röra sig och
 * ingenting konkurrera med bokstäverna.
 *
 * Så länge ett tema ligger på får <body> klassen `har-tema`. index.css
 * mörkar då den ljusgrå hjälptexten ett snäpp – den är skriven för en vit
 * bakgrund och blir för blek mot en färgad.
 */
export function Bakgrund({ tema, effekt }: { tema: Vara | null; effekt: Vara | null }) {
  useEffect(() => {
    document.body.classList.toggle('har-tema', !!tema);
    return () => document.body.classList.remove('har-tema');
  }, [tema]);

  if (!tema && !effekt) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {tema?.css && (
        <div
          className={`absolute inset-0 ${tema.animerad ? 'tema-glid' : ''}`}
          style={{ background: tema.css }}
        />
      )}
      <EffektLager effekt={effekt} />
    </div>
  );
}
