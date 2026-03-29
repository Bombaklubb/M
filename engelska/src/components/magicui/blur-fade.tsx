"use client";

import { useRef, useEffect, useState } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;         // seconds
  duration?: number;      // seconds
  yOffset?: number;       // px downward start
  inView?: boolean;       // force trigger immediately
  blur?: string;          // tailwind blur class e.g. "sm"
}

export function BlurFade({
  children,
  className = "",
  delay = 0,
  duration = 0.4,
  yOffset = 8,
  inView = false,
  blur = "sm",
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(inView);

  useEffect(() => {
    if (inView) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        filter:     visible ? "blur(0px)" : `blur(6px)`,
        transform:  visible ? "translateY(0px)" : `translateY(${yOffset}px)`,
        transition: `opacity ${duration}s ease-out ${delay}s, filter ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
