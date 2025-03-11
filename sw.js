const CACHE_NAME = 'cart-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/cart.html',
  '/checkout.html',
  '/cart.js',
  '/icon-512.jpg' // Replace with your logo filename
  // Add your screenshot if it’s used in the app
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});