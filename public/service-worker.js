// Service Worker for MINNESOTA.CEO
const CACHE_NAME = 'minnesota-ceo-v2';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache each URL individually to avoid failures
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => console.log('Failed to cache:', url))
          )
        );
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/admin') || 
      url.pathname.startsWith('/api/') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch((error) => {
          console.log('Fetch failed for:', event.request.url, error);
          return new Response('Offline - please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push event - show notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from MINNESOTA.CEO',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Now',
        icon: '/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MINNESOTA.CEO', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('https://minnesota.ceo/app')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open homepage
    event.waitUntil(
      clients.openWindow('https://minnesota.ceo')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-waitlist') {
    event.waitUntil(syncWaitlistSignups());
  }
});

async function syncWaitlistSignups() {
  // Get pending signups from IndexedDB and sync
  // This would be implemented with IndexedDB in production
  console.log('Syncing waitlist signups...');
}
