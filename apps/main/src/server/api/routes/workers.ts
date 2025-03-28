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
    const newWorker = await WorkerService.add(uri);
    return c.json(newWorker);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.put('/', async (c) => {
  const schema = zod.object({
    _id: zod.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
    uri: zod.string().url(),
    doPolling: zod.boolean(),
  });

  const result = schema.safeParse(await c.req.json());
  if (!result.success) return c.text('Bad Request', 400);

  const doc = result.data as Worker;

  try {
    const updatedWorker = await WorkerService.update(doc);
    return c.json(updatedWorker);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    await WorkerService.remove(id);
    return c.body(null, 204);
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
