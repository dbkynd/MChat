declare module 'pushover-notifications' {
  export = PushoverNotifications;
}

declare class PushoverNotifications {
  constructor(config: PushoverConstructorConfig);
  send(data: PushoverData): void;
}

interface PushoverConstructorConfig {
  user: string;
  token: string;
}

interface PushoverData {
  message: string;
  title?: string;
  priority?: -2 | -1 | 0 | 1 | 2;
  html?: 1;
  sound?: string;
}
