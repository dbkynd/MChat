import { Hono } from 'hono';
import logger from '../../logger.js';
import LogService from './services/log_service.js';
import StatusService from './services/status_service.js';

const app = new Hono();

app.get('/', async (c) => {
  return c.json({ message: 'Welcome to the API!' });
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

export default app;
