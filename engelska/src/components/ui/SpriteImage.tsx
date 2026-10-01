import type { CSSProperties } from "react";
import sprites from "@/lib/generated/sprites.json";

/**
 * Visar en bild ur sprite-filen (se scripts/build-sprites.mjs) i stället för en
 * egen fil. Alla avatarer och kistor ligger i samma fil, så webbläsaren hämtar
 * den en gång och har sedan alla bilder.
 *
 * `src` är samma sökväg som förut, t.ex. "/avatars/ninja.svg". Finns bilden
 * inte i sprite-filen visas den som en vanlig <img>, så inget går sönder.
 *
 * Rutan är kvadratisk och fyller elementets höjd (bilderna ligger centrerade i
 * sin ruta som med object-contain). Elementen får därför vara bredare än höga.
 */
interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** "flex" när elementet ska centreras med mx-auto. */
  display?: "flex" | "inline-flex";
}

type Entry = { col: number; row: number };
const ENTRIES = sprites.entries as Record<string, Entry>;

export function hasSprite(src: string | undefined): boolean {
  return !!src && src in ENTRIES;
}

export default function SpriteImage({ src, alt, className, style, display = "inline-flex" }: Props) {
  const e = ENTRIES[src];
  if (!e) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`object-contain ${className ?? ""}`} style={style} />;
  }
  const { cols, rows } = sprites;
  const x = cols > 1 ? (e.col / (cols - 1)) * 100 : 0;
  const y = rows > 1 ? (e.row / (rows - 1)) * 100 : 0;
  return (
    <span
      {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      className={className}
      style={{ display, alignItems: "center", justifyContent: "center", ...style }}
    >
      <span
        style={{
          display: "block",
          height: "100%",
          maxWidth: "100%",
          aspectRatio: "1 / 1",
          backgroundImage: `url(${sprites.url})`,
          backgroundSize: `${cols * 100}% ${rows * 100}%`,
          backgroundPosition: `${x}% ${y}%`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </span>
  );
}
