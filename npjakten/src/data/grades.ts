import type {
  Grade,
  ListeningTest,
  OralTask,
  ReadingTest,
  Subject,
  WritingTask,
} from "../types";

// Allt övningsinnehåll ligger i JSON-filerna i den här mappen.
// Nya texter och uppgifter läggs till direkt i JSON – ingen kod behöver
// ändras så länge formatet (se types.ts) följs.
//
// Innehållet laddas ett ämne och en årskurs i taget. Startsidan behöver bara
// etiketterna nedan, så en elev som väljer engelska åk 6 slipper ladda ner
// svenskans alla årskurser.

interface GradeContent {
  reading: ReadingTest[];
  writing: WritingTask[];
  oral?: OralTask[];
  listening?: ListeningTest[];
}

export type GradeId = "ak3" | "ak6" | "ak9";

export interface SubjectMeta {
  id: Subject;
  label: string;
  description: string;
}

export interface GradeMeta {
  id: GradeId;
  subject: Subject;
  label: string;
  available: boolean;
}

export const subjectMeta: SubjectMeta[] = [
  {
    id: "svenska",
    label: "Svenska",
    description: "Läsa, skriva och muntligt – årskurs 3, 6 och 9",
  },
  {
    id: "engelska",
    label: "Engelska",
    description: "Läsa, lyssna, skriva och muntligt – årskurs 6 och 9",
  },
];

// Nationella prov i engelska finns bara för åk 6 och åk 9.
export const gradeMeta: GradeMeta[] = [
  { id: "ak3", subject: "svenska", label: "Årskurs 3", available: true },
  { id: "ak6", subject: "svenska", label: "Årskurs 6", available: true },
  { id: "ak9", subject: "svenska", label: "Årskurs 9", available: true },
  { id: "ak6", subject: "engelska", label: "Årskurs 6", available: true },
  { id: "ak9", subject: "engelska", label: "Årskurs 9", available: true },
];

export const gradesFor = (subject: Subject) =>
  gradeMeta.filter((g) => g.subject === subject);

type LoaderKey = `${Subject}:${GradeId}`;

const loaders: Partial<Record<LoaderKey, () => Promise<{ default: unknown }>>> = {
  "svenska:ak3": () => import("./ak3.json"),
  "svenska:ak6": () => import("./ak6.json"),
  "svenska:ak9": () => import("./ak9.json"),
  "engelska:ak6": () => import("./en-ak6.json"),
  "engelska:ak9": () => import("./en-ak9.json"),
};

const cache = new Map<LoaderKey, Grade>();

export async function loadGrade(subject: Subject, id: GradeId): Promise<Grade> {
  const key: LoaderKey = `${subject}:${id}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const meta = gradeMeta.find((g) => g.id === id && g.subject === subject);
  const loader = loaders[key];
  if (!meta || !loader) throw new Error(`Okänd årskurs: ${key}`);

  const mod = await loader();
  const content = mod.default as GradeContent;
  const grade: Grade = { ...meta, ...content };
  cache.set(key, grade);
  return grade;
}
