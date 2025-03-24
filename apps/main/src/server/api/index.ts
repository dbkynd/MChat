import { Hono } from 'hono';
import logger from '../../logger.js';
import { isValidDate } from '../../sync/date.js';
import sync from '../../sync/index.js';
import ChannelRoutes from './routes/channels.js';
import WorkerRoutes from './routes/workers.js';

const app = new Hono();

app.get('/', async (c) => {
  return c.json({ message: 'Welcome to the API!' });
});

app.route('/channels', ChannelRoutes);
app.route('/workers', WorkerRoutes);

app.post('/sync', async (c) => {
  const { channel, date } = await c.req.json();
  if (!channel || !date || !isValidDate(date)) return c.text('Bad Request', 400);
  try {
    await sync(channel, date);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
