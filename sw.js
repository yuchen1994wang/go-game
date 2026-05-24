/*
 * PWA Service Worker
 * 提供离线支持、缓存和安装功能
 */

const CACHE_NAME = 'go-game-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/home.html',
  '/pages/game.html',
  '/pages/practice.html',
  '/pages/statistics.html',
  '/css/common.css',
  '/css/index.css',
  '/js/utils.js',
  '/js/storage.js',
  '/js/go-engine.js',
  '/js/go-ai.js',
  '/js/game.js',
  '/js/tsumego-data.js',
  '/js/tsumego-storage.js',
  '/js/statistics.js',
  '/js/board-component.js',
  '/js/local-ai.js'
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          console.log('[ServiceWorker] Removing old cache', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[ServiceWorker] Use cached', event.request.url);
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
