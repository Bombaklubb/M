import { useApp } from '../contexts/AppContext';
import { ArrowLeft } from 'lucide-react';

const GRADE_THEME: Record<number, {
  bgClass: string;
  headerClass: string;
  inkHex: string;
  accentHex: string;
  pageBgClass: string;
  emoji: string;
}> = {
  4: {
    emoji: '📚',
    bgClass: 'bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100',
    headerClass: 'bg-sky-100/90 border-b border-sky-200/60 backdrop-blur-sm',
    pageBgClass: 'bg-gradient-to-b from-sky-50 to-blue-50',
    inkHex: '#1e3a5f',
    accentHex: '#3b82f6',
  },
  6: {
    emoji: '🚀',
    bgClass: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100',
    headerClass: 'bg-violet-100/90 border-b border-violet-200/60 backdrop-blur-sm',
    pageBgClass: 'bg-gradient-to-b from-violet-50 to-purple-50',
    inkHex: '#2e1a47',
    accentHex: '#7c3aed',
  },
};

const SUBJECTS = [
  { id: 'historia', emoji: '🏰', name: 'Historia' },
  { id: 'geografi', emoji: '🗺️', name: 'Geografi' },
  { id: 'religion', emoji: '🕌', name: 'Religion' },
  { id: 'samhalle', emoji: '🏛️', name: 'Samhälle' },
];

export default function GradeComingSoon() {
  const { selectedGrade, setView } = useApp();
  const grade = selectedGrade ?? 4;
  const theme = GRADE_THEME[grade] ?? GRADE_THEME[4];

  return (
    <div className={`min-h-screen flex flex-col ${theme.pageBgClass}`}>
      {/* Header */}
      <header className={`${theme.headerClass} px-4 py-4 flex items-center gap-3`}>
        <button
          onClick={() => setView('grade-select')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          style={{ background: `${theme.inkHex}10`, border: `2px solid ${theme.inkHex}20` }}
          aria-label="Tillbaka"
        >
          <ArrowLeft size={18} style={{ color: theme.inkHex }} />
        </button>

        <div className="flex-1 flex items-center gap-2.5">
          <span className="text-2xl">{theme.emoji}</span>
          <div>
            <h1
              className="font-bold text-xl leading-tight font-heading"
              style={{ color: theme.inkHex }}
            >
              Årskurs {grade}
            </h1>
            <p className="text-xs font-semibold opacity-60" style={{ color: theme.inkHex }}>
              SO-jakten
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-10 flex flex-col items-center">
        {/* Coming soon card */}
        <div className="clay-card p-8 text-center w-full mb-6">
          <p className="text-6xl mb-4">🚧</p>
          <h2
            className="font-heading font-bold text-2xl mb-2"
            style={{ color: theme.inkHex }}
          >
            Kommer snart!
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Innehållet för Årskurs {grade} är under uppbyggnad.
            Snart finns det uppgifter, begrepp och övningar för alla ämnen här!
          </p>
        </div>

        {/* Subject preview cards — locked */}
        <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3 self-start">
          Ämnen som kommer
        </p>
        <div className="grid grid-cols-2 gap-3 w-full">
          {SUBJECTS.map(s => (
            <div
              key={s.id}
              className="clay-card p-4 flex items-center gap-3 opacity-50"
            >
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className="font-bold text-sm text-gray-700">{s.name}</p>
                <p className="text-xs text-gray-400 font-semibold">Låst</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setView('grade-select')}
          className="mt-8 btn-clay flex items-center gap-2 px-6 py-3 text-sm font-heading bg-white border-gray-200 text-gray-700"
        >
          <ArrowLeft size={15} />
          Välj annan årskurs
        </button>
      </main>
    </div>
  );
}
