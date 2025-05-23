import mongoose from 'mongoose';
import logger from '../logger.js';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mchat';

export async function connect(): Promise<void> {
  try {
    await mongoose.connect(uri, {});
    logger.info(`Connected to MongoDB at ${uri}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function disconnect(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}
