import { useState } from 'react';
import type { KistTyp } from '@/types';
import { KIST_META } from '@/data/belohningar';

/**
 * Kistan som bild.
 *
 * Träkistan har riktiga bilder – en stängd och en öppen – i stället för
 * emojin 📦, som renderades som en kartong och inte såg ut som en skatt alls.
 * Silver och guld har ingen egen bild än och faller tillbaka på sin emoji.
 *
 * Filnamnen är på svenska med mellanslag, precis som de laddades upp. De
 * URL-kodas här; en rå sträng med mellanslag och å/ä/ö är inte en giltig
 * webbadress och bilden hade tyst uteblivit på servern.
 *
 * Laddas bilden ändå inte (fel väg, rensad cache) visas emojin i stället.
 * Kistan ska aldrig bli en tom ruta – hela poängen är att se vad man fått.
 */
const BILDER: Partial<Record<KistTyp, { stangd: string; oppen: string }>> = {
  tra: {
    stangd: encodeURI('/stängd träkista.png'),
    oppen: encodeURI('/öppen träkista.png'),
  },
};

export function KistBild({
  typ,
  oppnad,
  size = 56,
  className,
}: {
  typ: KistTyp;
  oppnad: boolean;
  size?: number;
  className?: string;
}) {
  const [trasig, setTrasig] = useState(false);
  const bild = BILDER[typ];
  const src = bild ? (oppnad ? bild.oppen : bild.stangd) : null;

  if (!src || trasig) {
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.9, lineHeight: 1 }}
        aria-hidden
      >
        {KIST_META[typ].emoji}
      </span>
    );
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      aria-hidden
      onError={() => setTrasig(true)}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
