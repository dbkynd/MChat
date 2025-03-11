import { Hono } from 'hono';
import ChannelRoutes from './routes/channels.js';
import WorkerRoutes from './routes/workers.js';

const app = new Hono();

app.get('/', async (c) => {
  return c.json({ message: 'Welcome to the API!' });
});

app.route('/channels', ChannelRoutes);
app.route('/workers', WorkerRoutes);

export default app;
