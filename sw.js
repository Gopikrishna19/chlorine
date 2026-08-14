const CACHE_NAME = 'chlorine-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './index.css',
    './index.mjs',
    './public/icon-192.png',
    './public/icon-512.png',
    './public/apple-touch-icon.png',
    './public/favicon-96x96.png',
    './public/favicon.ico',
    './public/favicon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(ASSETS);
    })());
});

self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        const response = await caches.match(event.request);
        if (response) {
            return response;
        }
        return fetch(event.request);
    })());
});
