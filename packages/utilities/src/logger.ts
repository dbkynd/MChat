import { createLogger, format, transports, type Logger } from 'winston';
import * as path from 'path';
import type { MiddlewareHandler } from 'hono';

const rootLogsDir = path.join(process.cwd(), '../../', 'logs');

export type MyLogger = Logger;

export function create(moduleName: string): MyLogger {
  const logsDir = path.join(rootLogsDir, moduleName);

  const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
      }),
      new transports.File({
        filename: path.join(logsDir, 'combined.log'),
      }),
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf((info) => {
            // Customize your console output here
            return `${info.timestamp} [${info.level}]: ${info.message}`;
          }),
        ),
      }),
    ],
  });

  return logger;
}

export function honoLogger(logger: MyLogger): MiddlewareHandler {
  return async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    logger.info(`${c.req.method} ${c.req.path} - ${duration}ms`);
  };
}
