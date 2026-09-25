import { useState, type ReactNode } from 'react';
import type { Progress, StudentProfile } from '@/types';
import {
  FIGURGRUPPER,
  KATEGORIER,
  SALLSYNTHET,
  VAROR,
  type Vara,
  type VaruTyp,
} from '@/data/affar';
import { arKopt, attSpendera, harRad, type Avstangbar } from '@/lib/affar';
import { EffektLager } from '@/components/EffektLager';
import { AppMarke } from '@/components/AppMarke';
import { LjudKnapp } from '@/components/LjudKnapp';
import { EarButton } from '@/components/EarButton';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { play } from '@/lib/audio';
import { playFanfare, playMiss } from '@/lib/sfx';
import { cn } from '@/lib/utils';

/** Flikarna: de tre varutyperna, plus elevens egna köp. */
type Flik = VaruTyp | 'kopt';

/**
 * Affären.
 *
 * Byggd efter Engelskajaktens (`engelska/src/app/butik/page.tsx`, läst med
 * lärarens uttryckliga tillåtelse): färgad hjälte med saldot i en egen ruta,
 * flikar per kategori plus "Mina köp", figurerna i rubricerade grupper, kort
 * med bild, namn, sällsynthet och pris, en knapp som säger "För dyrt" när
 * poängen inte räcker, och en köpruta som visar vad som blir kvar efteråt.
 *
 * Skillnaderna mot förlagan följer av målgruppen:
 *
 *  - Varje vara har ett ÖRA. Ett kort utan öra är en gissning för någon som
 *    inte kan läsa, och det gäller lika mycket här som i en övning.
 *  - Bilden är kortets största sak. Namnet är för läraren.
 *  - Köprutan har ✅ och ❌ på knapparna, inte bara "Köp" och "Avbryt", och
 *    den läses upp av sig själv.
 *  - Ingen Effekter-flik. En effekt som rör sig drar blicken från uppgiften.
 *  - Engelskajakten visar en toast; här talar appen i stället. Eleven kan
 *    inte läsa en toast.
 *
 * Poängen som visas är xp MINUS spenderat. Elevens `xp` sjunker aldrig av
 * ett köp – se lib/affar.ts.
 */
