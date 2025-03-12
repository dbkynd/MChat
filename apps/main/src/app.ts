import * as database from './database/index.js';
import * as server from './server/index.js';
import * as elastic from './elastic/index.js';
import * as pushover from '@repo/utilities/pushover';
import logger from './logger.js';

export async function start() {
  pushover.init(logger, 'Sync application started.');
  elastic.init();
  await elastic.testConnection();
  await database.connect();
  await server.start();
}

export async function stop() {
  await server.stop();
  await database.disconnect();
}
