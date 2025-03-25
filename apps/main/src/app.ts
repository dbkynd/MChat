import * as pushover from '@repo/utilities/pushover';
import * as database from './database/index.js';
import * as elastic from './elastic/index.js';
import logger from './logger.js';
import api from './server/index.js';

export async function start(): Promise<void> {
  pushover.init(logger, 'Sync application started.');
  await database.connect();
  await elastic.init();
  await api.start();
}

export async function stop(): Promise<void> {
  await api.stop();
  await database.disconnect();
}
