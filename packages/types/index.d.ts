/// <reference path="./src/status.d.ts" />
/// <reference path="./src/sync.d.ts" />
/// <reference path="./src/pushover.d.ts" />
/// <reference path="./src/elastic.d.ts" />
/// <reference path="./src/channels.d.ts" />
/// <reference path="./src/workers.d.ts" />

interface WorkerConfig {
  main_node_url: string;
  channels: string[];
}

type ConfigKeys = keyof WorkerConfig;
type WorkerConfigUpdate = Partial<WorkerConfig>;
