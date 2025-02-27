import { createLogger, format, transports, type Logger } from 'winston';
import * as path from 'path';

const rootLogsDir = path.join(process.cwd(), '../../', 'logs');

export type MyLogger = Logger;

export function create(moduleName: string): MyLogger {
  const logsDir = path.join(rootLogsDir, moduleName);

  const logger = createLogger({
    level: 'info',
    // Choose an output format. We'll use JSON + timestamp for file logs.
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      // File transport for errors
      new transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
      }),
      // File transport for everything (combined)
      new transports.File({
        filename: path.join(logsDir, 'combined.log'),
      }),
    ],
  });

  // 5) In development, also log to the console with a more human-readable format
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf((info) => {
            // Customize your console output here
            return `${info.timestamp} [${info.level}]: ${info.message}`;
          }),
        ),
      }),
    );
  }

  return logger;
}
