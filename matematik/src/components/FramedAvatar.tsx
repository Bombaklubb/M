import React from 'react';
import { FRAME_MAP, EFFECT_MAP } from '../data/shop';
import { dicebearUriFromMarker } from '../utils/dicebear';

interface Props {
  emoji: string;
  frameId?: string | null;
  /** Effekt-id (svävande partiklar runt avataren). */
  effectId?: string | null;
  /** Ytterdiameter i px (inkl. ram). */
  size?: number;
  className?: string;
}

/** Tre svävande partiklar runt avatarens överkant. */
function EffectOverlay({ particle, size }: { particle: string; size: number }) {
  const p = Math.max(11, Math.round(size * 0.34));
  // Position (x%, y%) runt avatarens överkant + animationsfördröjning.
  const bits: { left: string; top: string; delay: string }[] = [
    { left: '-8%',  top: '4%',   delay: '0s' },
    { left: '50%',  top: '-16%', delay: '0.5s' },
    { left: '92%',  top: '6%',   delay: '1s' },
  ];
  return (
    <span aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {bits.map((b, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            top: b.top,
            transform: 'translate(-50%, -50%)',
            fontSize: p,
            lineHeight: 1,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
            animation: `avatar-effect-float 2.4s ease-in-out ${b.delay} infinite`,
          }}
        >
          {particle}
        </span>
      ))}
    </span>
  );
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
export default function FramedAvatar({ emoji, frameId, effectId, size = 40, className }: Props) {
  const frame = frameId ? FRAME_MAP[frameId] : null;
  const effect = effectId ? EFFECT_MAP[effectId] : null;
  const isImage = dicebearUriFromMarker(emoji) !== null;

  let avatarNode: React.ReactNode;

  if (!frame) {
    avatarNode = (
      <span style={{ display: 'inline-flex', lineHeight: 1 }}>
        <Glyph emoji={emoji} size={isImage ? size : size * 0.9} />
      </span>
    );
  } else {
    const pad = Math.max(2, Math.round(size * 0.1));
    const inner = size - pad * 2;
    avatarNode = (
      <span
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

  // Utan effekt: rendera avataren direkt (oförändrat beteende).
  if (!effect) {
    return <span className={className} style={{ display: 'inline-flex', lineHeight: 1 }}>{avatarNode}</span>;
  }

  // Med effekt: lägg svävande partiklar i ett relativt omslag.
  return (
    <span
      className={className}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
    >
      {avatarNode}
      <EffectOverlay particle={effect.particle} size={size} />
    </span>
  );
}
