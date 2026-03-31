import { Server } from 'http';
import app from './app';
import dotenv from 'dotenv';
import { prisma } from './config/prisma';
import { seedDatabase } from './utils/seed';

dotenv.config();

const port = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    try {
      await seedDatabase();
      console.log('✅ Seeding check completed');
    } catch (error) {
      console.warn('⚠️ Seeding failed, but server will continue:', error);
    }

    const server: Server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log('Server closed');
        });
      }
      process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.error(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      console.log('SIGTERM received');
      if (server) {
        server.close();
      }
    });

  } catch (err) {
    console.error('Failed to connect to database', err);
  }
}

main();
