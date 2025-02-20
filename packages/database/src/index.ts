import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mchat';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('🟢 Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGO_URI);

    isConnected = true;
    console.log('✅ Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export { Channel } from './models/Channel';
export { ChannelService } from './services/ChannelService';
