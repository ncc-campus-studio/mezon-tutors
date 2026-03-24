import { myLessonsService } from '../../../services/my-lessons.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { MyLessonsCalendarMeta, MyLessonsViewData, WeekDay } from './types';

dayjs.extend(utc);

function toCalendarDayIndex(day: number): number {
  return day === 0 ? 6 : day - 1;
}

function buildFallbackWeekDays(baseDate: Date): WeekDay[] {
  const base = dayjs.utc(baseDate);
  const dayOffset = toCalendarDayIndex(base.day());
  const monday = base.subtract(dayOffset, 'day');

  return Array.from({ length: 7 }, (_, index) => {
    const date = monday.add(index, 'day');
    const shortLabel = date.format('ddd');
    const dateLabel = date.format('DD');

    return {
      shortLabel,
      dateLabel,
    };
  });
}

function buildFallbackCalendar(): MyLessonsCalendarMeta {
  const now = dayjs.utc();
  const currentHour = now.hour();
  const startHour = Math.max(0, currentHour - 2);
  const endHour = Math.min(23, startHour + 4);

  return {
    title: now.format('MMMM YYYY'),
    weekDays: buildFallbackWeekDays(now.toDate()),
    weekHours: Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index),
    currentDayIndex: toCalendarDayIndex(now.day()),
    currentHour,
  };
}

export async function getMyLessonsData(): Promise<MyLessonsViewData> {
  return {
    calendar: buildFallbackCalendar(),
    calendarLessons: [],
    upcomingLessons: [],
    previousLessons: [],
    tutors: [],
  };
}

export async function getMyLessonsDataByMezonUserId(
  studentMezonUserId?: string
): Promise<MyLessonsViewData> {
  if (!studentMezonUserId) {
    return getMyLessonsData();
  }

  try {
    return await myLessonsService.getOverview(studentMezonUserId);
  } catch (error) {
    console.error('[my-lessons] Failed to load lessons from API', error);
    return getMyLessonsData();
  }
}
