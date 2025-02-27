import { joinChannel, partChannel } from './twitch.js';
import { addChannelLogger, removeChannelLogger } from './channel_logger.js';
import logger from '../logger.js';

const currentChannels = new Set<string>();

async function fetchChannels(): Promise<string[]> {
  try {
    return ['annemunition', 'dbkynd', 'laceduplauren'];
  } catch (e) {
    logger.error(e);
    return [];
  }
}

export async function syncChannels() {
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

setInterval(syncChannels, 1000 * 60 * 5);
