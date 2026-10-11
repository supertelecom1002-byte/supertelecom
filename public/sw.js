// Super Telecom Cyber-Lab Service Worker v3.2 (Strict Offline-First Engine)
// 100% Client-Side Hardware Diagnostics • Controlled Manual Update Workflow

const CACHE_NAME = "supertelecom-offline-v3.2";

// Core App Shell & Offline Hubs to Pre-Cache
const PRECACHE_ASSETS = [
  "/",
  "/tools",
  "/track",
  "/download",
  "/pricing",
  "/services",
  "/brands",
  "/about",
  "/warranty",
  "/privacy",
  "/terms",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/logo.png",
  "/favicon.png",
  "/og-image.png",
];

// Pre-cache core shell during install without silent skipWaiting
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Safely cache each asset with individual fallbacks so pre-caching never aborts
      await Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[SW] Pre-cache skip for:", url, err);
          })
        )
      );
    })
    // CRITICAL: DO NOT call self.skipWaiting() automatically.
    // Controlled update workflow requires remaining in waiting state until explicit user interaction.
  );
});

// Clean up old caches on activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[SW] Removing outdated cache bucket:", key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Listen for manual skipWaiting signal from client UI
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[SW] Received user SKIP_WAITING signal. Activating new version...");
    self.skipWaiting();
  }
});

// Notification Click Handler: Focus existing tab or open root
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow("/");
        }
      })
  );
});

// Offline-first fetch strategy
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip non-http/https protocols (chrome-extension, blob, data, etc.)
  if (!url.protocol.startsWith("http")) return;

  // CRITICAL: Bypass API routes, Server Functions, Auth calls, and external DB queries
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_server") ||
    url.pathname.startsWith("/_serverFn") ||
    url.pathname.includes("/admin/") ||
    url.hostname.includes("supabase.co")
  ) {
    return; // Pass through directly to browser network pipeline
  }

  // 1. Navigation Requests (HTML Page loads / Route transitions):
  // Network-First with Stale Cache Fallback + Root fallback for SPA offline routes
  if (event.request.mode === "navigate") {
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
          // Offline fallback: try exact cached route first
          const cached = await caches.match(event.request);
          if (cached) return cached;

          // Fallback to cached root "/" for client-side TanStack SPA routing
          const rootFallback = await caches.match("/");
          if (rootFallback) return rootFallback;

          return Response.error();
        })
    );
    return;
  }

  // 2. Static Assets (Scripts, Styles, Images, Fonts, Audio, Manifest):
  // Cache-First with Background Network Revalidation
  const isStaticAsset =
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|mp3|wav|ogg|json)$/i) ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/static/") ||
    PRECACHE_ASSETS.includes(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background when online
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        // Not yet cached: fetch from network and store copy
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse || Response.error());
      })
    );
    return;
  }

  // 3. All other requests: Network with Cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
