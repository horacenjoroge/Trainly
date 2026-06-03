const Redis = require('ioredis');
const config = require('../../core/config');
const logger = require('../../core/logger');
const metrics = require('../../observability/metrics');

let redis = null;
let redisConnected = false;
if (config.REDIS_URL) {
  redis = new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 3, retryStrategy: (times) => Math.min(times * 50, 2000) });
  redis.on('error', (err) => {
    metrics.recordCacheError();
    logger.error({ err }, 'Redis connection error');
  });
  redis.on('connect', () => {
    redisConnected = true;
    logger.info('Redis connected');
  });
  redis.on('close', () => {
    redisConnected = false;
    logger.warn('Redis connection closed');
  });
} else {
  logger.warn('Redis not configured — running without cache');
}

const cache = {
  async get(key) {
    if (!redis) {
      metrics.recordCacheSkip();
      return null;
    }
    try {
      const value = await redis.get(key);
      if (value === null) metrics.recordCacheMiss();
      else metrics.recordCacheHit();
      return value;
    } catch {
      metrics.recordCacheError();
      return null;
    }
  },
  async set(key, value, ttl = 3600) {
    if (!redis) {
      metrics.recordCacheSkip();
      return;
    }
    try { await redis.set(key, value, 'EX', ttl); } catch { metrics.recordCacheError(); }
  },
  async del(key) {
    if (!redis) {
      metrics.recordCacheSkip();
      return;
    }
    try { await redis.del(key); } catch { metrics.recordCacheError(); }
  },
  async exists(key) {
    if (!redis) {
      metrics.recordCacheSkip();
      return false;
    }
    try {
      const exists = (await redis.exists(key)) === 1;
      if (exists) metrics.recordCacheHit();
      else metrics.recordCacheMiss();
      return exists;
    } catch {
      metrics.recordCacheError();
      return false;
    }
  },
  async blacklistToken(jti, ttl = 86400) { await this.set(`bl:${jti}`, '1', ttl); },
  async isTokenBlacklisted(jti) { return this.exists(`bl:${jti}`); },
  async increment(key, ttl = 3600) {
    if (!redis) {
      metrics.recordCacheSkip();
      return 0;
    }
    try {
      const val = await redis.incr(key);
      if (val === 1) await redis.expire(key, ttl);
      return val;
    } catch {
      metrics.recordCacheError();
      return 0;
    }
  },
  getClient() { return redis; },
  async quit() { if (redis) await redis.quit(); },
  getStatus() {
    return {
      enabled: Boolean(config.REDIS_URL),
      connected: redisConnected,
    };
  },
};
module.exports = cache;
