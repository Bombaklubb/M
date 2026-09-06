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

export type Member = {
  name: string;
  short: string;
  role: string;
  avatar: string;
  ring: string;
};

export const MEMBERS: Member[] = [
  { name: 'Martin', short: 'Martin', role: 'Köket i veckan', avatar: '/avatars/martin.svg', ring: '#bfdbfe' },
  { name: 'Karin', short: 'Karin', role: 'Sambo', avatar: '/avatars/karin.svg', ring: '#c7d7fe' },
  { name: 'Astrid', short: 'Astrid', role: '11 år', avatar: '/avatars/astrid.svg', ring: '#fecdd3' },
  { name: 'Signe', short: 'Signe', role: '8 år', avatar: '/avatars/signe.svg', ring: '#fde68a' },
  { name: 'Bodil', short: 'Bodil', role: '5 år', avatar: '/avatars/bodil.svg', ring: '#fecaca' },
];

export type DayItem = { icon: string; label: string; meta: string; k: Kind; p: string };
export type Day = { name: string; long: string; date: string; today?: boolean; items: DayItem[] };

export const DAYS: Day[] = [
  {
    name: 'mån', long: 'Måndag', date: '7/9', items: [
      { icon: '🤸', label: 'Gymnastik 17:00', meta: 'Astrid · Idrottshuset', k: 'tran', p: 'Astrid' },
      { icon: '🍽', label: 'Tacos', meta: 'Martin lagar · 18:30', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Sopsortering', meta: 'Signe', k: 'stad', p: 'Signe' },
    ],
  },
  {
    name: 'tis', long: 'Tisdag', date: '8/9', today: true, items: [
      { icon: '🤸', label: 'Street feet 17:30', meta: 'Signe · Kulturskolan', k: 'tran', p: 'Signe' },
      { icon: '🍽', label: 'Korv stroganoff', meta: 'Karin lagar · 18:45', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Dammsuga hallen', meta: 'Astrid', k: 'stad', p: 'Astrid' },
    ],
  },
  {
    name: 'ons', long: 'Onsdag', date: '9/9', items: [
      { icon: '📅', label: 'Föräldramöte 18:00', meta: 'Astrids klass · aulan', k: 'dat', p: 'Karin' },
      { icon: '🍽', label: 'Fisk & potatis', meta: 'Tidig middag 17:15', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Badrum', meta: 'Karin', k: 'stad', p: 'Karin' },
    ],
  },
  {
    name: 'tor', long: 'Torsdag', date: '10/9', items: [
      { icon: '🤸', label: 'Gymnastik 17:00', meta: 'Astrid · Karin skjutsar', k: 'tran', p: 'Astrid' },
      { icon: '🍽', label: 'Kycklinggryta', meta: 'Karin lagar · 18:30', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Dammsuga övervåningen', meta: 'Martin', k: 'stad', p: 'Martin' },
    ],
  },
  {
    name: 'fre', long: 'Fredag', date: '11/9', items: [
      { icon: '🍽', label: 'Fredagspizza', meta: 'Astrid & Signe kavlar · 18:00', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Vattna blommorna', meta: 'Bodil', k: 'stad', p: 'Bodil' },
      { icon: '📅', label: 'Lönedag', meta: 'Sätt över till sparkontot', k: 'dat', p: 'Martin' },
    ],
  },
  {
    name: 'lör', long: 'Lördag', date: '12/9', items: [
      { icon: '🤸', label: 'Simskola 09:00', meta: 'Bodil · Simhallen', k: 'tran', p: 'Bodil' },
      { icon: '🤸', label: 'Uppvisning 11:00', meta: 'Signe · Kulturhuset', k: 'tran', p: 'Signe' },
      { icon: '🧹', label: 'Storstädning 13:00', meta: 'Alla hjälper till', k: 'stad', p: 'alla' },
      { icon: '🍽', label: 'Pannkakor', meta: 'Lunch efteråt', k: 'mat', p: 'alla' },
    ],
  },
  {
    name: 'sön', long: 'Söndag', date: '13/9', items: [
      { icon: '📅', label: 'Farmor på besök 15:00', meta: 'Fika och middag', k: 'dat', p: 'alla' },
      { icon: '🍽', label: 'Söndagsstek', meta: '16:00', k: 'mat', p: 'alla' },
      { icon: '🧹', label: 'Plocka undan leksaker', meta: 'Bodil', k: 'stad', p: 'Bodil' },
    ],
  },
];

export type Meal = {
  day: string;
  sheetDay: string;
  date: string;
  dish: string;
  who: string;
  printNote?: string;
  emoji: string;
  ing: string[];
};

export const MEALS: Meal[] = [
  { day: 'mån', sheetDay: 'Mån 7', date: '7/9', dish: 'Tacos', who: 'Martin lagar · 18:30', emoji: '🌮', ing: ['Köttfärs 500 g', 'Tacoskal', 'Gurka, paprika', 'Créme fraiche'] },
  { day: 'tis', sheetDay: 'Tis 8', date: '8/9', dish: 'Korv stroganoff', who: 'Karin lagar · 18:45', printNote: 'Karin lagar · 18:45, efter Street feet', emoji: '🍚', ing: ['Falukorv', 'Tomatpuré', 'Grädde', 'Ris'] },
  { day: 'ons', sheetDay: 'Ons 9', date: '9/9', dish: 'Fisk, potatis & ärtor', who: 'Tidig middag 17:15', printNote: 'Tidig middag 17:15 · föräldramöte 18:00', emoji: '🐟', ing: ['Laxfilé 4 bitar', 'Potatis', 'Ärtor', 'Dill'] },
  { day: 'tor', sheetDay: 'Tor 10', date: '10/9', dish: 'Kycklinggryta', who: 'Karin lagar · 18:30', printNote: 'Karin lagar · 18:30, efter gymnastiken', emoji: '🍗', ing: ['Kycklingfilé', 'Kokosmjölk', 'Curry', 'Ris'] },
  { day: 'fre', sheetDay: 'Fre 11', date: '11/9', dish: 'Fredagspizza', who: 'Astrid & Signe kavlar · 18:00', emoji: '🍕', ing: ['Pizzadeg', 'Krossade tomater', 'Mozzarella', 'Skinka'] },
  { day: 'lör', sheetDay: 'Lör 12', date: '12/9', dish: 'Pannkakor', who: 'Lunch efter uppvisningen', emoji: '🥞', ing: ['Mjöl', 'Mjölk', 'Ägg', 'Sylt'] },
  { day: 'sön', sheetDay: 'Sön 13', date: '13/9', dish: 'Söndagsstek', who: 'Farmor äter med oss · 16:00', emoji: '🥩', ing: ['Högrev 1,2 kg', 'Rotfrukter', 'Grädde', 'Lingonsylt'] },
];

export const BUYS = ['Köttfärs', 'Falukorv', 'Laxfilé', 'Kycklingfilé', 'Pizzadeg', 'Grädde', 'Sirap', 'Potatis', 'Ris'];

export type Chore = { label: string; day: string; d: number };
export type Person = { name: string; role: string; avatar: string; ring: string; tasks: Chore[] };

export const PEOPLE: Person[] = [
  {
    name: 'Astrid', role: '11 år', avatar: '/avatars/astrid.svg', ring: '#fecdd3', tasks: [
      { label: 'Dammsuga hallen', day: 'tis', d: 1 },
      { label: 'Duka och duka av', day: 'mån', d: 0 },
      { label: 'Duka av', day: 'tor', d: 3 },
    ],
  },
  {
    name: 'Signe', role: '8 år', avatar: '/avatars/signe.svg', ring: '#fde68a', tasks: [
      { label: 'Sopsortering', day: 'mån', d: 0 },
      { label: 'Duka fram frukost', day: 'ons', d: 2 },
    ],
  },
  {
    name: 'Bodil', role: '5 år', avatar: '/avatars/bodil.svg', ring: '#fecaca', tasks: [
      { label: 'Vattna blommorna', day: 'fre', d: 4 },
      { label: 'Plocka undan leksaker', day: 'sön', d: 6 },
    ],
  },
  {
    name: 'Karin', role: 'Sambo', avatar: '/avatars/karin.svg', ring: '#c7d7fe', tasks: [
      { label: 'Badrum', day: 'ons', d: 2 },
      { label: 'Tvätt', day: 'tor', d: 3 },
    ],
  },
  {
    name: 'Martin', role: 'Köket i veckan', avatar: '/avatars/martin.svg', ring: '#bfdbfe', tasks: [
      { label: 'Köket + diskmaskin', day: 'dagl', d: 0 },
      { label: 'Dammsuga övervåningen', day: 'tor', d: 3 },
    ],
  },
];

export const CHORE_FOOTER = 'Storstädning tillsammans lördag 13:00';

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
  p.tasks.filter((t) => t.day === 'dagl').map((t) => `${p.name} ${t.label.toLowerCase()}`),
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
    meal: MEALS.find((m) => m.day === d.name) ?? null,
    chores: PEOPLE.flatMap((p) =>
      p.tasks.filter((t) => t.day === d.name).map((t) => ({ who: p.name, label: t.label })),
    ),
  }));
}