export function AffarView({
  profile,
  progress,
  onKop,
  onValj,
  onValjBort,
  onBack,
}: {
  profile: StudentProfile;
  progress: Progress;
  onKop: (id: string) => void;
  onValj: (id: string) => void;
  onValjBort: (typ: Avstangbar) => void;
  onBack: () => void;
}) {
  const [flik, setFlik] = useState<Flik>('figur');
  /** Varan eleven är på väg att köpa. Null = ingen köpruta uppe. */
  const [bekrafta, setBekrafta] = useState<Vara | null>(null);
  const saldo = attSpendera(progress);

  useAutoSpeak(
    { id: 'affar-greet', text: `Affären. Du har ${saldo} poäng att handla för.`, lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

  /** Är varan den eleven använder just nu? */
  const anvands = (v: Vara): boolean =>
    v.typ === 'figur' ? profile.avatar === v.ikon
      : v.typ === 'ram' ? progress.valdRam === v.id
        : v.typ === 'tema' ? progress.valdTema === v.id
          : progress.valdEffekt === v.id;

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
    // Köpet sker inte direkt. Poängen är svårtjänade, och ett feltryck som
    // kostar femhundra av dem är ett svek mot en elev som inte kan läsa vad
    // knappen gjorde. Engelskajakten frågar likadant.
    setBekrafta(v);
  };

  /**
   * Säger något EFTER att köprutan stängts.
   *
   * Köprutan läser upp sin fråga med useAutoSpeak, och den hakens städning
   * anropar `stop()` när rutan försvinner. Ett `play()` i samma klick hinner
   * alltså startas och sedan tystas av avmonteringen. Timeouten lägger
   * uppläsningen efter renderingen i stället.
   */
  const sagEfterat = (id: string, text: string) => {
    window.setTimeout(() => void play({ id, text, lang: 'sv-SE' }), 0);
  };

  const genomfor = (v: Vara) => {
    setBekrafta(null);
    playFanfare();
    onKop(v.id);
    sagEfterat(`kopt-${v.id}`, `Du köpte ${v.namn}!`);
  };

  const angra = (v: Vara) => {
    setBekrafta(null);
    sagEfterat(`angra-${v.id}`, 'Inget köp. Dina poäng är kvar.');
  };

  /**
   * Varans bild.
   *
   * Ramar visar sin ring runt elevens egen figur. Teman och effekter visas
   * som en provbit med den RIKTIGA bakgrunden respektive de riktiga
   * partiklarna – inte en emoji. En liten solnedgångsbild lovade mer än
   * temat höll, och eleven ska se exakt vad hon får innan hon betalar.
   */
  const bild = (v: Vara, stor = false): ReactNode =>
    v.typ === 'tema' ? (
      <TemaProv tema={v} stor={stor} />
    ) : v.typ === 'effekt' ? (
      <EffektProv effekt={v} stor={stor} />
    ) : v.typ === 'ram' ? (
      <span
        className={cn(
          'grid place-items-center rounded-full bg-white dark:bg-ink-900',
          stor ? 'h-24 w-24 text-6xl' : 'h-16 w-16 text-4xl',
          v.stil
        )}
        aria-hidden
      >
        {profile.avatar}
      </span>
    ) : (
      <span className={cn('leading-none', stor ? 'text-7xl' : 'text-5xl')} aria-hidden>
        {v.ikon}
      </span>
    );

  const kort = (v: Vara) => {
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
                : 'bg-white dark:bg-ink-800'
          )}
        >
          {/* Bilden bleks ALDRIG, inte ens när eleven inte har råd. Det är
              den hon ska längta efter, och ett blekt tema ser ut som ett
              annat tema. "För dyrt" syns i stället på texten och låset. */}
          {bild(v)}

          <span
            className={cn(
              'reading w-full truncate text-center text-base font-extrabold',
              !kopt && !rad && 'opacity-60'
            )}
          >
            {v.namn}
          </span>

          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide',
              SALLSYNTHET[v.sallsynthet].klass,
              !kopt && !rad && 'opacity-60'
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
  };

  /**
   * Standardkortet, ur Engelskajakten.
   *
   * Utan det fastnar den som köpt ett tema i det för alltid. Kortet kostar
   * ingenting och tar bara bort påslaget – köpet ligger kvar.
   */
  const standardKort = (typ: Avstangbar) => {
    const aktiv = typ === 'ram' ? !progress.valdRam
      : typ === 'tema' ? !progress.valdTema
        : !progress.valdEffekt;
    const etikett = typ === 'ram'
      ? aktiv ? 'Ingen ram, används nu' : 'Ingen ram. Tryck för att ta bort ramen.'
      : typ === 'tema'
        ? aktiv ? 'Vanliga bakgrunden, används nu' : 'Vanliga bakgrunden. Tryck för att gå tillbaka.'
        : aktiv ? 'Ingen effekt, används nu' : 'Ingen effekt. Tryck för att stänga av effekten.';
    const namn = typ === 'ram' ? 'Ingen ram' : typ === 'tema' ? 'Vanlig' : 'Ingen effekt';

    return (
      <div className="relative min-w-0">
        <button
          type="button"
          onClick={() => {
            if (aktiv) return;
            void play({ id: `standard-${typ}`, text: 'Tillbaka till vanligt.', lang: 'sv-SE' });
            onValjBort(typ);
          }}
          aria-label={etikett}
          className={cn(
            'tile-pop flex w-full flex-col items-center gap-2 p-4',
            aktiv
              ? 'border-lime-500 bg-lime-100 dark:bg-lime-900/40'
              : 'border-ink-300 bg-white dark:border-ink-600 dark:bg-ink-800'
          )}
        >
          {typ === 'ram' ? (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-4xl dark:bg-ink-900" aria-hidden>
              {profile.avatar}
            </span>
          ) : typ === 'tema' ? (
            // Appens egen standardbakgrund, så eleven ser vad hon går tillbaka till.
            <span className="block h-16 w-full rounded-tile border border-ink-200 bg-ink-50" aria-hidden />
          ) : (
            <span className="block h-16 w-full rounded-tile bg-ink-700" aria-hidden />
          )}

          <span className="reading w-full truncate text-center text-base font-extrabold">
            {namn}
          </span>

          <span className="rounded-full bg-ink-200 px-2 py-0.5 text-xs font-extrabold uppercase
                           tracking-wide text-ink-700 dark:bg-ink-700 dark:text-ink-200">
            Gratis
          </span>

          {aktiv ? (
            <span className="flex items-center gap-1 text-base font-extrabold text-lime-700 dark:text-lime-300">
              <span aria-hidden>✅</span> Används
            </span>
          ) : (
            <span className="flex items-center gap-1 text-base font-extrabold text-ink-500 dark:text-ink-300">
              <span aria-hidden>↩️</span> Ta bort
            </span>
          )}
        </button>

        <EarButton
          size="sm"
          className="absolute -right-2 -top-2"
          token={{ id: `ora-standard-${typ}`, text: etikett, lang: 'sv-SE' }}
          label={namn}
        />
      </div>
    );
  };

  const rutnat = (barn: ReactNode) => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{barn}</div>
  );

  const avsnitt = (rubrik: string, varor: Vara[]) =>
    varor.length === 0 ? null : (
      <section key={rubrik} className="space-y-2">
        <h2 className="px-0.5 text-sm font-extrabold uppercase tracking-wide text-ink-500 dark:text-ink-300">
          {rubrik}
        </h2>
        {rutnat(varor.map(kort))}
      </section>
    );

  /** Mina köp. Tomt är ett eget läge – en tom sida förklarar ingenting. */
  const minaKop = () => {
    const kopta = VAROR.filter((v) => arKopt(progress, v.id));
    if (kopta.length === 0) {
      return (
        <div className="rounded-card bg-white/85 p-8 text-center dark:bg-ink-800/85">
          <p className="mb-2 text-6xl" aria-hidden>📦</p>
          <p className="text-xl font-extrabold">Inget köpt än</p>
          <p className="mt-1 text-ink-500 dark:text-ink-300">
            Gör fler pass, samla poäng och köp något här.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {KATEGORIER.map((k) => avsnitt(k.namn, kopta.filter((v) => v.typ === k.typ)))}
      </div>
    );
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
        {/* Fem flikar sedan Effekter kom till. På en bredare skärm står de i
            en rad med samma bredd, som i systerapparna; i en vanlig flex-rad
            bröts "Mina köp" ensam ned på en egen rad även på Chromebooken. */}
        <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-5" role="tablist" aria-label="Kategorier">
          {[
            ...KATEGORIER,
            { typ: 'kopt' as const, namn: 'Mina köp', ikon: '🎁' },
          ].map((k) => (
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
                'btn-pop flex min-h-0 items-center justify-center gap-2 rounded-tile px-4 py-3',
                'text-lg font-extrabold sm:px-2 sm:text-base',
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

        {flik === 'kopt' ? (
          minaKop()
        ) : flik === 'figur' ? (
          /* Figurerna i rubricerade grupper, som i Engelskajakten. Ett enda
             rutnät med tjugofyra ansikten går inte att hitta tillbaka i. */
          <div className="space-y-6">
            {FIGURGRUPPER.map((g) =>
              avsnitt(g, VAROR.filter((v) => v.typ === 'figur' && v.grupp === g))
            )}
          </div>
        ) : (
          rutnat(
            <>
              {standardKort(flik)}
              {VAROR.filter((v) => v.typ === flik).map(kort)}
            </>
          )
        )}

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
            äger byter tillbaka till det, och korten <strong>Ingen ram</strong>,{' '}
            <strong>Vanlig</strong> och <strong>Ingen effekt</strong> tar bort
            påslaget utan att köpet försvinner.
          </p>
          <p className="mt-2 leading-relaxed text-ink-700 dark:text-ink-200">
            Tema och effekt syns på alla sidor <strong>utom under själva
            övningen</strong>. Där ska ingenting röra sig bakom uppgiften.
          </p>
        </section>
      </main>

      {bekrafta && (
        <KopRuta
          vara={bekrafta}
          saldo={saldo}
          bild={bild(bekrafta, true)}
          talar={profile.settings.autoSpeakPrompts}
          onJa={() => genomfor(bekrafta)}
          onNej={() => angra(bekrafta)}
        />
      )}
    </div>
  );
}

/**
 * Köprutan.
 *
 * Visar varan stor, priset, och vad som blir kvar efteråt – det sista är
 * hela poängen med rutan, och det är också det Engelskajakten visar.
 * Knapparna bär ✅ och ❌ så att valet går att göra utan att läsa.
 */
function KopRuta({
  vara,
  saldo,
  bild,
  talar,
  onJa,
  onNej,
}: {
  vara: Vara;
  saldo: number;
  bild: ReactNode;
  talar: boolean;
  onJa: () => void;
  onNej: () => void;
}) {
  const kvar = saldo - vara.pris;

  useAutoSpeak(
    {
      id: `kopfraga-${vara.id}`,
      text: `Vill du köpa ${vara.namn} för ${vara.pris} poäng? Då har du ${kvar} kvar.`,
      lang: 'sv-SE',
    },
    talar
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vill du köpa ${vara.namn} för ${vara.pris} poäng?`}
      className="fixed inset-0 z-50 grid place-items-center bg-ink-900/70 p-4"
    >
      <div className="w-full max-w-sm rounded-card bg-white p-6 text-center shadow-pop dark:bg-ink-800">
        <div className="mb-3 grid place-items-center">{bild}</div>

        <h2 className="reading text-2xl font-extrabold leading-tight">{vara.namn}</h2>

        <p className="mt-3 flex items-center justify-center gap-2 text-2xl font-extrabold
                      tabular-nums text-amberx-700 dark:text-amberx-300">
          <span aria-hidden>⭐</span> {vara.pris}
        </p>
        <p className="mt-1 text-ink-500 dark:text-ink-300">
          Kvar sen: <strong className="tabular-nums">{kvar}</strong>
        </p>

        {/* NEJ till vänster, JA till höger. Nej är den ofarliga knappen och
            ska vara lika stor – en elev som råkar trycka ska helst landa på
            den som inte kostar något. */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onNej}
            aria-label="Nej, köp inte"
            className="btn-pop flex flex-1 items-center justify-center gap-2 rounded-tile
                       border-ink-300 bg-ink-100 px-4 py-4 text-xl font-extrabold
                       dark:border-ink-600 dark:bg-ink-700"
          >
            <span aria-hidden>❌</span> Nej
          </button>
          <button
            type="button"
            onClick={onJa}
            aria-label={`Ja, köp ${vara.namn}`}
            className="btn-pop flex flex-1 items-center justify-center gap-2 rounded-tile
                       border-lime-700 bg-lime-500 px-4 py-4 text-xl font-extrabold text-white"
          >
            <span aria-hidden>✅</span> Ja
          </button>
        </div>
      </div>
    </div>
  );
}

/** Provbit för ett tema: exakt samma bakgrund som sidan får. */
function TemaProv({ tema, stor }: { tema: Vara; stor: boolean }) {
  return (
    <span
      className={cn(
        'block rounded-tile border border-black/10',
        stor ? 'h-36 w-72 max-w-full' : 'h-20 w-full',
        tema.animerad && 'tema-glid'
      )}
      style={{ background: tema.css }}
      aria-hidden
    />
  );
}

/**
 * Provbit för en effekt: de riktiga partiklarna över en mörk ruta, som i
 * Engelskajakten. Mörkt för att vitt snöfall och glitter ska synas.
 */
function EffektProv({ effekt, stor }: { effekt: Vara; stor: boolean }) {
  return (
    <span
      className={cn(
        'relative block overflow-hidden rounded-tile bg-gradient-to-br from-ink-600 to-ink-900',
        stor ? 'h-36 w-72 max-w-full' : 'h-20 w-full'
      )}
      aria-hidden
    >
      <EffektLager effekt={effekt} />
    </span>
  );
}
