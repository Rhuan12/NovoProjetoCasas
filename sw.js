const CACHE_NAME = 'real-estate-v1';
const urlsToCache = [
    '/',
    '/css/custom.css',
    '/js/main.js',
    '/js/utils.js',
    '/js/properties.js',
    '/js/supabase-config.js',
    '/assets/images/logos/logo.png',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            }
        )
    );
});

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/assets/images/logos/icon-192.png',
        badge: '/assets/images/logos/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Novo Imóvel Disponível!', options)
    );
});