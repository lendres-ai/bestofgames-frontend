const CACHE_NAME = 'bestofgames-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      // Add each URL individually so a single failure doesn't abort the whole install
      for (const url of PRECACHE_URLS) {
        try {
          // Use cache 'reload' to bypass HTTP cache in dev
          await cache.add(new Request(url, { cache: 'reload' }));
        } catch (e) {
          // Ignore individual failures (e.g., favicon on https://localhost)
        }
      }
    } finally {
      await self.skipWaiting();
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => cacheName !== CACHE_NAME ? caches.delete(cacheName) : Promise.resolve())
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});

// Handle incoming push events
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch (e) {}

  const { title = 'Game on sale!', body = 'A wishlisted game is discounted.', icon = '/favicon.ico', url = '/' } = payload;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      data: { url },
      tag: payload.tag,
    })
  );
});

// Open the URL when the notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

