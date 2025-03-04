interface Status {
  module: 'worker';
  system_ts: number;
  uptime: string;
  diskspace: DiskSpace;
  channels: ChannelStats[];
}

interface ChannelStats {
  name: string;
  size: number;
}

interface DiskSpace {
  diskPath: string;
  free: number;
  size: number;
}
