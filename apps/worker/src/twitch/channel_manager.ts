import { joinChannel, partChannel } from './chat.js';
import { addChannelLogger, removeChannelLogger } from './channel_logger.js';
import logger from '../logger.js';
import api from '../axios.js';
import { configManager } from '../app.js';

const currentChannels = new Set<string>();
let databaseChannels = new Set<string>();
let fetchSuccessful = false;

let syncTimeout: NodeJS.Timeout;
const defaultSyncInterval = 1000 * 60 * 60;
const defaultBackoffInterval = 1000 * 2.5;
const maxBackoffInterval = 1000 * 60 * 10;
let syncInterval = defaultSyncInterval;
let backoffInterval = defaultBackoffInterval;

export async function syncChannels() {
  const hasMainNodeUrl = Boolean(configManager.get('main_node_url'));
  if (!hasMainNodeUrl) {
    logger.warn(
      'Cannot sync channels until the Main Node URL is set in config.json. Either manually or via the GUI',
    );
    return;
  }

  try {
    await sync();
    if (fetchSuccessful) {
      syncInterval = defaultSyncInterval;
      backoffInterval = defaultBackoffInterval;
    } else {
      advanceBackoff();
    }
  } catch (error) {
    logger.error('Error during syncChannels:', error);
    advanceBackoff();
  } finally {
    scheduleSync();
  }
}

function advanceBackoff() {
  backoffInterval = Math.min(backoffInterval * 2, maxBackoffInterval);
  syncInterval = backoffInterval;
}

export function scheduleSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncChannels, syncInterval);
}

async function sync() {
  const newChannels = new Set(await fetchChannels());

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

export async function fetchChannels(): Promise<string[]> {
  const configChannels: string[] = configManager.get('channels') || [];
  try {
    const channels = await api.get<string[]>('/channels').then(({ data }) => data);
    databaseChannels = new Set(channels);
    fetchSuccessful = true;
    if (!configChannels.length || !arraysMatchUnordered(channels, configChannels))
      configManager.set('channels', channels);
    return channels;
  } catch (e) {
    logger.error(e);
    fetchSuccessful = false;
    return configChannels;
  }
}

export function getDatabaseChannels() {
  return databaseChannels;
}

export function getFetchSuccessful() {
  return fetchSuccessful;
}

function arraysMatchUnordered(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;
  return arr1.slice().sort().join(',') === arr2.slice().sort().join(',');
}
