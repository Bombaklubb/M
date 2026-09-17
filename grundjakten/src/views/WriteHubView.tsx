import type { WriteMode } from '@/lib/generators/writingExercises';
import { play } from '@/lib/audio';

const MODES: { id: WriteMode; icon: string; title: string; tint: string }[] = [
  { id: 'type', icon: '⌨️', title: 'Tryck bokstaven', tint: 'bg-brand-500 border-brand-700' },
  { id: 'build', icon: '🧩', title: 'Bygg ord', tint: 'bg-aqua-500 border-aqua-700' },
  { id: 'form', icon: '✏️', title: 'Forma bokstäver', tint: 'bg-lime-500 border-lime-700' },
];

export function WriteHubView({
  onStart,
  onBack,
}: {
  onStart: (mode: WriteMode) => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 py-5">
      <header className="mb-8 flex items-center gap-4">
        <button
          type="button"
          aria-label="Tillbaka"
          onClick={onBack}
          className="btn-pop grid h-14 w-14 place-items-center rounded-tile border-ink-300
                     bg-ink-100 text-2xl dark:border-ink-600 dark:bg-ink-800"
        >
          <span aria-hidden>←</span>
        </button>
        <h1 className="text-3xl font-extrabold">Skriva</h1>
      </header>

      <div className="grid flex-1 content-center gap-5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-label={m.title}
            onPointerDown={() => void play({ id: `say-${m.id}`, text: m.title, lang: 'sv-SE' })}
            onClick={() => onStart(m.id)}
            className={`btn-pop flex items-center gap-6 rounded-card px-8 py-7 text-left text-white ${m.tint}`}
          >
            <span className="text-6xl leading-none" aria-hidden>{m.icon}</span>
            <span className="text-3xl font-extrabold">{m.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
