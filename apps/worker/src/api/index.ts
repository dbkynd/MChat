import { serve, ServerType } from '@hono/node-server';
import app from './app.js';

let server: ServerType;
const connections = new Set<any>(); // Track open connections

export async function start() {
  return new Promise<void>((resolve) => {
    server = serve(
      {
        fetch: app.fetch,
        port: 3000,
      },
      (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
        resolve();
      },
    );

    // Track open connections
    server.on('connection', (socket: any) => {
      connections.add(socket);
      socket.on('close', () => connections.delete(socket));
    });
  });
}

export async function stop() {
  console.log('Shutting down server gracefully...');

  // Stop accepting new connections
  if (server) {
    server.close((err: any) => {
      if (err) console.error('Error during shutdown:', err);
      else console.log('Server closed.');
    });

    // Force close open connections
    connections.forEach((socket) => socket.destroy());
  }
}
