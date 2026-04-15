import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import type { CalendarWeekDay } from '../types';

export function formatCalendarTitle(title: string, locale: string): string {
  const date = dayjs.utc(title, 'MMMM YYYY', true).locale(locale);
  return date.isValid() ? date.format('MMMM YYYY') : title;
}

export function formatWeekDays(weekDays: CalendarWeekDay[], locale: string): CalendarWeekDay[] {
  return weekDays.map((day) => {
    const dayDate = dayjs.utc(`2026-04-${day.dateLabel}`, 'YYYY-MM-DD').locale(locale);
    return {
      shortLabel: dayDate.format('ddd').toUpperCase(),
      dateLabel: day.dateLabel,
    };
  });
}
