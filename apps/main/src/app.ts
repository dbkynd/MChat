import * as pushover from '@repo/utilities/pushover';
import * as database from './database/index.js';
import * as elastic from './elastic/index.js';
import logger from './logger.js';
import * as server from './server/index.js';

export async function start() {
  pushover.init(logger, 'Sync application started.');
  await database.connect();
  await elastic.init();
  await server.start();
}

export async function stop() {
  await server.stop();
  await database.disconnect();
}
