import { useState } from 'react';
import type { LevelBand, Theme, ThemeWord } from '@/types';
import { segment } from '@/lib/segment';
import { suggestEmoji, EMOJI_PALETTE } from '@/data/emojiIndex';
import { saveCustomTheme, setActiveThemeId } from '@/lib/storage';
import { kindsForWord } from '@/lib/generators/themeExercises';

/**
 * Egen-tema-redigeraren.
 *
 * För när klassen jobbar med något den färdiga banken inte täcker. Läraren
 * skriver temats namn och 6–10 ord; emoji föreslås automatiskt ur
 * emojiIndex.
 *
 * Två saker är medvetet synliga i stället för dolda:
 *  - Grafemuppdelningen visas som chips. Den gissas, och sj-ljudet har sju
 *    stavningar – läraren ska kunna se när gissningen blev fel.
 *  - Förhandsvisningen av vilka övningar varje ord ger. Då blir det tydligt
 *    VARFÖR ett ord utan bild ger färre övningar, i stället för mystiskt.
 */

interface DraftWord {
  text: string;
  emoji: string | null;
}

const EMPTY: DraftWord = { text: '', emoji: null };

const KIND_LABELS: Record<string, string> = {
  'listen-pick-picture': 'Lyssna & välj bild',
  'read-word-pick-picture': 'Läs ordet',
  'build-word-tiles': 'Bygg ordet',
  'word-picture-pair': 'Para ihop',
};

