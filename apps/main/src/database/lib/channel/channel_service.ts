import { Channel, ChannelDoc } from './channel_model.js';

async function list(): Promise<string[]> {
  return (await Channel.find()).map((channel) => channel.name);
}

async function add(name: string): Promise<ChannelDoc> {
  const channel = new Channel({ name });
  await channel.save();
  return channel;
}

async function remove(name: string): Promise<void> {
  await Channel.findOneAndDelete({ name });
}

export default { list, add, remove };
