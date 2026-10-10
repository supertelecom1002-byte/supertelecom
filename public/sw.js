// Super Telecom Service Worker v2.4
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Never intercept HTML page navigations to prevent blank screens; allow clean browser navigation
  if (e.request.mode === 'navigate') {
    return;
  }

  // Only handle GET requests
  if (e.request.method !== 'GET') {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(async () => {
      const cached = await caches.match(e.request);
      return cached || Response.error();
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
