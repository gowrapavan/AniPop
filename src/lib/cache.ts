const CACHE_PREFIX = 'hianime_cache_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function setCacheItem<T>(key: string, data: T, ttl = CACHE_TTL): void {
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting cache item:', error);
  }
}

export function getCacheItem<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(CACHE_PREFIX + key);
    if (!stored) return null;

    const item: CacheItem<T> = JSON.parse(stored);
    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error('Error getting cache item:', error);
    return null;
  }
}

export function clearExpiredCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        getCacheItem(key.replace(CACHE_PREFIX, '')); // This will auto-remove expired items
      }
    });
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
}

// Memory cache for current session
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export function setMemoryCache<T>(key: string, data: T, ttl = 10 * 60 * 1000): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
  setTimeout(() => memoryCache.delete(key), ttl);
}

export function getMemoryCache<T>(key: string): T | null {
  const item = memoryCache.get(key);
  return item ? item.data : null;
}