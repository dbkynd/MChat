import { joinChannel, partChannel } from './chat.js';
import { addChannelLogger, removeChannelLogger } from './channel_logger.js';
import logger from '../logger.js';
import api from '../axios.js';
import { configManager } from '../app.js';
import { arraysMatchUnordered } from '@repo/utilities/arrays';

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

function advanceBackoff() {
  backoffInterval = Math.min(backoffInterval * 2, maxBackoffInterval);
  syncInterval = backoffInterval;
}

function scheduleSync() {
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

export function getDatabaseChannels() {
  return databaseChannels;
}

export function getLastFetchSuccessful() {
  return lastFetchSuccessful;
}
