import { estypes } from '@elastic/elasticsearch';
import { DateTime } from 'luxon';
import { getClient, getIndex } from './index.js';

export async function tmiStrictBulkSearch(channel: string, messages: StrictLogLine[]) {
  const searches: estypes.MsearchRequestItem[] = [];

  messages.forEach((message) => {
    const header: estypes.MsearchMultisearchHeader = { index: getIndex(channel) };
    const body: estypes.MsearchMultisearchBody = {
      query: {
        bool: {
          must: [
            { match: { 'id.keyword': message.tmiId } },
            { match: { '@timestamp': message.tmiTs } },
          ],
        },
      },
    };
    searches.push(header);
    searches.push(body);
  });

  return getClient()
    .msearch({ searches })
    .then((data) => data.responses);
}

export async function tmiLooseBulkSearch(channel: string, messages: LogLine[]) {
  const searches: estypes.MsearchRequestItem[] = [];
  messages.forEach((message) => {
    const header: estypes.MsearchMultisearchHeader = { index: getIndex(channel) };
    const body: estypes.MsearchMultisearchBody = {
      query: {
        bool: {
          filter: [
            {
              bool: {
                should: [{ match_phrase: { raw: message.message } }],
                minimum_should_match: 1,
              },
            },
            {
              range: {
                '@timestamp': {
                  gte: DateTime.fromISO(message.timestamp).minus({ seconds: 5 }).toString(),
                  lte: DateTime.fromISO(message.timestamp).plus({ seconds: 5 }).toString(),
                  format: 'strict_date_optional_time',
                },
              },
            },
          ],
        },
      },
    };
    searches.push(header);
    searches.push(body);
  });
  return getClient()
    .msearch({ searches })
    .then((data) => data.responses);
}
