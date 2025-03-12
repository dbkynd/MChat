import { Schema, model, Document } from 'mongoose';

export interface SyncResultsDoc extends Document {
  channel: string;
  date: string;
  createdAt: Date;
  result: SyncResult;
}

const SyncResultsSchema = new Schema<SyncResultsDoc>({
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

export const SyncResults = model<SyncResultsDoc>('sync_results', SyncResultsSchema);
