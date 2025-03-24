import { serve, type ServerType } from '@hono/node-server';
import type { Socket } from 'net';
import type { Logger } from 'winston';
import type { Hono as HonoApp } from 'hono';

let server: ServerType;
const connections = new Set<Socket>();

/**
 * Provides a wrapper around the Hono server to start and stop it gracefully.
 * @param app The Hono app to serve.
 * @param logger A Winston logger.
 * @returns The start and stop functions for the server.
 */
export default function Hono(app: HonoApp, logger: Logger) {
  async function start(): Promise<void> {
    return new Promise<void>((resolve) => {
      server = serve(
        {
          fetch: app.fetch,
          port: (process.env.PORT || 3000) as number,
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

  async function stop(): Promise<void> {
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

  return { start, stop };
}
