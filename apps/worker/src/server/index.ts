import logger from '../logger.js';
import app from './app.js';
import Hono from '@repo/utilities/hono';

export default Hono(app, logger);
