import { ChannelService } from '@repo/database';
import { joinChannel, partChannel } from './twitch/chat.js';
import { addChannelLogger, removeChannelLogger } from './logger.js';

let currentChannels = new Set<string>();

async function fetchChannelsFromDB() {
  try {
    return ChannelService.list();
  } catch (error) {
    return [];
  }
}

export async function syncChannels() {
  const newChannels = new Set(await fetchChannelsFromDB());

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

setInterval(syncChannels, 1000 * 60);
