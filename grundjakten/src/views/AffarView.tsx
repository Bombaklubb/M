import { useState } from 'react';
import type { Progress, StudentProfile } from '@/types';
import { KATEGORIER, SALLSYNTHET, VAROR, type Vara, type VaruTyp } from '@/data/affar';
import { arKopt, attSpendera, harRad } from '@/lib/affar';
import { AppMarke } from '@/components/AppMarke';
import { LjudKnapp } from '@/components/LjudKnapp';
import { EarButton } from '@/components/EarButton';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { play } from '@/lib/audio';
import { playFanfare, playMiss } from '@/lib/sfx';
import { cn } from '@/lib/utils';

/**
 * Affären.
 *
 * Byggd efter Svenskajaktens: färgad hjälte med saldot i en egen ruta,
 * flikar per kategori, och kort med bild, namn, sällsynthet, pris och en
 * knapp som säger "För dyrt" när poängen inte räcker.
 *
 * Skillnaderna mot förlagan följer av målgruppen:
 *
 *  - Varje vara har ett ÖRA. Ett kort utan öra är en gissning för någon som
 *    inte kan läsa, och det gäller lika mycket här som i en övning.
 *  - Bilden är kortets största sak. Namnet är för läraren.
 *  - Det köpta väljs direkt. Att köpa och sedan leta upp en "använd"-knapp
 *    är ett steg för mycket.
 *  - Ingen Effekter-flik. En effekt som rör sig drar blicken från uppgiften.
 *
 * Poängen som visas är xp MINUS spenderat. Elevens `xp` sjunker aldrig av
 * ett köp – se lib/affar.ts.
 */
