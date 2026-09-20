import { useState } from 'react';
import type { Niva, Progress, StudentProfile } from '@/types';
import { LETTERS } from '@/data/letters';
import { tasksForNiva } from '@/data/tasks';
import { EarButton } from '@/components/EarButton';
import { FigurValjare } from '@/components/FigurValjare';
import { UTMARKELSER } from '@/data/belohningar';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { cn, getLevelTitle, xpForNextLevel } from '@/lib/utils';

const NIVAER: { niva: Niva; namn: string }[] = [
  { niva: 1, namn: 'Svenska 1' },
  { niva: 2, namn: 'Svenska 2' },
  { niva: 3, namn: 'Svenska 3' },
  { niva: 4, namn: 'Svenska 4' },
];

/**
 * Mina framsteg.
 *
 * Nås genom att trycka på sitt eget namn uppe till höger. Det är elevens egen
 * sida – inte lärarens. Skillnaden är viktig: lärarvyn visar hur många fel
 * eleven haft, den här visar bara vad hon KLARAT. Ett pass ska alltid sluta i
 * framgång, och hennes egen översikt ska följa samma regel.
 *
 * Allt bärs av en siffra och en bild samtidigt, eftersom hon inte kan läsa
 * rubrikerna. Varje avsnitt har ett öra som säger vad det visar.
 */
