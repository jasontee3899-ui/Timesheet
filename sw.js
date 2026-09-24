// Attendance Ledger — service worker
// Cache-first app shell so the tracker keeps working offline once it's been
// opened at least once. Bump CACHE_VERSION whenever index.html changes so
// visitors pick up the new version instead of a stale cached copy.
const CACHE_VERSION = "attendance-ledger-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle GET requests for our own origin; let everything else
  // (e.g. the SheetJS CDN script) pass straight through to the network.
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached); // offline: fall back to cache if network fails

      // Cache-first: serve instantly from cache if we have it, but still
      // refresh the cache in the background for next time.
      return cached || network;
    })
  );
});
