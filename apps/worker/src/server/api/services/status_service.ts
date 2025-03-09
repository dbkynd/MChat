import uptime from '@repo/utilities/uptime';
import checkDiskSpace from 'check-disk-space';
import { dataDir } from '../../../config.js';
import { getDatabaseChannels, getFetchSuccessful } from '../../../chat/channel_manager.js';
import path from 'path';
import fs from 'fs/promises';
import { configManager } from '../../../app.js';
import { getChannels, getConnection } from '../../../chat/twitch.js';

export default async function (): Promise<Status> {
  // @ts-expect-error-next-line
  const diskspace = (await checkDiskSpace(dataDir)) as DiskSpace;
  diskspace.diskPath = dataDir;

  return {
    module: 'worker',
    system_ts: Date.now(),
    uptime: uptime(),
    diskspace,
    channels: await getChannelStats(),
    config: configManager.getAll(),
    connections: {
      tmi: getConnection(),
      mainNode: getFetchSuccessful(),
    },
  };
}

async function getChannelStats(): Promise<ChannelStats[]> {
  const channelsInDatabase = new Set(getDatabaseChannels());
  const connectedChannels = new Set(getChannels());
  const folders = await fs.readdir(dataDir, { withFileTypes: true });
  const loggedChannels = new Set(
    folders.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name),
  );

  const allChannels = new Set([...channelsInDatabase, ...connectedChannels, ...loggedChannels]);

  const stats: ChannelStats[] = [];
  for (const channel of allChannels) {
    const location = path.join(dataDir, channel);
    const hasLogs = loggedChannels.has(channel);
    const size = hasLogs ? await dirSize(location) : 0;

    stats.push({
      name: channel,
      inDatabase: channelsInDatabase.has(channel),
      isConnected: connectedChannels.has(channel),
      hasLogs,
      size,
    });
  }

  return stats;
}

async function dirSize(directory: string) {
  const files = await fs.readdir(directory);
  const stats = files.map((file) => fs.stat(path.join(directory, file)));

  return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);
}
