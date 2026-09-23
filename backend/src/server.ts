import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { seedDatabase } from './utils/seedData';

const startServer = async () => {
  try {
    console.log('--- Starting Feedants Backend Service ---');
    await connectDB();

    // Auto-seed initial competition if not already seeded
    await seedDatabase();

    const app = createApp();

    const server = app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`Feedants API Server running at http://0.0.0.0:${env.PORT} (LAN: http://10.144.226.6:${env.PORT})`);
      console.log(`Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`Competitions API: http://localhost:${env.PORT}/api/competitions`);
    });

    const shutdown = async () => {
      console.log('\nReceived shutdown signal. Closing server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err: any) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
