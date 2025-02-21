import * as app from './app.js';

async function startApp() {
  console.log('Starting application...');

  try {
    await app.start();
    console.log('Application started successfully.');
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

async function stopApp() {
  console.log('Shutting down application...');

  try {
    await app.stop();
    console.log('Application shut down gracefully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle termination signals
const shutdownSignals = ['SIGINT', 'SIGTERM'];
shutdownSignals.forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down...`);
    stopApp();
  });
});

// Handle unexpected errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

// Start the application
startApp();
