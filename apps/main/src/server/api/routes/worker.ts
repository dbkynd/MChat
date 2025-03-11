import { Hono } from 'hono';
import WorkerService from '../../../database/lib/worker/worker_service.js';
import logger from '../../../logger.js';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const workers = await WorkerService.list();
    return c.json(workers);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.post('/', async (c) => {
  const { uri } = await c.req.json();
  if (!uri) return c.text('Bad Request', 400);

  try {
    await WorkerService.add(uri);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.put('/', async (c) => {
  const { uri, newUri } = await c.req.json();
  if (!uri || !newUri) return c.text('Bad Request', 400);

  try {
    await WorkerService.update(uri, newUri);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/', async (c) => {
  const { uri } = await c.req.json();
  if (!uri) return c.text('Bad Request', 400);

  try {
    await WorkerService.remove(uri);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
