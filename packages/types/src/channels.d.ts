import { Types, Document } from 'mongoose';

declare global {
  interface Channel {
    _id: string; // _id is a string for frontend
    name: string;
    doPolling: boolean;
    __v: number;
  }

  interface ChannelDoc extends Omit<Channel, '_id'>, Document<Types.ObjectId> {
    _id: Types.ObjectId; // _id is a Mongoose ObjectId for backend
  }
}
