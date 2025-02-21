import tmi from 'tmi.js';
import { getChannelLogger } from '../logger.js';

const client = new tmi.Client({});

const ignoredCommands = ['CAP', 'PING', 'PONG', 'RECONNECT', 'SERVERCHANGE', 'MODE', 'JOIN', 'PART'];
let skip = false;

client.on('raw_message', async (msg) => {
  // Don't process messages for the first 10 seconds after connection (CAP)
  // as these contain reoccurring HOSTTARGET | NOTICE | ROOMSTATE | USERSTATE messages
  // when first joining a channel
  if (msg.command === 'CAP') {
    skip = true;
    setTimeout(() => {
      skip = false;
    }, 10000);
  }
  if (skip) return;
  if (ignoredCommands.includes(msg.command)) return;
  if (/^\d+$/.test(msg.command)) return;

  const channel = msg.params[0];
  if (!channel) return;

  const logger = getChannelLogger(channel);
  if (logger) logger.info(msg.raw, { command: msg.command });
});

export async function connect() {
  return client.connect();
}

export async function disconnect() {
  return client.disconnect();
}

export function joinChannel(channel: string) {
  client
    .join(channel)
    .then(() => {
      console.log(`Joined: ${channel}`);
    })
    .catch((err) => console.error(`Failed to join ${channel}:`, err));
}

export function partChannel(channel: string) {
  client
    .part(channel)
    .then(() => {
      console.log(`Left: ${channel}`);
    })
    .catch((err) => console.error(`Failed to leave ${channel}:`, err));
}
