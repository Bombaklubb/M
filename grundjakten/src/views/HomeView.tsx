import type { Progress, StudentProfile } from '@/types';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { FigurValjare } from '@/components/FigurValjare';
import { play } from '@/lib/audio';
import { getLevelTitle, xpForNextLevel } from '@/lib/utils';

export type Destination = 'bokstaver' | 'skriva' | 'ovningar';

const CARDS: { id: Destination; icon: string; title: string; say: string; tint: string }[] = [
  { id: 'ovningar', icon: '📚', title: 'Övningar', say: 'Övningar', tint: 'bg-amberx-500 border-amberx-700' },
  { id: 'bokstaver', icon: '🔤', title: 'Bokstäver', say: 'Bokstäver', tint: 'bg-brand-500 border-brand-700' },
  { id: 'skriva', icon: '✍️', title: 'Skriva', say: 'Skriva', tint: 'bg-aqua-500 border-aqua-700' },
];

/**
 * Startskärmen.
 *
 * Tre stora kort med ikon. Rubriktexten finns för lärarens och för
 * skärmläsarens skull – eleven navigerar på ikon och på det korten säger när
 * man trycker på dem.
 *
 * Alla korten ska rymmas utan att eleven behöver scrolla. En elev som inte
 * kan läsa förstår inte att det finns mer nedanför kanten – ett kort utanför
 * skärmen är i praktiken ett kort som inte finns.
 *
 * Headern följer Svenskajaktens modell: appens namn till vänster, allt som
 * går att göra till höger. Ansiktet och namnet är TVÅ knappar, inte en, för
 * att de leder olika vägar – ansiktet byter figur, namnet öppnar framstegen.
 * Båda behåller full tryckyta; två mål i samma knapp vore fel för en elev med
 * motoriska svårigheter.
 */
export function HomeView({
  profile,
  progress,
  onGo,
  onProfile,
  onOm,
  onLogout,
  onValjFigur,
  figurOppen,
  onToggleFigur,
}: {
  profile: StudentProfile;
  progress: Progress;
  onGo: (dest: Destination) => void;
  onProfile: () => void;
  onOm: () => void;
  onLogout: () => void;
  onValjFigur: (avatar: string) => void;
  figurOppen: boolean;
  onToggleFigur: () => void;
}) {
  const xp = xpForNextLevel(progress.xp);

  useAutoSpeak(
    { id: 'home-greet', text: 'Vad vill du göra?', lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-4xl flex-col px-4 py-3
                    [@media(min-height:760px)]:py-5">
      <header className="mb-3 flex items-center justify-between gap-2
                         [@media(min-height:760px)]:mb-6">
        {/* Bara text. Ingen knapp och ingenting dolt bakom långtryck – den
            G-rutan är borttagen med flit. */}
        <span className="hidden text-xl font-extrabold tracking-tight text-brand-700
                         dark:text-brand-300 sm:block">
          Grundjakten
        </span>

        <nav className="flex flex-1 items-center justify-end gap-2">
          <button
            type="button"
            onClick={onOm}
            aria-label="Om Grundjakten"
            className="flex h-14 items-center gap-2 rounded-tile px-3 font-bold text-ink-500
                       hover:bg-white/70 dark:text-ink-300 dark:hover:bg-ink-800/70"
          >
            <span className="text-xl" aria-hidden>❓</span>
            <span className="hidden lg:block">Om Grundjakten</span>
          </button>

          {/* Ansiktet: byter figur. */}
          <button
            type="button"
            onClick={onToggleFigur}
            aria-label="Byt figur"
            aria-expanded={figurOppen}
            className="btn-pop grid h-14 w-14 place-items-center rounded-tile border-ink-200
                       bg-white text-3xl dark:border-ink-700 dark:bg-ink-800"
          >
            <span aria-hidden>{profile.avatar}</span>
          </button>

          {/* Namnet: öppnar framstegen. */}
          <button
            type="button"
            onClick={onProfile}
            aria-label={`${profile.name}, nivå ${progress.level}, ${getLevelTitle(progress.level)}. Se dina framsteg.`}
            className="btn-pop flex h-14 items-center rounded-tile border-ink-200 bg-white px-4
                       dark:border-ink-700 dark:bg-ink-800"
          >
            <span className="flex flex-col items-start">
              <span className="reading max-w-[9rem] truncate text-lg font-extrabold leading-tight">
                {profile.name}
              </span>
              <span className="mt-1 h-2 w-full min-w-[4rem] overflow-hidden rounded-full
                               bg-ink-200 dark:bg-ink-700">
                <span className="block h-full bg-lime-500" style={{ width: `${xp.pct}%` }} />
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Logga ut"
            className="flex h-14 items-center gap-2 rounded-tile px-3 font-bold text-ink-500
                       hover:bg-amberx-100 hover:text-amberx-700 dark:text-ink-300"
          >
            <span className="text-xl" aria-hidden>🚪</span>
            <span className="hidden lg:block">Logga ut</span>
          </button>
        </nav>
      </header>

      {figurOppen && (
        <div className="mb-3">
          <FigurValjare vald={profile.avatar} onValj={onValjFigur} />
        </div>
      )}

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
