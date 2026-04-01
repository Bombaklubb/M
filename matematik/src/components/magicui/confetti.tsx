"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const COLORS = [
  "#f59e0b", "#8b5cf6", "#10b981", "#ef4444", "#3b82f6",
  "#f97316", "#ec4899", "#14b8a6", "#a3e635", "#fb923c",
];

export function Confetti({ active, duration = 2500 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: randomBetween(0.2, 0.8) * canvas.width,
      y: randomBetween(-0.1, 0.2) * canvas.height,
      vx: randomBetween(-4, 4),
      vy: randomBetween(-12, -4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(6, 12),
      rotation: randomBetween(0, Math.PI * 2),
      rotSpeed: randomBetween(-0.15, 0.15),
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    startRef.current = performance.now();

    function draw(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startRef.current;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const alpha = elapsed > duration - 500
        ? 1 - (elapsed - (duration - 500)) / 500
        : 1;

      particles.forEach((p) => {
        p.vy += 0.3;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ display: active ? "block" : "none" }}
    />
  );
}
