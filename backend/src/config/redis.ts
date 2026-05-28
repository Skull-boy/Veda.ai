import IORedis from 'ioredis';

let redisClient: IORedis | null = null;

export async function connectRedis(): Promise<IORedis> {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379';

  redisClient = new IORedis(url, {
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
  });

  redisClient.on('connect', () => console.log('[redis] Connected'));
  redisClient.on('error', (err) => console.error('[redis] Error:', err));

  return redisClient;
}

export function getRedis(): IORedis {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call connectRedis() first.');
  }
  return redisClient;
}
