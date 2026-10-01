import { readFileSync } from "node:fs";
import { join } from "node:path";
import { STAGES } from "./stages";
import type { StageContent } from "./types";

/**
 * Parametrar för generateStaticParams. Världssidorna och kapitelsidorna byggs
 * då en gång vid deploy och skickas som färdiga filer från Vercels CDN, i
 * stället för att renderas på servern vid varje besök. Sidorna hämtar ändå
 * sitt innehåll och elevens framsteg i webbläsaren, så inget ändras för eleven.
 */

export function stageParams(): { stage: string }[] {
  return STAGES.map((s) => ({ stage: s.id }));
}

type Kind = "grammar" | "spelling" | "wordsearch" | "spel";

export function moduleParams(kind: Kind): { stage: string; module: string }[] {
  const out: { stage: string; module: string }[] = [];
  for (const s of STAGES) {
    const file = join(process.cwd(), "public", "content", s.id, "content.json");
    const content = JSON.parse(readFileSync(file, "utf8")) as StageContent;
    for (const m of content[kind] ?? []) out.push({ stage: s.id, module: m.id });
  }
  return out;
}
