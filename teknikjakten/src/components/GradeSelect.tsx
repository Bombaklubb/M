import { useApp } from '../contexts/AppContext';

interface GradeCard {
  grade: number;
  emoji: string;
  label: string;
  hint: string;
  bgClass: string;
  borderColor: string;
  inkHex: string;
  accentHex: string;
}

const GRADE_CARDS: GradeCard[] = [
  {
    grade: 4,
    emoji: '🧱',
    label: 'Årskurs 4',
    hint: 'Teknik · åk 4',
    bgClass: 'bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100',
    borderColor: '#93c5fd',
    inkHex: '#1e3a5f',
    accentHex: '#3b82f6',
  },
  {
    grade: 5,
    emoji: '⚙️',
    label: 'Årskurs 5',
    hint: 'Teknik · åk 5',
    bgClass: 'bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100',
    borderColor: '#fbbf24',
    inkHex: '#3b2410',
    accentHex: '#d97706',
  },
  {
    grade: 6,
    emoji: '💻',
    label: 'Årskurs 6',
    hint: 'Teknik · åk 6',
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
      {/* Hero – ren CSS, ingen bildfil att vänta in */}
      <div
        className="relative w-full"
        style={{ background: 'linear-gradient(160deg, #dbeafe 0%, #e0e7ff 45%, #f1f5f9 100%)' }}
      >
        {/* Diskret rutnät som antyder ritningspapper */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(31,42,68,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(31,42,68,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <header className="relative z-10 px-4 pt-10 pb-2 flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl" aria-hidden="true">⚙️</span>
            <h1 className="font-heading font-bold text-4xl drop-shadow-sm mt-2" style={{ color: '#1f2a44' }}>
              Teknikjakten
            </h1>
            <p className="text-base font-semibold mt-1 text-gray-700">Välj din årskurs</p>
          </div>
        </header>
        <div className="h-10 sm:h-14" />
      </div>

      <main className="max-w-lg mx-auto px-4 sm:px-6 pb-24 -mt-2 relative z-10">
        <p className="text-center text-gray-500 font-semibold mb-5 text-sm">
          Vilken klass går du i?
        </p>

        <div className="flex flex-col gap-4">
          {GRADE_CARDS.map(card => (
            <button
              key={card.grade}
              onClick={() => selectGrade(card.grade)}
              className={`
                ${card.bgClass}
                relative overflow-hidden rounded-3xl p-5 text-left
                transition-all cursor-pointer
                shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-[1.02]
                hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]
              `}
              style={{ border: `2.5px solid ${card.borderColor}` }}
            >
              {/* Stor siffra som vattenstämpel */}
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl font-black leading-none pointer-events-none select-none opacity-[0.07] font-heading"
                style={{ color: card.inkHex }}
                aria-hidden="true"
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
                  aria-hidden="true"
                >
                  {card.emoji}
                </div>

                <div className="flex-1">
                  <p className="font-bold text-xl leading-tight font-heading" style={{ color: card.inkHex }}>
                    {card.label}
                  </p>
                  <p className="text-xs font-semibold mt-1 opacity-60" style={{ color: card.inkHex }}>
                    {card.hint}
                  </p>
                </div>

                <div
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${card.accentHex}15` }}
                  aria-hidden="true"
                >
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
