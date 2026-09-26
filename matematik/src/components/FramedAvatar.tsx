import type { CSSProperties } from 'react';
import { FRAME_MAP } from '../data/shop';
import { dicebearUriFromMarker } from '../utils/dicebear';

interface Props {
  emoji: string;
  frameId?: string | null;
  /** Ytterdiameter i px (inkl. ram). */
  size?: number;
  className?: string;
}

/** Ritar avatar-glyfen: antingen en emoji (text) eller en DiceBear-bild. */
function Glyph({ emoji, size }: { emoji: string; size: number }) {
  const uri = dicebearUriFromMarker(emoji);
  if (uri) {
    return (
      <img
        src={uri}
        alt=""
        draggable={false}
        style={{ width: size, height: size, objectFit: 'contain', display: 'block', borderRadius: '50%' }}
      />
    );
  }
  return <span style={{ fontSize: size, lineHeight: 1, display: 'inline-block' }}>{emoji}</span>;
}

/**
 * Visar en avatar (emoji eller DiceBear-figur) med valfri köpt ram (glow + ring).
 * Utan ram renderas bara glyfen – ingen layout-skillnad mot tidigare för emoji.
 */
export default function FramedAvatar({ emoji, frameId, size = 40, className }: Props) {
  const frame = frameId ? FRAME_MAP[frameId] : null;
  const isImage = dicebearUriFromMarker(emoji) !== null;

  if (!frame) {
    return (
      <span className={className} style={{ display: 'inline-flex', lineHeight: 1 }}>
        <Glyph emoji={emoji} size={isImage ? size : size * 0.9} />
      </span>
    );
  }

  // Ringen är ~12 % av diametern: tjock nog att synas även i sidhuvudet.
  const pad = Math.max(3, Math.round(size * 0.12));
  const inner = size - pad * 2;

  // Tre lager i en fast behållare: ringen (som snurrar om ramen är animerad),
  // en blank glansyta och avataren i mitten. Bara ringen roterar, så varken
  // glansen eller figuren snurrar med.
  const layer: CSSProperties = { position: 'absolute', inset: 0, borderRadius: '50%' };
  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        boxShadow: `0 0 ${Math.round(size * 0.3)}px ${frame.glow}, 0 ${Math.max(1, Math.round(size * 0.04))}px ${Math.max(2, Math.round(size * 0.08))}px rgba(0,0,0,0.25)`,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          ...layer,
          background: frame.ring,
          ...(frame.animated ? { animation: 'shop-frame-spin 6s linear infinite' } : {}),
        }}
      />
      {/* Glans: ljus kant upptill, mörkare nertill, som en polerad metallring */}
      <span
        style={{
          ...layer,
          background: 'linear-gradient(170deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.12) 38%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.22) 100%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: pad,
          left: pad,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: inner,
          height: inner,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #f1f5f9 100%)',
          boxShadow: `inset 0 ${Math.max(1, Math.round(size * 0.03))}px ${Math.max(2, Math.round(size * 0.07))}px rgba(0,0,0,0.25)`,
          lineHeight: 1,
          overflow: 'hidden',
        }}
      >
        <Glyph emoji={emoji} size={isImage ? inner : inner * 0.66} />
      </span>
    </span>
  );
}
