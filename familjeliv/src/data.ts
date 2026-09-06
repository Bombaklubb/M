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
  { name: 'Bodil', short: 'Bodil', role: '5 år', avatar: '/avatars/bodil.svg' },
];

/** p = vem raden gäller: ett namn, flera namn eller 'alla'. */
export type DayItem = { icon: string; label: string; meta: string; k: Kind; p: string | string[] };

/** Filtret i toppen: visa raden när ingen är vald, när den gäller alla eller den valda. */
export const forPerson = (p: DayItem['p'], filter: string | null) =>
  !filter || p === 'alla' || (Array.isArray(p) ? p.includes(filter) : p === filter);
export type Day = { name: string; long: string; date: string; today?: boolean; items: DayItem[] };

export const DAYS: Day[] = [
  {
    name: 'mån', long: 'Måndag', date: '7/9', items: [
      { icon: '🤸', label: 'Gymnastik 17:00', meta: 'Astrid · Martin skjutsar', k: 'tran', p: 'Astrid' },
      { icon: '🍽', label: 'Tacos', meta: 'Martin lagar · 18:30', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Städa rummen 18:45', meta: 'Astrid & Signe', k: 'stad', p: ['Astrid', 'Signe'] },
      { icon: '🧹', label: 'Diskmaskin, kompost & skräp', meta: 'Karin', k: 'stad', p: 'Karin' },
    ],
  },
  {
    name: 'tis', long: 'Tisdag', date: '8/9', today: true, items: [
      { icon: '🤸', label: 'Street feet 17:30', meta: 'Signe · Karin skjutsar', k: 'tran', p: 'Signe' },
      { icon: '🍽', label: 'Korv stroganoff', meta: 'Karin lagar · 18:45', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Städa rummen 18:45', meta: 'Astrid & Signe', k: 'stad', p: ['Astrid', 'Signe'] },
      { icon: '🧹', label: 'Diskmaskin, kompost & skräp', meta: 'Karin', k: 'stad', p: 'Karin' },
    ],
  },
  {
    name: 'ons', long: 'Onsdag', date: '9/9', items: [
      { icon: '🍽', label: 'Fisk & potatis', meta: 'Martin lagar · 17:15', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Städa rummen 18:45', meta: 'Astrid & Signe', k: 'stad', p: ['Astrid', 'Signe'] },
      { icon: '🧹', label: 'Diskmaskin, kompost & skräp', meta: 'Karin', k: 'stad', p: 'Karin' },
      { icon: '📅', label: 'Föräldramöte 18:00', meta: 'Astrids klass · aulan', k: 'dat', p: 'Karin' },
    ],
  },
  {
    name: 'tor', long: 'Torsdag', date: '10/9', items: [
      { icon: '🤸', label: 'Gymnastik 17:00', meta: 'Astrid · Karin skjutsar', k: 'tran', p: 'Astrid' },
      { icon: '🍽', label: 'Kycklinggryta', meta: 'Martin lagar · 18:30', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Städa rummen 18:45', meta: 'Astrid & Signe', k: 'stad', p: ['Astrid', 'Signe'] },
      { icon: '🧹', label: 'Diskmaskin, kompost & skräp', meta: 'Karin', k: 'stad', p: 'Karin' },
    ],
  },
  {
    name: 'fre', long: 'Fredag', date: '11/9', items: [
      { icon: '🍽', label: 'Fredagspizza', meta: 'Martin lagar · 18:00', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Städa rummen 18:45', meta: 'Astrid & Signe', k: 'stad', p: ['Astrid', 'Signe'] },
      { icon: '🧹', label: 'Diskmaskin, kompost & skräp', meta: 'Karin', k: 'stad', p: 'Karin' },
      { icon: '📅', label: 'Lönedag', meta: 'Sätt över till sparkontot', k: 'dat', p: 'Martin' },
    ],
  },
  {
    name: 'lör', long: 'Lördag', date: '12/9', items: [
      { icon: '🤸', label: 'Simskola 09:00', meta: 'Bodil · Martin följer med', k: 'tran', p: 'Bodil' },
      { icon: '🤸', label: 'Uppvisning 11:00', meta: 'Signe · hela familjen kommer', k: 'tran', p: 'Signe' },
      { icon: '🍽', label: 'Pannkakor (lunch)', meta: 'Martin lagar · 12:30', k: 'mat', p: 'alla' },
      { icon: '🍽', label: 'Soppa & mackor', meta: 'Karin lagar · 18:00', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Städa toaletterna', meta: 'Martin', k: 'stad', p: 'Martin' },
      { icon: '🧹', label: 'Städa rummen 18:45', meta: 'Astrid & Signe', k: 'stad', p: ['Astrid', 'Signe'] },
      { icon: '🧹', label: 'Diskmaskin, kompost & skräp', meta: 'Karin', k: 'stad', p: 'Karin' },
    ],
  },
  {
    name: 'sön', long: 'Söndag', date: '13/9', items: [
      { icon: '🍽', label: 'Mackor och frukt (lunch)', meta: 'Flexibelt · 12:30', k: 'mat', p: 'alla' },
      { icon: '🍽', label: 'Söndagsstek', meta: 'Martin lagar · 16:00', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Städa rummen 18:45', meta: 'Astrid & Signe', k: 'stad', p: ['Astrid', 'Signe'] },
      { icon: '🧹', label: 'Diskmaskin, kompost & skräp', meta: 'Karin', k: 'stad', p: 'Karin' },
      { icon: '📅', label: 'Farmor på besök 15:00', meta: 'Fika och middag', k: 'dat', p: 'alla' },
    ],
  },
];

export type Slot = 'lunch' | 'middag';

export type Meal = {
  day: string;
  sheetDay: string;
  date: string;
  slot: Slot;
  dish: string;
  /** Matansvaret: middagen mån–fre, både lunch och middag lör–sön. null = flexibelt. */
  cook: string | null;
  when: string;
  /** Extra som bara syns på utskriften, t.ex. varför middagen är tidig. */
  note?: string;
  emoji: string;
};

/** "Martin lagar · 18:30" — ansvaret i klartext, "Flexibelt" när ingen är utsedd. */
export const mealWho = (m: Meal) => (m.cook ? `${m.cook} lagar · ${m.when}` : `Flexibelt · ${m.when}`);

export const SLOT_LABEL: Record<Slot, string> = { lunch: 'Lunch', middag: 'Middag' };

export const MEALS: Meal[] = [
  { day: 'mån', sheetDay: 'Mån 7', date: '7/9', slot: 'middag', dish: 'Tacos', cook: 'Martin', when: '18:30', emoji: '🌮' },
  { day: 'tis', sheetDay: 'Tis 8', date: '8/9', slot: 'middag', dish: 'Korv stroganoff', cook: 'Karin', when: '18:45', note: 'efter Street feet', emoji: '🍚' },
  { day: 'ons', sheetDay: 'Ons 9', date: '9/9', slot: 'middag', dish: 'Fisk, potatis & ärtor', cook: 'Martin', when: '17:15', note: 'tidig middag, Karin på föräldramöte 18:00', emoji: '🐟' },
  { day: 'tor', sheetDay: 'Tor 10', date: '10/9', slot: 'middag', dish: 'Kycklinggryta', cook: 'Martin', when: '18:30', note: 'efter gymnastiken', emoji: '🍗' },
  { day: 'fre', sheetDay: 'Fre 11', date: '11/9', slot: 'middag', dish: 'Fredagspizza', cook: 'Martin', when: '18:00', emoji: '🍕' },
  { day: 'lör', sheetDay: 'Lör 12', date: '12/9', slot: 'lunch', dish: 'Pannkakor', cook: 'Martin', when: '12:30', note: 'efter uppvisningen', emoji: '🥞' },
  { day: 'lör', sheetDay: 'Lör 12', date: '12/9', slot: 'middag', dish: 'Soppa & mackor', cook: 'Karin', when: '18:00', emoji: '🥣' },
  { day: 'sön', sheetDay: 'Sön 13', date: '13/9', slot: 'lunch', dish: 'Mackor och frukt', cook: null, when: '12:30', note: 'flexibelt – den som är hemma fixar', emoji: '🥪' },
  { day: 'sön', sheetDay: 'Sön 13', date: '13/9', slot: 'middag', dish: 'Söndagsstek', cook: 'Martin', when: '16:00', note: 'farmor äter med oss', emoji: '🥩' },
];

export const BUYS = ['Köttfärs', 'Falukorv', 'Laxfilé', 'Kycklingfilé', 'Pizzadeg', 'Grädde', 'Sirap', 'Potatis', 'Ris', 'Bröd', 'Frukt'];

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
      { label: 'Städa toaletterna', day: 'lör', d: 5 },
    ],
  },
];

/**
 * Nyckeln för avbockning följer sysslan, inte dess plats i listan — annars
 * ärver en ny syssla bocken från den som stod på samma rad förut.
 */
export const choreKey = (name: string, t: Chore) => `${name}-${t.label}`;

/** "varje dag 18:45" läser bättre på ett blad än "dagl". */
export const choreDay = (t: Chore) => (t.day === 'dagl' ? 'varje dag' : t.day) + (t.time ? ` ${t.time}` : '');

export const CHORE_FOOTER = 'Sysslor märkta varje dag gäller alla veckans dagar';

export type TrainingColor = { border: string; tint: string; fg: string };
export const TC: Record<string, TrainingColor> = {
  ord: { border: '#fecdd3', tint: '#fff1f2', fg: '#be123c' },
  gram: { border: '#bfdbfe', tint: '#eff6ff', fg: '#1d4ed8' },
  warn: { border: '#fde68a', tint: '#fffbeb', fg: '#b45309' },
};

export type Detail = { icon: string; label: string; meta: string; k: Kind };
export type Training = {
  day: string;
  sheetDay: string;
  time: string;
  title: string;
  /** Kortare namn när plats saknas, som i veckobladets smala kolumn. */
  short?: string;
  place: string;
  who: string;
  c: keyof typeof TC;
  det: Detail[];
  sheet: { title: string; meta: string };
};

export const TRAININGS: Training[] = [
  {
    day: 'mån', sheetDay: 'Mån 7', time: '17:00', title: 'Gymnastik', place: 'Idrottshuset, sal B',
    who: 'Astrid · Martin skjutsar', c: 'ord',
    det: [
      { icon: '⏱', label: '17:00–18:15', meta: 'Var på plats 10 min innan', k: 'tran' },
      { icon: '🎒', label: 'Ta med', meta: 'Vattenflaska, gymnastikdress', k: 'stad' },
      { icon: '🚗', label: 'Martin skjutsar', meta: 'Karin hämtar 18:15', k: 'mat' },
    ],
    sheet: { title: 'Gymnastik 17:00–18:15', meta: 'Astrid · Idrottshuset sal B · Martin skjutsar · ta med vattenflaska' },
  },
  {
    day: 'tis', sheetDay: 'Tis 8', time: '17:30', title: 'Street feet (dans)', short: 'Street feet', place: 'Kulturskolan, sal 2',
    who: 'Signe · Karin skjutsar', c: 'gram',
    det: [
      { icon: '⏱', label: '17:30–18:30', meta: 'Terminen slutar 12 dec', k: 'tran' },
      { icon: '🎒', label: 'Ta med', meta: 'Inneskor, vattenflaska', k: 'stad' },
      { icon: '🚗', label: 'Karin skjutsar', meta: 'Martin hämtar', k: 'mat' },
    ],
    sheet: { title: 'Street feet, dans 17:30–18:30', meta: 'Signe · Kulturskolan sal 2 · Karin skjutsar · inneskor' },
  },
  {
    day: 'tor', sheetDay: 'Tor 10', time: '17:00', title: 'Gymnastik', place: 'Idrottshuset, sal B',
    who: 'Astrid · Karin skjutsar', c: 'ord',
    det: [
      { icon: '⏱', label: '17:00–18:15', meta: 'Middag 18:30 hemma', k: 'tran' },
      { icon: '🎒', label: 'Ta med', meta: 'Vattenflaska, gymnastikdress', k: 'stad' },
    ],
    sheet: { title: 'Gymnastik 17:00–18:15', meta: 'Astrid · Idrottshuset sal B · Karin skjutsar' },
  },
  {
    day: 'lör', sheetDay: 'Lör 12', time: '09:00', title: 'Simskola', place: 'Simhallen, lilla bassängen',
    who: 'Bodil · Martin följer med', c: 'warn',
    det: [
      { icon: '⏱', label: '09:00–09:45', meta: 'Ombyte från 08:40', k: 'tran' },
      { icon: '🎒', label: 'Ta med', meta: 'Badkläder, handduk, badring', k: 'stad' },
    ],
    sheet: { title: 'Simskola 09:00–09:45', meta: 'Bodil · Simhallen · Martin följer med i vattnet' },
  },
  {
    day: 'lör', sheetDay: 'Lör 12', time: '11:00', title: 'Uppvisning Street feet', short: 'Uppvisning', place: 'Kulturhuset, stora scenen',
    who: 'Signe · hela familjen kommer', c: 'gram',
    det: [
      { icon: '⏱', label: '11:00, på plats 10:30', meta: 'Ca 40 min', k: 'tran' },
      { icon: '👕', label: 'Svart tröja + leggings', meta: 'Håret i tofs', k: 'stad' },
      { icon: '🥞', label: 'Pannkakor efteråt', meta: 'Lunch hemma', k: 'mat' },
    ],
    sheet: { title: 'Uppvisning Street feet 11:00', meta: 'Signe · Kulturhuset stora scenen · alla kommer · på plats 10:30' },
  },
];

export const TRAINING_FOOTER = 'Avanmälan: ring ledaren senast kl 15 samma dag';

export type ImportantDate = { num: string; mon: string; title: string; meta: string };

export const DATES: ImportantDate[] = [
  { num: '09', mon: 'sep', title: 'Föräldramöte, Astrids klass', meta: '18:00 · aulan' },
  { num: '12', mon: 'sep', title: 'Uppvisning Street feet', meta: '11:00 · Kulturhuset' },
  { num: '25', mon: 'sep', title: 'Bodil fyller 6 år', meta: 'Kalas lördagen efter' },
  { num: '30', mon: 'sep', title: 'Utvecklingssamtal Astrid', meta: '15:20 · boka ledigt' },
  { num: '26', mon: 'okt', title: 'Höstlov, vecka 44', meta: 'Planera dagarna i god tid' },
];

export const CAL_MARK: Record<number, string> = { 7: '🤸', 8: '🤸', 9: '📅', 10: '🤸', 12: '🤸', 13: '📅', 25: '🎂', 30: '📅' };

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
export const FAMILY_KIDS = 'Astrid · Signe · Bodil';

/** Sysslor som återkommer varje dag hamnar i veckobladets sidfot, inte i varje ruta. */
export const DAILY_CHORES = PEOPLE.flatMap((p) =>
  p.tasks
    .filter((t) => t.day === 'dagl')
    .map((t) => `${p.name} ${t.label.toLowerCase()}${t.time ? ` ${t.time}` : ''}`),
);

/** En rad per dag: träning, middag och vem som gör vad — grunden för veckobladet. */
export function weekRows() {
  return DAYS.map((d) => ({
    day: `${d.name} ${d.date.split('/')[0]}`,
    today: !!d.today,
    trainings: TRAININGS.filter((t) => t.day === d.name).map((t) => ({
      title: `${t.short ?? t.title} ${t.time}`,
      meta: t.who,
    })),
    meals: MEALS.filter((m) => m.day === d.name),
    chores: PEOPLE.flatMap((p) =>
      p.tasks.filter((t) => t.day === d.name).map((t) => ({ who: p.name, label: t.label })),
    ),
  }));
}
