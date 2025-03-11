import { Channel } from './channel_model.js';

async function list(): Promise<string[]> {
  return (await Channel.find()).map((channel) => channel.name);
}

async function add(name: string): Promise<void> {
  const channel = new Channel({ name });
  await channel.save();
}

async function update(oldName: string, newName: string): Promise<void> {
  await Channel.findOneAndUpdate({ name: oldName }, { name: newName });
}

async function remove(name: string): Promise<void> {
  await Channel.findOneAndDelete({ name });
}

export default { list, add, update, remove };
