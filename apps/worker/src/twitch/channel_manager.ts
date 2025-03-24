import { arraysMatchUnordered } from '@repo/utilities/arrays';
import { configManager } from '../app.js';
import api from '../axios.js';
import logger from '../logger.js';
import { addChannelLogger, removeChannelLogger } from './channel_logger.js';
import { joinChannel, partChannel } from './chat.js';

const currentChannels = new Set<string>();
let databaseChannels = new Set<string>();
let lastFetchSuccessful = false;

let syncTimeout: NodeJS.Timeout;
const defaultSyncInterval = 1000 * 60 * 60;
const defaultBackoffInterval = 1000 * 2.5;
const maxBackoffInterval = 1000 * 60 * 10;
let syncInterval = defaultSyncInterval;
let backoffInterval = defaultBackoffInterval;

export async function syncChannels(): Promise<void> {
  const hasMainNodeUrl = Boolean(configManager.get('main_node_url'));
  if (!hasMainNodeUrl) {
    logger.warn(
      'Cannot sync channels until the Main Node URL is set in config.json. Either manually or via the GUI',
    );
    return;
  }

  const configChannels: string[] = configManager.get('channels') || [];
  if (process.env.NODE_ENV !== 'production') await sleep(5000); // Avoid rate limiting in development

  try {
    const channels = await fetchChannels();
    databaseChannels = new Set(channels);
    sync(channels);
    syncInterval = defaultSyncInterval;
    backoffInterval = defaultBackoffInterval;
    if (!configChannels.length || !arraysMatchUnordered(channels, configChannels))
      configManager.set('channels', channels);
  } catch (error) {
    logger.error('Error during syncChannels:', error);
    logger.warn('Falling back to config channels for sync.');
    sync(configChannels);
    advanceBackoff();
  } finally {
    scheduleSync();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChannels(): Promise<string[]> {
  return api
    .get<string[]>('/channels')
    .then(({ data }) => {
      lastFetchSuccessful = true;
      return data;
    })
    .catch((err) => {
      lastFetchSuccessful = false;
      throw err;
    });
}

function advanceBackoff(): void {
  backoffInterval = Math.min(backoffInterval * 2, maxBackoffInterval);
  syncInterval = backoffInterval;
}

function scheduleSync(): void {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncChannels, syncInterval);
}

function sync(channels: string[]) {
  const newChannels = new Set(channels);

  const channelsToJoin = [...newChannels].filter((ch) => !currentChannels.has(ch));
  const channelsToLeave = [...currentChannels].filter((ch) => !newChannels.has(ch));

  // Join new channels
  for (const channel of channelsToJoin) {
    addChannelLogger(channel);
    joinChannel(channel);
    currentChannels.add(channel);
  }

  // Leave removed channels
  for (const channel of channelsToLeave) {
    partChannel(channel);
    removeChannelLogger(channel);
    currentChannels.delete(channel);
  }
}

export function getDatabaseChannels(): Set<string> {
  return databaseChannels;
}

export function getLastFetchSuccessful(): boolean {
  return lastFetchSuccessful;
}
