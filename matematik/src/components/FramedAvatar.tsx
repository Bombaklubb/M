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

  const pad = Math.max(2, Math.round(size * 0.1));
  const inner = size - pad * 2;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: frame.ring,
        boxShadow: `0 0 ${Math.round(size * 0.3)}px ${frame.glow}`,
        padding: pad,
        flexShrink: 0,
        ...(frame.animated ? { animation: 'shop-frame-spin 6s linear infinite' } : {}),
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: inner,
          height: inner,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)',
          lineHeight: 1,
          overflow: 'hidden',
          // motverka att den roterande ringen snurrar glyfen
          ...(frame.animated ? { animation: 'shop-frame-spin 6s linear infinite reverse' } : {}),
        }}
      >
        <Glyph emoji={emoji} size={isImage ? inner : inner * 0.66} />
      </span>
    </span>
  );
}
