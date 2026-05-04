import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  accentClass?: string;
}

export default function AppHeader({ title, subtitle, onBack, accentClass = 'text-indigo-700' }: AppHeaderProps) {
  return (
    <header className="header-bar sticky top-0 z-40 px-4 py-3 flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          aria-label="Tillbaka"
        >
          <ArrowLeft size={20} className="text-indigo-600" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className={`font-heading font-bold text-xl leading-tight truncate ${accentClass}`}>{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 font-medium truncate">{subtitle}</p>}
      </div>
    </header>
  );
}
