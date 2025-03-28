import { Types, Document } from 'mongoose';

declare global {
  interface Worker {
    _id: string; // _id is a string for frontend
    uri: string;
    doPolling: boolean;
    __v: number;
  }

  interface WorkerDoc extends Omit<Worker, '_id'>, Document<Types.ObjectId> {
    _id: Types.ObjectId; // _id is a Mongoose ObjectId for backend
  }
}
