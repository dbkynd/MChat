import { Channel } from '../models/Channel'

async function list(): Promise<string[]> {
  const channels = await Channel.find();
  return channels.map(channel => channel.name);
}

export const ChannelService = { list }
