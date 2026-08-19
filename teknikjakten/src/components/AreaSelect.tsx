import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getChaptersForAreaAndGrade, getAreasWithContent, ALL_CHAPTERS } from '../data/areas';
import { getProgress } from '../utils/storage';
import { cardStyle } from '../utils/theme';
import type { Area, ChapterProgress } from '../types';
import SearchModal from './SearchModal';

function AreaCard({ area, grade, progress, onClick }: {
  area: Area; grade: number; progress: ChapterProgress[]; onClick: () => void;
}) {
  const chapters = getChaptersForAreaAndGrade(area.id, grade);
  const done = chapters.filter(c => progress.some(p => p.chapterId === c.id && p.completed)).length;
  const total = chapters.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className="clay-area relative overflow-hidden p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] active:translate-y-1 cursor-pointer"
      style={cardStyle(area)}
    >
      {/* Kortkoden som vattenstämpel */}
      <span
        className="absolute right-3 bottom-3 text-5xl font-black leading-none pointer-events-none select-none opacity-[0.08] font-heading"
        style={{ color: area.inkHex }}
        aria-hidden="true"
      >
        {area.shortName}
      </span>

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-4xl leading-none" aria-hidden="true">{area.emoji}</span>
          <div>
            <p className="font-bold text-xl leading-tight font-heading" style={{ color: area.inkHex }}>
              {area.name}
            </p>
            <p className="text-xs font-semibold mt-0.5 opacity-60" style={{ color: area.inkHex }}>
              {total} {total === 1 ? 'kapitel' : 'kapitel'}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold opacity-70" style={{ color: area.inkHex }}>
              {done}/{total} klara
            </span>
            {done === total && total > 0 && (
              <span className="text-xs font-black" style={{ color: area.progressHex }}>Klar!</span>
            )}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${area.inkHex}18` }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: area.progressHex }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function AreaSelect() {
  const { setView, selectedGrade, openChapterStudy, selectArea } = useApp();
  const grade = selectedGrade ?? 4;
  const [searchOpen, setSearchOpen] = useState(false);

  // Läs sparad progress en gång per rendering i stället för en gång per områdeskort.
  const progress = getProgress();
  const areas = useMemo(() => getAreasWithContent(grade), [grade]);

  function handleSearchSelect(_areaId: string, chapterId: string) {
    const chapter = ALL_CHAPTERS.find(c => c.id === chapterId);
    // openChapterStudy synkar årskurs och område med kapitlet, så eleven inte
    // hamnar i ett kapitel från en annan årskurs än den som är vald.
    if (chapter) openChapterStudy(chapter);
  }

  return (
    <div className="min-h-screen">
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
      />

      <div
        className="relative w-full"
        style={{ background: 'linear-gradient(160deg, #dbeafe 0%, #e0e7ff 45%, #f1f5f9 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(31,42,68,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(31,42,68,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />

        <header className="relative z-10 px-4 pt-6 pb-2 flex items-center">
          <button
            onClick={() => setView('grade-select')}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            style={{ background: 'rgba(31,42,68,0.08)', border: '2px solid rgba(31,42,68,0.15)' }}
            aria-label="Tillbaka till årskursval"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8L10 13" stroke="#1f2a44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-heading font-bold text-4xl drop-shadow-sm" style={{ color: '#1f2a44' }}>Teknikjakten</h1>
            <p className="text-base font-semibold mt-1 text-gray-700">Åk {grade}</p>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            style={{ background: 'rgba(31,42,68,0.08)', border: '2px solid rgba(31,42,68,0.15)' }}
            aria-label="Sök begrepp"
          >
            <Search size={16} color="#1f2a44" />
          </button>
        </header>

        <div className="h-14 sm:h-20" />
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 -mt-2 relative z-10">
        {areas.length > 0 && (
          <p className="text-center text-gray-500 font-semibold mb-4 text-sm">Välj ett område att öva på</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              grade={grade}
              progress={progress}
              onClick={() => selectArea(area)}
            />
          ))}
        </div>

        {areas.length === 0 && (
          <div className="text-center py-12 clay-card">
            <p className="text-4xl mb-3" aria-hidden="true">🚧</p>
            <p className="font-bold text-gray-700 text-lg">Inget innehåll för Åk {grade} än</p>
            <p className="text-gray-500 text-sm mt-1">Områdena fylls på snart. Välj en annan årskurs så länge.</p>
          </div>
        )}

        <button
          onClick={() => setView('achievements')}
          className="mt-6 w-full clay-card-sm py-3 flex items-center justify-center gap-2 text-sm font-black text-gray-600 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          🏆 Mina prestationer
        </button>
      </main>
    </div>
  );
}
