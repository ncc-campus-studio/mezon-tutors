import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import type { CalendarWeekDay } from '../types';

export function formatCalendarTitle(title: string, locale: string): string {
  const date = dayjs.utc(title, 'MMMM YYYY', true).locale(locale);
  return date.isValid() ? date.format('MMMM YYYY') : title;
}

export function formatWeekDays(weekDays: CalendarWeekDay[], locale: string): CalendarWeekDay[] {
  return weekDays.map((day, index) => {
    let dayDate: dayjs.Dayjs;
    
    if (day.fullDate) {
      dayDate = dayjs(day.fullDate).locale(locale);
    } else {
      const now = dayjs();
      const dayOfWeek = now.day();
      const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = now.subtract(mondayOffset, 'day');
      dayDate = monday.add(index, 'day').locale(locale);
    }
    
    return {
      shortLabel: dayDate.format('ddd').toUpperCase(),
      dateLabel: day.dateLabel,
    };
  });
}
