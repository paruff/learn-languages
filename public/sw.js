// Offline support (spec Q7, Q12). Pages and assets are cached as they are visited; in
// addition the lessons page asks us to precache the open level's lessons (message
// below), so they work offline without having been opened first. Same-origin only.
const CACHE = 'acquira-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'precache' || !Array.isArray(data.urls)) return;
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        data.urls
          .filter(
            (u) =>
              typeof u === 'string' &&
              new URL(u, self.location.href).origin === self.location.origin
          )
          .map(async (u) => {
            if (await cache.match(u)) return;
            const response = await fetch(u).catch(() => null);
            if (response && response.ok) await cache.put(u, response);
          })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Pages: network-first so content updates land immediately; cache is the fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || Response.error()))
    );
    return;
  }

  // Assets (hashed /_astro/ bundles, fonts, images): cache-first.
  // ponytail: unhashed files (/vocab-images/, /fonts/) replaced at the same
  // path stay stale for returning visitors; bump CACHE when that happens.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
