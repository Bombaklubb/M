import React, { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparkleProps {
  size?: number;
  color?: string;
  className?: string;
}

const Sparkle = ({ size = 20, color = "#FFC700", className }: SparkleProps) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </svg>
  );
};

interface SparkleType {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
}

interface SparklesProps {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}

export const Sparkles = ({
  children,
  className,
  sparklesCount = 10,
  colors = { first: "#A855F7", second: "#6366F1" },
}: SparklesProps) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);
  const uniqueId = useId();

  useEffect(() => {
    const generateSparkle = (): SparkleType => {
      return {
        id: `${uniqueId}-${Math.random()}`,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: Math.random() > 0.5 ? colors.first : colors.second,
        delay: Math.random() * 2,
        scale: Math.random() * 1 + 0.3,
      };
    };

    const initialSparkles = Array.from({ length: sparklesCount }, () =>
      generateSparkle()
    );
    setSparkles(initialSparkles);
  }, [sparklesCount, uniqueId, colors.first, colors.second]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute z-20"
          style={{
            left: sparkle.x,
            top: sparkle.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, sparkle.scale, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: sparkle.delay,
          }}
        >
          <Sparkle size={16} color={sparkle.color} />
        </motion.span>
      ))}
    </span>
  );
};
