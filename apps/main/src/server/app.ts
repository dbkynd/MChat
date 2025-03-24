import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { serveStatic } from '@hono/node-server/serve-static';
import { create, honoLogger } from '@repo/utilities/logger';
import { Hono } from 'hono';
import api from './api/index.js';

const app = new Hono();

const logger = create('main-web');
app.use(honoLogger(logger));

app.route('/api', api);

// Serve the main-web app
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const distPath = join(__dirname, '../..', 'web', 'dist');
const relPath = path.relative(process.cwd(), distPath);
app.use('/*', serveStatic({ root: relPath }));

export default app;
