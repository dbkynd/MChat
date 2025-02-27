import { serve, type ServerType } from '@hono/node-server';
import logger from '../logger.js';
import app from './app.js';
import type { Socket } from 'net';

let server: ServerType;
const connections = new Set<Socket>();

export async function start(): Promise<void> {
  return new Promise<void>((resolve) => {
    server = serve(
      {
        fetch: app.fetch,
        port: 3000,
      },
      (info) => {
        logger.info(`Server is running on http://localhost:${info.port}`);
        resolve();
      },
    );

    // Track open connections
    server.on('connection', (socket: Socket) => {
      connections.add(socket);
      socket.on('close', () => connections.delete(socket));
    });
  });
}

export async function stop(): Promise<void> {
  logger.info('Shutting down server gracefully...');

  // Stop accepting new connections
  if (server) {
    server.close((err: Error | undefined) => {
      if (err) logger.error('Error during shutdown:', err);
      else logger.info('Server closed.');
    });

    // Force close open connections
    connections.forEach((socket) => socket.destroy());
  }
}
