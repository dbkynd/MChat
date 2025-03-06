import { Hono } from 'hono';
import logger from '../../logger.js';
import LogService from './services/log_service.js';
import StatusService from './services/status_service.js';
import { configManager } from '../../app.js';
import { syncChannels } from '../../chat/channel_manager.js';
import { updateBaseUrl } from '../../axios.js';

const app = new Hono();

app.get('/', async (c) => {
  return c.json({ message: 'Welcome to the API!' });
});

app.get('/ready', async (c) => {
  try {
    // Add any conditionals to trigger if the setup page should be shown to the user on load
    const isReady = Boolean(configManager.get('api_url'));
    return c.json({ ready: isReady });
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.get('/status', async (c) => {
  try {
    const status = await StatusService();
    return c.json(status);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.get('/logs/:channel/:date', async (c) => {
  const channel = c.req.param('channel');
  const date = c.req.param('date');

  if (!channel || !date) return c.text('Bad Request', 400);

  try {
    const chatFileName = await LogService.getFileName(channel, date);
    if (!chatFileName) return c.text('Not Found', 404);

    const data = await LogService.getFileBuffer(chatFileName);

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Encoding': 'gzip',
      },
    });
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.post('api_url', async (c) => {
  const { api_url } = await c.req.json();
  if (!api_url) return c.text('Bad Request', 400);
  try {
    configManager.set('api_url', api_url);
    updateBaseUrl();
    syncChannels();
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
