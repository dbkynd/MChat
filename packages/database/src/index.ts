import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mchat';

let isConnected = false;

export async function connect() {
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

export async function disconnect() {
  if (!isConnected) return;

  try {
    await mongoose.connection.close();
    isConnected = false;
    console.log('🔴 MongoDB connection closed.');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
}

export { Channel } from './models/Channel';
export { ChannelService } from './services/ChannelService';
