import { Schema, model } from 'mongoose';

const WorkerSchema = new Schema<WorkerDoc>({
  uri: {
    type: String,
    required: true,
    unique: true,
  },
  doPolling: {
    type: Boolean,
    default: false,
  },
});

export const Worker = model<WorkerDoc>('workers', WorkerSchema);
