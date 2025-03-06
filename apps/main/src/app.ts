import * as database from './database/index.js';
import * as server from './server/index.js';

export async function start() {
  await database.connect();
  await server.start();
}

export async function stop() {
  await server.stop();
  await database.disconnect();
}
