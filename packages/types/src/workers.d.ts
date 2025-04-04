interface WorkerConfig {
  main_node_url: string;
  channels: string[];
}

type WorkerConfigKeys = keyof WorkerConfig;
type WorkerConfigUpdate = Partial<WorkerConfig>;

interface WorkerStatus {
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
  stats: { timestamp: number; count: number }[];
}

interface DiskSpace {
  diskPath: string;
  free: number;
  size: number;
}
