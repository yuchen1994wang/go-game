/**
 * Service Worker - 提供离线缓存功能
 */
const CACHE_NAME = 'go-game-v2';
const STATIC_ASSETS = [
  '/go-game/',
  '/go-game/index.html',
  '/go-game/css/common.css',
  '/go-game/js/utils.js',
  '/go-game/js/error-handler.js',
  '/go-game/js/loading.js',
  '/go-game/js/storage.js',
  '/go-game/js/theme.js',
  '/go-game/js/board-component.js',
  '/go-game/js/header.js',
  '/go-game/js/ai.js',
  '/go-game/js/go-engine.js',
  '/go-game/js/kifu-data.js',
  '/go-game/js/tsumego-data.js',
  '/go-game/js/tsumego-storage.js',
  '/go-game/pages/home.html',
  '/go-game/pages/auth.html',
  '/go-game/pages/setup.html',
  '/go-game/pages/game.html',
  '/go-game/pages/ai-setup.html',
  '/go-game/pages/ai-match.html',
  '/go-game/pages/review.html',
  '/go-game/pages/tsumego.html',
  '/go-game/pages/kifu.html',
  '/go-game/pages/kifu-player.html',
  '/go-game/pages/pattern-study.html',
  '/go-game/pages/statistics.html'
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.warn('Service Worker 缓存失败:', err);
      })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求，优先使用网络，失败时使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // 网络请求成功，更新缓存
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // 网络失败时使用缓存
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 导航请求失败时返回首页
          if (event.request.mode === 'navigate') {
            return caches.match('/go-game/index.html');
          }
        });
      })
  );
});
