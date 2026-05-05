const CACHE = 'meu-ajudante-v4';

self.addEventListener('push', (e) => {
  let data = { title: 'Meu Ajudante', body: 'Hora do remédio!', tag: 'alarme', url: '/' };
  try {
    if (e.data) Object.assign(data, e.data.json());
  } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon',
      badge: '/icon',
      tag: data.tag,
      renotify: true,
      vibrate: [500, 200, 500, 200, 500],
      data: { url: data.url },
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.location.origin;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const target = list.find((c) => c.url.startsWith(self.location.origin));
      if (target) return target.focus();
      return clients.openWindow(url);
    })
  );
});


const PRECACHE = ['/', '/adicionar'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Note: /_next/static/* assets are cached opportunistically by the cache-first
// branch below on first successful fetch. This leaves a fresh-install offline
// gap (assets not yet visited won't be available offline) which the user has
// accepted for now; enumerating hashed static assets at build time is out of scope.
self.addEventListener('fetch', (e) => {
  const { request } = e;

  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin)) return;

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match('/'))
        )
    );
    return;
  }

  e.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
          }
          return res;
        })
    )
  );
});
