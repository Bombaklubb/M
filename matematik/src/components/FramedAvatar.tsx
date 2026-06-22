import React from 'react';
import { FRAME_MAP } from '../data/shop';

interface Props {
  emoji: string;
  frameId?: string | null;
  /** Ytterdiameter i px (inkl. ram). */
  size?: number;
  className?: string;
}

/**
 * Visar en emoji-avatar med valfri köpt ram (glow + färgad ring).
 * Utan ram renderas bara emojin – ingen layout-skillnad mot tidigare.
 */
export default function FramedAvatar({ emoji, frameId, size = 40, className }: Props) {
  const frame = frameId ? FRAME_MAP[frameId] : null;

  if (!frame) {
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.9, lineHeight: 1, display: 'inline-block' }}
      >
        {emoji}
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
          fontSize: inner * 0.66,
          lineHeight: 1,
          // motverka att den roterande ringen snurrar emojin
          ...(frame.animated ? { animation: 'shop-frame-spin 6s linear infinite reverse' } : {}),
        }}
      >
        {emoji}
      </span>
    </span>
  );
}
