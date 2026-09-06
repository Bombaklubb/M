export type Kind = 'mat' | 'stad' | 'tran' | 'dat';

export const TINT: Record<Kind, string> = {
  mat: '#fef3c7',
  stad: '#dbeafe',
  tran: '#ffe4e6',
  dat: '#e0e8ff',
};

export const WEEK_LABEL = 'Vecka 37 · 7–13 sep';
export const WEEK_LONG = 'Vecka 37 · 7–13 september';
export const MONTH_LABEL = 'September 2026';

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

export type Member = {
  name: string;
  short: string;
  role: string;
  avatar: string;
};

export const MEMBERS: Member[] = [
  { name: 'Martin', short: 'Martin', role: 'Köket i veckan', avatar: '/avatars/martin.svg' },
  { name: 'Karin', short: 'Karin', role: 'Sambo', avatar: '/avatars/karin.svg' },
  { name: 'Astrid', short: 'Astrid', role: '11 år', avatar: '/avatars/astrid.svg' },
  { name: 'Signe', short: 'Signe', role: '8 år', avatar: '/avatars/signe.svg' },
  { name: 'Bodil', short: 'Bodil', role: '1 år', avatar: '/avatars/bodil.svg' },
];

/** p = vem raden gäller: ett namn, flera namn eller 'alla'. */
export type DayItem = { icon: string; label: string; meta: string; k: Kind; p: string | string[] };

/** Filtret i toppen: visa raden när ingen är vald, när den gäller alla eller den valda. */
export const forPerson = (p: DayItem['p'], filter: string | null) =>
  !filter || p === 'alla' || (Array.isArray(p) ? p.includes(filter) : p === filter);
export type Day = { name: string; long: string; date: string; today?: boolean };

export const DAYS: Day[] = [
  { name: 'mån', long: 'Måndag', date: '7/9' },
  { name: 'tis', long: 'Tisdag', date: '8/9', today: true },
  { name: 'ons', long: 'Onsdag', date: '9/9' },
  { name: 'tor', long: 'Torsdag', date: '10/9' },
  { name: 'fre', long: 'Fredag', date: '11/9' },
  { name: 'lör', long: 'Lördag', date: '12/9' },
  { name: 'sön', long: 'Söndag', date: '13/9' },
];

/**
 * Dagens rader byggs av träningarna och matansvaret — samma källa som flikarna
 * och utskriften, så tavlan aldrig kan säga något annat än schemat.
 */
export function dayItems(d: Day): DayItem[] {
  const träning: DayItem[] = TRAININGS.filter((t) => t.day === d.name).map((t) => ({
    icon: '🤸',
    label: `${t.short ?? t.title} ${t.time}`,
    meta: t.place ? `${t.person} · ${t.place}` : t.person,
    k: 'tran',
    p: t.person,
  }));
  const mat: DayItem[] = MEALS.filter((m) => m.day === d.name).map((m) => ({
    icon: '🍽',
    label: SLOT_LABEL[m.slot],
    meta: mealWho(m),
    k: 'mat',
    p: 'alla',
  }));
  return [...träning, ...mat];
}

export type Slot = 'lunch' | 'middag';

export type Meal = {
  day: string;
  sheetDay: string;
  slot: Slot;
  /** Vem som har ansvaret. null = flexibelt, ingen är utsedd. */
  cook: string | null;
};

/** Ansvaret i klartext. */
export const mealWho = (m: Meal) => m.cook ?? 'Flexibelt';

export const SLOT_LABEL: Record<Slot, string> = { lunch: 'Lunch', middag: 'Middag' };

export const MEALS: Meal[] = [
  { day: 'mån', sheetDay: 'Mån 7', slot: 'middag', cook: 'Martin' },
  { day: 'tis', sheetDay: 'Tis 8', slot: 'middag', cook: 'Karin' },
  { day: 'ons', sheetDay: 'Ons 9', slot: 'middag', cook: 'Martin' },
  { day: 'tor', sheetDay: 'Tor 10', slot: 'middag', cook: 'Martin' },
  { day: 'fre', sheetDay: 'Fre 11', slot: 'middag', cook: 'Martin' },
  { day: 'lör', sheetDay: 'Lör 12', slot: 'lunch', cook: 'Martin' },
  { day: 'lör', sheetDay: 'Lör 12', slot: 'middag', cook: 'Karin' },
  { day: 'sön', sheetDay: 'Sön 13', slot: 'lunch', cook: null },
  { day: 'sön', sheetDay: 'Sön 13', slot: 'middag', cook: null },
];

export type Chore = { label: string; day: string; d: number; time?: string };
export type Person = { name: string; role: string; avatar: string; tasks: Chore[] };

