import WorkerService from '../database/lib/worker/worker_service.js';
import axios from 'axios';
import logger from '../logger.js';
import { Duration, DateTime } from 'luxon';
import _ from 'lodash';
import { getMissingDates } from './date.js';
import * as pushover from '@repo/utilities/pushover';

export default async function (channel: string, startingDate: string) {
  try {
    const result = await sync(channel, startingDate);
    if (result) logger.info(result);
  } catch (e) {
    logger.error(e);
    pushover.send({
      title: 'MChat - Sync Error',
      message: e instanceof Error ? e.message : (e as string),
    });
  }
}

async function sync(channel: string, startingDate: string): Promise<void | Result[]> {
  logger.info('Starting log sync process...');
  const processStart = Date.now();

  const dates = getMissingDates(startingDate);
  if (dates.length === 0) {
    logger.info('No log dates to process. Completed.');
    pushover.send({
      title: 'MChat - Sync Results',
      message: 'No dates to process.',
    });
    return;
  }

  const workers = await WorkerService.list();
  if (workers.length === 0) {
    logger.info('No workers registered. Completed.');
    pushover.send({
      title: 'MChat - Sync Results',
      message: 'No workers to gather logs from.',
    });
    return;
  }

  for (const date of dates) {
    try {
      await cycle(channel, date, workers);
    } catch (e) {
      logger.error(e);
      pushover.send({
        title: 'MChat - Sync Error',
        message: `Error syncing channel: ${channel} for the date: ${date}`,
      });
      // If there is an error in any of the cycles we break out
      // so that the last completed sync date remains valid and
      // it will try again next sync
      break;
    }
  }
}

async function cycle(channel: string, date: string, workers: string[]) {
  logger.info(`Processing: ${date}`);
}
