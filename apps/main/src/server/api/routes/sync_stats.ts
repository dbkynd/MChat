import { Hono } from 'hono';
import zod from 'zod';
import SyncStatsService from '../../../database/lib/sync_stats/sync_stats_service.js';
import logger from '../../../logger.js';

const app = new Hono();

app.get('/', async (c) => {
  const schema = zod.object({
    channel: zod.string(),
    startDate: zod.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof String) {
        return new Date(arg as string);
      }
      return arg;
    }, zod.date()),
    endDate: zod.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof String) {
        return new Date(arg as string);
      }
      return arg;
    }, zod.date()),
  });

  const result = schema.safeParse(c.req.query());
  if (!result.success) return c.text('Bad Request', 400);

  const { channel, startDate, endDate } = result.data;

  try {
    const stats = await SyncStatsService.getRange(channel, startDate, endDate);
    return c.json({ length: stats.length, data: stats });
  } catch (e) {
    logger.error(e);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
