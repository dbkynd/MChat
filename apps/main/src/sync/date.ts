import { DateTime } from 'luxon';

export function isValidDate(date: string): boolean {
  return DateTime.fromFormat(date, 'yyyy-MM-dd').isValid;
}

export function getMissingDates(startingDate: string): string[] {
  if (!isValidDate(startingDate)) throw new Error('Invalid Date');
  const startDate = DateTime.fromISO(startingDate).startOf('day');
  const yesterday = DateTime.now().minus({ days: 1 }).startOf('day');

  const dates: string[] = [];
  let currentDate = startDate;

  while (currentDate <= yesterday) {
    dates.push(currentDate.toISODate()!);
    currentDate = currentDate.plus({ days: 1 });
  }

  return dates;
}
