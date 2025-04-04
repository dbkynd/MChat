import { SyncStats } from './sync_stats_model.js';

async function add(channel: string, date: string, result: SyncResult): Promise<void> {
  const doc = new SyncStats({
    channel,
    date,
    result,
  });
  await doc.save();
}

async function getRange(channel: string, startDate: Date, endDate: Date): Promise<SyncStatsDoc[]> {
  return await SyncStats.find({
    channel,
    date: { $gte: startDate, $lte: endDate },
  });
}

export default { add, getRange };
