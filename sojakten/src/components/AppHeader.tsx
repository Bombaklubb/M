import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  accentClass?: string;
  headerClass?: string;
  titleStyle?: React.CSSProperties;
  headingFont?: string;
}

export default function AppHeader({
  title,
  subtitle,
  onBack,
  accentClass = 'text-indigo-700',
  headerClass = 'header-bar',
  titleStyle,
  headingFont,
}: AppHeaderProps) {
  return (
    <header className={`${headerClass} sticky top-0 z-40 px-4 py-3 flex items-center gap-3`}>
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-black/5 border-2 border-black/10 flex items-center justify-center hover:bg-black/10 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          aria-label="Tillbaka"
        >
          <ArrowLeft size={20} className={accentClass} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1
          className={`font-bold text-xl leading-tight truncate ${accentClass} ${headingFont ?? 'font-heading'}`}
          style={titleStyle}
        >
          {title}
        </h1>
        {subtitle && <p className="text-xs font-medium truncate opacity-60" style={titleStyle}>{subtitle}</p>}
      </div>
    </header>
  );
}
