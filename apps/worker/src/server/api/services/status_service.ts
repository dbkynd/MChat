import uptime from '@repo/utilities/uptime';
import checkDiskSpace from 'check-disk-space';
import { dataDir } from '../../../config.js';
import { fetchChannels } from '../../../chat/channel_manager.js';
import path from 'path';
import fs from 'fs/promises';

export default async function (): Promise<Status> {
  return {
    module: 'worker',
    system_ts: Date.now(),
    uptime: uptime(),
    // @ts-ignore-next-line
    diskspace: await checkDiskSpace(dataDir),
    channels: await getChannelStats(),
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
