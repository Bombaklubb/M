import { useState, Suspense, lazy } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AREAS } from '../data/areaMeta';
import { getProgress } from '../utils/storage';
import { cardStyle, SPACE, withAlpha } from '../utils/theme';
import type { Area, ChapterProgress } from '../types';

// Sökningen läser alla kapitel, så den laddas först när eleven öppnar den –
// annars skulle kapiteldatan följa med i startpaketet.
const SearchModal = lazy(() => import('./SearchModal'));

function AreaCard({ area, progress, onClick }: {
  area: Area; progress: ChapterProgress[]; onClick: () => void;
}) {
  // Klarade kapitel räknas ur id-prefixet ('rorelse-enkla-maskiner'), så kortet
  // slipper ladda kapiteldatan bara för att visa hur långt eleven kommit.
  const done = progress.filter(p => p.completed && p.chapterId.startsWith(`${area.id}-`)).length;
  const total = area.chapterCount;
  const pct = total > 0 ? Math.round((Math.min(done, total) / total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className="space-panel relative overflow-hidden p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] active:translate-y-1 cursor-pointer"
      style={cardStyle(area)}
    >
      {/* Svag glöd i kortets hörn, som ljuset från en av stationens moduler */}
      <span
        className="absolute -right-6 -top-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${withAlpha(area.glowHex, 0.3)} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-4xl leading-none" aria-hidden="true">{area.emoji}</span>
          <div>
            <p className="font-bold text-xl leading-tight font-heading break-words" style={{ color: area.glowHex }}>
              {area.name}
            </p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: SPACE.onDarkMuted }}>
              {total} {total === 1 ? 'kapitel' : 'kapitel'}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold" style={{ color: SPACE.onDarkMuted }}>
              {Math.min(done, total)}/{total} klara
            </span>
            {done >= total && total > 0 && (
              <span className="text-xs font-black" style={{ color: area.glowHex }}>Klar!</span>
            )}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: withAlpha(SPACE.deepest, 0.55) }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: area.accentHex, boxShadow: `0 0 12px ${withAlpha(area.glowHex, 0.7)}` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function AreaSelect() {
  const { setView, selectArea, openChapterStudy } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);

  // Läs sparad progress en gång per rendering i stället för en gång per områdeskort.
  const progress = getProgress();
  // Områden utan kapitel döljs – annars möter eleven en återvändsgränd.
  const areas = AREAS.filter(a => a.chapterCount > 0);

  async function handleSearchSelect(_areaId: string, chapterId: string) {
    const { ALL_CHAPTERS } = await import('../data/areas');
    const chapter = ALL_CHAPTERS.find(c => c.id === chapterId);
    // openChapterStudy synkar området med kapitlet, så eleven inte hamnar i ett
    // kapitel som inte finns på den kapitelkarta hen sedan går tillbaka till.
    if (chapter) openChapterStudy(chapter);
  }

  return (
    <div className="min-h-screen">
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelect={handleSearchSelect}
          />
        </Suspense>
      )}

      {/* Rymdstationen som bakgrund. Bilden ligger fast medan sidan skrollar,
          med en mörkning nedtill så att korten alltid har kontrast mot den. */}
      <div className="space-bg relative w-full">
        {/* Mörkning uppe och nere: rubriken behöver en lugn yta att ligga mot,
            och korten behöver kontrast där bilden tonar ut. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${withAlpha(SPACE.deepest, 0.82)} 0%, ${withAlpha(SPACE.deepest, 0.45)} 22%, ${withAlpha(SPACE.deepest, 0.1)} 45%, ${withAlpha(SPACE.deep, 0.95)} 100%)`,
          }}
          aria-hidden="true"
        />

        <header className="relative z-10 px-4 pt-7 pb-2 flex items-start">
          <div className="w-11 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 text-center">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-glow" style={{ color: '#ffffff' }}>
              Teknikjakten
            </h1>
            <p className="text-base font-semibold mt-1 text-shadow" style={{ color: SPACE.atmosphere }}>
              Teknik för åk 4–6
            </p>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0"
            style={{ background: withAlpha(SPACE.panel, 0.7), border: `2px solid ${withAlpha(SPACE.beamBright, 0.45)}` }}
            aria-label="Sök begrepp"
          >
            <Search size={16} color={SPACE.beamBright} />
          </button>
        </header>

        {/* Luft så att rymdstationen syns innan korten börjar */}
        <div className="h-52 sm:h-72" />
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 -mt-2 relative z-10">
        {areas.length > 0 && (
          <p className="text-center font-semibold mb-4 text-sm" style={{ color: SPACE.onDarkMuted }}>Välj ett område att öva på</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              progress={progress}
              onClick={() => selectArea(area)}
            />
          ))}
        </div>

        {areas.length === 0 && (
          <div className="text-center py-12 clay-card">
            <p className="text-4xl mb-3" aria-hidden="true">🚧</p>
            <p className="font-bold text-gray-700 text-lg">Innehållet är på väg</p>
            <p className="text-gray-500 text-sm mt-1">Områdena öppnas så fort kapitlen är klara.</p>
          </div>
        )}

        <button
          onClick={() => setView('achievements')}
          className="mt-6 w-full space-panel py-3 flex items-center justify-center gap-2 text-sm font-black transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          style={{ background: withAlpha(SPACE.panel, 0.8), borderColor: withAlpha(SPACE.beamBright, 0.35), color: SPACE.atmosphere }}
        >
          🏆 Mina prestationer
        </button>
      </main>
    </div>
  );
}
