export type Kind = 'mat' | 'stad' | 'tran' | 'skjuts';

export const TINT: Record<Kind, string> = {
  mat: '#fef3c7',
  stad: '#dbeafe',
  tran: '#ffe4e6',
  skjuts: '#e0e8ff',
};

/* ── Veckan räknas ut från dagens datum ─────────────────────────
   Schemat är kopplat till veckodagar, så samma uppgifter gäller vecka
   efter vecka. Datum och "idag" hämtas från klockan i telefonen. */

const DAY_NAMES = ['mån', 'tis', 'ons', 'tor', 'fre', 'lör', 'sön'];
const DAY_LONG = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
const MONTH_SHORT = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

const dagensDatum = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Måndagen i den vecka datumet ligger i. */
function veckansStart(now: Date): Date {
  const d = dagensDatum(now);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

/** ISO-veckonummer — samma numrering som kalendrar och skolscheman använder. */
function isoVecka(datum: Date): number {
  const d = dagensDatum(datum);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const förstaTorsdagen = new Date(d.getFullYear(), 0, 4);
  förstaTorsdagen.setDate(förstaTorsdagen.getDate() + 3 - ((förstaTorsdagen.getDay() + 6) % 7));
  return 1 + Math.round((d.getTime() - förstaTorsdagen.getTime()) / (7 * 86400000));
}

/** "Vecka 36 · 31 aug–6 sep" */
export function weekLabel(now = new Date()): string {
  const start = veckansStart(now);
  const slut = new Date(start);
  slut.setDate(start.getDate() + 6);
  const från = start.getMonth() === slut.getMonth()
    ? `${start.getDate()}`
    : `${start.getDate()} ${MONTH_SHORT[start.getMonth()]}`;
  return `Vecka ${isoVecka(now)} · ${från}–${slut.getDate()} ${MONTH_SHORT[slut.getMonth()]}`;
}

/**
 * Varje person har en egen färg som följer med genom appen: ringen runt
 * avataren, namnet och den lilla räknaren. base används i avatarens bakgrund.
 */
export type PersonColor = { base: string; ring: string; tint: string; fg: string };

export const PERSON_COLOR: Record<string, PersonColor> = {
  Martin: { ring: '#86efac', base: '#16a34a', tint: '#dcfce7', fg: '#15803d' },
  Karin: { ring: '#93c5fd', base: '#2563eb', tint: '#dbeafe', fg: '#1d4ed8' },
  Astrid: { ring: '#d8b4fe', base: '#9333ea', tint: '#f3e8ff', fg: '#7e22ce' },
  Signe: { ring: '#f9a8d4', base: '#ec4899', tint: '#fce7f3', fg: '#be185d' },
  Bodil: { ring: '#fdba74', base: '#f97316', tint: '#ffedd5', fg: '#c2410c' },
};

const NEUTRAL: PersonColor = { ring: '#e5e7eb', base: '#6b7280', tint: '#f9fafb', fg: '#4b5563' };

/** Färgen för ett namn — grå om namnet inte är någon i familjen. */
export const colorOf = (name: string): PersonColor => PERSON_COLOR[name] ?? NEUTRAL;

/**
 * Familjens fem färger blandade till en mjuk bakgrund: en färgfläck per person
 * som flyter in i de andra, över en djup bas så vit text håller sig läsbar.
 * Ordningen följer avatarraden, så varje person har "sitt" hörn av rubriken.
 */
const BLOBS: [string, string][] = [
  ['Martin', '90% 130% at 4% 18%'],
  ['Karin', '85% 140% at 30% 96%'],
  ['Astrid', '80% 130% at 52% -6%'],
  ['Signe', '85% 130% at 76% 104%'],
  ['Bodil', '90% 140% at 100% 12%'],
];

export const FAMILY_GRADIENT = [
  // Slöjan överst håller nere ljusstyrkan där texten ligger.
  'linear-gradient(180deg, rgba(17,24,39,.34) 0%, rgba(17,24,39,.10) 46%, rgba(17,24,39,.24) 100%)',
  ...BLOBS.map(([namn, pos]) => {
    const c = PERSON_COLOR[namn].base;
    return `radial-gradient(${pos}, ${c}d9 0%, ${c}66 38%, ${c}00 62%)`;
  }),
  'linear-gradient(150deg, #1e1b4b 0%, #312e81 52%, #4c1d95 100%)',
].join(', ');

export type Member = {
  name: string;
  short: string;
  /** Vad personen har hand om. Utelämnat för barnen — åldrar står ingenstans. */
  role?: string;
  avatar: string;
};

export const MEMBERS: Member[] = [
  { name: 'Martin', short: 'Martin', role: 'Köket i veckan', avatar: '/avatars/martin.svg' },
  { name: 'Karin', short: 'Karin', role: 'Sambo', avatar: '/avatars/karin.svg' },
  { name: 'Astrid', short: 'Astrid', avatar: '/avatars/astrid.svg' },
  { name: 'Signe', short: 'Signe', avatar: '/avatars/signe.svg' },
  { name: 'Bodil', short: 'Bodil', avatar: '/avatars/bodil.svg' },
];

/** p = vem raden gäller: ett namn, flera namn eller 'alla'. */
export type DayItem = {
  icon: string;
  label: string;
  meta: string;
  /** Skjutsen, på egen rad under raden: "Karin lämnar 17:45 · Martin hämtar 19:00". */
  ride?: string;
  /** Ryms på en rad på tavlan: ikonen och `meta`, utan rubrik. */
  compact?: boolean;
  k: Kind;
  p: string | string[];
};

/** Filtret i toppen: visa raden när ingen är vald, när den gäller alla eller den valda. */
export const forPerson = (p: DayItem['p'], filter: string | null) =>
  !filter || p === 'alla' || (Array.isArray(p) ? p.includes(filter) : p === filter);
export type Day = { name: string; long: string; date: string; today: boolean };

/** Veckans sju dagar med riktiga datum, och dagens dag markerad. */
export function weekDays(now = new Date()): Day[] {
  const start = veckansStart(now);
  const idag = dagensDatum(now).getTime();
  return DAY_NAMES.map((name, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      name,
      long: DAY_LONG[i],
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      today: d.getTime() === idag,
    };
  });
}

