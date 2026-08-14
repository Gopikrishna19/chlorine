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

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
            const networkResponse = await fetch(event.request);

            if (networkResponse && networkResponse.ok) {
                await cache.put(event.request, networkResponse.clone());
            }

            return networkResponse;
        } catch {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }

            if (event.request.mode === 'navigate') {
                const fallback = await cache.match('./index.html');
                if (fallback) {
                    return fallback;
                }
            }

            return Response.error();
        }
    })());
});
