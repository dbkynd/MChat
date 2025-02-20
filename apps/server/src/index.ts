import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { connectDB } from '@repo/database';

import { channelRoutes } from './routes/channels';

const app = new Hono();

// Middleware
app.use(logger());
app.use(cors());

connectDB();

app.get('/api', async (c) => {
  return c.json({ message: 'Welcome to the API!' });
});

// Routes
app.route('/api/channels', channelRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
serve({ fetch: app.fetch, port: Number(PORT) });

console.log(`✅ Server started on http://localhost:${PORT}`);
