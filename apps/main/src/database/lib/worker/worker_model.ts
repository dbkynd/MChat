import { Schema, model, Document } from 'mongoose';

export interface WorkerDoc extends Document {
  uri: string;
}

const WorkerSchema = new Schema<WorkerDoc>({
  uri: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Worker = model<WorkerDoc>('workers', WorkerSchema);
