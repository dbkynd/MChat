import { joinChannel, partChannel } from './twitch.js';
import { addChannelLogger, removeChannelLogger } from './channel_logger.js';
import logger from '../logger.js';
import api from '../axios.js';
import { configManager } from '../app.js';

const currentChannels = new Set<string>();
let databaseChannels = new Set<string>();

export async function fetchChannels(): Promise<string[]> {
  try {
    const channels = await api.get<string[]>('/channels').then(({ data }) => data);
    databaseChannels = new Set(channels);
    return channels;
  } catch (e) {
    logger.error(e);
    return [];
  }
}

export async function syncChannels() {
  const hasBaseUrl = Boolean(configManager.get('api_url'));
  if (!hasBaseUrl) {
    logger.warn(
      'Cannot sync channels until API URL is set in config.json. Either manually or via the GUI',
    );
    return;
  }

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

setInterval(
  () => {
    const hasBaseUrl = Boolean(configManager.get('api_url'));
    if (hasBaseUrl) syncChannels();
  },
  1000 * 60 * 5,
);

export function getDatabaseChannels() {
  return databaseChannels;
}
