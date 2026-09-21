import { useState } from 'react';
import type { Kista, Progress, StudentProfile } from '@/types';
import { KIST_META } from '@/data/belohningar';
import { utmarkelseById } from '@/data/belohningar';
import { EarButton } from '@/components/EarButton';
import { KistBild } from '@/components/KistBild';
import { AppMarke } from '@/components/AppMarke';
import { LjudKnapp } from '@/components/LjudKnapp';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { playFanfare } from '@/lib/sfx';
import { play } from '@/lib/audio';
import { cn } from '@/lib/utils';

/**
 * Kistorna.
 *
 * Samma idé som i Svenskajakten, men byggd för någon som inte kan läsa: en
 * oöppnad kista är STOR, den skakar, och det finns inget annat att göra med
 * den än att trycka. Öppningen är hela belöningen – det är därför de gamla
 * kistorna, som bara räknades i en siffra, inte gjorde någon nytta.
 *
 * Det som kom ur kistan visas som bild och siffra, och läses upp.
 */
export function KistorView({
  profile,
  progress,
  onOppna,
  onBack,
}: {
  profile: StudentProfile;
  progress: Progress;
  onOppna: (id: string) => void;
  onBack: () => void;
}) {
  /** Kistan som just öppnats, så belöningen kan visas stort. */
  const [visar, setVisar] = useState<string | null>(null);

  const stangda = progress.kistor.filter((k) => !k.oppnad);
  const oppnade = progress.kistor.filter((k) => k.oppnad);
  const nyssOppnad = visar ? progress.kistor.find((k) => k.id === visar) : null;

  useAutoSpeak(
    {
      id: 'kistor-greet',
      text: stangda.length
        ? `Du har ${stangda.length} kistor att öppna!`
        : 'Inga kistor just nu. Gör ett pass så får du en.',
      lang: 'sv-SE',
    },
    profile.settings.autoSpeakPrompts
  );

  const oppna = (k: Kista) => {
    playFanfare();
    onOppna(k.id);
    setVisar(k.id);
  };

  return (
    <div className="min-h-[100dvh]">
      <header className="bg-amberx-600 px-4 py-5 text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-2">
            <AppMarke onHome={onBack} paFarg />
            <LjudKnapp paFarg />
            <button
              type="button"
              onClick={onBack}
              aria-label="Tillbaka"
              className="flex h-11 w-fit min-h-0 items-center gap-2 rounded-tile px-3
                         font-bold text-amberx-100 hover:bg-white/10"
            >
              <span aria-hidden>←</span> Tillbaka
            </button>
          </div>
          <div className="flex items-center gap-4">
            <KistBild typ="tra" oppnad size={56} />
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold">Kistor</h1>
              <span className="font-bold text-amberx-100">
                {stangda.length > 0
                  ? `${stangda.length} att öppna`
                  : 'Gör ett pass så får du en'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        {/* Belöningen från den kista som just öppnades. */}
        {nyssOppnad?.oppnad && (
          <section
            className="animate-pop-in flex items-center gap-4 rounded-card border-4
                       border-lime-400 bg-white p-5 dark:bg-ink-800"
            role="status"
          >
            <KistBild typ={nyssOppnad.typ} oppnad size={72} />
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-2xl font-extrabold">
                ⭐ {nyssOppnad.xp} poäng
              </span>
              {nyssOppnad.utmarkelse && (
                <span className="text-xl font-bold">
                  {utmarkelseById(nyssOppnad.utmarkelse)?.emoji}{' '}
                  {utmarkelseById(nyssOppnad.utmarkelse)?.namn}
                </span>
              )}
            </div>
            <EarButton
              token={{
                id: `kista-${nyssOppnad.id}`,
                text: `Du fick ${nyssOppnad.xp} poäng.` +
                  (nyssOppnad.utmarkelse
                    ? ` Och utmärkelsen ${utmarkelseById(nyssOppnad.utmarkelse)?.namn}!`
                    : ''),
                lang: 'sv-SE',
              }}
              label="Vad du fick"
            />
          </section>
        )}

        {/* Oöppnade. Stora, skakande, omöjliga att missa. */}
        {stangda.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <span className="text-2xl" aria-hidden>🎁</span>
              Öppna en kista
            </h2>
            {stangda.map((k) => {
              const meta = KIST_META[k.typ];
              return (
                <button
                  key={k.id}
                  type="button"
                  aria-label={`Öppna ${meta.namn}`}
                  onPointerDown={() =>
                    void play({ id: `kn-${k.id}`, text: meta.namn, lang: 'sv-SE' })
                  }
                  onClick={() => oppna(k)}
                  className={cn(
                    'btn-pop flex items-center gap-5 rounded-card px-6 py-5 text-left text-white',
                    meta.tint
                  )}
                >
                  <KistBild typ={k.typ} oppnad={false} size={64}
                            className="animate-chest-shake" />
                  <span className="flex-1 text-2xl font-extrabold">{meta.namn}</span>
                  <span className="text-3xl" aria-hidden>👆</span>
                </button>
              );
            })}
          </section>
        )}

        {stangda.length === 0 && (
          <p className="rounded-card bg-white/85 p-5 text-ink-500 dark:bg-ink-800/85">
            Inga kistor att öppna just nu. Varje avklarat pass ger en ny.
          </p>
        )}

        {/* Öppnade, dämpat – en hylla över det hon samlat. */}
        {oppnade.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <span className="text-2xl" aria-hidden>✅</span>
              Öppnade ({oppnade.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {oppnade.slice(-40).map((k) => (
                <span
                  key={k.id}
                  aria-label={`Öppnad ${KIST_META[k.typ].namn}, gav ${k.xp ?? 0} poäng`}
                  className="grid h-12 w-12 place-items-center rounded-tile bg-white/70
                             text-2xl opacity-60 dark:bg-ink-800/70"
                >
                  <KistBild typ={k.typ} oppnad size={34} />
                </span>
              ))}
            </div>
          </section>
        )}

        {/* För läraren. */}
        <section className="rounded-card bg-white/85 p-5 dark:bg-ink-800/85">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold">
            <span className="text-2xl" aria-hidden>💡</span>
            Så får man kistor
          </h2>
          <ul className="flex flex-col gap-1 text-ink-700 dark:text-ink-200">
            <li className="flex items-center gap-2">
              <KistBild typ="tra" oppnad={false} size={28} />
              <span><strong>Träkista</strong> – varje avklarat pass.</span>
            </li>
            <li>🪙 <strong>Silverkista</strong> – vid 5, 10 och 25 pass, och vid 250 poäng.</li>
            <li>🏆 <strong>Guldkista</strong> – vid 15, 40, 60 och 100 pass, och vid 700, 1350 och 2700 poäng.</li>
          </ul>
          <p className="mt-3 text-sm text-ink-500">
            Silver- och guldkistor kan innehålla en utmärkelse. Den syns sedan på
            elevens framstegssida.
          </p>
        </section>
      </main>
    </div>
  );
}
