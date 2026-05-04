"use client";

import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateSparkle(colors: string[]): Sparkle {
  return {
    id: Math.random().toString(36).slice(2),
    x: `${random(10, 90)}%`,
    y: `${random(10, 90)}%`,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: random(0, 1),
    scale: random(0.5, 1.2),
    lifespan: random(800, 1400),
  };
}

interface SparklesTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  sparkleCount?: number;
}

export function SparklesText({
  children,
  className,
  colors = ["#f59e0b", "#8b5cf6", "#10b981", "#ef4444", "#3b82f6"],
  sparkleCount = 6,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: sparkleCount }, () => generateSparkle(colors))
    );

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const now = Date.now();
        return [
          ...prev.slice(-sparkleCount + 1),
          generateSparkle(colors),
        ];
      });
    }, 600);

    return () => clearInterval(interval);
  }, [sparkleCount, colors]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="pointer-events-none absolute animate-ping"
          style={
            {
              left: sparkle.x,
              top: sparkle.y,
              color: sparkle.color,
              fontSize: `${sparkle.scale * 14}px`,
              animationDuration: `${sparkle.lifespan}ms`,
              animationDelay: `${sparkle.delay}s`,
            } as CSSProperties
          }
        >
          ✦
        </span>
      ))}
      {children}
    </span>
  );
}
