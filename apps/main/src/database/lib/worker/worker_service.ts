import { Worker } from './worker_model.js';

async function list(): Promise<WorkerDoc[]> {
  return await Worker.find();
}

async function add(uri: string): Promise<WorkerDoc> {
  const worker = new Worker({ uri });
  await worker.save();
  return worker;
}

async function update(doc: Worker): Promise<WorkerDoc | null> {
  return Worker.findByIdAndUpdate(doc._id, doc, { new: true });
}

async function remove(id: string): Promise<void> {
  await Worker.findByIdAndDelete(id);
}

export default { list, add, update, remove };
