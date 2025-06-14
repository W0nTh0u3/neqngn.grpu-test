import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log('✅ Redis connected');
    } catch (err: any) {
      console.warn('⚠️ Redis unavailable. Continuing without cache.');
    }
  }
}

export default redisClient;
