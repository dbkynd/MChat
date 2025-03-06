import { Channel } from './channel_model.js';

async function list(): Promise<string[]> {
  return (await Channel.find()).map((channel) => channel.name);
}

export default { list };
