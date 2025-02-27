import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import api from './api/index.js';

const app = new Hono();

if (process.env.NODE_ENV !== 'production') app.use(logger());
app.use(cors());

app.route('/api', api);

export default app;
