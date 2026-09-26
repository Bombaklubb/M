import { EFFECT_MAP, type EffectMotion } from '../data/shop';

// Rörelsen ligger på ett omslag som är lika stort som föräldern, så att
// procenten i translateY räknas mot förälderns höjd. Då faller partiklarna
// hela vägen genom kortet, oavsett hur högt det är.
const TRAVEL: Record<EffectMotion, string> = {
  fall: 'shop-drop',
  rise: 'shop-float',
  twinkle: 'shop-twinkle',
};

/**
 * Ritar en animerad partikeleffekt (snö, hjärtan, glitter …) ovanpå sin
 * relativt positionerade förälder. Partiklarna är rent dekorativa och fångar
 * inga klick (pointer-events: none). Värdena är deterministiska (index-baserade).
 *
 * size="sm" är för små ytor, som namnbrickan i sidhuvudet, där fullstora
 * partiklar skulle täcka namnet.
 */
export default function EffectOverlay({ effectId, size = 'md' }: { effectId: string | null; size?: 'sm' | 'md' }) {
  if (!effectId) return null;
  const effect = EFFECT_MAP[effectId];
  if (!effect) return null;

  const small = size === 'sm';
  const count = small ? Math.min(8, effect.count) : effect.count;
  const anim = TRAVEL[effect.motion];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const left = ((i * 61) % 92) + 2;           // sprid horisontellt
        const duration = 6 + (i % 5) * 1.4;        // 6–11.6 s
        // Negativ fördröjning: partikeln är redan på väg när sidan visas,
        // i stället för att alla väntar i överkanten tills de får starta.
        const delay = -((i * 0.83 * duration) % duration);
        const px = small ? 9 + (i % 3) * 3 : 14 + (i % 4) * 6;
        // Utan rörelse (minskad rörelse) står partiklarna utspridda här.
        const restY = ((i * 37) % 86) + 4;
        const twinkle = effect.motion === 'twinkle';
        return (
          <span
            key={i}
            className="shop-particle absolute inset-0"
            style={{
              transform: twinkle ? undefined : `translateY(${restY}%)`,
              animation: twinkle ? undefined : `${anim} ${duration}s linear ${delay}s infinite`,
            }}
          >
            <span
              className="shop-particle absolute select-none"
              style={{
                left: `${left}%`,
                top: twinkle ? `${restY}%` : 0,
                fontSize: `${px}px`,
                lineHeight: 1,
                transform: twinkle ? undefined : 'translateY(-100%)',
                // Glitter tänds och släcks på plats; fallande saker vajar lite
                animation: twinkle
                  ? `${anim} ${duration * 0.4}s ease-in-out ${delay * 0.4}s infinite`
                  : `shop-sway ${2.4 + (i % 3) * 0.7}s ease-in-out ${delay}s infinite alternate`,
              }}
            >
              {effect.emoji}
            </span>
          </span>
        );
      })}
    </div>
  );
}