/** Stor bokstav först, resten orört — namn mitt i texten ska behålla sin versal. */
const versal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * "Mån" på utskriftsbladen. Utan datum med flit: lapparna sitter uppe tills
 * schemat ändras, och ett datum från utskriftsdagen skulle bara bli fel.
 */
export const sheetDayFor = (namn: string) => versal(namn);

/**
 * Dagens rader byggs av träningarna och matansvaret — samma källa som flikarna
 * och utskriften, så tavlan aldrig kan säga något annat än schemat.
 *
 * Sysslorna kommer med först när man filtrerat fram en person. Allas sysslor på
 * alla sju dagar blir ett trettiotal rader och tavlan slutar rymmas i en bild,
 * men "vad ska jag göra idag" är precis vad man vill se när man tryckt på sitt
 * eget ansikte.
 */
export function dayItems(d: Day, filter: string | null = null): DayItem[] {
  // Skolskjutsen först: den är dagens första och sista punkt.
  const skjuts: DayItem[] = dayRide(d.name)
    // compact: "Barn" och "lämnar/hämtar" säger redan vad raden är, och rubriken
    // på egen rad hade kostat en av de sju dagarna plats på skärmen. Ordet i
    // stället för en bil skiljer också skolskjutsen från träningsskjutsen.
    ? [{ icon: RIDE_TAG, label: RIDE_LABEL, meta: dayRide(d.name), compact: true, k: 'skjuts', p: dayRideWho(d.name) }]
    : [];

  const träning: DayItem[] = TRAININGS.filter((t) => t.day === d.name).map((t) => ({
    icon: '🤸',
    label: `${t.short ?? t.title} ${t.time}`,
    meta: t.place ? `${t.person} · ${t.place}` : t.person,
    // Skjutsen står på tavlan, inte bara under Träning: det är den som avgör
    // vem som måste vara hemma när.
    ride: trainingRide(t) || undefined,
    k: 'tran',
    // Passet gäller barnet *och* den som kör: filtrerar Martin fram sig själv
    // ska lördagens Street feet stå kvar, för det är han som ska köra dit.
    p: trainingWho(t),
  }));
  const mat: DayItem[] = MEALS.filter((m) => m.day === d.name).map((m) => ({
    icon: '🍽',
    label: SLOT_LABEL[m.slot],
    meta: mealWho(m),
    k: 'mat',
    p: 'alla',
  }));
  // Dagens sysslor blir en enda rad. Karins tre dagliga blir annars tjugoen
  // rader på en vecka, och då ryms inte dagarna på en telefonskärm.
  const dagens = (PEOPLE.find((p) => p.name === filter)?.tasks ?? []).filter((t) => choreOnDay(t, d.name));
  const städ: DayItem[] = dagens.length === 0 ? [] : [{
    icon: '🧹',
    label: versal(dagens.map((t) => t.short ?? t.label.toLowerCase()).join(', ')),
    // Dagen står redan på kortet; bara klockslaget behöver upprepas.
    meta: dagens.find((t) => t.time)?.time ?? '',
    k: 'stad',
    p: filter as string,
  }];

  return [...skjuts, ...träning, ...mat, ...städ];
}

