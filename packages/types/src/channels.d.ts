import { Types, Document } from 'mongoose';

interface Channel {
  name: string;
  doPolling: boolean;
}

declare global {
  interface ChannelDoc extends Document<Types.ObjectId>, Channel {}
}
