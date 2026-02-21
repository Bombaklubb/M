// This service worker intentionally unregisters itself and clears all caches.
// Previously the app used an aggressive cache-first strategy that caused
// white-screen crashes after every deployment.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