export type Slot = 'lunch' | 'middag';

export type Meal = {
  day: string;
  slot: Slot;
  /** Vem som har ansvaret. null = flexibelt, ingen är utsedd. */
  cook: string | null;
};

/** Ansvaret i klartext. */
export const mealWho = (m: Meal) => m.cook ?? 'Flexibelt';

export const SLOT_LABEL: Record<Slot, string> = { lunch: 'Lunch', middag: 'Middag' };

export const MEALS: Meal[] = [
  { day: 'mån', slot: 'middag', cook: 'Karin' },
  { day: 'tis', slot: 'lunch', cook: 'Karin' },
  { day: 'tis', slot: 'middag', cook: 'Karin' },
  { day: 'ons', slot: 'middag', cook: 'Martin' },
  { day: 'tor', slot: 'middag', cook: 'Martin' },
  { day: 'fre', slot: 'middag', cook: 'Martin' },
  { day: 'lör', slot: 'lunch', cook: 'Martin' },
  { day: 'lör', slot: 'middag', cook: 'Karin' },
  { day: 'sön', slot: 'lunch', cook: null },
  { day: 'sön', slot: 'middag', cook: null },
];

export type Chore = {
  label: string;
  /**
   * När sysslan görs: en veckodag ('mån'…'sön'), 'dagl' varje dag, 'helg' både
   * lördag och söndag, eller 'behov' — något man har ansvar för men som inte
   * hör till en viss dag.
   */
  day: 'dagl' | 'helg' | 'behov' | 'mån' | 'tis' | 'ons' | 'tor' | 'fre' | 'lör' | 'sön';
  time?: string;
  /** Kort form för veckobladets smala städkolumn, där sysslan står sju gånger. */
  short?: string;
};
export type Person = { name: string; role?: string; avatar: string; tasks: Chore[] };

export const PEOPLE: Person[] = [
  {
    name: 'Astrid', avatar: '/avatars/astrid.svg', tasks: [
      { label: 'Städa sitt rum', day: 'dagl', time: '18:45', short: 'rummet' },
    ],
  },
  {
    name: 'Signe', avatar: '/avatars/signe.svg', tasks: [
      { label: 'Städa sitt rum', day: 'dagl', time: '18:45', short: 'rummet' },
    ],
  },
  {
    name: 'Karin', role: 'Sambo', avatar: '/avatars/karin.svg', tasks: [
      { label: 'Plocka ur diskmaskinen', day: 'dagl', short: 'diskmaskin' },
      { label: 'Tömma kompost och skräp', day: 'dagl', short: 'kompost' },
      { label: 'Plocka undan leksaker i kök och vardagsrum', day: 'dagl', short: 'leksaker' },
      { label: 'Tvätta barnkläder', day: 'helg', short: 'barnkläder' },
      { label: 'Extra ansvar Signes rum', day: 'behov', short: 'Signes rum' },
    ],
  },
  {
    name: 'Martin', avatar: '/avatars/martin.svg', tasks: [
      { label: 'Hjälper Astrid och Signe med rummen', day: 'dagl', time: '18:45', short: 'hjälper rummen' },
      { label: 'Städa toaletterna', day: 'lör', short: 'toaletterna' },
      { label: 'Dammsuga tvättstugan och hallen', day: 'lör', short: 'dammsuga tvättstugan och hallen' },
      { label: 'Vita rummet', day: 'helg', short: 'vita rummet' },
      { label: 'Extra ansvar Astrids rum', day: 'behov', short: 'Astrids rum' },
    ],
  },
];

