/**
 * Delhi Yatra - Service Worker & Offline Tile Cache Manager
 */

export interface TileCacheStats {
  count: number;
  maxEntries: number;
  cacheName: string;
}

/**
 * Register Service Worker for Map Tile Caching and Offline viewing
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    // Check for updates
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New map tile caching service worker available.');
          }
        };
      }
    };

    return registration;
  } catch (err) {
    console.warn('[SW] Service Worker registration failed:', err);
    return null;
  }
}

/**
 * Request cache statistics from the Service Worker
 */
export async function getTileCacheStats(): Promise<TileCacheStats | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  const controller = navigator.serviceWorker.controller;
  if (!controller) {
    // If not controlled yet, inspect CacheStorage directly
    if ('caches' in window) {
      try {
        const cache = await caches.open('delhi-yatra-map-tiles-v1');
        const keys = await cache.keys();
        return {
          count: keys.length,
          maxEntries: 2500,
          cacheName: 'delhi-yatra-map-tiles-v1'
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data?.type === 'TILE_CACHE_STATS') {
        resolve({
          count: event.data.count,
          maxEntries: event.data.maxEntries,
          cacheName: event.data.cacheName
        });
      } else {
        resolve(null);
      }
    };

    controller.postMessage({ type: 'GET_TILE_CACHE_STATS' }, [channel.port2]);

    // Timeout fallback
    setTimeout(() => resolve(null), 1500);
  });
}

/**
 * Preload high-density Delhi NCR tiles for offline use
 */
export async function preloadDelhiTiles(): Promise<{ added: number; total: number } | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  const controller = navigator.serviceWorker.controller;
  if (!controller) return null;

  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data?.type === 'PRELOAD_COMPLETE') {
        resolve({
          added: event.data.added,
          total: event.data.total
        });
      } else {
        resolve(null);
      }
    };

    controller.postMessage({ type: 'PRELOAD_DELHI_TILES' }, [channel.port2]);

    setTimeout(() => resolve(null), 15000);
  });
}

/**
 * Clear cached map tiles
 */
export async function clearTileCache(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  if ('caches' in window) {
    try {
      await caches.delete('delhi-yatra-map-tiles-v1');
      return true;
    } catch (e) {
      return false;
    }
  }

  return false;
}
