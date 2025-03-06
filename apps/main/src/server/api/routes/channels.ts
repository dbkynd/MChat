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

export default app;
