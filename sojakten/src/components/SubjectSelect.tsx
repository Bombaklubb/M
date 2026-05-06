import { useApp } from '../contexts/AppContext';
import { SUBJECTS, getChaptersForSubject } from '../data/subjects';
import { getProgress } from '../utils/storage';
import type { Subject } from '../types';

// Minimal inline ornaments per subject
function HistoriaOrnament() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full opacity-20" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="36" stroke="#c08a2c" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="24" stroke="#c08a2c" strokeWidth="1" strokeDasharray="4 3" />
      <path d="M40 10 L43 22 L40 20 L37 22 Z" fill="#a02e1f" />
      <path d="M40 70 L43 58 L40 60 L37 58 Z" fill="#a02e1f" />
      <path d="M10 40 L22 43 L20 40 L22 37 Z" fill="#a02e1f" />
      <path d="M70 40 L58 43 L60 40 L58 37 Z" fill="#a02e1f" />
      <circle cx="40" cy="40" r="4" fill="#c08a2c" />
    </svg>
  );
}

function GeografiOrnament() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full opacity-20" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="32" stroke="#1f7a4d" strokeWidth="1.5" />
      <line x1="40" y1="8" x2="40" y2="72" stroke="#1f7a4d" strokeWidth="1" />
      <line x1="8" y1="40" x2="72" y2="40" stroke="#1f7a4d" strokeWidth="1" />
      <path d="M40 8 L44 20 L40 16 L36 20 Z" fill="#1c6b8c" />
      <path d="M40 72 L44 60 L40 64 L36 60 Z" fill="#1c6b8c" opacity="0.4" />
      <circle cx="40" cy="8" r="2.5" fill="#1c6b8c" />
      <circle cx="40" cy="40" r="5" stroke="#1f7a4d" strokeWidth="1.5" />
    </svg>
  );
}

function ReligionOrnament() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full opacity-15" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="30" stroke="#5b2a86" strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 40 + 18 * Math.cos(rad);
        const y1 = 40 + 18 * Math.sin(rad);
        const x2 = 40 + 28 * Math.cos(rad);
        const y2 = 40 + 28 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c89a3a" strokeWidth="1.5" />;
      })}
      <circle cx="40" cy="40" r="10" stroke="#5b2a86" strokeWidth="1" />
      <circle cx="40" cy="40" r="3" fill="#c89a3a" />
    </svg>
  );
}

function SamhalleOrnament() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full opacity-15" fill="none" aria-hidden="true">
      <rect x="10" y="10" width="22" height="22" fill="#1d4dd6" />
      <rect x="10" y="48" width="22" height="22" fill="#d63a2f" />
      <rect x="48" y="10" width="22" height="22" fill="#f2c029" />
      <rect x="48" y="48" width="22" height="22" stroke="#0a0a14" strokeWidth="2" />
    </svg>
  );
}

const ORNAMENTS: Record<string, React.FC> = {
  historia: HistoriaOrnament,
  geografi: GeografiOrnament,
  religion: ReligionOrnament,
  samhalle: SamhalleOrnament,
};

function SubjectCard({ subject, onClick }: { subject: Subject; onClick: () => void }) {
  const chapters = getChaptersForSubject(subject.id);
  const progress = getProgress();
  const done = chapters.filter(c => progress.some(p => p.chapterId === c.id && p.completed)).length;
  const total = chapters.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const Ornament = ORNAMENTS[subject.id];

  return (
    <button
      onClick={onClick}
      className={`${subject.cardClass} relative overflow-hidden p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] active:translate-y-1 cursor-pointer`}
    >
      {/* Background ornament */}
      <div className="absolute right-2 top-2 w-20 h-20 pointer-events-none">
        <Ornament />
      </div>

      {/* Short code watermark */}
      <span
        className={`absolute right-3 bottom-3 text-5xl font-black leading-none pointer-events-none select-none opacity-[0.06] ${subject.headingFont}`}
        style={{ color: subject.inkHex }}
      >
        {subject.shortName}
      </span>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-4xl leading-none">{subject.emoji}</span>
          <div>
            <p
              className={`font-bold text-xl leading-tight ${subject.headingFont}`}
              style={{ color: subject.inkHex }}
            >
              {subject.name}
            </p>
            <p className="text-xs font-semibold mt-0.5 opacity-60" style={{ color: subject.inkHex }}>
              {total} kapitel
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold opacity-70" style={{ color: subject.inkHex }}>
              {done}/{total} klara
            </span>
            {done === total && total > 0 && (
              <span className="text-xs font-black" style={{ color: subject.progressHex }}>Klar!</span>
            )}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${subject.inkHex}18` }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: subject.progressHex }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function SubjectSelect() {
  const { selectSubject } = useApp();

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
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/80" />

        {/* Header */}
        <header className="relative z-10 px-4 pt-6 pb-2 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl drop-shadow-sm" style={{ color: '#1e1b4b' }}>SO-jakten</h1>
            <p className="text-base font-semibold mt-1 text-gray-700">Åk 5</p>
          </div>
        </header>

        {/* Spacer so image shows */}
        <div className="h-20 sm:h-28" />
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 -mt-2 relative z-10">
        <p className="text-center text-gray-500 font-semibold mb-4 text-sm">Välj ett ämne att öva på</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECTS.map(subject => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onClick={() => selectSubject(subject)}
            />
          ))}
        </div>
      </main>

      {/* Contact footer */}
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
