const PREFIX = 'so_img_';

export async function fetchWikiImage(term: string): Promise<string | null> {
  const key = PREFIX + term;
  const cached = sessionStorage.getItem(key);
  if (cached !== null) return cached === '' ? null : cached;

  try {
    const res = await fetch(
      `https://sv.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) { sessionStorage.setItem(key, ''); return null; }
    const data = await res.json();
    const url: string | null = data?.thumbnail?.source ?? null;
    sessionStorage.setItem(key, url ?? '');
    return url;
  } catch {
    sessionStorage.setItem(key, '');
    return null;
  }
}
