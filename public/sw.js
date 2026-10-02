/**
 * Delhi Yatra - Service Worker with Static Map Tile Caching
 * Caches OpenStreetMap & CartoDB tiles to allow seamless map viewing on unstable/offline connections.
 */

const TILE_CACHE_NAME = 'delhi-yatra-map-tiles-v1';
const STATIC_CACHE_NAME = 'delhi-yatra-static-v1';
const MAX_TILE_ENTRIES = 2500; // ~40-50MB max storage for map tiles

// Baseline Delhi NCR tile coordinates for zoom levels 11 & 12
// Delhi: Lat ~28.625, Lon ~77.215
const PRECACHE_TILE_URLS = [
  // Voyager Basemaps (Default)
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/11/1462/852.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/11/1463/852.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/11/1464/852.png',
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/11/1462/853.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/11/1463/853.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/11/1464/853.png',
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/11/1462/854.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/11/1463/854.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/11/1464/854.png',
  // Zoom 12 Central Delhi (Connaught Place, Kashmere Gate, Anand Vihar, AIIMS)
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/12/2925/1705.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/12/2926/1705.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/12/2927/1705.png',
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/12/2925/1706.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/12/2926/1706.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/12/2927/1706.png',
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/12/2925/1707.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/12/2926/1707.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/12/2927/1707.png',
  // OpenStreetMap fallback equivalents
  'https://a.tile.openstreetmap.org/11/1463/853.png',
  'https://b.tile.openstreetmap.org/11/1463/854.png',
  'https://c.tile.openstreetmap.org/12/2926/1706.png',
  'https://a.tile.openstreetmap.org/12/2926/1707.png',
  // Leaflet CDN CSS
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// Offline fallback SVG tile for unvisited areas when offline
const OFFLINE_FALLBACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#F8FAFC"/>
  <path d="M0 0h256v256H0z" fill="none" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4,4"/>
  <circle cx="128" cy="115" r="16" fill="#EA580C" opacity="0.15"/>
  <circle cx="128" cy="115" r="6" fill="#EA580C"/>
  <text x="128" y="148" text-anchor="middle" font-size="11" font-weight="600" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif">Delhi Yatra</text>
  <text x="128" y="163" text-anchor="middle" font-size="9" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif">Offline Area (Uncached)</text>
</svg>
`.trim();

// Determine if request is for a map tile
function isMapTileRequest(url) {
  const host = url.hostname.toLowerCase();
  const path = url.pathname.toLowerCase();

  const isKnownTileHost =
    host.includes('tile.openstreetmap.org') ||
    host.includes('basemaps.cartocdn.com') ||
    host.includes('carto.com') ||
    host.includes('tile.opentopomap.org');

  const hasTilePattern = /\/\d+\/\d+\/\d+(\.png|\.jpg|\.webp)?$/i.test(path);

  return isKnownTileHost || (hasTilePattern && !path.startsWith('/api/'));
}

// Trim cache entries to prevent unlimited disk usage
async function trimTileCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      // Evict oldest entries
      const deleteCount = keys.length - maxItems;
      for (let i = 0; i < deleteCount; i++) {
        await cache.delete(keys[i]);
      }
    }
  } catch (err) {
    console.warn('[SW] Cache trim error:', err);
  }
}

// -------------------------------------------------------------
// Service Worker Lifecycle
// -------------------------------------------------------------

// Install event: pre-cache baseline Delhi tiles
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(TILE_CACHE_NAME);
        const fetchPromises = PRECACHE_TILE_URLS.map(async (url) => {
          try {
            const resp = await fetch(url, { mode: 'cors', credentials: 'omit' });
            if (resp.ok || resp.type === 'opaque') {
              await cache.put(url, resp);
            }
          } catch (e) {
            // Ignore individual pre-cache failures during install
          }
        });
        await Promise.allSettled(fetchPromises);
      } catch (err) {
        console.warn('[SW] Pre-caching baseline tiles notice:', err);
      }
    })()
  );
});

// Activate event: clean up outdated caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== TILE_CACHE_NAME && key !== STATIC_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

// -------------------------------------------------------------
// Fetch Interception
// -------------------------------------------------------------

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Map Tiles: Cache-First with Network Fallback & Background Update
  if (isMapTileRequest(url)) {
    event.respondWith(
      (async () => {
        const tileCache = await caches.open(TILE_CACHE_NAME);
        const cachedResponse = await tileCache.match(request);

        // If found in cache, return immediately and trigger background refresh if online
        if (cachedResponse) {
          // Non-blocking background revalidation
          event.waitUntil(
            (async () => {
              try {
                const networkResp = await fetch(request, { mode: 'cors', credentials: 'omit' });
                if (networkResp.status === 200 || networkResp.type === 'opaque') {
                  await tileCache.put(request, networkResp);
                }
              } catch (_) {
                // Background network failed (normal when offline/unstable), cached tile remains safe
              }
            })()
          );
          return cachedResponse;
        }

        // Not in cache: fetch from network with timeout
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);

          const networkResponse = await fetch(request, {
            signal: controller.signal,
            mode: 'cors',
            credentials: 'omit'
          });
          clearTimeout(timeoutId);

          if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
            await tileCache.put(request, networkResponse.clone());
            // Periodic cache trim
            trimTileCache(TILE_CACHE_NAME, MAX_TILE_ENTRIES);
          }

          return networkResponse;
        } catch (fetchError) {
          // If offline / connection unstable and tile wasn't in cache:
          // Return clean offline placeholder SVG tile so map doesn't show broken boxes
          return new Response(OFFLINE_FALLBACK_SVG, {
            status: 200,
            headers: {
              'Content-Type': 'image/svg+xml',
              'Cache-Control': 'public, max-age=604800',
              'X-Delhi-Yatra-Offline': 'true'
            }
          });
        }
      })()
    );
    return;
  }

  // 2. Leaflet CSS and third-party static assets: Cache-First
  if (url.hostname.includes('unpkg.com') && url.pathname.includes('leaflet')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const resp = await fetch(request);
          if (resp.status === 200) {
            await cache.put(request, resp.clone());
          }
          return resp;
        } catch (err) {
          return cached || new Response('', { status: 503 });
        }
      })()
    );
    return;
  }

  // 3. Static fonts & Google Fonts: Cache-First
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const resp = await fetch(request);
          if (resp.status === 200) {
            await cache.put(request, resp.clone());
          }
          return resp;
        } catch (err) {
          return cached || new Response('', { status: 503 });
        }
      })()
    );
    return;
  }
});

// -------------------------------------------------------------
// Client Communication (Cache stats, pre-download, clear)
// -------------------------------------------------------------

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.type) return;

  // Query cache statistics
  if (data.type === 'GET_TILE_CACHE_STATS') {
    caches.open(TILE_CACHE_NAME).then(async (cache) => {
      const keys = await cache.keys();
      event.ports[0]?.postMessage({
        type: 'TILE_CACHE_STATS',
        count: keys.length,
        maxEntries: MAX_TILE_ENTRIES,
        cacheName: TILE_CACHE_NAME
      });
    });
  }

  // Pre-download Delhi NCR tiles on user demand
  if (data.type === 'PRELOAD_DELHI_TILES') {
    (async () => {
      const cache = await caches.open(TILE_CACHE_NAME);
      let successCount = 0;

      // Expand bounding box for Delhi NCR: Zoom 11 and 12
      const tilesToFetch = [];
      // Zoom 11 (X: 1461 to 1465, Y: 851 to 855)
      for (let x = 1461; x <= 1465; x++) {
        for (let y = 851; y <= 855; y++) {
          tilesToFetch.push(`https://a.basemaps.cartocdn.com/rastertiles/voyager/11/${x}/${y}.png`);
        }
      }
      // Zoom 12 (X: 2923 to 2929, Y: 1703 to 1709)
      for (let x = 2923; x <= 2929; x++) {
        for (let y = 1703; y <= 1709; y++) {
          tilesToFetch.push(`https://a.basemaps.cartocdn.com/rastertiles/voyager/12/${x}/${y}.png`);
        }
      }

      for (const tileUrl of tilesToFetch) {
        try {
          const resp = await fetch(tileUrl, { mode: 'cors', credentials: 'omit' });
          if (resp.ok || resp.type === 'opaque') {
            await cache.put(tileUrl, resp);
            successCount++;
          }
        } catch (e) {}
      }

      const totalKeys = await cache.keys();
      event.ports[0]?.postMessage({
        type: 'PRELOAD_COMPLETE',
        added: successCount,
        total: totalKeys.length
      });
    })();
  }

  // Clear map tile cache
  if (data.type === 'CLEAR_TILE_CACHE') {
    caches.delete(TILE_CACHE_NAME).then(() => {
      event.ports[0]?.postMessage({
        type: 'CACHE_CLEARED',
        success: true
      });
    });
  }
});
