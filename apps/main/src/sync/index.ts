import * as readline from 'readline';
import { Readable } from 'stream';
import type { estypes } from '@elastic/elasticsearch';
import * as pushover from '@repo/utilities/pushover';
import axios from 'axios';
import _ from 'lodash';
import { Duration, DateTime } from 'luxon';
import SyncService from '../database/lib/sync_results/sync_results_service.js';
import WorkerService from '../database/lib/worker/worker_service.js';
import * as elastic from '../elastic/index.js';
import * as queries from '../elastic/queries.js';
import logger from '../logger.js';
import { getMissingDates } from './date.js';

export default async function (channel: string, startingDate: string) {
  try {
    await sync(channel, startingDate);
  } catch (e) {
    logger.error(e);
    pushover.send({
      title: 'MChat - Sync Error',
      message: e instanceof Error ? e.message : (e as string),
    });
  }
}

async function sync(channel: string, startingDate: string): Promise<void> {
  logger.info('Starting log sync process...');
  const processStart = Date.now();

  let dates = getMissingDates(startingDate);
  dates = [startingDate]; // TODO: remove line and use getMissingDates when done testing

  if (dates.length === 0) {
    logger.info('No log dates to process. Completed.');
    pushover.send({
      title: 'MChat - Sync Results',
      message: 'No dates to process.',
    });
    return;
  }

  const workers = (await WorkerService.list()).map((x) => x.uri);
  if (workers.length === 0) {
    logger.info('No workers registered. Completed.');
    pushover.send({
      title: 'MChat - Sync Results',
      message: 'No workers registered to gather logs from.',
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
      // If there is an error in any of the cycles we break
      // so that the last completed sync date remains valid and
      // it will try again next sync
      break;
    }
  }

  pushover.send({
    title: 'MChat - Sync Error',
    message: `Complete`, // TODO: compile short message with stats of the sync run
  });
  logger.info('Log sync process completed.');
}

async function cycle(channel: string, date: string, workers: string[]) {
  logger.info(`Processing: ${date}`);
  const cycleStart = Date.now();
  const logs = await getLogs(channel, date, workers);

  // Strict logs have a TMI id and TMI timestamp in the raw message
  // Loose logs might only have a timestamp
  const strictLines: StrictLogLine[] = [];
  const looseLines: LogLine[] = [];

  logs.forEach((log) => {
    if (!log.data) return;
    const { strictLines: s, looseLines: l } = splitLogs(log.data);
    strictLines.push(...s);
    looseLines.push(...l);
  });

  const mergedStrictLines = mergeStrictLines(strictLines);
  const mergedLooseLines = mergeLooseLines(looseLines);
  const strictAdded = await processLines(channel, mergedStrictLines, queries.tmiStrictBulkSearch);
  const looseAdded = await processLines(channel, mergedLooseLines, queries.tmiLooseBulkSearch);

  const cycleTime = Duration.fromMillis(Date.now() - cycleStart).as('millisecond');
  const totalLines = mergedStrictLines.length + mergedLooseLines.length;
  const totalAdded = strictAdded.length + looseAdded.length;

  const result: SyncResult = {
    cycleTime,
    lines: {
      strict: mergedStrictLines.length,
      loose: mergedLooseLines.length,
      total: totalLines,
    },
    added: {
      strict: strictAdded.length,
      loose: looseAdded.length,
      total: totalAdded,
    },
    workers: logs.map((log) => {
      return {
        uri: log.uri,
        status: log.status,
        lines: log.data?.length || 0,
      };
    }),
  };

  console.log(result);
  await SyncService.add(channel, date, result);
}

async function getLogs(channel: string, date: string, worker: string[]) {
  const uris = worker.map((baseUrl) => `${baseUrl.replace(/\/$/, '')}/api/logs/${channel}/${date}`);

  const results: { uri: string; status: number; data?: LogLine[] }[] = [];

  await Promise.all(
    uris.map(async (uri) => {
      try {
        const response = await axios.get(uri, {
          responseType: 'stream',
          timeout: 5000,
        });
        const logs: LogLine[] = [];

        const rl = readline.createInterface({
          input: response.data as Readable,
        });

        for await (const line of rl) {
          const trimmed = line.trim();
          if (trimmed) logs.push(JSON.parse(trimmed));
        }

        results.push({ uri, data: logs, status: 200 });
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const status = e.response?.status || 500;
          results.push({ uri, status });
        } else {
          results.push({ uri, status: 500 });
        }
      }
    }),
  );

  return results;
}

function splitLogs(lines: LogLine[]) {
  const strictLines: StrictLogLine[] = [];
  const looseLines: LogLine[] = [];

  lines.forEach((line) => {
    const id = line.message.match(/[^-]id=([^;]+)/) || [];
    const ts = line.message.match(/tmi-sent-ts=([^;]+)/) || [];
    if (id[1] && ts[1]) {
      strictLines.push({
        ...line,
        tmiTs: ts[1],
        tmiId: id[1],
      });
    } else {
      looseLines.push(line);
    }
  });
  return { strictLines, looseLines };
}

function mergeStrictLines(lines: StrictLogLine[]): StrictLogLine[] {
  if (!lines.length) return [];
  return _.uniqBy(lines, (line) => line.tmiId + line.tmiTs);
}

function mergeLooseLines(lines: LogLine[]) {
  if (!lines.length) return [];

  // Group same messages together in smaller arrays mapped to the message
  const items: { [key: string]: LogLine[] } = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const message = items[line.message];
    if (!message) continue;
    if (message) {
      message.push(line);
    } else {
      items[line.message] = [line];
    }
  }

  const uniqueLines: LogLine[] = [];

  const seconds = 5;
  for (const item in items) {
    const itemArr = items[item];
    const unique = _.uniqWith(itemArr, (arrVal, othVal) => {
      const othTime = DateTime.fromISO(othVal.timestamp);
      const min = DateTime.fromISO(arrVal.timestamp).minus({ seconds });
      const max = DateTime.fromISO(arrVal.timestamp).plus({ seconds });
      return othTime > min && othTime < max;
    });
    uniqueLines.push(...unique);
  }

  return uniqueLines;
}

async function processLines<T extends LogLine | StrictLogLine>(
  channel: string,
  lines: T[],
  queryFn: (channel: string, messages: T[]) => Promise<estypes.MsearchResponseItem<unknown>[]>,
): Promise<T[]> {
  if (!lines.length) return [];

  const addedLines: T[] = [];
  const chunks = _.chunk(lines, 100);

  for (const chunk of chunks) {
    const toAdd: T[] = [];
    const results = await queryFn(channel, chunk);

    for (let i = 0; i < chunk.length; i++) {
      const line = chunk[i]!;
      const result = results[i]!;

      if (!('error' in result)) {
        if (result.status === 200) {
          const hits = result.hits?.total;
          if (typeof hits === 'number') {
            if (hits === 0) toAdd.push(line);
          } else {
            if (hits?.value === 0) toAdd.push(line);
          }
        } else if (result.status === 404) {
          toAdd.push(line);
        }
      }
    }

    if (toAdd.length) {
      addedLines.push(...toAdd);
      const messages = toAdd.map((x) => {
        return {
          channel,
          message: elastic.createTmiElasticBody(x),
        };
      });
      await elastic.bulkIndexTmi(messages);
    }
    // await ViewerService.store(chunkedLogs[i].map((x) => createElasticBody(x)));
  }
  return addedLines;
}
