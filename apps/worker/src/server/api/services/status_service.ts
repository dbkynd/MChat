import uptime from '@repo/utilities/uptime';
import checkDiskSpace from 'check-disk-space';
import { dataDir } from '../../../config.js';
import { fetchChannels } from '../../../chat/channel_manager.js';
import path from 'path';
import fs from 'fs/promises';
import { configManager } from '../../../app.js';

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
    apiUrl: configManager.get('api_url'),
  };
}

async function getChannelStats(): Promise<ChannelStats[]> {
  const channels = await fetchChannels();
  const stats: ChannelStats[] = [];
  for (const channel of channels) {
    const location = path.join(dataDir, channel);
    stats.push({
      name: channel,
      size: await dirSize(location),
    });
  }
  return stats;
}

async function dirSize(directory: string) {
  const files = await fs.readdir(directory);
  const stats = files.map((file) => fs.stat(path.join(directory, file)));

  return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);
}
