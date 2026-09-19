import type { Progress, StudentProfile } from '@/types';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { play } from '@/lib/audio';
import { getLevelTitle, xpForNextLevel } from '@/lib/utils';
import { hasSwedishVoice } from '@/lib/speech';

export type Destination = 'bokstaver' | 'skriva' | 'ovningar';

const CARDS: { id: Destination; icon: string; title: string; say: string; tint: string }[] = [
  { id: 'bokstaver', icon: '🔤', title: 'Bokstäver', say: 'Bokstäver', tint: 'bg-brand-500 border-brand-700' },
  { id: 'skriva', icon: '✍️', title: 'Skriva', say: 'Skriva', tint: 'bg-aqua-500 border-aqua-700' },
  { id: 'ovningar', icon: '📚', title: 'Övningar', say: 'Övningar', tint: 'bg-amberx-500 border-amberx-700' },
];

/**
 * Startskärmen.
 *
 * Tre stora kort med ikon. Rubriktexten finns för lärarens och för
 * skärmläsarens skull – eleven navigerar på ikon och på det korten säger när
 * man trycker på dem.
 *
 * Alla korten ska rymmas utan att eleven behöver scrolla. En elev som
 * inte kan läsa förstår inte att det finns mer nedanför kanten – ett kort
 * utanför skärmen är i praktiken ett kort som inte finns.
 *
 * Därför är grundstorleken anpassad till en Chromebook med synlig yta runt
 * 600 px, och korten växer först på högre skärmar.
 */
export function HomeView({
  profile,
  progress,
  onGo,
  onProfile,
}: {
  profile: StudentProfile;
  progress: Progress;
  onGo: (dest: Destination) => void;
  onProfile: () => void;
}) {
  const xp = xpForNextLevel(progress.xp);

  useAutoSpeak(
    { id: 'home-greet', text: 'Vad vill du göra?', lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-4xl flex-col px-4 py-3
                    [@media(min-height:760px)]:py-5">
      <header className="mb-4 flex items-center justify-between
                         [@media(min-height:760px)]:mb-8">
        {/* Vänsterkanten är tom med flit. Här satt tidigare en G-logga som
            dolde lärarläget bakom ett långtryck; båda är borta. Röstvarningen
            får inte glida hit – namnet ska ligga kvar till höger. */}
        <span aria-hidden />

        {!hasSwedishVoice() && (
          <span
            className="rounded-tile bg-amberx-100 px-3 py-2 text-sm font-bold text-amberx-700"
            title="Ingen svensk röst hittades på den här datorn. Uttalet kan bli fel."
          >
            🔇 Ingen svensk röst
          </span>
        )}

        {/* Elevens namn, uppe till höger. Det är också vägen in till hennes
            framsteg – hon trycker på sig själv för att se vad hon klarat. */}
        <button
          type="button"
          onClick={onProfile}
          aria-label={`${profile.name}, nivå ${progress.level}, ${getLevelTitle(progress.level)}. Se dina framsteg.`}
          className="btn-pop flex items-center gap-3 rounded-tile border-ink-200 bg-white px-4 py-2
                     dark:border-ink-700 dark:bg-ink-800"
        >
          <span className="text-3xl leading-none" aria-hidden>{profile.avatar}</span>
          <span className="flex flex-col items-start">
            <span className="reading max-w-[9rem] truncate text-lg font-extrabold leading-tight">
              {profile.name}
            </span>
            <span className="mt-1 h-2 w-full min-w-[4rem] overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700">
              <span className="block h-full bg-lime-500" style={{ width: `${xp.pct}%` }} />
            </span>
          </span>
        </button>
      </header>

      <main className="grid flex-1 content-center gap-3 [@media(min-height:760px)]:gap-5">
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            aria-label={card.say}
            onPointerDown={() => void play({ id: `say-${card.id}`, text: card.say, lang: 'sv-SE' })}
            onClick={() => onGo(card.id)}
            className={`btn-pop flex items-center gap-5 rounded-card px-6 py-4 text-left
                        text-white [@media(min-height:760px)]:gap-6
                        [@media(min-height:760px)]:px-8 [@media(min-height:760px)]:py-7 ${card.tint}`}
          >
            <span className="text-5xl leading-none [@media(min-height:760px)]:text-6xl" aria-hidden>
              {card.icon}
            </span>
            <span className="text-3xl font-extrabold [@media(min-height:760px)]:text-4xl">
              {card.title}
            </span>
          </button>
        ))}
      </main>
    </div>
  );
}
