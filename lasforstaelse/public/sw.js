/*
 * Service worker för Läsjakten.
 *
 * Syftet är skolans nät: trettio Chromebooks som startar appen samtidigt, ofta
 * på ett trådlöst nät som inte är byggt för det. Utan cache hämtas både appen
 * och det två megabyte stora textbiblioteket på nytt varje lektion.
 *
 * En service worker som cachar fel är värre än ingen alls – då sitter eleverna
 * fast på en gammal version utan att förstå varför. Strategierna nedan är
 * valda för att det inte ska kunna hända:
 *
 *   sidhämtning (navigering)  nätet först, cachen bara när nätet inte svarar
 *   /assets/*                 cachen först – filnamnen innehåller en hash och
 *                             ändras vid varje bygge, så en cachad fil kan
 *                             aldrig vara fel version
 *   /data/library.json        cachen först, men hämtas om i bakgrunden
 *   /api/*                    aldrig cache
 *
 * Följden av att biblioteket serveras ur cachen är att en elev som redan har
 * appen öppen ser gårdagens texter fram till nästa laddning. Det är ett med-
 * vetet val: två megabyte över ett ansträngt skolnät kostar mer än en dags
 * fördröjning på en textändring.
 */

const VERSION = 'lasjakten-v1';
const APPSKAL = `${VERSION}-skal`;
const DATA = `${VERSION}-data`;
const STARTSIDA = '/index.html';

self.addEventListener('install', (event) => {
  // Nya versionen tar över direkt i stället för att vänta på att alla flikar
  // stängs. En elev ska inte behöva stänga ner appen för att få en rättning.
  self.skipWaiting();
  event.waitUntil(
    caches.open(APPSKAL).then((cache) => cache.addAll(['/', STARTSIDA]).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Städa bort cacher från tidigare versioner, annars växer lagringen
      // obegränsat på en dator som används i flera år.
      const namn = await caches.keys();
      await Promise.all(
        namn.filter((n) => !n.startsWith(VERSION)).map((n) => caches.delete(n))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bara vår egen domän. Bilderna ligger hos en extern värd och lämnas åt
  // webbläsarens vanliga cache.
  if (url.origin !== self.location.origin) return;

  // Statistiken ska aldrig serveras ur en cache.
  if (url.pathname.startsWith('/api/')) return;

  // Sidhämtning: nätet först. Då når en ny version fram så snart det finns
  // uppkoppling, och cachen används bara när nätet är borta.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((svar) => {
          const kopia = svar.clone();
          caches.open(APPSKAL).then((c) => c.put(STARTSIDA, kopia));
          return svar;
        })
        .catch(() => caches.match(STARTSIDA).then((c) => c || Response.error()))
    );
    return;
  }

  // Byggda filer: namnet innehåller en innehållshash, så en träff i cachen är
  // per definition rätt version.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (traff) =>
          traff ||
          fetch(request).then((svar) => {
            const kopia = svar.clone();
            caches.open(APPSKAL).then((c) => c.put(request, kopia));
            return svar;
          })
      )
    );
    return;
  }

  // Textbiblioteket: svara ur cachen direkt och hämta en färsk kopia i
  // bakgrunden till nästa gång.
  if (url.pathname === '/data/library.json') {
    event.respondWith(
      caches.open(DATA).then(async (cache) => {
        const traff = await cache.match(request);
        const hamtning = fetch(request)
          .then((svar) => {
            if (svar.ok) cache.put(request, svar.clone());
            return svar;
          })
          .catch(() => traff);
        return traff || hamtning;
      })
    );
  }
});
