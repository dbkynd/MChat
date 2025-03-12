import { Client, estypes } from '@elastic/elasticsearch';
import logger from '../logger.js';
import parser from 'tmi-parser';
import type { ChatUserstate } from 'tmi.js';

let client: Client;

export const uri = process.env.ES_URI || 'http://10.8.4.2:9200';

export function init() {
  client = new Client({
    node: uri,
    /*auth: {
      username: process.env.ES_USERNAME as string,
      password: process.env.ES_PASSWORD as string,
    },*/
  });
}

export async function testConnection(): Promise<void> {
  const { hostname, pathname } = new URL(uri);
  const response = await client.ping();
  if (!response)
    throw new Error(`Unable to connect to ElasticSearch server: '${hostname}${pathname}'`);
  logger.info(`Connected to ElasticSearch: '${hostname}'`);
}

export function getIndex(channel: string) {
  return process.env.NODE_ENV === 'production' ? `tmi-${channel}` : `dev-tmi-${channel}`;
}

export function createTmiElasticBody(line: LogLine): TmiElasticBody {
  return parseTmiMessage(parser.msg(line.message));
}

function parseTmiMessage(msg: ChatUserstate): TmiElasticBody {
  for (const tag in msg.tags) {
    if (msg.tags[tag] === true) msg.tags[tag] = null;
  }

  const timestamp = msg.tags['tmi-sent-ts']
    ? new Date(parseInt(msg.tags['tmi-sent-ts']))
    : new Date();

  let name = msg.tags['display-name'];
  // Edge case where display-name ends in a space
  if (name) name = name.trim();

  return {
    '@timestamp': timestamp.toISOString(),
    id: msg.tags['id'],
    raw: msg.raw,
    command: msg.command,
    message: msg.params[1],
    msg_id: msg.tags['msg-id'],
    user_id: msg.tags['user-id'],
    display_name: name,
    login: name ? name.toLowerCase() : undefined,
  };
}

export async function bulkIndexTmi(
  data: { channel: string; message: TmiElasticBody }[],
): Promise<estypes.BulkResponse> {
  const operations = data.map((x) => {
    const meta = { create: { _index: getIndex(x.channel) } };
    return JSON.stringify(meta) + '\n' + JSON.stringify(x.message);
  });
  return client.bulk({ operations });
}

export function getClient(): Client {
  return client;
}
