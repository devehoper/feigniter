/**
 * Service Worker: Implements Cache-First, then Network strategy for views and assets.
 * This file is essential for making caching work with the fetch() API in loadViewContent.js.
 */

// Cache version. MUST be updated (e.g., 'v1' to 'v2') whenever you deploy new code
// to ensure users get the latest view and assets.
const CACHE_NAME = 'view-cache-v1'; 

// List of core files (your "App Shell" views) to pre-cache immediately upon installation.
// We are only pre-caching the main HTML views, as other files will use URL versioning.
const urlsToCache = [
  '/',                     // The root URL is typically the main view/index.html
  '/index.html',           // Your main page view
  // NOTE: Other assets (CSS, JS) are now excluded from pre-caching 
  // because you will handle their versioning with '?v=...'
];

// --------------------------------------------------------------------------------
// 1. INSTALL Event: Pre-cache essential assets
// --------------------------------------------------------------------------------
self.addEventListener('install', event => {
  console.log('[Service Worker] Activated. Cleaning up old caches.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('[Service Worker] Failed to pre-cache some assets. This might be due to a network error or missing files.', error);
            // Installation will still succeed even if some items fail to cache.
          });
      })
  );
});


// --------------------------------------------------------------------------------
// 2. ACTIVATE Event: Clean up old caches (Crucial for versioning)
// --------------------------------------------------------------------------------
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activated. Cleaning up old caches.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Check if the cache name is not the current version
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the Service Worker takes control immediately
  return self.clients.claim();
});


// --------------------------------------------------------------------------------
// 3. FETCH Event: Intercept requests and apply Cache-First strategy
// --------------------------------------------------------------------------------
self.addEventListener('fetch', event => {
  // Only handle GET requests for security and efficiency
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);
  const isHtmlRequest = url.pathname.endsWith('.html') || url.pathname === '/';
  
  if (isHtmlRequest) {
      // Strategy for HTML views: Cache-First, then Network (for speed and offline)
      event.respondWith(
          caches.match(event.request)
            .then(response => {
              // Cache Hit: Return cached HTML immediately.
              if (response) {
                console.log('[Service Worker] HTML Cache Hit:', event.request.url);
                return response;
              }
      
              // Cache Miss: Go to network and cache the response for next time.
              console.log('[Service Worker] HTML Cache Miss, Fetching from Network:', event.request.url);
              return fetch(event.request)
                .then(networkResponse => {
                  if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                  }
      
                  const responseToCache = networkResponse.clone();
      
                  caches.open(CACHE_NAME)
                    .then(cache => {
                      cache.put(event.request, responseToCache);
                    });
      
                  return networkResponse;
                })
                .catch(error => {
                    // Handle complete network failure for HTML views here.
                    console.error('[Service Worker] HTML fetch failed:', event.request.url, error);
                    throw error;
                });
            })
      );
  } else {
      // Strategy for all other assets (CSS, JS, Images, etc.) using '?v=' versioning.
      // We use a Network-First approach: try network first, but if the network
      // request fails (e.g., 404), we check the cache as a final fallback.
      // We DO NOT save these files to the Service Worker cache, relying on browser/server caching.
      event.respondWith(
          fetch(event.request).catch(() => {
              // Fallback to cache if network fails (important for offline assets not in the core cache)
              return caches.match(event.request);
          })
      );
  }
});


// --------------------------------------------------------------------------------
// 4. MESSAGE Event: Listen for manual cache commands from the main page
// --------------------------------------------------------------------------------
self.addEventListener('message', event => {
    // Check for the specific command type and data
    if (event.data && event.data.command === 'CACHE_VIEW_UPDATE' && event.data.url) {
        const urlToUpdate = event.data.url;
        console.log(`[Service Worker] Received command to manually update cache for: ${urlToUpdate}`);

        // Perform the network fetch and cache update, bypassing the cache check.
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                // Fetch the latest copy from the network
                return fetch(urlToUpdate).then(response => {
                    if (response.ok) {
                        // Put the fresh copy directly into the cache
                        cache.put(urlToUpdate, response.clone());
                        console.log(`[Service Worker] Manually updated cache successfully for: ${urlToUpdate}`);
                    } else {
                        console.error(`[Service Worker] Failed to fetch fresh copy (HTTP status: ${response.status}) for: ${urlToUpdate}`);
                    }
                }).catch(error => {
                    console.error(`[Service Worker] Network error during manual update for ${urlToUpdate}:`, error);
                });
            })
        );
    }
});
