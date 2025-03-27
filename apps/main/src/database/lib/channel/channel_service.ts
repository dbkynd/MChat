import { Channel } from './channel_model.js';

async function list(): Promise<ChannelDoc[]> {
  return await Channel.find();
}

async function add(name: string): Promise<ChannelDoc> {
  const channel = new Channel({ name });
  await channel.save();
  return channel;
}

async function update(doc: Channel): Promise<ChannelDoc | null> {
  return await Channel.findByIdAndUpdate(doc._id, doc, { new: true });
}

async function remove(id: string): Promise<void> {
  await Channel.findByIdAndDelete(id);
}

export default { list, add, update, remove };
