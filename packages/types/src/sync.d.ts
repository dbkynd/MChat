interface SyncResult {
  cycleTime: number;
  workers: WorkerStats[];
  lines: LineCount;
  added: LineCount;
}

interface LineCount {
  strict: number;
  loose: number;
  total: number;
}

interface WorkerStats {
  uri: string;
  status: number;
  lines: number;
}

interface LogLine {
  command: string;
  message: string;
  timestamp: string;
}

interface StrictLogLine extends LogLine {
  tmiTs: string;
  tmiId: string;
}

declare module 'tmi-parser' {
  import { ChatUserstate } from 'tmi.js';
  function msg(raw_message: string): ChatUserstate;
  export = { msg };
}

interface SyncStatsResponse extends SyncStats {
  date: string;
  createdAt: string;
}

interface SyncStatsRange {
  length: number;
  data: SyncStatsResponse[];
}
