import * as database from '@repo/database';
import * as api from './api/index.js';
import * as chat from './twitch/chat.js';
import { syncChannels } from './channel_manager.js';

export async function start() {
  await database.connect();
  await api.start();
  await chat.connect();
  await syncChannels();
}

export async function stop() {
  await chat.disconnect();
  await api.stop();
  await database.disconnect();
}
