import { Hono } from 'hono';
import zod from 'zod';
import ChannelService from '../../../database/lib/channel/channel_service.js';
import * as elastic from '../../../elastic/index.js';
import logger from '../../../logger.js';
import SyncService from '../services/sync_service.js';

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
  const schema = zod.object({
    name: zod.string().min(4).max(25),
  });

  const result = schema.safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const { name } = result.data;

  try {
    await ChannelService.add(name);
    await elastic.ensureIndexExists(name);
    await SyncService.pushChannels();
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.put('/:name', async (c) => {
  const name = c.req.param('name');
  const body = await c.req.json();
  if (!name || !body.name) return c.text('Bad Request', 400);

  try {
    await ChannelService.update(name, body.name);
    await elastic.ensureIndexExists(body.name);
    await SyncService.pushChannels();
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/:name', async (c) => {
  const name = c.req.param('name');
  if (!name) return c.text('Bad Request', 400);

  try {
    await ChannelService.remove(name);
    await SyncService.pushChannels();
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
