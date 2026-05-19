/**
 * Service Worker - 提供离线缓存功能
 */
const CACHE_NAME = 'go-game-v1';
const STATIC_ASSETS = [
  '/go-game/',
  '/go-game/index.html',
  '/go-game/css/common.css',
  '/go-game/js/utils.js',
  '/go-game/js/error-handler.js',
  '/go-game/js/loading.js',
  '/go-game/js/storage.js',
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
  '/go-game/pages/practice.html',
  '/go-game/pages/tsumego.html',
  '/go-game/pages/kifu.html',
  '/go-game/pages/kifu-player.html'
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

// 拦截请求，优先使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 缓存命中直接返回
        if (response) {
          return response;
        }

        // 否则发起网络请求
        return fetch(event.request)
          .then((networkResponse) => {
            // 只缓存成功的GET请求
            if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
              return networkResponse;
            }

            // 克隆响应并缓存
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            // 网络失败时返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/go-game/index.html');
            }
          });
      })
  );
});
