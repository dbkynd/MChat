import Hono from '@repo/utilities/hono';
import logger from '../logger.js';
import app from './app.js';

export default Hono(app, logger);
