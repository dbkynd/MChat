import { Schema, model, Document } from 'mongoose';

export interface ChannelDoc extends Document {
  name: string;
}

const ChannelSchema = new Schema<ChannelDoc>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Channel = model<ChannelDoc>('channels', ChannelSchema);
