const Redis = require('ioredis');
const config = require('../../core/config');
const logger = require('../../core/logger');

let redis = null;
if (config.REDIS_URL) {
  redis = new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 3, retryStrategy: (times) => Math.min(times * 50, 2000) });
  redis.on('error', (err) => logger.error({ err }, 'Redis connection error'));
  redis.on('connect', () => logger.info('Redis connected'));
} else {
  logger.warn('Redis not configured — running without cache');
}

const cache = {
  async get(key) { if (!redis) return null; try { return await redis.get(key); } catch { return null; } },
  async set(key, value, ttl = 3600) { if (!redis) return; try { await redis.set(key, value, 'EX', ttl); } catch {} },
  async del(key) { if (!redis) return; try { await redis.del(key); } catch {} },
  async exists(key) { if (!redis) return false; try { return (await redis.exists(key)) === 1; } catch { return false; } },
  async blacklistToken(jti, ttl = 86400) { await this.set(`bl:${jti}`, '1', ttl); },
  async isTokenBlacklisted(jti) { return this.exists(`bl:${jti}`); },
  async increment(key, ttl = 3600) { if (!redis) return 0; try { const val = await redis.incr(key); if (val === 1) await redis.expire(key, ttl); return val; } catch { return 0; } },
  getClient() { return redis; },
  async quit() { if (redis) await redis.quit(); },
};
module.exports = cache;
