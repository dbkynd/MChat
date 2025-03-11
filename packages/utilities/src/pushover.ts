import PushoverNotifications from 'pushover-notifications';
import type { Logger } from 'winston';

let client: PushoverNotifications;

export function init(logger: Logger, message?: string) {
  if (!process.env.PUSHOVER_USER || !process.env.PUSHOVER_TOKEN) {
    logger.warn('Missing Pushover credentials. Unable to send push notifications.');
    return;
  }

  client = new PushoverNotifications({
    user: process.env.PUSHOVER_USER,
    token: process.env.PUSHOVER_TOKEN,
  });

  if (process.env.NODE_ENV === 'production' && message) send({ message });
  logger.info('Pushover ready to send notifications');
}

// https://pushover.net/api
export function send(data: PushoverData): void {
  if (!client) return;
  client.send({
    sound: 'gamelan',
    ...data,
  });
}
