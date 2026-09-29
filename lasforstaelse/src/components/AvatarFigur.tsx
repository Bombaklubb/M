import { TILLBEHOR_PER_EMOJI } from '../data/shop';

/**
 * En avatars emoji, med eventuellt tillbehör ritat ovanpå (solglasögon på
 * potatisen, krona på cupcaken). Storleken styrs av fontSize, så att figuren
 * kan ligga i både headerns lilla cirkel och affärens stora kort.
 */
export default function AvatarFigur({ emoji, fontSize }: { emoji: string; fontSize: number }) {
  const t = TILLBEHOR_PER_EMOJI[emoji];
  if (!t) return <>{emoji}</>;

  return (
    <span
      className="relative inline-block leading-none"
      style={{ width: '1.2em', height: '1.2em', fontSize, lineHeight: '1.2em', textAlign: 'center' }}
    >
      {emoji}
      <span
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          left: `${t.x}%`,
          top: `${t.y}%`,
          fontSize: fontSize * t.storlek * 1.2,
          lineHeight: 1,
          transform: `translate(-50%, -50%) rotate(${t.vrid ?? 0}deg)`,
          filter: 'drop-shadow(0 1px 1px rgba(15,23,42,0.35))',
        }}
      >
        {t.emoji}
      </span>
    </span>
  );
}
