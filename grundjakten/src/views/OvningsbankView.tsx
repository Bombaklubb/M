import { useState } from 'react';
import type { Niva, Progress, StudentProfile, TaskDef } from '@/types';
import { grupperadeTasks, tasksForNiva } from '@/data/tasks';
import { play } from '@/lib/audio';
import { cn } from '@/lib/utils';

const NIVAER: { niva: Niva; namn: string }[] = [
  { niva: 1, namn: 'Svenska 1' },
  { niva: 2, namn: 'Svenska 2' },
  { niva: 3, namn: 'Svenska 3' },
  { niva: 4, namn: 'Svenska 4' },
];

/**
 * Övningsbanken.
 *
 * Alla namngivna uppgifter, grupperade precis som i lärarens egen lista, så
 * att "gör Alfabetet – Första bokstaven 2" går att hitta utan att leta.
 *
 * Eleven navigerar på ikon och färg per grupp, och varje uppgiftsnamn läses
 * upp när hon trycker. Nivåflikarna är främst till för läraren – elevens egen
 * nivå väljs som standard, så hon möter sitt eget innehåll direkt.
 */
export function OvningsbankView({
  profile,
  progress,
  onStart,
  onBack,
}: {
  profile: StudentProfile;
  progress: Progress;
  onStart: (task: TaskDef) => void;
  onBack: () => void;
}) {
  const [niva, setNiva] = useState<Niva>(profile.level);
  const grupper = grupperadeTasks(niva);
  const tasks = tasksForNiva(niva);
  const antal = tasks.length;
  const klara = tasks.filter((t) => progress.tasks[t.id]).length;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 py-5">
      <header className="mb-5 flex items-center gap-4">
        <button
          type="button"
          aria-label="Tillbaka"
          onClick={onBack}
          className="btn-pop grid h-14 w-14 place-items-center rounded-tile border-ink-300
                     bg-ink-100 text-2xl dark:border-ink-600 dark:bg-ink-800"
        >
          <span aria-hidden>←</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold">Övningar</h1>
          <span className="text-sm font-bold text-ink-500">
            {klara} av {antal} klara
          </span>
        </div>
      </header>

      <div className="mb-6 flex gap-2">
        {NIVAER.map((n) => (
          <button
            key={n.niva}
            type="button"
            onClick={() => setNiva(n.niva)}
            aria-pressed={niva === n.niva}
            className={cn(
              'flex-1 rounded-tile border-2 px-2 py-3 text-sm font-extrabold transition-colors',
              niva === n.niva
                ? 'border-brand-600 bg-brand-500 text-white'
                : 'border-ink-200 bg-white text-ink-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300'
            )}
          >
            {n.namn}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 pb-8">
        {grupper.map(({ grupp, meta, tasks }) => (
          <section key={grupp}>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold">
              <span className="text-2xl" aria-hidden>{meta.icon}</span>
              {grupp}
            </h2>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => {
                const res = progress.tasks[task.id];
                return (
                  <button
                    key={task.id}
                    type="button"
                    aria-label={
                      res
                        ? `${task.grupp} – ${task.namn}. Klar, ${res.basta} av ${res.antal} rätt.`
                        : `${task.grupp} – ${task.namn}`
                    }
                    onPointerDown={() =>
                      void play({ id: `t-${task.id}`, text: task.namn, lang: 'sv-SE' })
                    }
                    onClick={() => onStart(task)}
                    className={`btn-pop flex items-center gap-4 rounded-tile px-5 py-4 text-left
                                text-white ${meta.tint}`}
                  >
                    <span className="text-3xl leading-none" aria-hidden>{meta.icon}</span>
                    <span className="flex-1 text-xl font-extrabold">{task.namn}</span>

                    {/* Klarmarkering och bästa resultat. Bilden bär beskedet –
                        siffran är ett tillägg för den som kan läsa den. */}
                    {res && (
                      <span className="flex shrink-0 items-center gap-2 rounded-tile bg-white/25 px-3 py-1.5">
                        <span className="text-xl" aria-hidden>✅</span>
                        <span className="text-lg font-extrabold tabular-nums">
                          {res.basta}/{res.antal}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
