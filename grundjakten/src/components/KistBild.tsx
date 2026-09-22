import { useState } from 'react';
import type { KistTyp } from '@/types';
import { KIST_META } from '@/data/belohningar';

/**
 * Kistan som bild.
 *
 * ALLA tre typerna har nu egen bild i båda lägena – stängd och öppen.
 * Tidigare hade bara träkistan bilder, och silver och guld föll tillbaka på
 * emojierna 🪙 och 🏆: ett mynt och en pokal, alltså inte kistor alls.
 * Läraren såg fel bilder, och det stämde.
 *
 * Bilderna kommer från Mattejaktens uppsättning (`matematik/public`), som
 * läraren uttryckligen bad om. De är KOPIERADE hit, inte länkade: apparna
 * delar repo men inte filer, och en relativ väg till en annan apps mapp
 * finns inte på Grundjaktens egen domän.
 *
 * De öppna originalen var 1024×1024 med en inbakad glödande bakgrund och
 * 2 MB styck – en fyrkantig platta bakom kistan när den ritas liten, och
 * tung att ladda på en skol-Chromebook. De är därför avbakgrundade,
 * beskurna till kistan och skalade till 256×256 (~120 kB).
 *
 * Filnamnen är avsiktligt ASCII. De gamla hette "öppen träkista.png" med
 * mellanslag och ä – det fungerade bara så länge varje anropsställe kom
 * ihåg att URL-koda.
 *
 * Laddas en bild ändå inte (fel väg, rensad cache) visas emojin i stället.
 * Kistan ska aldrig bli en tom ruta – hela poängen är att se vad man fått.
 */
const BILDER: Record<KistTyp, { stangd: string; oppen: string }> = {
  tra: { stangd: '/kista-tra-stangd.png', oppen: '/kista-tra-oppen.png' },
  silver: { stangd: '/kista-silver-stangd.png', oppen: '/kista-silver-oppen.png' },
  guld: { stangd: '/kista-guld-stangd.png', oppen: '/kista-guld-oppen.png' },
  smaragd: { stangd: '/kista-smaragd-stangd.png', oppen: '/kista-smaragd-oppen.png' },
  rubin: { stangd: '/kista-rubin-stangd.png', oppen: '/kista-rubin-oppen.png' },
  diamant: { stangd: '/kista-diamant-stangd.png', oppen: '/kista-diamant-oppen.png' },
  // Den hemliga kistan saknar öppen variant i uppsättningen. Den SUDDIGA
  // bilden får vara den stängda – man ska inte se vad det är förrän den är
  // öppnad, och det är hela poängen med den.
  hemlig: { stangd: '/kista-hemlig-stangd.png', oppen: '/kista-hemlig-oppen.png' },
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
