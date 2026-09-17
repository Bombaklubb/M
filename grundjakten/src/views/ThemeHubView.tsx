import type { StudentProfile, Theme } from '@/types';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { play } from '@/lib/audio';
import { generateThemePass, type ThemeMode } from '@/lib/generators/themeExercises';

const MODES: { id: ThemeMode; icon: string; title: string; tint: string }[] = [
  { id: 'lyssna', icon: '👂', title: 'Lyssna och välj', tint: 'bg-brand-500 border-brand-700' },
  { id: 'para', icon: '🔗', title: 'Para ihop', tint: 'bg-aqua-500 border-aqua-700' },
  { id: 'text', icon: '📜', title: 'Lyssna på texten', tint: 'bg-lime-500 border-lime-700' },
];

/**
 * Klassens tema.
 *
 * Temat visas som ETT stort kort med ikon och titel, uppläst när skärmen
 * öppnas – eleven ska se direkt att hon jobbar med samma sak som klassen.
 *
 * Ett läge vars pass inte går att bygga ur temat visas inte alls. Att låta
 * eleven trycka på ett kort som leder till en tom skärm är värre än att
 * kortet saknas.
 */
export function ThemeHubView({
  theme,
  profile,
  onStart,
  onBack,
}: {
  theme: Theme | null;
  profile: StudentProfile;
  onStart: (mode: ThemeMode) => void;
  onBack: () => void;
}) {
  const available = theme
    ? MODES.filter(
        (m) => generateThemePass(theme, m.id, profile.progressionStep, profile.level, 1).length > 0
      )
    : [];

  useAutoSpeak(
    theme
      ? { id: `theme-${theme.id}`, text: theme.title, lang: theme.lang }
      : { id: 'theme-none', text: 'Din lärare har inte valt ett tema än.', lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 py-5">
      <header className="mb-6 flex items-center gap-4">
        <button
          type="button"
          aria-label="Tillbaka"
          onClick={onBack}
          className="btn-pop grid h-14 w-14 place-items-center rounded-tile border-ink-300
                     bg-ink-100 text-2xl dark:border-ink-600 dark:bg-ink-800"
        >
          <span aria-hidden>←</span>
        </button>
        <h1 className="text-3xl font-extrabold">Klassens tema</h1>
      </header>

      {/* Inget tema valt: eleven ska inte mötas av en tom skärm, och läraren
          ska förstå exakt vad som saknas och var hon fixar det. */}
      {!theme && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <span className="text-8xl" aria-hidden>🧭</span>
          <p className="reading max-w-md text-2xl font-medium">
            Din lärare har inte valt ett tema än.
          </p>
          <p className="max-w-md text-lg text-ink-500">
            Lärare: håll inne G-loggan på startsidan i två sekunder och välj tema.
          </p>
        </div>
      )}

      {theme && (
        <>
          <div className="mb-8 flex items-center gap-6 rounded-card border-2 border-brand-200
                          bg-white px-8 py-8 dark:border-ink-700 dark:bg-ink-800">
            <span className="text-8xl leading-none" aria-hidden>{theme.icon}</span>
            <div className="flex flex-col">
              <span className="reading text-4xl font-extrabold">{theme.title}</span>
              <span className="text-lg font-bold text-ink-500">
                {theme.words.length} ord
                {theme.lang === 'en-GB' && ' · engelska'}
              </span>
            </div>
          </div>

          <div className="grid gap-5">
            {available.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-label={m.title}
                onPointerDown={() =>
                  void play({ id: `say-th-${m.id}`, text: m.title, lang: 'sv-SE' })
                }
                onClick={() => onStart(m.id)}
                className={`btn-pop flex items-center gap-6 rounded-card px-8 py-6 text-left text-white ${m.tint}`}
              >
                <span className="text-6xl leading-none" aria-hidden>{m.icon}</span>
                <span className="text-3xl font-extrabold">{m.title}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
