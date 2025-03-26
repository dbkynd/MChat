import { Hono } from 'hono';
import zod from 'zod';
import { configManager } from '../../../app.js';
import { updateBaseUrl } from '../../../axios.js';
import logger from '../../../logger.js';
import { syncChannels } from '../../../twitch/channel_manager.js';

const app = new Hono();

app.get('/', async (c) => {
  try {
    return c.json(configManager.getAll());
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.post('/', async (c) => {
  const schema = zod
    .object({
      main_node_url: zod.string().url(),
      channels: zod.array(zod.string()),
    })
    .partial();

  const result = schema.partial().safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const body: WorkerConfigUpdate = result.data;
  if (!Object.keys(body).length) return c.text('Bad Request', 400);

  try {
    for (const key of Object.keys(body) as ConfigKeys[]) {
      if (!body[key]) continue;
      if (!configManager.has(key)) continue;
      await configManager.set(key, body[key]);
    }
    if (body.main_node_url) updateBaseUrl();
    if (body.channels) syncChannels();
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
