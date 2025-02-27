import uptime from '@repo/utilities/uptime';

export default async function (): Promise<Status> {
  return {
    module: 'worker',
    system_ts: Date.now(),
    uptime: uptime(),
  };
}
