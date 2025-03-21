import tmi from 'tmi.js';
import logger from '../logger.js';
import { getChannelLogger } from './channel_logger.js';
import Stats from './channel_stats.js';

const client = new tmi.Client({});
export const stats: Record<string, Stats> = {};

const ignoredCommands = [
  'CAP',
  'PING',
  'PONG',
  'RECONNECT',
  'SERVERCHANGE',
  'MODE',
  'JOIN',
  'PART',
];
let skip = false;

client.on('raw_message', async (msg: tmi.ChatUserstate) => {
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

  // Ensure the channel name exists
  const channel = msg.params[0]?.replace('#', '') as string | undefined;
  if (!channel) return;

  // Log message to disk
  const logger = getChannelLogger(channel);
  if (logger) logger.info(msg.raw, { command: msg.command });

  // Increment channel stats
  if (msg.command === 'PRIVMSG') {
    if (!stats[channel]) stats[channel] = new Stats();
    stats[channel].recordMessage();
  }
});

export async function connect(): Promise<void> {
  await client.connect().then(() => {
    logger.info('Connected to Twitch TMI');
  });
}

export async function disconnect(): Promise<void> {
  await client.disconnect().then(() => {
    logger.info('Disconnected from Twitch TMI');
  });
}

export function joinChannel(channel: string) {
  client
    .join(channel)
    .then(() => {
      logger.info(`Joined: ${channel}`);
    })
    .catch((err) => logger.error(`Failed to join ${channel}:`, err));
}

export function partChannel(channel: string) {
  client
    .part(channel)
    .then(() => {
      logger.info(`Left: ${channel}`);
    })
    .catch((err) => logger.error(`Failed to leave ${channel}:`, err));
}

export function isConnected(): boolean {
  return client.readyState() === 'OPEN';
}

export function getChannels(): string[] {
  return client.getChannels().map((x) => x.replace('#', ''));
}
