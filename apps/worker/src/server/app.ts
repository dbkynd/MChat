import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import api from './api/index.js';
import { create, honoLogger } from '@repo/utilities/logger';

const app = new Hono();

const logger = create('worker-web');
app.use(honoLogger(logger));

app.route('/api', api);

// Serve the worker-web app
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const distPath = join(__dirname, '../..', 'web', 'dist');
const relPath = path.relative(process.cwd(), distPath);
app.use('/*', serveStatic({ root: relPath }));

export default app;
