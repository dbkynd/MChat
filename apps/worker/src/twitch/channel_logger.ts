import { type Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { DateTime } from 'luxon';
import path from 'path';
import fs from 'fs/promises';
import { gzip } from 'node-gzip';
import logger from '../logger.js';
import { dataDir } from '../config.js';

const { combine, timestamp, printf } = format;
const chatLoggers: { [key: string]: Logger } = {};

const chatLogFormat = printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { level, ...rest } = info; // Strip 'level' out of the object
  return JSON.stringify(rest);
});

async function zipOldLogs(channel: string, directory: string): Promise<void> {
  try {
    try {
      await fs.access(directory);
    } catch {
      return;
    }
    const today = DateTime.now().toFormat('yyyy-LL-dd');
    const todayLogPath = `${channel}-${today}.log`;

    const files = await fs.readdir(directory);
    const nonZippedFiles = files.filter((file) => file.endsWith('.log'));
    for (const file of nonZippedFiles) {
      if (file === todayLogPath) continue;
      const zipped = await gzip(await fs.readFile(path.join(directory, file)));
      await fs.writeFile(path.join(directory, file + '.gz'), zipped);
      await fs.rm(path.join(directory, file));
    }
  } catch (error) {
    logger.error(`Error zipping logs for ${channel}:`, error);
  }
}

function createChannelLogger(channel: string): Logger {
  const directory = path.join(dataDir, channel);
  zipOldLogs(channel, directory);

  return createLogger({
    transports: [
      new transports.DailyRotateFile({
        dirname: directory,
        format: combine(timestamp(), chatLogFormat),
        filename: `${channel}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
      }),
    ],
  });
}

export function addChannelLogger(channel: string): void {
  if (!chatLoggers[channel]) {
    chatLoggers[channel] = createChannelLogger(channel);
    logger.info(`Logger added for ${channel}`);
  }
}

export function removeChannelLogger(channel: string): void {
  if (chatLoggers[channel]) {
    delete chatLoggers[channel];
    logger.info(`Logger removed for ${channel}`);
  }
}

export function getChannelLogger(channel: string): Logger | undefined {
  return chatLoggers[channel];
}
