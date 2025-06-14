import mongoose from 'mongoose';
import redisClient from './redis';

export async function gracefulShutdown() {
  console.log('\n🧹 Gracefully shutting down...');

  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (err) {
    console.error('❌ MongoDB disconnect error:', (err as Error).message);
  }

  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log('✅ Redis disconnected');
    }
  } catch (err) {
    console.error('❌ Redis disconnect error:', (err as Error).message);
  }

  process.exit(0);
}