import { WorldId } from './worlds';

// ─── Problemlösning & rika matematiska problem ──────────────────────────────────
// Ett rikt problem har LÅG TRÖSKEL och HÖGT TAK: samma problemsituation utforskas
// på tre nivåer (E, C, A). Uppgifterna är ÖPPNA – de flesta har många korrekta
// svar, och på högre nivåer handlar de om att undersöka, hitta alla lösningar,
// generalisera och förklara. Det är resonemanget som är målet, inte ett facit.
//
// Tre sorters deluppgifter:
//   'open'    – många korrekta svar; ett villkor (validate) avgör om svaret duger
//   'collect' – hitta flera/alla lösningar; antingen en färdig lista (targets)
//               eller ett villkor + hur många som krävs (validate + need)
//   'reflect' – förklara/resonera i fritext; ingen rättning, men en diskussionstext
//               ("Så här kan man tänka") visas efteråt att jämföra med

export type ProblemLevel = 'E' | 'C' | 'A';

export const LEVEL_META: Record<ProblemLevel, { label: string; desc: string; color: string; points: number }> = {
  E: { label: 'E', desc: 'Utforska',    color: '#10b981', points: 20 },
  C: { label: 'C', desc: 'Undersöka',   color: '#f59e0b', points: 35 },
  A: { label: 'A', desc: 'Generalisera', color: '#ef4444', points: 55 },
};

export type SubTaskKind = 'open' | 'collect' | 'reflect';

export interface SubTask {
  id: string;
  kind: SubTaskKind;
  /** Frågan/uppmaningen till eleven. */
  prompt: string;
  placeholder?: string;
  /** open/collect: villkor som avgör om ett svar är korrekt. */
  validate?: (answer: string) => boolean;
  /** collect: färdig lista med alla korrekta svar (eleven ska hitta dem). */
  targets?: string[];
  /** collect med validate: hur många olika korrekta svar som krävs. */
  need?: number;
  /** Ledtråd som eleven kan ta fram. */
  hint?: string;
  /** Visas efter att deluppgiften är klar – lösning, resonemang eller facit. */
  discussion: string;
}

export interface LevelTask {
  level: ProblemLevel;
  /** Kort rubrik för vad nivån går ut på. */
  intro: string;
  subTasks: SubTask[];
}

export interface RichProblem {
  id: string;
  worldId: WorldId;
  title: string;
  emoji: string;
  /** Själva problemsituationen – texten eleven läser först. */
  context: string;
  topicIds: string[];
  tags: string[];
  levels: LevelTask[];
}

// ─── Hjälpare för villkor ───────────────────────────────────────────────────────

/** Plockar ut alla tal ur ett fritextsvar. "5 och 7" → [5, 7] */
export function nums(s: string): number[] {
  const m = s.replace(/,(\d)/g, '.$1').match(/-?\d+(?:\.\d+)?/g);
  return m ? m.map(Number) : [];
}

/** Ett enda tal ur svaret (NaN om inget/flera otydliga). */
export function oneNum(s: string): number {
  const n = nums(s);
  return n.length >= 1 ? n[0] : NaN;
}

/**
 * Kommatecken är tvetydigt i svenska svar: "5,7" kan betyda decimaltalet 5,7
 * ELLER talen 5 och 7. Vi provar därför båda tolkningarna och godkänner svaret
 * om någon av dem uppfyller villkoret.
 */
export function numVariants(s: string): number[][] {
  const asDecimal = nums(s);
  const asList = nums(s.replace(/,/g, ' '));
  const same = asDecimal.length === asList.length && asDecimal.every((v, i) => v === asList[i]);
  return same ? [asDecimal] : [asDecimal, asList];
}

/** Sant om villkoret gäller för någon tolkning av talen i svaret. */
export function someNums(s: string, fn: (n: number[]) => boolean): boolean {
  return numVariants(s).some(fn);
}

/** Normaliserar svar för jämförelse mot targets. */
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
}

/** Rektangel med heltalssidor och given omkrets, angiven som "5 och 7". */
function rectWithPerimeter(p: number) {
  return (s: string) => someNums(s, (n) => {
    if (n.length < 2) return false;
    const [a, b] = n;
    return Number.isInteger(a) && Number.isInteger(b) && a > 0 && b > 0 && 2 * (a + b) === p;
  });
}

/** Tal som uppfyller ett villkor. */
function numWhere(f: (n: number) => boolean) {
  return (s: string) => {
    const n = oneNum(s);
    return !isNaN(n) && f(n);
  };
}

/** Bygger listan av tal i ett intervall som uppfyller ett villkor. */
function rangeWhere(lo: number, hi: number, f: (n: number) => boolean): string[] {
  const out: string[] = [];
  for (let i = lo; i <= hi; i++) if (f(i)) out.push(String(i));
  return out;
}

