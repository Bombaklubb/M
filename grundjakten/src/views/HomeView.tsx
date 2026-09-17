import type { Progress, StudentProfile } from '@/types';
import { useLongPress } from '@/hooks/useLongPress';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { play } from '@/lib/audio';
import { getLevelTitle, todayStamp, xpForNextLevel } from '@/lib/utils';
import { hasSwedishVoice } from '@/lib/speech';

export type Destination = 'uppdrag' | 'bokstaver' | 'skriva' | 'tema';

const CARDS: { id: Destination; icon: string; title: string; say: string; tint: string }[] = [
  { id: 'bokstaver', icon: '🔤', title: 'Bokstäver', say: 'Bokstäver', tint: 'bg-brand-500 border-brand-700' },
  { id: 'skriva', icon: '✍️', title: 'Skriva', say: 'Skriva', tint: 'bg-aqua-500 border-aqua-700' },
  { id: 'tema', icon: '🌍', title: 'Klassens tema', say: 'Klassens tema', tint: 'bg-lime-500 border-lime-700' },
];

/**
 * Startskärmen.
 *
 * Dagens uppdrag ligger överst och är dubbelt så stort som de andra korten.
 * Det är avsiktligt: en elev som inte kan läsa ska inte behöva välja mellan
 * spår och moment. Hon ska kunna trycka på det stora och komma igång.
 *
 * De tre korten under är biblioteket – dit läraren pekar när något särskilt
 * ska tränas, inte något eleven förväntas navigera i själv.
 */
export function HomeView({
  profile,
  progress,
  onGo,
  onTeacher,
  onProfile,
}: {
  profile: StudentProfile;
  progress: Progress;
  onGo: (dest: Destination) => void;
  onTeacher: () => void;
  onProfile: () => void;
}) {
  const longPress = useLongPress(onTeacher);
  const xp = xpForNextLevel(progress.xp);
  const missionDoneToday = progress.lastMissionDate === todayStamp();

  useAutoSpeak(
    { id: 'home-greet', text: 'Vad vill du göra?', lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-4xl flex-col px-4 py-5">
      <header className="mb-8 flex items-center justify-between">
        {/* Lärarläget nås genom två sekunders långtryck på loggan. Ingen
            synlig knapp – en elev ska inte snubbla in. */}
        <button
          type="button"
          aria-label="Grundjakten"
          {...longPress}
          className="grid h-14 w-14 min-h-0 place-items-center rounded-tile bg-brand-700 text-2xl
                     font-extrabold text-lime-300"
        >
          <span aria-hidden>G</span>
        </button>

        {!hasSwedishVoice() && (
          <span
            className="rounded-tile bg-amberx-100 px-3 py-2 text-sm font-bold text-amberx-700"
            title="Ingen svensk röst hittades på den här datorn. Uttalet kan bli fel."
          >
            🔇 Ingen svensk röst
          </span>
        )}

        <button
          type="button"
          onClick={onProfile}
          aria-label={`${profile.name}, nivå ${progress.level}, ${getLevelTitle(progress.level)}`}
          className="flex items-center gap-3 rounded-tile bg-white px-4 py-2 dark:bg-ink-800"
        >
          <span className="text-3xl" aria-hidden>{profile.avatar}</span>
          <span className="flex flex-col items-start">
            <span className="text-sm font-bold text-ink-500">Nivå {progress.level}</span>
            <span className="h-2 w-20 overflow-hidden rounded-full bg-ink-200">
              <span className="block h-full bg-lime-500" style={{ width: `${xp.pct}%` }} />
            </span>
          </span>
        </button>
      </header>

      <main className="grid flex-1 content-center gap-5">
        {/* Dagens uppdrag – appens huvudknapp. Medvetet störst på skärmen. */}
        <button
          type="button"
          aria-label={
            missionDoneToday ? 'Dagens uppdrag, redan klart idag' : 'Dagens uppdrag'
          }
          onPointerDown={() =>
            void play({ id: 'say-uppdrag', text: 'Dagens uppdrag', lang: 'sv-SE' })
          }
          onClick={() => onGo('uppdrag')}
          className="btn-pop flex items-center gap-7 rounded-card border-amberx-700
                     bg-gradient-to-r from-amberx-500 to-amberx-600 px-8 py-12 text-left text-white"
        >
          <span className="text-8xl leading-none" aria-hidden>
            {missionDoneToday ? '✅' : '🗝️'}
          </span>
          <span className="flex flex-col">
            <span className="text-5xl font-extrabold leading-tight">Dagens uppdrag</span>
            <span className="text-2xl font-bold text-amberx-100">
              {missionDoneToday ? 'Klart idag' : 'Hjälp Leo'}
            </span>
          </span>
        </button>

        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            aria-label={card.say}
            onPointerDown={() => void play({ id: `say-${card.id}`, text: card.say, lang: 'sv-SE' })}
            onClick={() => onGo(card.id)}
            className={`btn-pop flex items-center gap-6 rounded-card px-8 py-5 text-left text-white ${card.tint}`}
          >
            <span className="text-5xl leading-none" aria-hidden>{card.icon}</span>
            <span className="text-3xl font-extrabold">{card.title}</span>
          </button>
        ))}
      </main>
    </div>
  );
}
