import { Hono } from 'hono';
import { configManager } from '../../../app.js';
import { syncChannels } from '../../../twitch/channel_manager.js';
import { updateBaseUrl } from '../../../axios.js';
import logger from '../../../logger.js';

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
  const body: Record<ConfigKeys, any> = await c.req.json();
  if (!Object.keys(body).length) return c.text('Bad Request', 400);

  try {
    for (const key of Object.keys(body) as ConfigKeys[]) {
      await configManager.set(key, body[key]);
    }
    updateBaseUrl();
    syncChannels();
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
