const CACHE_NAME = 'sarathi-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/src/data/content.json',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache first (cache-first strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for offline data submission
self.addEventListener('sync', event => {
  if (event.tag === 'mission-progress-sync') {
    event.waitUntil(syncMissionProgress());
  }
});

async function syncMissionProgress() {
  try {
    // Get pending sync data from IndexedDB or localStorage
    const pendingData = localStorage.getItem('pendingMissionData');
    if (pendingData) {
      const data = JSON.parse(pendingData);
      
      // Attempt to sync with server
      const response = await fetch('/api/mission-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Clear pending data after successful sync
        localStorage.removeItem('pendingMissionData');
        console.log('Mission progress synced successfully');
      }
    }
  } catch (error) {
    console.log('Sync failed:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New mission available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification('Sarathi', options)
  );
});
