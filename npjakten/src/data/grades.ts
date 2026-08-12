import type { Grade, OralTask, ReadingTest, WritingTask } from "../types";

// Allt övningsinnehåll ligger i JSON-filerna ak3/ak6/ak9.json.
// Nya texter och uppgifter läggs till direkt i JSON – ingen kod
// behöver ändras så länge formatet (se types.ts) följs.
//
// Innehållet laddas en årskurs i taget. Startsidan behöver bara etiketterna
// nedan, så en elev som väljer åk 6 slipper ladda ner åk 3 och åk 9.

interface GradeContent {
  reading: ReadingTest[];
  writing: WritingTask[];
  oral?: OralTask[];
}

export type GradeId = "ak3" | "ak6" | "ak9";

export interface GradeMeta {
  id: GradeId;
  label: string;
  available: boolean;
}

export const gradeMeta: GradeMeta[] = [
  { id: "ak3", label: "Årskurs 3", available: true },
  { id: "ak6", label: "Årskurs 6", available: true },
  { id: "ak9", label: "Årskurs 9", available: true },
];

const loaders: Record<GradeId, () => Promise<{ default: unknown }>> = {
  ak3: () => import("./ak3.json"),
  ak6: () => import("./ak6.json"),
  ak9: () => import("./ak9.json"),
};

const cache = new Map<GradeId, Grade>();

export async function loadGrade(id: GradeId): Promise<Grade> {
  const cached = cache.get(id);
  if (cached) return cached;

  const meta = gradeMeta.find((g) => g.id === id)!;
  const mod = await loaders[id]();
  const content = mod.default as GradeContent;
  const grade: Grade = { ...meta, ...content };
  cache.set(id, grade);
  return grade;
}
