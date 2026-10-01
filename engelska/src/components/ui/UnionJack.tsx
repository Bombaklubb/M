/**
 * Unionsflaggan direkt i sidan i stället för som /union-jack.svg, så att den
 * inte kostar ett eget anrop. Filen finns kvar som favikon.
 *
 * fit="cover" motsvarar object-cover (beskärs till rutan), fit="fill"
 * motsvarar en vanlig <img> utan object-fit (sträcks ut).
 */
export default function UnionJack({ className, fit = "cover", title }: { className?: string; fit?: "cover" | "fill"; title?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 36"
      preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "none"}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="60" height="36" fill="#012169" />
      <line x1="0" y1="0" x2="60" y2="36" stroke="white" strokeWidth="7.2" />
      <line x1="60" y1="0" x2="0" y2="36" stroke="white" strokeWidth="7.2" />
      <path d="M0,0 L30,18" stroke="#C8102E" strokeWidth="2.4" strokeDasharray="100" />
      <path d="M30,18 L60,36" stroke="#C8102E" strokeWidth="2.4" />
      <path d="M60,0 L30,18" stroke="#C8102E" strokeWidth="2.4" />
      <path d="M30,18 L0,36" stroke="#C8102E" strokeWidth="2.4" />
      <rect x="22.8" y="0" width="14.4" height="36" fill="white" />
      <rect x="0" y="10.8" width="60" height="14.4" fill="white" />
      <rect x="25.2" y="0" width="9.6" height="36" fill="#C8102E" />
      <rect x="0" y="13.2" width="60" height="9.6" fill="#C8102E" />
    </svg>
  );
}
