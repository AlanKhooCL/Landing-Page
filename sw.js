const CACHE_NAME = 'universe-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './Landing Page Background.jpg',
  './manifest.json'
];

// Install the service worker and cache the initial files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// "Network-First" Strategy for fetching
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If the internet works, grab the fresh file, save a copy to the cache, and show it
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // If the internet is down (user is offline), show the saved cached version
        return caches.match(event.request);
      })
  );
});
