import { Schema, model, Document } from 'mongoose';

export interface WorkerDoc extends Document {
  uri: string;
  doPolling: boolean;
}

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
