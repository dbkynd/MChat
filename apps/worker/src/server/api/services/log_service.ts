import fs from 'fs/promises';
import path from 'path';
import { gzip } from 'node-gzip';
import { dataDir } from '../../../config.js';
import logger from '../../../logger.js';

async function getFileName(channelName: string, date: string): Promise<string | null> {
  const channel = channelName.toLowerCase().replace('#', '');
  const directory = path.join(dataDir, channel);

  // Return a .log file before a zipped .log.gz file
  try {
    const logPath = path.join(directory, `${channel}-${date}.log`);
    if (await exists(logPath)) return logPath;
    const gzipPath = path.join(directory, `${channel}-${date}.log.gz`);
    if (await exists(gzipPath)) return gzipPath;
  } catch (error) {
    logger.error('Error checking file existence:', error);
  }

  return null;
}

async function exists(location: string): Promise<boolean> {
  try {
    await fs.access(location);
    return true;
  } catch {
    return false;
  }
}

async function getFileBuffer(location: string): Promise<Buffer> {
  try {
    const data = await fs.readFile(location);
    if (location.endsWith('.gz')) return data; // Return the gzipped file as-is
    return await gzip(data.toString('utf-8')); // Compress only if the file is not already gzipped
  } catch (error) {
    logger.error(`Error retrieving file: ${location}`, error);
    throw error;
  }
}

export default {
  getFileName,
  getFileBuffer,
};
