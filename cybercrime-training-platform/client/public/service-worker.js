// Service Worker for Cybercrime Training Platform
const CACHE_NAME = 'cybercrime-training-platform-v1';
const DYNAMIC_CACHE_NAME = 'cybercrime-training-platform-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activate the new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
  // Ensure the service worker takes control of all clients immediately
  return self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip browser-sync requests
  if (event.request.url.includes('browser-sync')) {
    return;
  }

  // Skip API requests (we'll handle them separately)
  if (event.request.url.includes('/api/')) {
    return networkFirst(event);
  }

  // For page navigations, use network first strategy
  if (event.request.mode === 'navigate') {
    return networkFirst(event);
  }

  // For static assets, use cache first strategy
  return cacheFirst(event);
});

// Cache first strategy - try cache, fallback to network
function cacheFirst(event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return from cache if found
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache a copy of the response
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If both cache and network fail, return fallback for specific file types
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match('/images/fallback-image.png');
          }
          return caches.match('/offline.html');
        });
    })
  );
}

// Network first strategy - try network, fallback to cache
function networkFirst(event) {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache a copy of the response
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request).then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }
          
          // If not in cache, return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // Return nothing for other requests
          return null;
        });
      })
  );
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});