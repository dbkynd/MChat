import * as api from './server/index.js';
import * as twitch from './twitch/chat.js';
import { syncChannels, scheduleSync } from './twitch/channel_manager.js';
import { ConfigManager } from './config.js';
import { updateBaseUrl } from './axios.js';

export const configManager = new ConfigManager();

export async function start() {
  await configManager.init();
  updateBaseUrl();
  await api.start();
  await twitch.connect();
  await syncChannels();
  scheduleSync();
}

export async function stop() {
  await twitch.disconnect();
  await api.stop();
}
