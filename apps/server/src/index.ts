import { connectDB } from '@repo/database';

async function start() {
  const connection = await connectDB();
}

start();
