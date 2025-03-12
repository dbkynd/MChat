import { SyncResults } from './sync_results_model.js';

async function add(channel: string, date: string, result: SyncResult): Promise<void> {
  const doc = new SyncResults({
    channel,
    date,
    result,
  });
  await doc.save();
}

export default { add };
