import { Server } from 'http';
import app from './app';
import config from './app/config';
import { seedSuperAdmin } from './app/seed';

let server: Server | null = null;

// Graceful shutdown function to close the server properly
function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Closing server... 🤷‍♂️ `);
  if (server) {
    server.close(() => {
      console.log('Server closed gracefully! ✅');
      process.exit(0); // after closing the server, exiting all processes
    });
  } else {
    process.exit(0);
  }
}

// Application bootstrap function
async function main() {
  try {
    // Seed function (optional, use if need)
    await seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}!  ✨  ⚡`);
    });

    // Listen for OS termination signals (Ctrl+C or server stop)
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handling uncaught exceptions (if code have any unwanted error)
    process.on('uncaughtException', (error) => {
      console.error('😈 Uncaught Exception:', error);
      // server is not running, so we need to close the app
      gracefulShutdown('uncaughtException');
    });

    // Handling unhandled promise rejections (if any promise is rejected, but not catched)
    process.on('unhandledRejection', (error) => {
      console.error('😈 Unhandled Rejection:', error);
      // server is not running, so we need to close the app
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    console.error('😈 Error during bootstrap:', error);
    // if error occurs during bootstrap, we need to close the app
    // server is not running, so we need to close the app
    process.exit(1);
  }
}

main();
