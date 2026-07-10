"use client";

import { EFFECT_MAP, type EffectMotion } from "@/lib/shop";

const ANIM: Record<EffectMotion, string> = {
  fall: "shop-fall",
  rise: "shop-rise",
  twinkle: "shop-twinkle",
};

/**
 * Ritar en animerad partikeleffekt (snö, hjärtan, glitter …) ovanpå sin
 * relativt positionerade förälder. Partiklarna är rent dekorativa och fångar
 * inga klick (pointer-events: none). Värdena är deterministiska (index-baserade)
 * så att server- och klientrendering alltid matchar.
 */
export default function EffectOverlay({ effectId }: { effectId: string | null }) {
  if (!effectId) return null;
  const effect = EFFECT_MAP[effectId];
  if (!effect) return null;

  const anim = ANIM[effect.motion];
  const isTwinkle = effect.motion === "twinkle";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: effect.count }).map((_, i) => {
        const left = (i * 61) % 100;            // sprid horisontellt
        const topPct = (i * 37) % 100;           // sprid vertikalt (används av "twinkle")
        const duration = 6 + (i % 5) * 1.4;     // 6–11.6 s
        const delay = (i * 0.83) % duration;    // jämn fördelning i tid
        const size = 14 + (i % 4) * 6;          // 14–32 px
        return (
          <span
            key={i}
            className="absolute select-none"
            style={{
              left: `${left}%`,
              // "fall"/"rise" animerar top själva (0%→100% av behållarens höjd);
              // "twinkle" står still på en spridd vertikal position.
              top: isTwinkle ? `${topPct}%` : undefined,
              fontSize: `${size}px`,
              lineHeight: 1,
              animation: `${anim} ${duration}s ${isTwinkle ? "ease-in-out" : "linear"} ${delay}s infinite`,
              animationFillMode: "backwards",
            }}
          >
            {effect.emoji}
          </span>
        );
      })}
    </div>
  );
}
