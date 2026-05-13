const CACHE_NAME = 'lift-metric-v1';
const OFFLINE_CACHE = 'lift-metric-offline-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Assets needed for offline calculation mode
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('lift-metric-') && name !== CACHE_NAME && name !== OFFLINE_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }

  // API requests - network only with offline fallback
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => new Response(JSON.stringify({ error: 'Offline', offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }

  // Static assets - network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If no cache, return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Background sync for pending data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-feedback') {
    event.waitUntil(syncFeedback());
  }
});

// Push notifications support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Lift Metric', options)
  );
});

// Helper function to sync feedback when online
async function syncFeedback() {
  try {
    // Get pending feedback from IndexedDB
    const db = await openDB();
    const tx = db.transaction('pending-feedback', 'readonly');
    const store = tx.objectStore('pending-feedback');
    const allFeedback = await store.getAll();
    
    // Send each feedback item
    for (const feedback of allFeedback) {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      
      // Remove from pending after successful send
      const deleteTx = db.transaction('pending-feedback', 'readwrite');
      await deleteTx.objectStore('pending-feedback').delete(feedback.id);
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('lift-metric-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-feedback')) {
        db.createObjectStore('pending-feedback', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
