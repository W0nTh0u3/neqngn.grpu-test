import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import ethRouter from './routes/eth.route';
import { connectRedis } from './utils/redis';
import { connectToMongo } from './utils/mongo';
import { gracefulShutdown } from './utils/cleanup';

const app = express();
app.use(express.json());

if (!process.env.PORT) {
  console.error('❌ PORT environment variable is not set');
  process.exit(1);
}

const port = process.env.PORT || 3000;

(async function startServer() {
  try {
    await connectRedis();
    await connectToMongo();

    app.use('/api/eth', ethRouter);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', async (err) => {
  console.error('💥 Uncaught Exception:', err);
  await gracefulShutdown();
});