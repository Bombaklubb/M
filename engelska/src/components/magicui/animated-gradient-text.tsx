import type React from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedGradientText({
  children,
  className,
  style,
}: AnimatedGradientTextProps) {
  return (
    <span
      style={{
        backgroundImage:
          "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #6366f1)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "gradient 4s linear infinite",
        ...style,
      }}
      className={cn("font-bold", className)}
    >
      {children}
    </span>
  );
}
