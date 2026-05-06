import { useApp } from '../contexts/AppContext';

interface GradeCard {
  grade: number;
  emoji: string;
  label: string;
  subjects: string;
  available: boolean;
  bgClass: string;
  borderColor: string;
  inkHex: string;
  accentHex: string;
}

const GRADE_CARDS: GradeCard[] = [
  {
    grade: 4,
    emoji: '📚',
    label: 'Årskurs 4',
    subjects: 'Historia · Geografi · Religion · Samhälle',
    available: false,
    bgClass: 'bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100',
    borderColor: '#93c5fd',
    inkHex: '#1e3a5f',
    accentHex: '#3b82f6',
  },
  {
    grade: 5,
    emoji: '🎯',
    label: 'Årskurs 5',
    subjects: 'Historia · Geografi · Religion · Samhälle',
    available: true,
    bgClass: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100',
    borderColor: '#fbbf24',
    inkHex: '#2d1d0c',
    accentHex: '#c08a2c',
  },
  {
    grade: 6,
    emoji: '🚀',
    label: 'Årskurs 6',
    subjects: 'Historia · Geografi · Religion · Samhälle',
    available: false,
    bgClass: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100',
    borderColor: '#c4b5fd',
    inkHex: '#2e1a47',
    accentHex: '#7c3aed',
  },
];

export default function GradeSelect() {
  const { selectGrade } = useApp();

  return (
    <div className="min-h-screen">
      {/* Hero background */}
      <div
        className="relative w-full"
        style={{
          backgroundImage: 'url(/bakgrund.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/80" />
        <header className="relative z-10 px-4 pt-6 pb-2 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl drop-shadow-sm" style={{ color: '#1e1b4b' }}>
              SO-jakten
            </h1>
            <p className="text-base font-semibold mt-1 text-gray-700">Välj din årskurs</p>
          </div>
        </header>
        <div className="h-8 sm:h-12" />
      </div>

      <main className="max-w-lg mx-auto px-4 sm:px-6 pb-16 -mt-2 relative z-10">
        <p className="text-center text-gray-500 font-semibold mb-5 text-sm">
          Vilken klass går du i?
        </p>

        <div className="flex flex-col gap-4">
          {GRADE_CARDS.map(card => (
            <button
              key={card.grade}
              onClick={() => selectGrade(card.grade)}
              disabled={false}
              className={`
                ${card.bgClass}
                relative overflow-hidden rounded-3xl p-5 text-left
                transition-all cursor-pointer
                ${card.available
                  ? 'shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]'
                  : 'shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:scale-[1.01] active:scale-[0.99]'
                }
              `}
              style={{ border: `2.5px solid ${card.borderColor}` }}
            >
              {/* Large grade watermark */}
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl font-black leading-none pointer-events-none select-none opacity-[0.07] font-heading"
                style={{ color: card.inkHex }}
              >
                {card.grade}
              </span>

              <div className="relative z-10 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{
                    background: `${card.accentHex}18`,
                    border: `2px solid ${card.accentHex}40`,
                  }}
                >
                  {card.emoji}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="font-bold text-xl leading-tight font-heading"
                      style={{ color: card.inkHex }}
                    >
                      {card.label}
                    </p>
                    {!card.available && (
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-full"
                        style={{ background: `${card.accentHex}20`, color: card.accentHex }}
                      >
                        Kommer snart
                      </span>
                    )}
                    {card.available && (
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-full"
                        style={{ background: `${card.accentHex}25`, color: card.accentHex }}
                      >
                        Tillgänglig
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold mt-1 opacity-60" style={{ color: card.inkHex }}>
                    {card.subjects}
                  </p>
                </div>

                <div
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${card.accentHex}15` }}
                >
                  {card.available ? '→' : '🔒'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 p-3">
        <a
          href="mailto:martin.akdogan@enkoping.se"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Kontakt – martin.akdogan@enkoping.se
        </a>
      </footer>
    </div>
  );
}
