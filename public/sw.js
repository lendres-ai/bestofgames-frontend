const CACHE_NAME = 'bestofgames-cache-v2';
const PRECACHE_URLS = [
  '/',
  '/favicon.ico',
  '/logo.png'
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
        } catch {
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

  const url = new URL(request.url);

  // Bypass analytics and tracking
  if (url.hostname === 'umami.mountdoom.space') {
    return; // let it hit the network without SW interference
  }

  // HTML navigation: network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return caches.match('/');
      }
    })());
    return;
  }

  // Static Next.js assets: cache-first
  if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/icons/')) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    })());
    return;
  }

  // Images: stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const networkPromise = fetch(request).then((response) => {
        cache.put(request, response.clone());
        return response;
      }).catch(() => undefined);
      return cached || (await networkPromise) || fetch(request);
    })());
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      throw new Error('Network error and no cache');
    }
  })());
});

// Handle incoming push events
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch {}

  const { title = 'Game on sale!', body = 'A wishlisted game is discounted.', icon = '/logo.png', url = '/' } = payload;
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
  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      if ('focus' in client) {
        await client.focus();
        if ('navigate' in client && client.url !== targetUrl) {
          try { await client.navigate(targetUrl); } catch {}
        }
        return;
      }
    }
    if (clients.openWindow) {
      await clients.openWindow(targetUrl);
    }
  })());
});