const CHORE_DAY: Partial<Record<Chore['day'], string>> = {
  dagl: 'varje dag',
  helg: 'helgen',
  behov: 'vid behov',
};

/** "varje dag 18:45" läser bättre på ett blad än "dagl". */
export const choreDay = (t: Chore) => (CHORE_DAY[t.day] ?? t.day) + (t.time ? ` ${t.time}` : '');

/** Gäller sysslan den här dagen? 'behov' hör inte till någon dag och räknas aldrig med. */
const choreOnDay = (t: Chore, dag: string) =>
  t.day === 'dagl' || t.day === dag || (t.day === 'helg' && (dag === 'lör' || dag === 'sön'));

/** En lämning eller hämtning: vem, och tiden när den är bestämd. */
export type Lift = { by?: string; time?: string };

export type TrainingColor = { border: string; tint: string; fg: string };
export const TC: Record<string, TrainingColor> = {
  ord: { border: '#fecdd3', tint: '#fff1f2', fg: '#be123c' },
  gram: { border: '#bfdbfe', tint: '#eff6ff', fg: '#1d4ed8' },
  warn: { border: '#fde68a', tint: '#fffbeb', fg: '#b45309' },
};

export type Training = {
  day: string;
  time: string;
  title: string;
  /** Kortare namn i veckobladets smala kolumn. */
  short?: string;
  place?: string;
  /** Barnet som tränar. */
  person: string;
  /** Lämning och hämtning. Utelämnat = behövs inte, tomt objekt = behövs men vem är inte bestämt. */
  dropoff?: Lift;
  pickup?: Lift;
  c: keyof typeof TC;
};

export const TRAININGS: Training[] = [
  { day: 'mån', time: '17:45', title: 'Gymnastik', place: 'Enahallen', person: 'Astrid', dropoff: { by: 'Karin', time: '17:45' }, pickup: { by: 'Karin', time: '19:00' }, c: 'ord' },
  { day: 'tis', time: '17:00', title: 'Gymnastik', place: 'Aktivitetscenter', person: 'Astrid', dropoff: { by: 'Karin', time: '17:00' }, pickup: { by: 'Karin', time: '18:15' }, c: 'ord' },
  { day: 'lör', time: '10:30', title: 'Street feet', person: 'Astrid', dropoff: { by: 'Martin' }, pickup: { by: 'Martin' }, c: 'gram' },
  { day: 'lör', time: '13:00', title: 'Street feet', person: 'Signe', dropoff: { by: 'Martin' }, pickup: { by: 'Martin' }, c: 'gram' },
];

/** Alla som berörs av passet: barnet som tränar och den som lämnar eller hämtar. */
export const trainingWho = (t: Training): string[] =>
  [...new Set([t.person, t.dropoff?.by, t.pickup?.by].filter(Boolean) as string[])];

/** Skjutsen till och från passet. */
export const trainingRide = (t: Training) => rideText(t.dropoff, t.pickup);

/**
 * Den dagliga skjutsen till och från skolan och förskolan — den som gäller varje
 * vardag, oavsett träningar. Helgen står tom: då kör ingen någon.
 */
export const RIDES: { day: string; dropoff: Lift; pickup: Lift }[] = [
  { day: 'mån', dropoff: { by: 'Karin' }, pickup: { by: 'Karin' } },
  { day: 'tis', dropoff: { by: 'Karin' }, pickup: { by: 'Karin' } },
  { day: 'ons', dropoff: { by: 'Karin' }, pickup: { by: 'Martin' } },
  { day: 'tor', dropoff: { by: 'Karin' }, pickup: { by: 'Martin' } },
  { day: 'fre', dropoff: { by: 'Karin' }, pickup: { by: 'Martin' } },
];

export const RIDE_LABEL = 'Lämna och hämta barn';
/** Kort märkning på tavlan och veckobladet, där hela rubriken inte får plats. */
export const RIDE_TAG = 'Barn';

/** Dagens skjuts som text, tom sträng när dagen inte har någon. */
export const dayRide = (dag: string) => {
  const r = RIDES.find((x) => x.day === dag);
  return r ? rideText(r.dropoff, r.pickup) : '';
};

/** Vilka som kör den dagen — så raden följer med när man filtrerar på sig själv. */
export const dayRideWho = (dag: string): string[] => {
  const r = RIDES.find((x) => x.day === dag);
  return r ? [...new Set([r.dropoff.by, r.pickup.by].filter(Boolean) as string[])] : [];
};

