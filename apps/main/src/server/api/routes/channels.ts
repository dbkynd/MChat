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
    return c.json(channels.map((channel) => ({ ...channel, _id: channel._id.toString() })));
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
    const newChannel = await ChannelService.add(name);
    await elastic.ensureIndexExists(name);
    await SyncService.pushChannels();
    return c.json(newChannel);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.put('/', async (c) => {
  const schema = zod.object({
    _id: zod.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
    name: zod.string().min(4).max(25),
    doPolling: zod.boolean(),
  });

  const result = schema.safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const doc = result.data as Channel;

  try {
    const updatedChannel = await ChannelService.update(doc);
    if (!updatedChannel) return c.text('Not Found', 404);
    await elastic.ensureIndexExists(updatedChannel.name);
    await SyncService.pushChannels();
    return c.json(updatedChannel);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    await ChannelService.remove(id);
    await SyncService.pushChannels();
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
