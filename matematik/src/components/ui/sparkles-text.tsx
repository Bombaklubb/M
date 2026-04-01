"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
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

const COLORS = ["#fbbf24", "#f43f5e", "#a855f7", "#22c55e", "#3b82f6"];

function generateSparkle(color = COLORS[Math.floor(Math.random() * COLORS.length)]): Sparkle {
  return {
    id: Math.random().toString(36).slice(2),
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    color,
    delay: Math.random() * 2,
    scale: Math.random() * 1 + 0.5,
    lifespan: Math.random() * 1500 + 500,
  };
}

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}

export function SparklesText({
  children,
  className,
  sparklesCount = 6,
  colors = { first: "#fbbf24", second: "#f43f5e" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () =>
      Array.from({ length: sparklesCount }, () =>
        generateSparkle(Math.random() > 0.5 ? colors.first : colors.second),
      );
    setSparkles(generateSparkles());
    const interval = setInterval(() => setSparkles(generateSparkles()), 1500);
    return () => clearInterval(interval);
  }, [sparklesCount, colors.first, colors.second]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, sparkle.scale, 0] }}
          transition={{ duration: sparkle.lifespan / 1000, delay: sparkle.delay, ease: "easeInOut" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 0 L6.5 5 L12 6 L6.5 6.5 L6 12 L5.5 6.5 L0 6 L5.5 5 Z"
              fill={sparkle.color}
            />
          </svg>
        </motion.span>
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
