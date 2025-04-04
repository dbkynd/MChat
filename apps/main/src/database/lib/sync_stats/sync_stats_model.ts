import { Schema, model } from 'mongoose';

export const SyncStatsSchema = new Schema<SyncStatsDoc>({
  channel: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  result: {
    type: Object,
    required: true,
  },
});

export const SyncStats = model<SyncStatsDoc>('sync_stats', SyncStatsSchema);
