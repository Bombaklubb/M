/**
 * Grundjaktens märke.
 *
 * Ett A som står på en grund – tre block som bär bokstaven. Namnet betyder
 * just det: grunderna, det som allt annat vilar på.
 *
 * Ritad som SVG och inte som emoji, eftersom emoji renderas olika på olika
 * system och det här är appens enda fasta identitet. Formerna är grova med
 * flit: märket ska läsas på 32 px på en Chromebook, inte i en logotypmanual.
 */
export function GrundjaktenLogo({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Grundjakten"
      /* className vinner över width/height-attributen, så storleken kan
         göras responsiv utan att attributen behöver räknas om. */
      className={['shrink-0', className].filter(Boolean).join(' ')}
    >
      <rect x="1" y="1" width="46" height="46" rx="12" fill="#6d28d9" />
      {/* A:et – bokstaven eleven möter först. */}
      <path
        d="M24 10 L33 32 M24 10 L15 32 M18.6 25.5 H29.4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Grunden: tre block, det mittersta ifyllt som ett avklarat steg. */}
      <rect x="11" y="36" width="8" height="5" rx="2" fill="#a3e635" />
      <rect x="20" y="36" width="8" height="5" rx="2" fill="#84cc16" />
      <rect x="29" y="36" width="8" height="5" rx="2" fill="#a3e635" opacity="0.55" />
    </svg>
  );
}
