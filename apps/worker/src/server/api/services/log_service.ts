import fs from 'fs';
import path from 'path';
import { gzip } from 'node-gzip';
import { dataDir } from '../../../config.js';

async function getFileName(channelName: string, date: string): Promise<string | null> {
  const channel = channelName.toLowerCase().replace('#', '');
  const directory = path.join(dataDir, channel);

  // Return a .log file before a zipped .log.gz file first
  const logPath = path.join(directory, `${channel}-${date}.log`);
  const logExists = await exists(logPath);
  if (logExists) return logPath;

  const gzipPath = path.join(directory, `${channel}-${date}.log.gz`);
  const gzipExists = await exists(gzipPath);
  if (gzipExists) return gzipPath;

  return null;
}

async function exists(location: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(location, fs.constants.F_OK, (err) => {
      resolve(err === null);
    });
  });
}

async function getFileBuffer(location: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(location, { encoding: null }, async (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      if (!location.endsWith('.gz')) {
        try {
          data = await gzip(data);
        } catch (e) {
          reject(e);
        }
      }
      resolve(data);
    });
  });
}

export default {
  getFileName,
  getFileBuffer,
};
