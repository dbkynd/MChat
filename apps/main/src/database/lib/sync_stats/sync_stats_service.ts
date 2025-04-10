import { SyncStats } from './sync_stats_model.js';

function create(channel: string, date: string): SyncStatsDoc {
  return new SyncStats({
    channel,
    date,
  });
}

async function save(doc: SyncStatsDoc): Promise<void> {
  await doc.save();
}

async function add(channel: string, date: string, result: SyncResult): Promise<SyncStatsDoc> {
  const doc = new SyncStats({
    channel,
    date,
    result,
  });
  await doc.save();
  return doc;
}

async function getRange(channel: string, startDate: Date, endDate: Date): Promise<SyncStatsDoc[]> {
  return await SyncStats.find({
    channel,
    date: { $gte: startDate, $lte: endDate },
  });
}

export default { create, save, add, getRange };
