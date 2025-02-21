import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { DateTime } from 'luxon';
import path from 'path';
import fs from 'fs/promises';
import { gzip } from 'node-gzip';

const { combine, timestamp, printf } = format;
export const chatLogDir = path.join(process.cwd(), 'data');
const chatLoggers: { [key: string]: Logger } = {};

const chatLogFormat = printf((info) => {
  const { level, ...rest } = info;
  return JSON.stringify(rest);
});

async function zipOldLogs(channel: string, directory: string) {
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
    console.error(`Error zipping logs for ${channel}:`, error);
  }
}

function createChannelLogger(channel: string) {
  const directory = path.join(chatLogDir, channel);
  zipOldLogs(channel, directory).catch(console.error);

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

export function addChannelLogger(channel: string) {
  if (!chatLoggers[channel]) {
    chatLoggers['#' + channel] = createChannelLogger(channel);
    console.log(`Logger added for ${channel}`);
  }
}

export function removeChannelLogger(channel: string) {
  if (chatLoggers['#' + channel]) {
    delete chatLoggers['#' + channel];
    console.log(`Logger removed for ${channel}`);
  }
}

export function getChannelLogger(channel: string): Logger | undefined {
  return chatLoggers[channel];
}

export default chatLoggers;
