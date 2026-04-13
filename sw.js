const CACHE_NAME = "florecer50-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// INSTALAR
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// ACTIVAR (borra caché vieja)
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (network first → evita versiones viejas)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then(res => res)
      .catch(() => caches.match(e.request))
  );
});