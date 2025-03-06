import { Hono } from 'hono';
import ChannelRoutes from './routes/channels.js';

const app = new Hono();

app.get('/', async (c) => {
  return c.json({ message: 'Welcome to the API!' });
});

app.route('/channels', ChannelRoutes);

export default app;
