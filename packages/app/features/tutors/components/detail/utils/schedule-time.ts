import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export type SchedulePeriod = 'morning' | 'afternoon' | 'evening';

export function parseTimeToHour(time: string): number {
  const parsed = dayjs(time, 'HH:mm');
  return parsed.hour() + parsed.minute() / 60;
}

export function getPeriodByTime(time: string): SchedulePeriod {
  const hour = dayjs(time, 'HH:mm').hour();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function isRoundHour(time: string): boolean {
  const [, minute] = time.split(':');
  return minute === '00';
}