export function FramstegView({
  profile,
  progress,
  onBack,
  onValjFigur,
}: {
  profile: StudentProfile;
  progress: Progress;
  onBack: () => void;
  onValjFigur: (avatar: string) => void;
}) {
  const [byterFigur, setByterFigur] = useState(false);
  const xp = xpForNextLevel(progress.xp);

  const bemastrade = LETTERS.filter((l) => progress.letters[l.id]?.mastered).length;
  const klaradeTotalt = Object.keys(progress.tasks).length;
  const oOppnade = progress.kistor.filter((k) => !k.oppnad).length;
  const vunna = UTMARKELSER.filter((u) => progress.badges.includes(u.id));

  useAutoSpeak(
    {
      id: 'framsteg-greet',
      text: `${profile.name}, här är dina framsteg. Du är på nivå ${progress.level}.`,
      lang: 'sv-SE',
    },
    profile.settings.autoSpeakPrompts
  );

  const rutor = [
    { icon: '🔤', tal: bemastrade, av: LETTERS.length, say: `Du kan ${bemastrade} bokstäver.`, tint: 'bg-brand-500' },
    { icon: '📚', tal: klaradeTotalt, av: null, say: `Du har klarat ${klaradeTotalt} övningar.`, tint: 'bg-amberx-500' },
    { icon: '🎁', tal: oOppnade, av: null, say: oOppnade === 1 ? 'Du har en kista att öppna.' : `Du har ${oOppnade} kistor att öppna.`, tint: 'bg-aqua-500' },
    { icon: '🔥', tal: progress.streak, av: null, say: `Du har spelat ${progress.streak} dagar i rad.`, tint: 'bg-lime-500' },
  ];

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col gap-6 px-4 py-5">
      <header className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Tillbaka"
          onClick={onBack}
          className="btn-pop grid h-14 w-14 place-items-center rounded-tile border-ink-300
                     bg-ink-100 text-2xl dark:border-ink-600 dark:bg-ink-800"
        >
          <span aria-hidden>←</span>
        </button>
        {/* Ansiktet är en knapp: ett tryck och eleven byter figur. */}
        <button
          type="button"
          onClick={() => setByterFigur((v) => !v)}
          aria-label="Byt figur"
          aria-expanded={byterFigur}
          className="btn-pop grid h-16 w-16 min-h-0 place-items-center rounded-tile
                     border-ink-200 bg-white text-4xl dark:border-ink-700 dark:bg-ink-800"
        >
          <span aria-hidden>{profile.avatar}</span>
        </button>
        <div className="flex flex-col">
          <h1 className="reading text-3xl font-extrabold leading-tight">{profile.name}</h1>
          <span className="font-bold text-ink-500">
            Nivå {progress.level} · {getLevelTitle(progress.level)}
          </span>
        </div>
      </header>

      {byterFigur && <FigurValjare vald={profile.avatar} onValj={onValjFigur} />}

      {/* XP-mätaren. Aldrig procent, aldrig antal fel – bara hur långt kvar
          det är till nästa nivå. */}
      <section className="flex items-center gap-3 rounded-card bg-white/85 p-4 dark:bg-ink-800/85">
        <span className="text-3xl" aria-hidden>⭐</span>
        <div className="flex-1">
          <div className="h-5 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700">
            <div
              role="img"
              aria-label={`${xp.current} av ${xp.next} till nästa nivå`}
              className="h-full bg-lime-500 transition-[width] duration-500"
              style={{ width: `${xp.pct}%` }}
            />
          </div>
        </div>
        <EarButton
          token={{
            id: 'fr-xp',
            text: `Du är på nivå ${progress.level}, ${getLevelTitle(progress.level)}.`,
            lang: 'sv-SE',
          }}
          label={`Nivå ${progress.level}`}
        />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {rutor.map((r) => (
          <div
            key={r.icon}
            className={`tile-pop flex flex-col items-center gap-1 px-2 py-4 text-white ${r.tint}`}
          >
            <span className="text-4xl leading-none" aria-hidden>{r.icon}</span>
            <span className="text-3xl font-extrabold tabular-nums" aria-hidden>
              {r.tal}{r.av !== null && <span className="text-xl opacity-80">/{r.av}</span>}
            </span>
            <EarButton size="sm" token={{ id: `fr-${r.icon}`, text: r.say, lang: 'sv-SE' }} label={r.say} />
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold">Bokstäver du kan</h2>
          <EarButton
            size="sm"
            token={{
              id: 'fr-bok',
              text: `Bokstäver du kan. Du kan ${bemastrade} av ${LETTERS.length}.`,
              lang: 'sv-SE',
            }}
            label="Bokstäver du kan"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {LETTERS.map((l) => {
            const m = progress.letters[l.id];
            // Mörk text på de mättade tonerna, inte vit: vitt på lime-500 ger
            // drygt 2:1 och är oläsligt för den som ska känna igen tecknet.
            const tone = m?.mastered
              ? 'bg-lime-400 text-ink-900'
              : m?.seen
                ? 'bg-amberx-400 text-ink-900'
                : 'bg-white/70 text-ink-500 dark:bg-ink-800/70 dark:text-ink-300';
            return (
              <span
                key={l.id}
                aria-label={
                  m?.mastered
                    ? `${l.upper}, den kan du`
                    : m?.seen
                      ? `${l.upper}, den övar du på`
                      : `${l.upper}, inte mött än`
                }
                className={`reading grid h-12 w-10 place-items-center rounded-tile text-xl font-bold ${tone}`}
              >
                <span aria-hidden>{l.upper}</span>
              </span>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold">Utmärkelser</h2>
          <EarButton
            size="sm"
            token={{
              id: 'fr-utm',
              text: `Utmärkelser. Du har ${vunna.length} av ${UTMARKELSER.length}.`,
              lang: 'sv-SE',
            }}
            label="Utmärkelser"
          />
          <span className="font-bold text-ink-500">
            {vunna.length}/{UTMARKELSER.length}
          </span>
        </div>

        {/* Vunna först, låsta efter. Att se vad som finns kvar är halva
            motivationen – men det som redan sitter ska komma först. */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[...UTMARKELSER]
            .sort((a, b) =>
              Number(progress.badges.includes(b.id)) - Number(progress.badges.includes(a.id))
            )
            .map((u) => {
              const vunnen = progress.badges.includes(u.id);
              return (
                <div
                  key={u.id}
                  className={cn(
                    // min-w-0: ett grid-barn har min-width:auto och vägrar
                    // annars krympa under sitt innehåll – raden blev 23 px
                    // bredare än skärmen på telefon.
                    'flex min-w-0 items-center gap-2 rounded-tile p-2',
                    vunnen
                      ? 'bg-amberx-100 dark:bg-amberx-500/20'
                      : 'bg-white/60 opacity-60 dark:bg-ink-800/60'
                  )}
                >
                  <span className="text-3xl leading-none" aria-hidden>
                    {vunnen ? u.emoji : '🔒'}
                  </span>
                  {/* Namnet får radbrytas – en avkortad utmärkelse
                      ("Hela alfab…") säger ingenting. Kravet under kapas
                      däremot, det är en påminnelse och inte huvudsaken. */}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-extrabold leading-tight">{u.namn}</span>
                    <span className="truncate text-xs text-ink-500">{u.krav}</span>
                  </span>
                  <EarButton
                    size="sm"
                    token={{
                      id: `utm-${u.id}`,
                      text: vunnen ? `${u.namn}. Klar!` : `${u.namn}. ${u.krav}`,
                      lang: 'sv-SE',
                    }}
                    label={u.namn}
                  />
                </div>
              );
            })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold">Övningar du klarat</h2>
          <EarButton
            size="sm"
            token={{
              id: 'fr-ov',
              text: `Övningar du klarat. Du har klarat ${klaradeTotalt} övningar.`,
              lang: 'sv-SE',
            }}
            label="Övningar du klarat"
          />
        </div>

        {klaradeTotalt === 0 && (
          <p className="rounded-card bg-white/85 p-4 text-ink-500 dark:bg-ink-800/85">
            Inga övningar klarade än. Tryck på 📚 Övningar på startsidan.
          </p>
        )}

        {NIVAER.map(({ niva, namn }) => {
          const alla = tasksForNiva(niva);
          const klara = alla.filter((t) => progress.tasks[t.id]);
          if (klara.length === 0) return null;
          return (
            <div key={niva} className="rounded-card bg-white/85 p-4 dark:bg-ink-800/85">
              <h3 className="mb-2 font-extrabold">
                {namn} — {klara.length} av {alla.length} klara
              </h3>
              <ul className="flex flex-col gap-1">
                {klara.map((t) => {
                  const res = progress.tasks[t.id];
                  return (
                    <li
                      key={t.id}
                      className="flex items-center gap-3 border-b border-ink-100 py-1.5
                                 last:border-0 dark:border-ink-700"
                    >
                      <span className="text-xl" aria-hidden>✅</span>
                      <span className="flex-1">{t.namn}</span>
                      {/* Bästa resultat på första försöket, inte senaste. */}
                      <span className="font-extrabold tabular-nums">
                        {res.basta}/{res.antal}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

    </div>
  );
}
