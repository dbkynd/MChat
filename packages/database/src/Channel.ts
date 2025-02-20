import mongoose, { Document, Schema } from 'mongoose';

export interface ChannelDoc extends Document {
  name: string;
}

const ChannelSchema = new Schema<ChannelDoc>({
  name: { type: String, required: true, unique: true },
});

export const Channel = mongoose.model<ChannelDoc>('channels', ChannelSchema);
