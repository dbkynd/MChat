import WorkerService from '../database/lib/worker/worker_service.js';
import axios from 'axios';
import logger from '../logger.js';
import { Duration, DateTime } from 'luxon';
import _ from 'lodash';
import { getMissingDates } from './date.js';

let lastDate: string | undefined;

export default async function sync(channel: string, date: string) {
  logger.info('Starting log sync process...');
}
