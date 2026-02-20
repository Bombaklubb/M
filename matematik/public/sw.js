const CACHE = 'mattejakten-v2';
const OFFLINE_URLS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try {
        const fresh = await fetch(e.request);
        if (fresh.ok) cache.put(e.request, fresh.clone());
        return fresh;
      } catch(err) {
        // Offline fallback
        const fallback = await cache.match('/');
        return fallback || new Response('Offline', { status: 503 });
      }
    })
  );
});
