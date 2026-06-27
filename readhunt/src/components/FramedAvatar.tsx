import React from 'react';
import { FRAME_MAP, EFFECT_MAP, type ShopFrame, type ShopEffect, type EffectKind } from '../data/shop';

interface FramedAvatarProps {
  emoji: string;
  size?: number;
  frameId?: string | null;
  effectId?: string | null;
  className?: string;
}

// Animation-namn (definierade i index.css) per effekt-typ
const FX_ANIM: Record<EffectKind, { name: string; duration: string }> = {
  twinkle: { name: 'fx-twinkle', duration: '1.8s' },
  rise:    { name: 'fx-rise',    duration: '1.4s' },
  fall:    { name: 'fx-fall',    duration: '2.4s' },
  flash:   { name: 'fx-flash',   duration: '1.6s' },
  burst:   { name: 'fx-burst',   duration: '1.6s' },
  pulse:   { name: 'fx-pulse',   duration: '2.2s' },
};

// Partikel-positioner (i procent av behållaren, 50/50 = mitten) per effekt-typ
const FX_POSITIONS: Record<EffectKind, { left: number; top: number }[]> = {
  twinkle: [ { left: 6, top: 16 }, { left: 92, top: 22 }, { left: 0, top: 60 }, { left: 98, top: 64 }, { left: 24, top: 0 }, { left: 74, top: 4 } ],
  pulse:   [ { left: 50, top: -8 }, { left: 14, top: 8 }, { left: 86, top: 8 } ],
  flash:   [ { left: 4, top: 10 }, { left: 96, top: 18 }, { left: 92, top: 70 } ],
  rise:    [ { left: 18, top: 96 }, { left: 50, top: 102 }, { left: 82, top: 94 } ],
  fall:    [ { left: 10, top: -6 }, { left: 32, top: 2 }, { left: 54, top: -8 }, { left: 76, top: 0 }, { left: 94, top: 6 } ],
  burst:   [ { left: 8, top: 8 }, { left: 50, top: -6 }, { left: 92, top: 10 }, { left: 22, top: 36 }, { left: 80, top: 38 } ],
};

function AvatarCore({ emoji, frame, size }: { emoji: string; frame?: ShopFrame; size: number }) {
  const ringWidth = Math.max(3, Math.round(size / 14));
  const innerSize = size - ringWidth * 2;

  if (!frame) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40"
        style={{ width: size, height: size, fontSize: innerSize * 0.55 }}
      >
        {emoji}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${frame.animated ? 'animate-[spin_8s_linear_infinite]' : ''}`}
      style={{
        width: size,
        height: size,
        background: frame.ring,
        boxShadow: `0 0 ${size / 4}px ${frame.glow}`,
      }}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 ${frame.animated ? 'animate-[spin_8s_linear_infinite_reverse]' : ''}`}
        style={{ width: innerSize, height: innerSize, fontSize: innerSize * 0.55 }}
      >
        {emoji}
      </div>
    </div>
  );
}

export default function FramedAvatar({ emoji, size = 48, frameId, effectId, className = '' }: FramedAvatarProps) {
  const frame: ShopFrame | undefined = frameId ? FRAME_MAP[frameId] : undefined;
  const effect: ShopEffect | undefined = effectId ? EFFECT_MAP[effectId] : undefined;

  if (!effect) {
    return (
      <div className={`inline-flex ${className}`}>
        <AvatarCore emoji={emoji} frame={frame} size={size} />
      </div>
    );
  }

  const anim = FX_ANIM[effect.kind];
  const positions = FX_POSITIONS[effect.kind];
  const particleSize = Math.max(10, Math.round(size * 0.30));

  return (
    <div
      className={`relative inline-flex ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Sken bakom avataren */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: `0 0 ${size / 2.2}px ${size / 6}px ${effect.glow}`,
          animation: `fx-pulse ${anim.duration} ease-in-out infinite`,
        }}
      />
      <AvatarCore emoji={emoji} frame={frame} size={size} />
      {/* Partiklar */}
      {positions.map((p, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: particleSize,
            lineHeight: 1,
            animation: `${anim.name} ${anim.duration} ease-in-out infinite`,
            animationDelay: `${(i * 0.22).toFixed(2)}s`,
          }}
        >
          {effect.emoji}
        </span>
      ))}
    </div>
  );
}
