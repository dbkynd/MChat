import { Schema, model } from 'mongoose';

const ChannelSchema = new Schema<ChannelDoc>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  doPolling: {
    type: Boolean,
    default: false,
  },
});

export const Channel = model<ChannelDoc>('channels', ChannelSchema);
