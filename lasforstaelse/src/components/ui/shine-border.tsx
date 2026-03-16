import { cn } from "@/lib/utils";

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
  className?: string;
  children: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--duration": `${duration}s`,
          "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          "--background-radial-gradient": `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(",") : color},transparent,transparent)`,
          borderRadius: `${borderRadius}px`,
        } as React.CSSProperties
      }
      className={cn(
        "relative grid min-h-[60px] w-fit min-w-[200px] place-items-center rounded-lg bg-white p-3 text-black dark:bg-black dark:text-white",
        "before:pointer-events-none before:absolute before:inset-0 before:size-full before:rounded-[inherit] before:[border-width:calc(var(--border-width)*1px)] before:[border:calc(1.5px)_solid_transparent] before:![mask-clip:padding-box,border-box] before:![mask-composite:intersect] before:[mask:var(--mask-linear-gradient)] before:[background:var(--background-radial-gradient)] before:bg-[length:300%_300%] before:animate-shine",
        className
      )}
    >
      {children}
    </div>
  );
}
