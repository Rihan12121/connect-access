import { useMemo } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const useCache = <T>(key: string, ttl: number = DEFAULT_TTL) => {
  const get = useMemo(() => {
    return (): T | null => {
      const entry = cache.get(key);
      if (!entry) return null;
      
      if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
      }
      
      return entry.data;
    };
  }, [key]);

  const set = useMemo(() => {
    return (data: T): void => {
      cache.set(key, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      });
    };
  }, [key, ttl]);

  const invalidate = useMemo(() => {
    return (): void => {
      cache.delete(key);
    };
  }, [key]);

  const isValid = useMemo(() => {
    return (): boolean => {
      const entry = cache.get(key);
      return !!entry && Date.now() <= entry.expiresAt;
    };
  }, [key]);

  return { get, set, invalidate, isValid };
};

// Cache utilities for common use cases
export const clearAllCache = () => cache.clear();

export const getCacheStats = () => ({
  size: cache.size,
  keys: Array.from(cache.keys()),
});

// Pre-defined cache keys
export const CACHE_KEYS = {
  BESTSELLERS: 'bestsellers',
  DASHBOARD_STATS: 'dashboard_stats',
  CATEGORIES: 'categories',
  FLASH_DEALS: 'flash_deals',
  USER_PROFILE: (userId: string) => `user_profile_${userId}`,
  SELLER_PRODUCTS: (sellerId: string) => `seller_products_${sellerId}`,
  PRODUCT_REVIEWS: (productId: string) => `product_reviews_${productId}`,
};

export default useCache;
