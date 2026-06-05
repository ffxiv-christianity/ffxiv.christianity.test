const CACHE_NAME = 'jesoothe-v1';
const ASSETS = [
  './JeSoothe.html',
  './style.css',
  './script.js'
];

// 安裝時快取檔案
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// 攔截請求並從快取讀取
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});