export function ThemeEditorView({
  level,
  onDone,
}: {
  level: LevelBand;
  onDone: () => void;
}) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📚');
  const [subject, setSubject] = useState<'NO' | 'SO' | 'engelska'>('NO');
  const [words, setWords] = useState<DraftWord[]>([{ ...EMPTY }, { ...EMPTY }, { ...EMPTY }]);
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setWord = (i: number, patch: Partial<DraftWord>) => {
    setWords((ws) => ws.map((w, k) => (k === i ? { ...w, ...patch } : w)));
  };

  const onTextChange = (i: number, text: string) => {
    // Föreslå emoji bara så länge läraren inte valt en själv.
    const current = words[i];
    const autoEmoji = current.emoji === null || current.emoji === suggestEmoji(current.text)
      ? suggestEmoji(text)
      : current.emoji;
    setWord(i, { text, emoji: autoEmoji });
  };

  const filled = words.filter((w) => w.text.trim().length > 0);

  const save = () => {
    if (!title.trim()) {
      setError('Temat behöver ett namn.');
      return;
    }
    if (filled.length < 3) {
      setError('Skriv minst tre ord. Sex till tio fungerar bäst.');
      return;
    }

    const lang = subject === 'engelska' ? 'en-GB' : 'sv-SE';
    const themeWords: ThemeWord[] = filled.map((w) => {
      const text = w.text.trim();
      return {
        id: `tw-${text.toLowerCase().replace(/\s+/g, '-')}`,
        text,
        emoji: w.emoji,
        graphemes: segment(text),
        lang,
        say: { id: `word-${text.toLowerCase()}`, text, lang },
      };
    });

    const theme: Theme = {
      id: `custom-${Date.now().toString(36)}`,
      title: title.trim(),
      subject,
      icon,
      lang,
      origin: 'custom',
      words: themeWords,
      // Minitexter författas inte här – de kräver frågor med bildsvar, och
      // det blir för mycket att fylla i. Temat ger ordövningar i stället.
      microTexts: [],
      createdAt: new Date().toISOString(),
    };

    saveCustomTheme(theme);
    setActiveThemeId(theme.id);
    onDone();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-7 px-4 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Eget tema</h1>
        <button
          type="button"
          onClick={onDone}
          className="btn-pop rounded-tile border-ink-300 bg-ink-100 px-5 py-2 font-bold
                     dark:border-ink-600 dark:bg-ink-800"
        >
          Avbryt
        </button>
      </header>

      {error && (
        <p className="rounded-tile bg-amberx-100 px-4 py-3 font-semibold text-amberx-800">{error}</p>
      )}

      <section className="space-y-3">
        <label className="block font-bold" htmlFor="theme-title">Temats namn</label>
        <input
          id="theme-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T.ex. Medeltiden"
          className="w-full rounded-tile border-2 border-ink-300 px-4 py-3 text-lg dark:bg-ink-800"
        />

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold">Ämne:</span>
          {(['NO', 'SO', 'engelska'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={`rounded-tile border-2 px-4 py-2 font-bold ${
                subject === s ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/40' : 'border-ink-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold">Ikon:</span>
          {['📚', '🏰', '🔬', '🌍', '⚙️', '🎨', '🧭', '🦴'].map((e) => (
            <button
              key={e}
              type="button"
              aria-label={`Välj ikon ${e}`}
              onClick={() => setIcon(e)}
              className={`grid h-12 w-12 min-h-0 place-items-center rounded-tile border-2 text-2xl ${
                icon === e ? 'border-brand-600 bg-brand-50' : 'border-ink-200'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Ord</h2>
        <p className="text-ink-500">
          Konkreta ord fungerar bäst, eftersom bilderna är emoji. Ord utan bild går
          fortfarande att använda – de ger färre övningstyper, se listan till höger.
        </p>

        <div className="space-y-3">
          {words.map((w, i) => {
            const preview: string[] = w.text.trim()
              ? kindsForWord(
                  {
                    id: 'p', text: w.text, emoji: w.emoji, graphemes: segment(w.text),
                    lang: 'sv-SE', say: { id: 'p', text: w.text, lang: 'sv-SE' },
                  },
                  level
                ).map((k) => KIND_LABELS[k] ?? k)
              : [];

            return (
              <div key={i} className="rounded-tile border-2 border-ink-200 p-3 dark:border-ink-700">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    value={w.text}
                    onChange={(e) => onTextChange(i, e.target.value)}
                    placeholder={`Ord ${i + 1}`}
                    aria-label={`Ord ${i + 1}`}
                    className="min-w-[10rem] flex-1 rounded-tile border-2 border-ink-300 px-3 py-2
                               text-lg dark:bg-ink-800"
                  />

                  <button
                    type="button"
                    aria-label={`Välj bild för ord ${i + 1}`}
                    onClick={() => setPickerFor(pickerFor === i ? null : i)}
                    className="grid h-12 w-16 min-h-0 place-items-center rounded-tile border-2
                               border-ink-300 text-2xl dark:bg-ink-800"
                  >
                    {w.emoji ?? '—'}
                  </button>

                  {w.emoji && (
                    <button
                      type="button"
                      onClick={() => setWord(i, { emoji: null })}
                      className="text-sm font-bold text-ink-500 underline"
                    >
                      ingen bild
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label={`Ta bort ord ${i + 1}`}
                    onClick={() => setWords((ws) => ws.filter((_, k) => k !== i))}
                    className="grid h-12 w-12 min-h-0 place-items-center rounded-tile
                               border-2 border-ink-200 text-lg"
                  >
                    ✕
                  </button>
                </div>

                {w.text.trim() && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    {/* Grafemgissningen syns, så att läraren kan upptäcka när
                        den blivit fel – sk, sj och ng gissas inte alltid rätt. */}
                    <span className="text-ink-500">Ljud:</span>
                    {segment(w.text.trim()).map((g, k) => (
                      <span key={k} className="rounded bg-ink-100 px-2 py-0.5 font-mono dark:bg-ink-700">
                        {g}
                      </span>
                    ))}
                    <span className="ml-2 text-ink-500">Ger:</span>
                    <span className="font-semibold">{preview.join(', ')}</span>
                  </div>
                )}

                {pickerFor === i && (
                  <div className="mt-3 flex max-h-48 flex-wrap gap-1 overflow-y-auto rounded-tile
                                  border-2 border-ink-200 p-2 dark:border-ink-700">
                    {EMOJI_PALETTE.map((e) => (
                      <button
                        key={e}
                        type="button"
                        aria-label={`Bild ${e}`}
                        onClick={() => { setWord(i, { emoji: e }); setPickerFor(null); }}
                        className="grid h-10 w-10 min-h-0 place-items-center rounded text-xl
                                   hover:bg-ink-100 dark:hover:bg-ink-700"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setWords((ws) => [...ws, { ...EMPTY }])}
          className="btn-pop rounded-tile border-ink-300 bg-ink-100 px-5 py-3 font-bold dark:bg-ink-800"
        >
          + Lägg till ord
        </button>
      </section>

      <button
        type="button"
        onClick={save}
        className="btn-pop w-full rounded-tile border-lime-700 bg-lime-500 px-6 py-4
                   text-xl font-extrabold text-white"
      >
        Spara och använd temat
      </button>
    </div>
  );
}
