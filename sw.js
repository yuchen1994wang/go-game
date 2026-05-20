// Service Worker 已禁用，避免缓存旧版本
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 不缓存任何内容，直接网络请求
  event.respondWith(fetch(event.request));
});
