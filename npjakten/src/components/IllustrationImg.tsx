import type { Illustration } from "../types";

interface Props {
  image: Illustration;
  className: string;
  decorative?: boolean; // true för miniatyrer där alt-texten vore brus
}

// Bild med reserv: laddar fotot inte (borttagen länk, nätfel) byts
// källan automatiskt till den lokala reservillustrationen.
export default function IllustrationImg({ image, className, decorative }: Props) {
  return (
    <img
      src={image.src}
      alt={decorative ? "" : image.alt}
      loading="lazy"
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (image.fallback && img.dataset.fellBack !== "1") {
          img.dataset.fellBack = "1";
          img.src = image.fallback;
        }
      }}
    />
  );
}
