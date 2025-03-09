/// <reference path="../index.d.ts" />

interface Status {
  module: 'worker';
  system_ts: number;
  uptime: string;
  diskspace: DiskSpace;
  channels: ChannelStats[];
  config: WorkerConfig;
  connections: {
    tmi: boolean;
    mainNode: boolean;
  };
}

interface ChannelStats {
  name: string;
  inDatabase: boolean;
  isConnected: boolean;
  hasLogs: boolean;
  size: number;
}

interface DiskSpace {
  diskPath: string;
  free: number;
  size: number;
}
