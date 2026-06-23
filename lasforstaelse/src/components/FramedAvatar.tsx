import React from 'react';
import { FRAME_MAP, type ShopFrame } from '../data/shop';

interface FramedAvatarProps {
  emoji: string;
  size?: number;
  frameId?: string | null;
  className?: string;
}

export default function FramedAvatar({ emoji, size = 48, frameId, className = '' }: FramedAvatarProps) {
  const frame: ShopFrame | undefined = frameId ? FRAME_MAP[frameId] : undefined;
  const ringWidth = Math.max(3, Math.round(size / 14));
  const innerSize = size - ringWidth * 2;

  if (!frame) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 ${className}`}
        style={{ width: size, height: size, fontSize: innerSize * 0.55 }}
      >
        {emoji}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${frame.animated ? 'animate-[spin_8s_linear_infinite]' : ''} ${className}`}
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
