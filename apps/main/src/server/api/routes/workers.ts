import { Hono } from 'hono';
import zod from 'zod';
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
  const schema = zod.object({
    uri: zod.string().url(),
  });

  const result = schema.safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const { uri } = result.data;

  try {
    await WorkerService.add(uri);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.put('/', async (c) => {
  const schema = zod.object({
    uri: zod.string().url(),
    newUri: zod.string().url(),
  });

  const result = schema.safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const { uri, newUri } = result.data;

  try {
    await WorkerService.update(uri, newUri);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/', async (c) => {
  const schema = zod.object({
    uri: zod.string().url(),
  });

  const result = schema.safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const { uri } = result.data;

  try {
    await WorkerService.remove(uri);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.post('/:name/polling', async (c) => {
  const schema = zod.object({
    doPolling: zod.boolean(),
  });

  const result = schema.safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const name = c.req.param('name');
  const { doPolling } = result.data;

  try {
    await WorkerService.setPolling(name, doPolling);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
