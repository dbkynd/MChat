import logger from '../logger.js';
import app from './app.js';
import Hono from '@repo/utilities/hono';

const hono = Hono(app, logger);

export const start = hono.start;
export const stop = hono.stop;
