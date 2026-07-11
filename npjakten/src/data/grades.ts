import type { Grade, OralTask, ReadingTest, WritingTask } from "../types";
import ak3 from "./ak3.json";
import ak6 from "./ak6.json";
import ak9 from "./ak9.json";

// Allt övningsinnehåll ligger i JSON-filerna ak3/ak6/ak9.json.
// Nya texter och uppgifter läggs till direkt i JSON – ingen kod
// behöver ändras så länge formatet (se types.ts) följs.

interface GradeContent {
  reading: ReadingTest[];
  writing: WritingTask[];
  oral?: OralTask[];
}

const content3 = ak3 as unknown as GradeContent;
const content6 = ak6 as unknown as GradeContent;
const content9 = ak9 as unknown as GradeContent;

export const grades: Grade[] = [
  { id: "ak3", label: "Årskurs 3", available: true, ...content3 },
  { id: "ak6", label: "Årskurs 6", available: true, ...content6 },
  { id: "ak9", label: "Årskurs 9", available: true, ...content9 },
];
