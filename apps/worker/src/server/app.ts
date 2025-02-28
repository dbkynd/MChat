import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { join } from 'path';
import { fileURLToPath } from 'url';
import api from './api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = new Hono();

if (process.env.NODE_ENV !== 'production') app.use(logger());
app.use(cors());

// app.route('/api', api);

// Serve the static files from your Vite dist
// e.g. "apps/worker/web/dist" path
const distPath = join(__dirname, '../..', 'web', 'dist');
console.log(distPath);
app.use('/test', serveStatic({ path: './test.html' }));

export default app;
