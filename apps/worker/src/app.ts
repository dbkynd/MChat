import { updateBaseUrl } from './axios.js';
import { ConfigManager } from './config.js';
import api from './server/index.js';
import { syncChannels } from './twitch/channel_manager.js';
import * as twitch from './twitch/chat.js';

export const configManager = new ConfigManager();

export async function start(): Promise<void> {
  await configManager.init();
  updateBaseUrl();
  await api.start();
  await twitch.connect();
  await syncChannels();
}

export async function stop(): Promise<void> {
  await twitch.disconnect();
  await api.stop();
}
