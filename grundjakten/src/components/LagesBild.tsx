import type { LagesScen } from '@/types';

/**
 * En bild som visar ett läge: boken PÅ bordet, katten UNDER det.
 *
 * Lägesord går inte att visa med en enda emoji – "på" är ett förhållande
 * mellan två saker, inte en sak. Scenen ritas därför som en liten SVG där
 * saken placeras i förhållande till platsen. Ordningen i SVG:n är djupet:
 * det som ritas sist ligger framför. Så visas "framför" och "bakom" utan
 * perspektiv – hunden täcker dörren, trädet täcker barnet.
 *
 * Bord, låda och vägg finns inte som emoji (eller inte i en form man kan
 * lägga något på eller i) och ritas därför som enkla figurer.
 *
 * Emoji placeras med sin MITTPUNKT (dominant-baseline="central"), så att
 * koordinaterna nedan kan läsas som "här är mitten på saken".
 */

const MARK = 188; // golvets y

function Emoji({ tecken, x, y, storlek, vriden }: {
  tecken: string; x: number; y: number; storlek: number; vriden?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={storlek}
      textAnchor="middle"
      dominantBaseline="central"
      transform={vriden ? `rotate(180 ${x} ${y})` : undefined}
    >
      {tecken}
    </text>
  );
}

/** Ett bord sett från sidan: skiva och två ben. `x` är mitten. */
function Bord({ x, bredd = 120 }: { x: number; bredd?: number }) {
  const v = x - bredd / 2;
  return (
    <g>
      <rect x={v} y={112} width={bredd} height={12} rx={3} fill="#b45309" />
      <rect x={v + 10} y={124} width={10} height={MARK - 124} fill="#92400e" />
      <rect x={v + bredd - 20} y={124} width={10} height={MARK - 124} fill="#92400e" />
    </g>
  );
}

/** En öppen låda: bakstycket ritas före saken, framsidan efter. */
function LadaBak() {
  return <rect x={100} y={116} width={100} height={MARK - 116} rx={4} fill="#92400e" />;
}
function LadaFram() {
  return (
    <g>
      <rect x={96} y={134} width={108} height={MARK - 134} rx={5} fill="#d97706" stroke="#92400e" strokeWidth={3} />
      <line x1={96} y1={160} x2={204} y2={160} stroke="#b45309" strokeWidth={2} />
    </g>
  );
}

/** En tegelvägg till vänster. */
function Vagg() {
  const rader = [];
  for (let r = 0; r < 8; r++) {
    const y = 28 + r * 20;
    rader.push(<line key={`h${r}`} x1={14} y1={y} x2={62} y2={y} stroke="#fecaca" strokeWidth={2} />);
    const forskjut = r % 2 === 0 ? 0 : 12;
    for (let k = 0; k < 2; k++) {
      const xx = 26 + forskjut + k * 24;
      if (xx < 62) rader.push(<line key={`v${r}-${k}`} x1={xx} y1={y} x2={xx} y2={y + 20} stroke="#fecaca" strokeWidth={2} />);
    }
  }
  return (
    <g>
      <rect x={14} y={28} width={48} height={MARK - 28} fill="#dc2626" />
      {rader}
    </g>
  );
}

export function LagesBild({ scen }: { scen: LagesScen }) {
  const { lage, sak, plats, plats2 } = scen;

  let innehall: JSX.Element;
  switch (lage) {
    case 'på':
      innehall = <><Bord x={150} /><Emoji tecken={sak} x={150} y={86} storlek={52} /></>;
      break;
    case 'under':
      innehall = <><Bord x={150} /><Emoji tecken={sak} x={150} y={162} storlek={46} /></>;
      break;
    case 'över':
      // Lampan hänger i en sladd ovanför bordet, med tydlig luft emellan.
      innehall = (
        <>
          <Bord x={150} />
          <line x1={150} y1={0} x2={150} y2={26} stroke="#334155" strokeWidth={3} />
          <Emoji tecken={sak} x={150} y={50} storlek={44} vriden />
        </>
      );
      break;
    case 'i':
      innehall = <><LadaBak /><Emoji tecken={sak} x={150} y={123} storlek={48} /><LadaFram /></>;
      break;
    case 'framför':
      // Platsen först, saken sist: hunden täcker dörrens nedre del.
      innehall = <><Emoji tecken={plats} x={150} y={108} storlek={130} /><Emoji tecken={sak} x={150} y={160} storlek={64} /></>;
      break;
    case 'bakom':
      // Saken först, platsen sist: barnet tittar fram bakom trädets kant.
      innehall = <><Emoji tecken={sak} x={200} y={118} storlek={54} /><Emoji tecken={plats} x={138} y={112} storlek={140} /></>;
      break;
    case 'mellan':
      innehall = (
        <>
          {plats === 'vagg' ? <Vagg /> : <Emoji tecken={plats} x={50} y={140} storlek={80} />}
          {plats2 === 'bord' ? <Bord x={236} bredd={100} /> : plats2 && <Emoji tecken={plats2} x={240} y={140} storlek={80} />}
          <Emoji tecken={sak} x={124} y={152} storlek={64} />
        </>
      );
      break;
    case 'bredvid':
      innehall = <><Emoji tecken={plats} x={112} y={148} storlek={76} /><Emoji tecken={sak} x={198} y={158} storlek={58} /></>;
      break;
  }

  return (
    <svg
      viewBox="0 0 300 200"
      className="h-auto w-[16rem] shrink-0 rounded-card border-4 border-aqua-200 bg-white
                 [@media(min-height:760px)]:w-[19rem] dark:bg-ink-800"
      aria-hidden
    >
      {/* Golvet: allt står på något, så att under och på går att se. */}
      <line x1={8} y1={MARK} x2={292} y2={MARK} stroke="#cbd5e1" strokeWidth={3} strokeLinecap="round" />
      {innehall}
    </svg>
  );
}
