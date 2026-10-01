/**
 * Adressen till ett stadies content.json eller rules.json, med en hash av
 * innehållet i filnamnet (räknas ut i next.config.ts). Filen kan då cachas för
 * alltid: ändras innehållet ändras namnet, och eleven får den nya filen.
 */
const HASHES: Record<string, string> = (() => {
  try {
    return JSON.parse(process.env.CONTENT_HASHES ?? "{}");
  } catch {
    return {};
  }
})();

export function contentUrl(stageId: string, name: "content" | "rules" = "content"): string {
  const hash = HASHES[`${stageId}/${name}`];
  return hash ? `/content/${stageId}/${name}-${hash}.json` : `/content/${stageId}/${name}.json`;
}
