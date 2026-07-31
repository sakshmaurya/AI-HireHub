import { redisClient } from '../utils/redis.js';

export const cacheGet = async (key: string) => {
  const cached = await redisClient.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
};

export const cacheSet = async (key: string, value: any, expirySeconds: number = 3600) => {
  await redisClient.set(key, JSON.stringify(value), expirySeconds);
};

export const cacheDel = async (key: string) => {
  await redisClient.del(key);
};

export const cacheDelPattern = async (pattern: string) => {
  // This would require Redis SCAN command
  // For now, just delete single keys
  await redisClient.del(pattern);
};

export const cacheExists = async (key: string) => {
  return await redisClient.exists(key);
};

export const cacheTTL = async (key: string) => {
  return await redisClient.ttl(key);
};

// Cache middleware factory
export const cacheMiddleware = (keyGenerator: (req: any) => string, ttl: number = 3600) => {
  return async (req: any, res: any, next: any) => {
    const cacheKey = keyGenerator(req);
    
    try {
      const cached = await cacheGet(cacheKey);
      if (cached) {
        return res.json(cached);
      }
      
      // Store original json method
      const originalJson = res.json.bind(res);
      
      // Override json method to cache response
      res.json = async (data: any) => {
        await cacheSet(cacheKey, data, ttl);
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

export default {
  cacheGet,
  cacheSet,
  cacheDel,
  cacheDelPattern,
  cacheExists,
  cacheTTL,
  cacheMiddleware,
};
