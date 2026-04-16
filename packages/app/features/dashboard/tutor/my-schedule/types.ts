import type { CalendarWeekDay } from '@mezon-tutors/app';
import type { SessionStatus } from '@mezon-tutors/shared';

export type { SessionStatus };

export type ScheduleItem = {
  id: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  status: SessionStatus;
  title: string;
  studentName?: string;
  timeLabel: string;
};

export type MyScheduleCalendarMeta = {
  title: string;
  weekDays: CalendarWeekDay[];
  weekHours: number[];
  currentDayIndex?: number;
  currentHour?: number;
};
