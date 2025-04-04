import { Types, Document } from 'mongoose';

// _id is a string for frontend
// _id is a Mongoose ObjectId for backend

declare global {
  /* WORKER */
  interface Worker {
    _id: string;
    uri: string;
    doPolling: boolean;
    __v: number;
  }

  interface WorkerDoc extends Omit<Worker, '_id'>, Document<Types.ObjectId> {
    _id: Types.ObjectId;
  }

  /* CHANNEL */
  interface Channel {
    _id: string;
    name: string;
    doPolling: boolean;
    __v: number;
  }

  interface ChannelDoc extends Omit<Channel, '_id'>, Document<Types.ObjectId> {
    _id: Types.ObjectId;
  }

  /* SYNC STATS */
  interface SyncStats {
    _id: string;
    channel: string;
    date: Date;
    createdAt: Date;
    result: SyncResult;
    __v: number;
  }

  interface SyncStatsDoc extends Omit<SyncStats, '_id'>, Document<Types.ObjectId> {
    _id: Types.ObjectId;
  }
}
