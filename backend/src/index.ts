import 'dotenv/config';
import http from 'http';
import app from './app';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { initWebSocket } from './config/websocket';

const PORT = parseInt(process.env.PORT ?? '4000', 10);

async function bootstrap() {
  try {
    await connectDB();
    await connectRedis();

    const server = http.createServer(app);
    initWebSocket(server);

    // Run worker in the same process for free-tier deployments (e.g. Render)
    if (process.env.RUN_WORKER === 'true') {
      console.log('[server] RUN_WORKER is true. Starting background worker in-process...');
      require('./workers/generationWorker');
    }

    server.listen(PORT, () => {
      console.log(`[server] VedaAI backend running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('[server] Shutting down gracefully...');
      server.close(() => process.exit(0));
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('[server] Fatal startup error:', err);
    process.exit(1);
  }
}

bootstrap();
