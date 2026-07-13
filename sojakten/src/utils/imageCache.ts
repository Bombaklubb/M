import type { Concept } from '../types';

const PREFIX = 'so_img_';

/** Hämtar en Wikipedia-miniatyr för en artikeltitel, cachad i sessionStorage. */
export async function fetchWikiImage(title: string): Promise<string | null> {
  const key = PREFIX + title;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached !== null) return cached === '' ? null : cached;
  } catch { /* sessionStorage kan saknas – hämta utan cache */ }

  let url: string | null = null;
  try {
    const res = await fetch(
      `https://sv.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (res.ok) {
      const data = await res.json();
      url = data?.thumbnail?.source ?? null;
    }
  } catch { url = null; }

  try { sessionStorage.setItem(key, url ?? ''); } catch { /* full/saknas – ok */ }
  return url;
}

/**
 * Bild för ett begrepp, med hänsyn till wikiTitle-fältet:
 * '' = ingen bild, annan sträng = använd den titeln, utelämnad = använd term.
 */
export async function fetchConceptImage(concept: Concept): Promise<string | null> {
  if (concept.wikiTitle === '') return null;
  return fetchWikiImage(concept.wikiTitle ?? concept.term);
}
