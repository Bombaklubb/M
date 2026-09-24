import type { Progress, StudentProfile } from '@/types';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { AppMarke } from '@/components/AppMarke';
import { LjudKnapp } from '@/components/LjudKnapp';
import { EarButton } from '@/components/EarButton';
import { KistBild } from '@/components/KistBild';
import { cn, getLevelTitle, xpForNextLevel } from '@/lib/utils';
import { attSpendera, ramStil } from '@/lib/affar';

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
  onHem,
  onProfile,
  onOm,
  onKistor,
  onAffar,
  onLogout,
}: {
  profile: StudentProfile;
  progress: Progress;
  onGo: (dest: Destination) => void;
  onHem: () => void;
  onProfile: () => void;
  onOm: () => void;
  onKistor: () => void;
  onAffar: () => void;
  onLogout: () => void;
}) {
  const xp = xpForNextLevel(progress.xp);
  const oOppnade = progress.kistor.filter((k) => !k.oppnad).length;

  useAutoSpeak(
    { id: 'home-greet', text: 'Vad vill du göra?', lang: 'sv-SE' },
    profile.settings.autoSpeakPrompts
  );

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-4xl flex-col px-4 py-3
                    [@media(min-height:760px)]:py-5">
      {/* flex-wrap: sju saker får inte plats på en telefonbredd. Utan
          brytningen lade de sig ovanpå varandra – "Om Grundjakten" hamnade
          under ljudknappen och gick inte att trycka på, och namnet klämdes
          ihop till 20 px. Hellre två rader än en oåtkomlig knapp. */}
      <header className="mb-3 flex flex-wrap items-center justify-between gap-1
                         [@media(min-height:760px)]:mb-6 sm:gap-2">
        {/* Samma märke på samma plats som på alla andra sidor. Här är det
            redan hemma, men klicket ska finnas överallt – annars måste eleven
            hålla reda på var det fungerar. */}
        <AppMarke onHome={onHem} />

        {/* min-w-0 på både nav och namnknappen: utan det vägrar namnet krympa
            och trycker i stället ut "Logga ut" ur skärmen på en telefon. */}
        <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <LjudKnapp />

          <button
            type="button"
            onClick={onOm}
            aria-label="Om Grundjakten"
            className="grid h-11 w-10 min-h-0 shrink-0 place-items-center rounded-tile font-bold
                       text-ink-500 hover:bg-white/70 dark:text-ink-300 dark:hover:bg-ink-800/70
                       sm:h-14 sm:w-12
                       lg:flex lg:w-auto lg:items-center lg:gap-2 lg:px-3"
          >
            <span className="text-lg sm:text-xl" aria-hidden>❓</span>
            {/* Bara "Om" i skrift, inte "Om Grundjakten": märket står redan
                till vänster i samma rad, och den längre etiketten sköt ut
                hela huvudet på tre rader på en Chromebook. Uppläsningen får
                fortfarande hela namnet via aria-label. */}
            <span className="hidden lg:block">Om</span>
          </button>

          {/* Kistorna. Siffran är det enda som lockar en elev som inte kan
              läsa – därför är den röd och sitter på själva ikonen. */}
          <button
            type="button"
            onClick={onKistor}
            aria-label={
              oOppnade > 0
                ? `Kistor, ${oOppnade} att öppna`
                : 'Kistor, inga att öppna just nu'
            }
            className="btn-pop relative grid h-11 w-11 min-h-0 shrink-0 place-items-center
                       rounded-tile border-amberx-700 bg-amberx-500 text-2xl
                       sm:h-14 sm:w-14 sm:text-3xl"
          >
            <KistBild
              typ="tra"
              oppnad={oOppnade === 0}
              size={28}
              className={cn(oOppnade > 0 && 'animate-chest-shake')}
            />
            {oOppnade > 0 && (
              <span
                className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center
                           rounded-full bg-red-500 px-1 text-xs font-extrabold text-white
                           sm:h-6 sm:min-w-[1.5rem] sm:text-sm"
                aria-hidden
              >
                {oOppnade > 9 ? '9+' : oOppnade}
              </span>
            )}
          </button>

          {/* Affären. Ligger bredvid kistorna – båda handlar om poängen,
              och eleven ska hitta dem på samma ställe. Siffran syns inte
              här; den står stort på affärens egen sida, och ett tal till i
              sidhuvudet gör raden rörig på telefon. */}
          <button
            type="button"
            onClick={onAffar}
            aria-label={`Affären, du har ${attSpendera(progress)} poäng att handla för`}
            className="btn-pop grid h-11 w-11 min-h-0 shrink-0 place-items-center rounded-tile
                       border-amberx-700 bg-amberx-500 text-2xl sm:h-14 sm:w-14 sm:text-3xl"
          >
            <span aria-hidden>🛒</span>
          </button>

          {/* Ansiktet OCH namnet i EN knapp, som leder till framstegen.
              Figurbytet ligger kvar på framstegssidan, där ansiktet är stort
              – ett tryck här landar eleven på just den sidan.

              På TELEFON visas bara figuren. Sidhuvudet bär sju saker sedan
              affären tillkom, och namnet plus XP-mätaren är 104 px av 360 –
              raden bröts till tre. Figuren räcker för att känna igen sin egen
              knapp, och namnet står stort på sidan hon landar på. Samma grepp
              som för "Logga ut" och etiketten "Om". */}
          <button
            type="button"
            onClick={onProfile}
            aria-label={`${profile.name}, nivå ${progress.level}, ${getLevelTitle(progress.level)}. Se dina framsteg och byt figur.`}
            className="btn-pop flex h-11 min-h-0 min-w-0 shrink items-center justify-center gap-1.5
                       rounded-tile border-ink-200 bg-white px-1.5 dark:border-ink-700
                       dark:bg-ink-800 sm:h-14 sm:gap-2 sm:pl-2 sm:pr-4"
          >
            {/* Ramen ur affären ritas runt figuren. Utan den syns ett köp
                av en ram ingenstans, och då är den inte värd poängen. */}
            <span
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-full text-2xl leading-none',
                'sm:h-10 sm:w-10 sm:text-3xl',
                ramStil(progress)
              )}
              aria-hidden
            >
              {profile.avatar}
            </span>
            <span className="hidden min-w-0 flex-col items-start sm:flex">
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
            className="hidden h-11 w-10 min-h-0 shrink-0 place-items-center rounded-tile font-bold
                       text-ink-500 hover:bg-amberx-100 hover:text-amberx-700 dark:text-ink-300
                       sm:grid sm:h-14 sm:w-12
                       lg:flex lg:w-auto lg:items-center lg:gap-2 lg:px-3"
          >
            <span className="text-xl" aria-hidden>🚪</span>
            <span className="hidden lg:block">Logga ut</span>
          </button>
        </nav>
      </header>

      <main className="grid flex-1 content-center gap-3 [@media(min-height:760px)]:gap-5">
        {CARDS.map((card) => (
          /* Örat ligger bredvid kortet, inte i det: en knapp får inte ligga i
             en annan knapp, och eleven ska kunna höra vad kortet heter utan
             att skickas vidare. Samma lösning som i övningsbanken. */
          /* min-w-0 på raden: den är ett grid-barn, och grid-barn har
             min-width: auto. Utan det vägrar raden bli smalare än kortets
             innehåll och örat trycktes ut utanför skärmkanten på telefon. */
          <div key={card.id} className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* min-w-0 och smalare luft på telefon: utan det vägrar kortet
                krympa under sitt innehåll och trycker ut örat ur skärmen. */}
            <button
              type="button"
              aria-label={card.say}
              onClick={() => onGo(card.id)}
              className={`btn-pop flex min-w-0 flex-1 items-center gap-3 rounded-card px-4 py-4
                          text-left text-white sm:gap-5 sm:px-6
                          [@media(min-height:760px)]:gap-6
                          [@media(min-height:760px)]:px-8 [@media(min-height:760px)]:py-7 ${card.tint}`}
            >
              <span className="shrink-0 text-4xl leading-none sm:text-5xl
                               [@media(min-height:760px)]:text-6xl" aria-hidden>
                {card.icon}
              </span>
              <span className="min-w-0 text-2xl font-extrabold sm:text-3xl
                               [@media(min-height:760px)]:text-4xl">
                {card.title}
              </span>
            </button>

            <EarButton
              token={{ id: `say-${card.id}`, text: card.say, lang: 'sv-SE' }}
              label={card.say}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
