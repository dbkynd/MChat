import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import api from './api/index.js';
import { create, honoLogger } from '@repo/utilities/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = new Hono();

const logger = create('main-web');
app.use(honoLogger(logger));
app.use(cors());

app.route('/api', api);

const distPath = join(__dirname, '../..', 'web', 'dist');
const relPath = path.relative(process.cwd(), distPath);
app.use('/*', serveStatic({ root: relPath }));

export default app;
