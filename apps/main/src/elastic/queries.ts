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
