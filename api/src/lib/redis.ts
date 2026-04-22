import Redis from 'ioredis';

// Singleton Redis client for view deduplication and other caching needs.
// Connects to Valkey (Redis-compatible) on the same server.
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  keyPrefix: 'avito-georgia:',
  lazyConnect: true,
  retryStrategy: (times) => {
    // Retry with exponential backoff, max 30s delay
    return Math.min(times * 500, 30000);
  },
  enableOfflineQueue: false,
});

redis.on('error', (err) => {
  console.error('[Redis] connection error:', err.message);
});
