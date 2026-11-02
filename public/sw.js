// Super Telecom Cyber-Lab Service Worker v5.0 (Strict Network-First Code Delivery Engine)
// 100% Client-Side Hardware Diagnostics • Immediate Hot-Fix Ingestion • Auto-Cache Invalidation

const CACHE_NAME = "supertelecom-offline-v5.0";

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

// Pre-cache core shell during install and skipWaiting for seamless update
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
  );
  // Auto-activate immediately so users get latest critical bundle bugfixes
  self.skipWaiting();
});

// Clean up all old caches on activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[SW v5.0] Evicting outdated cache bucket:", key);
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

// Strategic fetch engine: Network-First for JS/CSS & Navigation; Cache-First for static media
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip non-http/https protocols (chrome-extension, blob, data, etc.)
  if (!url.protocol.startsWith("http")) return;

  // CRITICAL: Bypass API routes, Server Functions, Auth calls, external DB, and APK binaries
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_server") ||
    url.pathname.startsWith("/_serverFn") ||
    url.pathname.includes("/admin/") ||
    url.hostname.includes("supabase.co") ||
    url.pathname.endsWith(".apk") ||
    url.pathname.startsWith("/download/android") ||
    url.pathname.includes("SuperTelecom")
  ) {
    return; // Pass through directly to browser network pipeline
  }

  // 1. Navigation Requests (HTML Page loads / Route transitions):
  // STRICT NETWORK-FIRST: Never serve stale HTML while online
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

  // 2. JavaScript Code Chunks & Stylesheets:
  // STRICT NETWORK-FIRST: Always fetch latest deployed bundles to prevent stale code ReferenceErrors
  const isCodeAsset = url.pathname.match(/\.(js|mjs|css)$/i) || url.pathname.includes("/assets/");
  if (isCodeAsset) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fall back to cache only when offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // 3. Static Media Assets (Images, Fonts, Audio, Icons):
  // Cache-First with Background Network Revalidation
  const isMediaAsset =
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|mp3|wav|ogg)$/i) ||
    url.pathname.startsWith("/static/") ||
    PRECACHE_ASSETS.includes(url.pathname);

  if (isMediaAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
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

  // 4. All other requests: Network with Cache fallback
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
