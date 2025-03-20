/// <reference path="./src/status.d.ts" />
/// <reference path="./src/sync.d.ts" />
/// <reference path="./src/pushover.d.ts" />
/// <reference path="./src/elastic.d.ts" />

type ConfigKeys = 'main_node_url' | 'channels';
type WorkerConfig = Record<ConfigKeys, any>;
type WorkerConfigUpdate = Partial<WorkerConfig>;