export const RICH_PROBLEMS: RichProblem[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // DINOSAURIE VÄRLDEN (Nivå 1–3)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-dino-tiokamrater',
    worldId: 'dino',
    title: 'Ägg i två bon',
    emoji: '🥚',
    context: 'Dino har 10 ägg och lägger dem i två bon – ett stort och ett litet. Båda bona ska få minst 1 ägg.',
    topicIds: ['tio-kamraterna', 'addition-bas', 'problemlosning-lag'],
    tags: ['Tiokamrater', 'Hitta alla'],
    levels: [
      {
        level: 'E',
        intro: 'Utforska hur äggen kan delas.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett exempel på hur Dino kan dela äggen. Skriv två tal som tillsammans blir 10, t.ex. "3 och 7".',
            placeholder: 't.ex. 3 och 7',
            validate: (s) => someNums(s, (n) =>
              n.length >= 2 && n[0] >= 1 && n[1] >= 1 && n[0] + n[1] === 10),
            hint: 'Talen ska bli 10 tillsammans. Prova 4 och …?',
            discussion: 'Alla par som blir 10 fungerar: 1+9, 2+8, 3+7, 4+6, 5+5, 6+4, 7+3, 8+2 och 9+1. Det finns alltså många rätta svar!',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge ett ANNAT exempel än det du redan skrivit.',
            placeholder: 't.ex. 6 och 4',
            validate: (s) => someNums(s, (n) =>
              n.length >= 2 && n[0] >= 1 && n[1] >= 1 && n[0] + n[1] === 10),
            hint: 'Om du skrev 3 och 7 förra gången – prova något helt annat, som 5 och 5.',
            discussion: 'Bra! Ett problem kan ha många olika lösningar. Det är därför man ska undersöka i stället för att leta efter "det rätta svaret".',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta alla sätt att dela äggen.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta ALLA sätt Dino kan dela 10 ägg mellan stora och lilla boet. Skriv hur många ägg som ligger i STORA boet, ett tal i taget.',
            placeholder: 'ett tal, t.ex. 3',
            targets: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            hint: 'Börja med 1 ägg i stora boet, sedan 2, sedan 3 … Hur långt kan du gå?',
            discussion: 'Stora boet kan innehålla 1, 2, 3, 4, 5, 6, 7, 8 eller 9 ägg – 9 olika sätt. Det går inte att lägga 0 eller 10 ägg där, för då blir ett bo tomt.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Förklara hur du VET att du hittat alla sätt.',
            placeholder: 'Skriv hur du tänkte…',
            hint: 'Tänk på i vilken ordning du provade. Kunde du missa något?',
            discussion: 'Så här kan man tänka: om man går igenom talen i ordning – 1, 2, 3, … 9 – kan man inte missa något. Man vet att man är klar när nästa tal (10) skulle göra lilla boet tomt. Att arbeta systematiskt är nyckeln till att kunna säga "jag har hittat ALLA".',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Vad händer med andra antal ägg?',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Undersök: om Dino i stället har 6 ägg – hur många olika sätt finns det då att dela dem? (svara med ett tal)',
            placeholder: 'antal sätt',
            validate: numWhere(n => n === 5),
            hint: 'Prova samma metod: stora boet kan ha 1, 2, 3 … Hur långt kan du gå den här gången?',
            discussion: 'Med 6 ägg kan stora boet ha 1, 2, 3, 4 eller 5 ägg – alltså 5 sätt.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Ser du en regel? Hur många sätt finns det om Dino har 20 ägg? Och om Dino har hur många ägg som helst?',
            placeholder: 'Beskriv din regel…',
            hint: 'Jämför: 10 ägg gav 9 sätt, 6 ägg gav 5 sätt. Vad är sambandet?',
            discussion: 'Så här kan man tänka: 10 ägg → 9 sätt, 6 ägg → 5 sätt. Antalet sätt är alltid ETT MINDRE än antalet ägg. Med 20 ägg blir det 19 sätt. Regeln: har man n ägg finns det n − 1 sätt. Förklaringen är att stora boet kan få allt från 1 till n − 1 ägg, och det är n − 1 olika värden.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-dino-mynt',
    worldId: 'dino',
    title: 'Betala med mynt',
    emoji: '🪙',
    context: 'I boden finns mynt som är värda 1 kr, 2 kr och 5 kr. Dino ska betala exakt 10 kr och får använda hur många mynt som helst av varje sort.',
    topicIds: ['addition-strategier', 'rakna-till-100', 'problemlosning-lag'],
    tags: ['Pengar', 'Kombinationer'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta olika sätt att betala.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett sätt att betala exakt 10 kr. Skriv vilka mynt du använder, t.ex. "5 + 5" eller "5 + 2 + 2 + 1".',
            placeholder: 't.ex. 5 + 2 + 2 + 1',
            validate: (s) => someNums(s, (n) =>
              n.length > 0 && n.every(v => v === 1 || v === 2 || v === 5) && n.reduce((a, b) => a + b, 0) === 10),
            hint: 'Lägg ihop mynt tills du kommer till exakt 10. Du får bara använda 1:or, 2:or och 5:or.',
            discussion: 'Det finns många lösningar, t.ex. 5+5, 5+2+2+1, 2+2+2+2+2 eller tio 1-kronor. Alla är lika rätt!',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge ett sätt att betala 10 kr med så FÅ mynt som möjligt. Hur många mynt behöver du minst?',
            placeholder: 'antal mynt',
            validate: numWhere(n => n === 2),
            hint: 'Vilket är det största myntet? Hur många sådana får plats i 10 kr?',
            discussion: 'Med två 5-kronor betalar man 10 kr – det är det minsta antalet mynt. Att välja de största mynten först ger alltid minst antal mynt här.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök alla möjligheter systematiskt.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hur många 5-kronor kan ingå i betalningen? Skriv alla möjliga antal, ett i taget.',
            placeholder: 'ett tal',
            targets: ['0', '1', '2'],
            hint: 'Kan du använda tre 5-kronor? Hur mycket blir det?',
            discussion: 'Man kan använda 0, 1 eller 2 femkronor. Tre femkronor blir 15 kr – för mycket. Att dela upp problemet efter antalet stora mynt är ett bra sätt att få ordning på alla lösningar.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv hur du skulle göra för att hitta ALLA sätt att betala 10 kr, utan att missa något.',
            placeholder: 'Beskriv din metod…',
            hint: 'Börja med flest 5-kronor och arbeta dig nedåt. Vad gör du sedan med 2-kronorna?',
            discussion: 'Så här kan man tänka: gå igenom fallen systematiskt. Först: 2 femkronor (då är allt betalt). Sedan: 1 femkrona, och de återstående 5 kr betalas med 2:or och 1:or (0, 1 eller 2 tvåkronor). Sist: 0 femkronor, och 10 kr betalas med 2:or och 1:or (0–5 tvåkronor). Genom att göra ett fall i taget kan man vara säker på att man fått med allt.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Generalisera till andra belopp.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vilket är det minsta antal mynt som behövs för att betala exakt 18 kr?',
            placeholder: 'antal mynt',
            validate: numWhere(n => n === 5),
            hint: 'Ta så många 5-kronor du kan först: 5 + 5 + 5 = 15. Hur betalar du de sista 3 kronorna?',
            discussion: '18 kr = 5 + 5 + 5 + 2 + 1, alltså 5 mynt. Knepet är att ta så stora mynt som möjligt först.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Finns det något belopp du INTE kan betala exakt med mynten 1, 2 och 5? Förklara varför/varför inte.',
            placeholder: 'Vad tror du, och varför?',
            hint: 'Testa några små belopp: 1, 2, 3, 4 kr … Går alla?',
            discussion: 'Så här kan man tänka: eftersom det finns 1-kronor kan man alltid fylla ut till exakt rätt belopp. Alla hela kronbelopp går alltså att betala. Om 1-kronan INTE fanns (bara 2 och 5) skulle t.ex. 1 kr och 3 kr bli omöjliga – då blir problemet genast mycket mer spännande!',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-dino-hemligt-tal',
    worldId: 'dino',
    title: 'Jag tänker på ett tal',
    emoji: '🔍',
    context: 'Dino tänker på ett tal mellan 1 och 20. Talet är jämnt och större än 10.',
    topicIds: ['tallinjen-lag', 'storleksordna-tal', 'position-lag', 'rakna-till-100'],
    tags: ['Villkor', 'Hitta alla'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta tal som passar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett tal som passar in på ledtrådarna.',
            placeholder: 't.ex. 14',
            validate: numWhere(n => n > 10 && n <= 20 && n % 2 === 0),
            hint: 'Jämna tal slutar på 0, 2, 4, 6 eller 8. Vilka jämna tal är större än 10?',
            discussion: 'Talen som passar är 12, 14, 16, 18 och 20. Flera svar är rätt!',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge ett tal till som också passar.',
            placeholder: 'ett annat tal',
            validate: numWhere(n => n > 10 && n <= 20 && n % 2 === 0),
            hint: 'Räkna vidare med två i taget: 12, 14, 16 …',
            discussion: 'Att det finns flera svar betyder att ledtrådarna inte räcker för att bestämma ETT tal.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta alla möjliga tal.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta ALLA tal mellan 1 och 20 som passar in på ledtrådarna.',
            placeholder: 'ett tal i taget',
            targets: ['12', '14', '16', '18', '20'],
            hint: 'Gå igenom de jämna talen i ordning från 12 och uppåt.',
            discussion: 'Talen är 12, 14, 16, 18 och 20 – fem stycken. Genom att räkna uppåt två i taget kan man vara säker på att inget missas.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Hur vet du att du hittat alla? Förklara.',
            placeholder: 'Skriv hur du vet…',
            hint: 'Vad händer om du fortsätter förbi 20? Och vad hände före 12?',
            discussion: 'Så här kan man tänka: alla jämna tal från 12 till 20 är med. Nästa jämna tal efter 20 är 22, men det är utanför intervallet. Före 12 kommer 10, men talet ska vara STÖRRE än 10. Alltså är listan komplett.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Skapa ett eget problem.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Dino lägger till en ledtråd: "talet har siffersumman 9". Vilket tal är det nu? (Siffersumman i 18 är 1 + 8 = 9.)',
            placeholder: 'ett tal',
            validate: numWhere(n => n === 18),
            hint: 'Räkna siffersumman för 12, 14, 16, 18 och 20. Vilket ger 9?',
            discussion: 'Siffersummorna är: 12 → 3, 14 → 5, 16 → 7, 18 → 9 ✓, 20 → 2. Bara 18 passar. Nu räcker ledtrådarna för att bestämma exakt ETT tal!',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Hitta på egna ledtrådar till ett hemligt tal – så att det bara finns ETT möjligt svar. Skriv dina ledtrådar och ditt tal.',
            placeholder: 'Mitt tal är … och mina ledtrådar är …',
            hint: 'Börja med talet du vill ha. Lägg sedan till ledtrådar tills alla andra tal faller bort.',
            discussion: 'Så här kan man tänka: varje ledtråd sållar bort tal. Man behöver lägga till ledtrådar tills exakt ett tal är kvar. Exempel: "talet är udda, mellan 10 och 20, och siffersumman är 4" → bara 13 passar. Att själv konstruera problem är ett av de bästa sätten att förstå dem.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-dino-monster',
    worldId: 'dino',
    title: 'Mönstret av kvadrater',
    emoji: '🟦',
    context: 'Dino bygger figurer av kvadrater. Figur 1 har 3 kvadrater, figur 2 har 5 kvadrater och figur 3 har 7 kvadrater.',
    topicIds: ['likheter-monster', 'addition-strategier', 'rakna-till-100'],
    tags: ['Mönster', 'Generalisering'],
    levels: [
      {
        level: 'E',
        intro: 'Fortsätt mönstret.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 4?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 9),
            hint: 'Hur många fler kvadrater blir det för varje ny figur?',
            discussion: 'Varje figur får 2 kvadrater mer än den förra: 3, 5, 7, 9. Figur 4 har 9 kvadrater.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 5?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 11),
            hint: 'Fortsätt lägga till 2.',
            discussion: 'Figur 5 har 9 + 2 = 11 kvadrater.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Räkna längre fram utan att rita.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 10?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 21),
            hint: 'Från figur 1 till figur 10 är det 9 steg. Varje steg lägger till 2 kvadrater.',
            discussion: 'Figur 1 har 3 kvadrater. Sedan tillkommer 2 kvadrater per steg: 3 + 9 × 2 = 3 + 18 = 21 kvadrater.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv hur du räknar ut antalet kvadrater till vilken figur som helst, utan att rita alla figurer.',
            placeholder: 'Beskriv hur du räknar…',
            hint: 'Vad startar du med, och hur många gånger lägger du till 2?',
            discussion: 'Så här kan man tänka: börja med 3 kvadrater (figur 1) och lägg till 2 för varje steg framåt. För figur n har man tagit n − 1 steg: 3 + 2 × (n − 1). Ett annat sätt att se det: figur n har 2n + 1 kvadrater.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Hitta regeln och vänd på problemet.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 100?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 201),
            hint: 'Använd din regel: 2 × figurnumret + 1.',
            discussion: 'Figur 100: 2 × 100 + 1 = 201 kvadrater. Med en regel behöver man aldrig rita eller räkna sig fram steg för steg.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Vänd på problemet: vilken figur består av 41 kvadrater?',
            placeholder: 'figurnummer',
            validate: numWhere(n => n === 20),
            hint: 'Du vet att antalet är 2n + 1. Vilket n ger 41? Prova att räkna baklänges.',
            discussion: '2n + 1 = 41 ⇒ 2n = 40 ⇒ n = 20. Det är figur 20. Att kunna vända på ett problem – från "vilket antal?" till "vilken figur?" – visar att man verkligen förstått mönstret.',
          },
          {
            id: 'c',
            kind: 'reflect',
            prompt: 'Kan någon figur bestå av exakt 30 kvadrater? Förklara varför eller varför inte.',
            placeholder: 'Ja eller nej – och varför?',
            hint: 'Alla antal i mönstret är 3, 5, 7, 9, 11 … Vad har de gemensamt?',
            discussion: 'Så här kan man tänka: alla antal i mönstret är udda (3, 5, 7, 9 …), eftersom 2n alltid är jämnt och 2n + 1 därför alltid udda. 30 är jämnt och kan alltså ALDRIG förekomma i mönstret. Att kunna utesluta något är ett kraftfullt matematiskt resonemang.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-dino-dela-lika',
    worldId: 'dino',
    title: 'Dela kakorna lika',
    emoji: '🍪',
    context: 'Dino har en påse kakor som ska delas lika mellan kompisarna. Ibland går det jämnt ut, ibland blir det kakor över.',
    topicIds: ['halften-dubbelt', 'problemlosning-lag', 'rakna-till-100'],
    tags: ['Division', 'Delbarhet'],
    levels: [
      {
        level: 'E',
        intro: 'Undersök när det går jämnt ut.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Dino har färre än 20 kakor och de går att dela lika mellan 4 kompisar. Ge ett exempel på hur många kakor Dino kan ha.',
            placeholder: 't.ex. 8',
            validate: numWhere(n => n > 0 && n < 20 && n % 4 === 0),
            hint: 'Tänk på 4:ans tabell: 4, 8, 12 …',
            discussion: 'Talen som fungerar är 4, 8, 12 och 16 – alla tal i 4:ans tabell under 20.',
          },
          {
            id: 'b',
            kind: 'collect',
            prompt: 'Hitta ALLA antal kakor under 20 som går att dela lika mellan 4 kompisar.',
            placeholder: 'ett tal i taget',
            targets: ['4', '8', '12', '16'],
            hint: 'Räkna 4:ans tabell tills du passerar 20.',
            discussion: 'Talen är 4, 8, 12 och 16. Nästa tal i 4:ans tabell är 20, men Dino har färre än 20 kakor.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Nu blir det kakor över.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Nu delar Dino kakorna mellan 4 kompisar och det blir 1 kaka över. Dino har färre än 20 kakor. Ge ett exempel på hur många kakor Dino kan ha.',
            placeholder: 't.ex. 9',
            validate: numWhere(n => n > 0 && n < 20 && n % 4 === 1),
            hint: 'Ta ett tal ur 4:ans tabell och lägg till 1.',
            discussion: 'Talen är 1, 5, 9, 13 och 17 – ett mer än talen i 4:ans tabell.',
          },
          {
            id: 'b',
            kind: 'collect',
            prompt: 'Hitta ALLA antal under 20 som ger 1 kaka över när man delar på 4.',
            placeholder: 'ett tal i taget',
            targets: ['1', '5', '9', '13', '17'],
            hint: 'Börja på 1 och hoppa 4 steg i taget.',
            discussion: 'Talen är 1, 5, 9, 13 och 17. De ligger 4 steg isär – precis som talen i 4:ans tabell, fast förskjutna ett steg.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Hitta mönstret bakom resterna.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Jämför dina två listor (4, 8, 12, 16 och 1, 5, 9, 13, 17). Vad har de gemensamt? Beskriv mönstret.',
            placeholder: 'Beskriv vad du ser…',
            hint: 'Hur långt är det mellan talen i varje lista?',
            discussion: 'Så här kan man tänka: i båda listorna ligger talen exakt 4 steg isär. Det beror på att när man lägger till 4 kakor får varje kompis en kaka till – resten blir densamma. Alla tal med samma rest bildar därför en "hoppserie" med steget 4.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Hur många olika rester kan man få när man delar kakor mellan 4 kompisar? Vilka är de? Förklara.',
            placeholder: 'Skriv dina rester och varför…',
            hint: 'Kan resten bli 4? Vad skulle hända då?',
            discussion: 'Så här kan man tänka: resterna kan bara vara 0, 1, 2 eller 3 – alltså 4 olika. Resten kan aldrig bli 4, för då skulle varje kompis kunna få ytterligare en kaka. Generellt: delar man på n personer finns det n möjliga rester (0 upp till n − 1).',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-dino-staket',
    worldId: 'dino',
    title: 'Hagen till dinobebisen',
    emoji: '🦕',
    context: 'Dino bygger en rektangulär hage av 12 meter staket. Sidorna ska vara hela meter.',
    topicIds: ['former-och-figurer', 'omv-mat-lag', 'problemlosning-lag'],
    tags: ['Omkrets', 'Undersöka'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta hagar som passar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett förslag på hur lång och hur bred hagen kan vara. Skriv två tal, t.ex. "2 och 4".',
            placeholder: 't.ex. 2 och 4',
            validate: rectWithPerimeter(12),
            hint: 'Alla fyra sidorna tillsammans ska bli 12 m. Längd + bredd måste alltså bli 6.',
            discussion: 'Om längd + bredd = 6 blir omkretsen 12 m. Möjliga hagar: 1×5, 2×4 och 3×3.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge ett ANNAT förslag på hage med 12 meter staket.',
            placeholder: 'två tal',
            validate: rectWithPerimeter(12),
            hint: 'Prova ett annat par tal som blir 6 tillsammans.',
            discussion: 'Det finns tre olika hagar med heltalssidor: 1×5, 2×4 och 3×3.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök vilken hage som blir störst.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta ALLA möjliga hagar. Skriv den KORTA sidan för varje hage, ett tal i taget.',
            placeholder: 'ett tal',
            targets: ['1', '2', '3'],
            hint: 'Korta sidan kan vara 1, 2 eller … testa vidare. När blir det samma hage som du redan har?',
            discussion: 'Korta sidan kan vara 1 (hagen 1×5), 2 (2×4) eller 3 (3×3). Väljer man 4 får man 4×2, vilket är samma hage som 2×4 – bara vänd.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Vilken av hagarna får störst yta (area)? Skriv arean i kvadratmeter.',
            placeholder: 'area i m²',
            validate: numWhere(n => n === 9),
            hint: 'Räkna ut längd × bredd för 1×5, 2×4 och 3×3.',
            discussion: 'Areorna är 1×5 = 5 m², 2×4 = 8 m² och 3×3 = 9 m². Störst area får den kvadratiska hagen: 9 m².',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Gäller det alltid?',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Undersök med 20 meter staket i stället. Vilken är den största arean man kan få? (heltalssidor, svara i m²)',
            placeholder: 'area i m²',
            validate: numWhere(n => n === 25),
            hint: 'Nu ska längd + bredd bli 10. Prova 1×9, 2×8, 3×7, 4×6, 5×5 och jämför areorna.',
            discussion: 'Areorna blir 9, 16, 21, 24 och 25 m². Störst är 5×5 = 25 m² – återigen en kvadrat!',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Formulera en regel: vilken form ger alltid störst area? Förklara varför du tror att det är så.',
            placeholder: 'Min regel är…',
            hint: 'Titta på båda undersökningarna: 12 m gav 3×3, 20 m gav 5×5. Vad har vinnarna gemensamt?',
            discussion: 'Så här kan man tänka: regeln är att KVADRATEN alltid ger störst area vid en given omkrets. En förklaring: ju mer lika sidorna är, desto större blir produkten. Om man gör den ena sidan längre måste den andra bli kortare, och arean minskar. Man ser det tydligt i tabellen – areorna växer fram till mitten och minskar sedan symmetriskt.',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FANTASY VÄRLDEN (Nivå 4–6)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-fantasy-rektangeln',
    worldId: 'fantasy',
    title: 'Rektangeln – area och omkrets',
    emoji: '📐',
    context: 'En rektangel har omkretsen 24 cm. Sidorna är hela centimeter.',
    topicIds: ['geometri-omfang', 'geometri-mel', 'multiplikation-steg-2'],
    tags: ['Omkrets', 'Area', 'Optimering'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta rektanglar och beräkna deras areor.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hitta en rektangel som har omkretsen 24 cm. Skriv längd och bredd, t.ex. "4 och 8".',
            placeholder: 't.ex. 4 och 8',
            validate: rectWithPerimeter(24),
            hint: 'Omkretsen är alla fyra sidorna. Längd + bredd måste bli 12.',
            discussion: 'Eftersom omkretsen är 2 × (längd + bredd) måste längd + bredd = 12. Exempel: 1×11, 2×10, 3×9, 4×8, 5×7 och 6×6.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Hitta en ANNAN rektangel med omkretsen 24 cm.',
            placeholder: 'längd och bredd',
            validate: rectWithPerimeter(24),
            hint: 'Välj ett annat par tal som blir 12 tillsammans.',
            discussion: 'Det finns sex olika rektanglar med heltalssidor: 1×11, 2×10, 3×9, 4×8, 5×7 och 6×6.',
          },
          {
            id: 'c',
            kind: 'open',
            prompt: 'Hitta en TREDJE rektangel med omkretsen 24 cm, och beräkna dess area. Skriv arean i cm².',
            placeholder: 'area i cm²',
            validate: numWhere(n => [11, 20, 27, 32, 35, 36].includes(n)),
            hint: 'Area = längd × bredd. Räkna ut den för din rektangel.',
            discussion: 'De möjliga areorna är 1×11 = 11, 2×10 = 20, 3×9 = 27, 4×8 = 32, 5×7 = 35 och 6×6 = 36 cm². Lägg märke till att areorna skiljer sig kraftigt trots att omkretsen är densamma!',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök vilken rektangel som är störst – och hur du vet att du hittat alla.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vilken av rektanglarna har STÖRST area? Skriv arean i cm².',
            placeholder: 'största arean',
            validate: numWhere(n => n === 36),
            hint: 'Jämför areorna du räknat ut. Vilken rektangel har sidor som är mest lika?',
            discussion: 'Störst area har kvadraten 6×6 = 36 cm². Minst area har den långsmala 1×11 = 11 cm².',
          },
          {
            id: 'b',
            kind: 'collect',
            prompt: 'Hitta ALLA rektanglar med omkretsen 24 cm. Skriv den KORTA sidan för varje rektangel, ett tal i taget.',
            placeholder: 'ett tal',
            targets: ['1', '2', '3', '4', '5', '6'],
            hint: 'Korta sidan kan vara 1, 2, 3 … Hur långt kan du gå innan rektanglarna börjar upprepa sig?',
            discussion: 'Korta sidan kan vara 1, 2, 3, 4, 5 eller 6 – sex olika rektanglar. Vid 7 skulle man få 7×5, vilket är samma rektangel som 5×7 bara vänd.',
          },
          {
            id: 'c',
            kind: 'reflect',
            prompt: 'Förklara hur du VET att du hittat alla rektanglar.',
            placeholder: 'Skriv ditt resonemang…',
            hint: 'Vad händer när korta sidan blir större än halva 12?',
            discussion: 'Så här kan man tänka: längd + bredd måste vara 12. Om man låter den korta sidan vara 1, 2, 3 … går man igenom alla möjligheter systematiskt. Vid 6 är sidorna lika (6+6), och efter det upprepar sig rektanglarna spegelvänt (7×5 är samma som 5×7). Alltså finns exakt sex olika rektanglar.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Undersök andra omkretsar och hitta en regel.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Undersök omkretsen 30 cm. Vilken är den största arean? (heltalssidor, svara i cm²)',
            placeholder: 'största arean',
            validate: numWhere(n => n === 56),
            hint: 'Längd + bredd = 15. Eftersom 15 är udda kan sidorna inte bli exakt lika – vilka två heltal ligger närmast varandra?',
            discussion: 'Längd + bredd = 15. Närmast en kvadrat kommer 7×8 = 56 cm². Här går det inte att få en perfekt kvadrat eftersom 15 är udda.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Undersök omkretsen 40 cm. Vilken är den största arean? (svara i cm²)',
            placeholder: 'största arean',
            validate: numWhere(n => n === 100),
            hint: 'Längd + bredd = 20. Vilken rektangel har mest lika sidor?',
            discussion: 'Längd + bredd = 20 ger kvadraten 10×10 = 100 cm².',
          },
          {
            id: 'c',
            kind: 'reflect',
            prompt: 'Formulera en regel för vilken rektangel som får störst area. Kan du förklara VARFÖR regeln fungerar?',
            placeholder: 'Min regel är… och den fungerar för att…',
            hint: 'Titta på dina resultat: 24 cm → 6×6, 30 cm → 7×8, 40 cm → 10×10. Vad är gemensamt?',
            discussion: 'Så här kan man tänka: regeln är att arean blir störst när sidorna är så lika som möjligt – alltså en kvadrat (eller så nära man kommer med heltal). Varför? Om längd + bredd är konstant och man flyttar 1 cm från den korta till den långa sidan, förlorar man mer area än man vinner. Skriv sidorna som 6+x och 6−x (summa 12): arean blir (6+x)(6−x) = 36 − x². Ju större x, desto mindre area. Störst blir den när x = 0, alltså när sidorna är lika!',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-godis',
    worldId: 'fantasy',
    title: 'Godisbitarna',
    emoji: '🍬',
    context: 'En klass har mellan 50 och 100 godisbitar. När godiset delas lika mellan 4 elever blir 2 bitar över.',
    topicIds: ['division-steg-2', 'division-steg-3', 'primtal-faktorer'],
    tags: ['Division med rest', 'Hitta alla'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta ett antal som fungerar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett exempel på hur många godisbitar det kan finnas.',
            placeholder: 't.ex. 54',
            validate: numWhere(n => n >= 50 && n <= 100 && n % 4 === 2),
            hint: 'Leta efter ett tal där 4:ans tabell "nästan" går jämnt ut – med 2 över. Prova 50, 54, 58 …',
            discussion: 'Exempel som fungerar: 50, 54, 58, 62 … Alla ger rest 2 vid division med 4. Kontroll: 54 ÷ 4 = 13 med 2 över ✓',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Hur kontrollerade du att ditt tal stämmer? Beskriv.',
            placeholder: 'Så här kontrollerade jag…',
            hint: 'Vad händer om du drar bort 2 från ditt tal?',
            discussion: 'Så här kan man tänka: dra bort 2 från talet – då ska resten gå jämnt ut med 4. T.ex. 54 − 2 = 52, och 52 ÷ 4 = 13 exakt ✓. Ett annat sätt är att dividera direkt och se att resten blir 2.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta alla möjliga antal.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta ALLA möjliga antal godisbitar mellan 50 och 100.',
            placeholder: 'ett tal i taget',
            targets: rangeWhere(50, 100, n => n % 4 === 2),
            hint: 'Börja på 50 och hoppa 4 steg i taget: 50, 54, 58 …',
            discussion: 'Talen är 50, 54, 58, 62, 66, 70, 74, 78, 82, 86, 90, 94 och 98 – 13 stycken. De ligger alla 4 steg isär.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Förklara hur du gjorde för att hitta alla.',
            placeholder: 'Beskriv din metod…',
            hint: 'Varför räcker det att hoppa 4 steg i taget?',
            discussion: 'Så här kan man tänka: hitta först det minsta talet i intervallet som ger rest 2 (det är 50). Lägg sedan till 4 varje gång – när man lägger till 4 får varje elev exakt en godis till, så resten förblir 2. Fortsätt tills du passerar 100. Metoden garanterar att inget tal missas.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Hitta en metod som fungerar utan att prova.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Utan att skriva upp alla: hur MÅNGA tal mellan 50 och 100 fungerar?',
            placeholder: 'antal tal',
            validate: numWhere(n => n === 13),
            hint: 'Talen är 50, 54, … 98 med steget 4. Antal = (sista − första) ÷ steget + 1.',
            discussion: 'Antal = (98 − 50) ÷ 4 + 1 = 48 ÷ 4 + 1 = 12 + 1 = 13 tal. Formeln fungerar för alla sådana "hoppserier". Glöm inte att lägga till 1 – annars missar man det första talet!',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv en generell metod för problem av den här typen (t.ex. "mellan 200 och 500, rest 3 vid division med 7").',
            placeholder: 'Min generella metod…',
            hint: 'Vilka tre saker behöver du ta reda på för att kunna räkna ut antalet?',
            discussion: 'Så här kan man tänka: (1) Hitta det FÖRSTA talet i intervallet som ger rätt rest. (2) Hitta det SISTA. (3) Räkna antalet med formeln (sista − första) ÷ divisorn + 1. Med matematiskt språk: alla tal som ger rest r vid division med d kan skrivas som d·k + r. Man löser då olikheten för k och räknar hur många heltal k som ryms.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-pengar',
    worldId: 'fantasy',
    title: 'Klassens pengar',
    emoji: '💰',
    context: 'Fyra elever har tillsammans 200 kr. De har olika mycket pengar var (inga två har lika mycket), och alla belopp är hela kronor.',
    topicIds: ['addition-strategier', 'huvudrakning', 'ekvationer-mel-steg-2'],
    tags: ['Kombinationer', 'Systematik'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta en möjlig fördelning.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett exempel på hur pengarna kan vara fördelade. Skriv fyra olika belopp som blir 200 kr, t.ex. "20 40 60 80".',
            placeholder: 't.ex. 20 40 60 80',
            validate: (s) => someNums(s, (n) =>
              n.length === 4 && n.every(v => Number.isInteger(v) && v > 0)
              && new Set(n).size === 4 && n.reduce((a, b) => a + b, 0) === 200),
            hint: 'Fyra olika tal som tillsammans blir 200. Prova t.ex. 10, 20, 70 och 100.',
            discussion: 'Det finns väldigt många lösningar, t.ex. 20+40+60+80, 10+20+70+100 eller 1+2+3+194. Kravet är bara att beloppen är olika och summan är 200 kr.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Nu med villkoret att alla måste ha minst 20 kr.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta så många olika fördelningar som möjligt där ALLA har minst 20 kr (och olika mycket). Skriv en fördelning i taget – hitta minst 4 olika.',
            placeholder: 't.ex. 20 40 60 80',
            need: 4,
            validate: (s) => someNums(s, (n) =>
              n.length === 4 && n.every(v => Number.isInteger(v) && v >= 20)
              && new Set(n).size === 4 && n.reduce((a, b) => a + b, 0) === 200),
            hint: 'Börja med de tre minsta möjliga beloppen: 20, 21 och 22. Hur mycket blir kvar till den fjärde?',
            discussion: 'Exempel som fungerar: 20+21+22+137, 20+40+60+80, 30+45+50+75, 20+30+70+80. Så länge alla har minst 20 kr, är olika och summan blir 200 kr är fördelningen giltig.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Vilket är det STÖRSTA belopp någon kan ha, om alla andra har minst 20 kr? Förklara hur du tänker.',
            placeholder: 'Största beloppet är… för att…',
            hint: 'Gör de tre andras belopp så små som möjligt. Kom ihåg att alla måste ha OLIKA belopp.',
            discussion: 'Så här kan man tänka: för att en person ska få så mycket som möjligt ska de tre andra ha minsta möjliga belopp. Eftersom beloppen måste vara olika och minst 20 kr blir det 20 + 21 + 22 = 63 kr. Den fjärde får då 200 − 63 = 137 kr.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Räkna ut hur många fördelningar som finns.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Hur skulle du kunna bestämma HUR MÅNGA olika fördelningar som är möjliga, utan att skriva upp dem alla? Beskriv en strategi.',
            placeholder: 'Min strategi…',
            hint: 'Ett vanligt knep: dra först bort "grundplåten" 20 kr till var och en. Hur mycket finns kvar att fördela fritt?',
            discussion: 'Så här kan man tänka: ge först alla 20 kr var (4 × 20 = 80 kr). Kvar finns 120 kr som ska fördelas. Ett annat vanligt grepp är att sortera beloppen i storleksordning – då räknar man varje uppsättning bara en gång i stället för i alla ordningar. Sedan kan man arbeta systematiskt: börja med det minsta beloppet 20, gå igenom alla möjligheter för nästa belopp, och så vidare. Poängen är inte det exakta antalet utan att ha en metod som garanterar att inget missas och inget räknas dubbelt.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Om ordningen spelar roll (vem som har vilket belopp) blir antalet mycket större. Hur många gånger större? Förklara.',
            placeholder: 'Antalet blir … gånger större för att…',
            hint: 'På hur många sätt kan fyra olika belopp fördelas mellan fyra namngivna personer?',
            discussion: 'Så här kan man tänka: fyra olika belopp kan delas ut till fyra personer på 4! = 4 × 3 × 2 × 1 = 24 sätt. Varje uppsättning belopp motsvarar alltså 24 olika "vem-har-vad"-fördelningar. Antalet blir 24 gånger större. Att hålla reda på om ordningen spelar roll eller inte är avgörande i kombinatorik.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-monster',
    worldId: 'fantasy',
    title: 'Mönstret',
    emoji: '🟦',
    context: 'Figurer byggs med kvadrater. Figur 1: 3 kvadrater. Figur 2: 5 kvadrater. Figur 3: 7 kvadrater. Figur 4: 9 kvadrater.',
    topicIds: ['multiplikation-steg-2', 'ekvationer-mel-steg-2', 'taluppfattning-1'],
    tags: ['Mönster', 'Formel', 'Generalisering'],
    levels: [
      {
        level: 'E',
        intro: 'Fortsätt mönstret.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 5?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 11),
            hint: 'Hur mycket ökar antalet mellan varje figur?',
            discussion: 'Antalet ökar med 2 varje gång: 3, 5, 7, 9, 11. Figur 5 har 11 kvadrater.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 6?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 13),
            hint: 'Fortsätt med samma steg.',
            discussion: 'Figur 6 har 11 + 2 = 13 kvadrater.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Räkna längre fram – och beskriv hur.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 20?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 41),
            hint: 'Räkna inte steg för steg. Från figur 1 till figur 20 är det 19 steg om 2 kvadrater.',
            discussion: 'Figur 20: 3 + 19 × 2 = 3 + 38 = 41 kvadrater. (Eller med formeln 2 × 20 + 1 = 41.)',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv hur du räknar. Varför fungerar din metod?',
            placeholder: 'Så här räknar jag…',
            hint: 'Vad utgår du ifrån, och vad multiplicerar du med vad?',
            discussion: 'Så här kan man tänka: man börjar med 3 kvadrater i figur 1 och lägger till 2 kvadrater per steg. Till figur n har man tagit n − 1 steg: 3 + 2(n − 1). Förenklat blir det 3 + 2n − 2 = 2n + 1. Ett annat sätt att se det: varje figur består av 2 "rader" med n kvadrater plus 1 extra.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Skriv en regel som gäller för alla figurer.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många kvadrater behövs till figur 100?',
            placeholder: 'antal kvadrater',
            validate: numWhere(n => n === 201),
            hint: 'Använd regeln 2n + 1.',
            discussion: 'Figur 100: 2 × 100 + 1 = 201 kvadrater.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Skriv en regel (formel) för hur många kvadrater figur n behöver. Förklara varje del i formeln.',
            placeholder: 'Min formel är…',
            hint: 'Testa din formel på figur 1, 2 och 3 – stämmer den?',
            discussion: 'Så här kan man tänka: formeln är 2n + 1. Kontroll: n = 1 ger 3 ✓, n = 2 ger 5 ✓, n = 3 ger 7 ✓. Delarna betyder: "2n" är de två raderna som växer med figuren, och "+1" är den enda kvadraten som alltid finns kvar oavsett figurnummer. En bra formel ska man både kunna testa OCH förklara.',
          },
          {
            id: 'c',
            kind: 'open',
            prompt: 'Vänd på problemet: vilken figur har 61 kvadrater?',
            placeholder: 'figurnummer',
            validate: numWhere(n => n === 30),
            hint: 'Lös ekvationen 2n + 1 = 61.',
            discussion: '2n + 1 = 61 ⇒ 2n = 60 ⇒ n = 30. Det är figur 30.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-pizza',
    worldId: 'fantasy',
    title: 'Pizzorna',
    emoji: '🍕',
    context: 'Pizzor delas i lika stora bitar och ska fördelas rättvist mellan ett antal kompisar.',
    topicIds: ['brak-steg-1', 'brak-steg-2', 'brak-steg-3', 'division-steg-2'],
    tags: ['Bråk', 'Division', 'Samband'],
    levels: [
      {
        level: 'E',
        intro: 'Dela en pizza.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'En pizza är delad i 8 bitar. Fyra personer delar lika. Hur många bitar får varje person?',
            placeholder: 'antal bitar',
            validate: numWhere(n => n === 2),
            hint: 'Dela 8 bitar i 4 lika delar.',
            discussion: '8 ÷ 4 = 2 bitar var. Varje person får alltså 2/8 av pizzan, vilket är samma sak som 1/4.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Hur stor DEL av pizzan får varje person? Skriv det som ett bråk och förklara.',
            placeholder: 't.ex. 1/4 för att…',
            hint: '2 bitar av 8 – hur skriver man det som bråk? Går det att förkorta?',
            discussion: 'Så här kan man tänka: varje person får 2 av 8 bitar, alltså 2/8 av pizzan. Det kan förkortas till 1/4. Båda svaren är rätt – 2/8 och 1/4 är exakt lika mycket pizza, bara skrivet på olika sätt.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Flera pizzor – visa på flera sätt.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Tre pizzor är delade i 8 bitar var. Fyra personer delar lika. Hur många BITAR får varje person?',
            placeholder: 'antal bitar',
            validate: numWhere(n => n === 6),
            hint: 'Hur många bitar finns det totalt? Dela sedan på 4.',
            discussion: 'Totalt 3 × 8 = 24 bitar. Var och en får 24 ÷ 4 = 6 bitar.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Hur mycket pizza är det? Visa på flera olika sätt (som bråk, som blandad form, i ord).',
            placeholder: 'Sätt 1… Sätt 2…',
            hint: '6 bitar av 8 är hur stor del av EN pizza?',
            discussion: 'Så här kan man tänka och visa på flera sätt: (1) Som bråk av en pizza: 6/8 = 3/4 pizza. (2) Som division: 3 pizzor ÷ 4 personer = 3/4. (3) I ord: varje person får tre fjärdedels pizza. (4) Bildligt: dela varje pizza i fyra delar – det blir 12 fjärdedelar, och 12 ÷ 4 = 3 fjärdedelar var. Att kunna växla mellan representationer är kärnan i att förstå bråk.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Undersök sambandet mellan pizzor och personer.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Undersök: 1 pizza till 3 personer. Hur stor del får var och en? Skriv som bråk (t.ex. 1/3).',
            placeholder: 't.ex. 1/3',
            validate: (s) => ['1/3'].includes(normalizeAnswer(s)),
            hint: 'Antalet pizzor delat med antalet personer.',
            discussion: '1 pizza ÷ 3 personer = 1/3 pizza var.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Och 2 pizzor till 5 personer? Skriv som bråk.',
            placeholder: 't.ex. 2/5',
            validate: (s) => ['2/5'].includes(normalizeAnswer(s)),
            hint: 'Samma princip: pizzor delat med personer.',
            discussion: '2 pizzor ÷ 5 personer = 2/5 pizza var.',
          },
          {
            id: 'c',
            kind: 'reflect',
            prompt: 'Ser du sambandet? Vad får varje person om det finns n pizzor och n + 2 personer? Vad händer när n blir väldigt stort?',
            placeholder: 'Sambandet är… och när n växer…',
            hint: 'Testa: n = 1 ger 1/3, n = 2 ger 2/5, n = 3 ger 3/7. Skriv nästa i serien.',
            discussion: 'Så här kan man tänka: varje person får alltid antalet pizzor delat med antalet personer, alltså n/(n + 2). Serien blir 1/3, 2/5, 3/7, 4/9 … Andelen VÄXER hela tiden: 0,33 → 0,40 → 0,43 → 0,44 … När n blir mycket stort närmar sig andelen 1 hel pizza. Med 100 pizzor och 102 personer får var och en 100/102 ≈ 0,98 pizza. Förklaringen är att de två extra personerna betyder allt mindre ju större gruppen blir.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-delbar',
    worldId: 'fantasy',
    title: 'Det hemliga talet',
    emoji: '🔢',
    context: 'Jag tänker på ett tal mellan 1 och 100. Talet är delbart med 3 men INTE med 6.',
    topicIds: ['primtal-faktorer', 'division-steg-2', 'multiplikation-steg-2'],
    tags: ['Delbarhet', 'Hitta alla', 'Bevisa'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta tal som passar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett tal som passar: delbart med 3 men inte med 6.',
            placeholder: 't.ex. 9',
            validate: numWhere(n => n >= 1 && n <= 100 && n % 3 === 0 && n % 6 !== 0),
            hint: 'Ta ett tal ur 3:ans tabell. Kolla sedan om det också går att dela med 6 – i så fall duger det inte.',
            discussion: 'Tal som fungerar: 3, 9, 15, 21, 27 … Kontroll: 9 ÷ 3 = 3 ✓ men 9 ÷ 6 = 1,5 (går inte jämnt) ✓',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge ett andra tal som passar.',
            placeholder: 'ett annat tal',
            validate: numWhere(n => n >= 1 && n <= 100 && n % 3 === 0 && n % 6 !== 0),
            hint: 'Hoppa 6 steg från ditt förra tal.',
            discussion: 'Talen ligger 6 steg isär: 3, 9, 15, 21 …',
          },
          {
            id: 'c',
            kind: 'open',
            prompt: 'Ge ett tredje tal som passar.',
            placeholder: 'ytterligare ett tal',
            validate: numWhere(n => n >= 1 && n <= 100 && n % 3 === 0 && n % 6 !== 0),
            hint: 'Fortsätt hoppa 6 steg.',
            discussion: 'Alla tal av formen 3, 9, 15, 21, 27, 33 … fungerar – de är de UDDA talen i 3:ans tabell.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta alla tal som passar.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta ALLA tal mellan 1 och 100 som är delbara med 3 men inte med 6.',
            placeholder: 'ett tal i taget',
            targets: rangeWhere(1, 100, n => n % 3 === 0 && n % 6 !== 0),
            hint: 'Börja på 3 och hoppa 6 steg i taget: 3, 9, 15 …',
            discussion: 'Talen är 3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81, 87, 93 och 99 – 17 stycken. Det är precis de UDDA multiplerna av 3.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Vad har alla dessa tal gemensamt? Beskriv mönstret.',
            placeholder: 'De är alla…',
            hint: 'Är de jämna eller udda? Hur långt är det mellan dem?',
            discussion: 'Så här kan man tänka: alla talen är UDDA multipler av 3, och de ligger 6 steg isär. I 3:ans tabell varvas jämna och udda tal: 3 (udda), 6 (jämnt), 9 (udda), 12 (jämnt) … De jämna faller bort eftersom de är delbara med 6.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Förklara varför det fungerar så.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Varför är ett tal som är delbart med 3 IBLAND också delbart med 6? Förklara.',
            placeholder: 'Det beror på…',
            hint: '6 = 2 × 3. Vad krävs alltså UTÖVER att talet är delbart med 3?',
            discussion: 'Så här kan man tänka: 6 = 2 × 3. För att ett tal ska vara delbart med 6 måste det alltså vara delbart med BÅDE 2 och 3. Ett tal i 3:ans tabell är därför delbart med 6 endast om det dessutom är jämnt. Är det udda faller det bort – och det är precis de talen vi letade efter.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Skapa en egen regel: när är ett tal delbart med både 4 och 6? Testa din regel på några tal.',
            placeholder: 'Min regel… och mina tester…',
            hint: 'Räkna upp 4:ans och 6:ans tabeller. Vilka tal finns i båda? Hur långt är det mellan dem?',
            discussion: 'Så här kan man tänka: tal delbara med både 4 och 6 är 12, 24, 36, 48 … alltså multipler av 12. Obs! Man kan INTE bara multiplicera 4 × 6 = 24, eftersom 4 och 6 har faktorn 2 gemensam. Rätt svar är minsta gemensamma multipel (MGM) som är 12. Regeln: ett tal är delbart med både a och b precis när det är delbart med MGM(a, b).',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-bio',
    worldId: 'fantasy',
    title: 'Klassen går på bio',
    emoji: '🎬',
    context: 'En klass ska gå på bio. En barnbiljett kostar 80 kr och en vuxenbiljett 120 kr. Klassen består av 24 elever och 2 vuxna.',
    topicIds: ['multiplikation-steg-2', 'huvudrakning', 'rimlighetsoevningar-mel'],
    tags: ['Pengar', 'Jämföra alternativ'],
    levels: [
      {
        level: 'E',
        intro: 'Räkna ut totalkostnaden.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur mycket kostar alla biljetter tillsammans? (svara i kronor)',
            placeholder: 'kronor',
            validate: numWhere(n => n === 2160),
            hint: 'Räkna barnbiljetterna för sig och vuxenbiljetterna för sig, och lägg sedan ihop.',
            discussion: 'Barn: 24 × 80 = 1920 kr. Vuxna: 2 × 120 = 240 kr. Totalt 1920 + 240 = 2160 kr.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Gör ett överslag först: ungefär hur mycket borde det bli? Stämmer ditt svar rimligt?',
            placeholder: 'Mitt överslag…',
            hint: 'Runda av: ungefär 25 personer × ungefär 100 kr.',
            discussion: 'Så här kan man tänka: ungefär 26 personer som betalar ungefär 100 kr blir cirka 2600 kr. Det exakta svaret 2160 kr ligger i samma storleksordning – rimligt! Ett överslag hjälper dig att upptäcka om du råkat räkna fel med en tiopotens.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Jämför med grupppriset.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Biografen erbjuder grupppris: 5 biljetter för 350 kr (gäller både barn och vuxna). Klassen köper så många gruppbiljetter som möjligt och betalar vanligt pris för dem som blir över. Vad kostar det totalt? (svara i kronor)',
            placeholder: 'kronor',
            validate: numWhere(n => n === 1830),
            hint: '26 personer – hur många hela grupper om 5 blir det? Hur många blir över, och vad kostar den biljetten?',
            discussion: '26 ÷ 5 = 5 hela grupper (25 personer) för 5 × 350 = 1750 kr. Den 26:e personen blir över och betalar barnbiljett: 80 kr. Totalt 1750 + 80 = 1830 kr. (Alternativet att köpa en sjätte gruppbiljett kostar 6 × 350 = 2100 kr – dyrare, så det lönar sig inte.)',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Vilket alternativ är billigast – vanliga biljetter eller grupppris? Hur mycket sparar klassen?',
            placeholder: 'Billigast är… och de sparar…',
            hint: 'Jämför 2160 kr med vad grupppriset landade på.',
            discussion: 'Så här kan man tänka: vanliga biljetter kostar 2160 kr, grupppris ca 1830 kr. Grupppriset är billigast och klassen sparar cirka 330 kr. Ett grupppris på 350 kr för 5 personer betyder 70 kr per person, vilket är billigare än både barn- (80 kr) och vuxenbiljett (120 kr) – därför lönar det sig.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'När lönar sig grupppriset?',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vad kostar grupppriset PER PERSON? (svara i kronor)',
            placeholder: 'kr per person',
            validate: numWhere(n => n === 70),
            hint: '350 kr delat på 5 personer.',
            discussion: '350 ÷ 5 = 70 kr per person – billigare än både barnbiljett (80 kr) och vuxenbiljett (120 kr).',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Undersök: vid vilket antal personer börjar gruppbiljetten löna sig? Formulera en regel.',
            placeholder: 'Grupppriset lönar sig när… för att…',
            hint: 'Gruppbiljetter säljs i klumpar om 5. Vad händer om man bara är 3 personer och måste köpa en hel gruppbiljett?',
            discussion: 'Så här kan man tänka: per person är grupppriset (70 kr) alltid billigare – MEN man måste köpa hela klumpar om 5. Är man 4 barn kostar vanliga biljetter 4 × 80 = 320 kr, medan en gruppbiljett kostar 350 kr. Då lönar det sig INTE. Är man 5 barn: 400 kr mot 350 kr – nu lönar det sig. Regeln: gruppbiljetten lönar sig när antalet personer är nära en jämn multipel av 5 (och alltid från 5 personer och uppåt för barn). För vuxna lönar den sig redan från 3 personer, eftersom 3 × 120 = 360 kr > 350 kr.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-mynt20',
    worldId: 'fantasy',
    title: 'Pengaproblemet',
    emoji: '🪙',
    context: 'Du har mynt värda 1 kr, 2 kr, 5 kr och 10 kr, och obegränsat antal av varje sort. Du ska betala exakt 20 kr.',
    topicIds: ['addition-strategier', 'huvudrakning', 'statistik-mel'],
    tags: ['Kombinationer', 'Systematik'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta olika sätt att betala.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett sätt att betala exakt 20 kr, t.ex. "10 + 10".',
            placeholder: 't.ex. 10 + 5 + 5',
            validate: (s) => someNums(s, (n) =>
              n.length > 0 && n.every(v => [1, 2, 5, 10].includes(v)) && n.reduce((a, b) => a + b, 0) === 20),
            hint: 'Använd bara mynten 1, 2, 5 och 10 – summan ska bli exakt 20.',
            discussion: 'Exempel: 10+10, 10+5+5, 5+5+5+5, 10+5+2+2+1. Många lösningar fungerar!',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge ett ANNAT sätt att betala 20 kr.',
            placeholder: 'en annan kombination',
            validate: (s) => someNums(s, (n) =>
              n.length > 0 && n.every(v => [1, 2, 5, 10].includes(v)) && n.reduce((a, b) => a + b, 0) === 20),
            hint: 'Byt ut ett stort mynt mot flera mindre.',
            discussion: 'Ett 10-mynt kan bytas mot två 5:or, en 5:a mot två 2:or och en 1:a, och så vidare.',
          },
          {
            id: 'c',
            kind: 'open',
            prompt: 'Ge ett tredje sätt, den här gången UTAN att använda något 10-mynt.',
            placeholder: 'utan tior',
            validate: (s) => someNums(s, (n) =>
              n.length > 0 && n.every(v => [1, 2, 5].includes(v)) && n.reduce((a, b) => a + b, 0) === 20),
            hint: 'Bygg 20 kr av bara 5:or, 2:or och 1:or.',
            discussion: 'T.ex. 5+5+5+5, eller 5+5+5+2+2+1, eller tjugo 1-kronor.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Arbeta systematiskt.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Dela upp problemet: hur många 10-kronor kan ingå? Skriv alla möjliga antal.',
            placeholder: 'ett tal',
            targets: ['0', '1', '2'],
            hint: 'Kan man använda tre 10-kronor för att betala 20 kr?',
            discussion: 'Man kan använda 0, 1 eller 2 tiokronor. Tre skulle bli 30 kr – för mycket. Att dela in i fall efter det största myntet gör problemet överskådligt.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv en metod för att hitta ALLA sätt att betala 20 kr, utan att missa någon kombination eller räkna någon dubbelt.',
            placeholder: 'Min metod…',
            hint: 'Bestäm först antalet 10:or. Bestäm sedan antalet 5:or. Sedan 2:or. Vad återstår då?',
            discussion: 'Så här kan man tänka: arbeta uppifrån och ned. Välj först antal 10-kronor (0, 1 eller 2). För varje sådant val, gå igenom alla möjliga antal 5-kronor. För varje sådant val, gå igenom alla möjliga antal 2-kronor. Resten fylls alltid ut med 1-kronor – och eftersom 1-kronorna bestäms automatiskt räknas ingen kombination dubbelt. Denna "trädmetod" fungerar för alla växlingsproblem.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Generalisera till andra belopp.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Hur skulle du kunna bestämma ANTALET lösningar utan att skriva upp dem en och en?',
            placeholder: 'Man skulle kunna…',
            hint: 'Om du löser problemet för 5 kr och 10 kr först – kan du använda de svaren för att bygga vidare?',
            discussion: 'Så här kan man tänka: man kan bygga upp svaret stegvis. Räkna först hur många sätt det finns att betala varje mindre belopp med bara 1-kronor (1 sätt), sedan med 1:or och 2:or, sedan med 1:or, 2:or och 5:or, och sist med alla mynt. Varje ny myntsort byggs på de tidigare resultaten. Det här är grundidén i dynamisk programmering – man återanvänder svaren på mindre delproblem i stället för att räkna om allt.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Vad händer om summan i stället är 50 kr? Blir det fler eller färre lösningar – och varför? Ser du ett mönster?',
            placeholder: 'Jag tror att… för att…',
            hint: 'Ju större belopp, desto fler sätt att kombinera mynten. Växer antalet långsamt eller snabbt?',
            discussion: 'Så här kan man tänka: antalet lösningar växer snabbt när beloppet ökar, eftersom varje extra krona öppnar många nya kombinationer. Ökningen är inte proportionell (dubbelt belopp ger långt mer än dubbelt så många sätt) utan växer betydligt snabbare än så. Mönstret beror på myntens valörer: mynt som "passar in i varandra" (som 1, 2, 5, 10) ger särskilt många kombinationer.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-tanker-tal',
    worldId: 'fantasy',
    title: 'Jag tänker på ett tal',
    emoji: '🎯',
    context: 'Jag tänker på ett heltal mellan 1 och 100. Talet är större än 20, mindre än 80, delbart med 4 men inte delbart med 8.',
    topicIds: ['primtal-faktorer', 'division-steg-2', 'taluppfattning-2'],
    tags: ['Villkor', 'Hitta alla', 'Konstruera'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta ett tal som passar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hitta ett tal som uppfyller ALLA villkoren.',
            placeholder: 't.ex. 28',
            validate: numWhere(n => n > 20 && n < 80 && n % 4 === 0 && n % 8 !== 0),
            hint: 'Ta ett tal i 4:ans tabell mellan 20 och 80. Kolla sedan att det INTE går att dela med 8.',
            discussion: 'Tal som fungerar: 28, 36, 44, 52, 60, 68 och 76. Kontroll av 28: 28 ÷ 4 = 7 ✓, men 28 ÷ 8 = 3,5 (går inte jämnt) ✓',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Ta ett tal som ÄR delbart med 8, t.ex. 32. Varför faller det bort?',
            placeholder: '32 faller bort för att…',
            hint: 'Läs villkoren igen. Vilket av dem bryter 32 mot?',
            discussion: 'Så här kan man tänka: 32 är delbart med 4 (32 ÷ 4 = 8) och ligger mellan 20 och 80 – men 32 ÷ 8 = 4 går jämnt ut, så villkoret "inte delbart med 8" bryts. Talet faller därför bort.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta alla tal som passar.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta ALLA tal som uppfyller villkoren.',
            placeholder: 'ett tal i taget',
            targets: rangeWhere(21, 79, n => n % 4 === 0 && n % 8 !== 0),
            hint: 'Gå igenom 4:ans tabell från 24 och uppåt, och stryk alla som också går att dela med 8.',
            discussion: 'Talen är 28, 36, 44, 52, 60, 68 och 76 – sju stycken. De ligger 8 steg isär, eftersom varannan multipel av 4 är delbar med 8.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Varför ligger talen exakt 8 steg isär? Förklara.',
            placeholder: 'Det beror på…',
            hint: 'Skriv 4:ans tabell mellan 20 och 80 och markera vilka som är delbara med 8.',
            discussion: 'Så här kan man tänka: multiplerna av 4 är 24, 28, 32, 36, 40, 44 … Varannan av dem (24, 32, 40 …) är också delbar med 8. Kvar blir varannan multipel av 4, och eftersom multiplerna av 4 ligger 4 steg isär, ligger de kvarvarande 8 steg isär.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Konstruera ett eget problem.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Skapa en egen uppsättning villkor där det bara finns ETT möjligt tal. Skriv dina villkor och ditt tal.',
            placeholder: 'Mina villkor är… och talet är…',
            hint: 'Utgå från de sju talen ovan. Vilket extra villkor sållar bort alla utom ett?',
            discussion: 'Så här kan man tänka: börja med ett villkor som ger flera tal (t.ex. de sju talen ovan) och lägg sedan till villkor tills bara ett återstår. Exempel: "större än 20, mindre än 80, delbart med 4, inte delbart med 8, och siffersumman är 10" → av 28 (10 ✓), 36 (9), 44 (8), 52 (7), 60 (6), 68 (14), 76 (13) återstår bara 28. Ett annat sätt är att välja talet först och sedan skräddarsy villkoren.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Förklara varför just DITT tal är det enda möjliga. Hur vet du att inget annat tal passar?',
            placeholder: 'Mitt tal är det enda för att…',
            hint: 'Gå igenom alla kandidater och visa vilket villkor som stoppar var och en.',
            discussion: 'Så här kan man tänka: ett fullständigt resonemang går igenom ALLA kandidater och visar exakt vilket villkor som utesluter var och en. Det räcker inte att säga "jag hittade bara ett" – man måste visa att inget annat KAN fungera. Det är skillnaden mellan att gissa och att bevisa.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-fantasy-omkretsjakten',
    worldId: 'fantasy',
    title: 'Omkretsjakten',
    emoji: '🌾',
    context: 'Du har 20 meter staket och ska bygga en rektangulär hage. Sidorna får vara vilka längder som helst (även decimaltal).',
    topicIds: ['geometri-omfang', 'geometri-mel', 'decimaler'],
    tags: ['Optimering', 'Bevisa'],
    levels: [
      {
        level: 'E',
        intro: 'Hitta möjliga hagar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge en möjlig längd och bredd på hagen. Skriv två tal, t.ex. "3 och 7".',
            placeholder: 't.ex. 3 och 7',
            validate: (s) => someNums(s, (n) =>
              n.length >= 2 && n[0] > 0 && n[1] > 0 && Math.abs(2 * (n[0] + n[1]) - 20) < 1e-9),
            hint: 'Alla fyra sidorna ska bli 20 m tillsammans, så längd + bredd = 10.',
            discussion: 'Alla par där längd + bredd = 10 fungerar: 1×9, 2×8, 3×7, 4×6, 5×5 – och även decimaltal som 2,5×7,5.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge en ANNAN möjlig hage.',
            placeholder: 'två tal',
            validate: (s) => someNums(s, (n) =>
              n.length >= 2 && n[0] > 0 && n[1] > 0 && Math.abs(2 * (n[0] + n[1]) - 20) < 1e-9),
            hint: 'Välj ett annat par tal som blir 10 tillsammans.',
            discussion: 'Det finns oändligt många om man tillåter decimaltal!',
          },
          {
            id: 'c',
            kind: 'open',
            prompt: 'Ge en tredje hage och räkna ut dess area. Skriv arean i m².',
            placeholder: 'area i m²',
            validate: numWhere(n => n > 0 && n <= 25),
            hint: 'Area = längd × bredd. Kan arean bli större än 25?',
            discussion: 'Areorna varierar: 1×9 = 9, 2×8 = 16, 3×7 = 21, 4×6 = 24 och 5×5 = 25 m². Ingen hage kan få större area än 25 m².',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök vilken hage som blir störst.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vilken hage får STÖRST area? Skriv arean i m².',
            placeholder: 'största arean',
            validate: numWhere(n => n === 25),
            hint: 'Prova flera alternativ och jämför: 1×9, 2×8, 3×7, 4×6, 5×5.',
            discussion: 'Störst area får kvadraten 5×5 = 25 m².',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Undersök flera alternativ och beskriv vad som händer med arean när hagen blir mer långsmal.',
            placeholder: 'När hagen blir långsmal…',
            hint: 'Jämför areorna: 9, 16, 21, 24, 25. Hur förändras de?',
            discussion: 'Så här kan man tänka: ju mer långsmal hagen blir, desto MINDRE blir arean, trots att staketet är lika långt. Areorna växer mot mitten (25 m² vid kvadraten) och minskar symmetriskt åt båda håll. Med extremt långsmala hagar (t.ex. 0,5×9,5 = 4,75 m²) blir arean nästan noll.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Bevisa att kvadraten är bäst.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Kan du VISA att den kvadratiska hagen ger störst area? Förklara utan att bara säga "det syns i tabellen".',
            placeholder: 'Mitt resonemang…',
            hint: 'Kalla sidorna 5 + x och 5 − x (de blir alltid 10 tillsammans). Vad blir arean uttryckt i x?',
            discussion: 'Så här kan man tänka (ett riktigt bevis): eftersom längd + bredd = 10 kan sidorna skrivas som 5 + x och 5 − x, där x är avvikelsen från kvadraten. Arean blir då:\n\nA = (5 + x)(5 − x) = 25 − x²\n\nEftersom x² alltid är noll eller positivt, är 25 − x² ALLTID mindre än eller lika med 25. Likhet gäller bara när x = 0, det vill säga när båda sidorna är 5 – kvadraten. Detta bevisar att kvadraten ger störst area, för ALLA sidlängder, inte bara de vi råkade testa.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Gäller samma sak för alla omkretsar? Vad blir största arean om staketet är 100 m? Formulera en allmän regel.',
            placeholder: 'Regeln är… och med 100 m blir arean…',
            hint: 'Med omkretsen O blir varje sida i kvadraten O ÷ 4. Vad blir arean då?',
            discussion: 'Så här kan man tänka: ja, samma resonemang fungerar för alla omkretsar. Med omkretsen O blir kvadratens sida O/4 och den största arean (O/4)². Med O = 100 m: sidan blir 25 m och arean 625 m². Allmän regel: bland alla rektanglar med given omkrets har kvadraten störst area, och den arean är (O/4)².',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SCI-FI VÄRLDEN (Nivå 7–9)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-scifi-talet100',
    worldId: 'scifi',
    title: 'Talet 100',
    emoji: '💯',
    context: 'Du har siffrorna 1, 2, 3, 4, 5 och 6. Med hjälp av räknesätt (+, −, ×, ÷) och parenteser ska du bygga uttryck med bestämda värden. Varje siffra får användas högst en gång.',
    topicIds: ['prioritering', 'forenkla-uttryck', 'huvudrakning'],
    tags: ['Uttryck', 'Kreativitet', 'Prioriteringsregler'],
    levels: [
      {
        level: 'E',
        intro: 'Bygg ett uttryck som blir 10.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Använd fyra av siffrorna 1–6 och skapa ett uttryck som blir 10. Skriv uttrycket, t.ex. "1+2+3+4".',
            placeholder: 't.ex. 1+2+3+4',
            validate: (s) => {
              const expr = s.replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s/g, '');
              if (!/^[1-6+\-*/()]+$/.test(expr)) return false;
              const digits = expr.match(/\d/g) ?? [];
              if (digits.length !== 4) return false;
              if (new Set(digits).size !== 4) return false;
              try {
                // eslint-disable-next-line no-new-func
                const v = Function(`"use strict";return(${expr});`)();
                return typeof v === 'number' && Math.abs(v - 10) < 1e-9;
              } catch { return false; }
            },
            hint: 'Prova att bara addera fyra av siffrorna. Vilka fyra blir 10 tillsammans?',
            discussion: 'Exempel: 1+2+3+4 = 10, eller 6+3+2−1 = 10, eller 2×3+5−1 = 10. Det finns många lösningar!',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Nu blir det svårare: bygg 100.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Använd siffrorna 1–6 (varje högst en gång) och skapa ett uttryck som blir exakt 100.',
            placeholder: 'skriv ditt uttryck, t.ex. (2+3)*4*5',
            validate: (s) => {
              const expr = s.replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s/g, '');
              if (!/^[1-6+\-*/()]+$/.test(expr)) return false;
              const digits = expr.match(/\d/g) ?? [];
              if (digits.length === 0) return false;
              if (new Set(digits).size !== digits.length) return false;
              try {
                // eslint-disable-next-line no-new-func
                const v = Function(`"use strict";return(${expr});`)();
                return typeof v === 'number' && Math.abs(v - 100) < 1e-9;
              } catch { return false; }
            },
            hint: 'Tänk på faktorer: 100 = 4 × 25 = 10 × 10 = 2 × 50. Kan du bygga 25 av några siffror och 4 av andra?',
            discussion: 'Exempel som fungerar: (2+3)×(4×5) = 5×20 = 100, eller (1+4)×(6×3)+... Prova också 5×4×(2+3) = 100. Nyckeln är att faktorisera 100 och bygga varje faktor av några siffror.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv din strategi. Hur tänkte du för att komma fram till lösningen?',
            placeholder: 'Min strategi…',
            hint: 'Utgick du från 100:s faktorer, eller provade du dig fram?',
            discussion: 'Så här kan man tänka: en effektiv strategi är att faktorisera målet. 100 = 4 × 25 = 5 × 20 = 10 × 10 = 2 × 50. Sedan försöker man bygga varje faktor av tillgängliga siffror, t.ex. 20 = 4 × 5 och 5 = 2 + 3, vilket ger (2+3) × 4 × 5 = 100. Att arbeta bakifrån från målet är ofta mycket effektivare än att prova slumpmässigt.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Hitta flera lösningar och resonera om hur många som finns.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta så många OLIKA uttryck som möjligt som blir 100. Skriv minst 2 olika.',
            placeholder: 'ett uttryck i taget',
            need: 2,
            validate: (s) => {
              const expr = s.replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s/g, '');
              if (!/^[1-6+\-*/()]+$/.test(expr)) return false;
              const digits = expr.match(/\d/g) ?? [];
              if (digits.length === 0) return false;
              if (new Set(digits).size !== digits.length) return false;
              try {
                // eslint-disable-next-line no-new-func
                const v = Function(`"use strict";return(${expr});`)();
                return typeof v === 'number' && Math.abs(v - 100) < 1e-9;
              } catch { return false; }
            },
            hint: 'Har du hittat en lösning? Byt plats på faktorerna eller bygg samma faktor på ett annat sätt.',
            discussion: 'Det finns flera lösningar, bl.a. (2+3)×4×5, 5×4×(2+3) och (1+4)×(2×... ). Många lösningar är "samma" matematiskt men skrivna på olika sätt.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Kan du avgöra om det finns fler lösningar – eller bevisa att du hittat alla? Vad gör den frågan svår?',
            placeholder: 'Mitt resonemang…',
            hint: 'Hur många sätt finns det överhuvudtaget att kombinera 6 siffror med 4 räknesätt och parenteser?',
            discussion: 'Så här kan man tänka: att bevisa att man hittat ALLA lösningar är mycket svårare än att hitta en. Antalet möjliga uttryck är enormt – man kan välja vilka siffror som används, i vilken ordning, vilka räknesätt och hur parenteserna sätts. För att vara säker skulle man behöva söka igenom alla kombinationer systematiskt (vilket en dator kan göra). Detta illustrerar en viktig skillnad i matematik: det räcker med ETT exempel för att visa att något är möjligt, men för att visa att något är omöjligt eller att en lista är fullständig krävs ett heltäckande resonemang.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-scifi-monster-algebra',
    worldId: 'scifi',
    title: 'Robotarnas byggnadsställning',
    emoji: '🤖',
    context: 'Robotar bygger torn av stavar. Figur 1 har 4 stavar, figur 2 har 7 stavar och figur 3 har 10 stavar.',
    topicIds: ['algebra-steg-1', 'algebra-steg-2', 'forenkla-uttryck', 'ekvationer-steg-2'],
    tags: ['Mönster', 'Algebra', 'Bevisa'],
    levels: [
      {
        level: 'E',
        intro: 'Fortsätt mönstret.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många stavar har figur 4?',
            placeholder: 'antal stavar',
            validate: numWhere(n => n === 13),
            hint: 'Hur många stavar tillkommer per steg?',
            discussion: 'Mönstret ökar med 3: 4, 7, 10, 13. Figur 4 har 13 stavar.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Hur många stavar har figur 6?',
            placeholder: 'antal stavar',
            validate: numWhere(n => n === 19),
            hint: 'Fortsätt: 13, 16, 19 …',
            discussion: 'Figur 5 har 16 och figur 6 har 19 stavar.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta formeln.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många stavar har figur 50?',
            placeholder: 'antal stavar',
            validate: numWhere(n => n === 151),
            hint: 'Från figur 1 till figur 50 är det 49 steg om 3 stavar. Eller använd formeln 3n + 1.',
            discussion: 'Figur 50: 4 + 49 × 3 = 4 + 147 = 151 stavar. Med formeln: 3 × 50 + 1 = 151.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Skriv en formel för antalet stavar i figur n. Förklara vad varje del i formeln betyder i bilden.',
            placeholder: 'Formeln är… där…',
            hint: 'Vad är "startvärdet" och vad är "ökningen per steg"?',
            discussion: 'Så här kan man tänka: formeln är 3n + 1. "3n" betyder att varje figur består av n block om 3 stavar vardera, och "+1" är den extra staven som binder ihop början. Man kan också härleda den som 4 + 3(n − 1) = 3n + 1 – samma formel, olika sätt att se figuren. Att kunna KOPPLA formelns delar till bilden är det som skiljer förståelse från utantillkunskap.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Vänd på problemet och resonera om vad som är möjligt.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vilken figur består av 100 stavar? Om ingen figur gör det, skriv 0.',
            placeholder: 'figurnummer eller 0',
            validate: numWhere(n => n === 33 || n === 0),
            hint: 'Lös 3n + 1 = 100. Blir n ett heltal?',
            discussion: '3n + 1 = 100 ⇒ 3n = 99 ⇒ n = 33. Figur 33 har exakt 100 stavar ✓',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Kan någon figur bestå av exakt 99 stavar? Bevisa ditt svar.',
            placeholder: 'Ja/nej – och beviset…',
            hint: 'Lös 3n + 1 = 99. Vad händer med n?',
            discussion: 'Så här kan man tänka (bevis): 3n + 1 = 99 ⇒ 3n = 98 ⇒ n = 98/3 ≈ 32,67. Eftersom n måste vara ett HELTAL (det finns ingen figur 32,67) kan ingen figur ha 99 stavar. Ett annat sätt att se det: alla antal i mönstret ger resten 1 vid division med 3 (4, 7, 10, 13 …), men 99 är jämnt delbart med 3 och ger resten 0. Alltså kan 99 aldrig förekomma.',
          },
          {
            id: 'c',
            kind: 'reflect',
            prompt: 'Vilka antal stavar är överhuvudtaget möjliga? Formulera en regel med hjälp av rester.',
            placeholder: 'Möjliga antal är de som…',
            hint: 'Titta på 4, 7, 10, 13, 16 … Vad blir resten när du delar dem med 3?',
            discussion: 'Så här kan man tänka: alla antal har formen 3n + 1, vilket betyder att de ger RESTEN 1 vid division med 3. Talen 4, 7, 10, 13, 16 … ger alla resten 1. Ett tal är alltså möjligt precis när det ger resten 1 vid division med 3 (och är minst 4). Detta är ett kraftfullt sätt att avgöra möjlighet utan att räkna sig fram.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-scifi-abonnemang',
    worldId: 'scifi',
    title: 'Två abonnemang',
    emoji: '📡',
    context: 'Rymdstationen kan välja mellan två abonnemang för datatrafik.\n\nAbonnemang A: 200 kr i fast avgift + 20 kr per GB.\nAbonnemang B: 500 kr i fast avgift + 5 kr per GB.',
    topicIds: ['rata-linjen', 'ekvationer-steg-2', 'funktioner', 'koordinatsystem'],
    tags: ['Linjära modeller', 'Jämföra', 'Ekvation'],
    levels: [
      {
        level: 'E',
        intro: 'Räkna ut kostnader.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vad kostar abonnemang A om stationen använder 10 GB? (svara i kronor)',
            placeholder: 'kronor',
            validate: numWhere(n => n === 400),
            hint: 'Fast avgift plus 20 kr för varje GB.',
            discussion: 'A: 200 + 20 × 10 = 200 + 200 = 400 kr.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Vad kostar abonnemang B vid 10 GB? (svara i kronor)',
            placeholder: 'kronor',
            validate: numWhere(n => n === 550),
            hint: '500 kr fast plus 5 kr per GB.',
            discussion: 'B: 500 + 5 × 10 = 500 + 50 = 550 kr. Vid 10 GB är A billigast.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök när det lönar sig att byta.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vid hur många GB kostar abonnemangen exakt lika mycket?',
            placeholder: 'antal GB',
            validate: numWhere(n => n === 20),
            hint: 'Ställ upp en ekvation: 200 + 20x = 500 + 5x.',
            discussion: '200 + 20x = 500 + 5x ⇒ 15x = 300 ⇒ x = 20 GB. Då kostar båda 600 kr.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Vilket abonnemang ska stationen välja? Förklara hur svaret beror på hur mycket data som används.',
            placeholder: 'Man ska välja… när…',
            hint: 'Testa ett värde under 20 GB och ett över. Vad händer?',
            discussion: 'Så här kan man tänka: vid mindre än 20 GB är A billigast (t.ex. 10 GB: 400 kr mot 550 kr). Vid exakt 20 GB kostar de lika (600 kr). Vid mer än 20 GB är B billigast (t.ex. 40 GB: A = 1000 kr, B = 700 kr). Regeln: använder man lite data lönar sig låg fast avgift, använder man mycket lönar sig lågt pris per GB.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Generalisera modellen.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Beskriv kostnaderna som två räta linjer. Vad betyder m-värdet och k-värdet i det här sammanhanget?',
            placeholder: 'A: y = … B: y = … där k betyder…',
            hint: 'Skriv kostnaden som y = kx + m.',
            discussion: 'Så här kan man tänka: A ger y = 20x + 200 och B ger y = 5x + 500. Här är m-värdet (200 respektive 500) den FASTA avgiften – vad man betalar även vid 0 GB, alltså där linjen skär y-axeln. k-värdet (20 respektive 5) är priset PER GB – linjens lutning. Skärningspunkten mellan linjerna (20, 600) är precis den punkt där abonnemangen kostar lika mycket.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Ett tredje abonnemang C har ingen fast avgift men kostar 30 kr per GB. När lönar sig C? Kan C någonsin vara billigast vid stor användning? Förklara.',
            placeholder: 'C lönar sig när… och vid stor användning…',
            hint: 'C ger y = 30x. Jämför lutningarna – vilken linje växer snabbast?',
            discussion: 'Så här kan man tänka: C ger y = 30x. Vid mycket liten användning är C billigast (vid 0 GB kostar C ingenting). C blir dyrare än A när 30x > 20x + 200, alltså när x > 20 GB. Eftersom C har den STÖRSTA lutningen (30) kommer C förr eller senare att bli dyrast av alla – vid stor användning kan C aldrig vara billigast. Lutningen avgör vad som händer i längden, medan den fasta avgiften avgör vad som händer i början.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-scifi-skala',
    worldId: 'scifi',
    title: 'Modellen av rymdbasen',
    emoji: '🏗️',
    context: 'En modell av rymdbasen byggs i skala 1:10. Det betyder att varje längd på modellen är 10 gånger mindre än i verkligheten.',
    topicIds: ['skala', 'proportioner', 'geometri-area', 'geometri-volym'],
    tags: ['Skala', 'Area', 'Volym'],
    levels: [
      {
        level: 'E',
        intro: 'Räkna om längder.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'En vägg är 30 cm på modellen. Hur lång är den i verkligheten? (svara i cm)',
            placeholder: 'cm',
            validate: numWhere(n => n === 300),
            hint: 'Verkligheten är 10 gånger större.',
            discussion: '30 × 10 = 300 cm, alltså 3 m.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'En antenn är 5 m i verkligheten. Hur lång blir den på modellen? (svara i cm)',
            placeholder: 'cm',
            validate: numWhere(n => n === 50),
            hint: 'Gör om 5 m till cm och dela sedan med 10.',
            discussion: '5 m = 500 cm. På modellen: 500 ÷ 10 = 50 cm.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök vad som händer med arean.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Modellens golv är en kvadrat med sidan 20 cm. Hur stor är golvytan på MODELLEN? (svara i cm²)',
            placeholder: 'cm²',
            validate: numWhere(n => n === 400),
            hint: 'Area = sida × sida.',
            discussion: '20 × 20 = 400 cm².',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Hur stor är den VERKLIGA golvytan? (svara i cm²)',
            placeholder: 'cm²',
            validate: numWhere(n => n === 40000),
            hint: 'Räkna ut den verkliga sidan först (20 cm × 10 = 200 cm), och sedan arean.',
            discussion: 'Verklig sida: 200 cm. Verklig area: 200 × 200 = 40 000 cm² (= 4 m²).',
          },
          {
            id: 'c',
            kind: 'reflect',
            prompt: 'Hur många gånger större är den verkliga arean än modellens? Varför är det inte 10 gånger?',
            placeholder: 'Den är … gånger större för att…',
            hint: 'Jämför 40 000 med 400. Både längden OCH bredden blev 10 gånger större.',
            discussion: 'Så här kan man tänka: 40 000 ÷ 400 = 100 gånger större. Anledningen är att BÅDE längden och bredden blir 10 gånger större, så arean blir 10 × 10 = 100 gånger större. Areaskalan är alltså längdskalan i kvadrat. Detta är en av de vanligaste fällorna i skalproblem.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Generalisera till volym.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Modellens vattentank rymmer 2 liter. Hur många liter rymmer den verkliga tanken?',
            placeholder: 'liter',
            validate: numWhere(n => n === 2000),
            hint: 'Volymen växer med skalan i KUBIK: 10³.',
            discussion: 'Volymskalan är 10³ = 1000. Verklig volym: 2 × 1000 = 2000 liter.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Formulera en allmän regel: om längdskalan är k, vad blir då areaskalan och volymskalan? Förklara varför.',
            placeholder: 'Areaskalan blir… och volymskalan… för att…',
            hint: 'Area byggs av 2 längder, volym av 3 längder.',
            discussion: 'Så här kan man tänka: om längdskalan är k blir areaskalan k² och volymskalan k³. Förklaringen är att area är en produkt av TVÅ längder (som var och en skalas med k) och volym av TRE längder. Detta får dramatiska konsekvenser: fördubblar man längden på något blir arean 4 gånger större och volymen 8 gånger större. Det är också därför en modellbåt i skala 1:10 väger 1000 gånger mindre än den riktiga.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-scifi-medelvarde',
    worldId: 'scifi',
    title: 'Sensorernas mätvärden',
    emoji: '📊',
    context: 'En sensor loggar mätvärden. Besättningen analyserar medelvärde, median och hur känsliga måtten är för fel i mätningarna.',
    topicIds: ['statistik', 'statistik-spridning', 'ekvationer-steg-2'],
    tags: ['Statistik', 'Resonemang'],
    levels: [
      {
        level: 'E',
        intro: 'Skapa data med givet medelvärde.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Ge ett exempel på FEM mätvärden som har medelvärdet 10. Skriv de fem talen, t.ex. "8 9 10 11 12".',
            placeholder: 't.ex. 8 9 10 11 12',
            validate: (s) => someNums(s, (n) =>
              n.length === 5 && Math.abs(n.reduce((a, b) => a + b, 0) - 50) < 1e-9),
            hint: 'Om medelvärdet är 10 för fem värden, hur stor måste summan vara?',
            discussion: 'Summan måste vara 5 × 10 = 50. Exempel: 10+10+10+10+10, 8+9+10+11+12 eller 0+0+0+0+50. Alla har medelvärdet 10!',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Ge ett HELT ANNAT exempel på fem värden med medelvärdet 10 – gärna med stor spridning.',
            placeholder: 'fem tal',
            validate: (s) => someNums(s, (n) =>
              n.length === 5 && Math.abs(n.reduce((a, b) => a + b, 0) - 50) < 1e-9),
            hint: 'Så länge summan blir 50 fungerar det. Prova mycket små och mycket stora tal.',
            discussion: 'T.ex. 1+2+3+4+40 = 50. Samma medelvärde kan dölja väldigt olika datamängder – därför behövs spridningsmått!',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök hur måtten påverkas.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Mätvärdena är 2, 4, 6, 8, 10. Ett fel gör att 10 blir 100 i stället. Vad blir det NYA medelvärdet?',
            placeholder: 'nytt medelvärde',
            validate: numWhere(n => n === 24),
            hint: 'Räkna ut den nya summan och dela med 5.',
            discussion: 'Ny summa: 2+4+6+8+100 = 120. Nytt medelvärde: 120 ÷ 5 = 24 (mot 6 tidigare).',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Vad blir den nya MEDIANEN (av 2, 4, 6, 8, 100)?',
            placeholder: 'median',
            validate: numWhere(n => n === 6),
            hint: 'Sortera värdena och ta det mittersta.',
            discussion: 'Sorterat: 2, 4, 6, 8, 100. Mittersta värdet är 6 – exakt samma som innan felet!',
          },
          {
            id: 'c',
            kind: 'reflect',
            prompt: 'Varför påverkades medelvärdet så kraftigt men inte medianen? Vilket mått borde besättningen använda?',
            placeholder: 'Medelvärdet påverkas för att…',
            hint: 'Medelvärdet använder alla värdens storlek. Vad använder medianen?',
            discussion: 'Så här kan man tänka: medelvärdet räknar med varje värdes STORLEK, så ett extremt värde drar iväg hela summan. Medianen bryr sig bara om ORDNINGEN – det mittersta värdet påverkas inte av hur extremt det största är. Vid misstänkta mätfel (extremvärden) är medianen därför ett mer robust mått. Det är samma skäl till att man ofta redovisar medianlön i stället för medellön.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Konstruera data med givna egenskaper.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Konstruera fem värden där medelvärdet är 10 men medianen är 4. Skriv de fem talen.',
            placeholder: 'fem tal',
            validate: (s) => someNums(s, (n) => {
              if (n.length !== 5) return false;
              if (Math.abs(n.reduce((a, b) => a + b, 0) - 50) > 1e-9) return false;
              return Math.abs([...n].sort((a, b) => a - b)[2] - 4) < 1e-9;
            }),
            hint: 'Mittenvärdet ska vara 4. Gör de två minsta små och de två största stora – summan ska bli 50.',
            discussion: 'Exempel: 1, 2, 4, 5, 38 (summa 50, median 4 ✓) eller 0, 4, 4, 4, 38. Knepet är att lägga två värden under 4 och skjuta upp de största värdena för att nå summan 50.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Är det möjligt att ha fem värden där medianen är STÖRRE än medelvärdet? Ge ett exempel eller förklara varför inte.',
            placeholder: 'Ja/nej – exempel eller förklaring…',
            hint: 'Vänd på förra uppgiften: lägg extremvärdet i den NEDRE änden i stället.',
            discussion: 'Så här kan man tänka: ja, det går utmärkt. Exempel: 0, 9, 10, 10, 11 har medianen 10 men medelvärdet (0+9+10+10+11)/5 = 8. När extremvärdet ligger LÅGT dras medelvärdet nedåt medan medianen står still. Regeln: medelvärdet dras alltid mot de extrema värdena, medianen påverkas inte. Om datamängden har en lång svans åt höger är medelvärdet störst; är svansen åt vänster är medianen störst.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-scifi-pythagoras',
    worldId: 'scifi',
    title: 'Rätvinkliga trianglar i rymden',
    emoji: '📐',
    context: 'Navigationsdatorn använder rätvinkliga trianglar med heltalssidor – så kallade pythagoreiska tripplar, t.ex. 3, 4, 5.',
    topicIds: ['pythagoras', 'potenser-steg-1', 'geometri-area'],
    tags: ['Pythagoras', 'Mönster', 'Hitta alla'],
    levels: [
      {
        level: 'E',
        intro: 'Kontrollera och hitta tripplar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'En rätvinklig triangel har kateterna 3 och 4. Hur lång är hypotenusan?',
            placeholder: 'längd',
            validate: numWhere(n => n === 5),
            hint: 'Pythagoras sats: a² + b² = c².',
            discussion: 'c² = 3² + 4² = 9 + 16 = 25 ⇒ c = 5. Trippeln (3, 4, 5) är den mest kända.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Kateterna är 6 och 8. Hur lång är hypotenusan?',
            placeholder: 'längd',
            validate: numWhere(n => n === 10),
            hint: 'Räkna med Pythagoras – eller se om triangeln liknar den förra.',
            discussion: 'c² = 36 + 64 = 100 ⇒ c = 10. Lägg märke till att (6, 8, 10) är (3, 4, 5) förstorad två gånger!',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök mönstret bland tripplar.',
        subTasks: [
          {
            id: 'a',
            kind: 'collect',
            prompt: 'Hitta fler tripplar som bygger på (3, 4, 5) genom att förstora. Skriv hypotenusan för varje, ett tal i taget (minst 3 olika).',
            placeholder: 'hypotenusan',
            need: 3,
            validate: numWhere(n => n > 5 && n % 5 === 0 && n <= 100),
            hint: 'Multiplicera hela trippeln (3, 4, 5) med 2, 3, 4 … Vad händer med hypotenusan?',
            discussion: 'Förstoringar ger (6,8,10), (9,12,15), (12,16,20), (15,20,25) … Hypotenusorna blir 10, 15, 20, 25 – alla multipler av 5.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Varför fungerar det att multiplicera alla tre sidorna med samma tal? Förklara.',
            placeholder: 'Det fungerar för att…',
            hint: 'Vad händer med a² + b² = c² om du byter a mot 2a, b mot 2b och c mot 2c?',
            discussion: 'Så här kan man tänka: om a² + b² = c² och vi multiplicerar alla sidor med k får vi (ka)² + (kb)² = k²a² + k²b² = k²(a² + b²) = k²c² = (kc)². Likheten gäller alltså fortfarande! Geometriskt betyder det att en likformig förstoring bevarar vinklarna – triangeln förblir rätvinklig.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Hitta helt nya tripplar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hitta en pythagoreisk trippel som INTE är en förstoring av (3, 4, 5). Skriv hypotenusan.',
            placeholder: 'hypotenusan',
            validate: numWhere(n => [13, 17, 25, 29, 37, 41, 53, 61, 65, 73, 85, 89, 97].includes(n)),
            hint: 'Prova (5, 12, ?) eller (8, 15, ?). Räkna ut hypotenusan med Pythagoras.',
            discussion: 'Exempel: (5, 12, 13) eftersom 25 + 144 = 169 = 13². Andra är (8, 15, 17), (7, 24, 25) och (20, 21, 29). Dessa är "primitiva" tripplar – de går inte att förkorta.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Finns det oändligt många pythagoreiska tripplar? Motivera ditt svar.',
            placeholder: 'Jag tror… för att…',
            hint: 'Om du har en trippel – kan du alltid skapa en ny av den?',
            discussion: 'Så här kan man tänka: ja, det finns oändligt många. Ett enkelt argument: ta (3, 4, 5) och multiplicera med 2, 3, 4, 5 … Varje k ger en ny giltig trippel, och eftersom det finns oändligt många heltal k finns det oändligt många tripplar. Dessutom finns det oändligt många PRIMITIVA tripplar (som inte är förstoringar) – de kan genereras med formeln a = m² − n², b = 2mn, c = m² + n² för heltal m > n > 0. Med m=2, n=1 får man (3,4,5); med m=3, n=2 får man (5,12,13).',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RYMD AKADEMIN (Nivå 10)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-gym-optimering',
    worldId: 'gym',
    title: 'Hagen mot väggen',
    emoji: '🧮',
    context: 'En rektangulär hage ska byggas med 100 m staket. Den ena långsidan utgörs av en befintlig vägg och behöver inget staket – staketet räcker alltså till tre sidor.',
    topicIds: ['derivata', 'funktioner', 'ekvationer-gym'],
    tags: ['Optimering', 'Derivata', 'Modellering'],
    levels: [
      {
        level: 'E',
        intro: 'Utforska några möjliga hagar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Om de två kortsidorna är 20 m vardera – hur lång blir långsidan? (svara i meter)',
            placeholder: 'meter',
            validate: numWhere(n => n === 60),
            hint: 'Staketet räcker till två kortsidor och EN långsida, totalt 100 m.',
            discussion: '2 × 20 = 40 m går åt till kortsidorna. Kvar till långsidan: 100 − 40 = 60 m.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Vad blir arean på den hagen? (svara i m²)',
            placeholder: 'm²',
            validate: numWhere(n => n === 1200),
            hint: 'Area = kortsida × långsida.',
            discussion: 'A = 20 × 60 = 1200 m².',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Ställ upp en modell.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Kalla kortsidan x. Skriv ett uttryck för långsidan och ett för arean A(x).',
            placeholder: 'Långsidan är… och A(x) =…',
            hint: 'Två kortsidor (2x) plus en långsida ska bli 100.',
            discussion: 'Så här kan man tänka: staketet ger 2x + långsidan = 100, alltså långsidan = 100 − 2x. Arean blir A(x) = x(100 − 2x) = 100x − 2x². Detta är en andragradsfunktion med negativ x²-term, så den har ett maximum.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Testa x = 25 m. Vad blir arean? (svara i m²)',
            placeholder: 'm²',
            validate: numWhere(n => n === 1250),
            hint: 'A(25) = 25 × (100 − 50).',
            discussion: 'A(25) = 25 × 50 = 1250 m² – större än 1200 m²! Vi närmar oss maximum.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Optimera och jämför med det klassiska fallet.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vilken kortsida x ger STÖRST area? (svara i meter)',
            placeholder: 'meter',
            validate: numWhere(n => n === 25),
            hint: 'Derivera A(x) = 100x − 2x² och sätt derivatan lika med noll.',
            discussion: "A′(x) = 100 − 4x = 0 ⇒ x = 25 m. Långsidan blir då 100 − 50 = 50 m och arean 1250 m².",
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Den optimala hagen är 25 × 50 m – alltså INTE en kvadrat. Varför inte, när kvadraten annars ger störst area?',
            placeholder: 'Det beror på att…',
            hint: 'I det vanliga problemet kostar alla fyra sidor staket. Vad är annorlunda här?',
            discussion: 'Så här kan man tänka: när alla fyra sidor kräver staket är kvadraten optimal. Men här är den ena långsidan GRATIS (väggen), så det lönar sig att göra hagen bredare i den riktningen. Resultatet blir att långsidan är exakt dubbelt så lång som kortsidan. En elegant tumregel: i optimum går hälften av staketet (50 m) åt till långsidan och hälften (2 × 25 m) till kortsidorna. Villkoren styr alltså vilken form som är optimal – man kan inte blint återanvända "kvadraten är bäst".',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-gym-talfoljd',
    worldId: 'gym',
    title: 'Summan av talföljden',
    emoji: '➕',
    context: 'En signal består av talen 1, 2, 3, 4, … Besättningen behöver kunna summera långa talföljder snabbt.',
    topicIds: ['talfoljder', 'funktioner', 'potenslagar-gym'],
    tags: ['Talföljder', 'Summor', 'Bevisa'],
    levels: [
      {
        level: 'E',
        intro: 'Summera korta följder.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vad blir summan av talen 1 + 2 + 3 + … + 10?',
            placeholder: 'summan',
            validate: numWhere(n => n === 55),
            hint: 'Para ihop talen: 1 + 10 = 11, 2 + 9 = 11 … Hur många par blir det?',
            discussion: 'Paren 1+10, 2+9, 3+8, 4+7, 5+6 ger 5 par som var och en blir 11: 5 × 11 = 55.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv paringstricket. Varför blir alla par lika stora?',
            placeholder: 'Tricket går ut på…',
            hint: 'Vad händer när du går ett steg framåt i ena änden och ett steg bakåt i den andra?',
            discussion: 'Så här kan man tänka: paras det första talet med det sista, det andra med det näst sista och så vidare, blir varje par lika stort. När man går ett steg uppåt i ena änden går man ett steg nedåt i den andra – ökningen och minskningen tar ut varandra. Detta är Gauss klassiska trick.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta formeln.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vad blir summan 1 + 2 + … + 100?',
            placeholder: 'summan',
            validate: numWhere(n => n === 5050),
            hint: '50 par som vart och ett blir 101.',
            discussion: '50 par × 101 = 5050. (Formeln: n(n+1)/2 = 100 × 101 / 2 = 5050.)',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Skriv en formel för summan 1 + 2 + … + n. Förklara hur formeln följer av paringstricket.',
            placeholder: 'Formeln är… för att…',
            hint: 'Hur många par blir det, och hur stort är varje par?',
            discussion: 'Så här kan man tänka: varje par blir n + 1 och det finns n/2 par, alltså S = n(n + 1)/2. Ett elegantare bevis: skriv summan framlänges och baklänges under varandra och addera kolonnvis – varje kolumn blir n + 1, och det finns n kolumner. Då har man räknat summan två gånger: 2S = n(n + 1), alltså S = n(n+1)/2. Den varianten fungerar även för udda n, där paringen annars blir klurig.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Generalisera till andra följder.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vad blir summan av de 50 första UDDA talen (1 + 3 + 5 + … )?',
            placeholder: 'summan',
            validate: numWhere(n => n === 2500),
            hint: 'Räkna först ut summan av de 1, 2, 3 och 4 första udda talen. Ser du ett mönster?',
            discussion: 'Summorna blir 1, 4, 9, 16 … alltså kvadrattal! Summan av de n första udda talen är n². För n = 50: 50² = 2500.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Varför blir summan av de n första udda talen exakt n²? Ge ett resonemang eller en bild.',
            placeholder: 'Det beror på…',
            hint: 'Tänk på en kvadrat som byggs ut med ett "L" i taget. Hur många rutor har varje L?',
            discussion: 'Så här kan man tänka (geometriskt bevis): börja med 1 ruta (1×1). Lägg till ett L-format lager med 3 rutor → 2×2 = 4. Nästa L har 5 rutor → 3×3 = 9. Varje nytt L innehåller nästa udda tal och gör kvadraten ett steg större. Efter n lager har man en n×n-kvadrat, alltså n² rutor. Algebraiskt: summan är en aritmetisk följd med a₁ = 1 och aₙ = 2n − 1, så S = n(1 + 2n − 1)/2 = n·2n/2 = n².',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-gym-exponentiell',
    worldId: 'gym',
    title: 'Linjärt eller exponentiellt?',
    emoji: '📈',
    context: 'Två kolonier studeras.\n\nKoloni A börjar med 100 individer och ökar med 50 individer per dag.\nKoloni B börjar med 10 individer och fördubblas varje dag.',
    topicIds: ['exponentialfunktioner', 'logaritmer', 'funktioner', 'rata-linjen-gym'],
    tags: ['Exponentiell tillväxt', 'Jämföra modeller'],
    levels: [
      {
        level: 'E',
        intro: 'Räkna ut storlekar.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många individer har koloni A efter 4 dagar?',
            placeholder: 'antal',
            validate: numWhere(n => n === 300),
            hint: 'Starta på 100 och lägg till 50 fyra gånger.',
            discussion: 'A: 100 + 4 × 50 = 300 individer.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Hur många individer har koloni B efter 4 dagar?',
            placeholder: 'antal',
            validate: numWhere(n => n === 160),
            hint: 'Fördubbla fyra gånger: 10 → 20 → 40 → …',
            discussion: 'B: 10 → 20 → 40 → 80 → 160 individer. Efter 4 dagar är A fortfarande mycket större.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Undersök när B kommer ikapp.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Efter hur många HELA dagar är koloni B för första gången större än koloni A?',
            placeholder: 'antal dagar',
            validate: numWhere(n => n === 6),
            hint: 'Gör en tabell dag för dag. A: 100, 150, 200 … B: 10, 20, 40, 80, 160, 320 …',
            discussion: 'Dag 5: A = 350, B = 320 (A störst). Dag 6: A = 400, B = 640 (B störst!). Svaret är 6 dagar.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Beskriv skillnaden mellan de två tillväxttyperna. Vad är det som gör att B hinner ikapp trots den dåliga starten?',
            placeholder: 'Skillnaden är…',
            hint: 'A lägger till samma ANTAL varje dag. Vad gör B?',
            discussion: 'Så här kan man tänka: A växer LINJÄRT – lika många individer läggs till varje dag (+50). B växer EXPONENTIELLT – antalet multipliceras med samma FAKTOR varje dag (×2). I början är A:s tillskott mycket större, men B:s tillskott växer för varje dag (10, 20, 40, 80 …). Exponentiell tillväxt går alltid om linjär tillväxt förr eller senare, oavsett hur dålig starten är.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Lös algebraiskt och generalisera.',
        subTasks: [
          {
            id: 'a',
            kind: 'reflect',
            prompt: 'Ställ upp funktioner för båda kolonierna och beskriv hur man löser "när är B > A" algebraiskt. Varför är den ekvationen svår?',
            placeholder: 'A(t) = … B(t) = … och för att lösa…',
            hint: 'Ekvationen blir 10 · 2^t = 100 + 50t. Kan du få t ensamt?',
            discussion: 'Så här kan man tänka: A(t) = 100 + 50t och B(t) = 10 · 2^t. Villkoret B > A ger 10 · 2^t > 100 + 50t. Denna olikhet går INTE att lösa algebraiskt med vanliga metoder, eftersom t förekommer både i en exponent och linjärt – den saknar sluten lösning. Man löser den i stället grafiskt eller numeriskt (t.ex. genom att pröva heltal, som vi gjorde i tabellen). Det är viktigt att inse att alla ekvationer inte går att lösa exakt.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Koloni B har fördubblingstiden 1 dag. Hur lång tid tar det för B att bli 1000 gånger större? Använd logaritmer och förklara.',
            placeholder: 'Det tar … dagar för att…',
            hint: 'Lös 2^t = 1000 med logaritmer.',
            discussion: 'Så här kan man tänka: 2^t = 1000 ⇒ t = lg 1000 / lg 2 = 3 / 0,301 ≈ 9,97 dagar, alltså cirka 10 dagar. En bra tumregel: 2¹⁰ = 1024 ≈ 1000, så tio fördubblingar ger ungefär tusenfaldigt. Det är därför exponentiell tillväxt är så dramatisk – 20 dagar ger en miljonfaldig ökning och 30 dagar en miljardfaldig.',
          },
        ],
      },
    ],
  },
  {
    id: 'rp-gym-kombinatorik',
    worldId: 'gym',
    title: 'Handskakningarna',
    emoji: '🤝',
    context: 'Vid en konferens hälsar alla deltagare på varandra – exakt en handskakning per par.',
    topicIds: ['kombinatorik', 'talfoljder', 'sannolikhet'],
    tags: ['Kombinatorik', 'Generalisering', 'Bevisa'],
    levels: [
      {
        level: 'E',
        intro: 'Räkna för små grupper.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många handskakningar blir det om 4 personer alla hälsar på varandra?',
            placeholder: 'antal',
            validate: numWhere(n => n === 6),
            hint: 'Rita fyra punkter och dra streck mellan alla par.',
            discussion: 'Personerna A, B, C, D ger paren AB, AC, AD, BC, BD, CD – alltså 6 handskakningar.',
          },
          {
            id: 'b',
            kind: 'open',
            prompt: 'Hur många handskakningar blir det med 5 personer?',
            placeholder: 'antal',
            validate: numWhere(n => n === 10),
            hint: 'Den femte personen skakar hand med de 4 som redan finns. Lägg till det till förra svaret.',
            discussion: '6 + 4 = 10 handskakningar. Varje ny person hälsar på alla som redan är där.',
          },
        ],
      },
      {
        level: 'C',
        intro: 'Hitta en formel.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Hur många handskakningar blir det med 20 personer?',
            placeholder: 'antal',
            validate: numWhere(n => n === 190),
            hint: 'Varje person skakar hand med 19 andra. Men då har varje handskakning räknats två gånger …',
            discussion: '20 × 19 / 2 = 190 handskakningar.',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Skriv en formel för n personer. Varför måste man dividera med 2?',
            placeholder: 'Formeln är… och man delar med 2 för att…',
            hint: 'Om A skakar hand med B – hur många gånger räknas den handskakningen om man går igenom alla personer?',
            discussion: 'Så här kan man tänka: formeln är n(n − 1)/2. Varje person skakar hand med n − 1 andra, vilket ger n(n − 1) "hälsningar". Men handskakningen mellan A och B räknas då två gånger – en gång från A:s perspektiv och en gång från B:s. Därför delar man med 2. Samma formel är binomialkoefficienten C(n,2), alltså antalet sätt att välja 2 personer av n.',
          },
        ],
      },
      {
        level: 'A',
        intro: 'Vänd på problemet och koppla ihop områden.',
        subTasks: [
          {
            id: 'a',
            kind: 'open',
            prompt: 'Vid en konferens blev det 45 handskakningar. Hur många deltagare var det?',
            placeholder: 'antal deltagare',
            validate: numWhere(n => n === 10),
            hint: 'Lös n(n − 1)/2 = 45, alltså n(n − 1) = 90. Vilka två närliggande heltal har produkten 90?',
            discussion: 'n(n − 1) = 90 ⇒ n² − n − 90 = 0 ⇒ n = (1 + √361)/2 = (1 + 19)/2 = 10. Det var 10 deltagare. (Kontroll: 10 × 9 / 2 = 45 ✓)',
          },
          {
            id: 'b',
            kind: 'reflect',
            prompt: 'Talen 1, 3, 6, 10, 15, 21 … kallas triangeltal och är exakt samma tal som handskakningarna ger. Varför dyker samma tal upp i båda problemen?',
            placeholder: 'Det beror på att…',
            hint: 'Handskakningar med n personer = 1 + 2 + … + (n−1). Vad är triangeltal?',
            discussion: 'Så här kan man tänka: när person nummer k anländer skakar hen hand med de k − 1 som redan är där. Totalen blir därför 1 + 2 + 3 + … + (n − 1), vilket är precis summan av de första heltalen – ett triangeltal. Formeln (n−1)n/2 är identisk med triangeltalsformeln. Detta är ett fint exempel på att helt olika problem (handskakningar, summan av heltal, antal linjer mellan punkter, antal par ur en mängd) har exakt samma matematiska struktur.',
          },
        ],
      },
    ],
  },
];

// ─── Hjälpfunktioner ────────────────────────────────────────────────────────────

export function getProblemsForWorld(worldId: WorldId): RichProblem[] {
  return RICH_PROBLEMS.filter(p => p.worldId === worldId);
}

export const PROBLEM_MAP: Record<string, RichProblem> = Object.fromEntries(
  RICH_PROBLEMS.map(p => [p.id, p])
);

/** Antal deluppgifter i ett problem (alla nivåer). */
export function subTaskCount(p: RichProblem): number {
  return p.levels.reduce((s, l) => s + l.subTasks.length, 0);
}

/** Kollar ett svar mot en deluppgift (open/collect). */
export function checkSubTaskAnswer(st: SubTask, answer: string): boolean {
  if (!answer.trim()) return false;
  if (st.targets) {
    const a = normalizeAnswer(answer);
    return st.targets.some(t => normalizeAnswer(t) === a);
  }
  return st.validate ? st.validate(answer) : false;
}

/** Hur många korrekta svar som krävs för att en collect-uppgift ska vara klar. */
export function collectGoal(st: SubTask): number {
  return st.targets ? st.targets.length : (st.need ?? 1);
}
