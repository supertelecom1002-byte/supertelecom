// Super Telecom Service Worker v2.4 (Giridih Lab • Est. 2016)
const CACHE_NAME = 'supertelecom-v2.4';

self.addEventListener('install', (event) => {
  // Allow immediate activation when a new service worker is installed
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
