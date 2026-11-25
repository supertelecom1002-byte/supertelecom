// Super Telecom Service Worker v2026.11 (Network-First Navigation, Safe Binary Exclusion)
// Strictly excludes APK binaries, 3D GLB models, API endpoints, and Admin routes.

const CACHE_NAME = "supertelecom-v2026-11-clean";

const PRECACHE_ASSETS = [
  "/",
  "/download",
  "/services",
  "/pricing",
  "/tools",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/logo.webp",
  "/favicon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (!url.protocol.startsWith("http")) return;

  const lowerPath = url.pathname.toLowerCase();

  // Strictly EXCLUDE /SuperTelecom.apk, *.apk, *.glb, /api/*, and /admin/* from SW interception/caching
  if (
    url.pathname === "/SuperTelecom.apk" ||
    lowerPath.endsWith(".apk") ||
    lowerPath.endsWith(".glb") ||
    lowerPath.startsWith("/api/") ||
    lowerPath.startsWith("/_server") ||
    lowerPath === "/admin" ||
    lowerPath.startsWith("/admin/") ||
    lowerPath.startsWith("/download/android") ||
    lowerPath.startsWith("/download/apk") ||
    url.hostname.includes("supabase.co")
  ) {
    return;
  }

  // 1. HTML Navigation Requests: Strict Network-First so deployments appear immediately without hard refresh
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && !networkResponse.redirected) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const rootFallback = await caches.match("/");
          return rootFallback || Response.error();
        })
    );
    return;
  }

  // 2. JS/CSS Assets: Network-First to guarantee zero stale chunk ReferenceErrors
  if (lowerPath.match(/\.(js|mjs|css)$/) || lowerPath.includes("/assets/")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || Response.error();
        })
    );
    return;
  }

  // 3. Static Media Assets (excluding *.glb & *.apk handled above): Cache-First + background refresh
  if (lowerPath.match(/\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf)$/)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse || Response.error());

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
