/*******************************************
 * service-worker.js
 * 
 * Basic offline caching.
 *******************************************/

const CACHE_NAME = "speed-racer-extended-v1";
const CACHE_ASSETS = [
  "/",
  "index.html",
  "style.css",
  "script.js",
  "manifest.json",
  "icons/favicon-32x32.png",
  "icons/favicon-16x16.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
