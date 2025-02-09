/*******************************************
 * service-worker.js
 * 
 * This file handles offline caching of
 * assets for the Speed Racer Game.
 *******************************************/

// Cache version (change to force update)
const CACHE_NAME = "speed-racer-cache-v1";

// List of files to cache
const CACHE_ASSETS = [
  "/",                // might need adjusting depending on your hosting
  "index.html",
  "style.css",
  "script.js",
  "manifest.json",
  "icons/favicon-32x32.png",
  "icons/favicon-16x16.png",
  // Add any other images or files you want cached
];

// Install Service Worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch Handler
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached response if found, else fetch from network
      return response || fetch(event.request);
    })
  );
});