export function AffarView({
  profile,
  progress,
  onKop,
  onValj,
  onBack,
}: {
  profile: StudentProfile;
  progress: Progress;
  onKop: (id: string) => void;
  onValj: (id: string) => void;
  onBack: () => void;
}) {
  const [flik, setFlik] = useState<VaruTyp>('figur');
  const saldo = attSpendera(progress);

  useAutoSpeak(
    { id: 'affar-greet', text: `Affären. Du har ${saldo} poäng att handla för.`, lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

  const varor = VAROR.filter((v) => v.typ === flik);

  /** Är varan den eleven använder just nu? */
  const anvands = (v: Vara): boolean =>
    v.typ === 'figur' ? profile.avatar === v.ikon
      : v.typ === 'ram' ? progress.valdRam === v.id
        : progress.valdTema === v.id;

  const tryck = (v: Vara) => {
    if (arKopt(progress, v.id)) {
      if (anvands(v)) return;
      void play({ id: `valj-${v.id}`, text: `${v.namn} vald.`, lang: 'sv-SE' });
      onValj(v.id);
      return;
    }
    if (!harRad(progress, v)) {
      // Ingen tyst knapp. Eleven ska höra VARFÖR ingenting hände.
      playMiss();
      void play({
        id: `dyrt-${v.id}`,
        text: `${v.namn} kostar ${v.pris} poäng. Du har ${saldo}. Gör fler pass så får du mer.`,
        lang: 'sv-SE',
      });
      return;
    }
    playFanfare();
    void play({ id: `kopt-${v.id}`, text: `Du köpte ${v.namn}!`, lang: 'sv-SE' });
    onKop(v.id);
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
            <span className="text-5xl leading-none" aria-hidden>🛒</span>
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold">Affären</h1>
              <span className="font-bold text-amberx-100">Köp saker för dina poäng</span>
            </div>
          </div>

          {/* Saldot i en egen ruta, som i förlagan. Siffran är det enda på
              sidan eleven måste kunna jämföra med priserna. */}
          <div className="flex items-center gap-3 rounded-card bg-white/20 px-4 py-3">
            <span className="text-4xl leading-none" aria-hidden>⭐</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wide text-amberx-100">
                Att handla för
              </span>
              <span className="text-3xl font-extrabold tabular-nums leading-none">
                {saldo.toLocaleString('sv-SE')}
              </span>
            </div>
            <EarButton
              className="ml-auto"
              token={{
                id: 'affar-saldo',
                text: `Du har ${saldo} poäng att handla för.`,
                lang: 'sv-SE',
              }}
              label="Dina poäng"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
        {/* Flikarna. Bild + text, aldrig bara text. */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Kategorier">
          {KATEGORIER.map((k) => (
            <button
              key={k.typ}
              type="button"
              role="tab"
              aria-selected={flik === k.typ}
              onClick={() => {
                setFlik(k.typ);
                void play({ id: `flik-${k.typ}`, text: k.namn, lang: 'sv-SE' });
              }}
              className={cn(
                'btn-pop flex min-h-0 items-center gap-2 rounded-tile px-4 py-3 text-lg font-extrabold',
                flik === k.typ
                  ? 'border-amberx-700 bg-amberx-500 text-white'
                  : 'border-ink-200 bg-white text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200'
              )}
            >
              <span className="text-2xl" aria-hidden>{k.ikon}</span>
              {k.namn}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {varor.map((v) => {
            const kopt = arKopt(progress, v.id);
            const rad = harRad(progress, v);
            const vald = anvands(v);
            const etikett = kopt
              ? vald ? `${v.namn}, används nu` : `${v.namn}, köpt. Tryck för att använda.`
              : rad ? `Köp ${v.namn} för ${v.pris} poäng`
                : `${v.namn} kostar ${v.pris} poäng. Du har inte råd än.`;

            return (
              // min-w-0: korten är grid-barn, och grid-barn vägrar annars
              // krympa under sitt innehåll.
              <div key={v.id} className="relative min-w-0">
                <button
                  type="button"
                  onClick={() => tryck(v)}
                  aria-label={etikett}
                  className={cn(
                    'tile-pop flex w-full flex-col items-center gap-2 p-4',
                    vald
                      ? 'border-lime-500 bg-lime-100 dark:bg-lime-900/40'
                      : kopt
                        ? 'border-ink-300 bg-white dark:border-ink-600 dark:bg-ink-800'
                        : rad
                          ? 'bg-white dark:bg-ink-800'
                          : 'bg-white opacity-60 dark:bg-ink-800'
                  )}
                >
                  {/* Varan som bild. Ramar visar sin egen ring runt en
                      exempelfigur, så eleven ser vad hon får. */}
                  {v.typ === 'ram' ? (
                    <span
                      className={cn(
                        'grid h-16 w-16 place-items-center rounded-full bg-white text-4xl dark:bg-ink-900',
                        v.stil
                      )}
                      aria-hidden
                    >
                      {profile.avatar}
                    </span>
                  ) : (
                    <span className="text-5xl leading-none" aria-hidden>{v.ikon}</span>
                  )}

                  <span className="reading w-full truncate text-center text-base font-extrabold">
                    {v.namn}
                  </span>

                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide',
                      SALLSYNTHET[v.sallsynthet].klass
                    )}
                  >
                    {SALLSYNTHET[v.sallsynthet].namn}
                  </span>

                  {/* Statusraden. Aldrig bara färg – texten och tecknet
                      säger samma sak, för den som inte skiljer färgerna åt. */}
                  {vald ? (
                    <span className="flex items-center gap-1 text-base font-extrabold text-lime-700 dark:text-lime-300">
                      <span aria-hidden>✅</span> Används
                    </span>
                  ) : kopt ? (
                    <span className="flex items-center gap-1 text-base font-extrabold text-ink-500 dark:text-ink-300">
                      <span aria-hidden>👆</span> Använd
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'flex items-center gap-1 text-lg font-extrabold tabular-nums',
                        rad ? 'text-amberx-700 dark:text-amberx-300' : 'text-ink-400'
                      )}
                    >
                      <span aria-hidden>{rad ? '⭐' : '🔒'}</span> {v.pris}
                    </span>
                  )}
                </button>

                {/* Örat ligger UTANFÖR kortknappen: en knapp får inte ligga i
                    en annan knapp, och eleven ska kunna höra vad varan är
                    utan att råka köpa den. */}
                <EarButton
                  size="sm"
                  className="absolute -right-2 -top-2"
                  token={{ id: `ora-${v.id}`, text: etikett, lang: 'sv-SE' }}
                  label={v.namn}
                />
              </div>
            );
          })}
        </div>

        {/* För läraren. */}
        <section className="rounded-card bg-white/85 p-5 dark:bg-ink-800/85">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold">
            <span className="text-2xl" aria-hidden>💡</span>
            Så fungerar affären
          </h2>
          <p className="mb-2 leading-relaxed text-ink-700 dark:text-ink-200">
            Eleven handlar för sina poäng. Ett köp sänker <strong>inte</strong> hennes
            nivå eller tar tillbaka en kista – poängen hon samlat står kvar, och
            affären räknar bara hur mycket av dem hon redan gjort av med.
          </p>
          <p className="leading-relaxed text-ink-700 dark:text-ink-200">
            Det hon köper börjar gälla direkt. Ett tryck på något hon redan
            äger byter tillbaka till det.
          </p>
        </section>
      </main>
    </div>
  );
}
