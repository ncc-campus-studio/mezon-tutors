import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { MyScheduleCalendarMeta } from './types';
import type { TutorAvailabilitySlotDto } from '@mezon-tutors/shared';
import { calculateDynamicTimelineHours } from '@mezon-tutors/shared';
import type { MyScheduleApiResponse } from '@mezon-tutors/app/services/my-schedule.service';

dayjs.extend(utc);
dayjs.extend(timezone);

export function buildMyScheduleCalendar(
  selectedDate: dayjs.Dayjs = dayjs(),
  lessons: MyScheduleApiResponse['lessons'] = [],
  availabilitySlots: TutorAvailabilitySlotDto[] = []
): MyScheduleCalendarMeta {
  const now = dayjs().tz('Asia/Ho_Chi_Minh');
  const targetDate = selectedDate.tz('Asia/Ho_Chi_Minh');
  const dayOfWeek = targetDate.day();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = targetDate.subtract(mondayOffset, 'day');

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = monday.add(index, 'day');
    return {
      shortLabel: date.format('ddd').toUpperCase(),
      dateLabel: date.format('DD'),
      fullDate: date.toDate(),
    };
  });

  const currentDayOfWeek = now.day();
  const currentMondayOffset = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const currentMonday = now.subtract(currentMondayOffset, 'day').startOf('day');
  const selectedMonday = monday.startOf('day');
  
  const isCurrentWeek = currentMonday.isSame(selectedMonday, 'day');
  const currentDayIndex = isCurrentWeek ? currentMondayOffset : undefined;

  const lessonsWithDates = lessons.map(lesson => {
    const dayDate = weekDays[lesson.dayIndex].fullDate;
    return {
      startsAt: dayjs(dayDate).hour(lesson.startHour).toDate(),
      endsAt: dayjs(dayDate).hour(lesson.endHour).toDate(),
    };
  });

  const weekHours = calculateDynamicTimelineHours(lessonsWithDates, availabilitySlots);

  return {
    title: targetDate.format('MMMM YYYY'),
    weekDays,
    weekHours,
    currentDayIndex,
    currentHour: isCurrentWeek ? now.hour() + now.minute() / 60 : undefined,
  };
}
