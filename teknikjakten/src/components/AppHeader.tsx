import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Färg på rubriktext och tillbakapil. Ljus, eftersom fältet ligger mot rymden. */
  inkHex?: string;
  /** Bakgrund för rubrikfältet – från utils/theme.ts när ett område är valt. */
  barStyle?: React.CSSProperties;
}

export default function AppHeader({
  title,
  subtitle,
  onBack,
  inkHex = '#e6f0fb',
  barStyle,
}: AppHeaderProps) {
  return (
    <header
      className={`${barStyle ? '' : 'header-bar'} sticky top-0 z-40 px-4 py-3 flex items-center gap-3`}
      style={barStyle}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          aria-label="Tillbaka"
        >
          <ArrowLeft size={20} style={{ color: inkHex }} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-xl leading-tight truncate font-heading" style={{ color: inkHex }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-medium truncate opacity-75" style={{ color: inkHex }}>{subtitle}</p>
        )}
      </div>
    </header>
  );
}
