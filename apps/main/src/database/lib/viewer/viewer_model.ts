import { Schema, model, Document } from 'mongoose';

export interface ViewerDoc extends Document {
  id: string;
}

const ViewerSchema = new Schema<ViewerDoc>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Viewer = model<ViewerDoc>('viewers', ViewerSchema);
