/**
 * SWR (Stale-While-Revalidate) In-Memory & LocalStorage Cache Utility
 * Provides 0ms instant synchronous initial read with background revalidation.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Global in-memory cache map across page navigations
const memoryCache = new Map<string, CacheEntry<any>>();

// Default cache TTL: 2 minutes in memory, 10 minutes in localStorage
const DEFAULT_STALE_TIME_MS = 120 * 1000;

/**
 * Get synchronously from memory cache first, then localStorage
 */
export function getCachedData<T>(key: string): T | null {
  // 1. Check in-memory cache
  if (memoryCache.has(key)) {
    const entry = memoryCache.get(key);
    if (entry && entry.data !== undefined) {
      return entry.data as T;
    }
  }

  // 2. Check localStorage (if in browser)
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`lmc_cache_${key}`);
      if (raw) {
        const parsed: CacheEntry<T> = JSON.parse(raw);
        if (parsed && parsed.data !== undefined) {
          // Warm up in-memory cache
          memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {
      // Ignore parse/storage errors
    }
  }

  return null;
}

/**
 * Store data into memory cache and localStorage
 */
export function setCachedData<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };

  // Set memory cache
  memoryCache.set(key, entry);

  // Set localStorage asynchronously
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`lmc_cache_${key}`, JSON.stringify(entry));
    } catch {
      // Ignore quota or storage errors
    }
  }
}

/**
 * Invalidate a cached key
 */
export function invalidateCache(key: string): void {
  memoryCache.delete(key);
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`lmc_cache_${key}`);
    } catch {
      // Ignore
    }
  }
}

/**
 * Invalidate all caches matching prefix
 */
export function invalidateCachePrefix(prefix: string): void {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`lmc_cache_${prefix}`)) {
          localStorage.removeItem(k);
        }
      }
    } catch {
      // Ignore
    }
  }
}

/**
 * Fetch with SWR pattern:
 * 1. Calls fetcher in the background
 * 2. If data is fresh, updates cache and returns new data
 * 3. On error, preserves and returns existing cached data
 */
export async function fetchWithSwr<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    staleTimeMs?: number;
    fallbackData?: T;
  }
): Promise<T> {
  const staleTime = options?.staleTimeMs ?? DEFAULT_STALE_TIME_MS;
  const memoryEntry = memoryCache.get(key);

  // If memory entry is still fresh within staleTime, return immediately
  if (memoryEntry && Date.now() - memoryEntry.timestamp < staleTime) {
    return memoryEntry.data as T;
  }

  try {
    const freshData = await fetcher();
    if (freshData !== undefined && freshData !== null) {
      setCachedData(key, freshData);
      return freshData;
    }
  } catch (err) {
    console.warn(`SWR background fetch failed for [${key}], using cached fallback:`, err);
  }

  // Fallback to cache or provided fallbackData
  const cached = getCachedData<T>(key);
  if (cached !== null) {
    return cached;
  }

  if (options?.fallbackData !== undefined) {
    return options.fallbackData;
  }

  throw new Error(`Failed to fetch data for key [${key}] with no cached fallback.`);
}
