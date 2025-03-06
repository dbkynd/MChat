import { Hono } from 'hono';
import ChannelService from '../../../database/lib/channel/channel_service.js';
import logger from '../../../logger.js';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const channels = await ChannelService.list();
    return c.json(channels);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.post('/', async (c) => {
  const { name } = await c.req.json();
  if (!name) return c.text('Bad Request', 400);

  try {
    const channel = await ChannelService.add(name);
    return c.json(channel);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/', async (c) => {
  const { name } = await c.req.json();
  if (!name) return c.text('Bad Request', 400);

  try {
    await ChannelService.remove(name);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
