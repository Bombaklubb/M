"use client";

import { useState } from "react";
import { FRAME_MAP } from "@/lib/shop";
import type { Avatar } from "@/lib/avatars";

function Glyph({ avatar, size }: { avatar: Avatar; size: number }) {
  const [error, setError] = useState(false);
  if (avatar.image && !error) {
    return (
      <img
        src={avatar.image}
        alt={avatar.name}
        className="object-contain"
        style={{ width: size, height: size }}
        onError={() => setError(true)}
      />
    );
  }
  return <span style={{ fontSize: size * 0.78, lineHeight: 1 }}>{avatar.emoji}</span>;
}

interface FramedAvatarProps {
  avatar: Avatar;
  frameId?: string | null;
  /** Yttre diameter i px (inkl. ram). */
  size?: number;
  className?: string;
}

/** Visar en avatar med valfri köpt ram (glow + ring) runt om. */
export default function FramedAvatar({ avatar, frameId, size = 40, className }: FramedAvatarProps) {
  const frame = frameId ? FRAME_MAP[frameId] : null;

  if (!frame) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}
      >
        <Glyph avatar={avatar} size={size} />
      </span>
    );
  }

  const pad = Math.max(2, Math.round(size * 0.1));
  const inner = size - pad * 2;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "9999px",
        background: frame.ring,
        boxShadow: `0 0 ${Math.round(size * 0.3)}px ${frame.glow}`,
        padding: pad,
        flexShrink: 0,
        ...(frame.animated ? { animation: "shop-frame-spin 6s linear infinite" } : {}),
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: inner,
          height: inner,
          borderRadius: "9999px",
          background: "white",
          overflow: "hidden",
          ...(frame.animated ? { animation: "shop-frame-spin 6s linear infinite reverse" } : {}),
        }}
      >
        <Glyph avatar={avatar} size={inner * 0.8} />
      </span>
    </span>
  );
}
