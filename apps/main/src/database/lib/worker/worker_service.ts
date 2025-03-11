import { Worker } from './worker_model.js';

async function list(): Promise<string[]> {
  return (await Worker.find()).map((worker) => worker.uri);
}

async function add(uri: string): Promise<void> {
  const worker = new Worker({ uri });
  await worker.save();
}

async function update(oldUri: string, newUri: string): Promise<void> {
  await Worker.findOneAndUpdate({ uri: oldUri }, { uri: newUri });
}

async function remove(uri: string): Promise<void> {
  await Worker.findOneAndDelete({ uri });
}

export default { list, add, update, remove };
