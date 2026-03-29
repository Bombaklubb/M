"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

type Particle = {
  color: string;
  x: number;
  y: number;
  diameter: number;
  tilt: number;
  tiltAngleIncrement: number;
  tiltAngle: number;
  particleSpeed: number;
  waveAngle: number;
  opacity: number;
};

type ConfettiContextType = {
  triggerConfetti: () => void;
};

const ConfettiContext = createContext<ConfettiContextType>({
  triggerConfetti: () => {},
});

export interface ConfettiRef {
  fire: () => void;
}

interface ConfettiProps {
  className?: string;
}

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
  ({ className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const activeRef = useRef(false);

    const COLORS = [
      "#f43f5e","#f59e0b","#22c55e","#3b82f6",
      "#a855f7","#06b6d4","#ec4899","#84cc16",
    ];

    const createParticle = useCallback(
      (canvas: HTMLCanvasElement): Particle => ({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: Math.random() * canvas.width,
        y: -10,
        diameter: Math.random() * 10 + 5,
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        particleSpeed: Math.random() * 3 + 2,
        waveAngle: Math.random() * Math.PI * 2,
        opacity: 1,
      }),
      [],
    );

    const triggerConfetti = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: 120 }, () =>
        createParticle(canvas),
      );
      activeRef.current = true;
    }, [createParticle]);

    useImperativeHandle(ref, () => ({ fire: triggerConfetti }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const animate = () => {
        if (!activeRef.current) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current = particlesRef.current.filter(
          (p) => p.y < canvas.height + 20 && p.opacity > 0.05,
        );
        if (particlesRef.current.length === 0) {
          activeRef.current = false;
          return;
        }
        particlesRef.current.forEach((p) => {
          p.y += p.particleSpeed;
          p.waveAngle += 0.04;
          p.x += Math.sin(p.waveAngle) * 2;
          p.tiltAngle += p.tiltAngleIncrement;
          p.tilt = Math.sin(p.tiltAngle) * 12;
          if (p.y > canvas.height * 0.6) p.opacity -= 0.015;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.lineWidth = p.diameter;
          ctx.strokeStyle = p.color;
          ctx.moveTo(p.x + p.tilt + p.diameter / 4, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.diameter / 4);
          ctx.stroke();
          ctx.restore();
        });
        animFrameRef.current = requestAnimationFrame(animate);
      };

      if (activeRef.current) animate();
      return () => cancelAnimationFrame(animFrameRef.current);
    }, []);

    // Watch for trigger
    useEffect(() => {
      if (activeRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particlesRef.current = particlesRef.current.filter(
            (p) => p.y < canvas.height + 20 && p.opacity > 0.05,
          );
          if (particlesRef.current.length === 0) {
            activeRef.current = false;
            return;
          }
          particlesRef.current.forEach((p) => {
            p.y += p.particleSpeed;
            p.waveAngle += 0.04;
            p.x += Math.sin(p.waveAngle) * 2;
            p.tiltAngle += p.tiltAngleIncrement;
            p.tilt = Math.sin(p.tiltAngle) * 12;
            if (p.y > canvas.height * 0.6) p.opacity -= 0.015;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.lineWidth = p.diameter;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.diameter / 4, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.diameter / 4);
            ctx.stroke();
            ctx.restore();
          });
          animFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
      }
    });

    return (
      <ConfettiContext.Provider value={{ triggerConfetti }}>
        <canvas
          ref={canvasRef}
          className={cn(
            "pointer-events-none fixed inset-0 z-50",
            className,
          )}
        />
      </ConfettiContext.Provider>
    );
  },
);

Confetti.displayName = "Confetti";

export function useConfetti() {
  return useContext(ConfettiContext);
}
