import { SyncStats } from './sync_stats_model.js';

async function add(channel: string, date: string, result: SyncResult): Promise<void> {
  const doc = new SyncStats({
    channel,
    date,
    result,
  });
  await doc.save();
}

export default { add };