/**
 * Skjutsen i klartext, med eller utan tider: "Karin lämnar 17:45 och hämtar
 * 19:00", "Karin lämnar · Martin hämtar", "Lämning och hämtning" när det behövs
 * men ingen är utsedd. Tom sträng när ingen skjuts behövs.
 */
export function rideText(d?: Lift, p?: Lift): string {
  if (!d && !p) return '';

  // Samma person båda vägarna blir en mening: "Martin lämnar och hämtar".
  if (d && p && d.by && d.by === p.by) {
    const tider = [d.time && `lämnar ${d.time}`, p.time && `hämtar ${p.time}`].filter(Boolean);
    return tider.length ? `${d.by} ${tider.join(' och ')}` : `${d.by} lämnar och hämtar`;
  }

  const del = (r: Lift | undefined, med: string, utan: string) => {
    if (!r) return '';
    if (!r.by) return utan;
    return `${r.by} ${med}${r.time ? ` ${r.time}` : ''}`;
  };
  const lämning = del(d, 'lämnar', 'lämning');
  const hämtning = del(p, 'hämtar', 'hämtning');
  // Utan namn läser "Lämning och hämtning" bättre än "Lämning · hämtning".
  const utanNamn = !d?.by && !p?.by;
  const rad = [lämning, hämtning].filter(Boolean).join(utanNamn ? ' och ' : ' · ');
  return rad.charAt(0).toUpperCase() + rad.slice(1);
}

export type TabId = 'hem' | 'mat' | 'stad' | 'tran';
export const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'hem', icon: '🏡', label: 'Hem' },
  { id: 'mat', icon: '🍽', label: 'Mat' },
  { id: 'stad', icon: '🧹', label: 'Städ' },
  { id: 'tran', icon: '🤸', label: 'Träning' },
];

/** Utskriftsbladen: veckobladet först, det är kylskåpslappen. */
export type PrintKey = Kind | 'vecka';

export const PRINTS: { k: PrintKey; label: string; icon: string }[] = [
  { k: 'vecka', label: 'Veckobladet (allt på ett)', icon: '🗓' },
  { k: 'mat', label: 'Matschema', icon: '🍽' },
  { k: 'stad', label: 'Städschema per person', icon: '🧹' },
  { k: 'tran', label: 'Träningskalender', icon: '🤸' },
];

export const FAMILY_PARENTS = 'Martin & Karin';
export const FAMILY_KIDS = [...new Set(TRAININGS.map((t) => t.person))].join(' · ');

/** Sysslor som återkommer varje dag hamnar i veckobladets sidfot, inte i varje ruta. */
type ChoreGroup = { who: string; labels: string[] };

/** Slår ihop personer med identiska sysslor: "Astrid & Signe rummen". */
function slåIhop(grupper: ChoreGroup[]): ChoreGroup[] {
  const ihop: ChoreGroup[] = [];
  for (const g of grupper) {
    const lika = ihop.find((x) => x.labels.join('|') === g.labels.join('|'));
    if (lika) lika.who += ` & ${g.who}`;
    else ihop.push({ ...g });
  }
  return ihop;
}

/** En rad per dag: träningen, matansvaret och dagens sysslor. */
export function weekRows(now = new Date()) {
  return weekDays(now).map((d) => ({
    // Bara veckodagen: bladet ska gälla tills schemat ändras, inte till söndag.
    day: d.name,
    today: !!d.today,
    ride: dayRide(d.name),
    trainings: TRAININGS.filter((t) => t.day === d.name).map((t) => ({
      title: `${t.short ?? t.title} ${t.time}`,
      meta: t.place ? `${t.person} · ${t.place}` : t.person,
      ride: trainingRide(t),
    })),
    meals: MEALS.filter((m) => m.day === d.name),
    // Dagliga sysslor står på varje dag, inte bara en gång — så syns det att
    // Astrid och Signe städar sina rum alla dagar. Den som har exakt samma
    // sysslor slås ihop till en post ("Astrid & Signe rummet").
    chores: slåIhop(
      PEOPLE.map((p) => ({
        who: p.name,
        labels: p.tasks
          .filter((t) => choreOnDay(t, d.name))
          .map((t) => t.short ?? t.label.toLowerCase()),
      })).filter((g) => g.labels.length > 0),
    ),
  }));
}