export const PEOPLE: Person[] = [
  {
    name: 'Astrid', role: '11 år', avatar: '/avatars/astrid.svg', tasks: [
      { label: 'Städa sitt rum', day: 'dagl', d: 0, time: '18:45' },
    ],
  },
  {
    name: 'Signe', role: '8 år', avatar: '/avatars/signe.svg', tasks: [
      { label: 'Städa sitt rum', day: 'dagl', d: 0, time: '18:45' },
    ],
  },
  {
    name: 'Karin', role: 'Sambo', avatar: '/avatars/karin.svg', tasks: [
      { label: 'Plocka ur diskmaskinen', day: 'dagl', d: 0 },
      { label: 'Tömma kompost och skräp', day: 'dagl', d: 0 },
    ],
  },
  {
    name: 'Martin', role: 'Köket i veckan', avatar: '/avatars/martin.svg', tasks: [
      { label: 'Hjälper Astrid och Signe med rummen', day: 'dagl', d: 0, time: '18:45' },
      { label: 'Städa toaletterna', day: 'lör', d: 5 },
    ],
  },
];

/** "varje dag 18:45" läser bättre på ett blad än "dagl". */
export const choreDay = (t: Chore) => (t.day === 'dagl' ? 'varje dag' : t.day) + (t.time ? ` ${t.time}` : '');

export type TrainingColor = { border: string; tint: string; fg: string };
export const TC: Record<string, TrainingColor> = {
  ord: { border: '#fecdd3', tint: '#fff1f2', fg: '#be123c' },
  gram: { border: '#bfdbfe', tint: '#eff6ff', fg: '#1d4ed8' },
  warn: { border: '#fde68a', tint: '#fffbeb', fg: '#b45309' },
};

export type Training = {
  day: string;
  sheetDay: string;
  time: string;
  title: string;
  /** Kortare namn i veckobladets smala kolumn. */
  short?: string;
  place?: string;
  /** Barnet som tränar. */
  person: string;
  /** Samma person skjutsar och hämtar. Tom tills familjen bestämt vem. */
  driver?: string;
  c: keyof typeof TC;
};

export const TRAININGS: Training[] = [
  { day: 'mån', sheetDay: 'Mån 7', time: '17:45', title: 'Gymnastik', place: 'Enahallen', person: 'Astrid', c: 'ord' },
  { day: 'tis', sheetDay: 'Tis 8', time: '17:00', title: 'Gymnastik', place: 'Aktivitetscenter', person: 'Astrid', c: 'ord' },
  { day: 'lör', sheetDay: 'Lör 12', time: '10:30', title: 'Street feet', person: 'Astrid', c: 'gram' },
  { day: 'lör', sheetDay: 'Lör 12', time: '13:00', title: 'Street feet', person: 'Signe', c: 'gram' },
];

/** "Martin skjutsar och hämtar" — samma person båda vägarna. */
export const trainingDriver = (t: Training) => (t.driver ? `${t.driver} skjutsar och hämtar` : '');

export type ImportantDate = { num: string; mon: string; title: string; meta: string };

export const DATES: ImportantDate[] = [];

/** Månadsrutnätet markerar de dagar familjen faktiskt tränar. */
export const CAL_MARK: Record<number, string> = Object.fromEntries(
  DAYS.filter((d) => TRAININGS.some((t) => t.day === d.name)).map((d) => [Number(d.date.split('/')[0]), '🤸']),
);

export type TabId = 'hem' | 'mat' | 'stad' | 'tran' | 'dat';
export const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'hem', icon: '🏡', label: 'Hem' },
  { id: 'mat', icon: '🍽', label: 'Mat' },
  { id: 'stad', icon: '🧹', label: 'Städ' },
  { id: 'tran', icon: '🤸', label: 'Träning' },
  { id: 'dat', icon: '📅', label: 'Datum' },
];

/** Utskriftsbladen: veckobladet först, det är kylskåpslappen. */
export type PrintKey = Kind | 'vecka';

export const PRINTS: { k: PrintKey; label: string; icon: string }[] = [
  { k: 'vecka', label: 'Veckobladet (allt på ett)', icon: '🗓' },
  { k: 'mat', label: 'Matschema', icon: '🍽' },
  { k: 'stad', label: 'Städschema per person', icon: '🧹' },
  { k: 'tran', label: 'Träningskalender', icon: '🤸' },
  { k: 'dat', label: 'Viktiga datum, månad', icon: '📅' },
];

export const FAMILY_PARENTS = 'Martin & Karin';
export const FAMILY_KIDS = [...new Set(TRAININGS.map((t) => t.person))].join(' · ');

/** Sysslor som återkommer varje dag hamnar i veckobladets sidfot, inte i varje ruta. */
/** En rad per dag: träningen och vem som har matansvaret. */
export function weekRows() {
  return DAYS.map((d) => ({
    day: `${d.name} ${d.date.split('/')[0]}`,
    today: !!d.today,
    trainings: TRAININGS.filter((t) => t.day === d.name).map((t) => ({
      title: `${t.short ?? t.title} ${t.time}`,
      meta: t.place ? `${t.person} · ${t.place}` : t.person,
    })),
    meals: MEALS.filter((m) => m.day === d.name),
  }));
}
