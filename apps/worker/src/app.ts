import * as api from './server/index.js';
import * as twitch from './chat/twitch.js';
import { syncChannels } from './chat/channel_manager.js';

export async function start() {
  await api.start();
  await twitch.connect();
  await syncChannels();
}

export async function stop() {
  await twitch.disconnect();
  await api.stop();
}
