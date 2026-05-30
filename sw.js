/* ═══════════════════════════════════════════════
   LUMIO — sw.js  v3.0
   Service Worker for Android 12+ PWA
   Strategy: Cache-first for static assets,
             Network-first for API calls,
             Offline fallback for pages
═══════════════════════════════════════════════ */

'use strict';

const CACHE_NAME    = 'lumio-v3';
const RUNTIME_CACHE = 'lumio-runtime-v3';
const FONT_CACHE    = 'lumio-fonts-v3';

// Core shell — cached at install time (must succeed)
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
  './app.css',
  './app.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// External CDN fonts & icons — cached at runtime
const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com'
];

// API origins — always go network first, never cache
const API_ORIGINS = [
  'https://api.anthropic.com',
  'https://api.openai.com',
  'https://generativelanguage.googleapis.com',
  'https://api.perplexity.ai'
];

/* ── INSTALL ─────────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())       // take control immediately
  );
});

/* ── ACTIVATE ────────────────────────────────── */
self.addEventListener('activate', event => {
  const CURRENT_CACHES = [CACHE_NAME, RUNTIME_CACHE, FONT_CACHE];
  event.waitUntil(
    Promise.all([
      // Purge old caches
      caches.keys().then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => !CURRENT_CACHES.includes(name))
            .map(name => caches.delete(name))
        )
      ),
      // Claim all open clients immediately (important for Android 12)
      self.clients.claim()
    ])
  );
});

/* ── FETCH ───────────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // 2. AI API calls — network-only, never cache (prevents stale API responses)
  if (API_ORIGINS.some(origin => request.url.startsWith(origin))) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: 'You are offline. Please check your connection.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // 3. Fonts & CDN assets — cache-first with runtime fallback
  if (FONT_ORIGINS.some(origin => request.url.startsWith(origin))) {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // 4. Same-origin assets — cache-first with network fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          // Background-refresh precached assets (stale-while-revalidate)
          const precacheUrls = PRECACHE_ASSETS.map(a =>
            new URL(a, self.location.origin).pathname
          );
          if (precacheUrls.includes(url.pathname)) {
            fetch(request).then(response => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then(cache => cache.put(request, response));
              }
            }).catch(() => {});
          }
          return cached;
        }

        // Not cached — fetch and store in runtime cache
        return fetch(request)
          .then(response => {
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone()));
            return response;
          })
          .catch(() =>
            // Offline fallback — serve index.html for navigation requests
            request.destination === 'document'
              ? caches.match('./index.html')
              : new Response('', { status: 408 })
          );
      })
    );
    return;
  }

  // 5. Everything else — network with fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

/* ── PUSH NOTIFICATIONS ──────────────────────── */
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title   = data.title   || 'Lumio';
  const options = {
    body:    data.body    || 'Time to study! 📚',
    icon:    './icons/icon-192.png',
    badge:   './icons/icon-192.png',
    vibrate: [200, 100, 200],
    data:    { url: data.url || './' },
    actions: [
      { action: 'open',    title: 'Open Lumio' },
      { action: 'dismiss', title: 'Dismiss'    }
    ],
    tag:     'lumio-reminder',
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const targetUrl = event.notification.data?.url || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

/* ── BACKGROUND SYNC (for offline actions) ───── */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    // Placeholder for future background sync of study data
    event.waitUntil(Promise.resolve());
  }
});

/* ── MESSAGE HANDLER ─────────────────────────── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});
