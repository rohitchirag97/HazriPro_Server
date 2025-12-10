import { redis } from "./redis.js";

// Cache TTLs in seconds
export const CACHE_TTL = {
  USER: 60 * 10, // 10 minutes
  COMPANY: 60 * 5, // 5 minutes
};

// Cache keys
export const CACHE_KEYS = {
  user: (userId: string) => `user:${userId}`,
  company: (companyId: string) => `company:${companyId}`,
  companyBySlug: (slug: string) => `company:slug:${slug}`,
};

// Generic cache functions
export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  if (!data) return null;
  return JSON.parse(data) as T;
};

export const setCache = async <T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> => {
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
};

export const deleteCache = async (key: string): Promise<void> => {
  await redis.del(key);
};

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

// Specific cache invalidation helpers
export const invalidateUserCache = async (userId: string): Promise<void> => {
  await deleteCache(CACHE_KEYS.user(userId));
};

export const invalidateCompanyCache = async (
  companyId: string,
  slug?: string
): Promise<void> => {
  await deleteCache(CACHE_KEYS.company(companyId));
  if (slug) {
    await deleteCache(CACHE_KEYS.companyBySlug(slug));
  }
};

