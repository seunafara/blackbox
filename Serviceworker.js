const OFFLINE_VERSION = "prod-0.0.4";
const CACHE_NAME = `offline-${OFFLINE_VERSION}`;
const OFFLINE_URL = "index.html";
const OFFLINE_ASSETS = [
  "",
  "index.html",
  "script.js",
  "index.css",
  "brain.js",
  "Config.js",
  "Elements.js",
  "Helpers.js",
  "Net.js",
  "Networker.js",
  "Settings.js",
  "TestEditor.js",
  "TrainEditor.js",
  "manifest.json",
  "favicon.ico",
  "images/logo192.png",
  "images/logo512.png"
];
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachePromises = OFFLINE_ASSETS.map(async (asset) => {
      const url = new URL(asset, self.location);
      try {
        const response = await fetch(url, { cache: "reload" });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        await cache.put(url, response);
      } catch (error) {
        console.error(`Failed to cache ${url.href}:`, error);
      }
    });
    await Promise.all(cachePromises);
  })());
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
      console.log("Service Worker activated");
      self.clients.claim();
    })()
  );
});
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  const cachedUrls = new Set(
    OFFLINE_ASSETS.map(asset => new URL(asset, self.location).href)
  );
  if (cachedUrls.has(requestUrl.href) || event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
          return response;
        } catch {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          return new Response("Offline", { status: 503 });
        }
      })()
    );
  }
});
